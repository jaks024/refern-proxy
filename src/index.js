const dotenv = require('dotenv');
const express = require('express');
const { isbot } = require('isbot');
const httpProxy = require('http-proxy');

dotenv.config({ path: './.env.development.local' });

const proxy = httpProxy.createProxyServer();

console.log('host', process.env.PROXY_HOST_URL)
console.log('mirror', process.env.PROXY_MIRROR_URL)
console.log('client', process.env.PROXY_CLIENT_URL)

const app = express();
const port = process.env.PORT;

// const server = http.createServer(function (req, res) {
//     if (isbot(req.headers['user-agent'])) {
//         console.log('is bot')
//         proxy.web(req, res, {
//             target: process.env.PROXY_MIRROR_URL,
//             changeOrigin: true,
//         }, (e) => console.log('is bot error', e));
//     } else {
//         console.log('is not bot')
//         proxy.web(req, res, {
//             target: process.env.PROXY_CLIENT_URL,
//             // changeOrigin: true,
//         }, (e) => console.log('is not bot error', e));
//     }
// })

// console.log('listening on port ', port)
// server.listen(port)

const forward = async (req, res, next) => {
    // console.log('request', req)
    console.log('user agent', req.headers['user-agent'])
    if (isbot(req.headers['user-agent'])) {
        console.log('is bot')
        proxy.web(req, res, {
            target: process.env.PROXY_MIRROR_URL,
            changeOrigin: true,
        }, next);
    } else {
        console.log('is not bot')
        proxy.web(req, res, {
            target: process.env.PROXY_CLIENT_URL,
            changeOrigin: true,
        }, next);
    }
};

app.use('/', forward);
app.use('/robots.txt', forward);

app.listen(port, () => {
  console.log(`refern proxy listening on port ${port}`)
});
