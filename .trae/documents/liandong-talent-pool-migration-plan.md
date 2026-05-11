# 人才库页面迁移计划

## 一、迁移概述

将人才库相关页面从旧框架 `liandong-mall-weapp_uni` 迁移到新框架 `mall4cloud-uniapp`。

### 需要迁移的页面
1. **列表页** (`index/index.vue`) - 人才列表展示、搜索、筛选、分页
2. **详情页** (`detail/detail.vue`) - 人才详细信息展示

---

## 二、新框架代码规范

### 2.1 技术栈
- **Vue 3** Composition API (`<script setup>`)
- **SCSS** 样式预处理器
- **uni-app** 跨平台框架

### 2.2 代码结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据定义
const state = reactive({ ... })
const loading = ref(false)

// 生命周期钩子
onLoad(() => { ... })
onShow(() => { ... })
onPullDownRefresh(() => { ... })
onReachBottom(() => { ... })

// 方法定义
const methodName = () => { ... }
</script>

<style lang="scss" scoped>
/* 样式内容 */
</style>
```

### 2.3 网络请求
```javascript
import http from '@/utils/http.js'

http.request({
  url: '/api/talent_pool/list',
  method: 'GET',
  data: { page: 1, pageSize: 10 }
}).then(res => {
  // 处理响应
}).catch(err => {
  // 错误处理
})
```

### 2.4 路由配置
在 `pages.json` 中添加页面路由：
```json
{
  "path": "pages/talent-pool/index/index",
  "style": {
    "navigationBarTitleText": "人才库",
    "enablePullDownRefresh": true,
    "backgroundTextStyle": "dark"
  }
}
```

---

## 三、迁移步骤

### 3.1 第一步：创建目录结构

**目标位置：** `src/pages/talent-pool/`

创建以下目录：
- `src/pages/talent-pool/index/` - 列表页
- `src/pages/talent-pool/detail/` - 详情页

### 3.2 第二步：迁移列表页

**源文件：** `liandong-mall-weapp_uni/pages/talent_pool/index/index.vue`

**目标文件：** `src/pages/talent-pool/index/index.vue`

**迁移要点：**

| 旧框架 | 新框架 |
|--------|--------|
| `getApp()` | 不需要，通过 `uni` 直接调用 |
| `this.setData({...})` | 直接赋值 `state.xxx = value` |
| `app.globalData.request()` | `http.request()` |
| `export default { data(){} }` | `<script setup>` + `reactive/ref` |
| `onLoad()` | `onLoad()` (uni-app 生命周期) |
| 微信事件 `@tap`, `@input` | Vue 事件 `@tap`, `@input` |
| `data-area="{{item}}"` | `:data-area="item"` |

**功能迁移清单：**
- [ ] 搜索栏组件（搜索输入、清除按钮）
- [ ] 领域筛选横向滚动
- [ ] 人才卡片列表展示
- [ ] 头像、姓名、经验年限、职位、地区、标签展示
- [ ] 分页加载（上拉加载更多）
- [ ] 下拉刷新
- [ ] 空状态展示
- [ ] 加载中状态
- [ ] 跳转详情页

### 3.3 第三步：迁移详情页

**源文件：** `liandong-mall-weapp_uni/pages/talent_pool/detail/detail.vue`

**目标文件：** `src/pages/talent-pool/detail/detail.vue`

**功能迁移清单：**
- [ ] 头部信息卡片（渐变背景、头像、姓名、职位）
- [ ] 基本信息区块（从业年限、学历、专注领域标签）
- [ ] 专业技能区块
- [ ] 个人简介区块
- [ ] 项目经验区块
- [ ] 成果荣誉区块
- [ ] 加载状态
- [ ] 错误处理
- [ ] 分享功能

### 3.4 第四步：配置路由

**文件：** `src/pages.json`

在 `pages` 数组中添加：
```json
{
  "path": "pages/talent-pool/index/index",
  "style": {
    "navigationBarTitleText": "人才库",
    "enablePullDownRefresh": true,
    "backgroundTextStyle": "dark"
  }
},
{
  "path": "pages/talent-pool/detail/detail",
  "style": {
    "navigationBarTitleText": "人才详情"
  }
}
```

### 3.5 第五步：创建 API 模块

**目标文件：** `src/utils/api/talent-pool.js`

创建统一的 API 调用模块：
```javascript
import http from '@/utils/http.js'

export default {
  // 获取人才列表
  getList(params) {
    return http.request({
      url: '/mall4cloud_platform/talent_pool/list',
      method: 'GET',
      data: params
    })
  },
  
  // 获取人才详情
  getDetail(id) {
    return http.request({
      url: `/mall4cloud_platform/talent_pool/detail/${id}`,
      method: 'GET'
    })
  }
}
```

### 3.6 第六步：样式适配

**注意事项：**
1. 保持原有的视觉风格（黄色主题色 #ffc107）
2. 使用 SCSS 变量管理颜色
3. 使用 `rpx` 单位保持响应式
4. 抽离公共样式到单独的 `.scss` 文件（可选）

---

## 四、迁移对照表

### 4.1 列表页数据字段

| 旧字段 | 新字段 | 说明 |
|--------|--------|------|
| `id` | `id` | 人才ID |
| `name` | `name` | 姓名 |
| `title` | `title` | 职位/头衔 |
| `avatar` | `avatar` | 头像URL |
| `experienceYears` | `experienceYears` | 从业年限 |
| `region` | `region` | 地区 |
| `expertiseAreas` | `expertiseAreas` | 专注领域（数组） |
| `education` | `education` | 学历 |
| `skills` | `skills` | 专业技能（数组） |
| `intro` | `intro` | 个人简介 |
| `projectExperience` | `projectExperience` | 项目经验 |
| `achievements` | `achievements` | 成果荣誉 |

### 4.2 API 路径调整

| 旧路径 | 新路径 |
|--------|--------|
| `/api/talent_pool/list` | `/mall4cloud_platform/talent_pool/list` |
| `/api/talent_pool/detail/{id}` | `/mall4cloud_platform/talent_pool/detail/{id}` |

---

## 五、验收标准

1. **功能完整性**：列表页和详情页的所有功能均已迁移
2. **代码质量**：符合新框架代码规范，使用 Vue 3 Composition API
3. **样式一致性**：与旧框架视觉风格保持一致
4. **网络请求**：正确使用 `http.request()` 方法
5. **路由配置**：页面已正确注册到 `pages.json`

---

## 六、文件清单

### 新增文件
- `src/pages/talent-pool/index/index.vue`
- `src/pages/talent-pool/index/index.scss`
- `src/pages/talent-pool/detail/detail.vue`
- `src/pages/talent-pool/detail/detail.scss`
- `src/utils/api/talent-pool.js`

### 修改文件
- `src/pages.json` - 添加路由配置
