/**
 * @description 优雅的处理 async/await
 * @author Dizzy L
 * @param {Function} asyncFunc 
 * @returns {Array} [err, asyncResult] = true: [null, res] / false: [error, null]
 */
async function promiseWithErrorCaptured(asyncFunc) {
    try {
        let res = await asyncFunc();
        return [null, res];
    } catch (e) {
        return [e, null];
    }
}
exports.promiseWithErrorCaptured = promiseWithErrorCaptured;
exports.default = promiseWithErrorCaptured;
