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
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="10000px" height="10000px">
<foreignObject xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="10000" height="10000">
<img src="data:${data.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png'};base64,${ImageData.toString('base64')}">
</foreignObject>
</svg>`);
    } catch {
        res.redirect('image default url');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});