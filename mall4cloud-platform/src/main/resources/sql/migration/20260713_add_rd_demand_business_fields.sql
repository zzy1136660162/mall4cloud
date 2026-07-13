-- 仅供已经存在 rd_demand 的环境执行一次；新环境直接执行 ../rd_demand.sql。
ALTER TABLE `rd_demand`
    ADD COLUMN `product_category` tinyint DEFAULT NULL
        COMMENT '产品品类: 1-体表健康产品 2-功能性食品'
        AFTER `functional_appeal`,
    ADD COLUMN `service_type` varchar(200) DEFAULT NULL
        COMMENT '期望服务类型(JSON数组)'
        AFTER `product_category`,
    ADD COLUMN `expertise_field` varchar(100) DEFAULT NULL
        COMMENT '期望对接领域'
        AFTER `service_type`;
