$(function() {
	init();
});

function init() {
	var tabs = $( "#tabs" ).tabs({
		collapsible: true
	});
	tabs.delegate( "span.ui-icon-close", "click", function() {
		var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
		$( "#" + panelId ).remove();
		tabs.tabs( "refresh" );
	});
	$( "#accordion" ).accordion({
		heightStyle: "fill"
	});
}

// Applique la commande sCmd sur la sÃ©lection de l'element oDoc via execCommand
function formatDoc(sCmd) {
	$(".textBox").focus();
	document.execCommand(sCmd, false, null);
}

//data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=
//data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==
