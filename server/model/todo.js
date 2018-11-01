var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  complete: {type: Boolean, default: false},
  delete: {type: Boolean, default: false},
  priority: Number,
  deadline: Date
});

module.exports = mongoose.model('todo', todoSchema);