import express from 'express';
import bodyParser from 'body-parser';
import APIError from './utils/APIError.js';

import { fileUploader, postUploadSteps, getFile, uploadErrorHandler } from './services/uploadService.js';
import { replaceKeys } from './services/svgReader.js';
import { generatePDF } from './services/exportService.js';
import { validateParameters } from './services/parametersService.js';

const app = express();
const multipartKey = 'certificate';

app.use(bodyParser.json());

app.get('/ping', (_req, res) => {
	res.status(200).json({ message: "I'm alive!" });
});

app.post('/templates', fileUploader.single(`${multipartKey}`), async (req, res) => {
	const {file, templateId } = req;

	if (!file) {
		return res.json(new APIError(`Sorry! We failed to store the template.`, 500));
	}

	await postUploadSteps(req.templateId);
	res.json({
		templateId,
		message: 'Template uploaded successfully!'
	});
});

app.post('/certificates/:templateId', async (req, res) => {
	const { params: { templateId }, body: substitutions } = req;

	getFile(templateId).then(async (file) => {
		const { replacedSvg , verifiedKeys } = replaceKeys(file, substitutions);
		await validateParameters(verifiedKeys, templateId);
		return generatePDF(replacedSvg, templateId);
	}).then(certificatePath => {
		return res.status(200).sendFile(certificatePath);
	}).catch(err => {
		if(err instanceof APIError) {
			res.json(err);
		} else {
			res.status(500).json({ message: err.message });
		}
	});
});

app.use((err, _req, res, next) => {
	uploadErrorHandler(err, res, multipartKey);
	res.status(500).json(err.message);

	next(err)
});

export default app;