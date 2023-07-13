const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const db_url = process.env.DB_URL;
const db = process.env.DB;

async function cache_data(data,source_site) {
    //connect to mongodb
    console.log(db_url,db);
    const client = new MongoClient(db_url);
    await client.connect().then(() => {
        console.log('Connected!');
    });
    let obj = [];
    //get the requierd collection
    const collection = client.db(db).collection(source_site);
    //check if there any duplicates
    for (const item of data) {
        const result = await collection.find({ link: item.link }).toArray();
        //if no dupes found => this is new article so we push it in obj to return
        if (result.length === 0) {
            console.log("New article: ",item.title);
            await collection.insertOne(item);
            obj.push(item);
        }else{
            //else do nothing
            console.log("FOUND! ",item.title);
        }
    }
    //close connection and return data
    await client.close();
    return obj;
}

module.exports = { cache_data };
