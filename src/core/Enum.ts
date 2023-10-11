import { filter } from "lodash-es"

const normalizeLabel = (label: any) =>
	typeof label === "function" ? label() : label

type MaybeKey = number | string | (() => string | number)

interface EnumObject<L = MaybeKey, T = any> {
	value: T
	label?: L
}
interface EnumBase<L = MaybeKey, T = any> extends EnumObject<L, T> {
	key: number | string
	label: L
}
type Keys<E> = keyof E
type EnumItemType = EnumObject
type EnumType<E extends Record<number | string, EnumItemType>> = {
	[K in Keys<E>]: E[K]["value"]
}
/**
 * 对象值、属性调换，并将类型切换为联合类型
 * @example {field1: 1, field:2} => {1:'field1'} | {2: 'field2'}
 */
export type Unionize<T extends EnumType<any>> = {
	[P in keyof T]: { [Q in T[P]]: P }
}[keyof T]
/**
 * 联合类型到交叉类型
 * @example {1:'field1'} | {2: 'field2'} => {1:'field1'} & {2: 'field2'}
 */
export type UnionToIntersection<U> = (
	U extends any ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never

export type EnumValueType<E extends EnumType<any>> = Keys<
	UnionToIntersection<Unionize<E>>
>
export type EnumListItem<T> = {
	key: string
	value: T
	label: string | number
}

/**
 * @description 生成对应的枚举对象
 *
 * @param {
 *      a:{
 *         label:'a',
 *         value:'a'
 *        },
 *    b:{
 *         label:'b',
 *         value:'b'
 *        },
 *      }
 *
 *
 * @returns
 */
export const Enum = <E extends Record<number | string, EnumItemType>>(
	enumSourceData: E
) => {
	// 根据数据源处理返回枚举类型

	const enumArr: EnumBase<keyof E, any>[] = []
	const enums: EnumType<E> = {} as EnumType<E>
	const originEnumMap: Map<any, EnumListItem<any>> = new Map()
	const entries = Object.entries(enumSourceData)
	entries.forEach(([key, values]) => {
		const { value, label } = values
		const item = {
			key,
			value,
			get label() {
				return normalizeLabel(label) ?? key
			},
		}
		enumArr.push(item as any)
		enums[key as any] = value
		originEnumMap.set(value, item as any)
	})
	type M = UnionToIntersection<Unionize<EnumType<E>>>

	return {
		list: enumArr,
		enum: enums,
		/**
		 * 根据枚举值获取相应的 label
		 * @param {any} value 需要查询的枚举值
		 * @returns {string} 对应的label
		 */
		getLabelByValue<V extends Keys<M>>(
			value: any
		): typeof value extends V ? M[V] : "" {
			if (value === undefined) return "" as any

			if (Array.isArray(value)) {
				return value
					.map(i => {
						const filterObject = filter(
							enumArr,
							item => item.value === i
						)
						if (filterObject.length > 0) {
							return normalizeLabel(filterObject[0].label) as any
						}
						return "" as any
					})
					.filter(I => I)
					.join(",") as any
			}

			const filterObject = filter(
				enumArr,
				item => item.value === value
			)

			// 存在返回值，返回第一个匹配的数据
			if (filterObject.length > 0) {
				return normalizeLabel(filterObject[0].label) as any
			}

			// 没有返回值的情况下，返回空
			return "" as any
		},
		filter(values: any[]) {
			const res: EnumListItem<any>[] = []
			values.forEach(i => {
				const item = originEnumMap.get(i)
				if (item) {
					res.push({
						...item,
						label: normalizeLabel(item.label),
					})
				}
			})
			return res
		},
		/**
		 * 除了某些值之外的所有集合
		 * @param values
		 * @returns
		 */
		excludeByValue(values: any[]) {
			const res: EnumListItem<any>[] = []
			originEnumMap.forEach(item => {
				if (!values.includes(item.value)) {
					res.push({
						...item,
						label: normalizeLabel(item.label),
					})
				}
			})
			return res
		},
	}
}

declare global {
	type ExtractEnumValueTypes<
		T extends { enum: Record<string, unknown> }
	> = {
		[P in keyof T["enum"]]: T["enum"][P]
	}[keyof T["enum"]]
}
