require('dotenv').config();
const post_url = process.env.POST_URL;


async function sendRSS(data) {
    try {
        fetch(post_url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.text()).then(text => console.log(text));
    } catch (err) {
        console.error(err);;
    }
};

module.exports = { sendRSS };
