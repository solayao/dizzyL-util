/**
 * @description 优雅的处理 async/await
 * @author Dizzy L
 * @param {Function} asyncFunc
 * @returns {Array} [err, asyncResult] = true: [null, res] / false: [error, null]
 */
export const promiseWithErrorCaptured = async asyncFunc => {
  try {
    let res = await asyncFunc();
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};
