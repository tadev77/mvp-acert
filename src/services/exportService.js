import PdfExportRepository from '../repositories/PdfExportRepository.js';
import SvgReader from '../repositories/SvgReaderRepository.js';
import crypto from 'crypto';
import APIError from '../utils/APIError.js';

const svgr = new SvgReader();
const pdfer = new PdfExportRepository();

function generatePDF (certificateData) {
  return new Promise((resolve, reject) => {
		const fileName = crypto.randomUUID();
		const certificatePath = `/tmp/certificates/${fileName}.pdf`;
		const {width, height} = svgr.getFileDimensions(certificateData);
		pdfer.exportPdf(height, width, certificatePath, certificateData).then(_ => {
			resolve(certificatePath);
		}).catch(reason => {
			reject(new APIError(`Something went wrong exporting the PDF!`, 500, reason));
		})
  });
}

export {
  generatePDF
}