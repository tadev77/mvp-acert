import multer from 'multer';
import mimeTypes from 'mime-types';
import fs from 'fs';
import { extractKeys } from './svgReader.js';
import sanitizeData from './contentSanitizer.js'

let createdTemplateId;

function postCreationSteps(file) {
  fs.readFile(file.originalname, (err, fileContent) => {
    if (err) {
      throw err;
    }

    const sanitizedContent = sanitizeData(fileContent);
    global.cpr.storeParameters(extractKeys(fileContent), createdTemplateId);
    fs.writeFileSync(file.originalname, sanitizedContent);
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, '/tmp/uploads/');
  },
  filename: (req, _file, cb) => {
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
        createdTemplateId = crypto.randomUUID();
        postCreationSteps(file);
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