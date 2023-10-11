type RegType =
	| "mobile"
	| "email"
	| "id"
	| "password"
	| "zh"
	| "phone"
	| "space"
	| "num"
	| "account"

const lib = {
	mobile: /^[1][3,4,5,7,8,9][0-9]{9}$/, // 手机号
	email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 邮箱
	id: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证号
	password: /^[A-Za-z0-9]+$/, // 密码（英文+数字）
	zh: /^[\u2E80-\u9FFF]+$/, // 汉字
	phone: /^0\d{2,3}-?\d{7,8}$/, // 座机固话
	space: /\s/, // 空格
	num: /^[0-9]+$/, // 数字
	account: /^[A-Za-z0-9]+$/, // 账号（英文+数字）
}
/**
 * @description 正则验证
 * @param 	
 * mobile: /^[1][3,4,5,7,8,9][0-9]{9}$/, // 手机号
	email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 邮箱
	id: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证号
	password: /^[A-Za-z0-9]+$/, // 密码（英文+数字）
	zh: /^[\u2E80-\u9FFF]+$/, // 汉字
	phone: /^0\d{2,3}-?\d{7,8}$/, // 座机固话
	space: /\s/, // 空格
	num: /^[0-9]+$/, // 数字
	account: /^[A-Za-z0-9]+$/, // 账号（英文+数字） 
 * @param string 
 * @returns boolean
 */
export const regTest = (regType: RegType, str: string): boolean =>
	lib[regType].test(str)
