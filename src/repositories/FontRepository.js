import { exec } from 'child_process';
import he from 'he';
import path from 'path';
import os from 'os';
import fs from 'fs';

import APIError from '../utils/APIError.js';

const allowedExtensions = ['.ttf', '.otf'];
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'fonts');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
  storeFont(fontFile) {
    const fileExtension = path.extname(fontFile.name);
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      throw new APIError(`Only files within the given extensions are allowed: ${allowedExtensions.join()}`, 400);
    }
    const filePath = path.join(uploadDir, fontFile.name);

    fontFile.mv(filePath, function(err) {
      if (err) {
          throw new APIError(err.message, 500);
      }
  });
  }
}