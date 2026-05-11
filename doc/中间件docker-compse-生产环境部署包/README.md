# Mall4Cloud 生产环境部署包说明

本目录用于部署 Mall4Cloud 当前版本依赖的中间件容器。

当前这套部署包已经按实际可用方案调整过，和早期文档相比，主要差异如下：

- 使用 `ports` 端口映射，不再使用 `network_mode: host`
- RocketMQ 已兼容“宿主机 JAR 服务 + Docker Dashboard”同时访问
- Seata 已固定 JVM 内存，避免自动按宿主机内存放大
- Nginx 已拆分为 `conf` + `conf_d`
- 新增 `8021` 静态站点，用于 `mall4cloud-multishop-ui`

## 1. 目录说明

部署包主要目录：

- `docker-compose.yaml`：中间件启动编排
- `mysql/initdb`：MySQL 初始化 SQL
- `nacos`：Nacos 日志与初始化相关配置
- `canal`：Canal 配置
- `rocketmq`：RocketMQ namesrv、broker、dashboard 配置
- `seata`：Seata 配置
- `nginx/conf/nginx.conf`：Nginx 主配置
- `nginx/conf_d/*.conf`：Nginx 站点配置

## 2. 部署前需要修改的内容

### 2.1 服务器 IP

如果你不是部署到当前默认服务器，需要把目录内涉及固定 IP 的配置替换成你的服务器 IP。

当前部署中已使用过的公网 IP 为：

- `115.191.79.224`

建议检查这些位置：

- `mysql/initdb/*.sql`
- `rocketmq/broker/conf/broker.conf`
- 其他文档示例中的访问地址

### 2.2 Nginx 静态站点目录

当前 `docker-compose.yaml` 中，Nginx 额外挂载了：

- 宿主机目录：`/mnt/web-services/mall4cloud-multishop-ui`
- 容器目录：`/usr/share/nginx/mall4cloud-multishop-ui`

请确保服务器上该目录存在，并且里面是已经打包好的 `mall4cloud-multishop-ui` 静态资源。

### 2.3 脚本/JAR 服务环境

如果你还要在宿主机上运行 JAR 微服务，请另外准备：

- JDK 17
- `/mnt/web-services/scripts/apps/*.jar`

本部署包本身只负责中间件容器，不负责自动上传和启动业务 JAR。

## 3. 服务器目录建议

建议将本目录完整上传到服务器，例如：

```bash
/mnt/docker-services
```

然后在该目录执行：

```bash
docker compose up -d
```

## 4. 启动前建议处理

根据挂载目录情况，建议先确认以下目录存在并具备读写权限：

```bash
mkdir -p ./mysql/data ./mysql/conf.d ./mysql/initdb
mkdir -p ./minio/data
mkdir -p ./nacos/logs
mkdir -p ./canal/logs
mkdir -p ./rocketmq/namesrv/logs ./rocketmq/namesrv/store
mkdir -p ./rocketmq/broker/logs ./rocketmq/broker/store
mkdir -p ./rocketmq/dashboard/config
mkdir -p ./seata
mkdir -p ./nginx/logs
```

RocketMQ 目录如果遇到权限问题，可执行：

```bash
chmod -R 777 ./rocketmq
```

MinIO 数据目录如遇到写入问题，可执行：

```bash
chmod -R 666 ./minio/data
```

## 5. 启动命令

```bash
docker compose up -d --force-recreate
```

首次拉取镜像可能较慢，请耐心等待。

## 6. 当前中间件端口与默认凭据

### MySQL

- 端口：`3306`
- 用户名：`root`
- 密码：`Gesoft9919.`

### Redis

- 端口：`6379`
- 密码：`Gesoft9919.`

### MinIO

- API：`http://<服务器IP>:9000`
- Console：`http://<服务器IP>:9001`
- 用户名：`admin`
- 密码：`Gesoft9919.`

说明：

- `9000` 用于文件上传、下载和程序访问
- `9001` 是管理后台

### Nacos

- 地址：`http://<服务器IP>:8848/nacos`
- 默认用户名：`nacos`
- 默认密码：`nacos`

说明：

- 当前已启用鉴权
- 部署完成后建议尽快修改密码

### RocketMQ

- NameServer：`9876`
- Broker：`10911`
- Dashboard：`http://<服务器IP>:8180`

说明：

- 当前 Dashboard 已改成通过外部 `application.yml` 读取 namesrv 地址
- Broker 已配置对外地址，兼容宿主机 JAR 服务访问

### Seata

- TC 端口：`8091`
- 控制端口：`7091`

说明：

- 当前已固定：
  - `JVM_XMS=512m`
  - `JVM_XMX=512m`
  - `JVM_MaxDirectMemorySize=256m`

### Canal

- 端口：`11111`
- 管理/扩展端口：`11112`

### Nginx

- `80`：默认静态入口
- `443`：预留 HTTPS
- `8021`：`mall4cloud-multishop-ui` 管理端静态资源

## 7. Nginx 配置说明

当前 Nginx 配置拆分为两层：

- `nginx/conf/nginx.conf`
  - 只保留全局配置
  - 通过 `include /etc/nginx/conf.d/*.conf;` 加载站点
- `nginx/conf_d/default.conf`
  - 默认 `80` 站点
- `nginx/conf_d/mall4cloud-multishop-ui.conf`
  - `8021` 站点
  - 根目录：`/usr/share/nginx/mall4cloud-multishop-ui`
  - 采用 `try_files ... /index.html`，适配 SPA 前端路由

## 8. MinIO 初始化

登录 MinIO 后，请手动创建 Bucket：

- `mall4cloud`

如果前端需要直接访问图片或对象，请按业务要求配置对应的访问策略。

## 9. MySQL 初始化说明

当前初始化 SQL 位于：

- `mysql/initdb/mall4cloud_nacos.sql`
- `mysql/initdb/mall4cloud_canal.sql`
- `mysql/initdb/mall4cloud_seata.sql`

说明：

- 如果使用本部署包自带的 MySQL 容器，这些 SQL 会随初始化目录挂载
- 如果你使用的是外部 MySQL，需要手动执行这些 SQL

## 10. Seata 说明

当前 Seata 已修正两个问题：

1. 固定 JVM 内存，避免容器自动按宿主机总内存计算
2. `distributed_lock.lock_value` 已按 Seata 2.6 调整为兼容结构

如果你重新初始化 Seata 数据库，请确保使用当前目录下已经修正过的 `mall4cloud_seata.sql`。

## 11. 当前不包含的组件

这套部署包当前 **不包含 Elasticsearch 容器**。

因此：

- 旧文档中关于 ES 容器启动的说明不再适用
- 如果你还需要搜索索引能力，需要单独部署 ES，并按业务配置接入

## 12. 常用检查命令

查看容器状态：

```bash
docker ps
```

查看 Nacos 日志：

```bash
docker logs --tail 100 mall4cloud-nacos
```

查看 RocketMQ Dashboard 日志：

```bash
docker logs --tail 100 mall4cloud-rocketmq-dashboard
```

查看 Seata 日志：

```bash
docker logs --tail 100 mall4cloud-seata
```

查看 Nginx 日志：

```bash
docker logs --tail 100 mall4cloud-nginx
```

## 13. 当前已验证通过的关键点

这套配置已经针对以下问题做过修正：

- Nacos 容器重启问题
- RocketMQ Broker 和 Dashboard 互通问题
- RocketMQ 对宿主机 JAR 服务的兼容问题
- Seata 表结构不兼容问题
- Seata JVM 内存占用过大问题
- Nginx `8021` 静态站点配置

如果后续继续调整，请优先以当前目录中的配置文件为准，不要再参考旧版截图或旧版 README。
