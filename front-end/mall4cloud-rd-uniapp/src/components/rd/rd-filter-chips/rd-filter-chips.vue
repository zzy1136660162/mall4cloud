<template>
  <view class="rd-chips">
    <view
      v-for="(c, idx) in list"
      :key="idx"
      class="chip"
      :class="{ 'chip-active': modelValue === c.value }"
      @click="onTap(c.value)"
    >
      {{ c.label }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'RdFilterChips',
  props: {
    list: { type: Array, default: () => [] },
    modelValue: { type: [String, Number, null], default: null }
  },
  emits: ['update:modelValue', 'change'],
  methods: {
    onTap(val) {
      this.$emit('update:modelValue', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  padding: 16rpx 32rpx;
  background: #ffffff;
  color: #424754;
  border: 1rpx solid #c2c6d6;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.chip-active {
  background: #0058be;
  color: #ffffff;
  border-color: #0058be;
  box-shadow: 0 2rpx 8rpx rgba(0, 88, 190, 0.2);
}
</style>
