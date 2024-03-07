import SvgReader from "../repositories/SvgReaderRepository.js";

const svgr = new SvgReader();

export default svgr.sanitizeData(
  svgr.enforceCenteredText,
  svgr.inheritChildrenStyle
);