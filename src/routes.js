import express from 'express';
const router = express.Router();
import { fileUploader } from './services/uploadService.js';

const multipartKey = 'certificate';

import { createCertificate } from './controllers/certificateController.js';
import { createCertificateTemplate } from './controllers/certificateTemplateController.js';
import { registerFont } from './controllers/fontsController.js';

router.post('/templates', fileUploader.single(`${multipartKey}`), createCertificateTemplate);
router.post('/templates/:templateId/certificates', createCertificate);
router.post('/fonts', registerFont);

router.get('/ping', (_req, res) => {
	res.status(200).json({ message: "I'm alive!" });
});

export default router;