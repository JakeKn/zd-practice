
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
	model: Die,

	pickDice: function(needed){
		var picked = [];
		for (var i = 0; i < needed; i++){
			var rando = this.at(Math.floor((Math.random() * this.length)));
			picked.push(this.remove(rando));
		}
		return picked;

	}
});

var Hand = Backbone.Collection.extend({
	model: Die,

	initialize: function(models, options){
		this.shaker = options.shaker;
		this.table = options.table;
	},

	getDice: function(){
		this.each(function(die){
			die.set({value: null});
		});
		var needed =3-this.length;
		var picked = this.shaker.pickDice(needed);
		this.add(picked);
		console.log(picked);		


	},

	rollDice: function(){
		this.each(function(die){
			die.roll();
			console.log(die.get("value"));
		});
		this.score();

	},

	score: function(){
		var brains = this.where({value: "brains"});
		var shots = this.where({value: "shot"});
		this.table.add(this.remove(brains));
		this.table.add(this.remove(shots));
	}

});

var Table = Backbone.Collection.extend({
	model: Die,


	//   MAY NOT NEED THIS   

	initialize: function(models, options){
		this.hand = options.hand;
	}
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
	var table = new Table([],{hand: hand});
	var hand = new Hand([],{shaker: shaker, table: table});	

	window.shaker = shaker;
	window.hand = hand;
	window.table = table;

	$('body').append(view.el);

	$("#dice_roll").click(function(){
		die.roll();
		view.render();
	});
});


// How does that "hand" collection roll those dice?
// How does the hand collection show those on screen?
// Third collection for "table" where we store dice we are keeping score with










