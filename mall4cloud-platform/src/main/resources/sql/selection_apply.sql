-- ============================================
-- 选品申请表（也是选品记录表）
-- 执行前请备份数据库！
-- ============================================

-- 1. 在 role 表中增加达人角色
INSERT INTO `role` (`role_id`, `role_name`, `remark`, `create_user_id`, `biz_type`, `tenant_id`)
VALUES (100, '达人', 'talent', 0, 2, 0)
ON DUPLICATE KEY UPDATE role_name = '达人', remark = 'talent';

-- 2. 创建选品申请表
CREATE TABLE IF NOT EXISTS `selection_apply` (
  `apply_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  
  -- 申请人信息
  `user_id` BIGINT NOT NULL COMMENT '申请人用户ID',
  `user_name` VARCHAR(50) COMMENT '申请人姓名',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `delivery_address` VARCHAR(500) NOT NULL COMMENT '邮寄地址',
  
  -- 商品信息
  `spu_id` BIGINT NOT NULL COMMENT '商品SPU ID',
  `spu_name` VARCHAR(200) COMMENT '商品名称（冗余）',
  `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
  `shop_name` VARCHAR(100) COMMENT '店铺名称（冗余）',
  `main_img_url` VARCHAR(500) COMMENT '商品主图（冗余）',
  `price_fee` BIGINT COMMENT '商品价格（分）（冗余）',
  
  -- 申请信息
  `apply_remark` VARCHAR(500) COMMENT '申请备注/理由',
  `apply_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  
  -- 审核信息
  `audit_status` TINYINT NOT NULL DEFAULT 1 COMMENT '审核状态 1-待审核 2-已通过 3-已拒绝',
  `audit_time` DATETIME COMMENT '审核时间',
  `audit_user_id` BIGINT COMMENT '审核人ID',
  `audit_remark` VARCHAR(500) COMMENT '审核备注',
  
  -- 物流信息
  `express_company` VARCHAR(50) COMMENT '快递公司',
  `express_no` VARCHAR(50) COMMENT '快递单号',
  `ship_time` DATETIME COMMENT '发货时间',
  
  -- 系统字段
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT(1) DEFAULT 0,
  
  PRIMARY KEY (`apply_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_spu_id` (`spu_id`),
  KEY `idx_shop_id` (`shop_id`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_apply_time` (`apply_time`),
  KEY `idx_user_spu` (`user_id`, `spu_id`, `audit_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='选品申请表（选品记录表）';

-- ============================================
-- 验证表创建成功
-- ============================================
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'your_database_name' 
--   AND TABLE_NAME = 'selection_apply';

-- ============================================
-- 回滚脚本（如需回滚，执行以下SQL）
-- ============================================
-- DROP TABLE IF EXISTS selection_apply;
-- DELETE FROM role WHERE role_id = 100 AND remark = 'talent';
