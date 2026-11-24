import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const records=JSON.parse(await fs.readFile('docs/reference/inventory.json','utf8'));
const browser=await chromium.launch();const results=[];
for(const lang of ['English','العربية']){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();await page.goto('https://anfaltravel.ma/');await page.getByRole('button',{name:'اختيار اللغة'}).click();await page.getByRole('menuitem',{name:lang,exact:true}).click();const code=lang==='English'?'en':'ar';await expect(page.locator('html')).toHaveAttribute('lang',code);
 for(const {route} of records){await page.goto('https://anfaltravel.ma'+route,{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toBeVisible();await expect(page.locator('html')).toHaveAttribute('lang',code);results.push({route,lang:code,width:1440,title:await page.locator('h1').innerText(),text:await page.locator('body').innerText()});if(['/','/voyages/istanbul','/contact'].includes(route)){await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});await page.screenshot({path:`docs/reference/${route.replaceAll('/','_')||'home'}-${code}-1440.png`,fullPage:true})}}
 await page.setViewportSize({width:390,height:844});for(const route of ['/','/voyages/istanbul','/contact']){await page.goto('https://anfaltravel.ma'+route);await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});await page.screenshot({path:`docs/reference/${route.replaceAll('/','_')||'home'}-${code}-390.png`,fullPage:true});results.push({route,lang:code,width:390,title:await page.locator('h1').innerText()})}await context.close();console.log('Reference language inspected',code);
}
await fs.writeFile('docs/reference/languages-browser.json',JSON.stringify(results,null,2));await browser.close();
