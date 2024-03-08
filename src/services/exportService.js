import PdfExportRepository from '../repositories/PdfExportRepository.js';
import SvgReader from '../repositories/SvgReaderRepository.js';
import crypto from 'crypto';
import APIError from '../utils/APIError.js';
import { CertificateParametersRepository } from '../repositories/CertificateParametersRepository.js';

const svgr = new SvgReader();
const pdfer = new PdfExportRepository();
const cpr = new CertificateParametersRepository();

const rootPath = `/tmp/certificates/`;

function generatePDF (certificateData, templateId) {
  return new Promise(async (resolve, reject) => {
		const fileName = crypto.randomUUID();
		const certificatePath = `${rootPath}${fileName}.pdf`;
		const { fonts } = await cpr.getTemplate(templateId);
		const {width, height} = svgr.getFileDimensions(certificateData);
		pdfer.exportPdf(height, width, certificatePath, certificateData, fonts).then(_ => {
			resolve(certificatePath);
		}).catch(reason => {
			reject(new APIError(`Something went wrong exporting the PDF!`, 500, reason));
		})
  });
}

export {
  generatePDF
}