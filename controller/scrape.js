var request = require('request');
var cheerio = require('cheerio');



var scrape = function(response, scraper, displayScrape) {
console.log("ONNNNNNNNNEEEEEEEEEEE")

		request('http://www.gamespot.com/', function(err, res, body){

			if(err)
			{
				console.log(err)
				// reject(err);
			}
			// else
			

				var scrapedStuff = [];
				console.log("GOT RESPONSE FROM GAMESPOT");
				var $ = cheerio.load(body);
				// var articleCounter = 1;

				$('article a').each(function(i, element){

					// var scrapedStuff = {};

					// scrapedStuff.articleID = articleCounter;
					var title = $(this).attr('data-event-title');
					var link = $(this).attr('href');
					var img = $(this).children('figure').children('div.media-img').children('img').attr('src');
					var description = $(this).children('div.media-body').children('p.media-deck').text().trim();

					var scrpObj = {
						title: title,
						link:  link,
						img: img,
						description: description
					}

					scrapedStuff.push(scrpObj);
				});

				console.log("SCRAPED RESULTS", scrapedStuff);
				scraper(response, scrapedStuff, displayScrape);
		});
}
module.exports = scrape;	
// }