goog.provide("tt.app.start");

goog.require('tt.tpl.base');

tt.app.start = function(parent) {
	var h1 = tt.tpl.base.headline({title:'TEST'});
	document.write(h1);
}
