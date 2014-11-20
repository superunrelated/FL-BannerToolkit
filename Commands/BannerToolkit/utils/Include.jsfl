// USAGE: 
// eval(fl.configURI + "Commands/utils/Include.jsfl");
//include(fl.configURI + "Commands/utils/" + "Utils.jsfl");
included = {};
include = function(file) {
	if (included[file]) { return; }
	included[file] = true;
	eval(FLfile.read(file));
}