import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

// #region Big data.
const notFoundBase64 =
// #endregion

const notFoundObj = {
	data: Buffer.from(notFoundBase64, 'base64'),
	end: 'image/png',
};

function getRandomImageURL(endpoint: string): Promise<string> {
	return new Promise((resolve, reject) => {
		axios
			.get(`https://nekos.life/api/v2/img/${endpoint}`)
			.then((res) => {
				resolve(res.data.url);
			})
			.catch(() => resolve(null));
	});
}

function getNekoImage(): Promise<{ data: Buffer; end: string }> {
	return new Promise((resolve, reject) => {
		getRandomImageURL('neko')
			.then((url) => {
				axios
					.get(url, { responseType: 'arraybuffer' })
					.then((res) => {
						resolve({
							data: res.data,
							end: res.headers['content-type'],
						});
					})
					.catch(() => resolve(notFoundObj));
			})
			.catch(() => resolve(notFoundObj));
	});
}

app.get('/', (req, res) => res.status(200).send('Hello World!')).get(
	'/neko',
	async (req, res) => {
		try {
			const image = await getNekoImage();
			if (image) {
				res.set({
					'content-type': image.end,
					'cache-control':
						'max-age=0, no-cache, no-store, must-revalidate',
				});
				return res.send(image.data);
			}
			throw new Error('Cannot get image.');
		} catch {
			res.send({ code: -1, message: 'error' });
		}
	},
);