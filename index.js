import app from './src/controller.js';
import('./src/config/database.js');

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
