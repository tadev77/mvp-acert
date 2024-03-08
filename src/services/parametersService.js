import { CertificateParametersRepository } from "../repositories/CertificateParametersRepository.js";
import APIError from "../utils/APIError.js";

const cpr = new CertificateParametersRepository();

async function storeParameters(parameters, templateId, fontFamilies) {
  return cpr.storeTemplate(parameters, templateId, fontFamilies);
}

async function validateParameters(requestParameters, templateId) {

  try {
    const { parameters: storedParameters } = await cpr.getTemplate(templateId);

    if(storedParameters === undefined) {
      throw APIError(`Nothing stored at the templateId ${templateId}`, 404);
    }

    requestParameters.sort();
    storedParameters.sort();
    const isValid = requestParameters.toString() === storedParameters.toString();
    if(!isValid) {
      throw new APIError(`Parameters don't match! Expected: ${storedParameters.toString()} - Got: ${requestParameters.toString()}`, 400)
    }
  } catch (error) {
    throw new APIError('Error validating parameters:', 500);
  }
}

export {
  storeParameters,
  validateParameters
}