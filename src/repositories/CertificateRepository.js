import Certificate from "../models/certificate.js";
export class CertificateRepository {

  async storeCertificate(fields, filename) {
    try {
      const newCertificate = new Certificate({
        fields,
        filename,
      });
  
      const savedCertificate = await newCertificate.save();
      console.log('Certificate saved successfully:', savedCertificate);
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  }

  async getCertificate(filename) {
    try {
      const certificate = await Certificate.find({ filename }).exec();
      return certificate;
    } catch (error) {
      throw Error('Error saving certificate:', error);
    }
  }
}