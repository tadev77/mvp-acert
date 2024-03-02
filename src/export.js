import fs from 'fs';
import crypto from 'node:crypto';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import * as cheerio from 'cheerio';

const fileName = crypto.randomUUID();

function generatePDF (certificateData) {
  return new Promise((resolve, reject) => {
		const certificatePath = `/tmp/certificates/${fileName}.pdf`;
    const $ = cheerio.load(certificateData, { xmlMode: true });
		const width = $('svg').attr('width');
		const height = $('svg').attr('height');
		const stream = fs.createWriteStream(certificatePath);
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
  });
}

export {
  generatePDF
}