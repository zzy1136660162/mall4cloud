# 后端微服务架构优化方案：完全移除mall4cloud-search服务

## 一、当前架构分析

### 1.1 mall4cloud-search服务功能清单

mall4cloud-search服务当前包含以下功能模块：

#### 1.1.1 商品搜索功能
- **App端商品搜索** (`/ua/search/page`)
  - 包含聚合分析（品牌、分类、属性）
  - 支持关键字搜索、复杂过滤
  - 多种排序方式

- **App端简单商品列表** (`/ua/search/simple_page`)
  - 不包含聚合分析的简单列表

- **平台端商品管理列表** (`/p/search/page`)
  - 平台管理员使用的商品列表

- **商家端商品管理列表** (`/m/search/page`)
  - 商家端商品管理列表

#### 1.1.2 订单搜索功能
- **商家端订单搜索** (`/m/order/page`)
- **用户端订单搜索** (`/p/myOrder/search_order`)

#### 1.1.3 Canal数据同步功能（ES索引同步）

| 监听器 | 监控表 | 功能描述 |
|--------|--------|----------|
| SpuCanalListener | spu | SPU表变更同步到ES |
| SpuExtensionCanalListener | spu_extension | SPU扩展表变更同步到ES（库存、销量） |
| BrandCanalListener | brand | 品牌表变更更新ES中的商品 |
| CategoryCanalListener | category | 分类表变更更新ES中的商品 |
| ShopDetailCanalListener | shop_detail | 店铺详情表变更更新ES中的商品 |
| OrderCanalListener | order | 订单表变更同步到ES |

#### 1.1.4 Feign接口服务

| Feign接口 | 提供的功能 | 消费者 |
|-----------|-----------|--------|
| SearchSpuFeignClient | 商品搜索、店铺商品列表 | mall4cloud-multishop |
| SearchOrderFeignClient | 订单搜索 | mall4cloud-order |

### 1.2 依赖search服务的消费者

| 消费者服务 | 依赖的功能 | 迁移方案 |
|-----------|-----------|---------|
| mall4cloud-order | SearchOrderFeignClient.getOrderPage() | 迁移到order服务自身实现 |
| mall4cloud-multishop | SearchSpuFeignClient.limitSizeListByShopIds() | 迁移到product服务 |

### 1.3 前端依赖

多个前端页面通过API调用search服务：
- 选品列表页面
- 商品搜索页面
- 店铺搜索页面
- 订单列表页面

## 二、迁移方案总体设计

### 2.1 迁移策略

**完全移除mall4cloud-search服务**，将功能按业务领域分配到对应的微服务：

| 原search服务功能 | 迁移目标服务 | 说明 |
|----------------|------------|------|
| 商品搜索API | mall4cloud-product | 保留现有app端spu接口，扩展支持搜索 |
| 平台/商家商品列表 | mall4cloud-product | 扩展现有admin接口 |
| 订单搜索API | mall4cloud-order | 新增或扩展order服务接口 |
| Canal数据同步 | 删除 | 移除ES同步功能 |
| Feign接口 | 迁移到product/order服务 | 重新定义接口归属 |

### 2.2 迁移后的服务职责

#### mall4cloud-product服务职责扩展
- ✅ 选品商品分页列表（已存在）
- ✅ 商品详情（已存在）
- ➕ 扩展商品搜索功能（关键字、过滤、聚合）
- ➕ 提供店铺商品列表查询
- ➕ 商家端商品管理列表
- ➕ 平台端商品管理列表

#### mall4cloud-order服务职责扩展
- ✅ 订单详情查询（已存在）
- ➕ 扩展订单搜索功能
- ➕ 商家端订单列表
- ➕ 用户端订单列表

#### mall4cloud-search服务
- ❌ 完全删除

## 三、详细迁移计划

### 第一阶段：Product服务功能扩展（5-7天）

#### 3.1.1 扩展现有接口

**文件：`mall4cloud-product/src/main/java/com/mall4j/cloud/product/controller/app/SpuController.java`**

改动内容：
1. 扩展 `/ua/spu/page` 接口
   - 添加关键字搜索支持（name, selling_point）
   - 添加品牌、分类过滤
   - 添加聚合查询参数
   - 调整返回数据结构包含聚合数据

2. 添加新的搜索接口（如需要）
   - `/ua/spu/search` - 高级搜索
   - `/ua/spu/simple_page` - 简单列表

#### 3.1.2 扩展SpuPageSearchDTO

**文件：`mall4cloud-product/src/main/java/com/mall4j/cloud/product/dto/SpuPageSearchDTO.java`**

新增字段：
```java
// 关键字搜索
private String keyword;           // 关键字（商品名、卖点）

// 品牌过滤
private String brandIds;          // 品牌ID列表，逗号分隔

// 分类过滤
private Long primaryCategoryId;   // 平台一级分类ID
private Long secondaryCategoryId; // 平台二级分类ID
private Long categoryId;         // 平台三级分类ID
private Long shopPrimaryCategoryId;  // 店铺一级分类ID
private Long shopSecondaryCategoryId; // 店铺二级分类ID

// 属性过滤
private String attrValueIds;      // 属性值ID列表，逗号分隔

// 库存和类型
private Integer hasStock;         // 是否有库存：0/1
private Integer selfShop;         // 是否自营店：0/1

// 价格和销量区间
private Long maxPrice;            // 最大价格
private Long minPrice;            // 最小价格
private Long maxSaleNum;         // 最大销量
private Long minSaleNum;          // 最小销量

// 排序
private Integer priceFeeSort;    // 价格排序：0降序 1升序
private Integer saleNumSort;      // 销量排序：0降序 1升序
private Integer stockSort;        // 库存排序：0降序 1升序
private Integer seqSort;          // 序号排序：0降序 1升序
private Integer createTimeSort;   // 创建时间排序：0降序 1升序
private Integer commissionSort;   // 佣金排序：0降序 1升序
```

#### 3.1.3 扩展SpuVO和新增VO

**新增文件：`mall4cloud-product/src/main/java/com/mall4j/cloud/product/vo/SpuSearchPageVO.java`**

```java
// 搜索分页结果VO
public class SpuSearchPageVO {
    private List<SpuVO> spus;           // 商品列表
    private List<BrandVO> brands;       // 品牌聚合
    private List<CategoryVO> categorys; // 分类聚合
    private List<AttrVO> attrs;        // 属性聚合
    private ShopInfoVO shopInfo;       // 店铺信息（简化）
}
```

**修改文件：`mall4cloud-product/src/main/java/com/mall4j/cloud/api/product/vo/SpuVO.java`**

新增字段：
```java
private Long actualStock;         // 实际库存
private Long saleNum;            // 销量
```

#### 3.1.4 优化Mapper层

**文件：`mall4cloud-product/src/main/resources/mapper/SpuMapper.xml`**

改动：
1. **优化list方法**
   ```xml
   <!-- 添加关键字搜索 -->
   <if test="spu.keyword != null and spu.keyword != ''">
     AND (s.name LIKE CONCAT('%', #{spu.keyword}, '%')
          OR s.selling_point LIKE CONCAT('%', #{spu.keyword}, '%'))
   </if>

   <!-- 添加品牌过滤 -->
   <if test="spu.brandIds != null and spu.brandIds != ''">
     AND s.brand_id IN (${spu.brandIds})
   </if>

   <!-- 添加分类过滤 -->
   <if test="spu.primaryCategoryId != null">
     AND s.category_id = #{spu.primaryCategoryId}
   </if>
   <!-- ... 其他分类过滤 ... -->

   <!-- 添加库存过滤 -->
   <if test="spu.hasStock == 1">
     AND se.stock > 0
   </if>
   <if test="spu.hasStock == 0">
     AND se.stock = 0
   </if>
   ```

2. **新增聚合查询SQL**（可选，如果需要聚合数据）
   - 品牌聚合查询
   - 分类聚合查询
   - 属性聚合查询

#### 3.1.5 扩展Service层

**文件：`mall4cloud-product/src/main/java/com/mall4j/cloud/product/service/SpuService.java`**

新增方法：
```java
/**
 * 搜索商品列表（包含聚合数据）
 * @param pageDTO 分页参数
 * @param spuDTO 搜索条件
 * @return 搜索结果
 */
SpuSearchPageVO searchPage(PageDTO pageDTO, SpuPageSearchDTO spuDTO);

/**
 * 根据店铺ID列表获取商品列表（每个店铺取固定数量）
 * @param shopIds 店铺ID列表
 * @param size 每个店铺取的商品数量
 * @return 商品列表
 */
List<SpuVO> listByShopIds(List<Long> shopIds, Integer size);
```

#### 3.1.6 新增Feign接口

**文件：`mall4cloud-api/mall4cloud-api-product/src/main/java/com/mall4j/cloud/api/product/feign/ProductSpuFeignClient.java`**

新增接口：
```java
/**
 * 根据店铺ID列表获取商品列表
 */
@RestFeignClient(value = "product", path = "/ua/spu")
public interface ProductSpuFeignClient {

    @GetMapping("/shop_ids")
    ServerResponseEntity<List<SpuVO>> listByShopIds(
        @RequestParam("shopIds") List<Long> shopIds,
        @RequestParam("size") Integer size
    );
}
```

### 第二阶段：Order服务功能扩展（3-4天）

#### 3.2.1 扩展订单搜索功能

**文件：`mall4cloud-order/src/main/java/com/mall4j/cloud/order/controller/multishop/OrderController.java`**

改动：
1. **移除**对SearchOrderFeignClient的依赖
2. **新增**本地订单搜索实现

新增Service方法：
```java
// OrderService.java
/**
 * 搜索订单列表
 * @param orderSearchDTO 搜索条件
 * @return 订单分页列表
 */
PageVO<OrderVO> searchOrders(OrderSearchDTO orderSearchDTO);
```

新增Mapper方法：
```java
// OrderMapper.xml
<!-- 订单搜索SQL -->
<select id="searchOrders" resultType="OrderVO">
  SELECT o.* FROM `order` o
  LEFT JOIN order_item oi ON o.order_id = oi.order_id
  WHERE 1=1
  <if test="shopId != null">
    AND o.shop_id = #{shopId}
  </if>
  <if test="userId != null">
    AND o.user_id = #{userId}
  </if>
  <if test="status != null">
    AND o.status = #{status}
  </if>
  <if test="spuName != null and spuName != ''">
    AND EXISTS (
      SELECT 1 FROM order_item WHERE order_id = o.order_id
      AND spu_name LIKE CONCAT('%', #{spuName}, '%')
    )
  </if>
  <if test="orderId != null">
    AND o.order_id = #{orderId}
  </if>
  <if test="consignee != null and consignee != ''">
    AND o.consignee LIKE CONCAT('%', #{consignee}, '%')
  </if>
  <if test="mobile != null and mobile != ''">
    AND o.mobile = #{mobile}
  </if>
  <if test="startTime != null">
    AND o.create_time >= #{startTime}
  </if>
  <if test="endTime != null">
    AND o.create_time <= #{endTime}
  </if>
  ORDER BY o.create_time DESC
</select>
```

#### 3.2.2 商家端订单列表

**修改：`mall4cloud-order/src/main/java/com/mall4j/cloud/order/controller/multishop/OrderController.java`**

```java
@GetMapping("/page")
public ServerResponseEntity<PageVO<OrderVO>> page(OrderSearchDTO orderSearchDTO) {
    Long shopId = AuthUserContext.get().getTenantId();
    orderSearchDTO.setShopId(shopId);
    return ServerResponseEntity.success(orderService.searchOrders(orderSearchDTO));
}
```

#### 3.2.3 用户端订单列表

**修改：`mall4cloud-order/src/main/java/com/mall4j/cloud/order/controller/app/MyOrderController.java`**

```java
@GetMapping("/search_order")
public ServerResponseEntity<PageVO<OrderVO>> searchOrder(OrderSearchDTO orderSearchDTO) {
    Long userId = AuthUserContext.get().getUserId();
    orderSearchDTO.setUserId(userId);
    return ServerResponseEntity.success(orderService.searchOrders(orderSearchDTO));
}
```

### 第三阶段：ShopDetailService迁移（1-2天）

#### 3.3.1 迁移到Product服务

**修改：`mall4cloud-multishop/src/main/java/com/mall4j/cloud/multishop/service/impl/ShopDetailServiceImpl.java`**

改动：
1. **移除**对SearchSpuFeignClient的依赖
2. **新增**对ProductSpuFeignClient的依赖

```java
@Autowired
private ProductSpuFeignClient productSpuFeignClient;

@Override
public PageVO<ShopDetailAppVO> shopSearchPage(PageDTO pageDTO, ShopDetailDTO shopDetailDTO) {
    PageVO<ShopDetailAppVO> page = PageUtil.doPage(pageDTO, () -> shopDetailMapper.shopSearchList(shopDetailDTO));
    Set<Long> shopIdSet = page.getList().stream().map(ShopDetailAppVO::getShopId).collect(Collectors.toSet());
    
    // 调用product服务的接口
    ServerResponseEntity<List<SpuVO>> spuResponse = productSpuFeignClient.listByShopIds(
        new ArrayList<>(shopIdSet), 
        Constant.SPU_SIZE_FIVE
    );
    
    if (!Objects.equals(spuResponse.getCode(), ResponseEnum.OK.value())) {
        throw new Mall4cloudException(spuResponse.getMsg());
    } else if (CollectionUtil.isEmpty(spuResponse.getData())) {
        return page;
    }
    
    List<SpuVO> data = spuResponse.getData();
    Map<Long, List<SpuVO>> shopMap = data.stream().collect(Collectors.groupingBy(SpuVO::getShopId));
    for (ShopDetailAppVO shopDetail : page.getList()) {
        shopDetail.setSpuList(shopMap.get(shopDetail.getShopId()));
    }
    return page;
}
```

### 第四阶段：前端适配（3-4天）

#### 3.4.1 修改API调用

需要修改的前端文件：

1. **选品列表页面**
   - 文件：`front-end/mall4cloud-uniapp/src/utils/api/selection.js`
   - 改动：API调用从 `/ua/search/page` 改为 `/ua/spu/page`

2. **商品搜索页面**
   - 文件：`front-end/mall4cloud-uniapp/src/utils/api/product.js`（如存在）
   - 改动：API调用地址调整

3. **店铺搜索页面**
   - 文件：`front-end/mall4cloud-uniapp/src/pages/shop-search/`
   - 改动：API调用调整

4. **订单列表页面**
   - 文件：`front-end/mall4cloud-uniapp/src/pages/order/`
   - 改动：API调用从 `/m/order/page` 改为 `/m/order/page`（地址不变，接口实现变了）

#### 3.4.2 调整返回数据解析

根据新的返回数据结构调整前端代码：
- 调整聚合数据的解析
- 调整商品列表的数据解析
- 调整分页数据的处理

### 第五阶段：删除Search服务（1-2天）

#### 3.5.1 删除mall4cloud-search模块

```bash
# 删除整个search模块
rm -rf mall4cloud-search/
```

#### 3.5.2 清理API模块

**文件：`mall4cloud-api/mall4cloud-api-search/`**

```bash
# 删除search相关的API模块
rm -rf mall4cloud-api/mall4cloud-api-search/
```

#### 3.5.3 清理pom依赖

**文件：`pom.xml`**

移除mall4cloud-search模块和相关依赖

#### 3.5.4 清理网关配置

**文件：`mall4cloud-gateway/`**

移除search服务的路由配置

### 第六阶段：测试与部署（3-5天）

#### 3.6.1 单元测试

1. Product服务测试
   - 商品搜索功能测试
   - 分页查询测试
   - 聚合查询测试

2. Order服务测试
   - 订单搜索功能测试
   - 多条件过滤测试

#### 3.6.2 集成测试

1. API接口测试
   - App端选品列表
   - 商家端商品列表
   - 平台端商品列表
   - 商家端订单列表
   - 用户端订单列表

2. Feign调用测试
   - product服务调用测试
   - order服务调用测试

#### 3.6.3 前端集成测试

1. 页面功能测试
2. 数据展示验证
3. 用户交互测试

#### 3.6.4 性能测试

1. 查询性能测试
2. 并发测试
3. 压力测试

## 四、代码改动清单

### 4.1 Product服务改动

| 文件路径 | 改动类型 | 改动说明 |
|---------|---------|---------|
| `controller/app/SpuController.java` | 修改 | 扩展搜索接口 |
| `controller/admin/SpuController.java` | 修改 | 扩展商品列表接口 |
| `service/SpuService.java` | 修改 | 添加搜索方法 |
| `service/impl/SpuServiceImpl.java` | 修改 | 实现搜索方法 |
| `mapper/SpuMapper.java` | 修改 | 添加搜索SQL |
| `mapper/SpuMapper.xml` | 修改 | 优化SQL查询 |
| `dto/SpuPageSearchDTO.java` | 修改 | 扩展搜索条件 |
| `vo/SpuVO.java` | 修改 | 添加字段 |
| `vo/SpuSearchPageVO.java` | 新增 | 搜索结果VO |

### 4.2 Order服务改动

| 文件路径 | 改动类型 | 改动说明 |
|---------|---------|---------|
| `controller/multishop/OrderController.java` | 修改 | 本地实现订单搜索 |
| `controller/app/MyOrderController.java` | 修改 | 本地实现订单搜索 |
| `service/OrderService.java` | 修改 | 添加搜索方法 |
| `service/impl/OrderServiceImpl.java` | 修改 | 实现搜索方法 |
| `mapper/OrderMapper.java` | 修改 | 添加搜索SQL |
| `mapper/OrderMapper.xml` | 修改 | 优化订单查询SQL |

### 4.3 API模块改动

| 文件路径 | 改动类型 | 改动说明 |
|---------|---------|---------|
| `mall4cloud-api-product/feign/ProductSpuFeignClient.java` | 新增 | 新增Feign接口 |
| `mall4cloud-api-search/` | 删除 | 删除整个模块 |

### 4.4 Multishop服务改动

| 文件路径 | 改动类型 | 改动说明 |
|---------|---------|---------|
| `service/impl/ShopDetailServiceImpl.java` | 修改 | 改用ProductFeignClient |

### 4.5 前端改动

| 文件路径 | 改动类型 | 改动说明 |
|---------|---------|---------|
| `selection.js` | 修改 | API调用地址调整 |
| 其他相关页面 | 修改 | 数据解析调整 |

## 五、风险评估与应对

### 5.1 功能风险

#### 5.1.1 全文搜索功能减弱

**风险**：MySQL的LIKE查询无法实现ES的分词搜索
**应对**：
- 使用MySQL 5.7+的FULLTEXT索引
- 评估业务对分词搜索的依赖程度
- 如有需要，后续引入轻量化搜索方案

#### 5.1.2 聚合查询性能

**风险**：复杂聚合查询可能导致性能问题
**应对**：
- 实现查询缓存
- 限制聚合返回数量
- 使用Redis缓存热门聚合结果

### 5.2 性能风险

#### 5.2.1 数据库压力增加

**风险**：搜索功能迁移到MySQL会增加数据库负载
**应对**：
- 添加合适的索引
- 实施读写分离
- 考虑使用主从复制分担负载
- 添加Redis缓存层

### 5.3 数据一致性风险

**风险**：移除Canal同步后，需要确保数据库和ES的数据一致性
**应对**：
- 完全移除ES后不存在数据一致性问题
- 确保所有数据查询都直接访问MySQL

## 六、项目时间估算

| 阶段 | 工作内容 | 预计时间 |
|------|---------|---------|
| Product服务功能扩展 | Controller、Service、Mapper改动 | 5-7天 |
| Order服务功能扩展 | Controller、Service、Mapper改动 | 3-4天 |
| ShopDetailService迁移 | 依赖切换 | 1-2天 |
| 前端适配 | API调用调整、功能测试 | 3-4天 |
| 删除Search服务 | 模块删除、配置清理 | 1-2天 |
| 测试验证 | 单元测试、集成测试、性能测试 | 3-5天 |
| **总计** | **完整迁移** | **16-24天** |

## 七、上线部署

### 7.1 部署步骤

1. **预发布环境部署**
   - 部署扩展后的product服务
   - 部署扩展后的order服务
   - 部署前端修改
   - 进行完整功能验证

2. **灰度发布**
   - 小流量切换API调用
   - 监控接口性能和错误率
   - 收集用户反馈

3. **全量发布**
   - 确认无误后全量切换
   - 监控线上指标
   - 准备回滚方案

### 7.2 回滚方案

1. **快速回滚**
   - 保留原有search服务
   - 前端快速切换回原有API
   - 回滚时间：5分钟

2. **完全回滚**
   - 恢复search服务
   - 恢复原有API调用
   - 回滚时间：30分钟

## 八、总结

本次架构优化将完全移除mall4cloud-search服务，将商品搜索功能迁移到mall4cloud-product服务，将订单搜索功能迁移到mall4cloud-order服务。通过MySQL查询替代ES搜索，在中小规模数据量下能够满足业务需求，并且：

### 优点
- ✅ 大幅简化系统架构
- ✅ 降低运维成本（无需维护ES集群）
- ✅ 减少服务间通信
- ✅ 数据一致性更容易保证

### 缺点
- ⚠️ 全文搜索功能减弱（分词搜索）
- ⚠️ 复杂聚合查询性能可能不如ES
- ⚠️ 大数据量下性能可能下降

### 后续优化建议
1. 引入缓存层（Redis）提升查询性能
2. 使用MySQL FULLTEXT索引改善搜索体验
3. 根据业务增长情况评估是否需要引入ClickHouse或其他OLAP引擎
