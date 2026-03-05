# RSS Parser

A lightweight, self-hosted RSS feed aggregator that runs on a configurable cron schedule. It fetches articles from multiple RSS sources, deduplicates them against a MongoDB cache, and forwards only **new** articles to any webhook endpoint of your choice.

---

## Features

- **Scheduled polling** – fetch all configured feeds on any cron interval (e.g. every minute, every hour).
- **Dual-fetch strategy** – tries a standard HTTP request first; falls back to a headless Puppeteer browser for feeds that require JavaScript rendering or block plain HTTP clients.
- **Deduplication** – every article link is stored in MongoDB, so the same article is never forwarded twice.
- **Webhook forwarding** – new articles are POSTed as JSON to a configurable endpoint (e.g. a Telegram bot, a Slack webhook, a home-automation service, etc.).
- **REST API** – manage feed sources and inspect runtime status without restarting the service.
- **Docker-ready** – ships with a `Dockerfile` and `compose.yaml` for one-command deployment alongside MongoDB.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Node.js](https://nodejs.org/) |
| Web framework | [Express](https://expressjs.com/) |
| RSS parsing | [rss-parser](https://github.com/rbren/rss-parser) |
| Headless browser fallback | [Puppeteer](https://pptr.dev/) |
| Task scheduling | [node-cron](https://github.com/node-cron/node-cron) |
| Cache / deduplication DB | [MongoDB](https://www.mongodb.com/) (official Node.js driver) |
| Configuration | [dotenv](https://github.com/motdotla/dotenv) |
| Containerisation | Docker + Docker Compose |

---

## How It Works

```
cron tick
   └─► for each configured feed URL
          ├─► fetch RSS (HTTP)  ──fail──► fetch RSS (Puppeteer headless)
          └─► filter articles published today
                 └─► check MongoDB cache for duplicates
                        └─► insert new articles → POST to POST_URL
```

Each RSS source gets its own MongoDB collection (named after the site). The service exposes an HTTP API on port **3000** so you can add/remove feeds and check runtime metrics at any time.

---

## Configuration

Create a `.env` file in the project root (or set environment variables directly):

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB` | MongoDB database name | `rss_data` |
| `POST_URL` | Webhook URL to POST new articles to | `http://localhost:8000/hook` |
| `SCHEDULE` | Cron expression for the polling interval | `*/5 * * * *` (every 5 min) |

---

## Getting Started

### Local

```bash
# 1. Clone the repository
git clone https://github.com/ra4nd0m/RSS_parser.git
cd RSS_parser

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env   # then edit .env with your values

# 4. (Optional) pre-load feed sources
cp sites.json.example sites.json

# 5. Start
node app.js
```

### Docker Compose

```bash
# Review / update environment values in compose.yaml, then:
docker compose up --build
```

The compose file starts the application container and a MongoDB 6 container. The app will be available on `http://localhost:3000`.

> **Note:** after the first start, add your RSS feeds via the `/sites` endpoint (see below).

---

## API Reference

### `GET /status`

Returns runtime metrics.

**Response**
```json
{
  "schedule": "*/5 * * * *",
  "cache_accsess_times": 42,
  "jsons_sent": 7
}
```

---

### `GET /sites`

Returns the list of currently configured RSS sources.

**Response**
```json
[
  { "site": "The Wall Street Journal", "url": "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml" }
]
```

---

### `POST /sites`

Adds one or more RSS sources. Duplicates are ignored.

**Request body**
```json
[
  { "site": "Site Name", "url": "https://example.com/feed.rss" }
]
```

**Response:** `OK!`

---

### `DELETE /sites`

Removes one or more RSS sources.

**Request body** – same format as `POST /sites`.

**Response:** `OK!` or `NOT FOUND!`

---

## Project Structure

```
RSS_parser/
├── app.js                  # Entry point – Express server + cron scheduler
├── src/
│   ├── RSS_parse.js        # Fetches and parses RSS feeds (with Puppeteer fallback)
│   ├── RSS_send.js         # POSTs new articles to the configured webhook
│   └── RSS_cache_data.js   # MongoDB deduplication logic
├── sites.json.example      # Example feed list
├── Dockerfile
├── compose.yaml
└── package.json
```

---

## License

[MIT](LICENSE)

