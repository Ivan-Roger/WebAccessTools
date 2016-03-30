(function (factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if(typeof exports === 'object') {
		factory(require('jquery'));
	}
	else {
		factory(jQuery);
	}
}(function ($, undefined) {
	"use strict";

	$.fn.tttt = function() {
		return instance($(this));
	}

  $.fn.calc=function() {
		if (arguments[0]===true) {
			// Avoid creating instance on non-calc
			if (!$(this).hasClass('calc')) return;

			return instance($(this));
		} else {
			// Avoid multiple initializations
			if ($(this).hasClass('calc')) return;

			// Set the container
			$(this).addClass('calc').addClass('calc-container').data('memory',0);

			// Append the display
			$(this).append($('<div/>').addClass('calc-display-container').append(
				$('<input type="text" readonly="true"/>').addClass('calc-display'))
			);

			// List of buttons
			var buttons = [
				[{type:'action', value:'MC'},	{type:'action', value:'MR'},	{type:'action', value:'MS'},	{type:'action', value:'+-'},	{type:'libre'}],
				[{type:'action', value:'CE'},	{type:'function', value:'('},	{type:'function', value:')'},	{type:'function', value:'/'},	{type:'libre'}],
				[{type:'value', value:'7'},		{type:'value', value:'8'},		{type:'value', value:'9'},		{type:'function', value:'*'},	{type:'libre'}],
				[{type:'value', value:'4'},		{type:'value', value:'5'},		{type:'value', value:'6'},		{type:'function', value:'-'},	{type:'libre'}],
				[{type:'value', value:'1'},		{type:'value', value:'2'},		{type:'value', value:'3'},		{type:'function', value:'+'},	{type:'libre'}],
				[{type:'value', value:'0'},		{type:'action', class:'calc-edit-mode', value:'E'},		{type:'function', value:'.'},	{type:'action', value:'='},		{type:'libre'}]
			];

			// Append buttons
			var root = $('<div/>').addClass('calc-btn-lines-container');
			for (var l in buttons) {
				var line = $('<div/>').addClass('calc-btn-line');
				for (var i in buttons[l]) {
					var b = buttons[l][i];
					if (b.type=='action')
						line.append($('<input type="button" />').addClass('calc-btn calc-btn-classic calc-action').val(b.value).addClass(b.class));
					else if (b.type=='function')
						line.append($('<input type="button" />').addClass('calc-btn calc-btn-classic calc-btn-simple calc-function').val(b.value).addClass(b.class));
					else if (b.type=='value')
						line.append($('<input type="button" />').addClass('calc-btn calc-btn-classic calc-btn calc-value').val(b.value).addClass(b.class));
					else if (b.type=='libre')
						line.append($('<input type="button" />').addClass('calc-btn calc-btn calc-btn-free calc-function calc-droptarget').addClass(b.class));
				}
				root.append(line);
			}
			$(this).append(root);

			// List of functions
			var funcs = ["Math.cos", "Math.sqrt", "Math.sin", "Math.trunc", "Math.tan", "Math.E", "Math.abs", "Math.ceil", "Math.exp", "Math.floor", "Math.log", "Math.max", "Math.min", "Math.PI", "Math.pow", "Math.round"];

			// Append functions
			var list = $('<div/>').addClass('calc-list');
			list.append($('<b>').text('Liste des fonctions :'));
			list.append('<br/>');
			for (var i in funcs) {
				list.append($('<span draggable="false">').addClass('calc-drag').text(funcs[i]));
				if (i!=funcs.length-1)
					list.append(", ");
				else
					list.append('.');
			}
			$(this).append(list);



			// Initialization done
	    console.log("CALC LOADED");
			$.calc.init();
		}
  };

	$.calc = {
		version: "v0.1.0"
	}

	$.calc.init = function(){

		$(".calc-btn.calc-value").click(function(){$.calc.affiche($(this).parents(".calc"),$(this).val())})
		$(".calc-btn.calc-function").click(function(){$.calc.affiche($(this).parents(".calc"),$(this).val())})
		$(".calc-btn.calc-action").click(function(){$.calc.action($(this).parents(".calc"),$(this).val())})

	}
	var memory = undefined;

	$.calc.affiche = function(e,val){
		var aff = e.find(".calc-display");
  	var calc = aff.val();
  	var res = calc.concat(val);
  	aff.val(res);
	}

	$.calc.action = function(e,val){
		if(val=="MS"){
			$.calc.save_memory(e);
		}else if(val=="MC"){
			$.calc.raz_memory();
		}else if(val=="MR"){
			$.calc.affiche_memory(e);
		}else if(val=="MD"){

		}else if(val=="+-"){
			$.calc.plusmoins(e);
		}else if(val=="CE"){
			$.calc.rab(e);
		}else if(val=="E"){
			$.calc.swicthEdit(e);
		}else if(val=="="){
			$.calc.calcul(e);
		}else {
			console.log("erreur");
		}
	}


	$.calc.calcul = function(e){
var calc = e.find(".calc-display").val();
try{
	var res = eval(calc);
	e.find(".calc-display").val(res);
}catch(err){
	alert("Saisie incorrecte !")
}
}

	$.calc.switchEdit = function(e) {
		e.classList.toggle('active');
		$(e).parents('.calc').find('.calc-list .calc-drag').attr('draggable',$.calc.isEditMode($(e).parents('.calc')));
	}

	$.calc.fixCustoms= function(e) {
		$(e).parents('.calc').find(".calc-btn.calc-btn-free").attr('type','button');
	}


	$.calc.rab = function(e){
		e.find(".calc-display").val("");
	}

	$.calc.plusmoins = function(e){
		var calc= e.find(".calc-display").val();
		if(calc.charAt(0)=='-'){
			e.find(".calc-display").val(calc.substr(1));
		}else{
		var	final = ('-').concat(calc);
			e.find(".calc-display").val(final);
		}
	}

	$.calc.save_memory = function(e){
		var regex = /^-?\d+\.?\d*$/;
		if(regex.test(e.find(".calc-display").val())){
			memory=e.find(".calc-display").val();
		}else{
			alert("La chaine doit contenir uniquement des chiffres, le caractère '-' au début, et un seul caractère '.'");
		}
	}

	$.calc.raz_memory = function(){
		memory = undefined;
	}

	$.calc.affiche_memory = function(e){
		if(memory != undefined){
			var aff = e.find(".calc-display").val();
			var add = aff.concat(memory);
			e.find(".calc-display").val(add);
		}else{
			alert("Acune valeur stocké");
		}
	}

	$.calc.editMode = function(e) {
	e.find('calc-btn calc-edit-mode').hasClass('active');
	}

	$.calc.init = function(e) {
		return true;
	}




}));
