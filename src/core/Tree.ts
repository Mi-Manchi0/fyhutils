import { isArray } from "lodash-es"

interface FieldNames {
	id: string
	pid: string
	children: string
	root: string
}

/**
 * @description 平铺结构数据 => 树形结构数据
 * @param planData:any[] 数组 必须含有唯一id和指定父级的id
 * @param fieldNames:{id: "id",pid: "pid",children: "children",root: "/",}
 * @returns 树结构数据
 */
export const ArrayToTree = (
	planData: any[],
	fieldNames: FieldNames = {
		id: "id",
		pid: "pid",
		children: "children",
		root: "/",
	}
): any[] => {
	const { id, pid, children, root } = fieldNames

	const copyData: any[] = JSON.parse(JSON.stringify(planData))

	copyData.forEach(item => {
		if (item[pid] === root) {
			return
		}

		// 如果存在pid => 插入父节点children
		const index = copyData.findIndex(el => el[id] === item[pid])
		if (index < 0) {
			return
		}

		// 为父节点构建children
		if (!Array.isArray(copyData[index][children])) {
			copyData[index][children] = []
		}
		// 插入子节点
		copyData[index][children].push(item)
	})

	return copyData.filter(el => {
		// 返回 pid === '/' 的节点作为根节点
		if (el[pid] === root) {
			return true
		}
		if (copyData.find(v => v[id] === el[pid])) {
			return false
		}
		// 返回父节点不在数据中的节点
		return true
	})
}

/**
 * @description 树结构数据转换为Map结构数据
 * @param 树型结构数据
 * @param 子节点集合属性名
 * @param 唯一id
 * @returns 以唯一id为键的map数据
 *
 */
export const TreeToMap = (
	treeList: any,
	children = "children",
	key = "key"
) => {
	if (!treeList || treeList.length === 0) return null
	const result = new Map()
	const fn_toMap = (data: any) => {
		data.forEach((item: any) => {
			result.set(item[key], item)
			if (item[children] && item[children].length > 0) {
				fn_toMap(item[children])
			}
		})
	}
	fn_toMap(treeList)
	return result
}

/**
 *@description 获取树结构中指定层级的key值，用于设置展开树
 * @param treeData 树结构数据
 * @param layer 层级
 * @returns 树结构中指定层级的key值集合
 */
export const GetExpandeKeys = (treeData: any, layer: number) => {
	let result: string[] = []
	if (isArray(treeData) && layer > 0) {
		treeData.forEach(item => {
			result.push(item.key)
			if (item.children) {
				const newArr = GetExpandeKeys(item.children, layer - 1)
				result = result.concat(newArr)
			}
		})
	}

	return result
}
