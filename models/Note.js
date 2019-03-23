let mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new savedArticleSchema object

let noteschema = new Schema({
  // `title` is of type String
  _articleId:{
    type: Schema.Types.ObjectId,
    ref: "articles"
  },

  date: {
    type: Date,
    default: Date.now
  },
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
let Note = mongoose.model("Note", noteschema);

// Export the savedArticle model
module.exports = Note;