﻿fl.outputPanel.clear();// INCLUDE:var UTIL_PATH = fl.configURI + "Commands/BannerToolkit/utils/";eval(FLfile.read(UTIL_PATH + "Include.jsfl"));include(UTIL_PATH + "Log.jsfl");include(UTIL_PATH + "Json2.jsfl");include(UTIL_PATH + "Utils.jsfl");include(UTIL_PATH + "Panel.jsfl");var utils = new Utils();var panel = new Panel();// CLASS:var PANEL = fl.configURI + "Commands/BannerToolkit/Publish Fallbacks.xml";var SIZECHART = fl.configURI + "Commands/BannerToolkit/Publish Fallbacks Size Chart.json";var VERSION_PREFIX = "version_";init();function init(){	clearLog();	showPanel();}function showPanel(){	var sizeChartStr = FLfile.read(SIZECHART);    var sizeChart = sizeChartStr.length > 0 ? JSON.parse(sizeChartStr) : {};    var idArr = [];	var fields = <grid><columns><column/><column/></columns><rows/></grid>;	fields.rows[0].appendChild(<row><label value="Target file size: (kb)                        "></label></row>);	var c = 1;	for(var i=0; i< fl.documents.length; i++){		var doc = fl.documents[i];		var plainName = doc.name.replace(".fla", "");		var id = plainName.match(/\d{2,4}x\d{2,4}/gi)[0];		if (idArr.indexOf(id) == -1){			idArr.push(id);			fields.rows[0].appendChild(<row />);			var row = fields.rows[0].row[c];			row.appendChild(<label />);			row.label.@value = id + ":";			row.appendChild(<textbox />);			row.textbox.@id = VERSION_PREFIX + id;			row.textbox.@value = "50";			c++;		}	}	var panelOutput = panel.show(PANEL, sizeChart, fields);    if (panelOutput.dismiss == "accept"){    	for (var n in panelOutput){    		if (n.indexOf(VERSION_PREFIX) > -1){    			sizeChart[n] = panelOutput[n];    		}    	}    	FLfile.write(SIZECHART, JSON.stringify(sizeChart));        showPanelResult(panelOutput);    }}function showPanelResult(result){	var fallbackFrame = result.fallbackFrame;	var sizeReport = result.sizeReportCheckbox == "true";	var smoothing = result.smoothingCheckbox == "true";		var flashQuality = -1;	if (result.flashQualityCheckbox == "true"){		flashQuality = parseInt(result.flashQuality);	}	var jpgQuality = -1;	if (result.jpgQualityCheckbox == "true"){		jpgQuality = parseInt(result.jpgQuality);	}	var publishJPG = result.jpgCheckbox == "true";	var publishGIF = result.gifCheckbox == "true";		publishFallbacks(fallbackFrame, flashQuality, jpgQuality, publishJPG, publishGIF, sizeReport, smoothing);	var publishToFileSize = result.publishToFileSizeCheckbox == "true";	if (publishToFileSize){		var publishToFileSizeData = {};		var publishToFileSizeStartQuality = parseInt(result.publishToFileSizeStartQuality);		var publishToFileSizeInterval = parseInt(result.publishToFileSizeInterval);		for (var n in result){				if (n.indexOf(VERSION_PREFIX) > -1){				var id = n.match(/\d{2,4}x\d{2,4}/gi)[0];					publishToFileSizeData[id] = result[n];				}			}			utils.publishAllToFileSize(publishToFileSizeData, publishToFileSizeStartQuality, publishToFileSizeInterval);		}	traceLog();}function publishFallbacks(fallbackFrame, flashQuality, jpgQuality, publishJPG, publishGIF, sizeReport, smoothing) {	var source = fl.getDocumentDOM();	var fileURI = source.pathURI;	var fileName = fileURI.split("/").pop();	var folderPath = fileURI.split(fileName)[0];	utils.createSettingsYML(folderPath + "deploy/");	for(var i=0; i< fl.documents.length; i++){		var doc = fl.documents[i];		if (doc.pathURI){			var filePath = doc.pathURI;			filePath = filePath.substring(0, filePath.lastIndexOf(doc.name));			filePath += "deploy/";			FLfile.createFolder(filePath);		}		fl.setActiveWindow(doc);		utils.setSmoothing(doc.library, smoothing);		var plainName = doc.name.replace(".fla", "");		var xml = eval(doc.exportPublishProfileString());		var publishProps = xml..PublishFormatProperties;		publishProps.defaultNames = 0;		publishProps.flash = 1;		publishProps.html = 0;		publishProps.gif = (publishGIF ? 1 : 0);		publishProps.jpeg = (publishJPG ? 1 : 0);		publishProps.png = 0;		publishProps.qt = 0;		publishProps.rnwk = 0;		publishProps.swc = 0;		publishProps.flashDefaultName = 0;		publishProps.flashFileName = "deploy/" + plainName+ ".swf";		publishProps.jpegDefaultName = 0;		publishProps.jpegFileName = "deploy/" + plainName+ "_fallback.jpg";		publishProps.gifDefaultName = 0;		publishProps.gifFileName = "deploy/" + plainName+ "_fallback.gif";		var flashProps = xml..PublishFlashProperties; 		flashProps.DebuggingPermitted = 0;		flashProps.IncludeXMP = 0;		if (flashQuality >= 0) {			flashProps.Quality = flashQuality;		}		flashProps.PackagePaths = "src;";		flashProps.Report = (sizeReport ? 1 : 0);		if (jpgQuality >= 0) {			var jpgProps = xml..PublishJpegProperties;			jpgProps.Quality = jpgQuality;		}		var gifProps = xml..PublishGifProperties;		gifProps.PaletteOption = "Adaptive";		doc.importPublishProfileString(xml);		doc.editScene(0);		var timeline = doc.timelines[0];		if (parseInt(fallbackFrame)){			fallbackFrameNum = parseInt(fallbackFrame) - 1;		} else {			outer: for (var j=0;j<timeline.layers.length;j++) {				var layer = timeline.layers[j];				for (var k=0;k<layer.frames.length;k++) {					var frame = layer.frames[k];					if (fallbackFrame == frame.name){						fallbackFrameNum = k;						break outer;					}				}			}		}		log("Fallback frame for", plainName + ".swf","is", fallbackFrameNum + 1);		timeline.currentFrame = fallbackFrameNum;		fl.getDocumentDOM().publish();		fl.saveDocument(doc);	}}