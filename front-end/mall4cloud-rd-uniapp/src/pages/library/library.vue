<template>
  <view class="page">
    <!-- TopBar -->
    <view class="top-bar">
      <view class="search-section">
        <view class="search-box">
          <text class="material-icon search-icon">search</text>
          <input class="search-input" placeholder="搜索专家、成果或关键词" placeholder-class="search-placeholder" v-model="searchQuery" @confirm="onSearch"/>
        </view>
      </view>
    </view>

    <!-- Filter Bar -->
    <view class="filter-bar">
      <view class="filter-tabs">
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'experts' }"
          @click="activeTab = 'experts'"
        >
          <text class="material-icon tab-icon">person</text>
          专家库
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'achievements' }"
          @click="activeTab = 'achievements'"
        >
          <text class="material-icon tab-icon">lightbulb</text>
          成果库
        </view>
      </view>
      <view class="filter-actions">
        <view class="filter-btn" @click="showFilter = !showFilter">
          <text class="material-icon filter-icon">filter_alt</text>
          筛选
        </view>
      </view>
    </view>

    <!-- Filter Drawer -->
    <view class="filter-drawer" v-if="showFilter">
      <view class="filter-mask" @click="showFilter = false"></view>
      <view class="filter-panel">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="material-icon filter-close" @click="showFilter = false">close</text>
        </view>
        <view class="filter-content">
          <view class="filter-group">
            <h4 class="filter-group-title">技术领域</h4>
            <view class="filter-options">
              <view 
                v-for="opt in techOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedTech === opt.value }"
                @click="selectedTech = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedTech === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
          <view class="filter-group">
            <h4 class="filter-group-title">成果类型</h4>
            <view class="filter-options">
              <view 
                v-for="opt in typeOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedType === opt.value }"
                @click="selectedType = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedType === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
          <view class="filter-group">
            <h4 class="filter-group-title">转化阶段</h4>
            <view class="filter-options">
              <view 
                v-for="opt in stageOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedStage === opt.value }"
                @click="selectedStage = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedStage === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
        </view>
        <view class="filter-footer">
          <view class="reset-btn" @click="resetFilter">重置</view>
          <view class="confirm-btn" @click="applyFilter">确认筛选</view>
        </view>
      </view>
    </view>

    <!-- Content Area -->
    <main class="main-content">
      <!-- Expert List -->
      <view class="list-container" v-if="activeTab === 'experts'">
        <view class="list-header">
          <h3 class="list-title">
            <text class="material-icon title-icon">group</text>
            专家人才库
          </h3>
          <p class="list-count">共 {{ expertList.length }} 位专家</p>
        </view>
        <view class="card-list">
          <view 
            v-for="item in expertList" 
            :key="item.id" 
            class="expert-card"
            @click="goDetail(item)"
          >
            <image class="card-avatar" :src="item.avatar" mode="aspectFill"></image>
            <view class="card-body">
              <view class="card-header">
                <div class="card-title-wrap">
                  <h4 class="card-name">{{ item.name }}</h4>
                  <view class="verified-badge" v-if="item.verified">
                    <text class="material-icon verified-icon">verified</text>
                  </view>
                </div>
                <text class="card-rating">{{ item.rating }}<text class="material-icon star-icon">star</text></text>
              </view>
              <p class="card-title">{{ item.title }}</p>
              <p class="card-org">{{ item.org }}</p>
              <view class="card-tags">
                <text v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</text>
              </view>
              <view class="card-footer">
                <view class="card-stat">
                  <text class="stat-num">{{ item.projects }}</text>
                  <text class="stat-label">项目经验</text>
                </view>
                <view class="card-stat">
                  <text class="stat-num">{{ item.patents }}</text>
                  <text class="stat-label">专利</text>
                </view>
                <view class="card-stat">
                  <text class="stat-num">{{ item.papers }}</text>
                  <text class="stat-label">论文</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Achievement List -->
      <view class="list-container" v-if="activeTab === 'achievements'">
        <view class="list-header">
          <h3 class="list-title">
            <text class="material-icon title-icon">workspace_premium</text>
            科技成果库
          </h3>
          <p class="list-count">共 {{ achievementList.length }} 项成果</p>
        </view>
        <view class="achievement-grid">
          <view 
            v-for="item in achievementList" 
            :key="item.id" 
            class="achievement-card"
          >
            <view class="achievement-image-wrap">
              <image class="achievement-image" :src="item.image" mode="aspectFill"></image>
              <view class="achievement-badge" :class="item.badgeType">
                {{ item.badge }}
              </view>
            </view>
            <view class="achievement-body">
              <h4 class="achievement-title">{{ item.title }}</h4>
              <p class="achievement-desc">{{ item.desc }}</p>
              <view class="achievement-tags">
                <text v-for="tag in item.tags" :key="tag" class="achievement-tag">{{ tag }}</text>
              </view>
              <view class="achievement-footer">
                <view class="achievement-meta">
                  <text class="material-icon meta-icon">building</text>
                  {{ item.org }}
                </view>
                <view class="achievement-meta">
                  <text class="material-icon meta-icon">calendar_today</text>
                  {{ item.date }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </main>

    <!-- Tabbar -->
    <rd-tabbar current="library" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      activeTab: 'experts',
      showFilter: false,
      selectedTech: '',
      selectedType: '',
      selectedStage: '',
      techOptions: [
        { label: '全部', value: '' },
        { label: '新材料', value: 'materials' },
        { label: '新能源', value: 'energy' },
        { label: '生物医药', value: 'biomed' },
        { label: '智能制造', value: 'smart' },
        { label: '信息技术', value: 'it' }
      ],
      typeOptions: [
        { label: '全部', value: '' },
        { label: '专利技术', value: 'patent' },
        { label: '软件著作', value: 'software' },
        { label: '技术方案', value: 'scheme' },
        { label: '标准规范', value: 'standard' }
      ],
      stageOptions: [
        { label: '全部', value: '' },
        { label: '实验室阶段', value: 'lab' },
        { label: '中试阶段', value: 'pilot' },
        { label: '可量产', value: 'mass' },
        { label: '已转化', value: 'converted' }
      ],
      expertList: [
        { id: 1, name: '林致远', title: '首席科学家 / 高级工程师', org: '国家前沿材料技术联合实验室', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEaowe6oAysGjc688N7MDHf4XNthoUz6EWcliasvZqz6oLAEqQeOUKkizNqbeWOcp-_s8pffhxw0IwPYjtAgZbgN9wQMWy9qUjf-QMvV3bjg1079HKNnaYIzYVZ5spTNe1dWvMg_Yk9F6FHdRHscij4As-RAkOoktBPJWUOI18n9zdQyOd_CntY2NAZKI2DFmv93FAh6jF43DhkD7_nTp2B8e6pRbzSeSexM27OivQ14Not0s8IoTpa118nUIUrCQ97cahUK_UB-SB', verified: true, rating: 4.9, tags: ['材料科学', '纳米技术', '产业化'], projects: 12, patents: 45, papers: 80 },
        { id: 2, name: '张雪梅', title: '教授 / 博士生导师', org: '清华大学材料学院', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEm9n1DkM0Xt0V9N4V0L0Q0W0E0R0T0Y0U0I0O0P0A0S0D0F0G0H0J0K0L0M0N0O0P0Q0R0S0T0U0V0W0X0Y0Z', verified: true, rating: 4.8, tags: ['新能源', '固态电池', '储能'], projects: 8, patents: 32, papers: 65 },
        { id: 3, name: '王建国', title: '研究员 / 项目负责人', org: '中国科学院上海硅酸盐研究所', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEaowe6oAysGjc688N7MDHf4XNthoUz6EWcliasvZqz6oLAEqQeOUKkizNqbeWOcp-_s8pffhxw0IwPYjtAgZbgN9wQMWy9qUjf-QMvV3bjg1079HKNnaYIzYVZ5spTNe1dWvMg_Yk9F6FHdRHscij4As-RAkOoktBPJWUOI18n9zdQyOd_CntY2NAZKI2DFmv93FAh6jF43DhkD7_nTp2B8e6pRbzSeSexM27OivQ14Not0s8IoTpa118nUIUrCQ97cahUK_UB-SB', verified: false, rating: 4.7, tags: ['陶瓷材料', '3D打印', '生物医用'], projects: 6, patents: 28, papers: 52 },
        { id: 4, name: '李明辉', title: '高级工程师', org: '华为技术有限公司', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEaowe6oAysGjc688N7MDHf4XNthoUz6EWcliasvZqz6oLAEqQeOUKkizNqbeWOcp-_s8pffhxw0IwPYjtAgZbgN9wQMWy9qUjf-QMvV3bjg1079HKNnaYIzYVZ5spTNe1dWvMg_Yk9F6FHdRHscij4As-RAkOoktBPJWUOI18n9zdQyOd_CntY2NAZKI2DFmv93FAh6jF43DhkD7_nTp2B8e6pRbzSeSexM27OivQ14Not0s8IoTpa118nUIUrCQ97cahUK_UB-SB', verified: true, rating: 4.9, tags: ['半导体', '芯片制造', '光刻技术'], projects: 15, patents: 58, papers: 45 }
      ],
      achievementList: [
        { id: 1, title: '新型固态电池电解质材料及制备方法', desc: '一种高安全性、高离子导电性的固态电解质材料，适用于下一代固态锂电池。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20battery%20technology%20material%20scientific%20research%20lab&image_size=square', tags: ['固态电池', '电解质', '新能源'], org: '国家前沿材料技术联合实验室', date: '2023.06', badge: '已转化', badgeType: 'badge-success' },
        { id: 2, title: '高效柔性光伏封装胶膜', desc: '高透光率、耐候性强的柔性封装材料，适用于柔性太阳能组件。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solar%20panel%20material%20flexible%20photovoltaic%20technology&image_size=square', tags: ['光伏', '封装材料', '柔性'], org: '清华大学材料学院', date: '2022.11', badge: '可量产', badgeType: 'badge-primary' },
        { id: 3, title: '生物活性陶瓷骨修复材料', desc: '具有良好生物相容性和骨传导性的新型陶瓷材料，用于骨科植入。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=biomedical%20ceramic%20material%20bone%20implant%20medical%20research&image_size=square', tags: ['生物医用', '陶瓷', '骨修复'], org: '中科院上海硅酸盐研究所', date: '2023.03', badge: '中试阶段', badgeType: 'badge-secondary' },
        { id: 4, title: '高性能碳化硅外延生长技术', desc: '突破大尺寸SiC单晶外延生长关键技术，满足功率器件需求。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silicon%20carbide%20semiconductor%20wafer%20advanced%20electronics&image_size=square', tags: ['半导体', '碳化硅', '外延'], org: '华为技术有限公司', date: '2023.09', badge: '实验室阶段', badgeType: 'badge-tertiary' }
      ]
    }
  },
  methods: {
    onSearch() {
      uni.showToast({ title: '搜索中...', icon: 'loading' })
      setTimeout(() => { uni.hideToast() }, 500)
    },
    resetFilter() {
      this.selectedTech = ''
      this.selectedType = ''
      this.selectedStage = ''
    },
    applyFilter() {
      this.showFilter = false
      uni.showToast({ title: '筛选已应用', icon: 'success' })
    },
    goDetail(item) {
      uni.navigateTo({ url: '/pages/expert-detail/expert-detail?id=' + item.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f8f9ff;
  color: #0b1c30;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
}

.top-bar {
  padding: 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #c2c6d6;
}

.search-section {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: #eff4ff;
  border-radius: 9999rpx;
  padding: 16rpx 24rpx;
  border: 1rpx solid #dce9ff;
}

.search-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #727785;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
  background: transparent;
}

.search-placeholder {
  color: #727785;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #c2c6d6;
}

.filter-tabs {
  display: flex;
  gap: 8rpx;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 9999rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.4;
  color: #424754;
  background: #f8f9ff;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #0058be;
  color: #ffffff;
}

.tab-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

.filter-actions {
  display: flex;
  gap: 16rpx;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #eff4ff;
  border: 1rpx solid #dce9ff;
}

.filter-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

/* Filter Drawer */
.filter-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.filter-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.filter-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #c2c6d6;
}

.filter-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.filter-close {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 36rpx;
  line-height: 1;
  color: #727785;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx;
}

.filter-group {
  margin-bottom: 24rpx;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  margin-bottom: 16rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.filter-option {
  padding: 12rpx 24rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #f8f9ff;
  border: 1rpx solid #dce9ff;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.filter-option.active {
  background: #0058be;
  color: #ffffff;
  border-color: #0058be;
}

.check-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
}

.filter-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1rpx solid #c2c6d6;
}

.reset-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #f8f9ff;
  border: 1rpx solid #dce9ff;
  text-align: center;
}

.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #ffffff;
  background: #006c49;
  text-align: center;
}

/* Main Content */
.main-content {
  padding: 24rpx;
  padding-bottom: 160rpx;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.title-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
}

.list-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

/* Expert Card List */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.expert-card {
  display: flex;
  gap: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.card-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 3rpx solid #dce9ff;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title-wrap {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.card-name {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.verified-badge {
  width: 32rpx;
  height: 32rpx;
  background: #006c49;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verified-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 20rpx;
  line-height: 1;
  font-variation-settings: 'FILL' 1;
}

.card-rating {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.2;
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.star-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
  font-variation-settings: 'FILL' 1;
}

.card-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.4;
  color: #424754;
}

.card-org {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #727785;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.card-tag {
  font-size: 24rpx;
  background: #d3e4fe;
  color: #0b1c30;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid #c2c6d6;
}

.card-footer {
  display: flex;
  gap: 24rpx;
  margin-top: auto;
}

.card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.2;
  color: #006c49;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

/* Achievement Grid */
.achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.achievement-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.achievement-image-wrap {
  position: relative;
  height: 240rpx;
}

.achievement-image {
  width: 100%;
  height: 100%;
}

.achievement-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(108, 248, 187, 0.9);
  color: #00714d;
}

.badge-primary {
  background: rgba(33, 112, 228, 0.9);
  color: #ffffff;
}

.badge-secondary {
  background: rgba(245, 158, 11, 0.9);
  color: #ffffff;
}

.badge-tertiary {
  background: rgba(114, 119, 133, 0.9);
  color: #ffffff;
}

.achievement-body {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.achievement-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.achievement-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.achievement-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.achievement-tag {
  font-size: 24rpx;
  background: rgba(108, 248, 187, 0.2);
  color: #00714d;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.achievement-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 8rpx;
}

.achievement-meta {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #727785;
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.meta-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
}
</style>
