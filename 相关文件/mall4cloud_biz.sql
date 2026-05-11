/*
 Navicat Premium Data Transfer

 Source Server         : 101.126.90.255
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : 101.126.90.255:63306
 Source Schema         : mall4cloud_biz

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 11/04/2026 15:21:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attach_file
-- ----------------------------
DROP TABLE IF EXISTS `attach_file`;
CREATE TABLE `attach_file`  (
  `file_id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件路径',
  `file_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件类型',
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件名',
  `file_size` int NULL DEFAULT NULL COMMENT '文件大小',
  `shop_id` bigint NULL DEFAULT NULL COMMENT '店铺id',
  `type` tinyint NULL DEFAULT NULL COMMENT '文件 1:图片 2:视频 3:文件',
  `attach_file_group_id` bigint NULL DEFAULT 0 COMMENT '文件分组id',
  PRIMARY KEY (`file_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1434 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '上传文件记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of attach_file
-- ----------------------------
INSERT INTO `attach_file` VALUES (1431, '2026-04-09 06:33:15', '2026-04-09 06:33:15', '/2026/04/09/22d6c0d415654d45b579918ffc73cc08', 'png', '压缩.png', 2697, 324, 1, NULL);
INSERT INTO `attach_file` VALUES (1432, '2026-04-09 06:34:43', '2026-04-09 06:34:43', '/2026/04/09/ec62f1c7b94c4abcabb24c528879a4b0', 'png', '压缩.png', 2697, 324, 1, NULL);
INSERT INTO `attach_file` VALUES (1433, '2026-04-09 06:35:31', '2026-04-09 06:35:31', '/2026/04/09/42810e8cc74841368566734b5a436a70', 'png', '压缩.png', 2697, 324, 1, NULL);

-- ----------------------------
-- Table structure for attach_file_group
-- ----------------------------
DROP TABLE IF EXISTS `attach_file_group`;
CREATE TABLE `attach_file_group`  (
  `attach_file_group_id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `shop_id` bigint NOT NULL COMMENT '店铺id',
  `name` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分组名称',
  `type` tinyint NOT NULL COMMENT '1:图片 2:视频 3:文件',
  PRIMARY KEY (`attach_file_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 162 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of attach_file_group
-- ----------------------------

-- ----------------------------
-- Table structure for undo_log
-- ----------------------------
DROP TABLE IF EXISTS `undo_log`;
CREATE TABLE `undo_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `branch_id` bigint NOT NULL,
  `xid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `context` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rollback_info` longblob NOT NULL,
  `log_status` int NOT NULL,
  `log_created` datetime NOT NULL,
  `log_modified` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ux_undo_log`(`xid` ASC, `branch_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of undo_log
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
