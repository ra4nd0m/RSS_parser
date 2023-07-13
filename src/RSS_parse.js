let Parser = require('rss-parser');
let parser = new Parser();

async function getRSS(url) {
    let feed;
    //try using http method if fails run puppeteer
    try {
        feed = await parser.parseURL(url);
    } catch (err) {
        feed = await getRSS_Stealth(url);
    } //parse recived feed 
    return await parseRSS(feed);
};
//site scrapping using puppeteer
async function getRSS_Stealth(url) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);
    const string = await page.evaluate(() => {
        return document.body.innerText;
    });
    await browser.close();
    return await parser.parseString(string);
}
//parse data using rss-parser
async function parseRSS(feed) {
    let obj = [];
    console.log(feed.title);
    const today = new Date().toISOString().split('T')[0];
    //make sure the date of articles is today
    const todayArticles = feed.items.filter(item => item.isoDate.startsWith(today));
    todayArticles.forEach(item => {
        obj.push({
            'title': item.title, 'link': item.link
        });

    });
    return obj;
}

module.exports = { getRSS };
