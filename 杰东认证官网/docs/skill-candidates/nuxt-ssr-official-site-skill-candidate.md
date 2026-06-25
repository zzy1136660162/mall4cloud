# Nuxt SSR 官网开发与部署流程候选

## 适用场景

适用于开发企业官网、认证咨询官网、服务型官网等需要 Nuxt SSR、TailwindCSS、本地静态资源、二级页面、SEO 和 Docker/Nginx 部署的项目。

## 不适用场景

- 只需要单页静态 HTML 的轻量展示页。
- 已经有成熟后端 CMS 且前端只做接口联调的项目。
- 纯后台管理系统或高交互 SaaS 产品。

## 前置条件

- 已确认技术栈为 Nuxt 3、Vue 3、TailwindCSS。
- 已明确是否需要 SSR，而不是纯静态导出。
- 已确认视觉方向、导航结构、页面层级。
- 部署前能访问服务器、Docker Compose 和 Nginx 配置。

## 推荐工具顺序

1. 本地代码检索：`rg --files`、`rg`
2. 结构化数据建模：TypeScript interface
3. UI 实现：Nuxt pages、layouts、components
4. 图标本地化：下载 SVG 到 `public/images/icons`
5. 验证：Vitest、`nuxt typecheck`、`nuxt build`
6. 浏览器验证：Playwright 截图、路由访问、水平溢出检查
7. 部署：构建 `.output`、上传产物、Docker Compose、Nginx reload
8. 同步：把远端 compose 和 Nginx 配置同步回本地部署包

## 标准流程

### 1. 建立项目骨架

- 使用 Nuxt SSR。
- 设置 `layouts/default.vue` 统一头部和底部。
- 页面放在 `pages/`。
- 通用组件放在 `components/site/`。
- 业务组件按模块放在 `components/home/` 或对应目录。

### 2. 建立本地数据层

- 用 TypeScript interface 定义数据结构。
- 将导航、首页、二级页面数据集中维护。
- 页面允许使用本地 mock 数据，但用户可见文案不要出现 mock 说明。

### 3. 图标本地化

- 从图标包或官方资源下载 SVG。
- 放到 `public/images/icons/`。
- 使用一个统一图标组件读取本地 SVG。
- 删除字体图标文件、preload 和 ligature CSS。
- 增加测试检查所有声明图标都有本地 SVG。

### 4. 开发页面

- 首页建立品牌第一印象。
- 二级页面复用统一 Page Hero。
- 每个二级页面根据内容设计差异化结构：
  - 关于页：公司定位、能力、方法
  - 服务页：业务分类、服务细项、方法矩阵
  - 流程页：阶段、资料范围、协作原则
  - 资讯页：专题、文章列表
  - 案例页：成果示例、展示边界
  - 联系页：联系方式、咨询方向、表单展示

### 5. 验证

运行：

```bash
npm run test
npm run typecheck
npm run build
```

浏览器检查：

- 所有路由返回 200。
- 关键标题存在。
- 页面没有水平溢出。
- 本地 SVG 图标资源可访问。
- HTML 不包含旧字体图标引用。
- 用户可见页面不包含 mock 说明文案。

### 6. 部署

构建：

```bash
npm run build
```

上传 `.output` 到服务器应用目录。

Docker Compose 服务示例：

```yaml
service-name:
  image: node:22-alpine
  restart: always
  working_dir: /app
  environment:
    - NODE_ENV=production
    - HOST=0.0.0.0
    - PORT=<port>
  ports:
    - "<port>:<port>"
  volumes:
    - <remote-app-dir>:/app:ro
  command: ["node", ".output/server/index.mjs"]
```

Nginx 反代：

```nginx
location / {
    proxy_pass http://<service-name>:<port>;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 7. 配置同步

部署后将远端生效配置同步回本地部署包：

- `docker-compose.yaml`
- `nginx/conf`
- `nginx/conf_d`

同步前先备份本地旧配置。不要同步 SSL 私钥、日志或敏感配置。

## 关键校验点

- `npm run build` exit code 为 0。
- `docker compose config --quiet` 通过。
- `docker compose up -d <service>` 后容器保持运行。
- `docker exec <nginx-container> nginx -t` 通过。
- HTTP/HTTPS/端口直连均返回 200。
- HTML 中包含 SSR 直出的页面标题。

## 常见失败与处理

| 现象 | 原因 | 处理 |
|---|---|---|
| 构建提示 Nuxt dev server 已运行 | 当前项目有 dev server 锁 | 确认 PID 属于当前项目后停止，再构建 |
| PowerShell 中文输出乱码 | 控制台编码显示问题 | 用浏览器、UTF-8 读取或 Unicode 断言验证 |
| 本地配置同步后还是旧内容 | PowerShell 通配符未展开 | 使用明确文件路径复制 |
| 页面仍请求字体图标 | preload/CSS/旧文件未删干净 | 删除 woff2、preload、`.material-symbol`，重新 build |
| Nginx reload 风险 | 配置未先测试 | 必须先 `nginx -t`，失败则回滚备份 |

## 安全边界

- 不记录服务器密码、令牌、证书私钥。
- 不同步 `nginx/ssl`，除非用户明确要求。
- 不把临时远端配置快照长期留在项目目录。
- 远端修改配置前必须备份。

## 可复用提示词

请按 Nuxt SSR 官网开发与部署流程执行：目标是开发一个企业官网，要求 SSR、TailwindCSS、本地 SVG 图标、结构化本地数据、首页和二级页面、SEO。完成后运行测试、类型检查、生产构建和浏览器截图验证；如涉及服务器部署，先备份配置，再修改 Docker Compose 与 Nginx，最后同步生效配置回本地部署包。
