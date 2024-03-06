import mimeTypes from 'mime-types';
import fs from 'fs';

import FileStorageRepository from '../repositories/FileStorageRepository.js';
import { CertificateParametersRepository } from '../repositories/CertificateParametersRepository.js';

import { extractKeys } from './svgReader.js';
import sanitizeData from './contentSanitizer.js';
import crypto from 'crypto';

const fsr = new FileStorageRepository();
const cpr = new CertificateParametersRepository();
const uploadErrorHandler = fsr.uploadErrorHandler;
const templatesPath = '/tmp/uploads'

const fileUploader = fsr.getFileUploader(
  (req, file) => {
    const mimeType = mimeTypes.lookup(file.originalname);
    if(!mimeType === 'image/svg+xml') {
      throw new Error('Not a SVG file.');
    }

    const templateId = crypto.randomUUID();
    req.templateId = templateId;
    return true;

  },
  (_req, file, filename) => {
    fs.readFile(file.originalname, (err, fileContent) => {
      if (err) {
        throw err;
      }
  
      const sanitizedContent = sanitizeData(fileContent);
      cpr.storeParameters(extractKeys(fileContent), filename);
  
      fs.writeFileSync(`${templatesPath}/${filename}.svg`, sanitizedContent);
    });
  }
);

export { 
    fileUploader,
    uploadErrorHandler
};