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

/******************************************************************/
//This array will be the empty array I store my scraped articles in. Instead of saving it directly into database
//after scraping, the data will get stored in here. See 'router.get('/scrape')'
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

			/*****************************************************************/
			//Here is when scraped object is stored in the empty array. Notice the variable articleCounter = 1
			//at the top of this route. This is put inside the object below and then incremented after for the next
			//scraped article. This counter variable will be used to assign data to a button in home.handlebars file
			//on line 36. <span><button id="save" data-id="{{this.articleID}}" when at the end of this route
			//I redirect to '/home' where I make an object and assign the array holding the articles to the property
			//'moreStuff' and then render it onto the home.handlebars. Next, refer to home.js file and take a 
			//look at the 'saveArticle' function which is called when the button that has the counter id data is clicked. 
			//Grab the data-id value, which is the counter variable above, like
			//so: var article = $(this).attr('data-id');. Then send it to the post request route '/save'. Next step
			//is look at home.js and the router.post('/save') on line 114  
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

	/*****************************************************************/
	//Here is where that counter variable which is now req.body.article from the post request in home.js 'saveArticle'
	//is used. In the for loop, if the index array that holds the articles, matches the counter variable number i set as 
	//explained above (var articleCounter), then get that specific index of the array that holds the scraped articles
	//and save it, then break out of loop. The req.body.article had to has to be parseInt as post requests that send
	//number as data will be a string and will not match against a real integer. The res.send('done') at bottom does
	//nothing except to send a response so this route will end.
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
	//*********************************************************************
	//This is just deleting the specific index of the array that gets saved, so that when this route finishes and 
	//goes to the callback function that called this route in home.js, the page is refreshed so the number of articles
	//will update.
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
			// Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id }).exec(function(err, doc){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		// var postData = {
			// 		// 	theData: doc
			// 		// }
			// 		console.log('\n\n\n')
			// 		console.log('DOC inside of COMMENT POST after findone', doc);

			// 		res.send(doc);
			// 	}
			// });
			Comment.findOneAndUpdate({ "_id": doc._id }, { "article": req.params.id }).exec(function(err, doc){
				if(err){
					console.log(err);
					res.send(err);
				}else{
					console.log('\n\n\n')
					console.log('DOC inside of COMMENT POST ELSE', doc);
					res.send(doc);
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