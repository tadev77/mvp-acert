// I'll use db implementation in the future. This obviously only works if app is constantly up
export class CertificateParametersRepository {

  parameters = {};

  storeParameters(parameters, templateId) {
    this.parameters[templateId] = parameters.sort();
  }

  validateParameters(templateId, parameters) {
    if(this.parameters[templateId] === undefined) {
      throw Error(`Nothing stored at the templateId ${templateId}`);
    }
    parameters = parameters.sort();
    return parameters.toString() === this.parameters[templateId].toString();
  }
}