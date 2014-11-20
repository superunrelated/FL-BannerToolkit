Utils = function() {}

Utils.prototype.setSmoothing = function(library, smoothing) {
	for (var i = 0; i < library.items.length; i++){
		var libItem = document.library.items[i];
		if (libItem.itemType == "bitmap"){
			libItem.allowSmoothing = smoothing;
		}
	}
}

Utils.prototype.createSettingsYML = function(folder) {
	var URI = folder + "settings.yml";
	if (!fl.fileExists(URI)){
		var settings = "view:list\nflash:\n  flashvars:\n    clickTAG:http://www.apt.no";
    	FLfile.write(URI, settings);
	}
}

Utils.prototype.publishToFileSize = function(doc, targetSize, startQuality, targetInterval) {
	var fileURI = doc.pathURI;
    var fileName = fileURI.split("/").pop();
    var folderPath = fileURI.split(fileName)[0];
	var xml = eval(doc.exportPublishProfileString());
	var swfFile = folderPath + xml..PublishFormatProperties.flashFileName;
	var sizeReached = false;
	var iterations = parseInt(startQuality / targetInterval);

	log(fileName + " -> target:" + targetSize, "interval:" + targetInterval, "iterations:" + iterations);

	for(var i=0; i< iterations; i++){
		var flashProps = xml..PublishFlashProperties; 
		var quality = startQuality - (targetInterval * i);
		flashProps.Quality = quality;
		doc.importPublishProfileString(xml);
		doc.publish();

		if (FLfile.exists(swfFile)){
			var fileSize = parseInt(FLfile.getSize(swfFile) / 1000);
			log("Quality:" + quality, "KB:" + fileSize);
			if (fileSize < targetSize){
				sizeReached = true;
				break;
			}
		}
	}
	
	doc.save();

	if (sizeReached){
		log(fileName + " -> TARGET SIZE HAS BEEN REACHED. :)\n");
	} else {
		log(fileName + " -> TARGET SIZE CAN'T BE REACHED. :(\n");
	}
}

Utils.prototype.publishAllToFileSize = function(targetSizes, startQuality, targetInterval) {
	for(var i=0; i< fl.documents.length; i++){
		var doc = fl.documents[i];
		var id = doc.name.match(/\d{2,4}x\d{2,4}/gi)[0];
		var targetSize = targetSizes[id];
		this.publishToFileSize(doc, targetSize, startQuality, targetInterval);
	}
}