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

	$.calc.editMode = function(e) {
		return e.find('calc-btn calc-edit-mode').hasClass('active');
	}

	$.calc.init = function(e) {
		return true;
	}

}));
