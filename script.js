


var Dice = Backbone.Collection.extend({
	model: Die 
});


var Die = Backbone.Model.extend({
		roll: function(){
		var result = Math.floor((Math.random() * 6));
		return result;
	} 
});

console.log(die.roll());











