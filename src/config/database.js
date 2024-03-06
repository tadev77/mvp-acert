import mongoose from 'mongoose';

let mongoHost;

if (process.env.DOCKER_ENV === '1') {
  mongoHost = 'mongo';
} else {
  mongoHost = 'localhost';
}

const mongoURI = `mongodb://${mongoHost}:27017/acert`;

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

export default db;
