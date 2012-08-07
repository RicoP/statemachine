#ifndef REQUIRE_JS
#define REQUIRE_JS

function require(str) {
	if (str == "streamline/lib/util/flows") return Streamline.flows;
	else if (str == "streamline/lib/globals") return Streamline.globals;
	else if (str == "streamline/lib/callbacks/runtime") return Streamline.runtime;
	else if (str == "streamline/lib/callbacks/transform") return Streamline;
	else if (str == "streamline/lib/callbacks/builtins") return Streamline.builtins;
	else if (str == "streamline/lib/globals") return Streamline.globals;
	else if (str == "streamline/lib/util/future") return Streamline.future;
	else if (str == "./squeeze-more") return Uglify;
	else if (str == "./parse-js")     return Uglify;
	else if (str == "./process")      return Uglify;
	else {
		throw new Error("cannot require " + str)
	}
}

#endif REQUIRE_JS
