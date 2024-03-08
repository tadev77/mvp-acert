import mongoose, { Schema } from 'mongoose';

const certificateTemplateSchema = new Schema({
  _id: Schema.Types.UUID ,
  parameters: [String],
  fonts: [{ name: String, path: String }],
  createdAt: { type: Date, default: Date.now }
});

const CertificateTemplate = mongoose.model('CertificateTemplate', certificateTemplateSchema);

export default CertificateTemplate;
