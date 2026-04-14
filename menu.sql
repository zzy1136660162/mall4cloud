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

 Date: 11/04/2026 17:10:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `menu_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `parent_id` bigint UNSIGNED NOT NULL COMMENT '父菜单ID，一级菜单为0',
  `biz_type` tinyint NULL DEFAULT NULL COMMENT '业务类型 1 店铺菜单 2平台菜单',
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限，需要有哪个权限才能访问该菜单',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路径 就像uri',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '1.\'Layout\' 为布局，不会跳页面 2.\'components-demo/tinymce\' 跳转到该页面',
  `redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '当设置 noRedirect 的时候该路由在面包屑导航中不可被点击',
  `always_show` tinyint NULL DEFAULT NULL COMMENT '一直显示根路由',
  `hidden` tinyint NULL DEFAULT NULL COMMENT '当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题',
  `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '设置该路由在侧边栏和面包屑中展示的名字',
  `icon` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon',
  `no_cache` tinyint NULL DEFAULT NULL COMMENT '如果设置为true，则不会被 <keep-alive> 缓存(默认 false)',
  `breadcrumb` tinyint NULL DEFAULT NULL COMMENT '如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)',
  `affix` tinyint NULL DEFAULT NULL COMMENT '若果设置为true，它则会固定在tags-view中(默认 false)',
  `active_menu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '当路由设置了该属性，则会高亮相对应的侧边栏。',
  `seq` int NULL DEFAULT NULL COMMENT '排序，越小越靠前',
  PRIMARY KEY (`menu_id`) USING BTREE,
  INDEX `idx_pid`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 503 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜单管理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (111, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 0, 1, NULL, '/rbac', 'Layout', NULL, NULL, 0, '权限管理', '权限管理', 'office-buildingplus', NULL, NULL, NULL, NULL, 99);
INSERT INTO `menu` VALUES (112, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 111, 1, NULL, 'shop_user', 'rbac/shop-user', NULL, NULL, 0, '用户管理', '用户管理', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (134, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 111, 1, NULL, 'role', 'rbac/role', NULL, NULL, 0, '角色管理', '角色管理', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `menu` VALUES (137, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 141, 1, NULL, 'attr', 'product/attr', NULL, NULL, 0, '属性管理', '属性管理', NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (139, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 141, 1, NULL, 'category', 'product/category', NULL, NULL, 0, 'category', '分类管理', NULL, NULL, NULL, NULL, NULL, 2);
INSERT INTO `menu` VALUES (141, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 0, 1, NULL, '/product', 'Layout', NULL, NULL, 0, '商品管理', '商品管理', 'ShoppingBagplus', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (142, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 141, 1, NULL, 'prod_info', 'product/prod-info', NULL, NULL, 0, '发布商品', '发布商品', NULL, NULL, NULL, NULL, NULL, 4);
INSERT INTO `menu` VALUES (145, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 0, 1, NULL, '/multishop', 'Layout', NULL, NULL, 0, '店铺管理', '店铺管理', 'Shopplus', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (146, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 145, 1, NULL, 'index_img', 'multishop/index-img', NULL, NULL, 0, '轮播图管理', '轮播图管理', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (147, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 0, 1, NULL, '/order', 'Layout', NULL, NULL, 0, '订单管理', '订单管理', 'documentplus', NULL, NULL, NULL, NULL, 90);
INSERT INTO `menu` VALUES (148, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 147, 1, NULL, 'order', 'order/order', NULL, NULL, 0, 'order', '订单管理', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `menu` VALUES (152, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 141, 1, NULL, 'list', 'product/list', NULL, NULL, 0, '商品列表', '商品列表', '', NULL, NULL, NULL, NULL, 5);
INSERT INTO `menu` VALUES (155, '2026-04-02 09:46:06', '2026-04-11 03:05:06', 0, 2, NULL, '/rbac', 'Layout', NULL, NULL, 0, '权限管理', '权限管理', 'office-buildingplus', NULL, 1, NULL, NULL, 99);
INSERT INTO `menu` VALUES (156, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 155, 2, NULL, 'sys-user', 'rbac/sys-user', NULL, NULL, 0, '用户管理', '用户管理', '', NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (157, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 155, 2, NULL, 'role', 'rbac/role', NULL, NULL, 0, '角色管理', '角色管理', NULL, NULL, 1, NULL, NULL, 1);
INSERT INTO `menu` VALUES (158, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 155, 2, NULL, 'menu', 'rbac/menu', NULL, NULL, 0, '平台菜单管理', '平台菜单管理', NULL, NULL, 1, NULL, NULL, 2);
INSERT INTO `menu` VALUES (159, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 155, 2, NULL, 'menu-permission', 'rbac/menu-permission', NULL, NULL, 0, '菜单资源', '菜单资源', NULL, NULL, 1, NULL, NULL, 3);
INSERT INTO `menu` VALUES (160, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 164, 2, NULL, 'attr', 'product/attr', NULL, NULL, 0, '属性管理', '属性管理', NULL, NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (161, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 164, 2, NULL, 'brand', 'product/brand', NULL, NULL, 0, '品牌管理', '品牌管理', NULL, NULL, 1, NULL, NULL, 1);
INSERT INTO `menu` VALUES (162, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 164, 2, NULL, 'category', 'product/category', NULL, NULL, 0, 'category', '分类管理', NULL, NULL, 1, NULL, NULL, 2);
INSERT INTO `menu` VALUES (164, '2026-04-02 09:46:06', '2026-04-11 03:05:06', 0, 2, NULL, '/product', 'Layout', NULL, NULL, 0, 'product', '商品管理', 'ShoppingBagplus', NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (175, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 164, 2, NULL, 'list', 'product/list', NULL, NULL, 0, '商品管理', '商品管理', '', NULL, 1, NULL, NULL, 5);
INSERT INTO `menu` VALUES (178, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 155, 2, NULL, 'shop-menu', 'rbac/shop-menu', NULL, NULL, 0, '店铺菜单管理', '店铺菜单管理', '', NULL, NULL, NULL, NULL, 2);
INSERT INTO `menu` VALUES (255, '2026-04-02 09:46:06', '2026-04-11 03:05:06', 0, 2, NULL, '/platform', 'Layout', NULL, NULL, 0, 'platform', '平台管理', 'tree', NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (256, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 255, 2, NULL, 'hot-search', 'platform/hot-search', NULL, NULL, 0, 'hot-search', '热搜管理', 'el-icon-search', NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (257, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 255, 2, NULL, 'index-img', 'platform/index-img', NULL, NULL, 0, '轮播图管理', '轮播图管理', 'el-icon-picture-outline', NULL, 1, NULL, NULL, 0);
INSERT INTO `menu` VALUES (258, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 145, 1, NULL, 'hot-search', 'multishop/hot-search', NULL, NULL, 0, 'hot-search', '热搜管理', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (302, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 255, 2, NULL, 'shop-detail', 'platform/shop-detail', NULL, NULL, 1, '店铺详情', '店铺详情', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (306, '2026-04-02 09:46:06', '2026-04-02 09:46:06', 255, 2, NULL, 'shop-edit', 'platform/shop-edit', NULL, NULL, 1, '店铺编辑', '店铺编辑', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (327, '2026-04-02 09:46:06', '2026-04-11 03:05:05', 255, 2, NULL, 'shop-manage', 'platform/shop-manage', NULL, NULL, 0, '店铺管理', '店铺管理', 'el-icon-s-order', NULL, 1, NULL, NULL, 3);
INSERT INTO `menu` VALUES (328, '2026-04-11 05:19:26', '2026-04-11 05:33:43', 0, 1, NULL, '/demand', 'Layout', NULL, NULL, 0, 'demand', '需求研发管理', 'el-icon-document', NULL, NULL, NULL, NULL, 2);
INSERT INTO `menu` VALUES (329, '2026-04-11 05:19:26', '2026-04-11 05:33:39', 328, 1, NULL, 'list', 'demand/list', NULL, NULL, 0, 'demandList', '需求列表', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (500, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 0, 1, NULL, '/selection', 'Layout', NULL, 0, NULL, 'SelectionManagement', '选品管理', 'shopping', NULL, NULL, NULL, NULL, 60);
INSERT INTO `menu` VALUES (501, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 500, 1, NULL, 'selection', 'selection/list', NULL, 0, NULL, 'SelectionApply', '选品申请', '', NULL, NULL, NULL, NULL, 0);
INSERT INTO `menu` VALUES (502, '2026-04-11 10:00:00', '2026-04-11 10:00:00', 500, 1, NULL, 'detail/:id', 'selection/detail', NULL, 0, 1, 'SelectionApplyDetail', '选品申请详情', '', NULL, NULL, NULL, NULL, 1);

SET FOREIGN_KEY_CHECKS = 1;
