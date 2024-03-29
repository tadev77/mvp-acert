import CertificateTemplate from "../models/certificateTemplate.js";
export class CertificateParametersRepository {

  async storeTemplate(parameters, templateId, fontFamilies) {
    try {
      const newCertificateTemplate = new CertificateTemplate({
        _id: templateId,
        parameters: [...parameters],
        fonts: fontFamilies
      });
  
      const savedCertificateTemplate = await newCertificateTemplate.save();
      console.log('Certificate template saved successfully:', savedCertificateTemplate);
    } catch (error) {
      console.error('Error saving certificate template:', error);
    }
  }

  async getTemplate(templateId) {
    try {
      const template = await CertificateTemplate.findById(templateId).exec();
      return template;
    } catch (error) {
      throw Error('Error saving certificate template:', error);
    }
  }
}