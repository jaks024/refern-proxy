const  dotenv = require('dotenv');
const express = require('express');
const { isbot } = require('isbot');
const proxy = require('http-proxy');

dotenv.config({ path: './.env.development.local' });

proxyServer = proxy.createProxyServer({
    host: process.env.PROXY_HOST_URL,
});

const app = express();
const port = process.env.PORT;

app.use('/', async (req, res, next) => {
    if (isbot(req.headers['user-agent'])) {
        proxyServer.web(req, res, {
            target: process.env.PROXY_MIRROR_URL,
        }, next);
    } else {
        proxyServer.web(req, res, {
            target: process.env.PROXY_CLIENT_URL
        }, next);
    }
});


app.listen(port, () => {
  console.log(`refern proxy listening on port ${port}`)
})

module.exports = app
