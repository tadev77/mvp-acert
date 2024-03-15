import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes.js';
import { uploadErrorHandler } from './src/services/uploadService.js';

dotenv.config();
import('./src/config/database.js');

const app = express();
app.use(bodyParser.json());
app.use(routes);

app.use((err, _req, res, next) => {
  uploadErrorHandler(err, res, 'certificate');
  res.status(500).json(err.message);
  next(err)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
