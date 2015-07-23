
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

		needed = Math.min(needed, this.length);

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
		this.moveToTable();
		this.each(function(die){
			die.set({value: null});
		});
		var needed =3-this.length;
		var picked = this.shaker.pickDice(needed);
		this.add(picked);
		console.log(picked);		

		return this;
	},

	rollDice: function(){
		this.each(function(die){
			die.roll();
			console.log(die.get("value"));
		});
		return this;
	},

	moveToTable: function(){
		var brains = this.where({value: "brains"});
		var shots = this.where({value: "shot"});
		this.table.add(this.remove(brains));
		this.table.add(this.remove(shots));
		this.table.score();
	}

});

var Table = Backbone.Collection.extend({
	
	initialize: function(models, options){
		this.hand = options.hand;
	},

	score: function(){
		var brains = this.where({value: "brains"}).length;
		var shots = this.where({value: "shot"}).length;
		var score = "Brains: " + brains + " Shots: " + shots;
		console.log(score);
		$('#scoreboard').html(score);
	}
});


// ------------------------------
// VIEWS
// ------------------------------

var HandView = Backbone.View.extend({
	className: 'hand',
	
	initialize: function(options){
		this.shaker = options.shaker;
		this.hand = options.hand;
		this.table= options.table;
		this.listenTo(this.hand, 'add', this.createDieView);
	},

	render: function(){
		this.$el.html();
		return this;
	}, 

	createDieView: function(model){
		var view = new DieView({ model: model });
		view.render();
		this.$el.append(view.el);
	}
});

var DieView = Backbone.View.extend({
	className: 'die', 
	template: _.template($('#dieTemplate').html()),
	render: function(){
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
	},

	initialize: function(options){
		this.listenTo(this.model, 'change', this.render );
		this.listenTo(this.model, 'remove', this.remove);
	}
});

var ControlsView = Backbone.View.extend({

	events: {
		"click #start_turn": "startTurn",
		"click #go_again": "goAgain",
		"click #end_turn" : "endTurn",
		"click #roll_dice": "rollDice"
	},

	initialize: function(options){
		this.shaker = options.shaker;
		this.hand = options.hand;
		this.table= options.table;
		this.handvis=options.handvis;
		this.el = options.el;
	},

	startTurn: function(){
		this.table.each(function(model){
			this.shaker.add(this.table.remove(model));
		});
		this.hand.getDice();
	},

	goAgain: function(){
		this.hand.getDice();
		
	},

	rollDice: function(){
		this.hand.rollDice();
	}, 

	endTurn: function(){
		this.hand.moveToTable();
	}

});


// ------------------------------
// MAIN
// ------------------------------

$(document).ready(function(){
	
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
	var handvis= new HandView({shaker: shaker, table: table, hand: hand});
	var controlsView = new ControlsView({
		el: '#controls',
		shaker: shaker,
		table: table,
		hand: hand,
		handvis: handvis
	});
	window.controlsView = controlsView;

	/*window.shaker = shaker;
	window.hand = hand;
	window.table = table;
	window.handvis=handvis;*/

	$('body').append(handvis.el);

	/*$("#dice_roll").click(function(){
		die.roll();
		view.render();
	});*/
});

// controlsView











