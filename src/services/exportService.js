import PdfExportRepository from '../repositories/PdfExportRepository.js';
import SvgReader from '../repositories/SvgReaderRepository.js';

const svgr = new SvgReader();
const pdfer = new PdfExportRepository();

function generatePDF (certificateData) {
  return new Promise((resolve, reject) => {
		const fileName = crypto.randomUUID();
		const certificatePath = `/tmp/certificates/${fileName}.pdf`;
		const {width, height} = svgr.getFileDimensions(certificateData);
		pdfer.exportPdf(height, width, certificatePath, certificateData).then(_ => {
			resolve(certificatePath)
		}).catch(reason => {
			reject(reason);
		})
  });
}

export {
  generatePDF
}