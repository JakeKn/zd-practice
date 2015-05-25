



var die = {
	sides: ["shot!","brains","shot!","feet","shot!","feet"],
	roll: function(){
		var result = this.sides[Math.floor((Math.random() * 6))];
		return result;
	} 
};

$(document).ready(function(){
	$("#diceroll").click(function(){
		var result = die.roll();
		$(this).html(result);
	});
});











