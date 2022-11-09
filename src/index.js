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
        res.redirect(data.url);
    } catch {
        res.redirect('image default url');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});