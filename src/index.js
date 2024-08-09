const dotenv = require('dotenv');
const express = require('express');
const { isbot } = require('isbot');
const httpProxy = require('http-proxy');
const fs = require('node:fs')

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
app.use('/sitemap.txt', async (req, res, next) => {
    console.log('req robot')
    const robot = fs.readFileSync('./sitemap.txt', {encoding: 'utf-8'}) 
    res.send(robot);
})
app.use('/robots.txt', async (req, res, next) => {
    console.log('req robot')
    res.send('user-agent: *\ndisallow:\nsitemap: https://my.refern.app/sitemap.txt');
})
app.use('/ads.txt', async (req, res, next) => {
    console.log('req ads txt')
    res.send('google.com, pub-1547030288955263, DIRECT, f08c47fec0942fa0');
})

app.use('/', forward);


app.listen(port, () => {
  console.log(`refern proxy listening on port ${port}`)
});
