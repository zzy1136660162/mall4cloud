// 模拟数据
export const userInfo = {
  name: 'Dr. 林致远',
  title: '首席科学家 / 高级工程师',
  org: '国家前沿材料技术联合实验室',
  avatar: '',
  certNo: 'SAC-2018-0042',
  // 核心概览 4 项
  projectCount: 12,        // 在研项目
  researchFund: 3.5,       // 产研经费（万）
  patentCount: 45,         // 服务专利（件）
  paperCount: 80           // 发表论文（篇）
}

export const abilityList = [
  { label: '技术研发深度', score: 95, color: '#4648d4' },
  { label: '产业协同度', score: 88, color: '#0058be' },
  { label: '成果转化潜力', score: 92, color: '#006c49' }
]

export const projects = [
  {
    id: 1,
    title: '新型固态电池电解质中试及量产研究',
    period: '2023.09 - 2023.12',
    desc: '本项目基于"固态电解质批量化制备及界面调控"课题，主要内容包括高离子电导率电解质的配方工艺开发、批量生产关键工艺的工程化实施以及产线级的质量控制标准化建设。',
    tags: ['已对接需求', '资金匹配', '已完成小试', '已实现量产'],
    tagColors: ['#d8e2ff', '#d6f5e7', '#d8e2ff', '#d6f5e7'],
    tagTextColors: ['#004395', '#00714d', '#004395', '#00714d']
  },
  {
    id: 2,
    title: '高柔柔性光伏组件封装材料开发',
    period: '2018.03 - 2020.10',
    desc: '新材料设计及合成方案的实施，新结构的优化表征，胶膜卷材应用效果的初步探索及结构化复现，最终形成全流程应用方案。',
    tags: ['解决方案', '系统优化'],
    tagColors: ['#d8e2ff', '#d6f5e7'],
    tagTextColors: ['#004395', '#00714d']
  }
]

export const achievements = [
  {
    id: 1,
    title: '国家科技进步二等奖',
    desc: '在半导体材料方向的突破性研究与应用，及其对产业的推动作用。',
    date: '2022.06'
  },
  {
    id: 2,
    title: 'PCT 国际专利授权',
    desc: '一种新型高分子聚合物/碳纳米管复合材料的精密合成方法（申请号 PCT/CN2020/XXXXXX）',
    date: '2021.03'
  }
]

// 转化流程 8 步
export const flowStages = [
  { id: 1, name: '资源入库' },
  { id: 2, name: '需求征集' },
  { id: 3, name: '项目立项', active: true },
  { id: 4, name: '概念验证' },
  { id: 5, name: 'CDMO 转化' },
  { id: 6, name: 'IP 运营' },
  { id: 7, name: '应用评议' },
  { id: 8, name: '成果传播' }
]

// 协同能力
export const capabilities = [
  {
    id: 1,
    title: '高校专家与成果协同',
    desc: '连接顶尖高校科研团队，整合优质前沿成果，打破信息壁垒，实现产学研高效对接与资源共享。',
    highlight: '深入成果库',
    highlightColor: 'primary'
  },
  {
    id: 2,
    title: '概念验证与 CDMO 协同',
    desc: '提供从实验室到中试生产的全流程支持，降低转化风险。'
  },
  {
    id: 3,
    title: '知识产权运营',
    desc: '专业化的专利导航、价值评估及技术交易服务，保障核心资产。'
  },
  {
    id: 4,
    title: '专业应用评议与科学传播',
    desc: '基于行业专家的深度评议，结合多元渠道进行精准的科学普及与市场化传播，提升成果影响力。',
    highlight: '了解更多',
    highlightColor: 'primary'
  }
]

export const abilityCards = [
  {
    id: 1,
    title: '概念验证能力',
    desc: '配备先进的软硬件设施，针对早期科研成果进行技术可行性与商业潜力的初步验证，提供详实的数据报告。',
    points: ['原型开发支持', '技术和标准测试']
  },
  {
    id: 2,
    title: 'CDMO 转化能力',
    desc: '提供从工艺研发、工艺放大到商业化生产的一站式服务，遵循严格的实验室管理体系，加速产品上市进程。',
    points: ['GMP 标准产线', '规模化生产能力', '全流程质量管控']
  }
]

// 领域筛选
export const domains = ['全部领域', '人工智能', '生物医药', '新能源材料', '智能制造', '航空航天']

// 专家列表
export const experts = [
  {
    id: 1,
    name: '王建家',
    title: '首席科学家 / 教授',
    org: '清华大学人工智能研究院',
    avatar: '',
    tags: ['计算机视觉', '深度学习', '工业缺陷检测'],
    desc: '长期从事计算机视觉与机器学习的基础理论及应用研究，在顶会发表论文50余篇。主导开发的高精度工业表面缺陷视觉检测系统已在多家头部制造企业成...',
    achievements: 12
  },
  {
    id: 2,
    name: '李雪芳',
    title: '研究员 / 博导',
    org: '中科院材料科学国家实验室',
    avatar: '',
    tags: ['固态电池', '纳米材料', '新能源'],
    desc: '专注新型固态电池电解质材料研发。突破了高电导率与界面稳定性的关键技术瓶颈。相关专利技术正与国内新能源车企联合进行中试，预期可将电池安全性...',
    achievements: 8
  },
  {
    id: 3,
    name: '张明远',
    title: '总工程师 / 高工',
    org: '国家智能制造装备技术工程中心',
    avatar: '',
    tags: ['精密加工', '机器人控制', '自动化产线'],
    desc: '拥有30年高端数控机床及工业机器人研发经验。主持设计的多自由度柔性装配机器人已广泛应用于3C电子和汽车零部件制造领域，有效解决了复杂曲面...',
    achievements: 25
  },
  {
    id: 4,
    name: '陈思雨',
    title: '副研究员',
    org: '中国科学院微电子研究所',
    avatar: '',
    tags: ['半导体', '芯片设计', '集成电路'],
    desc: '长期从事先进制程芯片设计与封装技术研究。主导完成多项国家重大专项课题，相关成果获得国家科技进步奖。',
    achievements: 15
  },
  {
    id: 5,
    name: '刘建国',
    title: '教授 / 博导',
    org: '上海交通大学材料学院',
    avatar: '',
    tags: ['新型合金', '增材制造', '金属材料'],
    desc: '专注高性能钛合金与高温合金研发，主持多项国家级科研项目，发表SCI论文100余篇，相关技术已应用于航空航天领域。',
    achievements: 20
  }
]
