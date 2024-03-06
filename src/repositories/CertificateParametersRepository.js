import CertificateTemplate from "../models/certificateTemplate.js";
// I'll use db implementation in the future. This obviously only works if app is constantly up
export class CertificateParametersRepository {

  async storeParameters(parameters, templateId) {
    try {
      const newCertificateTemplate = new CertificateTemplate({
        _id: templateId,
        parameters: [...parameters],
      });
  
      const savedCertificateTemplate = await newCertificateTemplate.save();
      console.log('Certificate template saved successfully:', savedCertificateTemplate);
    } catch (error) {
      console.error('Error saving certificate template:', error);
    }
  }

  async validateParameters(parameters, templateId) {

    try {
      const template = await CertificateTemplate.findById(templateId).exec();

      if(template === undefined) {
        throw Error(`Nothing stored at the templateId ${templateId}`);
      }

      parameters = parameters.sort();
      const isValid = parameters.toString() === template.parameters.toString();
      if(!isValid) {
        throw Error(`Parameters don't match! Expected: ${this.parameters[templateId].toString()} - Got: ${parameters.toString()}`)
      }
    } catch (error) {
      throw Error('Error saving certificate template:', error);
    }
  }
}