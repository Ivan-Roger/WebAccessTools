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
	initCalendar();
	initCalculatrice();
}

function initCalendar() {
	$('#calendar').fullCalendar({
        // put your options and callbacks here
    });
}

function createmenu(node) {
	var tree = $("#tree").jstree(true);
	var menu = {
		"item1": {
			"label": "Create Directory",
			"action":function () {
				console.log('Create dir node');
				node = tree.create_node(node);
				tree.edit(node,'',function(node,success,cancel){
					console.log('New dir',node,success,cancel);
					if (cancel) return;
					if (!success)
						tree.delete_node(node);
					else {
						var path = createPath(node.parents);
						createDir({path: path, name: node.text});
					}
				});
			}
		},
		"item2": {
			"label": "Create File",
			"action": function () {
				node = tree.create_node(node,{type:'file', data: {type: 'editor', new: true}});
				tree.edit(node,'',function(node,success,cancel) {
					console.log('New file',node,success,cancel);
					/*
					if (cancel) return;
					if (!success)
						tree.delete_node(node);
					else {
						var path = createPath(node.parents);
						var tab = {name: node.text, type:node.data.type, path: path, id: node.id};
						addTab(tab);
						focusTab(tab);
					}
					*/
				});
			}
		},
		"item3": {
			"label": "Rename",
			"action": function (obj) {
				tree.edit(node,'',function(node,success,cancel) {
					console.log('Rename file',node,success,cancel);
					if (cancel) return;
					if (!success)
						//tree.delete_node(node);
						return;
					else {
						var path = createPath(node.parents);
						var tab = {name: node.text, type:node.data.type, path: path, id: node.id};
						focusTab(tab);
						addTab(tab);
					}
				});
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
		delete menu.item3;
		delete menu.item4;
	}
	return menu;
}

function initTree() {
	$('#tree').jstree({
    'core' : {
  		"animation" : 0,
  		"check_callback" : true,
  		"themes" : { "stripes" : true },
      "data" : {"cache":false,"url" : "backend.php?op=list", "dataType" : "json" }// needed only if you do not supply JSON headers
    },
    "types" : {
			"#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
			"root" : { 'icon':"fa fa-folder", "valid_children" : ["default"] },
			"default" : { 'icon':"fa fa-folder-o","valid_children" : ["default","file"] },
			"file" : { 'icon' :"fa fa-file-o", "valid_children" : [] }
		},
    "plugins" : ["contextmenu", "dnd", "state", "types", "wholerow", "unique"],
    "contextmenu": {"items": createmenu, "select_node": false}
  });
	$('#tree').on("activate_node.jstree",function(e,data)	{
		// si le noeud représente un fichier
		if (data.node.type=='file') {
			var path = createPath(data.node.parents);
			var tab = {name: data.node.text, type:data.node.data.type, path: path, id: data.node.id};
			if (tabExists(tab)) {
				focusTab(tab)
			} else {
				if ($("#tabs>ul>li").size()==0)
					$('#tabs>ul>i').remove();
				addTab(tab);
				focusTab(tab);
			}
		}
	});
	$('#tree').on("rename_node.jstree",function(e,data)	{
		console.log('RENAME',e,data);
		if (data.node.type=='file'){
			var regex = /^[\w_]+\.[a-zA-Z]{1,5}$/g;
			if (!regex.test(data.text)) {
				console.log('Mauvais nom:',data.text,' ancien nom:',data.old);
				alert('Nom invalide\nVotre nom dois ne dois pas contenir d\'espace ni de caractère special et dois avoir une extension.');
				$('#tree').jstree(true).edit(data.node);
			} else {
				if (data.node.new) {
					console.log('RENAME -> Fichier -> Nom OK -> Nouveau fichier');
					data.node.new=false; // Local uniquement, a fixer!
					var path = createPath(node.parents);
					var tab = {name: node.text, type:node.data.type, path: path, id: node.id};
					addTab(tab);
					focusTab(tab);
				} else {
					var path = createPath(data.node.parents);
					var oldTab = {name: data.old, type:data.node.data.type, path: path, id: data.node.id};
					renameTab(oldTab,data.text);
				}
			}
		} else if (data.type=='folder') {

		}
	});
}

function createDir(obj) {
	console.log('Create dir:','Path='+obj.path,'Name='+obj.name);
	$.ajax({
		method: 'GET',
		url: 'backend.php?op=mkdir&path='+obj.path+'&name='+obj.name,
		success: function (res) {
			if (res.status==200) {
				console.log("Success "+res.operation+", "+res.status+": "+res.message,res);
			} else {
				console.log("Error "+res.operation+", "+res.status+": "+res.message,res);
			}
		},
	});
}

function renameTab(tab,name) {
	var id = $('#tabs>div.tab[data-file-id="'+tab.id+'"]').data('name',name).data('tab-id');
	$('#tabs>ul>li[data-tab-id="'+id+'"]>a').text(name);
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
	$("#tab"+num_tab+" .tab-saveFile").click(saveFileTab);
	$("#tabs").tabs("refresh");
	loadTabContent(num_tab);
}

function saveFileTab() {
	if (!$(this).hasClass('fa-save')) return;
	$(this).removeClass('fa-save').addClass('fa-spinner').addClass('fa-spin').removeClass('intLink');
	var tab = $(this).parents(".tab");
	var idTab = tab.data('tab-id');
	var file = tab.data('path') + '/' + tab.data('name')
	console.log("Saving file \""+file+"\"...");
	var content = "data="+tab.find('.textBox').html();
	$.ajax({
		method: 'POST',
		url: 'backend.php?op=save&file='+file,
		data: content,
		success: function(res){
			tab.find('.tab-saveFile').removeClass('fa-spinner').removeClass('fa-spin');
			if (res.status==200) {
				console.log('done');
				tab.find('.tab-saveFile').addClass('fa-check');
				setTimeout(function(){tab.find('.tab-saveFile').removeClass('fa-check').addClass('fa-save').addClass('intLink');},2000)
				//tab.find('.tab-saveFile').hide();
			} else {
				console.log("Error "+res.operation+", "+res.status+": "+res.message,res);
			}
		}
	});
}

function loadTabContent(idTab) {
	var tab = $("#tabs>div.tab[data-tab-id="+idTab+"]");
	var file = tab.data('path') +'/'+ tab.data('name');
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

function initCalculatrice(){
	$("#calc").calc();
}
