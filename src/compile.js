#include <require.js>  
#include <uglify.js>
#include <streamline.js> 

var SOURCE = 
'	var hasItem = true; ' +
'	OnTrigger(function() { ' +
'		if (hasItem) { ' +
'			if ((Game.gold >= 5)) { ' +
'				var answer = Choose("You have enough gold. you want a portion or a weapon?", "Portion", "Weapon"); ' +
'				GiveItem(answer); ' +
'				Say("Goodbye"); ' +
'				hasItem = false; ' +
'			} ' +
'			else { ' +
'				Say("Come back when you have enough money."); ' +
'			} ' +
'		} ' +
'		else { ' +
'			Say("Have a nice day."); ' +
'		} ' +
'	}); ';

function isCall(touple) {
	return touple[0] === "call" 
		   && touple[1] && touple[1][0] === "name"; 
}

function isFunctionDef(touple) {
	return touple[0] === "function"; 
}

function iterateOverCalls(touple, callback) {
	if(isCall(touple)) {
		callback(touple); 
		//return; 
	}

	for(var i = 0; i !== touple.length; i++) {
		var subtouple = touple[i]; 
		if(subtouple instanceof Array) { 
			iterateOverCalls(subtouple, callback); 
		}
	}
}

function iterateOverFunctionDefs(touple, callback) {
	if(isFunctionDef(touple)) {
		callback(touple); 
		//return; 
	}

	for(var i = 0; i !== touple.length; i++) {
		var subtouple = touple[i]; 
		if(subtouple instanceof Array) { 
			iterateOverFunctionDefs(subtouple, callback); 
		}
	}
}

function deepCopy(obj) {
	if (Object.prototype.toString.call(obj) === '[object Array]') {
		var out = [], i = 0, len = obj.length;
		for ( ; i < len; i++ ) {
			out[i] = deepCopy(obj[i]);
		}

		return out;
	}

	return obj;
}

var uglyparse   = Uglify;  
var uglyprocess = Uglify; 
//var fs          = require("fs"); 

var source = SOURCE; // fs.readFileSync(process.argv[2]).toString() 
var ast = uglyparse.parse(source); 

//console.log(JSON.stringify(ast)); 
//throw ""; 

iterateOverCalls(ast, function(call) {
	var args = call[2]; 
	//console.log(" > " + JSON.stringify(args)); 
	args.unshift( ["name", "_"] ); //callback for streamline.js
});

iterateOverFunctionDefs(ast, function(func) {
	var args = func[2]; 
	args.unshift( ["_"] ); //callback for streamline.js
});

var newsource = uglyprocess.gen_code(ast); 

console.log(newsource); 

try { 
	var codeOut = Streamline.transform(newsource);
	console.log(codeOut); 
	eval(codeOut); 
} 
catch (e) {
	console.error(e); 
}
