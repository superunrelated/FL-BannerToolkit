log = function() {
	var str = "";
	for (i=0; i<arguments.length; i++){
		str += (i!=0 ? " " : "") + arguments[i];
	}
	fl.trace(str);

	if (!logString){
		logString = "";
	}
	logString += str + "\n";
}

clearLog = function() {
	logString = undefined;
}

traceLog = function() {
	fl.outputPanel.clear();
	fl.trace("TRACING LOG:");
	fl.trace(logString);
	clearLog();
}