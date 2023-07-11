const rss_parse = require('./src/RSS_parse');
const rss_send = require('./src/RSS_send');
const rss_cache_data = require('./src/RSS_cache_data');
const cron = require('node-cron');
const fs = require('fs');

const sources = JSON.parse(fs.readFileSync('sites.json','utf-8'));





(async () => {
    for (const source of sources) {
        const data = await rss_parse.getRSS(source.url);
        if (data != 'error') {
            let data_to_send = await rss_cache_data.cache_data(data, source.site);
            if (data_to_send.length != 0) {
               // fs.writeFileSync('./test.json', JSON.stringify(data_to_send));
               rss_send.sendRSS(data);
            }
        }
    }
})();




/*
cron.schedule('* * * * * *', async () => {
    const data = await rss_parse.getRSS();
    if (data != 'error') {
       // rss_send.sendRSS(data);
       fs.writeFileSync('./test.json',JSON.stringify(data));
    }
}
)
*/