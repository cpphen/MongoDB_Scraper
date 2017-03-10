var request = require('request');
var cheerio = require('cheerio');



var scrape = function(response, scraper, displayScrape) {
console.log("ONNNNNNNNNEEEEEEEEEEE")

		request('http://www.famitsu.com', function(err, res, body){

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

				// $('article a').each(function(i, element){
				$('div.content.jsContentClick.contentClick').each(function(i, element){

					// var scrapedStuff = {};

					// scrapedStuff.articleID = articleCounter;
					var title = $(this).find('div.articleWrap a').attr('title');
					var link = $(this).attr('data-href');
					// var img = $(this).children('div.thumbWrap').children('a').attr('style');
					var img = $(this).find('div.thumbWrap a').attr('style');

					if(!img){
						return;
					}

					console.log("\n\n")
					console.log("IMG", img);
					console.log("\n\n")

					var reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
					var extractedURL = reg.exec(img);
					console.log("\n\n")
					console.log("EXTRACTED", extractedURL);
					console.log("\n\n")

					var finalImg = extractedURL[1];
					// var alterImg = img.replace(/\([a-zA-Z"']?/, '').replace(/["']?\)$/, '');
					// img = img.replace(/^url\(?/, '').replace(/["']?\)$/, '');
					// var description = $(this).children('.listElmnt-blogItem').children('p').text().trim();
					console.log("\n\n")
					console.log("FINAL IMG", finalImg);
					console.log("\n\n")
						// var scrapedStuff = {};

						// scrapedStuff.articleID = articleCounter;
						// var title = $(this).attr('data-event-title');
						// var link = $(this).attr('href');
						// var img = $(this).children('figure').children('div.media-img').children('img').attr('src');
						// var description = $(this).children('div.media-body').children('p.media-deck').text().trim();

					var scrpObj = {
						title: title,
						link:  link,
						img: finalImg
					}

					scrapedStuff.push(scrpObj);
				});

				console.log("SCRAPED RESULTS", scrapedStuff);
				scraper(response, scrapedStuff, displayScrape);
		});
}
module.exports = scrape;	
// }