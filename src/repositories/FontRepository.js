import { exec } from 'child_process';
import he from 'he';
import os from 'os';

import APIError from '../utils/APIError.js';

const command = fontName => os.platform === 'win32' ? 
`for /f "tokens=1 delims=:" %a in ('fc-list ^| findstr /i "${fontName}"') do @echo %a` :
`fc-list | grep -i ${fontName} | awk -F: '{print $1}'`;


export default class FontRepository {
  getFonts(inputFontName) {
    return new Promise((resolve, reject) => {
      const decodedName = he.decode(inputFontName);
      const fontName = decodedName.replace(/[^a-zA-Z0-9\-_]/g, '');
      
      exec(command(fontName), (error, fontPathList, stderr) => {
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
        resolve(fontPathList);
      });
    });
  }
}