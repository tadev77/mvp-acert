import SvgReader from "../repositories/SvgReaderRepository.js";

const keyRegExp = /\[.+\]/g;
const svgr = new SvgReader(keyRegExp);

const replaceKeys = svgr.replaceKeys;
const extractKeys = svgr.extractKeys;
const getFontFamilies = svgr.getFontFamilies;

export {
	replaceKeys,
	extractKeys,
	getFontFamilies
}