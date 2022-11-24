import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

function getRandomImageURL(): Promise<string> {
	return new Promise((resolve) => {
		axios
			.get('https://nekos.life/api/v2/img/neko')
			.then((res) => {
				resolve(res.data.url);
			})
			.catch((e) => {
				console.log(e.message);
				resolve('');
			});
	});
}

function getRandomImage(): Promise<{ data: Buffer; end: string }> {
	return new Promise((resolve) => {
		getRandomImageURL().then((url) => {
			axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
				resolve({
					data: res.data,
					end: res.headers['content-type'],
				});
			});
		});
	});
}

app.get('/', (req, res) => res.status(200).send('Hello World!')).get(
	'/api/neko',
	async (req, res) => {
		const image = await getRandomImage();
		res.set({
			'content-type': image.end,
			'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
		});
		res.send(image.data);
	},
);
