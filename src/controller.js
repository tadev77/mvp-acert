import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileUploader, uploadErrorHandler } from './services/upload.js';
import { replaceKeys } from './services/keysReplacer.js';
import { generatePDF } from './services/export.js';

const app = express();
const multipartKey = 'certificate';

app.use(bodyParser.json());

app.get('/ping', (_req, res) => {
	res.status(200).send("I'm alive!");
});

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

	fs.readFile(`/tmp/uploads/${templateId}.svg`, (err, file) => {
		if(err) {
			return res.status(500).json({ message: 'File not found!' });
		}

		const certificateData = replaceKeys(file, req.body);
		generatePDF(certificateData).then(certificatePath => {
			return res.status(200).sendFile(certificatePath);
		}).catch(reason => {
			if (reason.cause) {
				res.status(500).json({ message: reason.cause });
			} else {
				res.status(500).json({ message: reason });
			}
		})
	});
});

app.use((err, _req, res, next) => {
	uploadErrorHandler(err, res, multipartKey);
	res.status(500).json(err.message);

	next(err)
});

export default app;