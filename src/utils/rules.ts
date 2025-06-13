const rules = {
  // 非空置
  verifyNotNull: /\S+/,
  // 空值
  verifyNull: /^$/,
  // 手机号
  verifyPhone: /^1\d{10}$/,
  // 精确手机号格式判断
  verifyPhoneAccurate: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
  // 包含手机号
  verifyHasPhone: /1\d{10}/,
  // 验证码
  verifyCode: /^\d{6}$/,
  // 中文姓名
  verifyName: /(^[\u2E80-\uFE4F.·•]{2,}$)|(^[a-zA-Z.·•]{2,}$)/,
  // 身份证号
  verifyIdcard: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // 地址
  verifyAddress: /^([\u4e00-\u9fa50-9A-Za-z\-_()]{1,})$/,
  // 邮箱
  verifyEmail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // IP
  verifyIP: /^((?:(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d))\.){3}(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d)))$/,
  // 网址
  verifyNetUrl: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$%&'\*\+,;=.]+$/,
  // 正数
  verifyPositiveNumber: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
  // 正整数
  positiveInteger: /^[1-9]\d*$/,
  // 非负整数 & 0101(第一位为0后面有其他数) 校验数字ID
  verifyNumber: /^\d+$/,
  // 非负整数
  verifyNonnegativeInteger: /(^[1-9]\d*$)|(^0$)/,
  // 兑换码(英文数字6位)
  couponNo: /^[0-9a-zA-Z]{6}$/,
  // 借记卡
  verifyCreditCardNo: /^[1-9]\d{14,20}$/,
  // 金额(两位小数)
  verifyPositiveMoney: /^[0-9]{1}\d*(\.\d{1,2})?$/
}

export default rules
