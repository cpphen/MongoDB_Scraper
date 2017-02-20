var express = require('express');
var router = express.Router();

//Database set up
// var mongoose = require('mongoose');

//Import the models
var Article = require('../models/Article');
var Comment = require('../models/Comment');

//Set up web scraper
var request = require('request');
var cheerio = require('cheerio');

//Connect to database
// mongoose.connect("mongodb://localhost");

// if(process.env.MONGODB_URI){
// 	mongoose.connect(process.env.MONGODB_URI);
// }else{
// 	mongoose.connect("mongodb://localhost");
// }
// var db = mongoose.connection;

//Show errors in any
// db.on('error', function(err){
// 	console.log("Mongoose Error: ", err);
// });

// //Show connection notification if connected
// db.once('open', function(){
// 	console.log('Successfully connected to mongoose!');
// });

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
			// sesssion: req.sesssion.seenModal
		}
		// console.log('stufffff', stuff);
		// console.log('stuff more stuff', stuff.moreStuff);
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

router.post('/save', function(req, res){

	console.log('REQ BODY BODY', req.body);
	console.log('REQ BODY', req.body.article);
	var bodyNum = parseInt(req.body.article);
	
	for(var i = 0; i < scrapeResults.length; i++){

		// console.log('scrapeResults[0]', scrapeResults[0].articleID);
		// console.log('typeof scrapeResults[i].articleID', typeof scrapeResults[i].articleID);
		// console.log('typeof req.prams.id', typeof req.params.id)

		if(scrapeResults[i].articleID === bodyNum){

			// console.log('scrapeResults[i] inside if statement', scrapeResults[i]);

			var savedArticle = new Article(scrapeResults[i]);

			savedArticle.save(function(err, doc){
				if(err){
					console.log(err);
				}else{
					console.log('saved doc', doc);
					// break;
					// res.send(doc);
				}
			});

			break;
		}
	}
	console.log('scrapeResults IIII', i);
	scrapeResults.splice(i, 1);
	console.log("scrapeResults splice", scrapeResults);
	// req.session.seenModal = true;
	res.send('done');
});

router.get('/comments/:id', function(req, res){
	console.log('REQ PARAMS ID IN COMMENT GET *******', req.params.id );
	Article.findOne({ "_id": req.params.id }).populate("comment").exec(function(err, doc){

		if(err){
			console.log(err)
		}else{
			console.log("\n\n\n")
	        console.log('docs in comment get', doc)
	        console.log("\n\n\n")
	        res.json(doc);
		}
	});	
});

router.post('/comments/:id', function(req, res){

	console.log('\n\n\n')
	console.log('REQ PARAMS IN comments POST', parseInt(req.params.id));
	console.log('\n\n\n')
	console.log('REQ PARAMS IN comments POST no parseInt', req.params.id);
	console.log('\n\n\n')
	console.log('REQ BODY In comments POST', req.body.comment);

	var newComment = new Comment(req.body);

	newComment.save(function(err, doc){
		console.log('\n\n\n');
		console.log('DOC inside of COMMENT POST // Is this the comment ID?? doc._id??', doc);
		if(err){
			console.log(err);
		}else{
			Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "comment": doc._id }}).exec(function(err, doc){
				if(err){
					console.log(err);
				}else{
					// var postData = {
					// 	theData: doc
					// }
					console.log('\n\n\n')
					console.log('DOC inside of COMMENT POST after findone', doc);

					res.send(doc);
				}
			});
			// Comment.findOneAndUpdate({ "_id": doc._id }, { "article": req.params.id }).exec(function(err, doc){
			// 	if(err){
			// 		console.log(err);
			// 		res.send(err);
			// 	}else{
			// 		console.log('\n\n\n')
			// 		console.log('DOC inside of COMMENT POST ', doc);
			// 		res.send(doc);
			// 	}
			// });
		}
	});

});

router.post('/comment/delete/:id', function(req, res){
	console.log('COMMENT DELETE REQ BODY', req.body);
	console.log('COMMENT DELETE REQ BODY.COMMENT', req.body.comment);
	console.log('COMMENT DELETE REQ PARAMS', req.params.id);
	Article.findOneAndUpdate({ "_id": req.params.id }, { $pull: { "comment": req.body.comment }}).exec(function(err, doc){
		if(err){
			console.log(err);
			res.send(err)
		}else{
			res.send(doc);
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