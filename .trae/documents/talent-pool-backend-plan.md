# 人才库后端开发计划

## 一、需求概述

为人才库功能开发后端接口，支持前端人才列表展示和详情查看。

### 数据库表结构

**表名：** `talent_pool`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | bigint | 主键ID |
| `name` | varchar(50) | 姓名 |
| `avatar` | varchar(500) | 头像URL |
| `title` | varchar(100) | 职称/职位 |
| `region` | varchar(100) | 所在地区 |
| `expertise_areas` | text | 专长领域（JSON数组） |
| `skills` | text | 专业技能（JSON数组） |
| `experience_years` | int | 从业年限 |
| `education` | varchar(50) | 学历 |
| `intro` | text | 个人简介 |
| `project_experience` | text | 项目经验（JSON数组） |
| `achievements` | text | 成果荣誉（JSON数组） |
| `status` | tinyint | 状态：0-隐藏 1-显示 |
| `sort_order` | int | 排序权重 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

### 前端 API 需求

| 接口 | 方法 | 说明 |
|------|------|------|
| `/mall4cloud_platform/talent_pool/list` | GET | 获取人才列表 |
| `/mall4cloud_platform/talent_pool/detail/{id}` | GET | 获取人才详情 |

---

## 二、开发步骤

### 2.1 创建 VO 对象

**文件：** `src/main/java/com/mall4j/cloud/platform/vo/TalentPoolVO.java`

创建人才库视图对象，包含所有字段的 getter/setter。

### 2.2 创建 Mapper 接口

**文件：** `src/main/java/com/mall4j/cloud/platform/mapper/TalentPoolMapper.java`

```java
public interface TalentPoolMapper {
    // 获取人才列表（只查询显示状态的，按排序权重倒序）
    List<TalentPoolVO> list();

    // 分页查询
    List<TalentPoolVO> page();

    // 获取总数
    Integer count();

    // 根据ID获取详情
    TalentPoolVO getById(Long id);
}
```

### 2.3 创建 Mapper XML

**文件：** `src/main/resources/mapper/TalentPoolMapper.xml`

实现各 SQL 语句，注意字段下划线到驼峰的映射。

### 2.4 创建 Controller

**文件：** `src/main/java/com/mall4j/cloud/platform/controller/TalentPoolController.java`

```java
@RestController
@RequestMapping("/talent_pool")
@Tag(name = "人才库管理")
public class TalentPoolController {

    @GetMapping("/list")
    public ServerResponseEntity<PageVO<TalentPoolVO>> list();

    @GetMapping("/detail/{id}")
    public ServerResponseEntity<TalentPoolVO> detail(@PathVariable Long id);
}
```

### 2.5 创建 Service 接口

**文件：** `src/main/java/com/mall4j/cloud/platform/service/TalentPoolService.java`

```java
public interface TalentPoolService {
    // 获取人才列表
    PageVO<TalentPoolVO> list(TalentPoolPageDTO params);

    // 获取人才详情
    TalentPoolVO getById(Long id);
}
```

### 2.6 创建 Service 实现

**文件：** `src/main/java/com/mall4j/cloud/platform/service/impl/TalentPoolServiceImpl.java`

实现业务逻辑，包括分页处理。

### 2.7 创建 DTO（可选）

**文件：** `src/main/java/com/mall4j/cloud/platform/dto/TalentPoolPageDTO.java`

如需支持高级查询条件，可创建分页 DTO。

---

## 三、文件清单

### 新增文件

| 文件路径 | 说明 |
|---------|------|
| `src/main/java/com/mall4j/cloud/platform/vo/TalentPoolVO.java` | 人才库视图对象 |
| `src/main/java/com/mall4j/cloud/platform/mapper/TalentPoolMapper.java` | Mapper 接口 |
| `src/main/resources/mapper/TalentPoolMapper.xml` | MyBatis XML 映射 |
| `src/main/java/com/mall4j/cloud/platform/controller/TalentPoolController.java` | 控制器 |
| `src/main/java/com/mall4j/cloud/platform/service/TalentPoolService.java` | 服务接口 |
| `src/main/java/com/mall4j/cloud/platform/service/impl/TalentPoolServiceImpl.java` | 服务实现 |

### 修改文件

| 文件路径 | 修改内容 |
|---------|---------|
| `pom.xml` | 如需添加依赖（一般不需要） |

---

## 四、注意事项

1. **字段映射**：数据库使用下划线命名（snake_case），Java 对象使用驼峰命名（camelCase），需要在 XML 中配置。
2. **JSON 字段**：数据库存储 JSON 字符串，前端直接返回。
3. **状态过滤**：列表接口只查询 `status = 1`（显示状态）的人才。
4. **排序**：按 `sort_order` 降序排列，同排序按 `created_at` 降序。
5. **分页**：使用项目已有的分页机制 `PageVO`。

---

## 五、验收标准

1. ✅ `GET /talent_pool/list` 返回人才列表，支持分页
2. ✅ `GET /talent_pool/detail/{id}` 返回人才详情
3. ✅ 只返回 `status = 1` 的人才
4. ✅ 按 `sort_order` 降序排列
5. ✅ JSON 字段正确返回
