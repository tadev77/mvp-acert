import mongoose, { Schema } from 'mongoose';

const certificateSchema = new Schema({
  fields: Object,
  filename: Schema.Types.String,
  createdAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
