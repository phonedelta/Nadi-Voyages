import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const base = process.argv[2];
if (!base?.startsWith('https://')) throw new Error('Pass the HTTPS deployment URL.');
const { routes } = JSON.parse(await fs.readFile('docs/result/verification.json', 'utf8'));
const report = { base, started: new Date().toISOString(), checks: [], errors: [], screenshots: [], cdnImageTransforms: [] };
const check = (value, label) => { if (!value) throw new Error(label); report.checks.push(label); };
const sha = value => createHash('sha256').update(value).digest('hex');
const browser = await chromium.launch();
try {
  const decoder = await browser.newPage();
  async function verifyFiles(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await verifyFiles(file);
      else if (entry.name !== '.htaccess') {
        const relative = path.relative('dist', file).split(path.sep).join('/');
        const response = await fetch(`${base}/${relative}`);
        check(response.ok, `HTTPS asset ${relative}`);
        const local = await fs.readFile(file);
        const remote = Buffer.from(await response.arrayBuffer());
        if (sha(local) === sha(remote)) check(true, `SHA256 ${relative}`);
        else if (/\.(png|jpe?g|webp)$/i.test(relative)) {
          check(response.headers.get('content-type')?.startsWith('image/'), `CDN image ${relative}`);
          if (/\.png$/i.test(relative)) {
            const dimensions = await decoder.evaluate(async ({local,remote}) => {
              const images = await Promise.all([local,remote].map(bytes => createImageBitmap(new Blob([new Uint8Array(bytes)]))));
              return images.map(image => ({width:image.width,height:image.height}));
            }, {local:[...local],remote:[...remote]});
            const [original, optimized] = dimensions;
            check(Math.abs(original.width/original.height-optimized.width/optimized.height)<0.01 && optimized.width>=Math.min(original.width,1600)*0.9, `CDN PNG dimensions ${relative}`);
          }
          report.cdnImageTransforms.push(relative);
        } else check(false, `SHA256 ${relative}`);
      }
    }
  }
  await verifyFiles('dist');
  await decoder.close();
  console.log('Production assets verified; CDN image transformations recorded.');
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    check(response.ok(), `Direct route ${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
    await page.waitForFunction(() => [...document.images].every(image => image.complete));
    check(await page.locator('img').evaluateAll(images => images.every(image => image.naturalWidth > 0)), `Images ${route}`);
    check((await page.title()).includes('NADI'), `Agency identity ${route}`);
  }
  console.log(`Verified ${routes.length} direct routes, including SPA refreshes.`);
  for (const language of ['fr', 'en', 'ar']) {
    await page.evaluate(language => localStorage.setItem('nadi-language', language), language);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${language}/${width} no overflow`);
      if (width === 390) {
        await page.locator('.menu-toggle').click();
        await expect(page.locator('.mobile-menu')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.mobile-menu')).toHaveCount(0);
        report.checks.push(`${language} mobile menu`);
      }
      const screenshot = `docs/result/deployment-${language}-${width}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      report.screenshots.push(screenshot);
    }
  }
  check(report.errors.length === 0, 'No browser errors');
  report.status = 'passed';
  console.log(`PASS: ${report.checks.length} deployment checks.`);
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  process.exitCode = 1;
  console.error(error);
} finally {
  report.finished = new Date().toISOString();
  await fs.writeFile('docs/result/deployment-verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
