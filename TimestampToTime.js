
/**
 * @description 时间戳->日期格式
 * @author Dizzy L
 * @param {any} timestamp 
 * @returns 
 */
const TimestampToTime = (timestamp) => {
    let Y, M, D, h, m, s;
    const length = timestamp.toString().length;
    const date = new Date(length === 13 ? parseInt(timestamp, 10) : parseInt(timestamp, 10) * 1000);
    function lt10change(val) {
        return parseInt(val, 10) < 10 ? `0${val}` : val;
    }
    Y = date.getFullYear();
    M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    D = lt10change(date.getDate());
    h = lt10change(date.getHours());
    m = lt10change(date.getMinutes());
    s = lt10change(date.getSeconds());
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};


module.exports = {
    TimestampToTime,
};