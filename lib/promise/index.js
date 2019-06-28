"use strict";

/**
 * @description 优雅的处理 async/await
 * @author Dizzy L
 * @param {Function} asyncFunc 
 * @returns {Array} [err, asyncResult] = true: [null, res] / false: [error, null]
 */
var promiseWithErrorCaptured = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(asyncFunc) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return asyncFunc();

                    case 3:
                        res = _context.sent;
                        return _context.abrupt("return", [null, res]);

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context["catch"](0);
                        return _context.abrupt("return", [_context.t0, null]);

                    case 10:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 7]]);
    }));

    return function promiseWithErrorCaptured(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.promiseWithErrorCaptured = promiseWithErrorCaptured;
exports.default = promiseWithErrorCaptured;