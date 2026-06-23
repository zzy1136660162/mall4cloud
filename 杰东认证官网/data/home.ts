export interface NavItem {
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroCard {
  icon: string;
  title: string;
  summary: string;
}

export interface ServiceItem {
  icon: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  details?: string[];
}

export interface AdvantageItem {
  icon: string;
  title: string;
  summary: string;
}

export interface ProcessStep {
  step: string;
  icon: string;
  title: string;
  summary: string;
}

export interface NewsItem {
  category: string;
  title: string;
  date: string;
  summary: string;
}

export interface CaseItem {
  type: string;
  title: string;
  status: string;
  summary: string;
}

export interface PageMetric {
  value: string;
  label: string;
}

export interface PageHero {
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  metrics?: PageMetric[];
}

export interface DetailBlock {
  icon: string;
  title: string;
  summary: string;
  items?: string[];
}

export const siteNav: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '关于杰东', href: '/about' },
  { label: '服务领域', href: '/services' },
  { label: '申办流程', href: '/process' },
  { label: '政策资讯', href: '/news' },
  { label: '成果示例', href: '/cases' },
  { label: '联系我们', href: '/contact' }
];

export const homeData = {
  hero: {
    eyebrow: 'Healthcare Compliance Service',
    title: '医药健康产品批文批号申办服务伙伴',
    description:
      '聚焦保健食品、化妆品、消毒产品、医疗器械等注册备案与合规咨询，提供资料审核、申报路径设计和全过程节点跟进服务。',
    image: '/images/hero-compliance.png',
    primaryAction: { label: '咨询服务', href: '/contact' } satisfies HeroAction,
    secondaryAction: { label: '查看申办流程', href: '/process' } satisfies HeroAction,
    cards: [
      { icon: 'verified', title: '注册备案', summary: '保健食品、化妆品、消毒产品等资料路径咨询' },
      { icon: 'fact_check', title: '资料审核', summary: '围绕清单、标签、检测报告与申请资料逐项核对' },
      { icon: 'monitoring', title: '节点跟进', summary: '申报递交、补正反馈、过程沟通节点化管理' },
      { icon: 'policy', title: '法规跟踪', summary: '持续关注医药健康行业监管政策变化' }
    ] satisfies HeroCard[],
    stats: [
      { value: '20+', label: '细分申报方向' },
      { value: '5步', label: '标准化服务流程' },
      { value: '7类', label: '政策资讯专题' }
    ] satisfies HeroStat[]
  },
  services: [
    {
      icon: 'medication',
      slug: 'health-food',
      title: '保健食品注册与备案',
      summary: '围绕国食健字、保健食品资料整理、配方与标签合规进行申报路径设计。',
      tags: ['国食健字', '资料清单', '标签合规'],
      details: ['产品属性初判与申报路径建议', '配方依据、功效声称、标签样稿核对', '注册备案材料目录与归档支持']
    },
    {
      icon: 'spa',
      slug: 'cosmetics',
      title: '化妆品备案与申报',
      summary: '支持国产非特殊化妆品备案、特殊化妆品申报资料梳理与法规要点核对。',
      tags: ['化妆品备案', '功效宣称', '配方审核'],
      details: ['备案主体与产品基础信息梳理', '功效宣称依据资料核对', '安全评估、标签和配方材料协同整理']
    },
    {
      icon: 'science',
      slug: 'disinfection',
      title: '消毒产品卫生安全评价',
      summary: '协助消毒产品评价报告、卫消字相关资料准备及生产许可要求梳理。',
      tags: ['卫消字', '评价报告', '许可资料'],
      details: ['产品类别与评价要求初步判断', '检测报告、标签说明书和评价资料整理', '生产条件、委托关系与归档资料核对']
    },
    {
      icon: 'medical_services',
      slug: 'medical-device',
      title: '医疗器械注册备案',
      summary: '面向一类医疗器械备案、产品分类判断和注册资料路径提供咨询支持。',
      tags: ['器械分类', '备案路径', '资料辅导'],
      details: ['产品分类与管理类别建议', '技术要求、说明书、标签资料核对', '备案路径、递交流程和补正沟通支持']
    },
    {
      icon: 'local_pharmacy',
      slug: 'medicine',
      title: '药品相关批号咨询',
      summary: '围绕国药准字、药品广告审查、说明书标签等方向提供政策解读。',
      tags: ['国药准字', '药品知识', '政策解读'],
      details: ['药品相关资质与申报条件梳理', '广告审查、说明书标签要点提示', '政策资料和申报节点咨询']
    },
    {
      icon: 'assignment_turned_in',
      slug: 'food-permit',
      title: '食字号与特殊批文咨询',
      summary: '覆盖食品生产许可、QS、药食同源、新食品原料等健康产品准入问题。',
      tags: ['食字号', 'QS', '新食品原料'],
      details: ['食品类准入路径和许可资料梳理', '药食同源、新资源食品政策要点提示', '生产许可与标签合规材料核对']
    }
  ] satisfies ServiceItem[],
  advantages: [
    {
      icon: 'route',
      title: '申报路径设计',
      summary: '根据产品属性、法规要求和企业现状，梳理更清晰的申报路线。'
    },
    {
      icon: 'checklist',
      title: '资料审核与清单管理',
      summary: '围绕申请表、检测报告、标签样稿、配方材料等关键资料进行结构化核对。'
    },
    {
      icon: 'travel_explore',
      title: '政策法规跟踪',
      summary: '持续关注医药健康、食品、化妆品、消毒产品与医疗器械监管动态。'
    },
    {
      icon: 'timeline',
      title: '全流程节点跟进',
      summary: '从需求评估到结果交付，帮助企业把握申报周期中的关键节点。'
    }
  ] satisfies AdvantageItem[],
  processSteps: [
    { step: '01', icon: 'manage_search', title: '需求评估', summary: '了解产品类型、企业资质、目标批文和已有资料。' },
    { step: '02', icon: 'folder_copy', title: '资料准备', summary: '输出资料清单，协助整理申报所需文件与证明材料。' },
    { step: '03', icon: 'upload_file', title: '申报递交', summary: '根据申报路径完成资料核对、格式整理与递交流程衔接。' },
    { step: '04', icon: 'sync_alt', title: '过程跟进', summary: '跟踪审查反馈、补正要求和过程节点，降低沟通成本。' },
    { step: '05', icon: 'workspace_premium', title: '结果交付', summary: '交付结果文件、归档资料，并提供后续维护建议。' }
  ] satisfies ProcessStep[],
  news: [
    {
      category: '政策法规',
      title: '中医药标准化研究转化与管理要求持续完善',
      date: '2026-06-18',
      summary: '关注行业标准更新对健康产品申报资料和合规表述的影响。'
    },
    {
      category: '医疗器械',
      title: '第一类医疗器械备案资料准备要点',
      date: '2026-06-12',
      summary: '从产品分类、说明书、技术要求等角度梳理备案前置准备。'
    },
    {
      category: '化妆品',
      title: '国产非特殊化妆品备案流程关注事项',
      date: '2026-06-06',
      summary: '整理配方、功效宣称、标签与安全评估资料的常见问题。'
    },
    {
      category: '消毒产品',
      title: '消毒产品卫生安全评价报告资料清单',
      date: '2026-05-28',
      summary: '围绕检测、标签、生产条件和评价报告进行申报资料说明。'
    }
  ] satisfies NewsItem[],
  cases: [
    {
      type: '保健食品',
      title: '保健食品注册资料整理项目',
      status: '资料归档',
      summary: '协助企业梳理配方依据、标签样稿和申报资料目录。'
    },
    {
      type: '化妆品',
      title: '国产非特殊化妆品备案咨询',
      status: '流程完成',
      summary: '围绕产品备案路径、功效宣称和基础资料进行合规咨询。'
    },
    {
      type: '消毒产品',
      title: '卫生安全评价资料辅导',
      status: '节点跟进',
      summary: '支持检测资料、标签内容和评价报告文件的准备工作。'
    },
    {
      type: '医疗器械',
      title: '一类医疗器械备案路径咨询',
      status: '方案交付',
      summary: '协助判断产品分类并形成备案资料准备建议。'
    }
  ] satisfies CaseItem[],
  footer: {
    company: '北京杰东认证服务有限公司',
    description: '专注医药健康产品批文批号、注册备案与合规咨询服务。',
    phone: '010-0000-0000',
    email: 'service@bjjdjy.com.cn',
    address: '北京市朝阳区医药健康产业服务示范地址',
    icp: '京ICP备12045069号-1'
  }
};

export const pageData = {
  about: {
    hero: {
      eyebrow: 'About Jiedong',
      icon: 'corporate_fare',
      title: '把复杂申报工作拆解成清晰路径',
      description:
        '杰东认证以医药健康产品准入服务为核心，围绕企业从产品立项、资料整理到申报递交的关键节点，提供可执行、可追踪、可归档的合规咨询支持。',
      metrics: [
        { value: '多品类', label: '覆盖健康产品准入方向' },
        { value: '清单化', label: '资料节点可追踪' },
        { value: '全过程', label: '从评估到交付协同' }
      ]
    } satisfies PageHero,
    profile: [
      '我们关注企业在批文批号申办中的真实阻力：资料边界不清、法规口径变化、递交节点分散和沟通成本高。',
      '通过标准化清单、阶段性复核和政策要点拆解，帮助企业在申报前建立更稳定的资料基础。',
      '我们强调过程留痕和结果归档，让企业在后续补充申报、产品维护和内部管理中有据可查。'
    ],
    capabilities: [
      { icon: 'description', title: '资料体系搭建', summary: '将分散材料转化为可核对、可补正、可归档的申报资料结构。' },
      { icon: 'shield', title: '合规口径控制', summary: '围绕标签、功效、说明书和申请表述进行风险提示。' },
      { icon: 'support_agent', title: '节点沟通协同', summary: '将企业、检测机构、申报材料和递交流程串联管理。' },
      { icon: 'query_stats', title: '政策信息跟踪', summary: '持续整理监管变化对健康产品准入路径的影响。' }
    ] satisfies DetailBlock[],
    milestones: [
      { year: '01', title: '需求确认', summary: '确定产品类别、申报目标和资料现状。' },
      { year: '02', title: '路径研判', summary: '结合监管要求形成资料准备和递交策略。' },
      { year: '03', title: '资料复核', summary: '逐项核对关键材料、标签、报告与申请内容。' },
      { year: '04', title: '交付归档', summary: '形成结果文件、归档资料与后续维护建议。' }
    ]
  },
  services: {
    hero: {
      eyebrow: 'Service System',
      icon: 'lan',
      title: '围绕产品准入建立分层服务体系',
      description:
        '不同产品类别对应不同监管路径。杰东认证以品类判断、资料清单、法规口径和递交节点为主线，为企业建立可推进的申报计划。',
      metrics: [
        { value: '6大类', label: '核心业务方向' },
        { value: '20+', label: '细分服务事项' },
        { value: '1套', label: '统一资料管理逻辑' }
      ]
    } satisfies PageHero,
    matrix: [
      { icon: 'task_alt', title: '申报前评估', summary: '先判断产品属性、申报类别和资料缺口。' },
      { icon: 'inventory_2', title: '资料包整理', summary: '按目录、版本、补正记录组织申报材料。' },
      { icon: 'edit_document', title: '文本合规核对', summary: '关注标签、说明书、功效和申请表述一致性。' },
      { icon: 'verified_user', title: '递交后跟进', summary: '跟踪审查反馈、补正要求和归档交付。' }
    ] satisfies DetailBlock[]
  },
  process: {
    hero: {
      eyebrow: 'Application Workflow',
      icon: 'timeline',
      title: '让申报过程从经验沟通转向节点管理',
      description:
        '以五个阶段贯穿产品准入咨询工作，明确每一步的输入、输出、责任边界和沟通节点，帮助企业降低重复准备和补正风险。',
      metrics: [
        { value: '5步', label: '标准流程' },
        { value: '3类', label: '关键资料核对' },
        { value: '可归档', label: '过程文档留痕' }
      ]
    } satisfies PageHero,
    documents: [
      { icon: 'article', title: '主体资质资料', summary: '营业执照、生产或委托关系、授权文件等基础信息。' },
      { icon: 'biotech', title: '产品技术资料', summary: '配方、工艺、检测报告、技术要求和产品说明。' },
      { icon: 'event_note', title: '申报表述资料', summary: '申请表、标签样稿、说明书、功效或适用范围表述。' }
    ] satisfies DetailBlock[],
    principles: [
      '先研判路径，再整理资料，避免在方向未清晰时投入大量重复工作。',
      '关键文件保留版本记录，便于补正沟通和后续归档。',
      '每个阶段形成明确输出，让企业随时知道当前节点与下一步动作。'
    ]
  },
  news: {
    hero: {
      eyebrow: 'Policy Insights',
      icon: 'article',
      title: '持续关注监管动态与申报知识',
      description:
        '围绕政策法规、行业动态和申报实务整理资讯内容，帮助企业理解健康产品准入过程中的常见要求与变化趋势。',
      metrics: [
        { value: '法规', label: '政策口径整理' },
        { value: '实务', label: '申报要点拆解' },
        { value: '专题', label: '按品类持续沉淀' }
      ]
    } satisfies PageHero,
    topics: [
      { icon: 'policy', title: '监管政策', summary: '跟踪医药、食品、化妆品和器械相关政策更新。' },
      { icon: 'description', title: '资料清单', summary: '整理不同品类申报过程中的常用资料结构。' },
      { icon: 'health_and_safety', title: '风险提示', summary: '关注标签、功效、适用范围和宣传表述风险。' }
    ] satisfies DetailBlock[]
  },
  cases: {
    hero: {
      eyebrow: 'Delivery Examples',
      icon: 'workspace_premium',
      title: '以服务成果呈现专业协作方式',
      description:
        '成果示例聚焦服务类型、过程节点和交付内容，展示杰东认证如何帮助企业梳理申报资料、推进流程并形成归档结果。',
      metrics: [
        { value: '资料', label: '目录化交付' },
        { value: '节点', label: '过程化跟进' },
        { value: '建议', label: '后续维护支持' }
      ]
    } satisfies PageHero,
    safeguards: [
      { icon: 'shield', title: '不展示客户敏感信息', summary: '以服务类型和工作成果描述项目，不暴露客户商业信息。' },
      { icon: 'check_circle', title: '强调过程与交付', summary: '重点展示资料整理、路径判断、节点跟进和归档建议。' },
      { icon: 'open_in_new', title: '后续可扩展详情', summary: '正式上线后可接入真实案例库和行业筛选能力。' }
    ] satisfies DetailBlock[]
  },
  contact: {
    hero: {
      eyebrow: 'Contact',
      icon: 'phone_in_talk',
      title: '从产品资料现状开始沟通',
      description:
        '请准备产品名称、产品类别、企业资质、目标批文和已有资料情况。我们将基于现状给出初步路径建议和资料准备方向。',
      metrics: [
        { value: '1次', label: '初步需求评估' },
        { value: '清单', label: '资料缺口提示' },
        { value: '路径', label: '申报方向建议' }
      ]
    } satisfies PageHero,
    methods: [
      { icon: 'call', title: '电话咨询', summary: homeData.footer.phone, items: ['工作日 09:00-18:00', '适合快速确认服务方向'] },
      { icon: 'alternate_email', title: '邮件沟通', summary: homeData.footer.email, items: ['可发送产品资料概要', '适合整理清单和问题'] },
      { icon: 'location_on', title: '服务地址', summary: homeData.footer.address, items: ['支持预约沟通', '请提前确认拜访时间'] }
    ] satisfies DetailBlock[],
    consultationTypes: [
      '保健食品注册备案',
      '化妆品备案申报',
      '消毒产品卫生安全评价',
      '医疗器械注册备案',
      '药品相关批号咨询',
      '食字号与特殊批文咨询'
    ]
  }
};
