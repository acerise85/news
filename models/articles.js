//require mongoose library
let mongoose = require('mongoose');

//schema constructor
let Schema = mongoose.Schema;

let articlesSchema = new Schema ({
    //Headline
    headline: {
        type: String,
        required: true,
        trim: true,
        // unique: true
    },
    //summary
    summary: {
        type: String,
        trim: true,
        // required: true,
        
    },
    //link
    link: {
        type: String,
        // required: true
    }
    
});

//create model with mongoose
let articles = mongoose.model("article", articlesSchema);

module.exports = articles;