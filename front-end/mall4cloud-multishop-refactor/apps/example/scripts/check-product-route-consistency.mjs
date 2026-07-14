import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const productListSource = readFileSync(
  new URL('../src/views/product/list/index.vue', import.meta.url),
  'utf8',
)
const productRoutesSource = readFileSync(
  new URL('../src/router/modules/product.example.ts', import.meta.url),
  'utf8',
)
const settingsSource = readFileSync(
  new URL('../src/settings.ts', import.meta.url),
  'utf8',
)

assert.match(
  settingsSource,
  /routeBaseOn:\s*'backend'/,
  '后台管理应用应按后端菜单生成动态路由',
)

const backendRouteUsages = productListSource.match(/\/product\/prod_info/g) ?? []
assert.equal(backendRouteUsages.length, 2, '发布和编辑按钮都应使用后端菜单路径 /product/prod_info')
assert.doesNotMatch(
  productListSource,
  /\/product\/prod-info/,
  '后端路由模式下不应把组件目录 product/prod-info 当作访问路径',
)

assert.match(
  productRoutesSource,
  /path:\s*'prod-info'[\s\S]*?name:\s*'productProdInfo'/,
  '前端路由模板的组件路径应保持有效',
)

console.log('product route consistency check passed')
