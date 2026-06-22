# ES数据同步问题排查计划

## 一、问题描述

**症状**：`http://127.0.0.1:8000/mall4cloud_search/ua/search/simple_page?shopId=0&pageNum=1&pageSize=20` 接口返回空数据，但MySQL中有产品数据

**可能原因**：
1. MySQL数据未同步到ES
2. ES索引配置不正确
3. 查询条件不匹配
4. 微服务配置问题

---

## 二、排查步骤

### 步骤 1：连接远程服务器

**目标**：登录远程服务器进行排查

```bash
ssh root@167.88.180.246 -p 6000
```

### 步骤 2：检查MySQL数据

**目标**：确认MySQL中是否有产品数据

```bash
# 登录MySQL
mysql -h127.0.0.1 -P3306 -uroot -p'Gesoft9919.'

# 查看所有数据库
SHOW DATABASES;

# 查找产品相关数据库
USE mall4cloud_product;

# 查看spu表数据量
SELECT COUNT(*) FROM spu;

# 查看示例数据
SELECT spu_id, name, price_fee, shop_id FROM spu LIMIT 5;

# 查看选品商品
SELECT COUNT(*) FROM spu WHERE is_selection = 1;
```

### 步骤 3：检查ES状态

**目标**：确认ES是否运行、数据是否存在

```bash
# 检查ES进程
ps aux | grep elasticsearch

# 检查ES端口
netstat -tlnp | grep 9200

# 查看ES健康状态
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/_cluster/health'

# 查看所有索引
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/_cat/indices?v'

# 查看product索引详情
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/product?pretty'

# 查看product索引文档数量
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/product/_count'

# 搜索测试
curl -u elastic:Gesoft9919. -X POST 'http://127.0.0.1:9200/product/_search?pretty' -H 'Content-Type: application/json' -d '{"query":{"match_all":{}},"size":1}'
```

### 步骤 4：检查Canal状态

**目标**：确认Canal是否正常运行

```bash
# 检查Canal容器
docker ps | grep canal

# 查看Canal日志
docker logs mall4cloud-canal --tail 50

# 检查Canal是否连接MySQL
docker logs mall4cloud-canal 2>&1 | grep -E "(master|binlog|destination)"

# 查看Canal连接状态
docker exec mall4cloud-canal cat /home/admin/canal-server/logs/example/example.log | tail -30
```

### 步骤 5：手动执行数据同步

**目标**：如果ES中没有数据，手动同步MySQL数据到ES

**前提**：在每个关键修改步骤向用户确认

#### 5.1 删除旧索引（确认）
```bash
curl -u elastic:Gesoft9919. -X DELETE 'http://127.0.0.1:9200/product'
```

#### 5.2 创建新索引（确认）
```bash
curl -u elastic:Gesoft9919. -X PUT 'http://127.0.0.1:9200/product' -H 'Content-Type: application/json' -d '{
  "mappings": {
    "properties": {
      "spuId": { "type": "long" },
      "spuName": { "type": "text", "analyzer": "ik_max_word" },
      "mainImgUrl": { "type": "keyword" },
      "priceFee": { "type": "long" },
      "marketPriceFee": { "type": "long" },
      "shopId": { "type": "long" },
      "shopName": { "type": "text" },
      "categoryId": { "type": "long" },
      "categoryName": { "type": "keyword" },
      "totalSales": { "type": "long" },
      "isSelection": { "type": "integer" },
      "commissionRate": { "type": "float" },
      "createTime": { "type": "date" }
    }
  }
}'
```

#### 5.3 导出MySQL数据（确认）
```bash
mysql -h127.0.0.1 -P3306 -uroot -p'Gesoft9919.' mall4cloud_product -N -e "
SELECT 
  spu_id, name, main_img_url, price_fee, market_price_fee,
  shop_id, shop_name, category_id, category_name,
  total_sales, is_selection, commission_rate, create_time
FROM spu 
WHERE spu_status = 1
" > /tmp/spu_data.txt
```

#### 5.4 转换并导入ES（确认）
```bash
# 使用Python脚本转换
cat > /tmp/sync_es.py << 'PYEOF'
import sys
import json

input_file = '/tmp/spu_data.txt'
output_file = '/tmp/spu_bulk.json'

with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(output_file, 'w', encoding='utf-8') as f:
    for line in lines:
        fields = line.strip().split('\t')
        if len(fields) >= 13:
            spu_id, name, main_img, price, market_price, shop_id, shop_name, cat_id, cat_name, sales, is_sel, commission, create_time = fields
            
            # 生成index action
            f.write(json.dumps({"index": {"_id": spu_id}}) + '\n')
            
            # 生成document
            doc = {
                "spuId": int(spu_id) if spu_id else 0,
                "spuName": name or "",
                "mainImgUrl": main_img or "",
                "priceFee": int(price) if price else 0,
                "marketPriceFee": int(market_price) if market_price else 0,
                "shopId": int(shop_id) if shop_id else 0,
                "shopName": shop_name or "",
                "categoryId": int(cat_id) if cat_id else 0,
                "categoryName": cat_name or "",
                "totalSales": int(sales) if sales else 0,
                "isSelection": int(is_sel) if is_sel else 0,
                "commissionRate": float(commission) if commission else 0.0,
                "createTime": create_time if create_time else "1970-01-01 00:00:00"
            }
            f.write(json.dumps(doc, ensure_ascii=False) + '\n')

print(f"转换完成，共{len(lines)}条记录")
PYEOF

python3 /tmp/sync_es.py
```

#### 5.5 批量导入ES（确认）
```bash
curl -u elastic:Gesoft9919. -X POST 'http://127.0.0.1:9200/_bulk' --data-binary @/tmp/spu_bulk.json
```

#### 5.6 验证导入结果（确认）
```bash
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/product/_count'
```

---

## 三、解决方案

### 方案A：一次性手动同步（推荐用于测试）

适合场景：开发测试、快速验证

### 方案B：配置Canal实时同步（生产环境）

适合场景：生产环境、需要实时同步

#### 修改Canal配置

```bash
# 编辑Canal配置文件
vim canal/conf/example/instance.properties
```

配置内容：
```properties
canal.instance.master.address=127.0.0.1:3306
canal.instance.dbUsername=root
canal.instance.dbPassword=Gesoft9919.
canal.instance.filter.regex=mall4cloud_product\\.spu
```

---

## 四、验证流程

同步完成后，执行以下验证：

```bash
# 1. 检查ES文档数量
curl -u elastic:Gesoft9919. 'http://127.0.0.1:9200/product/_count'

# 2. 搜索测试
curl -u elastic:Gesoft9919. -X POST 'http://127.0.0.1:9200/product/_search?pretty' -H 'Content-Type: application/json' -d '{"query":{"match_all":{}},"size":3}'

# 3. 测试选品查询
curl -u elastic:Gesoft9919. -X POST 'http://127.0.0.1:9200/product/_search?pretty' -H 'Content-Type: application/json' -d '{"query":{"term":{"isSelection":1}},"size":3}'

# 4. 测试搜索接口
curl 'http://127.0.0.1:8000/mall4cloud_search/ua/search/simple_page?shopId=0&pageNum=1&pageSize=20'
```

---

## 五、关键确认点

在执行以下操作前，需要向你确认：

- [ ] **步骤1**：确认是否登录远程服务器
- [ ] **步骤2**：确认MySQL连接信息是否正确
- [ ] **步骤3**：确认删除旧ES索引
- [ ] **步骤4**：确认创建新ES索引
- [ ] **步骤5**：确认导出MySQL数据
- [ ] **步骤6**：确认导入数据到ES
- [ ] **步骤7**：最终验证

---

## 六、预期结果

成功同步后：
1. ES中product索引有数据
2. 搜索接口返回产品列表
3. 选品接口（isSelection=1）返回选品商品
