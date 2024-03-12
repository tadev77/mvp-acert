import { getFile } from '../services/uploadService.js';
import APIError from '../utils/APIError.js';

import { replaceKeys } from '../services/svgReader.js';
import { generatePDF } from '../services/exportService.js';
import { validateParameters } from '../services/parametersService.js';

const createCertificate = async (req, res) => {
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
};

export {
  createCertificate,
}