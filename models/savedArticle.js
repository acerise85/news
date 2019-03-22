let mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new savedArticleSchema object

let savedArticleSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
let savedArticle = mongoose.model("savedArticle", savedArticleSchema);

// Export the savedArticle model
module.exports = savedArticle;