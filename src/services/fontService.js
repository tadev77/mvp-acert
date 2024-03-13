import FontRepository from '../repositories/FontRepository.js';
import APIError from '../utils/APIError.js';

const fr = new FontRepository();

export default {
  async getFontPath(inputFontName) {
    const fontMap = new Map();

    return fr.getFonts(inputFontName).then(fontPathList => {
      fontPathList.forEach(fontPath => {
        const splittedFontPaths = fontPath.split('/');
        const sysFileName = splittedFontPaths[splittedFontPaths.length - 1];
        const sysFilePath = splittedFontPaths.join('/');
        fontMap.set(sysFileName, sysFilePath);
      });

      const exactMatch = 
        fontMap.get(`${inputFontName}.ttf`) ||
        fontMap.get(`${inputFontName}.otf`) ||
        fontMap.get(`${inputFontName}-Regular.otf`) ||
        fontMap.get(`${inputFontName}-Regular.otf`);
      
      return exactMatch ?? [...fontMap.values()][0];
    }).catch(err => {
      throw new APIError(`Sorry! We couldn't find the font ${inputFontName} in our system!`, 404, err);
    });
  },

  async registerFont(fontFile) {
    if (!fontFile) {
      return new APIError('No file uploaded', 400);
    }
    fr.storeFont(fontFile);
  }
}