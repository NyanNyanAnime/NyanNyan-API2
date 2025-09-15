require("dotenv").config();
const axios = require("axios");
const https = require("https");

// Agent yang completely bypass SSL verification
const agent = new https.Agent({
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined // Disable hostname verification
});

async function fetchHtml(url) {
    const response = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                "AppleWebKit/537.36 (KHTML, like Gecko) " +
                "Chrome/140.0.0.0 Safari/537.36",
        },
        proxy: {
            host: process.env.PROXY_HOST,
            port: parseInt(process.env.PROXY_PORT),
            auth: {
                username: process.env.PROXY_USERNAME,
                password: process.env.PROXY_PASSWORD,
            },
        },
        httpsAgent: agent,
    });
    return response.data;
}

module.exports = fetchHtml;
