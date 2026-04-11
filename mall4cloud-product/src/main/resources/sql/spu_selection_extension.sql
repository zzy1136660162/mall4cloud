-- ============================================
-- SPU表选品功能扩展字段
-- 执行前请备份数据库！
-- ============================================

-- 选品标识：是否选品商品
ALTER TABLE spu ADD COLUMN is_selection TINYINT(1) DEFAULT 0 
COMMENT '是否选品 0-否 1-是' AFTER status;

-- 佣金相关：佣金比例（百分比）
ALTER TABLE spu ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0.00 
COMMENT '佣金比例（%）' AFTER is_selection;

-- 商品标签：是否热销
ALTER TABLE spu ADD COLUMN is_hot TINYINT(1) DEFAULT 0 
COMMENT '是否热销 0-否 1-是' AFTER commission_rate;

-- 商品标签：是否新品
ALTER TABLE spu ADD COLUMN is_new TINYINT(1) DEFAULT 0 
COMMENT '是否新品 0-否 1-是' AFTER is_hot;

-- 商品标签：是否推荐
ALTER TABLE spu ADD COLUMN is_recommend TINYINT(1) DEFAULT 0 
COMMENT '是否推荐 0-否 1-是' AFTER is_new;

-- 商品标签：是否精选
ALTER TABLE spu ADD COLUMN is_selection_best TINYINT(1) DEFAULT 0 
COMMENT '是否精选 0-否 1-是' AFTER is_recommend;

-- 推荐评分：0.0-5.0
ALTER TABLE spu ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0 
COMMENT '推荐评分 0.0-5.0' AFTER is_selection_best;

-- 销量统计：累计销量
ALTER TABLE spu ADD COLUMN total_sales INT DEFAULT 0 
COMMENT '累计销量' AFTER rating;

-- 销量统计：月销量
ALTER TABLE spu ADD COLUMN month_sales INT DEFAULT 0 
COMMENT '月销量' AFTER total_sales;

-- ============================================
-- 创建索引优化查询性能
-- ============================================

-- 选品标识索引
CREATE INDEX idx_spu_is_selection ON spu(is_selection);

-- 佣金比例索引
CREATE INDEX idx_spu_commission_rate ON spu(commission_rate);

-- 热销标签索引
CREATE INDEX idx_spu_is_hot ON spu(is_hot);

-- 新品标签索引
CREATE INDEX idx_spu_is_new ON spu(is_new);

-- 累计销量索引
CREATE INDEX idx_spu_total_sales ON spu(total_sales);

-- 月销量索引
CREATE INDEX idx_spu_month_sales ON spu(month_sales);

-- ============================================
-- 创建复合索引（优化选品列表查询）
-- ============================================
CREATE INDEX idx_spu_selection_query ON spu(is_selection, is_hot, is_new, total_sales DESC);

-- ============================================
-- 验证字段添加成功
-- ============================================
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, COLUMN_COMMENT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'your_database_name' 
--   AND TABLE_NAME = 'spu'
--   AND COLUMN_NAME IN (
--     'is_selection', 'commission_rate', 'is_hot', 'is_new',
--     'is_recommend', 'is_selection_best', 'rating', 
--     'total_sales', 'month_sales'
--   );

-- ============================================
-- 回滚脚本（如需回滚，执行以下SQL）
-- ============================================
-- ALTER TABLE spu DROP COLUMN IF EXISTS month_sales;
-- ALTER TABLE spu DROP COLUMN IF EXISTS total_sales;
-- ALTER TABLE spu DROP COLUMN IF EXISTS rating;
-- ALTER TABLE spu DROP COLUMN IF EXISTS is_selection_best;
-- ALTER TABLE spu DROP COLUMN IF EXISTS is_recommend;
-- ALTER TABLE spu DROP COLUMN IF EXISTS is_new;
-- ALTER TABLE spu DROP COLUMN IF EXISTS is_hot;
-- ALTER TABLE spu DROP COLUMN IF EXISTS commission_rate;
-- ALTER TABLE spu DROP COLUMN IF EXISTS is_selection;
-- 
-- DROP INDEX IF EXISTS idx_spu_is_selection ON spu;
-- DROP INDEX IF EXISTS idx_spu_commission_rate ON spu;
-- DROP INDEX IF EXISTS idx_spu_is_hot ON spu;
-- DROP INDEX IF EXISTS idx_spu_is_new ON spu;
-- DROP INDEX IF EXISTS idx_spu_total_sales ON spu;
-- DROP INDEX IF EXISTS idx_spu_month_sales ON spu;
-- DROP INDEX IF EXISTS idx_spu_selection_query ON spu;
