// 门户首页静态展示配置（第一期不从后台配置）

// 转化流程 8 步
export const flowStages = [
  { id: 1, name: '资源入库' },
  { id: 2, name: '需求征集' },
  { id: 3, name: '项目立项', active: true },
  { id: 4, name: '概念验证' },
  { id: 5, name: 'CDMO 转化' },
  { id: 6, name: 'IP 运营' },
  { id: 7, name: '科学传播' },
  { id: 8, name: '市场转化' }
]

// 协同能力模块
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

// 研发能力卡片配置
export const abilityCards = [
  {
    id: 1,
    title: '概念验证能力',
    desc: '配备先进的软硬件设施，针对早期科研成果进行技术可行性与商业潜力的初步验证，提供详实的数据报告。',
    points: ['小试验证', '功效评价', '配方可行性评估']
  },
  {
    id: 2,
    title: 'CDMO 转化能力',
    desc: '提供从工艺研发、工艺放大到商业化生产的一站式服务，遵循严格的实验室管理体系，加速产品上市进程。',
    points: ['中试放大', '生产评测', '量产落地']
  }
]

// 超能力列表
export const abilityList = [
  { label: '技术研发深度', score: 95, color: '#4648d4' },
  { label: '产业协同度', score: 88, color: '#0058be' },
  { label: '成果转化潜力', score: 92, color: '#006c49' }
]

// 领域筛选
export const domains = ['全部领域', '化妆品研发', '功能性食品', '天然原料', '生物医药', '功效评测', '包装研发', '品质控制']
