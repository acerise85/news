let mongoose = require('mongoose');
let logger = require("morgan");
let express = require('express');

//scraping tools
let axios = require('axios');
let cheerio = require('cheerio');

let app = express();
//Handlebars
let exphbs = require("express-handlebars");


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let PORT = process.env.PORT || 3000;

//morgan and body parser
app.use(logger('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json())

//make public folder a static directory
app.use(express.static('public'));


// require("./routes/api-routes.js")(app);

// Database config with Mongoose
// define local MongoDB URI
let databaseUri = "mongodb://localhost/mongoHeadlines"
if (process.env.MONGODB_URI) {
    //heroku execution
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    //local machine execution
    mongoose.connect(databaseUri);
}


let db = require('./models');


mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// let db = mongoose.connection || 

//show mongoose errors
// db.on('error', function(err){
//     console.log('Mongoose Error: ', err);

// });

//Routes
app.get("/", function (req, res) {
    db.article.find({}).then(function (data) {

        res.render("index", { items: data })

    });
    
});
//GET route for scraping website
app.get("/scrape", function (req, res) {
   
    axios.get("https://www.denverpost.com/").then(function (response) {
        let $ = cheerio.load(response.data);
        console.log(response);

        db.article.find({}).then(function (alreadySaved) {
        newArticlesAdded = 0
            //grab all h6
            $("h6").each(function (i, element) {
                //save results in object
                let res = {};

                res.headline = $(this)
                    .children("a")
                    .text();
                res.summary = $(this)
                    .children("<div> .excerpt")
                    .text();
                res.link = $(this)
                    .children("a")
                    .attr("href");

                //new article creation
                var storyIsIndb = false
                
                for (let i = 0; i < alreadySaved.length; i++) {
                                      
                    if(alreadySaved[i].link == res.link){
                        storyIsIndb = true
                        console.log('storyIsIndb:' + storyIsIndb);
                        
                    } 
                }

                if (storyIsIndb == false) {
                    newArticlesAdded++
                    
                    
                    db.article.create(res)
                        .then(function (dbarticles) {

                            console.log(dbarticles);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

            });
            res.send("Scrape Complete. You added " + newArticlesAdded + ' new articles');
        })

    });


});

app.get("/savedArticle", function (req, res) {

    db.article.find({})
        .then(function (dbarticles) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbarticles);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});











// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


