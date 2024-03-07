import mimeTypes from 'mime-types';
import fs from 'fs';

import FileStorageRepository from '../repositories/FileStorageRepository.js';
import { CertificateParametersRepository } from '../repositories/CertificateParametersRepository.js';

import { extractKeys } from './svgReader.js';
import sanitizeData from './contentSanitizer.js';

const fsr = new FileStorageRepository();
const cpr = new CertificateParametersRepository();
const uploadErrorHandler = fsr.uploadErrorHandler;
const templatesPath = '/tmp/uploads'

const fileUploader = fsr.getFileUploader(
  (file) => {
    const mimeType = mimeTypes.lookup(file.originalname);
    if(!mimeType === 'image/svg+xml') {
      throw new Error('Not a SVG file.');
    }

    return true;
  }
);

const postUploadSteps = async (templateId) => {
  fs.readFile(`${templatesPath}/${templateId}.svg`, (err, fileContent) => {
    if (err) {
      throw err;
    }

    const sanitizedContent = sanitizeData(fileContent);
    cpr.storeParameters(extractKeys(fileContent), templateId);

    fs.writeFileSync(`${templatesPath}/${templateId}.svg`, sanitizedContent);
  });
}

const getFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${templatesPath}/${filename}.svg`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export { 
    fileUploader,
    postUploadSteps,
    getFile,
    uploadErrorHandler
};