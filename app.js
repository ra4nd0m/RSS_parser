const rss_parse = require('./src/RSS_parse');
const rss_send = require('./src/RSS_send');
const rss_cache_data = require('./src/RSS_cache_data');
const cron = require('node-cron');
const fs = require('fs');

const sources = JSON.parse(fs.readFileSync('sites.json','utf-8'));
const schedule = process.env.SCHEDULE;

console.log("Started!\nCurrent schedule: ",schedule)


cron.schedule(schedule,async () => {
    for (const source of sources) {
        const data = await rss_parse.getRSS(source.url);
        if (data != 'error') {
            let data_to_send = await rss_cache_data.cache_data(data, source.site);
            if (data_to_send.length != 0) {
               rss_send.sendRSS(data);
            }
        }
    }
});




