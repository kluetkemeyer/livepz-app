goog.provide("tt.app.start");

goog.require('tt.tpl.base');

tt.app.start = function(parent) {
	var container = tt.tpl.base.page({title:'TEST'});
	document.write(container);
}
