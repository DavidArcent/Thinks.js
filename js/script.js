$(document).ready( function () {
	$('#thinks').thinks({
			layerSelector		: ".layer",
			pervSelector		: "#prev",
			nextSelector		: "#next",
			navSelector			: "#controls",
			speed				: 0,
			delay				: 0,
			effect 				: "random",
			numberNav			: false,
			pauseHover			: false,
	});

	SyntaxHighlighter.all();
});