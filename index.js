import express from 'express';
import multer from 'multer';
import mimeTypes from 'mime-types';

const app = express();
const port = 3000;
const multipartKey = 'certificate';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, '/tmp/uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.svg')  
  }
});

const upload = multer({ 
  storage,
  fileFilter: (_req, file, cb) => {
    try {
      const mimeType = mimeTypes.lookup(file.originalname);
      if (mimeType === 'image/svg+xml') {
        cb(null, true);
      } else {
        throw new Error('Not a SVG file.');
      }
    } catch (error) {
      cb(error.message);
    }
  }
});

app.post('/upload', upload.single(`${multipartKey}`), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send(`No file found.`);
  }

  res.send('File uploaded successfully.');
});

app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send(`Error Uploading Files: ${err.message}. Please, upload a file on a multipart field named "${multipartKey}"`);
  } else {
    res.status(500).send('Internal Server Error.');
  }
  next(err)
});

app.get('/ping', (_req, res) => {
  res.status(200).send("I'm alive!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
