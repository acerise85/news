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

//Routes

//GET route for scraping website
app.get("/", function(req,res){
    axios.get("https://www.denverpost.com/").then(function(response){
        let $ = cheerio.load(response.data);
        console.log(response);
        //grab all h6
        $("h6").each(function(i, element){
            //save results in object
            let res = {};

            res.headline = $(this)
            .children("a")
            .text();
            res.summary = $(this)
            .children("p")
            .text();
            res.link = $(this)
            .children("a")
            .attr("href");

            //new article creation
            db.articles.create(res)
            .then(function(dbarticles){

                console.log(dbarticles);
            })
            .catch(function(error){
                console.log(error);
            });
        });
        res.send("Scrape Complete");

    });


});












// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
//log success message once logged into the db through mongoose
db.once('open', function(){
    console.log("Mongoose connection successful.");
});

  