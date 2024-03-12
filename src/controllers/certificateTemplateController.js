import APIError from '../utils/APIError.js';

import { postUploadSteps } from '../services/uploadService.js';

const createCertificateTemplate = async (req, res) => {
	const {file, templateId } = req;

	if (!file) {
		return res.json(new APIError(`Sorry! We failed to store the template.`, 500));
	}

	await postUploadSteps(req.templateId);
	res.json({
		templateId,
		message: 'Template uploaded successfully!'
	});
}

export {
  createCertificateTemplate,
}