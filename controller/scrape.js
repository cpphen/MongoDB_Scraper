var request = require('request');
var cheerio = require('cheerio');



var scrape = function(response, scraper, displayScrape) {
console.log("ONNNNNNNNNEEEEEEEEEEE")
	new Promise(function(resolve, reject){
		var scrapedStuff = [];

		request('http://www.gamespot.com/', function(err, res, html){

			if(err)
			{
				console.log(err)
				reject(err);
			}
			// else
			

				console.log("GOT RESPONSE FROM GAMESPOT");
				var $ = cheerio.load(html);
				// var articleCounter = 1;

				$('article a').each(function(i, element){

					// var scrapedStuff = {};

					// scrapedStuff.articleID = articleCounter;
					var scrpObj = {
						title: $(this).attr('data-event-title'),
						link:  $(this).attr('href'),
						img: $(this).children('figure').children('div.media-img').children('img').attr('src'),
						description: $(this).children('div.media-body').children('p.media-deck').text() 
					}
					scrapedStuff.push(scrpObj);

				});

				resolve(scrapedStuff);
				console.log("SCRAPED RESULTS", scrapedStuff);

			
		});


		
	}).then(function(scrapedStuff){
		scraper(response, scrapedStuff, displayScrape);

	}).catch(function(err){
		if(err){
			console.log(err);
		}
	});
}
module.exports = scrape;	
// }