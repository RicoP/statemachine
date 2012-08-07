#ifndef STREAMLINE_JS
#define STREAMLINE_JS

var __filename = "<UNKNOWN>"; 
var Streamline = (function() { 

function alert(message) {
	throw new Error(message); 
}

#include "../streamlinejs/lib/callbacks/require-stub.js"
#include "../streamlinejs/deps/narcissus/lib/jsdefs.js"
#include "../streamlinejs/deps/narcissus/lib/jslex.js"
#include "../streamlinejs/deps/narcissus/lib/jsparse.js"
#include "../streamlinejs/deps/narcissus/lib/jsdecomp.js"
#include "../streamlinejs/lib/callbacks/format.js"
#include "../streamlinejs/lib/callbacks/transform.js"
#include "../streamlinejs/lib/util/future.js"
#include "../streamlinejs/lib/callbacks/runtime.js"
#include "../streamlinejs/lib/callbacks/builtins.js"

return Streamline; 

}()); 

#endif 
