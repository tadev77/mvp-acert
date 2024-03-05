import db from './config/database.js';
import CertificateTemplate from './models/certificateTemplate.js';

db.once('open', async () => {
  console.log('Connected to MongoDB successfully!');

  // Criando um novo registro em CertificateTemplate
  try {
    const newCertificateTemplate = new CertificateTemplate({
      _id: crypto.randomUUID(),
      parameters: ['name','workload'], // Exemplo de parâmetros
    });

    const savedCertificateTemplate = await newCertificateTemplate.save();
    console.log('Certificate template saved successfully:', savedCertificateTemplate);
  } catch (error) {
    console.error('Error saving certificate template:', error);
  }

  // Fechando a conexão com o MongoDB
  db.close();
});
