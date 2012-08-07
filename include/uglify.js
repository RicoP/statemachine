#ifndef UGLIFY_JS
#define UGLIFY_JS

#include "require.js" 

var Uglify = {}; 

(function(export) { 
	#include "../UglifyJS/lib/parse-js.js"
}(Uglify)); 

(function(export) { 
	#include "../UglifyJS/lib/process.js"
}(Uglify)); 

#endif 


