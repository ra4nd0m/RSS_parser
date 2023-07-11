let Parser = require('rss-parser');
let parser = new Parser();

async function getRSS(url) {
    let obj = [];
    let feed;
    try {
        feed = await parser.parseURL(url);
    } catch (err) {
        console.error(err);
        return 'error';
    }
    console.log(feed.title);
    feed.items.forEach(item => {
        console.log(item);
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
    console.log(obj);
    return obj;
};

module.exports = { getRSS };