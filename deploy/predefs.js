function Print(callback /*, arg1, arg2, arg3, ... */) {
	var args = Array.prototype.slice.call(arguments);
	args.shift(); 
	var message = args.join(" "); 
	console.log(message); 
	$("#output").html(message); 
	if(callback) callback(); 
}

function Choose(callback, message, a, b) {
	Print(null, "Choose:", message, a, b);
	var answer = ((confirm((("You want a " + a + "?"))) ? a : b));
	callback(null, answer);
}

function Say(callback, message) {
	Print(null, "Say:", message);
	window.setTimeout(callback, 2000);
}

function GiveItem(callback, item) {
	Print(null, "GiveItem:", item);
	window.setTimeout(callback, 2000);
}

function Sleep(callback, time) {
	window.setTimeout(callback, time); 
}

function OnTrigger(callback, func) {
	window.onTrigger = func;
	if(callback) callback(); 
}


var Game = { gold : 5 }; 

