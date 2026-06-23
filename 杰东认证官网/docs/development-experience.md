# 杰东认证官网开发经验总结

本文记录本项目从首页搭建、二级页面扩展、图标本地化到 SSR 部署验证过程中沉淀的经验，便于后续维护和同类官网项目复用。

## 技术选型

- 使用 Nuxt 3 承担 Vue 服务端渲染、路由、SEO 与生产构建。
- 使用 TailwindCSS 管理视觉系统、响应式布局和组件样式。
- 使用 TypeScript 约束页面数据结构。
- 使用 Vitest 校验本地数据完整性和图标资源存在性。
- 生产部署使用 Nuxt Nitro 的 node-server 输出，即 `.output/server/index.mjs`。

## 项目结构经验

### 全站布局

公共头部和底部不应散落在每个页面里，统一放到 `layouts/default.vue`：

- 首页和二级页面只负责主体内容。
- 导航、页脚、品牌信息集中维护。
- 后续新增页面时只需要新增 `pages/*.vue`。

### 数据组织

当前页面数据仍使用本地 mock 数据，但页面上不要出现“mock 数据”“模拟展示”等开发说明文案。

推荐做法：

- 将结构化数据集中放在 `data/home.ts`。
- 首页数据、导航数据、二级页面数据分区导出。
- 组件只消费数据，不在组件中硬编码列表内容。
- 页面呈现使用正式官网语气，后续接 CMS 或接口时替换数据来源即可。

### 二级页面

本项目已建立以下二级页面：

- `/about`：关于杰东
- `/services`：服务领域
- `/process`：申办流程
- `/news`：政策资讯
- `/cases`：成果示例
- `/contact`：联系我们

二级页面复用 `components/site/PageHero.vue`，保证开头区域视觉统一，同时每个页面在内容区保留差异化结构。

## 图标本地化经验

用户明确要求图标下载到本地，而不是使用 Material Symbols 字体和 `<span>` ligature。

最终方案：

- 从 `@material-symbols/svg-400` 提取需要的 SVG。
- SVG 文件放到 `public/images/icons/`。
- `components/ui/MaterialIcon.vue` 通过 CSS mask 加载本地 SVG。
- 图标使用 `bg-current`，因此可以继承 Tailwind 的 `text-brand-*` 颜色。
- 删除 `material-symbols-outlined.woff2`、字体 preload 和 `.material-symbol` CSS。

这种方式的优点：

- 不依赖远程字体和字体 ligature。
- 图标资源可随项目一起部署。
- 保留原来的 `<MaterialIcon name="..." />` 调用方式，改造成本低。
- 测试可以直接检查每个声明的图标是否存在对应 SVG 文件。

## 视觉设计经验

本项目定位为医药健康合规服务官网，适合“明亮、克制、集团官网级”的方向。

有效做法：

- 首页首屏用浅色背景、精细网格和医疗合规视觉图建立行业感。
- 关键服务使用清晰卡片，但避免卡片套卡片。
- 二级页面使用深色 Page Hero 增强正式感和层级。
- 业务页面信息密度要高于营销落地页，重点展示服务范围、资料清单、流程节点和交付方式。
- 按钮和图标保持克制，避免过度装饰。
- 移动端优先保证文本不溢出、卡片纵向排列、导航可点击。

## SEO 与 SSR

每个页面应单独设置 `useSeoMeta`：

- `title`
- `description`
- 必要时补充 `keywords`
- 首页设置 `ogTitle`、`ogDescription`、`ogType`

验证 SSR 时不要只看浏览器效果，也要检查 HTML 直出：

```powershell
curl.exe -sSI http://127.0.0.1:3000/
```

以及页面源码是否包含标题或关键文案。

## 验证流程

每次较大改动后建议执行：

```powershell
npm run test
npm run typecheck
npm run build
```

本项目额外做了浏览器检查：

- 首页桌面和移动截图
- 服务页桌面和移动截图
- 联系页桌面截图
- 所有二级路由返回 200
- 无水平溢出
- 本地 SVG 图标资源可访问
- HTML 中没有 `material-symbol`、旧字体文件引用和可见 mock 文案

## 部署经验

Nuxt SSR 部署不要上传整个开发目录，上传构建产物即可：

```powershell
npm run build
tar -czf jiedong-cert-output.tar.gz .output
```
服务器连接信息：115.191.79.224:22 账号root 密码：Jiedongyaoye.
服务器运行方式：

```bash
node .output/server/index.mjs
```

当前生产部署使用 Docker Compose：

- 服务名：`jiedong-cert`
- 镜像：`node:22-alpine`
- 容器端口：`5000`
- 宿主机端口：`5000`
- 工作目录：`/app`
- 挂载目录：`/mnt/web-services/jiedong-cert:/app:ro`

Nginx 首页 `/` 反代到：

```nginx
proxy_pass http://jiedong-cert:5000;
```

保留既有业务路径，例如 `/we-api/`、`/admin-page/`、`/public-files`。

## 配置同步经验

服务器改完后，本地生产部署包也要同步：

- 远端 `/mnt/docker-services/docker-compose.yaml`
  同步到
  `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\docker-compose.yaml`

- 远端 `/mnt/docker-services/nginx/conf`
  同步到部署包的 `nginx\conf`

- 远端 `/mnt/docker-services/nginx/conf_d`
  同步到部署包的 `nginx\conf_d`

不要同步：

- `nginx/ssl`
- 日志目录
- 任何密码、私钥、令牌文件

## 容易踩坑

### PowerShell 中文显示乱码

部分命令输出会把 UTF-8 中文显示成乱码，但文件本身可能是正确的。判断中文页面时优先使用：

- 浏览器截图
- Python 按 UTF-8 读取响应
- ASCII 标识符或 Unicode 转义做自动化断言

不要仅凭 PowerShell 控制台显示判断文件编码错误。

### Nuxt dev server 锁

如果 `npm run build` 提示已有 Nuxt dev server 运行，需要确认 PID 属于当前项目后再停止。

### 本地通配符复制

PowerShell 中 `-LiteralPath` 不会按预期展开通配符。同步配置文件时应使用明确文件路径，避免以为复制成功但实际未覆盖。

### 生产验证优先

开发态偶发 Vite 缓存或预转换问题时，可以用生产构建产物验证 SSR：

```powershell
$env:HOST='127.0.0.1'
$env:PORT='3000'
node .output/server/index.mjs
```

生产构建和生产预览通过，才是部署前的关键证据。

## 后续建议

- 将 `data/home.ts` 拆分为 `site.ts`、`home.ts`、`pages.ts`，便于数据增长后维护。
- 联系页表单目前是静态展示，后续可接入后端接口或表单服务。
- 资讯页可继续扩展详情页，例如 `/news/[slug]`。
- 服务页可继续扩展详情页，例如 `/services/[slug]`。
- 部署前继续保持“备份配置、上传产物、启动容器、`nginx -t`、reload、公网验证”的顺序。
