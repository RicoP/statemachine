

function Choose(callback, message, a, b) {
	console.log("Choose:", message, a, b);
	var answer = ((confirm((("Willste " + a))) ? a : b));
	callback(null, answer);
}

function Say(callback, message) {
	console.log("Say:", message);
	window.setTimeout(callback, 2000);
}

function GiveItem(callback, item) {
	console.log("GiveItem:", item);
	window.setTimeout(callback, 2000);
}

function OnTrigger(callback, func) {
	window.onTrigger = func;
	if(callback) callback(); 
}

var Game = { gold : 6 }; 

