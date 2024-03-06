import mongoose from 'mongoose';

let mongoHost;

// Verifica se está sendo executado dentro de um contêiner Docker
if (process.env.DOCKER_ENV === '1') {
  mongoHost = 'mongo';
} else {
  mongoHost = 'localhost';
}

const mongoURI = `mongodb://${mongoHost}:27017/acert`;

mongoose.connect(mongoURI, {
  // autoReconnect: true,
  // reconnectTries: 20,
  // reconnectInterval: 1000, 
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

export default db;
