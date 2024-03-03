import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import fs from 'fs';

export default class PdfExportRepository {
  exportPdf = (height, width, certificatePath, certificateData) => new Promise ((resolve, reject) => {
    const stream = fs.createWriteStream(certificatePath);
    // PDFDocument uses pt instead of px. pt = px * .75
		const doc = new PDFDocument({ size: [width * .75, height * .75] });
    
		doc.pipe(stream);
		SVGtoPDF(doc, certificateData);
		doc.end();
    
		stream.on('finish', () => {
			console.log('SVG to PDF conversion done!');
			resolve(certificatePath);
		});
		
		stream.on('error', (err) => {
      reject(err.message);
		});
  })
}