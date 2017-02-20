$(document).on('click', '#articleNotes', showCommentBox);
$(document).on('click', '#commentButton', postComment);
$(document).on('click', '.msgX', deleteComment);
$(document).on('click', '.close', close);

var articleID;

function showCommentBox(){
	// var articleNum = $(this).attr("data-article-id");
	console.log('article comment show up id', $(this).attr('data-article-id'));

	$('.comments').empty();
	$('#comment').val("");
	articleID = $(this).attr('data-article-id');

	$.get('/comments/' + articleID, function(data){

		console.log('data comment outside if (entire data):', data);
		console.log('data comment outside if', data.comment);


		if(data.comment){
			for(var x = 0; x < data.comment.length; x++){

				console.log('data comment inside if:', data.comment);
				console.log('data comment[x] inside if comment comment:', data.comment[x].comment);
				console.log('data comment[x] ID if comment comment:', data.comment[x]._id);
				console.log('data comment[x] data._id:', data._id);
				$('.comments').append("<div class='divMsg'><h2 class='message'>" + data.comment[x].comment + 
					"<span class='msgX' data-art-id='" + data._id + "' data-cmt-close='" + data.comment[x]._id + "'><button>&times;</button></span></h2></div>");
			}
		}
		$('.main-popup').fadeIn();
	});
}

function postComment(){
	console.log('modal comments button id', articleID);

	var articleComment = {
		comment: $('#comment').val().trim()
	}

	$.post('/comments/' + articleID, articleComment).done(function(data){
		$('.main-popup').fadeOut();
		console.log('DONNE', data);
	});
}

function deleteComment(){

	var commentID = {
		comment: $(this).attr('data-cmt-close')
	}

	articleID = $(this).attr('data-art-id');

	console.log('COMMENT CLOSE', commentID.comment);
	console.log('COMMENT CLOSE ARTICLE ID', articleID);

	$.post('/comment/delete/' + articleID, commentID).done(function(data){
		console.log("SUCCCESSSS DELETED");
		$('.main-popup').fadeOut();
	});
}


function close(){
	// $('.main-popup').css('display', 'none');
	$('.main-popup').fadeOut();
}


window.onclick = function(event) {
	console.log("over here outside modal");
	console.log("event target", event.target);

	//the container with the class main-popup, is the background of the modal content that is streched 100% width and
	//height. That is why the when clicked outside of modal content, the event target id is .main-popup
    if (event.target.className == 'main-popup') {
        // $('.main-popup').css('display', 'none');
        $('.main-popup').fadeOut();
    }
    if(event.target.id === 'myModal') {
        // $('#myModal').css('display', 'none');
        $('#myModal').fadeOut();
    }
}