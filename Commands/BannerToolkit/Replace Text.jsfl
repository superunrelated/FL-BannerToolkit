var result = fl.getDocumentDOM().xmlPanel(fl.configURI + "Commands/BannerToolkit/Replace Text.xml");
if (result.dismiss == "accept"){
	fl.outputPanel.clear();	
	fl.trace("Search for '" + result.replaceText + "' and replace with '" + result.withText + "' regexp=" + result.regexp);
	replace(String(result.replaceText), String(result.withText), result.regexp == "true");
}

function replace(replaceText, withText, regexp) {
	for(d=fl.documents.length-1; d>-1; d--){
		var doc = fl.documents[d];
		var lib = doc.library;
		var item, timeline, layer, frame, element, text, resultText;
		for (var i=0;i<lib.items.length;i++) {
			item = lib.items[i];
			if (item.itemType == "movie clip" || item.itemType == "graphic" || item.itemType == "button"){
				timeline = item.timeline;
				if (timeline){
					for (var j=0;j<timeline.layers.length;j++) {
						layer = timeline.layers[j];
						for (var k=0;k<layer.frames.length;k++) {
							frame = layer.frames[k];
							for (var l=0;l<frame.elements.length;l++) {
								element = frame.elements[l];
								if (element.elementType == "text"){
									text = element.getTextString();
									if (regexp){
										resultText = text.replace(new RegExp(replaceText, "g"), withText);
									} else {
										resultText = text.replace(replaceText, withText);
									}
									element.setTextString(resultText)
									fl.trace(doc.name + ": '" + text + "' -> '" + resultText);
								}
							}
						}
					}
				}
			}
		}
	}
}