import { baseUrl, basePort, basePath } from "./config.json";

/**
 * @function 检查返回值的状态
 * @param {any} response
 * @return {*}
 */
function _checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
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
    mode: "cors",
    credentials: "include",
    headers: Object.assign({}, contentHeader)
  })
    .then(_checkStatus)
    .then(contentType === "json" ? _parseJSON : _parseText)
    .catch(err => console.log(err));
}

/**
 * @description 利用get方法发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, action = "GET", contentType = "json", contentHeader = {}, url }
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{});
 */
function _get({
  base_url = baseUrl,
  port = basePort,
  path = basePath,
  action = "GET",
  contentType = "json",
  contentHeader = {},
  url
}) {
  const Url = url ? url : base_url + ":" + port;
  const packagedRequestURL = `${Url}${path}?action=${action}`;
  return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用get方法与封装好的QueryParams形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "GET", contentType = "json", contentHeader = {}, url}
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _getWithQueryParams({
  base_url = baseUrl,
  port = basePort,
  path = basePath,
  requestParams = {},
  action = "GET",
  contentType = "json",
  contentHeader = {},
  url
}) {
  // 根据queryParams构造查询字符串
  let queryString = "";
  for (let key in requestParams) {
    queryString += `${key}=${encodeURIComponent(requestParams[key])}&`;
  }
  const Url = url ? url : base_url + ":" + port;
  // 将查询字符串进行编码
  let encodedQueryString = queryString;

  const packagedRequestURL = `${Url}${path}?${encodedQueryString}action=${action}`;
  return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用get方法与封装好的RequestData形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "GET", contentType = "json", contentHeader = {}, url }
 * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _getWithRequestData({
  base_url = baseUrl,
  port = basePort,
  path = basePath,
  requestParams = {},
  action = "GET",
  contentType = "json",
  contentHeader = {},
  url
}) {
  //将requestData序列化为JSON
  //注意要对序列化后的数据进行URI编码
  let requestDataString = encodeURIComponent(JSON.stringify(requestParams));
  const Url = url ? url : base_url + ":" + port;
  const packagedRequestURL = `${Url}${path}?requestData=${requestDataString}&action=${action}`;
  return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @description 利用post方法与封装好的RequestData形式发起请求
 * @author Dizzy L
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, requestParams = {}, action = "POST", contentType = "json", contentHeader = {}, url }
 * @returns  {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
function _postWithRequestData({
  base_url = baseUrl,
  port = basePort,
  path = basePath,
  requestParams = {},
  action = "POST",
  contentType = "json",
  contentHeader = {},
  url
}) {
  //将requestData序列化为JSON
  //注意要对序列化后的数据进行URI编码
  let requestDataString = encodeURIComponent(JSON.stringify(requestParams));
  const Url = url ? url : base_url + ":" + port;
  const packagedRequestURL = `${Url}${path}?requestData=${requestDataString}&action=${action}`;
  return _fetchWithCORS(packagedRequestURL, contentType, contentHeader);
}

/**
 * @function 抛出超时fetch方法
 * @param {any} { base_url = baseUrl, port = basePort, path = basePath, timeout = 120000ms, fetchType = "get", requestParams = {}, contentType = "json", url}
 * @argument {any} { fetchType = [get, getByQuery, getByRequest, post] }
 * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{})
 */
export const myFetch = ({
  base_url = baseUrl,
  port = basePort,
  path = basePath,
  timeout = 120000,
  fetchType = "get",
  requestParams = {},
  contentType = "json",
  url
}) => {
  let timeoutId, _fetch;
  const _arguments = {
    base_url,
    port,
    url,
    path,
    requestParams,
    contentType
  };
  switch (fetchType) {
    case "get":
      _fetch = _get(_arguments);
      break;
    case "getByQuery":
      _fetch = _getWithQueryParams(_arguments);
      break;
    case "getByRequest":
      _fetch = _getWithRequestData(_arguments);
      break;
    case "post":
      _fetch = _postWithRequestData(_arguments);
      break;
    default:
      _fetch = fetch(`${base_url}:${port}${path}`, {});
  }
  return Promise.race([
    new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject("Fetch timeout.");
      }, timeout);
    }),
    _fetch
    // fetch(`${base_url}${path}`, options),
  ])
    .then(response => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch(err => console.log(err));
};
