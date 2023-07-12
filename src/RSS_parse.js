let Parser = require('rss-parser');
let parser = new Parser();

async function getRSS(url) {
    let feed;
    try {
        feed = await parser.parseURL(url);
    } catch (err) {
        feed = await getRSS_Stealth(url);
    }
    return await parseRSS(feed);
};

async function getRSS_Stealth(url){
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page =await browser.newPage();
    await page.goto(url);
    const string = await page.evaluate(()=>{
        return document.body.innerText;
    });
    await browser.close();
    return await parser.parseString(string);
}

async function parseRSS(feed){
    let obj = [];
    console.log(feed.title);
    feed.items.forEach(item => {
        item.content.replace('&amp;', '&');
        let date = new Date(item.pubDate);
        let date_now = new Date();
        // date.setHours(0, 0, 0, 0);
        if ((date.getDay() == date_now.getDay() && (date.getMonth() == date_now.getMonth()))) {
            obj.push({
                'title': item.title, 'link': item.link,
                'content': item.content,
                'date': date
            });
        };
    });
    return obj;
}

module.exports = { getRSS };