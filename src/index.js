const express = require('express');
const axios = require('axios');
const app = express();
const parser = require('body-parser');
const port = process.env.PORT || 3000;

const apiNeko = "https://nekos.life/api/v2/img/neko";

app.use(parser.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/neko', async (req, res) => {
    try {
        const { data } = await axios.get(apiNeko);
        const res_ = await axios.get(data.url, {
            responseType: 'arraybuffer'
        });
        const ImageData = Buffer.from(res_.data, 'binary');
        res.writeHead(200, {
            'Content-Type': data.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
            'Content-Length': ImageData.length,
        });
        res.end(ImageData);
    } catch {
        res.redirect('image default url');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});