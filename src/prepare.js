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

var uglyparse   = require("../UglifyJS/lib/parse-js.js"); 
var uglyprocess = require("../UglifyJS/lib/process.js"); 
var fs          = require("fs"); 

var source = fs.readFileSync(process.argv[2]).toString() 
var ast = uglyparse.parse(source); 

//console.log(JSON.stringify(ast)); 
//throw ""; 

iterateOverCalls(ast, function(call) {
	var args = call[2]; 
	//console.log(" > " + JSON.stringify(args)); 
	args.push( ["name", "_"] ); //callback for streamline.js
});

iterateOverFunctionDefs(ast, function(func) {
	var args = func[2]; 
	args.push( ["_"] ); //callback for streamline.js
});

var newsource = uglyprocess.gen_code(ast); 

console.log(newsource); 

