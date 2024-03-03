import multer from 'multer';

export default class MulterStorage {

  getFileUploader(validator, callback) {    
    return multer({
      // since callback function is the one writting the validated file, I don't care where we're storing this data
      // however, not passing in storage key results in multer using MemoryStorage, which is dangerous
      // I'll definitely need to rethink about using multer or not

      storage: multer.diskStorage({
        destination: function (_req, _file, cb) {
          cb(null, '/tmp/');
        },
        filename: function (_req, _file, cb) {
          cb(null, 'junk.svg')
        }
      }),
      fileFilter: (req, file, cb) => {
        try {
          if(validator(req, file)) {
            req.templateId = crypto.randomUUID();
            callback(req, file, req.templateId);
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
