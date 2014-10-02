// This file was automatically generated from base.soy.
// Please don't edit this file by hand.

goog.provide('tt.tpl.base');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
tt.tpl.base.headline = function(opt_data, opt_ignored) {
  return '\t<h1>' + soy.$$escapeHtml(opt_data.title) + '</h1>';
};
