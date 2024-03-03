// I'll use db implementation in the future. This obviously only works if app is constantly up
export class CertificateParametersRepository {

  parameters = {};

  storeParameters(parameters, templateId) {
    this.parameters[templateId] = parameters.sort();
  }

  validateParameters(parameters, templateId) {
    if(this.parameters[templateId] === undefined) {
      throw Error(`Nothing stored at the templateId ${templateId}`);
    }
    parameters = parameters.sort();
    const isValid = parameters.toString() === this.parameters[templateId].toString();
    if(!isValid) {
      throw Error(`Parameters don't match! Expected: ${this.parameters[templateId].toString()} - Got: ${parameters.toString()}`)
    }
  }
}