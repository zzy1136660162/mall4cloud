<template>
  <view class="page">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section / 8 Stage Indicator -->
      <section class="stage-section">
        <view class="stage-header">
          <h2 class="stage-title">转化流程概览</h2>
          <p class="stage-desc">标准化的八步转化路径，确保科研成果高效、安全落地。</p>
        </view>
        <scroll-view scroll-x class="stage-scroll" :show-scrollbar="false">
          <view class="stage-container">
            <view class="stage-line"></view>
            <view class="stage-list">
              <view v-for="(s, idx) in stages" :key="idx" class="stage-item">
                <view class="stage-dot" :class="['stage-' + s.state]">{{ s.num }}</view>
                <span class="stage-label">{{ s.label }}</span>
              </view>
            </view>
          </view>
        </scroll-view>
      </section>

      <!-- Business Modules (Bento Grid) -->
      <section class="modules-grid">
        <!-- Module 1 -->
        <view class="module module-1" @click="onModuleTap(1)">
          <view class="module-blur-blob"></view>
          <view class="module-header">
            <text class="material-icon module-icon">group_work</text>
            <h3 class="module-title">高校专家与成果协同</h3>
          </view>
          <p class="module-desc">连接顶尖高校科研团队，整合优质前沿成果，打破信息壁垒，实现产学研高效对接与资源共享。</p>
          <view class="module-cta">
            <text>进入成果库</text>
            <text class="material-icon cta-arrow">arrow_forward</text>
          </view>
        </view>
        <!-- Module 2 -->
        <view class="module module-2" @click="onModuleTap(2)">
          <view class="module-blur-blob-bl"></view>
          <view class="module-header">
            <text class="material-icon module-icon">science</text>
            <h3 class="module-title">概念验证与 CDMO 协同</h3>
          </view>
          <p class="module-desc">提供从实验室到中试生产的全面技术支持，降低转化风险。</p>
        </view>
        <!-- Module 3 -->
        <view class="module module-3" @click="onModuleTap(3)">
          <view class="module-blur-blob-tl"></view>
          <view class="module-header">
            <text class="material-icon module-icon">gavel</text>
            <h3 class="module-title">知识产权运营</h3>
          </view>
          <p class="module-desc">专业化的专利布局、价值评估及技术交易服务，保障核心资产。</p>
        </view>
        <!-- Module 4 -->
        <view class="module module-4" @click="onModuleTap(4)">
          <view class="module-gradient-bg"></view>
          <view class="module-header-row">
            <view class="module-info">
              <view class="module-header">
                <text class="material-icon module-icon">campaign</text>
                <h3 class="module-title">专业应用评议与科学传播</h3>
              </view>
              <p class="module-desc">基于行业专家的深度评议，结合多元渠道进行精准的科学普及与市场化传播，提升成果影响力。</p>
            </view>
            <view class="module-btn">了解详情 <text class="material-icon">chevron_right</text></view>
          </view>
        </view>
      </section>

      <!-- Capabilities Showcase -->
      <section class="capabilities-grid">
        <!-- Cap 1 -->
        <view class="cap-card">
          <view class="cap-image">
            <image class="cap-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJlqQl5UrjOHOEo7UxFw5p6bwZzmyQzyQsR8nIvJ3WYBael8iZ811wwJ1Ckb4y5qXFb-8hmTaGSdC3Gs3C5SUK0a4tu0mt6ZhxBPGxAcm68cgGVV7ciZGibCADaRYp_ySnKErUnjSwPQ8DagVYo90BmoEUFoEfHhKmayRpU3CUNGc2fTsrk7VSUaHcfa8XS7-5j9QXhrQaxifR4O6Ze6a-fGHZoYwfrVddNg3o2M0tcqtzX8wKFUjBwBeoQUBwEMrG8ckrkL8Bg-ho" mode="aspectFill"></image>
            <view class="cap-image-overlay"></view>
            <view class="cap-image-title">概念验证能力</view>
          </view>
          <view class="cap-body">
            <p class="cap-desc">配备先进的软硬件设施，针对早期科研成果进行技术可行性与商业潜力的初步验证，提供详实的数据报告。</p>
            <view class="cap-list">
              <view class="cap-item">
                <text class="material-icon check-icon">check_circle</text>
                <text>原型开发支持</text>
              </view>
              <view class="cap-item">
                <text class="material-icon check-icon">check_circle</text>
                <text>技术指标测试</text>
              </view>
            </view>
          </view>
        </view>
        <!-- Cap 2 -->
        <view class="cap-card">
          <view class="cap-image">
            <image class="cap-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcT5fRP51dlAQ4VF1oOXvSVwyKzs08UoqaCtSrcrcfuV103oJQZzSxZ64mlfvh5WnbsTJ37naNho4j-Xui_WB9cyPS6bgUi8FJgof5Vy5iFvX9O1ISdNdlroYe4WpF8YQ6DYOiFMy7aBO27pdfjsGSfikAB261vHbmPWNg3LFDE-kUkI3MklfhyYkwLWPf157NyLN2zdBpiQvC6Ey4kTKMVTovbReQ0Da7jeTzOQUmRqvTVylaNLBphv3r-3O8yRhoii2nBsePSAsf" mode="aspectFill"></image>
            <view class="cap-image-overlay"></view>
            <view class="cap-image-title">CDMO 转化能力</view>
          </view>
          <view class="cap-body">
            <p class="cap-desc">提供从工艺研发、工艺放大到商业化生产的一站式服务，遵循严格的质量管理体系，加速产品上市进程。</p>
            <view class="cap-list">
              <view class="cap-item">
                <text class="material-icon check-icon">check_circle</text>
                <text>GMP 标准产线</text>
              </view>
              <view class="cap-item">
                <text class="material-icon check-icon">check_circle</text>
                <text>规模化量产方案</text>
              </view>
            </view>
          </view>
        </view>
      </section>
    </main>

    <!-- Floating Action Button -->
    <view class="fab-wrap">
      <view class="fab" @click="onFabClick">
        <text class="material-icon fab-icon">add_circle</text>
        <text class="fab-text">提交研发需求</text>
      </view>
    </view>

    <!-- BottomNavBar -->
    <view class="tabbar">
      <view class="tab-item tab-active" @click="onTabClick('home')">
        <text class="material-icon tab-icon fill-icon">home</text>
        <text class="tab-label">首页</text>
      </view>
      <view class="tab-item" @click="onTabClick('database')">
        <text class="material-icon tab-icon">database</text>
        <text class="tab-label">成果库</text>
      </view>
      <view class="tab-item" @click="onTabClick('search')">
        <text class="material-icon tab-icon">search</text>
        <text class="tab-label">查询</text>
      </view>
      <view class="tab-item" @click="onTabClick('person')">
        <text class="material-icon tab-icon">person</text>
        <text class="tab-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stages: [
        { num: 1, label: '资源入库', state: 'done' },
        { num: 2, label: '需求征集', state: 'done' },
        { num: 3, label: '项目立项', state: 'active' },
        { num: 4, label: '概念验证', state: 'todo' },
        { num: 5, label: 'CDMO 转化', state: 'todo' },
        { num: 6, label: 'IP 运营', state: 'todo' },
        { num: 7, label: '科学传播', state: 'todo' },
        { num: 8, label: '市场转化', state: 'todo' }
      ]
    }
  },
  methods: {
    onModuleTap(idx) {
      if (idx === 1) {
        uni.switchTab({ url: '/pages/expert/expert-list' })
      } else {
        uni.showToast({ title: '该模块即将上线', icon: 'none' })
      }
    },
    onFabClick() {
      uni.navigateTo({ url: '/pages/demand-submit/demand-submit' })
    },
    onTabClick(key) {
      if (key === 'home') return
      const map = {
        database: '/pages/expert/expert-list',
        search: '/pages/demand-trace/demand-trace',
        person: '/pages/my/my'
      }
      uni.switchTab({ url: map[key] })
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

.main-content {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 200rpx;
}

/* Stage Section */
.stage-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.stage-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.stage-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
}

.stage-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  line-height: 1.6;
  color: #424754;
}

.stage-scroll {
  width: 100%;
  white-space: nowrap;
}

.stage-container {
  position: relative;
  padding: 16rpx 0;
}

.stage-line {
  position: absolute;
  top: 28rpx;
  left: 0;
  right: 0;
  height: 2rpx;
  background: #d3e4fe;
}

.stage-list {
  display: inline-flex;
  justify-content: space-between;
  min-width: 100%;
  position: relative;
  z-index: 1;
}

.stage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 80rpx;
}

.stage-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  border: 4rpx solid #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.stage-done {
  background: #006c49;
  color: #ffffff;
}

.stage-active {
  background: #6cf8bb;
  color: #00714d;
  box-shadow: 0 0 0 6rpx rgba(108, 248, 187, 0.4), 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.stage-todo {
  background: #d3e4fe;
  color: #424754;
}

.stage-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.05em;
  text-align: center;
  font-weight: 500;
  color: #727785;
  width: 80rpx;
}

.stage-active .stage-label {
  color: #00714d;
  font-weight: 700;
}

.stage-done .stage-label {
  color: #0b1c30;
  font-weight: 600;
}

/* Modules Grid */
.modules-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.module {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 16rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
  position: relative;
  overflow: hidden;
}

.module-1 {
  width: 100%;
}

.module-2,
.module-3 {
  width: calc((100% - 16rpx) / 2);
}

.module-4 {
  width: 100%;
}

.module-blur-blob {
  position: absolute;
  right: -16rpx;
  top: -16rpx;
  width: 128rpx;
  height: 128rpx;
  background: rgba(0, 88, 190, 0.05);
  border-radius: 50%;
  filter: blur(40rpx);
}

.module-blur-blob-bl {
  position: absolute;
  right: -16rpx;
  bottom: -16rpx;
  width: 96rpx;
  height: 96rpx;
  background: rgba(0, 108, 73, 0.05);
  border-radius: 50%;
  filter: blur(30rpx);
}

.module-blur-blob-tl {
  position: absolute;
  left: -16rpx;
  top: -16rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(70, 72, 212, 0.05);
  border-radius: 50%;
  filter: blur(30rpx);
}

.module-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #eff4ff 100%);
  opacity: 0.5;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.material-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 48rpx;
  line-height: 1;
  font-weight: 400;
}

.module-icon {
  color: #0058be;
}

.module-2 .module-icon {
  color: #006c49;
}

.module-3 .module-icon {
  color: #4648d4;
}

.module-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
}

.module-2 .module-title {
  color: #006c49;
}

.module-3 .module-title {
  color: #4648d4;
}

.module-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
  margin-top: 8rpx;
  flex: 1;
}

.module-cta {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 8rpx;
  color: #006c49;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.cta-arrow {
  font-size: 28rpx;
}

.module-header-row {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.module-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.module-btn {
  align-self: flex-end;
  padding: 12rpx 24rpx;
  border: 1rpx solid #c2c6d6;
  border-radius: 12rpx;
  color: #0b1c30;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

/* Capabilities Grid */
.capabilities-grid {
  display: flex;
  gap: 24rpx;
}

.cap-card {
  flex: 1;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.cap-image {
  height: 220rpx;
  position: relative;
}

.cap-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cap-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #ffffff, transparent);
}

.cap-image-title {
  position: absolute;
  bottom: 16rpx;
  left: 16rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.cap-body {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cap-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.cap-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
}

.cap-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
}

.check-icon {
  color: #006c49;
  font-size: 32rpx;
}

/* FAB */
.fab-wrap {
  position: fixed;
  right: 24rpx;
  bottom: 200rpx;
  z-index: 50;
}

.fab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 32rpx;
  background: #0058be;
  color: #ffffff;
  border-radius: 9999rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 88, 190, 0.3);
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.4;
}

.fab-icon {
  font-size: 36rpx;
}

/* Tabbar */
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background: #e5eeff;
  border-top: 1rpx solid #c2c6d6;
  box-shadow: 0 -4rpx 16rpx rgba(26, 54, 93, 0.06);
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #424754;
}

.tab-active {
  color: #00714d;
}

.tab-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 40rpx;
  line-height: 1;
}

.fill-icon {
  font-variation-settings: 'FILL' 1;
}

.tab-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.tab-active .tab-label {
  font-weight: 700;
}
</style>
