import multer from 'multer';
import mimeTypes from 'mime-types';
import crypto from 'node:crypto';

let createdTemplateId;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, '/tmp/uploads/');
  },
  filename: (req, _file, cb) => {
    createdTemplateId = crypto.randomUUID();
    req.templateId = createdTemplateId;
    cb(null, `${createdTemplateId}.svg`); 
  }
});

const fileUploader = multer({ 
  storage,
  fileFilter: (_req, file, cb) => {
    try {
      const mimeType = mimeTypes.lookup(file.originalname);
      if (mimeType === 'image/svg+xml') {
        cb(null, true);
      } else {
        throw new Error('Not a SVG file.');
      }
    } catch (error) {
      cb(error.message);
    }
  }
});

function uploadErrorHandler(err, res, expectedName) {
	if (err instanceof multer.MulterError) {
		res.status(400).send(`Error Uploading Files: ${err.message}. Please, upload a file on a multipart field named "${expectedName}"`);
	}
}

export { 
    fileUploader,
    uploadErrorHandler
};