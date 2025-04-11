import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer';

const url = process.argv[2];
const domain = url.replace("https://", "").replace("http://", "")
const bearer = process.argv[3];

const user = {
    name: 'Test user',
    email: 'test.user@example.com',
    picture: 'sample_picture_url',
    admin: true
}

const chrome = await chromeLauncher.launch(/*{chromeFlags: ['--headless']}*/);
const resp = await fetch(`http://localhost:${chrome.port}/json/version`);
const {webSocketDebuggerUrl} = await resp.json();
const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
await browser.setCookie({name: 'profile', value: JSON.stringify(user), domain }, {name: 'token', value: bearer, domain})
const page = await browser.newPage()


const options = {logLevel: 'info', output: 'html', onlyCategories: ['accessibility']};
const runnerResult = await lighthouse(url, options, undefined, page);

// `.report` is the HTML report as a string
const reportHtml = runnerResult.report;
fs.writeFileSync('lhreport.html', reportHtml);

// `.lhr` is the Lighthouse Result as a JS object
console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);

await browser.disconnect();
chrome.kill();