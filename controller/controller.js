var express = require('express');
var router = express.Router();

//mumbo jumbo
//Database set up
// var mongoose = require('mongoose');

//Import the models
var Article = require('../models/Article');
var Comment = require('../models/Comment');

//Set up web scraper
var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res){
	res.redirect('/home');
});

router.get('/home', function(req, res){
	// console.log("HOME SCRAPED", scrapeResults);
	// if(scrapeResults.length > 0){

	// 	var stuff = {
	// 		moreStuff: scrapeResults,
	// 		arrLength: scrapeResults.length,
	// 		finishScrape: true
	// 		// sesssion: req.sesssion.seenModal
	// 	}
	// 	// console.log('stufffff', stuff);
	// 	// console.log('stuff more stuff', stuff.moreStuff);
	// 	res.render('home', stuff)
	// }else{

	Article.find({}, function(err, doc){
		if(err){
			console.log(err)
		}else{
			res.render('home', {data: {articles: doc}});
		}
	});
		// res.render('home');
	// }
});

router.get('/scrape', function(req, response){
	// console.log("STARTING scrape");

	new Promise(function(resolve, reject){
		request('http://www.gamespot.com/', function(err, res, html){

			if(err){
				console.log(err)
				reject(err);
			}else{

				var scrapedStuff = [];
				console.log("GOT RESPONSE FROM GAMESPOT");
				var $ = cheerio.load(html);
				// var articleCounter = 1;

				$('article a').each(function(i, element){

					// var scrapedStuff = {};

					// scrapedStuff.articleID = articleCounter;
					scrapedStuff.push({
						title: $(this).attr('data-event-title'),
						link:  $(this).attr('href'),
						img: $(this).children('figure').children('div.media-img').children('img').attr('src'),
						description: $(this).children('div.media-body').children('p.media-deck').text()
					})
					// scrapedStuff.title = $(this).attr('data-event-title');
					// scrapedStuff.link = $(this).attr('href');
					// scrapedStuff.img = $(this).children('figure').children('div.media-img').children('img').attr('src');
					// scrapedStuff.description = $(this).children('div.media-body').children('p.media-deck').text();

					console.log("SCRAPED RESULTS", scrapedStuff);
					// articleCounter++;

					// var scrapedArticles = new Article(scrapedStuff);

					// scrapedArticles.save(function(err, doc){
					// 	if(err){
					// 		console.log(err)
					// 	}else{
					// 		console.log("NEW METHOD DOCS", doc);

					// 		// response.render('home', {data: doc, finishScrape: true})
					// 	}
					// })

				});
				console.log("FINISHED SCRAPING")
				Article.collection.insertMany(scrapedStuff, function(err, docs){
					if(err){
						console.log(err);
					}else{
						console.log("INSERT MANY DOCS", docs);
						console.log("FINISHED SCRAPING ELSE")
						resolve();
					}
				});
			}
		});


	}).then(function(){

		Article.find({}, function(err, doc){
			if(err){
				console.log(err)
			}else{
				if(doc.length > 0){
					console.log("CHECK TO SEE IF DOCS IN HOME GOT UPDATE", doc)
					var articleLength = [];
					for(var x = 0; x < doc.length; x++){
						if(doc[x].saved === false){
							articleLength.push(doc[x]);
						}
					}
					// var finalLength = articleLength.length;
					response.render('home', {data: {articles: doc, length: articleLength.length, finishScrape: true}})				
				}else{
					response.render('home');
				}
			}
		});
	}).catch(function(err){
		console.log(err);
	})

		// response.redirect('/home');
		// console.log("ABOUT TO REDIRECT");
	// });


});

router.get('/saved', function(req, res){

	Article.find({}, function(error, doc){

		if(error){
			console.log(error);
		}else{
			if(doc.length > 0){
				console.log('doc saved articles', doc);
				var myArticles = {
					theArticles: doc
				}
				console.log("theArticles DOCCCC", myArticles.theArticles[0].saved)
				res.render('saved', myArticles);
			}else{
				res.render('saved');
			}
		}
	});
});

router.post('/save', function(req, res){

	console.log('REQ BODY BODY', req.body);
	console.log('REQ BODY ARTICLE ID', req.body.article);
	// var bodyNum = parseInt(req.body.article);
	
	// for(var i = 0; i < scrapeResults.length; i++){

	// 	// console.log('scrapeResults[0]', scrapeResults[0].articleID);
	// 	// console.log('typeof scrapeResults[i].articleID', typeof scrapeResults[i].articleID);
	// 	// console.log('typeof req.prams.id', typeof req.params.id)

	// 	if(scrapeResults[i].articleID === bodyNum){

	// 		// console.log('scrapeResults[i] inside if statement', scrapeResults[i]);

	// 		var savedArticle = new Article(scrapeResults[i]);

	// 		savedArticle.save(function(err, doc){
	// 			if(err){
	// 				console.log(err);
	// 			}else{
	// 				console.log('saved doc', doc);
	// 				// break;
	// 				// res.send(doc);
	// 			}
	// 		});

	// 		break;
	// 	}
	// }
	// console.log('scrapeResults IIII', i);
	// scrapeResults.splice(i, 1);
	// console.log("scrapeResults splice", scrapeResults);
	// req.session.seenModal = true;
	Article.findOneAndUpdate({ "_id": req.body.article }, { "saved": true }, {"new": true}).exec(function(err, doc){
		if(err){
			console.log(err);
		}else{
			console.log("DOCS AFTER NEW SAVE CLICK", doc);
			// res.redirect('/home');
			res.send("done")
		}
	});
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
			Comment.remove({ "_id": req.body.comment }, function(err, doc){

				res.send(doc);
			});
		}
	});
});

router.get('/delete', function(req, res){

	Article.remove({}, function(err, doc){

		if(err){
			console.log(err)
		}else{
			Comment.remove({}, function(err){
				if(err){
					console.log(err);
				}else{

					console.log("removed")
					res.send("deleted");
				}
			});
		}
	});
});

module.exports = router;