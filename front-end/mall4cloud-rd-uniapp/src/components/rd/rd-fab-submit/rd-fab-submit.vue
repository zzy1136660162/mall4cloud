<template>
  <view class="fab-wrap" :style="{ paddingBottom: fabSafeBottom }">
    <view class="fab" @click="onClick">
      <text class="material-icon fab-icon">add_circle</text>
      <text class="fab-text">提交研发需求</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RdFabSubmit',
  data() {
    return {
      fabSafeBottom: '200rpx'
    }
  },
  mounted() {
    try {
      const sys = uni.getSystemInfoSync()
      this.fabSafeBottom = (sys.safeAreaInsets && sys.safeAreaInsets.bottom ? sys.safeAreaInsets.bottom : 0) + 'px'
    } catch (e) {
      this.fabSafeBottom = '0'
    }
  },
  methods: {
    onClick() {
      uni.navigateTo({ url: '/pages/demand-submit/demand-submit' })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  transition: transform 0.15s, background 0.2s;

  &:active {
    transform: scale(0.96);
    background: #2170e4;
  }
}

.fab-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 36rpx;
  line-height: 1;
  font-weight: 400;
}

.fab-text {
  font-weight: 700;
}
</style>
