import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileUploader, uploadErrorHandler } from './upload.js';
import { replaceKeys } from './keysReplacer.js';

const app = express();
const multipartKey = 'certificate';

app.use(bodyParser.json()) // for parsing application/json
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
	const newKey = new Date();

	fs.readFile(`/tmp/uploads/${templateId}.svg`, (err, file) => {
		if(err) {
			return res.status(500).json({ message: 'File not found!' });
		}
		const certificateData = replaceKeys(file, req.body);
		const certificatePath = `/tmp/certificates/${newKey}.svg`;
		fs.writeFileSync(certificatePath, certificateData, 'utf-8');

		res.status(200).sendFile(certificatePath);
	});
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