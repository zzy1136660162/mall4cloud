# Mall4Cloud 微服务部署脚本

## 目录结构

```
mall4cloud/
├── scripts/                    # 脚本目录
│   ├── start.sh               # 启动脚本
│   ├── stop.sh                # 停止脚本
│   ├── restart.sh             # 重启脚本
│   ├── status.sh              # 状态检查脚本
│   ├── services.conf          # 服务配置文件
│   ├── README.md              # 本文档
│   ├── apps/                  # JAR包子目录（可选）
│   ├── logs/                  # 日志目录
│   └── pids/                  # PID文件目录
├── mall4cloud-gateway.jar      # JAR包也可以放在这里
├── mall4cloud-auth.jar
└── ...                        # 其他 JAR 文件
```

**注意**：JAR 文件可以放在多个位置，脚本会按优先级自动查找：
1. `scripts/` 目录（与脚本同目录）
2. `scripts/apps/` 子目录
3. `scripts` 的父目录
4. 父目录 `/apps/` 子目录

**推荐**：将 JAR 包放在 `scripts/` 目录或父目录（项目根目录）

## 快速开始

### 1. 编译项目

首先编译项目生成JAR文件：

```bash
# 在项目根目录执行
mvn clean package -DskipTests
```

### 2. 复制JAR文件

将编译好的JAR文件复制到 `scripts/` 目录或父目录（项目根目录）：

**方式一：放在 scripts/ 目录下**
```bash
# 示例：复制所有微服务的JAR文件到 scripts/ 目录
cp mall4cloud-*/target/*.jar scripts/
```

**方式二：放在 scripts 的父目录下（项目根目录）**
```bash
# 示例：将 JAR 文件复制到 scripts 的父目录
cp mall4cloud-*/target/*.jar ..
```

**方式三：放在 scripts/apps/ 子目录下**
```bash
# 示例：复制所有微服务的JAR文件到 scripts/apps/ 目录
cp mall4cloud-*/target/*.jar scripts/apps/
```

需要复制的JAR文件列表：

- mall4cloud-gateway.jar
- mall4cloud-auth.jar
- mall4cloud-user.jar
- mall4cloud-rbac.jar
- mall4cloud-product.jar
- mall4cloud-order.jar
- mall4cloud-payment.jar
- mall4cloud-search.jar
- mall4cloud-biz.jar
- mall4cloud-multishop.jar
- mall4cloud-platform.jar
- mall4cloud-leaf.jar

### 3. 启动服务

```bash
cd scripts

# 启动所有服务
./start.sh

# 或指定单个服务启动
./start.sh AUTH
./start.sh GATEWAY
```

### 4. 检查状态

```bash
# 查看所有服务状态
./status.sh

# 查看单个服务状态
./status.sh AUTH
```

### 5. 重启服务

```bash
# 串行重启所有服务（默认）
./restart.sh

# 并行重启所有服务（更快！）
./restart.sh --parallel

# 重启单个服务
./restart.sh BIZ

# 重启多个服务
./restart.sh AUTH GATEWAY
```

### 6. 停止服务

```bash
# 停止所有服务
./stop.sh

# 停止单个服务
./stop.sh AUTH
```

## 微服务列表

| 服务名 | 模块名 | 端口 | 说明 |
|--------|--------|------|------|
| GATEWAY | mall4cloud-gateway | 8000 | API网关 |
| AUTH | mall4cloud-auth | 9101 | 认证服务 |
| USER | mall4cloud-user | 9105 | 用户服务 |
| RBAC | mall4cloud-rbac | 9102 | 权限服务 |
| PRODUCT | mall4cloud-product | 9104 | 商品服务 |
| ORDER | mall4cloud-order | 9106 | 订单服务 |
| PAYMENT | mall4cloud-payment | 9113 | 支付服务 |
| SEARCH | mall4cloud-search | 9108 | 搜索服务 |
| BIZ | mall4cloud-biz | 9109 | 业务服务 |
| MULTISHOP | mall4cloud-multishop | 9103 | 多店铺服务 |
| PLATFORM | mall4cloud-platform | 9112 | 平台服务 |
| LEAF | mall4cloud-leaf | 9100 | ID生成服务 |

## 脚本功能说明

### start.sh - 启动脚本

- 启动所有微服务（默认）
- 支持启动单个指定服务
- 后台运行模式
- 每个服务独立的日志文件
- PID文件管理
- 启动顺序控制（gateway最后启动）
- 启动前检查端口是否被占用

### stop.sh - 停止脚本

- 优雅停止所有服务（默认）
- 支持停止单个指定服务
- 使用kill -15优雅停止
- 等待超时后使用kill -9强制停止
- 按启动顺序的反序停止服务

### restart.sh - 重启脚本

- 重启所有服务（默认）
- 支持重启单个服务

### status.sh - 状态检查脚本

- 检查所有服务状态（默认）
- 检查单个服务状态
- 显示：服务名、PID、端口、运行状态、启动时间、内存使用

### services.conf - 服务配置文件

可以在这里修改：
- JVM内存参数
- 启动超时时间
- 日志配置
- 服务列表和端口

## 查看日志

```bash
# 实时查看所有日志
tail -f logs/*.log

# 查看单个服务日志
tail -f logs/AUTH.log

# 查看启动日志
cat logs/AUTH.log
```

## 常见问题

### 1. JAR 文件找不到

如果遇到 "JAR文件不存在" 错误，请确保 JAR 文件已复制到正确位置：

```bash
# 检查 scripts/ 目录
ls scripts/*.jar

# 或检查 scripts/apps/ 目录
ls scripts/apps/*.jar
```

如果没有 JAR 文件，请先编译项目并复制：

```bash
# 编译项目
mvn clean package -DskipTests

# 复制到 scripts/ 目录（推荐）
cp mall4cloud-*/target/*.jar scripts/

# 或复制到 scripts 的父目录
cp mall4cloud-*/target/*.jar ..
```

**当前JAR查找顺序：**
1. scripts/ 目录
2. scripts/apps/ 目录
3. scripts 的父目录
4. 父目录/apps/ 目录

### 2. 端口被占用

如果遇到端口被占用的错误，请检查是否有其他进程占用了端口：

```bash
# Linux/Mac
lsof -i :端口号

# Windows
netstat -ano | findstr :端口号
```

### 3. 服务启动失败

检查日志文件：

```bash
cat logs/服务名.log
```

### 4. 权限问题

如果遇到权限问题，给脚本添加执行权限：

```bash
# Linux/Mac
chmod +x *.sh

# Windows (已自动配置)
```

### 5. 修改JVM参数

编辑 `services.conf` 文件，修改对应服务的JVM参数：

```bash
["AUTH"]="mall4cloud-auth:9101:-Xms512m -Xmx1024m -Xmn256m"
```

## 环境要求

- Linux/Unix系统（或Windows WSL）
- Bash 4.0+
- JDK 8 或更高版本
- Maven 3.0+（用于编译）

## 注意事项

1. 确保MySQL、Nacos、RocketMQ等中间件已启动
2. 先启动依赖服务（LEAF、USER、RBAC）
3. 最后启动GATEWAY
4. 生产环境请根据服务器配置调整JVM参数
5. 建议在生产环境设置合适的日志轮转策略
6. 推荐使用 `./restart.sh --parallel` 并行重启，速度更快

## 并行执行说明

`restart.sh` 脚本支持并行执行：

- **串行重启**（默认）：`./restart.sh` - 一个接一个地启动/停止
- **并行重启**：`./restart.sh --parallel` - 同时启动多个服务

### 并行启动批次

为了保证服务依赖关系，并行启动会分批次进行：

| 批次 | 服务 | 说明 |
|------|------|------|
| 批次 1 | LEAF, USER, RBAC | 基础服务（无依赖）|
| 批次 2 | AUTH, PRODUCT | 核心服务 |
| 批次 3 | ORDER, PAYMENT, SEARCH | 业务服务 |
| 批次 4 | BIZ, MULTISHOP, PLATFORM | 聚合服务 |
| 批次 5 | GATEWAY | 网关服务（最后）|

**优势**：并行重启比串行重启快 3-5 倍！


## 联系方式

如有问题，请检查：
1. 各微服务的配置文件（bootstrap.yml）
2. Nacos配置中心配置
3. 中间件连接配置
4. 网络和防火墙配置
