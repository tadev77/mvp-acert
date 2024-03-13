import express from 'express';
import fileUpload from 'express-fileupload';
import { fileUploader } from './services/uploadService.js';

const router = express.Router();
const multipartKey = 'certificate';

import { createCertificate } from './controllers/certificateController.js';
import { createCertificateTemplate } from './controllers/certificateTemplateController.js';
import { registerFont } from './controllers/fontsController.js';

router.post('/templates', fileUploader.single(`${multipartKey}`), createCertificateTemplate);
router.post('/templates/:templateId/certificates', createCertificate);
router.post('/fonts', fileUpload(), registerFont);

router.get('/ping', (_req, res) => {
	res.status(200).json({ message: "I'm alive!" });
});

export default router;