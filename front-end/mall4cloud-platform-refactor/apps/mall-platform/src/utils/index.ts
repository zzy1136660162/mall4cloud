import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import path from 'path-browserify'
import { twMerge } from 'tailwind-merge'
export { flatten, idList, formatHtml } from './helpers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveRoutePath(basePath?: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}

// 扁平数组转树形结构（后端 RouteVO / CategoryVO 通用）
export function treeDataTranslate(data: any[], idKey = 'id', pidKey = 'parentId') {
  const res: any[] = []
  const temp: Record<string, any> = {}
  for (const item of data) {
    temp[item[idKey]] = item
  }
  for (const item of data) {
    if (temp[item[pidKey]] && item[idKey] !== item[pidKey]) {
      if (!temp[item[pidKey]].children) {
        temp[item[pidKey]].children = []
      }
      if (!temp[item[pidKey]]._level) {
        temp[item[pidKey]]._level = 1
      }
      item._level = temp[item[pidKey]]._level + 1
      temp[item[pidKey]].children.push(item)
    }
    else {
      res.push(item)
    }
  }
  return res
}
