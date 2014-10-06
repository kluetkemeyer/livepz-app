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


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
tt.tpl.base.page = function(opt_data, opt_ignored) {
  return '\t<div class="ui-page ui-page-theme-a ui-page-active"><div class="ui-header ui-bar-inherit ui-header-fixed "><h1 class="ui-title">' + soy.$$escapeHtml(opt_data.title) + '</h1></div><div class="ui-content"></div><div class="ui-footer ui-bar-inherit ui-footer-fixed"></div></div>';
};
