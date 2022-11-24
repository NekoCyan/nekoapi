import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
function getRandomImageURL() {
    return new Promise((resolve, reject) => {
        axios
            .get('https://nekos.life/api/v2/img/neko')
            .then((res) => {
            resolve(res.data.url);
        })
            .catch(() => {
            const defaultURL = 'https://media.discordapp.net/attachments/878276279105884210/1045378789905010758/99083012_p7.jpg';
            resolve(defaultURL);
        });
    });
}
function getRandomImage() {
    return new Promise((resolve, reject) => {
        getRandomImageURL()
            .then((url) => {
            axios
                .get(url, { responseType: 'arraybuffer' })
                .then((res) => {
                resolve({
                    data: res.data,
                    end: res.headers['content-type'],
                });
            })
                .catch(reject);
        })
            .catch((e) => {
            resolve(null);
        });
    });
}
app.get('/', (req, res) => res.status(200).send('Hello World!')).get('/api/neko', async (req, res) => {
    try {
        const image = await getRandomImage();
        if (image) {
            res.set({
                'content-type': image.end,
                'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
            });
            return res.send(image.data);
        }
        throw new Error('Cannot get image.');
    }
    catch {
        res.send({ code: -1, message: 'error' });
    }
});
//# sourceMappingURL=index.js.map