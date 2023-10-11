export * from "./is"
export * from "./Enum"
export * from "./Date"
export * from "./Reg"
export * from "./Tree"
export * from "./file"

/**
 * @description 根据数字获取对应的英文字母
 * @params i=>被转换的数字  type => 转换结果大小写
 * @returns 英文字母
 * @example
 * numberGetLetter(0)=>'A'
 *
 */
export const numberGetLetter = (
	i: number,
	type: "Lower" | "Upper" = "Upper"
) => {
	if (type === "Upper") {
		return String.fromCharCode(65 + i)
	} else {
		return String.fromCharCode(97 + i)
	}
}

/**
 * @description 根据英文字母获取对应的数字
 * @params i=>被转换的字符
 * @returns 数字
 * @example
 * LetterGetNumber(a)=>0
 *
 */

export const LetterGetNumber = (i: string) => {
	return i.toUpperCase().charCodeAt(0) - 64
}

/**
 * @description 删除路径中多余的斜杠
 * @param path 路径
 * @returns 格式化后的路径
 */
export const FormatPath = (path: string) => {
	return path.replace(/[\/]+[\/]/g, "/").replace(":/", "://")
}
