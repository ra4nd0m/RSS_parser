const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const db_url = process.env.DB_URL;
const db = process.env.DB;

async function cache_data(data,source_site) {
    console.log(db_url,db);
    const client = new MongoClient(db_url);
    await client.connect().then(() => {
        console.log('Connected!');
    });
    let obj = [];
    const collection = client.db(db).collection(source_site);
    for (const item of data) {
        const result = await collection.find({ link: item.link }).toArray();
        console.log(result);
        if (result.length === 0) {
            await collection.insertOne(item);
            obj.push(item);
        }
    }
    await client.close();
    return obj;
}

module.exports = { cache_data };