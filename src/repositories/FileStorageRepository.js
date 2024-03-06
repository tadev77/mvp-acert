import multer from 'multer';
import crypto from 'crypto';

export default class MulterStorage {

  getFileUploader(validator) {    
    return multer({
      storage: multer.diskStorage({
        destination: function (_req, _file, cb) {
          cb(null, '/tmp/uploads/');
        },
        filename: function (req, _file, cb) {
          req.templateId = crypto.randomUUID();
          cb(null, `${req.templateId}.svg`)
        }
      }),
      fileFilter: (req, file, cb) => {
        try {
          if(validator(req, file)) {
            cb(null, true);
          }
        } catch (err) {
          cb(err.message);
        }
      }
    });
  }

  uploadErrorHandler(err, res, expectedName) {
    if (err instanceof multer.MulterError) {
      res.status(400).send(`Error Uploading Files: ${err.message}. Please, upload a file on a multipart field named "${expectedName}"`);
    }
  }
}
