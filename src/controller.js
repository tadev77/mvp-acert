import express from 'express';
import { fileUploader, uploadErrorHandler } from './upload.js';

const app = express();
const multipartKey = 'certificate';

app.post('/templates', fileUploader.single(`${multipartKey}`), (req, res) => {
	const file = req.file;

	if (!file) {
		return res.status(400).send(`No file found.`);
	}

	res.json({
		templateId: req.templateId,
		message: 'File uploaded successfully!'
	});
});

app.post('/certificates/:templateId', (req, res) => {
	const { templateId } = req.params;
	res.status(200).json({templateId});
});

app.use((err, _req, res, next) => {
	uploadErrorHandler(err, res, multipartKey);
	res.status(500).json(err.message);

	next(err)
});

app.get('/ping', (_req, res) => {
	res.status(200).send("I'm alive!");
});

export default app;