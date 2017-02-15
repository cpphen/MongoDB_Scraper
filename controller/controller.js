var express = require('express');
var router = express.Router();

//Database set up
var mongoose = require('mongoose');

//Import the models
var Article = require('../models/Article');
var Comment = require('../models/Comment');

//Set up web scraper
var request = require('request');
var cheerio = require('cheerio');

//Connect to database
mongoose.connect("mongodb://localhost");
var db = mongoose.connection;

//Show errors in any
db.on('error', function(err){
	console.log("Mongoose Error: ", err);
});

//Show connection notification if connected
db.once('open', function(){
	console.log('Successfully connected to mongoose!');
});

var scrapeResults = [];

router.get('/', function(req, res){
	res.redirect('/home');
});

router.get('/home', function(req, res){
	if(scrapeResults.length > 0){

		var stuff = {
			moreStuff: scrapeResults,
			arrLength: scrapeResults.length,
			finishScrape: true
		}
		console.log('stufffff', stuff);
		console.log('stuff more stuff', stuff.moreStuff);
		res.render('home', stuff)
	}else{
		res.render('home');
	}
});

router.get('/scrape', function(req, response){
	
	request('http://www.gamespot.com/', function(err, res, html){

		var $ = cheerio.load(html);
		var articleCounter = 1;

		$('article a').each(function(i, element){

			// var scrapedStuff = {};

			var articleID = articleCounter;
			var title = $(this).attr('data-event-title');
			var link = $(this).attr('href');
			var img = $(this).children('figure').children('div.media-img').children('img').attr('src');
			var description = $(this).children('div.media-body').children('p.media-deck').text();


			// var newsStory = new Article(scrapedStuff);

			// newsStory.save(function(err, doc){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		console.log(doc);
			// 	}
			// 	// res.redirect('/home/scraped')
			// });

			scrapeResults.push({
				articleID: articleID,
				title: title,
				link: link,
				img: img,
				description: description
			});

			articleCounter++;

		});
	response.redirect('/home')
	});


});

router.get('/saved', function(req, res){

	Article.find({}, function(error, doc){

		if(error){
			console.log(error);
		}else{

			console.log('doc saved articles', doc);
		}
		var myArticles = {
			theArticles: doc
		}
		res.render('saved', myArticles);
	});
});

router.get('/save/:id', function(req, res){

	console.log('REQ PARAMS', req.params.id);
	
	for(var i = 0; i < scrapeResults.length; i++){

		console.log('scrapeResults[0]', scrapeResults[0].articleID);

		if(scrapeResults[i].articleID === req.params.id){

			console.log('scrapeResults[i] inside if statement', scrapeResults[i]);

			var savedArticle = new Article(scrapeResults[i]);

			savedArticle.save(function(err, doc){
				if(err){
					console.log(err);
				}else{
					console.log('saved doc', doc);
					// break;
					// res.end();
				}
			})

			break;
		}
	}
	res.redirect('/home');
});

router.post('/comments/:id', function(req, res){

	var newComment = new Comment(req.body);

	newComment.save(function(err, doc){
		if(err){
			console.log(err);
		}else{
			Article.findOne({ "_id": req.params.id }, { "comment": doc._id }).exec(function(err, doc){
				if(err){
					console.log(err);
				}else{
					// var postData = {
					// 	theData: doc
					// }

					res.redirect('/home/scraped')
				}
			});
		}
	});

});

router.get('/delete', function(req, res){

	Article.remove({}, function(err){

		if(err){
			console.log(err)
		}else{
			console.log("removed")
			res.send("deleted");
		}
	});
});

module.exports = router;