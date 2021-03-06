﻿Panel = function() {}

Panel.prototype.show = function (panelURI, values, fields){
    var prefsURI = panelURI.replace(".xml", ".json");
    var panel = eval(FLfile.read(panelURI));

    if (fields){
        panel.appendChild(fields);
    }

    var prefsStr = FLfile.read(prefsURI);
    var prefs = prefsStr.length > 0 ? JSON.parse(prefsStr) : {};
    var fields = panel.descendants();
    for (var n in fields){
        var field = fields[n];
        var id = field.@id.toString();
        if (id){
            if (values && values[id]){
                this.populateField(field, values[id]);
            } else if (prefs[id]){
                this.populateField(field, prefs[id]);
            }
        }
    }
    
    var panelOutput = this.showXMLPanel(panel);
    if (panelOutput.dismiss == "accept"){
        FLfile.write(prefsURI, JSON.stringify(panelOutput));
    }
    return panelOutput;
}

Panel.prototype.populateField = function(field, value){
    switch (field.name().toString()){
        case "textbox":
        case "label":
            field.@value = value;
            break;
        case "checkbox":
            field.@checked = value;
            break;
        case "radio":
            field.@selected = value;
            break;
    }
}

Panel.prototype.showXMLPanel = function(xmlString){
    return fl.xmlPanelFromString(xmlString);
}