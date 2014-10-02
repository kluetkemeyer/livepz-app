goog.provide("tt.model.base.ModelEvent");

goog.require("goog.events.Event");

/**
 * @const
 */
tt.model.base.ModelChangeEvent.TYPE = "modelChange";

/**
 * Creates an event, to inform all listeners, an object had changed.
 *
 * @param {T} The object, that had changed.
 * @constructor
 * @template T
 * @extends {goog.events.Event}
 */
tt.model.base.ModelChangeEvent = function(model) {
	goog.events.Event.call(this, tt.model.base.ModelChangeEvent.TYPE, model);
};
goog.inherits(tt.model.base.ModelChangeEvent, goog.events.Event);
