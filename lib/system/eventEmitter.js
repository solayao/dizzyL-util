"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description 事件发布器
 * @author Dizzy L
 */
var EventEmitter = function () {
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this.subs = {};
	}

	_createClass(EventEmitter, [{
		key: "on",
		value: function on(event, cb) {
			(this.subs[event] || (this.subs[event] = [])).push(cb);
		}
	}, {
		key: "once",
		value: function once(event, onceCb) {
			var _this = this;

			var cb = function cb() {
				onceCb.apply(undefined, arguments);
				_this.off(event, onceCb);
			};
			this.on(event, cb);
		}
	}, {
		key: "off",
		value: function off(event, offCb) {
			if (this.subs[event]) {
				var index = this.subs[event].findIndex(function (cb) {
					return cb === offCb;
				});
				if (index !== -1) this.subs[event].splice(index, 1);
				if (!this.subs[event].length) delete this.subs[event];
			}
		}
	}]);

	return EventEmitter;
}();

var eventEmitter = new EventEmitter();
module.exports = eventEmitter;