#ifndef UGLIFY_JS
#define UGLIFY_JS

#include "require.js" 

var Uglify = {}; 

(function(exports) { 
	#include "../UglifyJS/lib/parse-js.js"
}(Uglify)); 

(function(exports) { 
	#include "../UglifyJS/lib/process.js"
}(Uglify)); 

#endif 


