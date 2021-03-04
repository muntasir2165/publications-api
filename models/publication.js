const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicationSchema = new Schema({
  publicationType: {
    type: String,
    required: true,
    enum: [
      'Books & Book Chapters',
      'Consultant Report',
      'Cost Recovery (CR) report',
      'Journal',
      'Other Publication',
      'Poster',
      'Presentation',
      'Conference Proceedings',
      'Internal technical report',
    ],
  },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', default: null },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('publication', publicationSchema);
