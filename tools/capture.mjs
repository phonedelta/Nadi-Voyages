import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/result',{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});await page.screenshot({path:'docs/result/home-desktop.png',fullPage:true});await page.screenshot({path:'docs/result/home-viewport.png'});
await page.goto('https://anfaltravel.ma/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'اختيار اللغة'}).click();await page.getByRole('menuitem',{name:'Français'}).click();await page.addStyleTag({content:'.anf-reveal{opacity:1!important;transform:none!important}'});await page.screenshot({path:'docs/reference/home-viewport.png'});
await browser.close();
