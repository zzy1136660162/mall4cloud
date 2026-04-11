-- 面包屑导航：将 breadcrumb=null 改为 breadcrumb=1，使所有菜单项正确显示在面包屑中
-- hidden=1 的隐藏菜单不参与面包屑，无需设置

UPDATE mall4cloud_rbac.menu SET breadcrumb = 1 WHERE menu_id IN (
  -- /rbac 子菜单（menu_id=155 为父级 parent_id=0，根据需求决定是否显示）
  157, -- /rbac/role      - 角色管理
  156, -- /rbac/sys-user - 用户管理
  158, -- /rbac/menu     - 平台菜单管理
  159, -- /rbac/menu-permission - 菜单资源

  -- /product 子菜单
  161, -- /product/brand    - 品牌管理
  162, -- /product/category - 分类管理
  160, -- /product/attr    - 属性管理
  175, -- /product/list    - 商品管理

  -- /platform 子菜单
  327, -- /platform/shop-manage - 店铺管理
  257, -- /platform/index-img   - 轮播图管理
  256  -- /platform/hot-search  - 热搜管理
);

-- 如果希望 /rbac、/product、/platform 三个父级也显示在面包屑中（可选），执行：
UPDATE mall4cloud_rbac.menu SET breadcrumb = 1 WHERE menu_id IN (155, 164, 255);
