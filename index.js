import express from 'express';
import multer from 'multer';

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, '/tmp/uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.svg')  
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  res.send('Arquivo enviado com sucesso.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
