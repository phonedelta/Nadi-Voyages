import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const inventory=JSON.parse(await fs.readFile('docs/reference/inventory.json','utf8'));
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const results=[];
await page.goto('https://anfaltravel.ma/');await page.getByRole('button',{name:'اختيار اللغة'}).click();await page.getByRole('menuitem',{name:'Français'}).click();
for(const {route} of inventory){await page.goto('https://anfaltravel.ma'+route,{waitUntil:'networkidle'});await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});await page.screenshot({path:`docs/reference/${route.replaceAll('/','_')||'home'}-mobile-fr.png`,fullPage:true});results.push({route,width:390,title:await page.locator('h1').innerText()});}
await page.goto('https://anfaltravel.ma/');await page.getByRole('tab',{name:'Hôtels',exact:true}).click();results.push({interaction:'hotel tab',fields:await page.locator('main label').allTextContents()});await page.getByRole('tab',{name:'Vols',exact:true}).click();results.push({interaction:'flight tab',fields:await page.locator('main label').allTextContents()});
await page.goto('https://anfaltravel.ma/voyages');await page.getByRole('button',{name:'Europe',exact:true}).click();results.push({interaction:'Europe filter',body:await page.locator('body').innerText()});
await page.goto('https://anfaltravel.ma/contact');results.push({interaction:'contact',submitDisabled:await page.getByRole('button',{name:'Envoyer ma demande'}).isDisabled()});
await page.goto('https://anfaltravel.ma/');await page.getByRole('button',{name:'Ouvrir le menu'}).click();await page.screenshot({path:'docs/reference/mobile-menu-fr.png'});results.push({interaction:'mobile menu',visibleText:await page.locator('body').innerText()});
await fs.writeFile('docs/reference/extra-inspection.json',JSON.stringify(results,null,2));await browser.close();console.log('Reference mobile pages and interactions inspected:',results.length);
