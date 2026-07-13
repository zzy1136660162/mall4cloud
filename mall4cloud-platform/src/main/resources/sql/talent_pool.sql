CREATE TABLE IF NOT EXISTS `talent_pool`
(
    `id`                 bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name`               varchar(50) NOT NULL COMMENT '姓名',
    `avatar`             varchar(500) DEFAULT NULL COMMENT '头像URL',
    `title`              varchar(100) DEFAULT NULL COMMENT '职称/职位',
    `region`             varchar(100) DEFAULT NULL COMMENT '所在地区/机构',
    `expertise_areas`    json DEFAULT NULL COMMENT '专长领域(JSON数组)',
    `skills`             json DEFAULT NULL COMMENT '专业技能(JSON数组)',
    `experience_years`   int DEFAULT NULL COMMENT '从业年限',
    `education`          varchar(200) DEFAULT NULL COMMENT '教育背景',
    `intro`              text COMMENT '个人简介',
    `project_experience` json DEFAULT NULL COMMENT '项目经验(JSON数组)',
    `achievements`       json DEFAULT NULL COMMENT '成果荣誉(JSON数组)',
    `status`             tinyint NOT NULL DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
    `sort_order`         int NOT NULL DEFAULT 0 COMMENT '排序权重',
    `created_at`         datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`         datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_talent_status_sort` (`status`, `sort_order`, `created_at`),
    KEY `idx_talent_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='研发人才库';
