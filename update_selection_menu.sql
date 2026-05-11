-- 更新选品管理菜单的组件路径，使其与商品管理保持一致
-- 将 component='selection' 改为 component='selection/list'
UPDATE menu SET component = 'selection/list' WHERE menu_id = 501;

-- 将 component='selection#detail' 改为 component='selection/detail'
UPDATE menu SET component = 'selection/detail' WHERE menu_id = 502;
