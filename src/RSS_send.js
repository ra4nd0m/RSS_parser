require('dotenv').config();
const post_url = process.env.POST_URL;

//send data using fetch API
async function sendRSS(data) {
    fetch(post_url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.text())
        .then(text => console.log(text))
        .catch((err) => console.error(err));
};

module.exports = { sendRSS };
