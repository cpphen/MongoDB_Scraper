var request = require('request');
var cheerio = require('cheerio');

module.exports = {

	scrape: function(response, scraper, displayScrape) {
	console.log("ONNNNNNNNNEEEEEEEEEEE")

	request('http://www.gamespot.com/', function(err, res, html){

		if(err)
		{
			console.log(err)
			// reject(err);
		}
		// else
		

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
			console.log("SCRAPED RESULTS", scrapedStuff);

		
		});
		scraper(response, scrapedStuff, displayScrape);
	}	
}