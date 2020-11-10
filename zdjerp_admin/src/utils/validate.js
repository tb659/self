/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 首位不为0,最多2位小数
 */
export function checkMoney (s) {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(s)
}
/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
/**
 * 验证手机号或者电话号
 * @param s
 * @returns {boolean}
 */
export function isPhoneOrMobile (s) {
  return /^((([0-9]{3,4}-)?[0-9]{7,8})|(1[0-9]{10}))$/.test(s)
}
/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
/**
 *校验是否为整数
 *
 */
export function checkInterNum (s) {
  return /^[0-9]*[1-9][0-9]*$/.test(s)
}
