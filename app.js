const rss_parse = require('./src/RSS_parse');
const rss_send = require('./src/RSS_send');
const rss_cache_data = require('./src/RSS_cache_data');
const express = require('express');
const cron = require('node-cron');
const fs = require('fs');


const app = express();

app.use(express.json());

var sources = JSON.parse(fs.readFileSync('sites.json', 'utf-8'));
const schedule = process.env.SCHEDULE;
let cache_accsess_times = 0;
let jsons_sent = 0;

app.get("/sites", (req, res) => {
    res.send(sources);
});

app.get("/status", (req, res) => {
    res.send({
        'schedule': schedule,
        'cache_accsess_times': cache_accsess_times,
        'jsons_sent': jsons_sent
    });
})

app.post("/sites", (req, res) => {
    let new_sites = req.body;
    let sources_updated = [... new Set([...sources, ...new_sites])];
    sources = sources_updated;
    res.send('OK!');
})

app.delete("/sites", (req, res) => {
    const sites_to_delete = req.body
    for (const site of sites_to_delete) {
        const index = sources.map(e => e.site).indexOf(site.site);
        if (index > -1) {
            sources.splice(index, 1);
            res.send("OK!");
        } else {
            res.header(404);
            res.send("NOT FOUND!");
        }
    }
})

app.listen(3000);

console.log("Started!\nCurrent schedule: ", schedule)


cron.schedule(schedule, async () => {
    for (const source of sources) {
        const data = await rss_parse.getRSS(source.url);
        if (data != 'error') {
            let data_to_send = await rss_cache_data.cache_data(data, source.site);
            cache_accsess_times++;
            if (data_to_send.length != 0) {
                rss_send.sendRSS(data);
                jsons_sent++;
            }
        }
    }
});




