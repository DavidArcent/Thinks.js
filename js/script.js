$(document).ready( function () {
	$('#thinks').thinks({
			layerSelector		: ".layer",
			pervSelector		: "#prev",
			nextSelector		: "#next",
			navSelector			: "#controls",
			speed				: 500,
			delay				: 5000,
			effect 				: "random",
			numberNav			: false,
			pauseHover			: true,
	});

	SyntaxHighlighter.all();
});