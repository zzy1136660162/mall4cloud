# SelectionStatisticsVO 重构计划

## 问题描述
`SelectionStatisticsVO` 被错误地定义在 `SelectionApplyServiceImpl` 的内部类中，导致编译错误：
```
找不到符号 SelectionStatisticsVO
位置: 接口 SelectionApplyService
```

## 开发规范（阿里Java开发手册）
按照项目规范：
- **VO（View Object）**：显示层对象，通常是 Web 向模板渲染引擎层传输的对象
- VO 文件应放在 `vo/admin/` 或 `vo/app/` 包下
- 不应在 ServiceImpl 内部定义 VO 类

## 修复方案

### 1. 创建 SelectionStatisticsVO.java
**位置**: `e:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\mall4cloud-platform\src\main\java\com\mall4j\cloud\platform\vo\admin\SelectionStatisticsVO.java`

### 2. 修改 SelectionApplyService.java
添加 import 语句：
```java
import com.mall4j.cloud.platform.vo.admin.SelectionStatisticsVO;
```

### 3. 简化 SelectionApplyServiceImpl.java
删除内部类 `SelectionStatisticsVO`，保留返回类型引用

## 预期交付物
1. 新建 `SelectionStatisticsVO.java` 文件
2. 更新 `SelectionApplyService.java` 添加 import
3. 清理 `SelectionApplyServiceImpl.java` 内部类
