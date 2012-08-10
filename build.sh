#!/bin/sh
cpp src/compile.js -P -I include > compiler.js

rm lib.js
echo "#ifndef COMPILER_JS" >> lib.js 
echo "#define COMPILER_JS" >> lib.js
cat compiler.js >> lib.js
echo "#endif" >> lib.js 
