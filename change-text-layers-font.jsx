var console = {log: function(o) { $.writeln(o); }}

var Action = {
	applyAction: function(o, layerKind, callback) {
		if(o.typename == "LayerSet") {
			var layers = o.layers;
			for(var i=0; i<layers.length; i++) {
				this.applyAction(layers[i], layerKind, callback)
			}
		} else {
			if(o.kind == layerKind) callback(o);
		}
	}
}

var Utils = {
	excludeTexts: [],
	getFontPostScriptName: function(callback) {
		var font = prompt("Please type a font name", "");
		var fontObj = null;
		for(var i=0; i<app.fonts.length; i++) {
			if(app.fonts[i].name == font) {
				fontObj = app.fonts[i];
			}
		}
		if(fontObj) {
			callback(null, fontObj.postScriptName);
		} else {
			callback({message: "There is no font with name '" + font + "'"});
		}
	},
	addExcludeTexts: function(callback) {
		var strings = prompt("Type texts that should be excluded (separated by commas)", "");
		if(strings == "") {
			callback();
			return;
		}
		strings = strings.replace(/, /g, ",");
		this.excludeTexts = strings.split(",");
		callback();
	},
	checkForExcluding: function(str) {
		for(var i=0; i<this.excludeTexts.length; i++) {
			if(str == this.excludeTexts[i]) {
				return true;
			}
		}
		return false;
	}
}

Utils.getFontPostScriptName(function(err, postScriptName) {
	if(err != null) {
		alert(err.message); 
		return;
	}
	Utils.addExcludeTexts(function() {
		Action.applyAction(app.activeDocument.activeLayer, LayerKind.TEXT, function(layer) {
			if(!Utils.checkForExcluding(layer.textItem.contents)) {
				layer.textItem.font = postScriptName;
			}
		});
	});
});