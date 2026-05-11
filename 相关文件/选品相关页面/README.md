# 选品功能文件清单

## 📁 目录结构

```
选品相关页面/
├── components/                    # 选品相关组件
│   ├── sp_HomeXuanpin/           # 首页选品推荐组件
│   │   └── sp_HomeXuanpin.vue
│   ├── sp_CategoryTab/           # 分类Tab切换组件
│   │   └── sp_CategoryTab.vue
│   ├── sp_HomeRecommend/         # 商品推荐组件
│   │   └── sp_HomeRecommend.vue
│   ├── sp_SpecSelector/          # 规格选择器组件
│   │   └── sp_SpecSelector.vue
│   ├── sp_SearchBar/             # 搜索栏组件
│   │   ├── sp_SearchBar.vue
│   │   └── README.md
│   └── sp_CategorySelector/      # 分类选择器组件
│       └── sp_CategorySelector.vue
│
├── pages/                        # 选品相关页面
│   └── xuanpinindex/            # 选品中心主页
│       └── xuanpinindex.vue
│
└── README.md                     # 本文档
```

---

## 📱 核心页面

### xuanpinindex（选品中心主页）

**文件路径：** `pages/xuanpinindex/xuanpinindex.vue`

**功能说明：**
- TabBar"选品"入口页面
- 顶部搜索栏
- 19个商品分类标签（疼痛舒缓、鼻部护理、眼部护理等）
- 轮播Banner展示
- 5个快捷入口（超级爆品、视频热卖、商家优选、低价好卖、人才库）
- 4种筛选（精选/热销/新品/高佣）
- 二级筛选面板（佣金比例/价格区间/销量）
- 商品列表展示（包含佣金信息）
- 跳转到商品详情

**使用位置：**
- TabBar导航配置
- 达人中心页面跳转
- 商品详情页跳转
- 登录页跳转

---

## 🧩 组件说明

### 1. sp_HomeXuanpin（首页选品推荐组件）

**文件路径：** `components/sp_HomeXuanpin/sp_HomeXuanpin.vue`

**功能：** 
- 首页展示选品推荐商品模块
- 点击跳转至选品中心

**使用位置：**
- pages/index/index.vue（首页）

---

### 2. sp_CategoryTab（分类Tab组件）

**文件路径：** `components/sp_CategoryTab/sp_CategoryTab.vue`

**功能：**
- 首页Tab切换（爆品/新品等分类）
- 提供分类切换交互

**使用位置：**
- pages/index/index.vue（首页）

---

### 3. sp_HomeRecommend（商品推荐组件）

**文件路径：** `components/sp_HomeRecommend/sp_HomeRecommend.vue`

**功能：**
- 首页商品推荐模块
- 支持多种推荐类型（推荐/热销/新品）

**使用位置：**
- pages/index/index.vue（首页）

---

### 4. sp_SpecSelector（规格选择器组件）

**文件路径：** `components/sp_SpecSelector/sp_SpecSelector.vue`

**功能：**
- 商品规格选择
- SKU选择逻辑

**使用位置：**
- pages/sp_Details/sp_Details.vue（商品详情）

---

### 5. sp_SearchBar（搜索栏组件）

**文件路径：** `components/sp_SearchBar/sp_SearchBar.vue`

**功能：**
- 搜索商品输入
- 搜索历史记录

**使用位置：**
- pages/sp_Product_list/sp_Product_list.vue（商品列表）

---

### 6. sp_CategorySelector（分类选择器组件）

**文件路径：** `components/sp_CategorySelector/sp_CategorySelector.vue`

**功能：**
- 分类选择交互
- 多级分类展示

**使用位置：**
- 可能用于商品详情或分类页面

---

## 🔧 依赖服务

这些选品文件依赖以下服务文件（不在本目录中）：

- `services/productService.js` - 商品服务API
  - getXpProductDetail() - 选品商品详情
  - getXpBanners() - 选品轮播图
  - getProducts() - 商品列表
  - getHotProducts() - 热门商品
  - getRecommendProducts() - 推荐商品

---

## 📊 功能架构

```
┌─────────────────────────────────────────────────────────┐
│                     TabBar 导航                          │
├─────────────────────────────────────────────────────────┤
│  首页  │  商城  │  ⭐选品⭐  │  研发  │   我的         │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ xuanpinindex   │
                    │  选品中心主页   │
                    │  (pages/)      │
                    └─────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐       ┌──────────────┐     ┌────────────┐
   │ 轮播图   │       │ 商品分类标签  │     │ 快捷入口   │
   │ (Banner) │       │ sp_Category  │     │ (5个入口)  │
   └──────────┘       │   Selector   │     └────────────┘
                      └──────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  商品列表展示   │
                    │  (含佣金信息)   │
                    └─────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐       ┌──────────────┐     ┌────────────┐
   │ 筛选面板 │       │ 商品详情页   │     │ 申请样品   │
   │          │       │ sp_Details  │     │            │
   └──────────┘       └──────────────┘     └────────────┘
```

---

## 🎯 核心业务流程

1. **用户进入** → TabBar点击"选品" → 进入xuanpinindex
2. **浏览商品** → 滑动查看分类标签、Banner、商品列表
3. **筛选商品** → 使用筛选条件（精选/热销/新品/高佣）
4. **查看详情** → 点击商品 → 跳转商品详情页
5. **申请样品** → 点击"申请样品"按钮

---

## 📝 使用说明

### 页面引入

在 pages.json 中注册：

```json
{
  "path": "pages/xuanpinindex/xuanpinindex",
  "style": {
    "navigationStyle": "custom",
    "enablePullDownRefresh": true
  }
}
```

### 组件引入

在页面或组件的 .vue 文件中引入：

```vue
<script>
import spHomeRecommend from '@/components/sp_HomeRecommend/sp_HomeRecommend';
import spHomeXuanpin from '@/components/sp_HomeXuanpin/sp_HomeXuanpin';
import spCategoryTab from '@/components/sp_CategoryTab/sp_CategoryTab';

export default {
  components: {
    spHomeRecommend,
    spHomeXuanpin,
    spCategoryTab
  }
}
</script>
```

### API调用

```javascript
const productService = require('../../services/productService');

// 获取选品商品
productService.getProducts({ category: '疼痛舒缓' });

// 获取选品详情
productService.getXpProductDetail(id);

// 获取选品轮播图
productService.getXpBanners();
```

---

## 📦 文件统计

- **页面数量：** 1个（选品中心主页）
- **组件数量：** 6个
- **总文件数：** 7个Vue文件 + 1个README.md

---

## ✅ 已删除的无用文件

以下文件已被删除（不在本目录中）：

- ❌ `pages/selection/selection.vue` - 未使用的演示页面
- ❌ `pages/category/category.vue` - 功能重复的分类页面
- ❌ `pages/categoryList/categoryList.vue` - 未使用的分类列表页面
- ❌ `components/sp_CategoryList/` - 未使用的组件

---

## 📅 最后更新

2026-04-11

---

**整理人：** AI代码助手  
**来源：** 链动商城UniApp项目代码分析
