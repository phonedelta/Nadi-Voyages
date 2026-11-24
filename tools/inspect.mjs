import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('https://anfaltravel.ma/',{waitUntil:'networkidle'});
console.log('INITIAL',await page.locator('body').innerText());
console.log('LANG',await page.locator('button,select').evaluateAll(es=>es.map(e=>({text:e.textContent,aria:e.getAttribute('aria-label'),tag:e.tagName}))));
await page.screenshot({path:'docs/reference/home-ar-desktop.png',fullPage:true});
await page.getByRole('button',{name:'اختيار اللغة'}).click();
const fr=page.getByRole('menuitem',{name:'Français'});
if(await fr.count()) await fr.first().click();
await page.waitForTimeout(500);
await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});
const links=await page.locator('a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));
console.log('LINKS',links);
await fs.writeFile('docs/reference/links.json',JSON.stringify(links,null,2));
await fs.writeFile('docs/reference/home-text.txt',await page.locator('body').innerText());
await page.screenshot({path:'docs/reference/home-fr-desktop.png',fullPage:true});
await fs.writeFile('docs/reference/home-dom.html',await page.content());
const routes=[...new Set([...links.map(x=>x.href),'/voyages/bali','/voyages/maldives'].filter(x=>x?.startsWith('/')&&!x.startsWith('/#')))];
const records=[];
for(const route of routes){
 try {await page.goto('https://anfaltravel.ma'+route,{waitUntil:'networkidle'});await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});const text=await page.locator('body').innerText();const slug=route.replaceAll('/','_')||'home';await fs.writeFile(`docs/reference/${slug}.txt`,text);await page.screenshot({path:`docs/reference/${slug}-desktop.png`,fullPage:true});records.push({route,title:await page.title(),text,links:await page.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href')))});console.log('ROUTE',route,text.slice(0,180));}catch(e){records.push({route,error:String(e)})}
}
await fs.writeFile('docs/reference/inventory.json',JSON.stringify(records,null,2));
await page.goto('https://anfaltravel.ma/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Choisir la langue'}).click();await page.getByRole('menuitem',{name:'English',exact:true}).click();await fs.writeFile('docs/reference/home-en.txt',await page.locator('body').innerText());await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});await page.screenshot({path:'docs/reference/home-en-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.goto('https://anfaltravel.ma/',{waitUntil:'networkidle'});await page.screenshot({path:'docs/reference/home-mobile.png',fullPage:true});
await browser.close();
