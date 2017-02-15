// $(document).on('click', '.scrape', show);
$(document).on('click', '.close', close);
// var modal = $('#myModal');

// function show(){
// 	$('#myModal').css('display', 'block');
// }

function close(){
	$('#myModal').css('display', 'none');
}


window.onclick = function(event) {
	console.log("over here outside modal");
	console.log("event target", event.target.id);

    if (event.target.id == 'myModal') {
        $('#myModal').css('display', 'none');
    }
}
