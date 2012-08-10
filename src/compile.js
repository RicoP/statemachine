#include <require.js>  
#include <uglify.js>
#include <streamline.js> 


var Compiler = (function() { 
"use strict"; 

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

return {
	"underscore" : function(source) {
		var ast = Uglify.parse(source); 

		iterateOverCalls(ast, function(call) {
			var args = call[2]; 
			args.unshift( ["name", "_"] ); //callback for streamline.js
		});

		iterateOverFunctionDefs(ast, function(func) {
			var args = func[2]; 
			args.unshift( ["_"] ); //callback for streamline.js
		});

		return Uglify.gen_code(ast); 
	},
	"makeasync" : function(source) {
		return Streamline.transform(source); 
	}
};

}()); 
