fl.outputPanel.clear();
// INCLUDE:
var UTIL_PATH = fl.configURI + "Commands/BannerToolkit/utils/";
eval(FLfile.read(UTIL_PATH + "Include.jsfl"));
include(UTIL_PATH + "Log.jsfl");
include(UTIL_PATH + "Json2.jsfl");
include(UTIL_PATH + "Utils.jsfl");
include(UTIL_PATH + "Panel.jsfl");

var utils = new Utils();
var panel = new Panel();

// CLASS:

var FORMATS_PANEL = fl.configURI + "Commands/BannerToolkit/Create Versions formats.xml";
var SETTINGS_PANEL = fl.configURI + "Commands/BannerToolkit/Create Versions settings.xml";

var versions = new Array();
var resize = new Array();
var align = new Array();
var smoothing = false;
var deleteUnused = false;

init();

function init(){
    clearLog();
    showVersionsPanel();
}

function showVersionsPanel(){
    var panelOutput = panel.show(FORMATS_PANEL);
    if (panelOutput.dismiss == "accept"){
        parseVersionsPanel(panelOutput);
    };
}

function parseVersionsPanel(result) {
    var v = result["versions"];
    vArr = v.match(/\d{2,4}x\d{2,4}/gi);
    for (var i = 0; i < vArr.length; i++) {
        var id = vArr[i];
        var sizeArr = id.split("x");
        var w = parseInt(sizeArr[0]);
        var h = parseInt(sizeArr[1])
        if ( !isNaN(w) && !isNaN(h) && idIsUnique(versions, id)){
            versions.push({
                id: id,
                w: parseInt(sizeArr[0]),
                h: parseInt(sizeArr[1])
            });
        };
    };

    showSettingsPanel();
}

function idIsUnique(versions, id){
    for (var i = 0; i<versions.length; i++) {
        var o = versions[i];
        if (o.id == id){
            return false; 
        }
    }
    return true;
}

function showSettingsPanel(){
    var vStr = "";
    for (var n in versions){
        vStr += versions[n].id + ", ";
    }

    var panelOutput = panel.show(SETTINGS_PANEL, {versions:vStr});
    if (panelOutput.dismiss == "accept"){
        parseSettingsPanel(panelOutput);
    }
}

function parseSettingsPanel(result){
    smoothing = result.smoothingCheckbox == "true";
    deleteUnused = result.deleteUnused == "true";
    for (var name in result) {
        if (result[name] == "true") {
            if (name.indexOf("resize") != -1) {
                var instanceName = result[name.replace("Checkbox", "Instance")];
                if (instanceName.length > 0){
                    resize.push(instanceName);
                }
            } else if (name.indexOf("align") != -1) {
                var obj = {
                    instance: result[name.replace("Checkbox", "Instance")],
                    h: result[name.replace("Checkbox", "Horizontal")],
                    v: result[name.replace("Checkbox", "Vertical")]
                }
                log(obj.h, obj.v);
                align.push(obj);
            }
       	}
    }
    setupDocumentForVersioning();
    createDocuments();
}

function setupDocumentForVersioning(){
    var doc = fl.getDocumentDOM();
    doc.editScene(0);
    utils.setSmoothing(doc.library, smoothing);
    if (deleteUnused){
        deleteUnusedLibraryItems(doc);
    }
    fl.saveDocument(doc);
}

function deleteUnusedLibraryItems(doc){
    var items = doc.library.unusedItems;
    log("Number of unused items found: " + items.length);
    for (var i in items) {
        log("Deleting: ", items[i].name);
        doc.library.deleteItem(items[i].name);
    }
}

function createDocuments() {
    var source = fl.getDocumentDOM();
    var sourceW = source.width;
    var sourceH = source.height;

    var fileURI = source.pathURI;
    var fileName = fileURI.split("/").pop();
    var folderPath = fileURI.split(fileName)[0];
    var baseName = fileName.replace(".fla", "").replace(/[0-9]*x[0-9]*/, "");
	
    utils.createSettingsYML(folderPath + "deploy/");

    for (var j = 0; j < versions.length; j++) {
		var versionName = versions[j].w + "x" + versions[j].h + baseName;
        var versionURI = folderPath + versionName + ".fla";

        if (fl.fileExists(versionURI)) {
            alert("Cannot create file: " + versionName + " because it exists");
            continue;
        }

        var publishSettings = renamePublishSettings(source.exportPublishProfileString(), versionName);
        source.importPublishProfileString(publishSettings);
        source.width = versions[j].w;
        source.height = versions[j].h;

        resizeElements(source, resize);
        alignElements(source, align);

        source.saveAsCopy(versionURI);
    }


    // reset:
    source.width = sourceW;
    source.height = sourceH;
    resizeElements(source, resize);
    alignElements(source, align);
}

function renamePublishSettings(publishSettings, versionName){
    var xml = eval(publishSettings);
    var publishProps = xml..PublishFormatProperties;
    publishProps.flashFileName = "deploy/" + versionName + ".swf";
    publishProps.jpegFileName = "deploy/" + versionName + "_fallback.jpg";
    publishProps.gifFileName = "deploy/" + versionName + "_fallback.gif";
	return xml;
}

function getFonts(document) {
	var data = {}
	for (var i = 0; i < document.library.items.length; i++){
		var libItem = document.library.items[i];
		if (libItem.itemType == "font"){
			var font = {}
			for (var propName in libItem){
				var prop = libItem[propName];
				if (prop){
					font[propName] = libItem[propName]
				}
			}
			data[libItem.name] = font;
		}
	}
	return data;
}

function embedFonts(document, fonts) {
    fl.trace("fonts:" + JSON.stringify(fonts));
	for (var fontName in fonts){
        fl.trace("fontName:" + fontName);
		var font = fonts[fontName];
		document.library.addNewItem('font', fontName);
		var index = document.library.findItemIndex(fontName);
		if (index > -1) {
			var newFont = document.library.items[index];
			for (name in font){
				newFont[name] = font[name];
			}
		}
	}
}

function alignElements(document, instances) {
    var timeline = document.getTimeline();
    timeline.currentFrame = 0;
    for (layerIndex in timeline.layers) {
        var layer = timeline.layers[layerIndex];
        for (frameIndex in layer.frames) {
            var frame = layer.frames[frameIndex];
            if (frameIndex == frame.startFrame) {
                for (elementIndex in frame.elements) {
                    var element = frame.elements[elementIndex];
                    for (var i = 0; i < instances.length; i++) {
                        var obj = instances[i];
                        if (obj.instance == element.name) {
                            switch (obj.h) {
                            case "top":
                                element.y = 0;
                                break;
                            case "middle":
                                element.y = document.height * .5;
                                break;
                            case "bottom":
                                element.y = document.height;
                                break;
                            }

                            switch (obj.v) {
                            case "left":
                                element.x = 0;
                                break;
                            case "center":
                                element.x = document.width * .5;
                                break;
                            case "right":
                                element.x = document.width;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function resizeElements(document, instances) {
    var timeline = document.getTimeline();
    timeline.currentFrame = 0;
    for (layerIndex in timeline.layers) {
        var layer = timeline.layers[layerIndex];
        for (frameIndex in layer.frames) {
            var frame = layer.frames[frameIndex];
            if (frameIndex == frame.startFrame) {
                for (elementIndex in frame.elements) {
                    var element = frame.elements[elementIndex];
                    if (instances.indexOf(element.name) != -1) {
                        element.width = document.width;
                        element.height = document.height;
                        element.matrix.tx = 0;
                        element.matrix.ty = 0;
                        element.x = 0;
                        element.y = 0;
                    }
                }
            }
        }
    }
}