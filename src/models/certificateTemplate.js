import mongoose, { Schema } from 'mongoose';

const certificateTemplateSchema = new Schema({
  _id: Schema.Types.UUID ,
  parameters: [String],
  createdAt: { type: Date, default: Date.now }
});

const CertificateTemplate = mongoose.model('CertificateTemplate', certificateTemplateSchema);

const ct = new CertificateTemplate({

})

export default CertificateTemplate;
