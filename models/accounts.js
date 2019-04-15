const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountsSchema = new Schema({
  id: Schema.Types.ObjectId,
  login: String,
  name: String,
  email: String,
  bio: String,
  location: String,
  followers: Number
});


module.exports = accouns = mongoose.model('accountSchema', accountsSchema);
