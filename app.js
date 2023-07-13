const rss_parser = require('./src/RSS_parse');
const rss_send = require('./src/RSS_send');
const rss_cache_data = require('./src/RSS_cache_data');
const express = require('express');
const cron = require('node-cron');
const fs = require('fs');


const app = express();

app.use(express.json());
//empty array for data
var sources = [];
//try getting sites from sites.json
try {
    sources = JSON.parse(fs.readFileSync('sites.json', 'utf-8'))
} catch {
    console.log("Warning!\nSites.json not found!\nMake sure to add sites manually via the endpoint!");
}
//schedule to parse
const schedule = process.env.SCHEDULE;
//info variables for endpoints
let cache_accsess_times = 0;
let jsons_sent = 0;

//endpoint routes start here
app.get("/sites", (req, res) => {
    //send a list of sites to parse
    res.send(sources);
});

app.get("/status", (req, res) => {
    res.send({
        //send status info
        'schedule': schedule,
        'cache_accsess_times': cache_accsess_times,
        'jsons_sent': jsons_sent
    });
})

app.post("/sites", (req, res) => {
    //recive new sites to parse and add them to sources while ensuring no dupes
    let new_sites = req.body;
    let sources_updated = [... new Set([...sources, ...new_sites])];
    sources = sources_updated;
    res.send('OK!');
})

app.delete("/sites", (req, res) => {
    //delete recived site entry from sources
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
//endpoint routes end here
app.listen(3000);

console.log("Started!\nCurrent schedule: ", schedule)

//task for a parser
cron.schedule(schedule, async () => {
    for (const source of sources) {
        //try getting data
        const data = await rss_parser.getRSS(source.url);
        if (data != 'error') {
            //cache data and check for dupes
            let data_to_send = await rss_cache_data.cache_data(data, source.site);
            cache_accsess_times++;
            //send data
            if (data_to_send.length != 0) {
                rss_send.sendRSS(data);
                jsons_sent++;
            }
        }
    }
});




