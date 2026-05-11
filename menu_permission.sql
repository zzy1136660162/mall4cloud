/*
 Navicat Premium Data Transfer

 Source Server         : 101.126.90.255
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : 101.126.90.255:63306
 Source Schema         : mall4cloud_rbac

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 11/04/2026 17:13:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu_permission
-- ----------------------------
DROP TABLE IF EXISTS `menu_permission`;
CREATE TABLE `menu_permission`  (
  `menu_permission_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单资源用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `menu_id` bigint NOT NULL COMMENT '资源关联菜单',
  `biz_type` tinyint NOT NULL COMMENT '业务类型 1 店铺菜单 2平台菜单',
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限对应的编码',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资源名称',
  `uri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资源对应服务器路径',
  `method` tinyint NOT NULL COMMENT '请求方法 1.GET 2.POST 3.PUT 4.DELETE',
  PRIMARY KEY (`menu_permission_id`) USING BTREE,
  UNIQUE INDEX `uk_permission`(`permission` ASC, `biz_type` ASC) USING BTREE,
  INDEX `idx_menuid`(`menu_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 305 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜单资源' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_permission
-- ----------------------------
INSERT INTO `menu_permission` VALUES (1, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 256, 2, 'platform:hotSearch:save', '新增', '/admin/hot_search', 2);
INSERT INTO `menu_permission` VALUES (2, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 256, 2, 'platform:hotSearch:update', '更新', '/admin/hot_search', 3);
INSERT INTO `menu_permission` VALUES (3, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 256, 2, 'platform:hotSearch:delete', '删除', '/admin/hot_search', 4);
INSERT INTO `menu_permission` VALUES (4, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 257, 2, 'platform:indexImg:save', '新增', '/admin/index_img', 2);
INSERT INTO `menu_permission` VALUES (5, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 256, 2, 'platform:indexImg:update', '更新', '/admin/index_img', 3);
INSERT INTO `menu_permission` VALUES (6, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 256, 2, 'platform:indexImg:delete', '删除', '/admin/index_img', 4);
INSERT INTO `menu_permission` VALUES (7, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 160, 2, 'product:attr:save', '新增', '/admin/attr', 2);
INSERT INTO `menu_permission` VALUES (8, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 160, 2, 'product:attr:update', '更新', '/admin/attr', 3);
INSERT INTO `menu_permission` VALUES (9, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 160, 2, 'product:attr:delete', '删除', '/admin/attr', 1);
INSERT INTO `menu_permission` VALUES (10, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 161, 2, 'product:brand:save', '新增', '/platform/brand', 2);
INSERT INTO `menu_permission` VALUES (11, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 161, 2, 'product:brand:update', '更新', '/platform/brand', 3);
INSERT INTO `menu_permission` VALUES (12, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 161, 2, 'product:brand:delete', '删除', '/platform/brand', 1);
INSERT INTO `menu_permission` VALUES (13, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 162, 2, 'product:category:save', '新增', '/admin/category', 2);
INSERT INTO `menu_permission` VALUES (14, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 162, 2, 'product:category:update', '更新', '/admin/category', 3);
INSERT INTO `menu_permission` VALUES (15, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 162, 2, 'product:category:delete', '删除', '/admin/category', 4);
INSERT INTO `menu_permission` VALUES (16, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 162, 2, 'product:category:enableOrDisable', '上架或下架', '/admin/category/category_enable_or_disable', 3);
INSERT INTO `menu_permission` VALUES (17, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 175, 2, 'product:product:info', '查看详情', '/admin/spu', 1);
INSERT INTO `menu_permission` VALUES (18, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 175, 2, 'product:product:delete', '删除', '/admin/spu', 4);
INSERT INTO `menu_permission` VALUES (19, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 156, 2, 'system:user:save', '新增', '/sys_user', 2);
INSERT INTO `menu_permission` VALUES (20, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 156, 2, 'system:user:update', '更新', '/sys_user', 3);
INSERT INTO `menu_permission` VALUES (21, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 156, 2, 'system:user:delete', '删除', '/sys_user', 4);
INSERT INTO `menu_permission` VALUES (22, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 156, 2, 'system:userAccount:save', '设置账号', '/sys_user/account', 2);
INSERT INTO `menu_permission` VALUES (23, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 156, 2, 'system:userAccount:update', '修改账号', '/sys_user/account', 3);
INSERT INTO `menu_permission` VALUES (24, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 157, 2, 'system:role:save', '新增', '/role', 2);
INSERT INTO `menu_permission` VALUES (25, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 157, 2, 'system:role:update', '更新', '/role', 3);
INSERT INTO `menu_permission` VALUES (26, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 157, 2, 'system:role:delete', '删除', '/role', 1);
INSERT INTO `menu_permission` VALUES (27, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 178, 2, 'system:menuRoute:save', '新增', '/menu', 2);
INSERT INTO `menu_permission` VALUES (28, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 178, 2, 'system:menuRoute:update', '更新', '/menu', 3);
INSERT INTO `menu_permission` VALUES (29, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 178, 2, 'system:menuRoute:delete', '删除', '/menu', 4);
INSERT INTO `menu_permission` VALUES (30, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 158, 2, 'system:platformMenuRoute:save', '新增', '/menu', 2);
INSERT INTO `menu_permission` VALUES (31, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 158, 2, 'system:platformMenuRoute:update', '更新', '/menu', 3);
INSERT INTO `menu_permission` VALUES (32, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 158, 2, 'system:platformMenuRoute:delete', '删除', '/menu', 4);
INSERT INTO `menu_permission` VALUES (33, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 159, 2, 'system:menuPermission:save', '新增', '/menu_permission', 2);
INSERT INTO `menu_permission` VALUES (34, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 159, 2, 'system:menuPermission:update', '更新', '/menu_permission', 3);
INSERT INTO `menu_permission` VALUES (35, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 159, 2, 'system:menuPermission:delete', '删除', '/menu_permission', 4);
INSERT INTO `menu_permission` VALUES (36, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 258, 1, 'admin:hotSearch:save', '保存', '/admin/hot_search', 2);
INSERT INTO `menu_permission` VALUES (37, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 258, 1, 'admin:hotSearch:update', '更新', '/admin/hot_search', 3);
INSERT INTO `menu_permission` VALUES (38, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 258, 1, 'admin:hotSearch:delete', '删除', '/admin/hot_search', 4);
INSERT INTO `menu_permission` VALUES (39, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 146, 1, 'admin:indexImg:save', '保存', '/admin/index_img', 2);
INSERT INTO `menu_permission` VALUES (40, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 146, 1, 'admin:indexImg:update', '更新', '/admin/index_img', 3);
INSERT INTO `menu_permission` VALUES (41, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 146, 1, 'admin:indexImg:delete', '删除', '/admin/index_img', 4);
INSERT INTO `menu_permission` VALUES (42, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 137, 1, 'product:attr:save', '保存', '/admin/attr', 2);
INSERT INTO `menu_permission` VALUES (43, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 137, 1, 'product:attr:update', '更新', '/admin/attr', 3);
INSERT INTO `menu_permission` VALUES (44, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 137, 1, 'product:attr:delete', '删除', '/admin/attr', 4);
INSERT INTO `menu_permission` VALUES (45, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 139, 1, 'product:category:save', '保存', '/admin/category', 2);
INSERT INTO `menu_permission` VALUES (46, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 139, 1, 'product:category:update', '更新', '/admin/category', 3);
INSERT INTO `menu_permission` VALUES (47, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 139, 1, 'product:category:delete', '删除', '/admin/category', 4);
INSERT INTO `menu_permission` VALUES (48, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 139, 1, 'product:category:enableOrDisable', '上架或下架', '/admin/category/category_enable_or_disable', 3);
INSERT INTO `menu_permission` VALUES (49, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 152, 1, 'product:product:save', '保存', '/admin/spu', 2);
INSERT INTO `menu_permission` VALUES (50, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 152, 1, 'product:product:update', '更新', '/admin/spu', 3);
INSERT INTO `menu_permission` VALUES (51, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 152, 1, 'product:product:delete', '删除', '/admin/spu', 4);
INSERT INTO `menu_permission` VALUES (52, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 152, 1, 'product:product:status', '上架或下架', '/admin/spu/prod_status', 3);
INSERT INTO `menu_permission` VALUES (53, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 148, 1, 'admin:order:info', '订单详情', '/m/order/order_info', 1);
INSERT INTO `menu_permission` VALUES (54, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 148, 1, 'admin:order:delivery', '发货', '/m/order/delivery', 2);
INSERT INTO `menu_permission` VALUES (55, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 112, 1, 'admin:shopUser:save', '保存', '/m/shop_user', 2);
INSERT INTO `menu_permission` VALUES (56, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 112, 1, 'admin:shopUser:update', '更新', '/m/shop_user', 3);
INSERT INTO `menu_permission` VALUES (57, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 112, 1, 'admin:shopUser:delete', '删除', '/m/shop_user', 4);
INSERT INTO `menu_permission` VALUES (58, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 134, 1, 'admin:role:save', '保存', '/role', 2);
INSERT INTO `menu_permission` VALUES (59, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 134, 1, 'admin:role:update', '更新', '/role', 3);
INSERT INTO `menu_permission` VALUES (60, '2026-04-02 09:46:18', '2026-04-02 09:46:18', 134, 1, 'admin:role:delete', '删除', '/role', 4);
INSERT INTO `menu_permission` VALUES (103, '2026-04-11 05:19:46', '2026-04-11 05:19:46', 329, 2, 'platform:demand:list', '查看列表', '/demand/page', 1);
INSERT INTO `menu_permission` VALUES (104, '2026-04-11 05:19:46', '2026-04-11 05:19:46', 329, 2, 'platform:demand:info', '查看详情', '/demand/detail', 1);
INSERT INTO `menu_permission` VALUES (105, '2026-04-11 05:19:46', '2026-04-11 05:19:46', 329, 2, 'platform:demand:handle', '处理需求', '/demand/handle', 2);
INSERT INTO `menu_permission` VALUES (106, '2026-04-11 05:19:46', '2026-04-11 05:19:46', 329, 2, 'platform:demand:withdraw', '撤回需求', '/demand/withdraw', 2);
INSERT INTO `menu_permission` VALUES (107, '2026-04-11 05:19:46', '2026-04-11 05:19:46', 329, 2, 'platform:demand:reapply', '重新申请', '/demand/reapply', 2);
INSERT INTO `menu_permission` VALUES (108, '2026-04-11 05:19:47', '2026-04-11 05:19:47', 329, 2, 'platform:demand:delete', '删除需求', '/demand/delete', 2);
INSERT INTO `menu_permission` VALUES (300, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 501, 1, 'admin:selection:list', '查看列表', '/mall4cloud_platform/admin/selection/applies', 1);
INSERT INTO `menu_permission` VALUES (301, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 501, 1, 'admin:selection:detail', '查看详情', '/mall4cloud_platform/admin/selection/detail', 1);
INSERT INTO `menu_permission` VALUES (302, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 501, 1, 'admin:selection:statistics', '查看统计', '/mall4cloud_platform/admin/selection/statistics', 1);
INSERT INTO `menu_permission` VALUES (303, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 501, 1, 'admin:selection:audit', '审核', '/mall4cloud_platform/admin/selection/audit', 3);
INSERT INTO `menu_permission` VALUES (304, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 501, 1, 'admin:selection:ship', '填写物流', '/mall4cloud_platform/admin/selection/ship', 3);

SET FOREIGN_KEY_CHECKS = 1;
