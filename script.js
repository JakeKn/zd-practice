
// ------------------------------
// CONSTANTS
// ------------------------------

var DIE_ATTRS = {
	red: {
		color: 	"red", 
		sides: 	["shot", "shot", "shot", "feet", "feet", "brains"]  
	},
	yellow: {
		color: 	"yellow", 
		sides: 	["shot", "shot", "feet", "feet", "brains", "brains"]
	},
	green: {
		color: "green",
		sides: 	["shot", "feet", "feet", "brains", "brains", "brains"]
	},
};


// ------------------------------
// MODELS
// ------------------------------

var Die = Backbone.Model.extend({
	defaults: {
		color: "biege",
		sides: [1, 2, 3, 4, 5, 6],
		value: null
	},

	roll: function(){
		if (this.get('value')) {
			return;
		}

		var result = Math.floor((Math.random() * 6));
		this.set({ "value": this.get('sides')[result] });
	} 
});


// ------------------------------
// COLLECTIONS
// ------------------------------

var Shaker = Backbone.Collection.extend({
	model: Die 
});


// ------------------------------
// VIEWS
// ------------------------------

var DieView = Backbone.View.extend({
	className: 'die', 
	template: _.template($('#dieTemplate').html()),
	render: function(){
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
	} 
});


// ------------------------------
// MAIN
// ------------------------------

$(document).ready(function(){
	var die = new Die(DIE_ATTRS.yellow);
	var view = new DieView({ model: die });

	var shaker = new Shaker([
		DIE_ATTRS.red,
		DIE_ATTRS.red,
		DIE_ATTRS.red,
		DIE_ATTRS.yellow,
		DIE_ATTRS.yellow,
		DIE_ATTRS.yellow,
		DIE_ATTRS.yellow,
		DIE_ATTRS.green,
		DIE_ATTRS.green,
		DIE_ATTRS.green,
		DIE_ATTRS.green,
		DIE_ATTRS.green,
		DIE_ATTRS.green
	]);

	window.shaker = shaker;

	$('body').append(view.el);

	$("#dice_roll").click(function(){
		die.roll();
		view.render();
	});
});


// How do we pull one die off the shaker?
// How do we pull `n` dice off the shaker?
// How do move them into a new collection?
// How does that "hand" collection roll those dice?
// How does the hand collection show those on screen?

// Third collection for "table" where we store dice we are keeping score with










