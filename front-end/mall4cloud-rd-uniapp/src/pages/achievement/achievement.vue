<template>
  <view class="page">
    <scroll-view scroll-y class="content">
      <view class="hero">
        <image class="hero-image" src="/static/rd-portal-hero.jpg" mode="aspectFill" />
        <view class="hero-overlay"></view>
        <view class="hero-content">
          <view class="portal-kicker">研发成果转化门户</view>
          <view class="portal-title">让科研成果，走向产业现场</view>
          <view class="portal-desc">汇聚高校专家、验证能力与产业资源，为研发需求提供从立项到量产的协同支持。</view>
          <view class="hero-actions">
            <view class="hero-btn primary" @tap="onSubmitDemand">提交研发需求</view>
            <view class="hero-btn secondary" @tap="onExperts">浏览专家资源</view>
          </view>
        </view>
      </view>

      <view class="content-inner">
        <view class="summary-strip">
          <view class="summary-item">
            <text class="summary-value">8</text>
            <text class="summary-label">转化环节</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">4</text>
            <text class="summary-label">协同模块</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">2</text>
            <text class="summary-label">核心能力</text>
          </view>
        </view>

        <view class="section-head">
          <view>
            <view class="section-kicker">TRANSLATION PATH</view>
            <view class="section-title">成果转化全流程</view>
          </view>
          <view class="section-desc">从资源入库到市场转化，关键节点清晰可追踪。</view>
        </view>
        <view class="rounded-card flow">
          <view class="flow-stages">
            <view
              class="stage"
              v-for="(s, i) in flowStages"
              :key="s.id"
              :class="{ active: s.active, done: i < 2 }"
            >
              <view class="stage-circle">
                <text class="stage-num">{{ s.id }}</text>
              </view>
              <text class="stage-name">{{ s.name }}</text>
            </view>
          </view>
        </view>

        <view class="section-head compact-head">
          <view>
            <view class="section-kicker">COLLABORATION</view>
            <view class="section-title">四大协同模块</view>
          </view>
        </view>
        <view class="caps-grid">
          <view class="cap-card" v-for="(c, idx) in capabilities" :key="c.id" @tap="onCapTap(c)">
            <view class="cap-order">0{{ idx + 1 }}</view>
            <view class="cap-title">{{ c.title }}</view>
            <view class="cap-desc">{{ c.desc }}</view>
            <view v-if="c.highlight" class="cap-link">{{ c.highlight }}</view>
          </view>
        </view>

        <view class="section-head compact-head">
          <view>
            <view class="section-kicker">R&amp;D CAPABILITY</view>
            <view class="section-title">公司研发能力</view>
          </view>
        </view>
        <view class="ability-grid">
          <view class="rounded-card ability-card" v-for="(a, i) in abilityCards" :key="a.id" :class="{ green: i === 1 }">
            <view class="ability-index">0{{ i + 1 }}</view>
            <view class="ability-eyebrow">{{ i === 0 ? 'PROOF OF CONCEPT' : 'CDMO TRANSFORMATION' }}</view>
            <view class="ability-title">{{ a.title }}</view>
            <view class="ability-desc">{{ a.desc }}</view>
            <view class="ability-points">
              <view class="point" v-for="(p, idx) in a.points" :key="idx">
                <text class="point-order">{{ String(idx + 1).padStart(2, '0') }}</text>
                <text class="point-text">{{ p }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="cta-card">
          <view class="cta-kicker">从一个明确的研发问题开始</view>
          <view class="cta-title">提交需求，获取专业转化支持</view>
          <view class="cta-desc">填写项目目标、预算和期望周期，科研转化专员将尽快与您联系。</view>
          <view class="cta-btn" @tap="onSubmitDemand">立即提交研发需求</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { flowStages, capabilities, abilityCards } from '@/utils/data.js'

export default {
  data() {
    return {
      flowStages,
      capabilities,
      abilityCards
    }
  },
  methods: {
    onCapTap(c) {
      if (c.id === 1) {
        uni.switchTab({ url: '/pages/experts/experts' })
      }
    },
    onExperts() {
      uni.switchTab({ url: '/pages/experts/experts' })
    },
    onSubmitDemand() {
      uni.navigateTo({ url: '/pages/demand-submit/demand-submit' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-page);
}

.content {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

.hero {
  position: relative;
  height: 570rpx;
  overflow: hidden;
  background: #dce9ff;
}
.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(248, 249, 255, 0) 60%, var(--bg-page) 100%),
    linear-gradient(90deg, rgba(244, 249, 255, 0.98) 0%, rgba(244, 249, 255, 0.92) 48%, rgba(244, 249, 255, 0.18) 100%);
}
.hero-content {
  position: relative;
  z-index: 1;
  width: 72%;
  padding: calc(54rpx + env(safe-area-inset-top)) 34rpx 40rpx;
  box-sizing: border-box;
}
.portal-kicker {
  display: inline-flex;
  padding: 8rpx 16rpx;
  border: 1rpx solid rgba(0, 88, 190, 0.25);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.76);
  color: var(--primary);
  font-size: 21rpx;
  font-weight: 700;
}
.portal-title {
  margin-top: 22rpx;
  color: var(--on-surface);
  font-size: 48rpx;
  line-height: 1.2;
  font-weight: 750;
}
.portal-desc {
  margin-top: 18rpx;
  color: var(--on-surface-variant);
  font-size: 24rpx;
  line-height: 1.7;
}
.hero-actions {
  display: flex;
  gap: 14rpx;
  margin-top: 28rpx;
}
.hero-btn {
  min-height: 70rpx;
  padding: 0 22rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23rpx;
  font-weight: 700;
}
.hero-btn.primary { background: var(--primary); color: #fff; }
.hero-btn.secondary { border: 2rpx solid var(--primary); background: rgba(255, 255, 255, 0.86); color: var(--primary); }

.content-inner {
  padding: 0 24rpx calc(36rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.summary-strip {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: -54rpx 0 44rpx;
  padding: 24rpx 16rpx;
  border: 1rpx solid var(--outline-variant);
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10rpx 28rpx rgba(25, 70, 140, 0.12);
}
.summary-item { text-align: center; border-right: 1rpx solid var(--outline-variant); }
.summary-item:last-child { border-right: 0; }
.summary-value { display: block; color: var(--primary); font-size: 38rpx; font-weight: 750; }
.summary-label { display: block; margin-top: 5rpx; color: var(--on-surface-variant); font-size: 21rpx; }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28rpx;
  margin: 0 4rpx 20rpx;
}
.compact-head { margin-top: 46rpx; }
.section-kicker { color: var(--primary); font-size: 18rpx; font-weight: 700; letter-spacing: 2rpx; }
.section-title { margin-top: 8rpx; color: var(--on-surface); font-size: 32rpx; font-weight: 750; }
.section-desc { max-width: 330rpx; color: var(--on-surface-variant); font-size: 21rpx; line-height: 1.55; text-align: right; }

.rounded-card {
  background: #ffffff;
  border: 1rpx solid var(--outline-variant);
  border-radius: 22rpx;
  padding: 28rpx;
  box-shadow: 0 7rpx 20rpx rgba(60, 90, 170, 0.06);
}
.flow-stages {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 30rpx;
}
.flow {
  background: linear-gradient(145deg, #ffffff 0%, #f4f8ff 54%, #f1faf7 100%);
  border-color: #dce8f5;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stage-circle {
  width: 58rpx;
  height: 58rpx;
  border-radius: 16rpx;
  background: #eaf3ff;
  color: #315f91;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  border: 2rpx solid #d8e8fa;
  box-shadow: 0 5rpx 14rpx rgba(37, 91, 151, 0.08);
}
.stage:nth-child(n + 5) .stage-circle {
  background: #e8f7f2;
  color: #28705e;
  border-color: #d2ece3;
}
.stage.done .stage-circle {
  background: linear-gradient(145deg, #168bc3 0%, #20a98d 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 7rpx 16rpx rgba(20, 139, 166, 0.2);
}
.stage.active .stage-circle {
  background: linear-gradient(145deg, #0058be 0%, #168bd2 100%);
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 0 5rpx rgba(0, 88, 190, 0.12), 0 9rpx 20rpx rgba(0, 88, 190, 0.24);
}
.stage-name {
  margin-top: 10rpx;
  font-size: 21rpx;
  color: var(--on-surface-variant);
  text-align: center;
  line-height: 1.3;
  white-space: normal;
  width: 130rpx;
}
.stage.done .stage-name {
  color: #176f79;
  font-weight: 600;
}
.stage.active .stage-name {
  color: var(--primary);
  font-weight: 700;
}
.stage:nth-child(n + 5) .stage-name {
  color: #3c6d62;
}

.caps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
.cap-card {
  min-height: 300rpx;
  padding: 26rpx 24rpx;
  border: 1rpx solid var(--outline-variant);
  border-radius: 20rpx;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 6rpx 18rpx rgba(60, 90, 170, 0.05);
}
.cap-order {
  width: 54rpx;
  height: 54rpx;
  border-radius: 14rpx;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
}
.cap-title {
  margin-top: 20rpx;
  font-size: 26rpx;
  line-height: 1.45;
  font-weight: 700;
  color: var(--on-surface);
}
.cap-desc {
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: var(--on-surface-variant);
}
.cap-link { margin-top: 16rpx; color: var(--primary); font-size: 21rpx; font-weight: 700; }

.ability-grid { display: flex; flex-direction: column; gap: 18rpx; }
.ability-card { position: relative; overflow: hidden; }
.ability-card.green { background: linear-gradient(145deg, #ffffff 0%, #e5f7ef 100%); }
.ability-index {
  position: absolute;
  right: 24rpx;
  top: 20rpx;
  color: rgba(0, 88, 190, 0.12);
  font-size: 70rpx;
  font-weight: 750;
}
.ability-eyebrow {
  color: var(--primary);
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
}
.ability-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 12rpx;
}
.ability-desc {
  font-size: 24rpx;
  line-height: 1.7;
  color: var(--on-surface-variant);
  margin-bottom: 16rpx;
}
.ability-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}
.point {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 14rpx 12rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.72);
}
.point-order {
  color: var(--primary);
  font-family: monospace;
  font-size: 20rpx;
  font-weight: 700;
}
.point-text {
  font-size: 21rpx;
  color: var(--on-surface);
}
.cta-card {
  margin-top: 28rpx;
  padding: 36rpx 30rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #064b9a 0%, #006c75 100%);
  color: #fff;
  box-shadow: 0 10rpx 26rpx rgba(0, 88, 190, 0.2);
}
.cta-kicker { font-size: 21rpx; opacity: 0.8; }
.cta-title { margin-top: 12rpx; font-size: 31rpx; font-weight: 750; }
.cta-desc { margin-top: 12rpx; font-size: 23rpx; line-height: 1.65; opacity: 0.84; }
.cta-btn {
  height: 78rpx;
  margin-top: 26rpx;
  border-radius: 14rpx;
  background: #fff;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;
  font-weight: 750;
}
</style>
