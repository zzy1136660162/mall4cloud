---
name: mall4cloud-platform-refactor
description: mall4cloud-platform 重构到 mall4cloud-platform-refactor 的完整记录：关键修复、踩坑总结及生产可用的最终代码
type: reference
---

# mall4cloud-platform 重构参考

## 项目背景

将旧项目 `mall4cloud-platform`（丑、样式老旧）的业务逻辑迁移到新项目 `mall4cloud-platform-refactor/apps/mall-platform`（Fantastic-admin Vue 3 框架）。

核心目标：复用新项目的 Fantastic-admin 框架样式、layouts、登录页、路由系统，只替换业务 API 和视图文件。

---

## 一、关键文件最终代码

### 1. API 拦截器 — `src/api/index.ts`

请求拦截器加 `Authorization` header：

```typescript
// 请求拦截器中，在 set request.headers.Token 后加一行：
request.headers.Authorization = appAccountStore.token
```

响应拦截器处理旧后端返回格式 `{ code: '00000', msg: 'success', data: {...} }`：

```typescript
response => {
  const res = response.data
  if (res.code === '00000') {
    return res.data
  }
  if (['A00001', 'A00003', 'A00005', 'A00011'].includes(res.code)) {
    faToast.error(res.msg || 'Error', { description: res.msg })
    return Promise.reject(res)
  }
  if (res.code === 'A00002') {
    const msgs = Array.isArray(res.data) ? res.data : [res.msg]
    msgs.forEach((msg: string) => faToast.error(msg))
    return Promise.reject(res)
  }
  if (res.code === 'A00004') {
    useAppAccountStore().requestLogout()
    return Promise.reject(res)
  }
  return Promise.reject(res)
}
```

### 2. API 模块 — `src/api/modules/app.ts`

```typescript
import api from '../index'

export default {
  login: (data: {
    principal: string
    credentials: string
    captchaVerification?: string
    sysType: number
  }) => api.post('/mall4cloud_auth/ua/login', data),

  getUserInfo: () => api.get('/mall4cloud_platform/sys_user/info'),

  getPermissions: () => api.get('/mall4cloud_rbac/menu_permission/list'),

  getMenuIds: () => api.get('/mall4cloud_rbac/menu/list_menu_ids'),

  routeList: () => api.get('/mall4cloud_rbac/menu/route'),

  passwordEdit: (data: { password: string; newPassword: string }) =>
    api.post('/mall4cloud_platform/sys_user/password', data),
}
```

**清空 fake 文件**（避免 fake 路由干扰）：
- `src/api/modules/app.fake.ts`
- `src/api/modules/standardModule.fake.ts`
- `src/api/modules/upload.fake.ts`

### 3. Account Store — `src/store/modules/app/account.ts`

Token 存储用 `localStorage`，key = `'token'`（短 key，storage proxy 已自动加前缀）：

```typescript
const token = ref(localStorage.getItem('token') ?? '')

async function login(data) {
  const res = await apiApp.login({
    principal: data.account,
    credentials: data.password,
    captchaVerification: data.captchaVerification ?? '',
    sysType: 2,
  })
  const loginData = res as any
  token.value = loginData.accessToken
  localStorage.setItem('token', token.value)
  await fetchUserInfo()
}

async function fetchUserInfo() {
  const info = await apiApp.getUserInfo() as any
  nickName.value = info.nickName ?? ''
  avatar.value = info.avatar ?? ''
  isAdmin.value = !!info.isAdmin
  userId.value = String(info.userId ?? '')
  account.value = info.nickName ?? ''
  // ... localStorage.setItem(...)
}
```

**注意**：旧后端返回 `{ accessToken }`，而非 `{ data: { token } }`。

### 4. Route Store — `src/store/modules/app/route.ts`

**绝对路径 glob**（dev server 必须用项目根绝对路径）：

```typescript
const views = import.meta.glob('/apps/mall-platform/src/views/**/*.vue')
```

**formatBackRoutes 组件查找**（两个路径都试）：

```typescript
const keys = [
  `/apps/mall-platform/src/views/modules/${route.component}/index.vue`,
  `/apps/mall-platform/src/views/modules/${route.component}.vue`,
]
const found = keys.find(k => views[k])
route.component = found ? views[found] : undefined
```

### 5. 路由守卫 — `src/router/guards.ts`

**三件事必须做**：

#### 5a. Layout 父路由用 `children: []`

```typescript
appRouteStore.routesRaw.forEach((route) => {
  if (route.parentId !== 0) return
  const parentRoute = { ...route, children: [] }
  removeRoutes.push(router.addRoute(parentRoute))
})
```

#### 5b. BFS 遍历找叶子节点注册完整路径

```typescript
appRouteStore.routesRaw.forEach((rootRoute) => {
  if (rootRoute.parentId !== 0) return
  const stack = [...(rootRoute.children ?? [])]
  while (stack.length > 0) {
    const route = stack.pop()!
    if (/^(?:https?:|mailto:|tel:)/.test(route.path)) continue
    if (!route.children?.length) {
      const childPath = route.path.startsWith('/') ? route.path.slice(1) : route.path
      const fullPath = `${rootRoute.path}/${childPath}`
      const routeWithFullPath = { ...route, path: fullPath }
      removeRoutes.push(router.addRoute(routeWithFullPath))
    } else {
      stack.push(...route.children)
    }
  }
})
```

#### 5c. `isGenerate` 持久化导致刷新页面路由丢失

```typescript
// 原来：isGenerate=true 就跳过，但 Pinia persistedstate 会持久化 isGenerate，
// 导致刷新后 isGenerate=true 但 routesRaw 被清空，路由全部 404
// 修复：两个条件都满足才跳过
if (appRouteStore.isGenerate && appRouteStore.routesRaw.length > 0) {
```

### 6. 菜单 Store — `src/store/modules/app/menu.ts`

**菜单路径缺少 `/platform/` 前缀**：根节点的 `path` 必须作为初始 `parentPath` 传入递归函数：

```typescript
// 错误：convertRouteToMenuRecursive(item.children, '')
// 正确：
returnMenus.push({
  meta: { title: item?.meta?.title, icon: item?.meta?.icon, auth: item?.meta?.auth },
  children: convertRouteToMenuRecursive(item.children, item.path), // item.path 而非 ''
})
```

---

## 二、踩坑全记录

### 1. `$t()` i18n 调用导致 Vue 警告

**现象**：所有视图文件有 `{{ $t('xxx') }}` 或 JS 中 `$t('xxx')`，但新项目没有 i18n 插件，运行时警告"getLocales不存在"。

**修复**：批量将所有 `$t()` 替换为中文硬编码字符串。

**命令**（views 目录）：

```bash
# 模板中 $t('中文') → 中文
sed -i "s/{{ *\$t('\([^']*\)') *}}/\1/g" **/*.vue

# JS script 中 $t('中文') → '中文'
sed -i "s/'\$t('\([^']*\)')'/'\\1'/g" **/*.vue
```

### 2. `element-plus/icons-vue` 导入路径 404

**现象**：`import ... from 'element-plus/icons-vue'` 报 404。

**原因**：Element Plus 某个版本改成了 `@element-plus/icons-vue`。

**修复**：`import * as ElementPlusIconsVue from '@element-plus/icons-vue'`

### 3. 模板中 `:attr="中文"` 语法错误

**现象**：`:title="店铺名称"` 在 Vue 模板中是无效 JS（中文不加引号）。

**修复**：去掉冒号，变成静态属性：

```vue
<!-- 错误 -->
<el-form-item label="店铺名称：" :label-width="'110px'">

<!-- 正确 -->
<el-form-item label="店铺名称：" label-width="110px">
```

**命令**：

```bash
sed -i "s/:label=\"/label=\"/g" **/*.vue
sed -i "s/:title=\"/title=\"/g" **/*.vue
sed -i "s/:placeholder=\"/placeholder=\"/g" **/*.vue
```

### 4. `v-permission` 指令 "outside Pinia context"

**现象**：刷新页面后侧边栏消失，控制台报错"getCurrentInstance is null"。

**原因**：`useAppAccountStore()` 在 directive setup 时调用（模块加载时），而非在 directive 执行时调用。

**修复**：

```typescript
app.directive('permission', (el, binding) => {
  const store = useAppAccountStore()
  const { permissions } = storeToRefs(store) // 用 storeToRefs 保持响应性
  // ...
})
```

### 5. 路由注册只处理了叶子节点，忽略了中间层级

**现象**：`/platform/shop-manage` 报 "missing component for /platform/shop-manage"。

**原因**：原来的 `parentId !== 0` 判断把中间层级（如 `shop-manage`）当成了叶子节点。

**修复**：BFS 遍历整棵树，只在叶子节点（无 children）时注册完整路径。

### 6. 菜单路径缺少前缀

**现象**：侧边栏菜单路径是 `shop-manage`，点击后跳转到 `/#/shop-manage`（404）。

**原因**：`convertRouteToMenuRecursive` 初始 `parentPath=''`，子路由拼出来的路径不包含父路径。

**修复**：根节点传入自己的 `path` 作为初始 `parentPath`。

### 7. `import.meta.glob` 相对路径导致 dev server 404

**现象**：组件加载 404，浏览器缓存了之前的 404 响应后每次都返回 404。

**原因**：相对路径 `../../../views/**/*.vue` 在 dev server 中无法正确解析。

**修复**：使用项目根绝对路径：`/apps/mall-platform/src/views/**/*.vue`（以 Vite 项目根目录为基准，即 `apps/mall-platform/` 所在的目录）。

### 8. Pinia `persistedstate` 持久化了 `isGenerate=true`

**现象**：刷新页面后路由全部 404，导航菜单消失。

**原因**：`isGenerate=true` 被持久化到 localStorage，刷新页面后 `isGenerate` 仍为 `true`，但 `routesRaw` 为空（因为是内存状态），守卫直接跳过路由生成。

**修复**：在 `guards.ts` 中增加 `routesRaw.length > 0` 判断：

```typescript
if (appRouteStore.isGenerate && appRouteStore.routesRaw.length > 0) {
```

### 9. `{{ 新增 }}/{{ 编辑 }}` 等裸标识符

**现象**：按钮文字显示为空。

**原因**：从旧项目迁移时，JS 中的 `const 新增 = '新增'` 这样的定义丢失了，`{{ 新增 }}` 变成引用未定义变量，渲染为空白。

**修复**：所有裸中文标识符全部替换为纯文本：

```python
import os, re
replacements = [
    (r'\{\{\s*新增\s*\}\}', '新增'),
    (r'\{\{\s*编辑\s*\}\}', '编辑'),
    (r'\{\{\s*删除\s*\}\}', '删除'),
    (r'\{\{\s*搜索\s*\}\}', '搜索'),
    (r'\{\{\s*取消\s*\}\}', '取消'),
    (r'\{\{\s*确定\s*\}\}', '确定'),
    (r'\{\{\s*上架\s*\}\}', '上架'),
    (r'\{\{\s*下架\s*\}\}', '下架'),
    (r'\{\{\s*禁用\s*\}\}', '禁用'),
    (r'\{\{\s*正常\s*\}\}', '正常'),
    (r'\{\{\s*下线\s*\}\}', '下线'),
    (r'\{\{\s*启用\s*\}\}', '启用'),
    (r'\{\{\s*目录\s*\}\}', '目录'),
    (r'\{\{\s*菜单\s*\}\}', '菜单'),
    (r'\{\{\s*当前已选\s*\}\}', '当前已选'),
    (r'\{\{\s*请阅读以下分类层级\s*\}\}', '请阅读以下分类层级'),
    (r'\{\{\s*上传图片\s*\}\}', '上传图片'),
    (r'\{\{\s*选择本地图片\s*\}\}', '选择本地图片'),
    (r'\{\{\s*确认上传\s*\}\}', '确认上传'),
    (r'\{\{\s*查询\s*\}\}', '查询'),
]
for root, dirs, files in os.walk('views/modules'):
    for fn in files:
        if not fn.endswith('.vue'): continue
        path = os.path.join(root, fn)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
```

### 10. 浏览器缓存 404 响应

**现象**：修好 glob 路径后组件仍然 404。

**原因**：浏览器缓存了之前的 404 响应。

**修复**：Chrome DevTools → Network → 勾选 "Disable cache" → 刷新；或在新标签页打开。

---

## 三、复制文件清单

```
旧项目: mall4cloud-platform/src/views/modules/
新项目: mall4cloud-platform-refactor/apps/mall-platform/src/views/modules/

旧项目: mall4cloud-platform/src/components/(业务组件)
新项目: mall4cloud-platform-refactor/apps/mall-platform/src/components/

旧项目: src/utils/(业务工具函数)
新项目: src/utils/(按需复制)
```

**复制后必做四件事**：
1. 每个视图文件 `<script setup>` 顶部加 `defineOptions({ name: 'ComponentName' })`
2. 所有 `$t()` 替换为中文硬编码
3. 所有 `:attr="中文"` 去掉冒号变成静态属性
4. 所有 `{{ 中文 }}` 裸标识符替换为纯文本

**不需要复制**：
- `views/login.vue`、`views/[...all].vue`（新项目已有）
- `components/AppAccountForm/`、`components/AppAuth/`（框架级组件，新项目已有）
- `utils/` 下的 i18n 相关工具（旧项目无，新项目无）

---

## 五、业务组件/页面/i18n 完整迁移清单（2026-04-10）

本次从 `mall4cloud-platform` 迁移到 `mall4cloud-platform-refactor/apps/mall-platform` 的完整记录。

### 迁移内容总览

| 类型 | 来源 | 目标 | 说明 |
|------|------|------|------|
| 多语言系统 | `src/lang/` 整个目录 | `src/lang/` | 含 60+ 个中英文 JS 文件 |
| 页面子组件 | `views/modules/*/components/` | `views/modules/*/components/` | 见下方明细 |
| 业务公共组件 | `src/components/` | `src/components/` | 见下方明细 |
| i18n 工具 | `utils/i18n.js` | `utils/i18n.ts` | 直接复制 |
| i18n $t 工具 | `utils/$t.js` | `utils/$t.ts` | 直接复制 |
| Biz API 模块 | `api/biz/oss.js` | `api/biz/oss.ts` | 组件依赖 |
| Biz API 模块 | `api/biz/attach-file.js` | `api/biz/attach-file.ts` | 组件依赖 |

### 依赖变更

**根目录 `pnpm-workspace.yaml`** — 添加 catalog：
```yaml
  'vue-i18n': ^9.2.2
  'vue-cookies': ^1.8.3
```

**`apps/mall-platform/package.json`** — devDependencies 添加：
```json
"vue-cookies": "catalog:",
"vue-i18n": "catalog:",
```

### main.ts 变更

```typescript
import { setupI18n } from '@/lang'

const app = createApp(App)
app.use(VxeUI).use(VxeUITable)
app.use(pinia)
app.use(router)
app.use(uiProvider)
app.use(setupI18n)   // <-- 添加这一行
directive(app)
```

> 注意：不要在 main.ts 里重复创建 i18n 实例，直接 import `setupI18n` 插件（来自 `src/lang/index.js` 的 `export const setupI18n = { install(app) { app.use(i18n) } }`）。

### 页面子组件迁移清单

```
mall4cloud-platform/src/views/modules/
└── platform/
│   └── shop-manage/
│       ├── account-manage.vue     → 目标: src/views/modules/platform/shop-manage/components/
│       └── add-or-update.vue     → 目标: src/views/modules/platform/shop-manage/components/
└── product/
│   └── list/
│       └── prod-details.vue      → 目标: src/views/modules/product/list/components/
└── rbac/
    └── sys-user/
        ├── account-add-or-update.vue  → 目标: src/views/modules/rbac/sys-user/components/
        └── add-or-update.vue         → 目标: src/views/modules/rbac/sys-user/components/
```

### 业务公共组件迁移清单

```
mall4cloud-platform/src/components/
├── pagination/index.vue
├── img-upload/index.vue
├── img-show/index.vue
├── imgbox/index.vue
├── category-selector/index.vue
├── category-group/index.vue
├── icons-select/
├── picture-preview/index.vue
├── prods-select/index.vue
├── product-details/index.vue
├── spu-category-attrs/index.vue
├── Sku/
│   ├── SkuBlock/index.vue
│   ├── SkuContainer/index.vue
│   ├── SkuGroup/index.vue
│   └── SkuTable/index.vue
└── Verifition/
    ├── Verify.vue
    ├── Verify/VerifyPoints.vue
    ├── Verify/VerifySlide.vue
    ├── api/index.js   → 目标: api/ 目录
    └── utils/
        ├── ase.js
        ├── axios.js
        └── util.js
```

### API 依赖检查

复制组件后，执行以下命令检查是否有缺失的 API 模块引用：

```bash
grep -rh "from '@/api" src/components/ src/views/modules/ 2>/dev/null | sort | uniq
```

本次迁移发现并补齐的 API：
- `@/api/biz/oss` — `imgbox` 组件用
- `@/api/biz/attach-file` — `imgbox` 组件用
- `@/api/product/prod-info` — `product/list/components/prod-details.vue` 用（目标已有）

> 注意：`src/api/product/` 目录下同时存在 `.js`（复制来的）和 `.ts`（之前手动改写的）文件时，Vite/TypeScript 会优先加载 `.ts`，复制来的 `.js` 文件实际不会被用到，可按需删除避免混乱。

### lang 目录结构

```
src/lang/
├── index.js              # i18n 入口，含 createI18n + setupI18n
├── en.js                 # 英文主文件（合并所有模块英文）
├── zhCn.js               # 中文主文件（合并所有模块中文）
├── admin/
├── biz/
│   ├── area/
│   ├── imgbox/
│   ├── notify/
│   └── videobox/
├── chat/
├── components/
│   └── category-selector/
├── constant/
├── coupon/
├── delivery/
│   ├── delivery-company/
│   └── transport/
├── discount/
├── distribution/
├── group/
├── live/
├── order/
├── outletConfig/
├── pcdecorate/
├── platform/
│   ├── config/
│   ├── hot-search/
│   ├── notice/
│   ├── shop-addr/
│   ├── sys-user/
│   └── sys-user-account/
├── printer/
├── product/
│   ├── attr/
│   ├── brand/
│   ├── category/
│   ├── spu/
│   ├── spu-detail/
│   └── spu-tag/
├── rbac/
│   ├── menu/
│   ├── menu-permission/
│   ├── menu-resource/
│   ├── role/
│   └── web-config/
├── seckill/
├── shopFeature/
├── station/
└── user/
    ├── level/
    ├── recharge/
    ├── rights/
    ├── score/
    ├── tag/
    └── user-manager/
```

### 迁移后验证

迁移完成后重启 `pnpm dev`，浏览器打开各业务页面验证：
- `/#/product/category` — 分类管理
- `/#/rbac/sys-user` — 账号管理
- `/#/platform/shop-manage` — 店铺管理

页面正常渲染（表格+搜索表单+分页），控制台无编译错误即表示迁移成功。

---

## 六、旧后端 vs 新框架差异对照

| 项目 | 旧后端 | 新框架 |
|------|--------|--------|
| 登录接口 | `POST /mall4cloud_auth/ua/login`<br>body: `{ principal, credentials, captchaVerification, sysType: 2 }` | `POST /app/account/login`<br>body: `{ account, password }`（fake） |
| 用户信息 | `GET /mall4cloud_platform/sys_user/info` | `GET /app/account/info`（fake） |
| 权限列表 | `GET /mall4cloud_rbac/menu_permission/list` | fake: `{ data: { permissions: [] } }` |
| 菜单ID | `GET /mall4cloud_rbac/menu/list_menu_ids` | fake: 无 |
| 路由数据 | `GET /mall4cloud_rbac/menu/route`<br>`component` 格式: `modules/platform/hot-search/index.vue` | fake: `{ data: [{ component: 'xxx.vue' }] }` |
| 成功码 | `code: '00000'`，拦截器 return `res.data` | `status: 1`，fake: `response.data` |
| 未授权码 | `code: 'A00004'` | `status !== 1` |
| Token Header | `Authorization` | `Token`（框架默认），旧后端用 `Authorization` |
| Token 存储 | `vue-cookies`，key = `Luck-platform-Token` | `localStorage`，key = `token`（storage proxy 加前缀） |
| 登录返回 | `{ accessToken }`（字符串） | fake: `{ data: { token, account, avatar } }` |
