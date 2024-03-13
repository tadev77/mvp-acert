import APIError from '../utils/APIError.js';

import fontService from '../services/fontService.js';

const fontFileKey = 'fontFile';

const registerFont = async (req, res) => {
  if (!req.files || !req.files.fontFile) {
    return res.status(400).json({ message: `no file provided by the field ${fontFileKey}` });
  }

  try {
    fontService.registerFont(req.files.fontFile);
    res.status(200).json({ message: 'font successfully installed in our system!' });
  } catch(err) {
    if (err instanceof APIError) {
      res.status(err.statusCode).json(err);
    } else {
      res.status(500).json({ message: err.message });
    }
  }
}

export {
  registerFont
}