const mongoose = require('mongoose');

//schema to represent a blog post
const postsSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});

postsSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

postsSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
  };
}

const Posts = mongoose.model('posts', postsSchema);

module.exports = {Posts};