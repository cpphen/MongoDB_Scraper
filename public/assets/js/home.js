$(document).on('click', '#save', saveArticle);
$(document).on('click', '.close', close);
// var modal = $('#myModal');

// function show(){
// 	$('#myModal').css('display', 'block');
// }

function close(){
	// $('#myModal').css('display', 'none');
	$('#myModal').fadeOut();
}


window.onclick = function(event) {
	console.log("over here outside modal");
	console.log("event target", event.target);
	console.log("event target id", event.target.id);

    if(event.target.id === 'myModal') {
        // $('#myModal').css('display', 'none');
        $('#myModal').fadeOut();
    }
}

function saveArticle(){

	//This is the data-id in the home.handlbars that hold the number of the counter variable 'articleCounter', in the 
	//router.get('/scrape', function(req, response){... path. Next step is the post('/save') route in controller.
	var article = $(this).attr('data-id');

	var savedArticle = {
		article: article
	}

	console.log('data ID', typeof article);

	$.post('/save', savedArticle).done(function(data){

		//****************************************
		//After post is done, change or refresh page back changing url to the same url.
		$('#myModal').css('display', 'none');
		window.location = window.location;
	});
}
