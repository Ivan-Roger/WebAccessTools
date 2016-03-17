var TAB_TYPES = ["editor"];

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
	initTree();
	loadTabs();
}

function createmenu(node) {
	var tree = $("#tree").jstree(true);
	return {
		"item1": {
			"label": "Create Directory",
			"action":function () {
				node = tree.create_node(node);
				tree.edit(node);
			}
		},
		"item2": {
			"label": "Create File",
			"action": function () {
				node = tree.create_node(node,{"type":"file"});
				tree.edit(node);
			}
		},
		"item3": {
			"label": "Rename",
			"action": function (obj) {
				tree.edit(node);
			}
		},
		"item4": {
			"label": "Remove",
			"action": function (obj) {
				tree.delete_node(node);
			}
		}
	};
}

function initTree() {
	$('#tree').jstree({
    'core' : {
    		"animation" : 0,
    		"check_callback" : true,
    		"themes" : { "stripes" : true },
            'data' : {"cache":false,"url" : "backend.php?op=files", "dataType" : "json" }// needed only if you do not supply JSON headers
              },
    "types" : {
    			"#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
   				"root" : { 'icon':"./icons/folder.png", "valid_children" : ["default"] },
    			"default" : { 'icon':"./icons/folder.png","valid_children" : ["default","file"] },
    			"file" : { 'icon' :"./icons/file.png", "valid_children" : [] }
    			},
    "plugins" : [ "contextmenu", "dnd", "state", "types", "wholerow"],
    "contextmenu":{ "items": createmenu}
  });

	// On affiche le nom du fichier sélectionné dans une boite de dialogue
	$('#tree').on("select_node.jstree",function(e,data)
	{
		// si le noeud représente un fichier
		if (data.node.type=='file')
		{
			alert("fichier "+data.node.text+" sélectionné");
		}
	});
}

// Applique la commande sCmd sur la sélection de l'element e via execCommand
function formatDoc(e,sCmd) {
	$(e).parent().find(".textBox").focus();
	document.execCommand(sCmd, false, null);
}

function addTab(tab) {
	if (!TAB_TYPES.indexOf(tab.type)==-1) return;
	var num_tab = $("#tabs>ul>li").size();
	$("#tabs>ul").append($("<li data-tab-id='"+num_tab+"'><a class='name' href='#tab"+num_tab+"'>"+tab.name+"</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"));
	$("#tabs").append($("<div class='tab' id='tab"+num_tab+"'/>").append($("#"+tab.type+"Model").clone()));
}

function loadTabs() {
	var tabs = [
		{name:"test.txt", type:"editor"},
		{name:"lipsum.txt", type:"editor"}
	];
	// TODO -- Remplacer la variable tabs en dur par un appel ajax -- TODO //
	$("#tabs>ul>li").remove();
	$("#tabs>ul>div.tab").remove();
	for (var i in tabs) {
		addTab(tabs[i]);
		loadTabContent(i);
	}
	$("#tabs").tabs("refresh");
}

function loadTabContent(idTab) {
	var file = $("#tabs>ul>li[data-tab-id="+idTab+"]>a").text();
	console.log("Loading file \""+file+"\"...");
	$("#tabs>ul>li[data-tab-id="+idTab+"]>a").prepend($("<i class='fa fa-inline fa-spin fa-circle-o-notch'/>"));
	$("#tabs>ul>li[data-tab-id="+idTab+"]").addClass("tab-loading");
	// TODO -- Ne pas ajouter le spinner a chaque fois mais juste l'afficher pendant le loading (CSS) -- TODO //
	$.ajax({
		method: 'GET',
		url: 'backend.php?op=recup&file='+file,
		success: function(res){
			$("#tabs>ul>li[data-tab-id="+idTab+"]").removeClass("tab-loading");
			$("#tabs>ul>li[data-tab-id="+idTab+"]>a>i.fa").remove();
			if (res.status==200) {
				console.log("File loaded.");
				$("#tab"+idTab+" .textBox").html(res.data);
			} else {
				console.log("Error "+res.operation+", "+res.status+": "+res.message,res);
			}
		}
	});
}
