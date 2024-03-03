import app from './src/controller.js';
import { CertificateParametersRepository } from './src/repositories/CertificateParametersRepository.js';

const port = 3000;
global.cpr = new CertificateParametersRepository();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
