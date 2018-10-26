const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytreact";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Routes

// Serve HTML
app.get('/', function(req, res) {
	res.sendFile(path.resolve('public/index.html'));
});

app.get("/api/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.send(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.send(err);
      });
  });

  // Save article to db
app.post('/api/article', function (req, res) {
	db.Article.create({
		title: req.body.title,
		date: req.body.date,
		url: req.body.url
    }).then(function (dbArticle) {
        // If we were able to successfully save an Article, send it back to the client
        res.send(dbArticle);
}).catch(function (err) {
    // If an error occurred, send it to the client
    res.send(err);
  });
});

// Delete article from db
app.delete('/api/article/:id', function (req, res) {
	db.Article.deleteOne({ name: 'Eddard Stark' }, function (err, dbArticle) {
        if (err) {
            res.send(err)
        } else {
            res.send(dbArticle)
        }
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
