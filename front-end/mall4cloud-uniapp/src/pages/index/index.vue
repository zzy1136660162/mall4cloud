<template>
  <view class="page-jiedong">
    <view class="banner-wrapper">
      <swiper
        class="banner-swiper"
        indicator-dots="{{false}}"
        autoplay="{{true}}"
        interval="{{3000}}"
        circular="{{true}}"
        @change="onBannerChange"
      >
        <swiper-item>
          <image class="banner-img" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/banner-1.jpg" mode="aspectFill" />
        </swiper-item>
        <swiper-item>
          <image class="banner-img" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/banner-2.jpg" mode="aspectFill" />
        </swiper-item>
        <swiper-item>
          <image class="banner-img" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/banner-3.jpg" mode="aspectFill" />
        </swiper-item>
      </swiper>
      <view class="banner-logo">
        <image class="logo-img" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/logo.png" mode="aspectFit" />
        <text class="logo-text">杰东优选平台</text>
      </view>
      <view class="banner-content">
        <view class="banner-title">共创医健产业创新生态圈</view>
        <view class="banner-subtitle">大道至简 · 实干为要</view>
      </view>
      <view class="banner-dots">
        <view
          v-for="(item, index) in 3"
          :key="index"
          class="banner-dot"
          :class="{ active: currentBanner === index }"
        />
      </view>
    </view>

    <view class="stats-bar">
      <view class="stat-item">
        <view class="stat-num">13年</view>
        <view class="stat-label">行业深耕</view>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <view class="stat-num">5万+</view>
        <view class="stat-label">服务企业</view>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <view class="stat-num">1000+</view>
        <view class="stat-label">精选产品</view>
      </view>
    </view>

    <view class="tab-sticky">
      <view class="tab-section">
        <view class="tab-wrapper">
          <view
            class="tab-item"
            :class="{ active: currentTab === 0 }"
            @tap="switchTab(0)"
          >
           <!-- <view class="tab-icon">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-tab-cert.svg" mode="aspectFit" />
            </view> -->
            <view class="tab-text">杰东认证</view>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 1 }"
            @tap="switchTab(1)"
          >
          <!--  <view class="tab-icon">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-tab-cdmo.svg" mode="aspectFit" />
            </view> -->
            <view class="tab-text">杰东智造</view>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 2 }"
            @tap="switchTab(2)"
          >
          <!--  <view class="tab-icon">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-tab-prod.svg" mode="aspectFit" />
            </view> -->
            <view class="tab-text tab-text--stacked">
              <text>杰东优品</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 认证板块 -->
    <view v-if="currentTab === 0" class="content-area">
      <view class="content-panel cert-panel">
        <view class="panel-header cert-header">
          <image class="header-bg" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-header-bg.jpg" mode="aspectFill" />
          <view class="header-content">
            <view class="header-title">破解产品全生命周期中的复杂课题</view>
            <view class="header-subtitle">打造全球大健康产业合规智造领航者</view>
          </view>
        </view>

        <view class="card-grid">
          <view class="cert-card" v-for="(cert, index) in certTypes" :key="index">
            <image class="cert-bg" :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-bg-' + (index + 1) + '.jpg'" mode="aspectFill" />
            <view class="cert-content">
              <view class="cert-icon">
                <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-cert-' + (index + 1) + '.svg'" mode="aspectFit" />
              </view>
              <view class="cert-name">{{ cert.name }}</view>
              <view class="cert-desc">{{ cert.desc }}</view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">资质证书</view>
          <scroll-view class="cert-scroll" scroll-x enable-flex>
            <view class="cert-gallery">
              <view class="cert-image-item" v-for="(license, index) in licenses" :key="index">
                <image :src="license" mode="aspectFit" />
              </view>
              <view class="cert-image-item" v-for="(license, index) in licenses" :key="'copy-' + index">
                <image :src="license" mode="aspectFit" />
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="section-block">
          <view class="section-title">服务优势</view>
          <view class="advantage-list">
            <view class="advantage-item">
              <view class="advantage-number">140+</view>
              <view class="advantage-text">专业团队</view>
              <view class="advantage-desc">主力40+人，交付100人</view>
            </view>
            <view class="advantage-item">
              <view class="advantage-number">1075</view>
              <view class="advantage-text">货盘矩阵</view>
              <view class="advantage-desc">SKU覆盖多品类</view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx;">
            <view class="section-title" style="margin-bottom: 0;">研发专家</view>
            <text style="font-size: 24rpx; color: #fe9a51;" @tap="goToTalentPool">更多</text>
          </view>
          <view class="expert-list">
            <view class="expert-card" v-for="(expert, index) in experts" :key="index">
              <view class="expert-photo">
                <image :src="expert.photo" mode="aspectFill" />
              </view>
              <view class="expert-info">
                <view class="expert-name">
                  {{ expert.name }}
                  <text class="expert-title">{{ expert.title }}</text>
                </view>
                <view class="expert-field">{{ expert.field }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="cta-section">
          <view class="cta-btn primary" @tap="onConsult">立即咨询认证</view>
        </view>
      </view>
    </view>

    <!-- CDMO板块 -->
    <view v-if="currentTab === 1" class="content-area">
      <view class="content-panel cdmo-panel">
        <view class="panel-header production-header">
          <image class="header-bg" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/production-bg-1.png" mode="aspectFill" />
          <view class="header-content">
            <view class="header-title">OEM/ODM 贴牌加工</view>
            <view class="header-subtitle">从产品设计、研发到量产的全链条解决方案</view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">剂型类型</view>
          <view class="dosage-grid">
            <view class="dosage-item" v-for="(dosage, index) in dosages" :key="index">
              <view class="dosage-icon">
                <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-dosage-' + (index + 1) + '.svg'" mode="aspectFit" />
              </view>
              <view class="dosage-text">{{ dosage }}</view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">产品类别</view>
          <view class="category-grid">
            <view class="category-item" v-for="(product, index) in products" :key="index">
              <view class="category-img">
                <image :src="product.img" mode="aspectFit" />
              </view>
              <view class="category-info">
                <view class="category-name">{{ product.name }}</view>
                <view class="category-tag">{{ product.tag }}</view>
              </view>
            </view>
          </view>
          <view class="category-pagination">
            <view
              class="category-dot"
              :class="{ active: currentCategoryPage === 0 }"
              @tap="switchCategoryPage(0)"
            />
            <view
              class="category-dot"
              :class="{ active: currentCategoryPage === 1 }"
              @tap="switchCategoryPage(1)"
            />
            <view
              class="category-dot"
              :class="{ active: currentCategoryPage === 2 }"
              @tap="switchCategoryPage(2)"
            />
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">保健用品功效覆盖（15大类）</view>
          <swiper
            class="effect-swiper"
            :current="currentEffectPage"
            :autoplay="true"
            :interval="5000"
            :circular="true"
            :duration="500"
            @change="onEffectSwiperChange"
          >
            <swiper-item>
              <view class="effect-wrapper">
                <view class="effect-grid">
                  <view class="effect-item" v-for="(effect, index) in effects.slice(0, 8)" :key="'p1-' + index">
                    <view class="effect-icon">
                      <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-effect-' + ((index % 6) + 1) + '.svg'" mode="aspectFit" />
                    </view>
                    <view class="effect-name">{{ effect }}</view>
                  </view>
                </view>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="effect-wrapper">
                <view class="effect-grid">
                  <view class="effect-item" v-for="(effect, index) in effects.slice(8, 16)" :key="'p2-' + index">
                    <view class="effect-icon">
                      <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-effect-' + (((index + 8) % 6) + 1) + '.svg'" mode="aspectFit" />
                    </view>
                    <view class="effect-name">{{ effect }}</view>
                  </view>
                </view>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="effect-wrapper">
                <view class="effect-grid">
                  <view class="effect-item" v-for="(effect, index) in effects.slice(16, 18)" :key="'p3-' + index">
                    <view class="effect-icon">
                      <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-effect-' + (((index + 16) % 6) + 1) + '.svg'" mode="aspectFit" />
                    </view>
                    <view class="effect-name">{{ effect }}</view>
                  </view>
                </view>
              </view>
            </swiper-item>
          </swiper>
          <view class="effect-pagination">
            <view
              class="effect-dot"
              :class="{ active: currentEffectPage === 0 }"
              @tap="switchEffectPage(0)"
            />
            <view
              class="effect-dot"
              :class="{ active: currentEffectPage === 1 }"
              @tap="switchEffectPage(1)"
            />
            <view
              class="effect-dot"
              :class="{ active: currentEffectPage === 2 }"
              @tap="switchEffectPage(2)"
            />
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">生产优势</view>
          <view class="prod-advantage-list">
            <view class="prod-advantage-item item-1">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/production-img-1.png" mode="aspectFill" />
              <view class="prod-advantage-overlay">
                <view class="prod-advantage-number">400+</view>
                <view class="prod-advantage-text">安评类目 · 合规无忧</view>
              </view>
            </view>
            <view class="prod-advantage-item item-2">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/production-img-2.png" mode="aspectFill" />
              <view class="prod-advantage-overlay">
                <view class="prod-advantage-number">95%</view>
                <view class="prod-advantage-text">市场覆盖</view>
              </view>
            </view>
            <view class="prod-advantage-item item-3">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/production-img-3.png" mode="aspectFill" />
              <view class="prod-advantage-overlay">
                <view class="prod-advantage-number">多剂型</view>
                <view class="prod-advantage-text">一站式生产</view>
              </view>
            </view>
            <view class="prod-advantage-item item-4">
              <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/production-img-4.jpeg" mode="aspectFill" />
              <view class="prod-advantage-overlay">
                <view class="prod-advantage-number">高品质</view>
                <view class="prod-advantage-text">严格质控</view>
              </view>
            </view>
          </view>
        </view>

        <view class="cta-section">
          <view class="cta-btn primary" @tap="onOEMConsult">获取贴牌方案</view>
        </view>
      </view>
    </view>

    <!-- 营销板块 -->
    <view v-if="currentTab === 2" class="content-area">
      <view class="content-panel marketing-panel">
        <view class="panel-header marketing-header">
          <image class="header-bg" src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/marketing-bg.png" mode="aspectFill" />
          <view class="header-content">
            <view class="header-title">垂直供应链智能中台</view>
            <view class="header-subtitle">重构产业价值链，打造产业级供应链协同平台</view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">核心模式</view>
          <view class="model-cards">
            <view class="model-card" v-for="(model, index) in coreModels" :key="index">
              <view class="model-icon">
                <image :src="'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/icon-model-' + (index + 1) + '.svg'" mode="aspectFit" />
              </view>
              <view class="model-content">
                <view class="model-name">{{ model.name }}</view>
                <view class="model-desc">{{ model.desc }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">资源优势</view>
          <view class="resource-cards">
            <view class="resource-card" v-for="(resource, index) in resources" :key="index">
              <view class="resource-num">{{ resource.num }}</view>
              <view class="resource-label">{{ resource.label }}</view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <view class="section-title">特色产品</view>
          <view class="product-matrix-compact">
            <view class="matrix-stat" v-for="(stat, index) in productStats" :key="index">
              <view class="matrix-stat-num">{{ stat.num }}</view>
              <view class="matrix-stat-label">{{ stat.label }}</view>
            </view>
          </view>
          <view class="featured-products">
            <view class="featured-product-card" v-for="(item, index) in featuredProducts" :key="index" @tap="onProductTap(item)">
              <view class="featured-product-img">
                <image :src="item.img" mode="aspectFit" />
              </view>
              <view class="featured-product-info">
                <view class="featured-product-name">{{ item.name }}</view>
                <view class="featured-product-spec">{{ item.spec }}</view>
                <view class="featured-product-effect">{{ item.effect }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="cta-section">
          <view class="cta-btn primary" @tap="onBrowseProducts">浏览产品库</view>
          <view class="cta-btn secondary" @tap="onPartner">成为合伙人</view>
        </view>
      </view>
    </view>
  </view>

  <diy-tabbar :current-index="0" />
</template>

<script setup>
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'

const currentBanner = ref(0)
const currentTab = ref(0)
const currentEffectPage = ref(0)
const currentCategoryPage = ref(0)
const scrollWidth = ref(375)

const certTypes = reactive([
  { name: '院内制剂', desc: '院内制剂备案/注册' },
  { name: '医疗器械', desc: '一类/二类/三类注册' },
  { name: '功能性食品', desc: '配方研发/合规申报' },
  { name: '消毒产品', desc: '消毒产品备案' },
  { name: '保健用品', desc: '保健用品批件' },
  { name: '化妆品', desc: '普通/特殊化妆品' }
])

const licenses = [
  'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-license-1.jpg',
  'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-license-2.jpg',
  'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-license-3.jpg',
  'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/cert-license-4.jpg'
]

const experts = reactive([
  {
    name: '张明华',
    title: '高级工程师 / 注册专员',
    field: '擅长领域：医疗器械注册、GMP认证',
    photo: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/expert-2.png'
  },
  {
    name: '李建国',
    title: '资深顾问 / 合规专家',
    field: '擅长领域：化妆品备案、消字号审批',
    photo: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/expert-1.png'
  },
  {
    name: '王晓峰',
    title: '技术总监 / 研发专家',
    field: '擅长领域：功能性食品配方、工艺优化',
    photo: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/expert-2.png'
  }
])

const dosages = ['膏剂', '粉剂', '片剂', '液体', '颗粒', '凝胶']

const products = reactive([
  { name: '纤体瘦身贴', tag: '辅助减肥', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-slim.png' },
  { name: '疏通活络液', tag: '缓解疼痛', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-luo.png' },
  { name: '通络透骨喷剂', tag: '改善微循环', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-spray.png' },
  { name: '舒筋活络膏', tag: '舒筋活络', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-ointment.png' },
  { name: '舒缓通鼻膏', tag: '改善鼻部', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-nose.png' },
  { name: '净肤康乳膏', tag: '改善皮肤', img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-cream.png' }
])

const effects = [
  '鼻部护理', '狐臭产品', '美肤护肤', '调理亚健康',
  '护目', '面瘫康复', '固肾养肾', '缓解疼痛',
  '女性调理', '泡浴养生', '润肠通便', '小儿系列',
  '前列腺养护', '烧烫褥疮', '养发护发', '祛痘祛斑',
  '纤体瘦身', '正骨理疗'
]

const coreModels = reactive([
  { name: '上游·深度整合', desc: '直连源头，构建数字化、柔性化供应池' },
  { name: '中台·智能枢纽', desc: '沉淀核心能力，一站式赋能上下游' },
  { name: '下游·无限裂变', desc: '独创无限合伙人生态体系' }
])

const resources = reactive([
  { num: '1000+', label: '精选产品库' },
  { num: '1000+', label: '配方数据库' },
  { num: '72h', label: '响应速度' }
])

const productStats = reactive([
  { num: '45', label: '医疗器械' },
  { num: '210', label: '功能性食品' },
  { num: '168', label: '消字号产品' },
  { num: '132', label: '妆字号产品' }
])

const featuredProducts = reactive([
  {
    name: '巴克宁疤痕膏',
    spec: '规格：20g/瓶',
    effect: '平滑增生、渗透肌底、祛除色素、桥接修补',
    img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-scar.png'
  },
  {
    name: '屁屁黄金',
    spec: '规格：20g/瓶',
    effect: '减少红肿、滋润保湿、温和消疹、舒缓PP、呵护皮脂',
    img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-baby.png'
  },
  {
    name: '男性抑菌喷剂',
    spec: '规格：5ml/瓶',
    effect: '对金黄色葡萄球菌、大肠杆菌、白色念珠菌，真菌有抑制作用',
    img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-men.png'
  },
  {
    name: '净肤康乳膏',
    spec: '规格：20g/支',
    effect: '改善皮肤、抑菌止痒、滋润修护',
    img: 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/homepage/product-cream.png'
  }
])

const onBannerChange = (e) => {
  currentBanner.value = e.detail.current
}

const switchTab = (index) => {
  currentTab.value = index
}

const switchEffectPage = (page) => {
  currentEffectPage.value = page
}

const onEffectSwiperChange = (e) => {
  currentEffectPage.value = e.detail.current
}

const switchCategoryPage = (page) => {
  currentCategoryPage.value = page
  // 未来可以从数据库获取对应页的数据
  // fetchCategoryData(page)
}

const onConsult = () => {
  uni.switchTab({
    url: '/pages/demand-index/demand-index'
  })
}

const onOEMConsult = () => {
  uni.switchTab({
    url: '/pages/demand-index/demand-index'
  })
}

const onBrowseProducts = () => {
  uni.switchTab({
    url: '/pages/sample/selection/selection'
  })
}

const onPartner = () => {
  uni.navigateTo({
    url: '/pages/talent-apply/talent-apply'
  })
}

const onProductTap = (product) => {
  uni.showToast({
    title: '产品详情：' + product.name,
    icon: 'none'
  })
}

const goToTalentPool = () => {
  uni.navigateTo({
    url: '/pages/talent-pool/index/index'
  })
}

const shareImage = 'https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/logo.png'

const enableShareMenu = () => {
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // #endif
}

onLoad((options) => {
  if (options.tab !== undefined) {
    const tab = Number(options.tab)
    if ([0, 1, 2].includes(tab)) {
      currentTab.value = tab
    }
  }
  enableShareMenu()
})

onShareAppMessage(() => {
  const tabTitles = ['首页', '杰东智造', '杰东优品']
  return {
    title: `杰东优选平台 - ${tabTitles[currentTab.value] || '首页'}`,
    path: `/pages/index/index?tab=${currentTab.value}`,
    imageUrl: shareImage
  }
})

onShareTimeline(() => {
  const tabTitles = ['首页', '杰东智造', '杰东优品']
  return {
    title: `杰东优选平台 - ${tabTitles[currentTab.value] || '首页'}`,
    query: `tab=${currentTab.value}`,
    imageUrl: shareImage
  }
})
</script>

<style lang="scss" scoped>
@import './index';
</style>
