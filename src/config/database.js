import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/acert';

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

export default db;
