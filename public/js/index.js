

$("#queryForm").submit(function(event) {
	event.preventDefault();
});

$("#submit").click(function() {

	var query  = $("#query").val();
	var offset = $("#offset").val();

	console.log(query, offset);

	//window.open("https://custom-image-search.herokuapp.com/api?find=" + query + "&offset=" + offset);

	$("#query").val('');
	$("#offset").val('');

});

$("#showDetails").click(function() {
	$('.explanation').show(400);
});

$("#close").click(function() {
	$('.explanation').hide(400);
});