import { exec } from 'child_process';
import he from 'he';

import APIError from '../utils/APIError.js';

export default class FontRepository {
  getFontPath(inputFontName) {
    return new Promise((resolve, reject) => {
      const decodedName = he.decode(inputFontName);
      const fontName = decodedName.replace(/[^a-zA-Z0-9\-_]/g, '');
      const fontMap = new Map();

      // if you use windows, screw you
      exec(`fc-list | grep -i ${fontName} | awk -F: '{print $1}'`, (error, fontPathList, stderr) => {
  
        if (error) {
          reject(new APIError(`Error: ${error.message}`, 500));
          return;
        }
        if (stderr) {
          reject(new APIError(`Error: ${stderr}`, 500));
          return;
        }
  
        if (fontPathList === '') {
          reject(new APIError(`Sorry! We couldn't find the font ${fontName} in our system!`, 404));
          return;
        }

        fontPathList = fontPathList.split('\n');
        fontPathList.pop(); // last element is always empty string
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
          
        resolve(exactMatch ?? [...fontMap.values()][0]);
      });
    })
  }
}