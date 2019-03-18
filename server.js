let mongoose = require('mongoose');
let logger = require("morgan");
let express = require('express');

//scraping tools
let axios = require('axios');
let cheerio = require('cheerio');



let PORT = 3000;

let app = express();
//morgan and body parser
app.use(logger('dev'));
app.use(express.urlencoded({
extended: false
}));
app.use(express.json())

//make public folder a static directory
app.use(express.static('public'));

// Database config with Mongoose
// define local MongoDB URI
let databaseUri = "mongodb://localhost/mongoHeadlines"
if (process.env.MONGODB_URI){
    //heroku execution
    mongoose.connect(process.env.MONGODB_URI);
}
else{
    //local machine execution
    mongoose.connect(databaseUri);
}

let db = mongoose.connection;

//show mongoose errors
db.on('error', function(err){
    console.log('Mongoose Error: ', err);

});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
//log success message once logged into the db through mongoose
db.once('open', function(){
    console.log("Mongoose connection successful.");
});

  