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
		if ($("#tabs>ul>li").size()==0)
			$('#tabs>ul').append($("<i class='tab-empty'>Séléctionnez un fichier pour l'ouvrir</i>"));
	});
	$( "#accordion" ).accordion({
		heightStyle: "fill"
	});
	initTree();
}

function createmenu(node) {
	var tree = $("#tree").jstree(true);
	var menu = {
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
				node = tree.create_node(node,{"type":"file", data: {type: 'editor'}});
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
			"label": "Delete",
			"action": function (obj) {
				tree.delete_node(node);
			}
		}
	};
	var type = tree.get_node(node.id).type;
	if (type=='file') {
		delete menu.item1;
		delete menu.item2;
	} else if (type=='root') {
		delete menu.item2;
	}
	return menu;
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
   				"root" : { 'icon':"fa fa-folder", "valid_children" : ["default"] },
    			"default" : { 'icon':"fa fa-folder-o","valid_children" : ["default","file"] },
    			"file" : { 'icon' :"fa fa-file-o", "valid_children" : [] }
    			},
    "plugins" : [ "contextmenu", "dnd", "state", "types", "wholerow"],
    "contextmenu": {"items": createmenu, "select_node": false}
  });
	$('#tree').on("activate_node.jstree",function(e,data)	{
		// si le noeud représente un fichier
		if (data.node.type=='file') {
			var path = createPath(data.node.parents);
			var tab = {name: data.node.text, type:data.node.data.type, path: path, id: data.node.id};
			if (tabExists(tab))
				focusTab(tab)
			else
				if ($("#tabs>ul>li").size()==0)
					$('#tabs>ul>i').remove();
				addTab(tab);
				focusTab(tab);
		}
	});
}

function createPath(par) {
	var arr = par.join('/').split('/');
	for (var i in arr) {
		var name = $('#tree').jstree().get_node(arr[i]).text;
		if (name==undefined)
			arr.splice(i,1);
		else
			arr[i] = name;
	}
	if (arr[0]!="#")
		arr.reverse();
	return arr.join('/').replace('Racine','');
}

function tabExists(tab) {
	return $('#tabs>div.tab[data-file-id="'+tab.id+'"]').size()>0;
}

function focusTab(tab) {
	var id = $('#tabs>div.tab[data-path="'+tab.path+'"][data-name="'+tab.name+'"]').data('tab-id');
	$('#tabs>ul>li[data-tab-id="'+id+'"]:not(.ui-tabs-active)>a').click();
}

// Applique la commande sCmd sur la sélection de l'element e via execCommand
function formatDoc(e,sCmd) {
	$(e).parent().find(".textBox").focus();
	document.execCommand(sCmd, false, null);
}

function addTab(tab) {
	if (!TAB_TYPES.indexOf(tab.type)==-1) return;
	var num_tab = $("#tabs>ul>li").size();
	$("#tabs>ul").append($("<li data-tab-id='"+num_tab+"'><a class='name' href='#tab"+num_tab+"'><i class='fa fa-inline fa-spin fa-circle-o-notch'/>"+tab.name+"</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"));
	$("#tabs").append($("<div class='tab' data-file-id='"+tab.id+"' data-path='"+tab.path+"' data-name='"+tab.name+"' data-tab-id='"+num_tab+"' id='tab"+num_tab+"'/>").append($("#"+tab.type+"Model").clone().attr('id','')));
	$("#tabs").tabs("refresh");
	loadTabContent(num_tab);
}

function loadTabContent(idTab) {
	var tab = $("#tabs>div.tab[data-tab-id="+idTab+"]");
	var path = tab.data('path');
	var name = tab.data('name');
	var file = path+'/'+name;
	console.log("Loading file \""+file+"\"...");
	$("#tabs>ul>li[data-tab-id="+idTab+"]").addClass("tab-loading");
	$.ajax({
		method: 'GET',
		url: 'backend.php?op=recup&file='+file,
		success: function(res){
			$("#tabs>ul>li[data-tab-id="+idTab+"]").removeClass("tab-loading");
			if (res.status==200) {
				$("#tab"+idTab+" .textBox").html(res.data);
			} else {
				console.log("Error "+res.operation+", "+res.status+": "+res.message,res);
			}
		}
	});
}
