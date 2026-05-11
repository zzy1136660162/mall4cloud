CREATE TABLE IF NOT EXISTS `rd_demand`
(
    `id`                     int auto_increment comment '主键ID'
        primary key,
    `demand_no`              varchar(50)                        not null comment '需求编号',
    `title`                  varchar(200)                       not null comment '需求标题',
    `functional_appeal`      text                               not null comment '功能诉求',
    `target_audience`        varchar(200)                       not null comment '目标人群',
    `dosage_form_preference` varchar(100)                       null comment '剂型偏好',
    `budget_range`           varchar(50)                        not null comment '预算范围',
    `expected_delivery_time` date                               not null comment '期望交付时间',
    `remark`                 text                               null comment '备注',
    `submitter_id`           varchar(50)                        not null comment '提交人ID',
    `submitter_name`         varchar(50)                        null comment '提交人姓名',
    `submitter_phone`        varchar(20)                        null comment '提交人电话',
    `status`                 tinyint  default 0                 not null comment '状态: 0-待处理 1-确认中 2-研发中 3-样品制作 4-已完成 5-已取消',
    `status_text`            varchar(20)                        not null comment '状态文本',
    `admin_remark`           text                               null comment '处理备注',
    `handler_name`           varchar(50)                        null comment '处理人',
    `submit_time`            datetime                           not null comment '提交时间',
    `update_time`            datetime                           not null comment '更新时间',
    `create_time`            datetime default CURRENT_TIMESTAMP null comment '创建时间',
    constraint `uk_demand_no`
        unique (`demand_no`)
)
    comment '研发需求主表' collate = utf8mb4_unicode_ci
                           row_format = DYNAMIC;

CREATE INDEX `idx_status`
    ON `rd_demand` (`status`);

CREATE INDEX `idx_submitter_id`
    ON `rd_demand` (`submitter_id`);
