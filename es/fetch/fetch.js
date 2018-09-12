'use strict';

var _require = require('./config.json'),
    baseUrl = _require.baseUrl,
    basePort = _require.basePort,
    basePath = _require.basePath;

/**
 * @function 检查返回值的状态
 * @param {any} response
 * @return {*} 
 */


function _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

/**
 * @function 解析返回值中的Response为JSON格式
 * @param {any} response 
 * @returns {*}
 */
function _parseJSON(response) {
    if (!!response) {
        return response.json();
    } else {
        return undefined;
    }
}

/**
 * @function 解析Text性质的返回
 * @param {any} response 
 * @returns {*}
 */
function _parseText(response) {
    if (!!response) {
        return response.text();
    } else {
        return undefined;
    }
}

/**
 * @function 封装的跨域请求方法
 * @param {any} packagedRequestURL 
 * @param {any} contentType 
 * @param {any} contentHeader 
 * @returns {*|Promise.<TResult>} 
 */
function _fetchWithCORS(packagedRequestURL, contentType, contentHeader) {
    return fetch(packagedRequestURL, {
        mode: 'cors',
        credentials: 'include',
        headers: Object.assign({}, contentHeader)
    }).then(_checkStatus).then(contentType === "json" ? _parseJSON : _parseText).catch(function (err) {
        return console.log(err);
    });
}

/**
 * @description 利用get方法发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, action = "GET", contentType = "json", contentHeader = {}, url } 
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{});
 */
function _get(_ref) {
    var _ref$base_url = _ref.base_url,
        base_url = _ref$base_url === undefined ? baseUrl : _ref$base_url,
        _ref$port = _ref.port,
        port = _ref$port === undefined ? basePort : _ref$port,
        _ref$path = _ref.path,
        path = _ref$path === undefined ? basePath : _ref$path,
        _ref$action = _ref.action,
        action = _ref$action === undefined ? "GET" : _ref$action,
        _ref$contentType = _ref.contentType,
        contentType = _ref$contentType === undefined ? "json" : _ref$contentType,
        _ref$contentHeader = _ref.contentHeader,
        contentHeader = _ref$contentHeader === undefined ? {} : _ref$contentHeader,
        url = _ref.url;

    var Url = url ? url : base_url + ':' + port;
    var packagedRequestURL = '' + Url + path + '?action=' + action;
    return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用get方法与封装好的QueryParams形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "GET", contentType = "json", contentHeader = {}, url} 
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _getWithQueryParams(_ref2) {
    var _ref2$base_url = _ref2.base_url,
        base_url = _ref2$base_url === undefined ? baseUrl : _ref2$base_url,
        _ref2$port = _ref2.port,
        port = _ref2$port === undefined ? basePort : _ref2$port,
        _ref2$path = _ref2.path,
        path = _ref2$path === undefined ? basePath : _ref2$path,
        _ref2$requestParams = _ref2.requestParams,
        requestParams = _ref2$requestParams === undefined ? {} : _ref2$requestParams,
        _ref2$action = _ref2.action,
        action = _ref2$action === undefined ? "GET" : _ref2$action,
        _ref2$contentType = _ref2.contentType,
        contentType = _ref2$contentType === undefined ? "json" : _ref2$contentType,
        _ref2$contentHeader = _ref2.contentHeader,
        contentHeader = _ref2$contentHeader === undefined ? {} : _ref2$contentHeader,
        url = _ref2.url;

    // 根据queryParams构造查询字符串    
    var queryString = "";
    for (var key in requestParams) {
        queryString += key + '=' + encodeURIComponent(requestParams[key]) + '&';
    }
    var Url = url ? url : base_url + ':' + port;
    // 将查询字符串进行编码
    var encodedQueryString = queryString;

    var packagedRequestURL = '' + Url + path + '?' + encodedQueryString + 'action=' + action;
    return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用get方法与封装好的RequestData形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "GET", contentType = "json", contentHeader = {}, url } 
 * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _getWithRequestData(_ref3) {
    var _ref3$base_url = _ref3.base_url,
        base_url = _ref3$base_url === undefined ? baseUrl : _ref3$base_url,
        _ref3$port = _ref3.port,
        port = _ref3$port === undefined ? basePort : _ref3$port,
        _ref3$path = _ref3.path,
        path = _ref3$path === undefined ? basePath : _ref3$path,
        _ref3$requestParams = _ref3.requestParams,
        requestParams = _ref3$requestParams === undefined ? {} : _ref3$requestParams,
        _ref3$action = _ref3.action,
        action = _ref3$action === undefined ? "GET" : _ref3$action,
        _ref3$contentType = _ref3.contentType,
        contentType = _ref3$contentType === undefined ? "json" : _ref3$contentType,
        _ref3$contentHeader = _ref3.contentHeader,
        contentHeader = _ref3$contentHeader === undefined ? {} : _ref3$contentHeader,
        url = _ref3.url;

    //将requestData序列化为JSON
    //注意要对序列化后的数据进行URI编码
    var requestDataString = encodeURIComponent(JSON.stringify(requestParams));
    var Url = url ? url : base_url + ':' + port;
    var packagedRequestURL = '' + Url + path + '?requestData=' + requestDataString + '&action=' + action;
    return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用post方法与封装好的RequestData形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "POST", contentType = "json", contentHeader = {}, url } 
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _postWithRequestData(_ref4) {
    var _ref4$base_url = _ref4.base_url,
        base_url = _ref4$base_url === undefined ? baseUrl : _ref4$base_url,
        _ref4$port = _ref4.port,
        port = _ref4$port === undefined ? basePort : _ref4$port,
        _ref4$path = _ref4.path,
        path = _ref4$path === undefined ? basePath : _ref4$path,
        _ref4$requestParams = _ref4.requestParams,
        requestParams = _ref4$requestParams === undefined ? {} : _ref4$requestParams,
        _ref4$action = _ref4.action,
        action = _ref4$action === undefined ? "POST" : _ref4$action,
        _ref4$contentType = _ref4.contentType,
        contentType = _ref4$contentType === undefined ? "json" : _ref4$contentType,
        _ref4$contentHeader = _ref4.contentHeader,
        contentHeader = _ref4$contentHeader === undefined ? {} : _ref4$contentHeader,
        url = _ref4.url;

    //将requestData序列化为JSON
    //注意要对序列化后的数据进行URI编码
    var requestDataString = encodeURIComponent(JSON.stringify(requestParams));
    var Url = url ? url : base_url + ':' + port;
    var packagedRequestURL = '' + Url + path + '?requestData=' + requestDataString + '&action=' + action;
    return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @function 抛出超时fetch方法
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, timeout = 120000ms, fetchType = "get", requestParams = {}, contentType = "json", url}
 * @argument {any} { fetchType = [get, getByQuery, getByRequest, post] }
 * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
module.exports = function (_ref5) {
    var _ref5$base_url = _ref5.base_url,
        base_url = _ref5$base_url === undefined ? baseUrl : _ref5$base_url,
        _ref5$port = _ref5.port,
        port = _ref5$port === undefined ? basePort : _ref5$port,
        _ref5$path = _ref5.path,
        path = _ref5$path === undefined ? basePath : _ref5$path,
        _ref5$timeout = _ref5.timeout,
        timeout = _ref5$timeout === undefined ? 120000 : _ref5$timeout,
        _ref5$fetchType = _ref5.fetchType,
        fetchType = _ref5$fetchType === undefined ? "get" : _ref5$fetchType,
        _ref5$requestParams = _ref5.requestParams,
        requestParams = _ref5$requestParams === undefined ? {} : _ref5$requestParams,
        _ref5$contentType = _ref5.contentType,
        contentType = _ref5$contentType === undefined ? "json" : _ref5$contentType,
        url = _ref5.url;

    var timeoutId = void 0,
        _fetch = void 0;
    var _arguments = {
        base_url: base_url,
        port: port,
        url: url,
        path: path,
        requestParams: requestParams,
        contentType: contentType
    };
    switch (fetchType) {
        case 'get':
            _fetch = _get(_arguments);
            break;
        case 'getByQuery':
            _fetch = _getWithQueryParams(_arguments);
            break;
        case 'getByRequest':
            _fetch = _getWithRequestData(_arguments);
            break;
        case 'post':
            _fetch = _postWithRequestData(_arguments);
            break;
        default:
            _fetch = fetch(base_url + ':' + port + path, {});
    }
    return Promise.race([new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () {
            reject('Fetch timeout.');
        }, timeout);
    }), _fetch]
    // fetch(`${base_url}${path}`, options),
    ).then(function (response) {
        clearTimeout(timeoutId);
        return response;
    }).catch(function (err) {
        return console.log(err);
    });
};