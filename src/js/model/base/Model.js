goog.provide("tt.model.base.Model");

goog.require("goog.events.Event");

goog.require("tt.model.base.ModelEvent");
 

/**
 * @constructor
 *
 */
tt.model.base.Model = function(data) {
	this._populate(data);
};

tt.model.base.prototype._createChangeEvent = function() {
	return new tt.model.base.ModelChangeEvent(this);
};

tt.model.base.prototype._populate = function(data) {
	var changeEvent = this._createChangeEvent();
};
