# How to run
1. Clone repository
2. Run npm i
3. Set up .env with DB_URL - your mongoDB url, DB - your db for the app, POST_URL - reciving endpoint, SCHEDULE - parsing schedule in cron syntax
4. Launch with node app.js
5. Examples of feeds are in sites.json
# Endpoints
1. /status method: get, body: {}
    returns json with app status: schedule, cache_accsess_times, and jsons_sent
2. /sites method: get, body: {} returns json with sites to parse following format of the example in sites.json
3. /sites method: post, body: {[
    {
        "site":"Site Name",
        "url":"Site Url"
    }]} recives json with new site to parse to add to list. Duplicates are filtered out. If success, returns OK!.
4. /sites method: delete, body: the same as in POST. Allows to delete sites from list. If success, returns OK!.
# How to run in docker 
1. Make sure to set up env variables in docker-compose.yaml and Dockerfile
2. Cd into directory
3. Use docker-compose up
4. Do not forget to add sites via endpoint
