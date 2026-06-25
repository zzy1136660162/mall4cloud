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
  image?: string;
  imageAlt?: string;
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
    title: '医药健康产品批文批号代办服务伙伴',
    description:
      '聚焦消字号代办、保健用品号代办、健字号代办与 OEM、ODM 代加工，提供资料审核、申报路径设计和全过程节点跟进服务。',
    image: '/images/hero-compliance.png',
    primaryAction: { label: '咨询服务', href: '/contact' } satisfies HeroAction,
    secondaryAction: { label: '查看申办流程', href: '/process' } satisfies HeroAction,
    cards: [
      { icon: 'verified', title: '批号代办', summary: '消字号、保健用品号、健字号资料路径咨询' },
      { icon: 'fact_check', title: '资料审核', summary: '围绕清单、标签、检测报告与申请资料逐项核对' },
      { icon: 'monitoring', title: '节点跟进', summary: '申报递交、补正反馈、过程沟通节点化管理' },
      { icon: 'handshake', title: '代加工协同', summary: '支持 OEM、ODM 代加工方案沟通与资料衔接' }
    ] satisfies HeroCard[],
    stats: [
      { value: '4类', label: '核心业务方向' },
      { value: '5步', label: '标准化服务流程' },
      { value: '7类', label: '政策资讯专题' }
    ] satisfies HeroStat[]
  },
  services: [
    {
      icon: 'science',
      slug: 'disinfection-number',
      title: '消字号代办',
      summary: '围绕消毒产品、卫生用品等相关备案与评价资料，协助梳理申报路径和材料清单。',
      tags: ['消字号', '资料清单', '评价资料'],
      details: ['产品类别与申报路径初步判断', '检测报告、标签说明书和评价资料整理', '生产条件、委托关系与归档资料核对']
    },
    {
      icon: 'health_and_safety',
      slug: 'health-care-number',
      title: '保健用品号代办',
      summary: '面向保健用品号相关申办需求，协助完成产品资料梳理、标签口径核对和申报节点跟进。',
      tags: ['保健用品号', '资料整理', '标签核对'],
      details: ['产品属性、适用范围和资料现状评估', '配方依据、标签样稿、检测资料协同整理', '申办材料目录与递交节点跟进']
    },
    {
      icon: 'local_pharmacy',
      slug: 'jianzi-number',
      title: '健字号代办',
      summary: '针对健字号申办相关资料要求，提供路径研判、材料整理、文本核对和过程沟通支持。',
      tags: ['健字号', '路径研判', '过程跟进'],
      details: ['目标批号与申办条件梳理', '产品资料、标签说明和证明材料核对', '补正反馈、资料归档和后续维护建议']
    },
    {
      icon: 'handshake',
      slug: 'oem-odm',
      title: 'OEM、ODM代加工',
      summary: '对接医药健康相关产品代加工需求，协助沟通产品定位、生产资料、包装标签和交付节点。',
      tags: ['OEM', 'ODM', '代加工'],
      details: ['产品方向、规格形态和合作模式沟通', '生产资料、包装标签和备案资料衔接', '打样、生产、交付过程节点协同']
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
      summary: '持续关注消字号、保健用品号、健字号与代加工相关监管动态。'
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
      category: '消字号',
      title: '消字号产品资料准备需要关注的基础清单',
      date: '2026-06-18',
      summary: '围绕检测报告、标签说明、生产条件和评价资料梳理申办前置准备。'
    },
    {
      category: '保健用品号',
      title: '保健用品号申办前的资料梳理要点',
      date: '2026-06-12',
      summary: '从产品属性、适用范围、标签样稿和检测资料等角度降低补正风险。'
    },
    {
      category: '健字号',
      title: '健字号申办过程中的文本合规关注事项',
      date: '2026-06-06',
      summary: '关注产品说明、标签表述、证明材料和申报表内容的一致性。'
    },
    {
      category: 'OEM、ODM',
      title: '代加工合作中的资料衔接和交付节点',
      date: '2026-05-28',
      summary: '梳理产品定位、包装标签、生产资料和批号申办之间的协同关系。'
    }
  ] satisfies NewsItem[],
  cases: [
    {
      type: '消字号',
      title: '消字号产品申办资料整理项目',
      status: '资料归档',
      summary: '协助企业梳理检测资料、标签说明和评价资料目录。'
    },
    {
      type: '保健用品号',
      title: '保健用品号申办咨询',
      status: '流程完成',
      summary: '围绕产品资料、标签口径和申办材料进行合规咨询。'
    },
    {
      type: '健字号',
      title: '健字号资料辅导',
      status: '节点跟进',
      summary: '支持产品说明、证明材料和申报文本的准备工作。'
    },
    {
      type: 'OEM、ODM',
      title: '代加工资料衔接服务',
      status: '方案交付',
      summary: '协助梳理产品定位、包装标签和生产资料衔接方案。'
    }
  ] satisfies CaseItem[],
  footer: {
    company: '北京杰东认证服务有限公司',
    description: '专注消字号、保健用品号、健字号代办及 OEM、ODM 代加工服务。',
    contactName: '高经理',
    phone: '15039055716',
    email: '1044349157@qq.com',
    address: '北京市丰台区造甲街南里11号楼11-3幢1层20111号',
    wechatQr: '/images/公众号二维码.jpg',
    icp: ''
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
        '不同产品类别对应不同监管路径。杰东认证以消字号、保健用品号、健字号和 OEM、ODM 代加工为核心方向，为企业建立可推进的申报与协同计划。',
      metrics: [
        { value: '4大类', label: '核心业务方向' },
        { value: '全流程', label: '资料与节点跟进' },
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
      { icon: 'policy', title: '监管政策', summary: '跟踪消字号、保健用品号、健字号相关政策更新。' },
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
      { icon: 'groups', title: '联系人', summary: homeData.footer.contactName, items: [] },
      { icon: 'call', title: '电话咨询', summary: homeData.footer.phone, items: [] },
      { icon: 'alternate_email', title: '邮件沟通', summary: homeData.footer.email, items: [] },
      { icon: 'location_on', title: '公司地址', summary: homeData.footer.address, items: [] },
      { icon: 'map', title: '公众号二维码', summary: '扫码关注公众号', items: [], image: homeData.footer.wechatQr, imageAlt: '杰东药业公众号二维码' }
    ] satisfies DetailBlock[],
    consultationTypes: [
      '消字号代办',
      '保健用品号代办',
      '健字号代办',
      'OEM、ODM代加工'
    ]
  }
};
