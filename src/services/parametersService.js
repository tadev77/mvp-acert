import { CertificateParametersRepository } from "../repositories/CertificateParametersRepository.js";

const cpr = new CertificateParametersRepository();

async function storeParameters(parameters, templateId) {
  return cpr.storeParameters(parameters, templateId);
}

async function validateParameters(requestParameters, templateId) {

  try {
    const storedParameters = await cpr.getParameters(templateId);

    if(storedParameters === undefined) {
      throw Error(`Nothing stored at the templateId ${templateId}`);
    }

    requestParameters = requestParameters.sort();
    const isValid = requestParameters.toString() === storedParameters.toString();
    if(!isValid) {
      throw Error(`Parameters don't match! Expected: ${storedParameters.toString()} - Got: ${requestParameters.toString()}`)
    }
  } catch (error) {
    throw Error('Error validating parameters:', error);
  }
}

export {
  storeParameters,
  validateParameters
}