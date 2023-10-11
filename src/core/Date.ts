export enum AGE_FORMAT {
	AGE = "age", // ${1}岁${2}个月零${3}天
	MONTH = "month", // ${1}个月零${2}天
	WEEK = "week", // ${1}周零${2}天
	DAYTH = "dayth", // ${1}天
}

const PER_DAY: number = 1000 * 60 * 60 * 24

/**
 * 根据出生日期返回格式化年龄
 * 数值为0时不返回计数单位，直到只剩天
 * @param birthday
 * @param format
 * @returns
 */
export function birthdayToAgeFormat(
	birthday: string | Date,
	format: AGE_FORMAT = AGE_FORMAT.AGE
): string {
	// 转换格式
	if (!(birthday instanceof Date)) {
		birthday = new Date(birthday)
	}

	// 当前时间
	const now: Date = new Date()

	// 当前日期小于出生日期返回空字符
	if (now < birthday) {
		return ""
	}

	// => ${1}天
	if (format === AGE_FORMAT.DAYTH) {
		return `${Math.floor(
			(now.getTime() - birthday.getTime()) / PER_DAY
		)}天`
	}

	// => ${1}周零${2}天
	if (format === AGE_FORMAT.WEEK) {
		const days: number = Math.floor(
			(now.getTime() - birthday.getTime()) / PER_DAY
		)
		const remainder: number = days % 7
		const weeks: number = Math.floor(days / 7)

		if (!remainder && !weeks) {
			return `0天`
		}
		if (!remainder) {
			return `${weeks}周`
		}
		if (!weeks) {
			return `${remainder}天`
		}
		return `${weeks}周零${remainder}天`
	}

	// => ${1}个月零${2}天
	if (format === AGE_FORMAT.MONTH) {
		let yearDifference: number =
			now.getFullYear() - birthday.getFullYear()
		let monthDifference: number = now.getMonth() - birthday.getMonth()
		let dayDifference: number = now.getDate() - birthday.getDate()

		if (monthDifference < 0) {
			yearDifference--
			monthDifference =
				now.getMonth() + 1 + (12 - (birthday.getMonth() + 1))
		}

		if (dayDifference < 0) {
			monthDifference--
			const temp: number = birthday.getDate()
			birthday.setMonth(birthday.getMonth() + 1)
			birthday.setDate(0)
			dayDifference = now.getDate() + (birthday.getDate() - temp)
		}

		if (!yearDifference && !monthDifference && !dayDifference) {
			return `0天`
		}
		if (!yearDifference && !monthDifference) {
			return `${dayDifference}天`
		}
		if (!yearDifference && !dayDifference) {
			return `${monthDifference}个月`
		}
		if (!yearDifference) {
			return `${monthDifference}个月零${dayDifference}天`
		}
		if (!monthDifference && !dayDifference) {
			return `${yearDifference * 12}个月`
		}
		if (!monthDifference) {
			return `${yearDifference * 12}个月零${dayDifference}天`
		}
		if (!dayDifference) {
			return `${yearDifference * 12 + monthDifference}个月`
		}
		return `${
			yearDifference * 12 + monthDifference
		}个月零${dayDifference}天`
	}

	// => ${1}岁${2}个月零${3}天
	if (format === AGE_FORMAT.AGE) {
		let yearDifference: number =
			now.getFullYear() - birthday.getFullYear() - 1
		let monthDifference = 0
		let dayDifference = 0
		const birthMonth: number = birthday.getMonth() + 1
		const nowMonth: number = now.getMonth() + 1
		const birthDayth: number = birthday.getDate()
		const nowDayth: number = now.getDate()

		// 出生日期和当前时间在相同月份
		if (nowMonth === birthMonth) {
			// 当前月份天数大于出生日期天数
			if (nowDayth >= birthDayth) {
				yearDifference++
				monthDifference = 0
				dayDifference = nowDayth - birthDayth
			}
			// 当前月份天数小于出生日期天数
			if (nowDayth < birthDayth) {
				monthDifference = 11
				dayDifference = nowDayth + remainingDaysOfMonth(birthday)
			}
		}

		// 出生日期月份小于当时间月份
		if (nowMonth > birthMonth) {
			yearDifference++
			monthDifference = nowMonth - birthMonth - 1
			// 当前月份天数大于出生日期天数
			if (nowDayth >= birthDayth) {
				monthDifference++
				dayDifference = nowDayth - birthDayth
			}
			// 当前月份天数小于出生日期天数
			if (nowDayth < birthDayth) {
				dayDifference = remainingDaysOfMonth(birthday) + nowDayth
			}
		}

		// 出生日期月份大于当前时间月份
		if (nowMonth < birthMonth) {
			monthDifference = 12 - birthMonth + nowMonth - 1
			// 当前月份天数大于出生日期天数
			if (nowDayth >= birthDayth) {
				monthDifference++
				dayDifference = nowDayth - birthDayth
			}
			// 当前月份天数小于出生日期天数
			if (nowDayth < birthDayth) {
				dayDifference = remainingDaysOfMonth(birthday) + nowDayth
			}
		}

		if (!yearDifference && !monthDifference && !dayDifference) {
			return `0天`
		}
		if (!yearDifference && !monthDifference) {
			return `${dayDifference}天`
		}
		if (!yearDifference && !dayDifference) {
			return `${monthDifference}个月`
		}
		if (!yearDifference) {
			return `${monthDifference}个月`
		}
		if (!monthDifference && !dayDifference) {
			return `${yearDifference}岁`
		}
		if (!monthDifference) {
			return `${yearDifference}岁`
		}
		if (!dayDifference) {
			return `${yearDifference}岁`
		}
		return `${yearDifference}岁`
	}

	return ""
}

/**
 * 计算月份剩余天数
 * @param date
 */
function remainingDaysOfMonth(date: Date) {
	const target = new Date(date)
	const days = target.getDate()
	target.setMonth(target.getMonth() + 1)
	target.setDate(0)
	return target.getDate() - days
}
