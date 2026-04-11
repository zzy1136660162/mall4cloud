# SPU表选品字段扩展实现计划

## 📋 需求概述

在商品表（SPU）中增加选品相关字段，支持选品中心功能开发。

### 需求清单
- ✅ 选品标识：`is_selection`
- ✅ 佣金相关：`commission_rate`（佣金比例）
- ✅ 商品标签：`is_hot`（热销）、`is_new`（新品）、`is_recommend`（推荐）、`is_selection_best`（精选）
- ✅ 推荐评分：`rating`
- ✅ 销量统计：`total_sales`
- ✅ 月销量统计：`month_sales`

### 关键决策
- ❌ 不需要样品申请功能
- ❌ 不需要审核流程
- ✅ 销量手动设置

---

## 🎯 实现方案

**推荐方案：在现有SPU表基础上扩展**

**理由：**
- 改动最小，只需修改一个表
- 查询效率高，无需JOIN联表
- 维护简单，字段集中管理
- 符合当前需求复杂度

---

## 📝 数据库修改

### 1. SQL脚本 - SPU表增加字段

```sql
-- ============================================
-- SPU表选品功能扩展字段
-- ============================================

-- 选品标识
ALTER TABLE spu ADD COLUMN is_selection TINYINT(1) DEFAULT 0 
COMMENT '是否选品 0-否 1-是' AFTER status;

-- 佣金相关
ALTER TABLE spu ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0.00 
COMMENT '佣金比例（%）' AFTER is_selection;

-- 商品标签
ALTER TABLE spu ADD COLUMN is_hot TINYINT(1) DEFAULT 0 
COMMENT '是否热销 0-否 1-是' AFTER commission_rate;

ALTER TABLE spu ADD COLUMN is_new TINYINT(1) DEFAULT 0 
COMMENT '是否新品 0-否 1-是' AFTER is_hot;

ALTER TABLE spu ADD COLUMN is_recommend TINYINT(1) DEFAULT 0 
COMMENT '是否推荐 0-否 1-是' AFTER is_new;

ALTER TABLE spu ADD COLUMN is_selection_best TINYINT(1) DEFAULT 0 
COMMENT '是否精选 0-否 1-是' AFTER is_recommend;

-- 推荐评分
ALTER TABLE spu ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0 
COMMENT '推荐评分 0.0-5.0' AFTER is_selection_best;

-- 销量统计
ALTER TABLE spu ADD COLUMN total_sales INT DEFAULT 0 
COMMENT '累计销量' AFTER rating;

ALTER TABLE spu ADD COLUMN month_sales INT DEFAULT 0 
COMMENT '月销量' AFTER total_sales;

-- 增加索引优化查询性能
CREATE INDEX idx_spu_is_selection ON spu(is_selection);
CREATE INDEX idx_spu_commission_rate ON spu(commission_rate);
CREATE INDEX idx_spu_is_hot ON spu(is_hot);
CREATE INDEX idx_spu_is_new ON spu(is_new);
CREATE INDEX idx_spu_total_sales ON spu(total_sales);
CREATE INDEX idx_spu_month_sales ON spu(month_sales);
```

---

## 💻 后端Java代码修改

### 2. 修改实体类 - Spu.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/model/Spu.java`

```java
// 在Spu实体类中增加以下字段（添加在status字段后面）

/**
 * 是否选品 0-否 1-是
 */
private Integer isSelection;

/**
 * 佣金比例（%）
 */
private BigDecimal commissionRate;

/**
 * 是否热销 0-否 1-是
 */
private Integer isHot;

/**
 * 是否新品 0-否 1-是
 */
private Integer isNew;

/**
 * 是否推荐 0-否 1-是
 */
private Integer isRecommend;

/**
 * 是否精选 0-否 1-是
 */
private Integer isSelectionBest;

/**
 * 推荐评分 0.0-5.0
 */
private BigDecimal rating;

/**
 * 累计销量
 */
private Integer totalSales;

/**
 * 月销量
 */
private Integer monthSales;
```

**注意：** 添加getter和setter方法，以及对应的MyBatis-Plus注解

### 3. 修改DTO - SpuDTO.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/dto/SpuDTO.java`

```java
// 添加相同的字段定义和验证注解

@NotNull(message = "状态不能为空")
private Integer status;

private Integer isSelection;

@DecimalMin(value = "0.00", message = "佣金比例不能为负数")
@DecimalMax(value = "100.00", message = "佣金比例不能超过100%")
private BigDecimal commissionRate;

private Integer isHot;
private Integer isNew;
private Integer isRecommend;
private Integer isSelectionBest;

@DecimalMin(value = "0.0", message = "评分不能为负数")
@DecimalMax(value = "5.0", message = "评分不能超过5.0")
private BigDecimal rating;

@Min(value = 0, message = "销量不能为负数")
private Integer totalSales;

@Min(value = 0, message = "月销量不能为负数")
private Integer monthSales;
```

### 4. 修改VO - SpuAppVO.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/vo/app/SpuAppVO.java`

```java
// 用于APP端展示

private Integer isSelection;
private BigDecimal commissionRate;
private BigDecimal commissionAmount; // 计算字段：佣金金额 = priceFee * commissionRate / 100
private Integer isHot;
private Integer isNew;
private Integer isRecommend;
private Integer isSelectionBest;
private BigDecimal rating;
private Integer totalSales;
private Integer monthSales;
```

### 5. 修改Service接口 - SpuService.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/service/SpuService.java`

```java
// 增加选品商品查询方法

/**
 * 获取选品商品列表
 * @param isHot 热销
 * @param isNew 新品
 * @param isRecommend 推荐
 * @param isSelectionBest 精选
 * @param minCommissionRate 最低佣金比例
 * @param minRating 最低评分
 * @param orderBy 排序字段
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @return
 */
PageInfo<SpuAppVO> getSelectionProducts(
    Integer isHot,
    Integer isNew,
    Integer isRecommend,
    Integer isSelectionBest,
    BigDecimal minCommissionRate,
    BigDecimal minRating,
    String orderBy,
    Integer pageNum,
    Integer pageSize
);

/**
 * 获取选品商品详情
 * @param spuId
 * @return
 */
SpuAppVO getSelectionProductDetail(Long spuId);
```

### 6. 修改Mapper接口 - SpuMapper.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/mapper/SpuMapper.java`

```java
// 增加选品查询方法

/**
 * 查询选品商品列表
 */
List<Spu> selectSelectionSpuList(@Param("isHot") Integer isHot,
                                  @Param("isNew") Integer isNew,
                                  @Param("isRecommend") Integer isRecommend,
                                  @Param("isSelectionBest") Integer isSelectionBest,
                                  @Param("minCommissionRate") BigDecimal minCommissionRate);
```

### 7. 修改Mapper XML - SpuMapper.xml

**文件路径：** `mall4cloud-product/src/main/resources/mapper/SpuMapper.xml`

```xml
<!-- 增加选品查询SQL -->
<select id="selectSelectionSpuList" resultType="com.mall4j.cloud.product.model.Spu">
    SELECT * FROM spu
    WHERE status = 1
    AND is_selection = 1
    <if test="isHot != null">
        AND is_hot = #{isHot}
    </if>
    <if test="isNew != null">
        AND is_new = #{isNew}
    </if>
    <if test="isRecommend != null">
        AND is_recommend = #{isRecommend}
    </if>
    <if test="isSelectionBest != null">
        AND is_selection_best = #{isSelectionBest}
    </if>
    <if test="minCommissionRate != null">
        AND commission_rate &gt;= #{minCommissionRate}
    </if>
    ORDER BY total_sales DESC, month_sales DESC
</select>
```

### 8. 修改Controller - SpuController.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/controller/app/SpuController.java`

```java
// 增加选品相关API

@Autowired
private SpuService spuService;

/**
 * 获取选品商品列表
 */
@GetMapping("/selection/list")
public R<PageInfo<SpuAppVO>> getSelectionProducts(
    @RequestParam(required = false) Integer isHot,
    @RequestParam(required = false) Integer isNew,
    @RequestParam(required = false) Integer isRecommend,
    @RequestParam(required = false) Integer isSelectionBest,
    @RequestParam(required = false) BigDecimal minCommissionRate,
    @RequestParam(required = false, defaultValue = "0") BigDecimal minRating,
    @RequestParam(required = false, defaultValue = "totalSales") String orderBy,
    @RequestParam(required = false, defaultValue = "1") Integer pageNum,
    @RequestParam(required = false, defaultValue = "10") Integer pageSize
) {
    PageInfo<SpuAppVO> page = spuService.getSelectionProducts(
        isHot, isNew, isRecommend, isSelectionBest,
        minCommissionRate, minRating, orderBy, pageNum, pageSize
    );
    return R.ok(page);
}

/**
 * 获取选品商品详情
 */
@GetMapping("/selection/detail/{spuId}")
public R<SpuAppVO> getSelectionProductDetail(@PathVariable Long spuId) {
    SpuAppVO detail = spuService.getSelectionProductDetail(spuId);
    return R.ok(detail);
}
```

### 9. 商家管理端Controller - Admin/SpuController.java

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/controller/admin/SpuController.java`

```java
/**
 * 保存或更新选品商品
 */
@PostMapping("/selection/save")
public R<Void> saveSelectionSpu(@RequestBody SpuDTO spuDTO) {
    spuService.saveOrUpdateSelectionSpu(spuDTO);
    return R.ok();
}

/**
 * 批量设置选品
 */
@PostMapping("/selection/batch-set")
public R<Void> batchSetSelection(@RequestBody List<Long> spuIds, @RequestParam Integer isSelection) {
    spuService.batchSetSelection(spuIds, isSelection);
    return R.ok();
}

/**
 * 批量设置商品标签
 */
@PostMapping("/selection/batch-tag")
public R<Void> batchSetTags(@RequestBody SelectionTagDTO tagDTO) {
    spuService.batchSetTags(tagDTO);
    return R.ok();
}
```

---

## 🔧 辅助工具类

### 10. 创建选品标签DTO

**文件路径：** `mall4cloud-product/src/main/java/com/mall4j/cloud/product/dto/SelectionTagDTO.java`

```java
@Data
public class SelectionTagDTO {
    
    private List<Long> spuIds;
    
    private Integer isHot;      // 是否热销
    
    private Integer isNew;      // 是否新品
    
    private Integer isRecommend; // 是否推荐
    
    private Integer isSelectionBest; // 是否精选
}
```

---

## 📊 数据库表字段汇总

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| is_selection | TINYINT(1) | 0 | 是否选品 |
| commission_rate | DECIMAL(5,2) | 0.00 | 佣金比例（%） |
| is_hot | TINYINT(1) | 0 | 是否热销 |
| is_new | TINYINT(1) | 0 | 是否新品 |
| is_recommend | TINYINT(1) | 0 | 是否推荐 |
| is_selection_best | TINYINT(1) | 0 | 是否精选 |
| rating | DECIMAL(2,1) | 0.0 | 推荐评分 |
| total_sales | INT | 0 | 累计销量 |
| month_sales | INT | 0 | 月销量 |

**新增索引：**
- idx_spu_is_selection
- idx_spu_commission_rate
- idx_spu_is_hot
- idx_spu_is_new
- idx_spu_total_sales
- idx_spu_month_sales

---

## 🛠️ 实施步骤

### 第一阶段：数据库修改（Day 1）
1. ✅ 编写并审核SQL脚本
2. ✅ 在测试环境执行SQL
3. ✅ 验证字段添加成功

### 第二阶段：后端实体类（Day 1-2）
1. ✅ 修改 Spu.java 实体类
2. ✅ 修改 SpuDTO.java 数据传输对象
3. ✅ 修改 SpuAppVO.java 视图对象
4. ✅ 添加字段验证注解

### 第三阶段：业务逻辑层（Day 2-3）
1. ✅ 修改 SpuService 接口
2. ✅ 实现 SpuServiceImpl 业务逻辑
3. ✅ 修改 SpuMapper 接口
4. ✅ 编写 SpuMapper.xml SQL映射

### 第四阶段：接口层（Day 3-4）
1. ✅ 修改 App/SpuController.java（移动端API）
2. ✅ 修改 Admin/SpuController.java（管理端API）
3. ✅ 创建辅助DTO类

### 第五阶段：测试（Day 4-5）
1. ✅ 单元测试
2. ✅ 接口测试
3. ✅ 性能测试（索引优化验证）

### 第六阶段：上线（Day 5）
1. ✅ 生产环境执行SQL
2. ✅ 部署后端服务
3. ✅ 监控和日志检查

---

## 📝 需要修改的文件清单

### Java文件（9个）
1. `model/Spu.java` - 实体类
2. `dto/SpuDTO.java` - 数据传输对象
3. `dto/SelectionTagDTO.java` - 标签DTO（新增）
4. `vo/app/SpuAppVO.java` - 视图对象
5. `service/SpuService.java` - 服务接口
6. `service/impl/SpuServiceImpl.java` - 服务实现
7. `mapper/SpuMapper.java` - Mapper接口
8. `controller/app/SpuController.java` - APP端Controller
9. `controller/admin/SpuController.java` - 管理端Controller

### 配置文件（1个）
1. `resources/mapper/SpuMapper.xml` - SQL映射文件

### 数据库（1个）
1. SQL执行脚本 - SPU表字段扩展

---

## ⚠️ 注意事项

1. **字段命名规范**
   - MySQL使用下划线：`is_selection`, `commission_rate`
   - Java使用驼峰：`isSelection`, `commissionRate`
   - MyBatis-Plus会自动转换

2. **索引优化**
   - 选品列表查询频繁使用，务必添加索引
   - 复合索引：`(is_selection, is_hot, is_new, total_sales)`

3. **数据一致性**
   - 销量字段手动设置，需要提醒商家定期更新
   - 建议增加修改记录日志

4. **默认值设计**
   - 所有字段默认值为0，保证历史数据兼容
   - 佣金比例默认0.00，表示无佣金

5. **安全性**
   - 佣金比例限制0-100%
   - 评分限制0.0-5.0
   - 销量为非负整数

---

## 🎯 成功标准

1. ✅ 数据库字段正确添加，索引生效
2. ✅ 后端API正常返回选品商品数据
3. ✅ 管理端可以设置商品选品属性
4. ✅ 查询性能满足要求（<200ms）
5. ✅ 历史数据不受影响

---

## 📅 预计工时

- 数据库设计和SQL编写：1小时
- 后端代码修改：4小时
- 接口测试：2小时
- 文档整理：1小时
- **总计：8小时（1-2天）**

---

## 🔗 相关文档

- [SPU选品字段设计方案](README.md)
- [mall4cloud-uniapp选品前端分析](相关文件/选品相关页面/README.md)
