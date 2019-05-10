// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
// Initialize Express
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
// Database configuration
var databaseUrl = "scraper";
var collections = ["testData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/savedArticles", function (req, res) {
    db.testData.find({}, function (err, data) {
        res.json(data)
    })
});

function something() {
    var results = [];
    axios.get("https://thehimalayantimes.com/category/sports/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("li").each(function (i, element) {
            var headingTag = $(element).find("h3").text().length ? "h3" : "h4";
            var title = $(element).find(headingTag).text();
            var body = $(element).find("p").text();
            //var link = $(element).find(headingTag + " > a").attr("href");
            if (title.length > 0) {
                results.push({
                    title: title,
                    body: body,
                    //url: link

                });
            }
        });
        console.log(results);

    });

    console.log(results)
    return (results)
}


var results = something()
var title = [];
var articles = []
var newData = [];
app.post("/deleteArticle", function (req, res) {
    db.testData.remove({ title: req.body.title }, function (err, data) {
        res.redirect("/savedArticles")
    })
})

app.get("/scrapeData", function (req, res) {
    res.json(results);
})

app.post("/saveArticle", function (req, res) {
    console.log(req.body)
    db.testData.insert({ title: req.body.title, body: req.body.body, note: "" }, function (err, data) {
        console.log(data)
    })
    res.end()
})

app.post("/updateNote", function (req, res) {
    db.testData.update({ title: req.body.title }, { $set: { note: req.body.note } })
    res.end();
})
// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});