# CategorySelector 组件放宽选择要求 - 修改计划

## 需求背景
当前 CategorySelector 组件要求必须选择到三级分类才能确认，希望放宽到选择二级分类即可确认。

## 现状分析

### 前端组件逻辑 (CategorySelector/index.vue)
1. **数据结构**: 支持三级分类（firstCategorys, secondCategorys, threeCategorys）
2. **当前确认条件**:
   - 平台分类 (`showthreeCategorys=true`): 必须选择三级分类 `threeCategorys.id`
   - 店铺分类 (`showthreeCategorys=false`): 必须选择二级分类 `secondCategorys.id`
3. **确认按钮高亮逻辑**:
   - 一级分类选中时，如果有二级分类则不高亮，无二级分类才高亮
   - 二级分类选中时，如果显示三级分类则不高亮，需要三级选中才高亮

### 后端接口
- `GET /admin/category/platform_categories` - 返回平台所有分类（含三级）
- `GET /admin/category/shop_categories` - 返回店铺所有分类（目前只有二级）
- 分类表结构支持 `level` 字段（0=一级, 1=二级, 2=三级）

### 使用场景
- **商品发布页** (prod-info/index.vue): 选择平台分类和店铺分类，保存 `categoryId` 或 `shopCategoryId`

## 修改方案

### 方案一：仅前端修改（推荐）

#### 修改内容

1. **调整确认按钮高亮逻辑** (lines 133-159)
   - 一级分类选中且存在二级分类时，允许高亮（不再强制要求三级）
   - 二级分类选中时立即高亮（不再判断是否有三级）

2. **调整确认提交逻辑** (lines 170-186)
   - 平台分类：允许只选到二级分类就提交
   - 店铺分类：保持现有逻辑（已满足）

3. **调整 parentId 赋值逻辑**
   - 当前：总是取最后一级选中的分类ID
   - 修改：取实际选中的最后一级分类ID（可能是二级或三级）

#### 代码修改点

```typescript
// selectFirstCategorys 方法修改
const selectFirstCategorys = (categoryId: number, index: number) => {
  // ... 现有逻辑 ...
  
  // 修改：只要有二级分类列表，就允许高亮（不强制要求选到三级）
  if (secondCategorys.dataList.length > 0) {
    buttonHighlight.value = true
  } else {
    buttonHighlight.value = true  // 无二级分类也可以
  }
}

// selectSecondCategorys 方法修改  
const selectSecondCategorys = (categoryId: number, index: number) => {
  // ... 现有逻辑 ...
  
  // 修改：选中二级分类立即高亮，不再判断是否需要三级
  buttonHighlight.value = true
}

// optionsConfirm 方法修改
const optionsConfirm = () => {
  // 平台分类：允许只选到二级
  if (showthreeCategorys.value && !threeCategorys.id && !secondCategorys.id) return
  
  // ... 其余逻辑不变 ...
}
```

### 方案二：前后端都修改

如果业务上要求某些平台分类必须有三级，而某些可以只有二级：

#### 后端修改
1. **Category 表增加字段**: `allowSecondLevel` (是否允许只选二级)
2. **CategoryVO 增加字段**: 返回该标识
3. **接口修改**: `/platform_categories` 返回标识

#### 前端修改
1. 根据后端返回的标识动态控制确认逻辑
2. 对于允许二级的分类，按方案一处理
3. 对于要求三级的分类，保持现有严格逻辑

## 推荐方案

**采用方案一（仅前端修改）**，原因：
1. 改动范围小，风险低
2. 当前店铺分类本身就是二级，平台分类放宽到二级符合一致性
3. 后端无需改动，兼容现有数据

## 具体修改清单

### 文件: CategorySelector/index.vue

| 行号 | 方法 | 修改内容 |
|------|------|----------|
| 133-145 | selectFirstCategorys | 只要有二级分类就允许高亮 |
| 147-160 | selectSecondCategorys | 选中二级立即高亮，不判断三级 |
| 162-168 | selectThreeCategorys | 保持不变 |
| 170-186 | optionsConfirm | 放宽平台分类确认条件 |

### 无需修改的文件
- 后端 CategoryController.java
- 后端 CategoryServiceImpl.java
- 后端 Category 模型
- 使用方 prod-info/index.vue

## 测试验证点

1. **平台分类选择二级**: 可以正常确认，parentId 为二级分类ID
2. **平台分类选择三级**: 可以正常确认，parentId 为三级分类ID
3. **店铺分类选择二级**: 保持现有功能正常
4. **一级分类无二级**: 可以正常确认
5. **未选分类确认**: 按钮应禁用，无法提交

## 回滚方案

如需要回滚，只需恢复 CategorySelector/index.vue 文件到修改前版本即可。
