import type { App } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

function install(app: App) {
  app.use(ElementPlus)
  // 注册所有 Element Plus 图标为全局组件（业务视图用到如 <el-icon><Search /></el-icon>）
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

export default { install }
export { zhCN }
