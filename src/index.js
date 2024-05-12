const dotenv = require('dotenv');
const express = require('express');
const { isbot } = require('isbot');
const proxy = require('http-proxy');

dotenv.config({ path: './.env.development.local' });

proxyServer = proxy.createProxyServer({
    host: process.env.PROXY_HOST_URL,
});

console.log('host', process.env.PROXY_HOST_URL)
console.log('mirror', process.env.PROXY_MIRROR_URL)
console.log('client', process.env.PROXY_CLIENT_URL)

const app = express();
const port = process.env.PORT;

app.use('/', async (req, res, next) => {
    console.log('request', req)
    console.log('user agent', req.headers['user-agent'])
    if (isbot(req.headers['user-agent'])) {
        console.log('is bot')
        proxyServer.web(req, res, {
            target: process.env.PROXY_MIRROR_URL,
        }, next);
    } else {
        console.log('is not bot')
        proxyServer.web(req, res, {
            target: process.env.PROXY_CLIENT_URL
        }, next);
    }
});


app.listen(port, () => {
  console.log(`refern proxy listening on port ${port}`)
});
