export const regexMapper = {
  // a标签
  aHrefReg: /href="([-A-Za-z0-9+&@#/%?=~_|!:,.;]+)"/,
  // 中文字符和全角字符
  chineseReg: /[\u4e00-\u9fa5\uFE30-\uFFA0]+/,
  // 中文姓名
  chineseNameReg: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
  // 邮箱
  emailReg: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
  // 身份证
  identity: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // 图片链接
  imgReg: /(((https?|ftp|file)\:\/\/)?[-A-Za-z0-9+&@#/%?=~_|!:,.;\u4e00-\u9fa5\uFE30-\uFFA0]+[-A-Za-z0-9+&@#/%=~_|]?\.(jpg|jpeg|gif|bmp|bnp|png))/i,
  // IP地址
  ip: /(\d+\.\d+\.\d+.\d+)/,
  // url链接
  urlReg: /((https?|ftp|file)\:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/,
  // yyyy-MM-dd格式的日期
  yyyyMMddReg: /(\d\d\d\d-\d\d-\d\d)/,
  // 手机号
  phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
};
