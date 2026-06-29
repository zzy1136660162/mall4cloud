<template>
  <article class="rd-expert-card surface-card-hover" @click="onTap">
    <view class="expert-head">
      <view class="avatar" :class="avatarBg">
        <text class="material-icon avatar-icon">{{ avatarIcon }}</text>
      </view>
      <view class="head-info">
        <view class="expert-name">{{ name }}</view>
        <view class="expert-title">{{ title }}</view>
        <view class="expert-org">{{ org }}</view>
      </view>
    </view>
    <view class="tag-list">
      <view v-for="(t, i) in tags" :key="i" class="tag tag-surface">{{ t }}</view>
    </view>
    <view class="expert-desc">{{ desc }}</view>
    <view class="expert-foot">
      <view class="foot-stat">
        <text class="material-icon foot-icon">integration_instructions</text>
        <text class="foot-text">转化成果: {{ achievements }}项</text>
      </view>
      <view class="foot-btn">
        <text>联系专家</text>
        <text class="material-icon cta-arrow">arrow_forward</text>
      </view>
    </view>
  </article>
</template>

<script>
export default {
  name: 'RdExpertCard',
  props: {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    org: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    desc: { type: String, default: '' },
    achievements: { type: Number, default: 0 },
    avatarBg: { type: String, default: 'avatar-blue' },
    avatarIcon: { type: String, default: 'person' }
  },
  methods: {
    onTap() {
      this.$emit('tap')
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-expert-card {
  display: flex;
  flex-direction: column;
  padding: 32rpx;
  background: #ffffff;
}

.expert-head {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: 1rpx solid #c2c6d6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-blue { background: linear-gradient(135deg, #cbdbf5 0%, #adc6ff 100%); }
.avatar-pink { background: linear-gradient(135deg, #ffd3e3 0%, #ff9ec2 100%); }
.avatar-green { background: linear-gradient(135deg, #b8e8d4 0%, #4edea3 100%); }

.avatar-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 56rpx;
  line-height: 1;
  color: #ffffff;
  font-weight: 400;
}

.head-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.expert-name {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.expert-title {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.expert-org {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.05em;
  font-weight: 500;
  color: #006c49;
  margin-top: 4rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 12rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20rpx;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.05em;
  border: 1rpx solid transparent;
}

.tag-surface {
  background: #dce9ff;
  color: #0b1c30;
  border-color: #d3e4fe;
}

.expert-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.expert-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 24rpx;
  border-top: 1rpx solid #d3e4fe;
}

.foot-stat {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #424754;
}

.foot-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

.foot-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.foot-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 24rpx;
  background: rgba(0, 108, 73, 0.1);
  color: #006c49;
  border: 1rpx solid rgba(0, 108, 73, 0.3);
  border-radius: 12rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.cta-arrow {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
}
</style>
