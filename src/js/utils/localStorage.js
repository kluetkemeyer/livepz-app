goog.provide("tt.utils.localStorage");

/**
 * @public
 * @const
 */
tt.utils.localStorage.ERROR = {
	NO_JSON:				501,
	NO_LOCALSTORAGE:		502
};

/**
 * @private
 * @const
 */
tt.utils.localStorage.ERROR_MESSAGE = {};
tt.utils.localStorage.ERROR_MESSAGE[tt.utils.localStorage.ERROR.NO_JSON] = "Your browser doesn't support JSON";
tt.utils.localStorage.ERROR_MESSAGE[tt.utils.localStorage.ERROR.NO_LOCALSTORAGE] = "Your browser doesn't support local data storage";

/**
 * @private
 */
tt.utils.localStorage.json_ = window['JSON'];

/**
 * @private
 */
tt.utils.localStorage.storage_ = window['localStorage'];

/**
 * @private
 */
tt.utils.localStorage.defaultError_ = function(errCode, errMsg) {
};

/**
 * @private
 */
tt.utils.localStorage._error = function(errCode, errCallback) {
	var undefined;
	var msg = tt.utils.localStorage.ERROR_MESSAGE[errCode];
	if (errCallback == undefined) errCallback = tt.utils.localStorage.defaultError_;
	
	errCallback(errCode, msg);
};
