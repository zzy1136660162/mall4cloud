/**
 * 网站配置工具函数
 */

// 网站配置默认信息
const configDefInfo = {
  // 登录logo
  loginBgImg: new URL('@/assets/images/login-bg.jpg', import.meta.url).href,
  // 版权声明
  copyrightCn: 'Copyright © 2018-2026 杰东药业 版权所有',
  copyrightEn: 'Copyright © 2018-2026 Jiedong Pharma All Rights Reserved',
  // 标题文本
  titleContentCn: '杰东药业-管理后台',
  titleContentEn: 'Jiedong Pharma - Admin',
  // 网站标题图标
  titleImg: new URL('@/assets/images/logo.png', import.meta.url).href,
  // 菜单栏顶部图标
  bsTopBarIcon: new URL('@/assets/images/logo.png', import.meta.url).href,
  // 菜单展开文本
  bsMenuTitleOpenCn: '杰东药业',
  bsMenuTitleOpenEn: 'Jiedong Pharma',
  // 菜单收缩文本
  bsMenuTitleCloseCn: '管理后台',
  bsMenuTitleCloseEn: 'Admin'
}

/**
 * 添加图片域名
 * @param {string} path - 图片路径
 * @returns {string} 带域名的完整路径
 */
function addDomain(path) {
  const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
  if (!path || /^https?:\/\//.test(path)) {
    return path
  } else {
    return resourcesUrl + path
  }
}

/**
 * 格式化配置信息
 * @param {Object} config - 原始配置
 * @returns {Object} 格式化后的配置
 */
function formatConfigInfo(config) {
  const data = {}
  config = JSON.parse(JSON.stringify(config))
  // 检测图片是否携带域名
  config.loginBgImg = addDomain(config.loginBgImg)
  config.titleImg = addDomain(config.titleImg)
  config.bsTopBarIcon = addDomain(config.bsTopBarIcon)

  // 为空使用默认配置
  data.loginBgImg = config.loginBgImg || configDefInfo.loginBgImg
  data.copyrightCn = config.copyrightCn || configDefInfo.copyrightCn
  data.copyrightEn = config.copyrightEn || configDefInfo.copyrightEn
  data.titleContentCn = config.titleContentCn || configDefInfo.titleContentCn
  data.titleContentEn = config.titleContentEn || configDefInfo.titleContentEn
  data.titleImg = config.titleImg || configDefInfo.titleImg
  data.bsTopBarIcon = config.bsTopBarIcon || configDefInfo.bsTopBarIcon
  data.bsMenuTitleOpenCn = config.bsMenuTitleOpenCn || configDefInfo.bsMenuTitleOpenCn
  data.bsMenuTitleOpenEn = config.bsMenuTitleOpenEn || configDefInfo.bsMenuTitleOpenEn
  data.bsMenuTitleCloseCn = config.bsMenuTitleCloseCn || configDefInfo.bsMenuTitleCloseCn
  data.bsMenuTitleCloseEn = config.bsMenuTitleCloseEn || configDefInfo.bsMenuTitleCloseEn
  return Object.assign(config, data)
}

export { configDefInfo, formatConfigInfo, addDomain }
