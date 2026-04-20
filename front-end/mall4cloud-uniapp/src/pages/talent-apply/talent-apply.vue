<template>
  <view class="apply-container">
    <view class="page-header">
      <text class="header-title">达人申请</text>
      <text class="header-subtitle">成为我们的达人，分享你的才华</text>
    </view>

    <view class="form-section">
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">真实姓名</text>
          <text class="label-required">*</text>
        </view>
        <input
          class="item-input"
          placeholder="请输入真实姓名"
          placeholder-class="placeholder"
          v-model="formData.realName"
        />
      </view>

      <view class="form-item">
        <view class="item-label">
          <text class="label-text">手机号码</text>
          <text class="label-required">*</text>
        </view>
        <input
          class="item-input"
          placeholder="请输入手机号码"
          placeholder-class="placeholder"
          v-model="formData.phone"
          type="number"
        />
      </view>

      <view class="form-item">
        <view class="item-label">
          <text class="label-text">省/市/区</text>
        </view>
        <view class="picker-value" @tap="showPicker = true">
          <text v-if="province" class="picker-text">{{ province }} {{ city }} {{ area }}</text>
          <text v-else class="placeholder">请选择省/市/区</text>
          <text class="picker-arrow">›</text>
        </view>
        <address-picker
          v-if="showPicker"
          :show-picker="showPicker"
          :addr-ids="addrIds"
          @setAddressInfo="addressPickerConfirm"
        />
      </view>

      <view class="form-item form-item-textarea">
        <view class="item-label">
          <text class="label-text">申请理由</text>
          <text class="label-required">*</text>
        </view>
        <textarea
          class="item-textarea"
          placeholder="请简要描述你的特长和申请理由（10-500字）"
          placeholder-class="placeholder"
          v-model="formData.applyReason"
          maxlength="500"
        />
        <text class="textarea-count">{{ formData.applyReason.length }}/500</text>
      </view>

      <view class="form-item form-item-textarea">
        <view class="item-label">
          <text class="label-text">个人简介</text>
        </view>
        <textarea
          class="item-textarea"
          placeholder="请简要介绍自己（选填）"
          placeholder-class="placeholder"
          v-model="formData.intro"
          maxlength="500"
        />
        <text class="textarea-count">{{ formData.intro.length }}/500</text>
      </view>
    </view>

    <view class="benefits-section">
      <text class="benefits-title">成为达人你将获得</text>
      <view class="benefits-list">
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">专属达人标识</text>
        </view>
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">高曝光推荐位</text>
        </view>
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">专属活动邀请</text>
        </view>
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">优先审核通道</text>
        </view>
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">内容创作指导</text>
        </view>
        <view class="benefit-item">
          <view class="benefit-dot"></view>
          <text class="benefit-text">专属客服支持</text>
        </view>
      </view>
    </view>

    <view class="submit-section">
      <view class="submit-btn" :class="{ disabled: isSubmitting }" @tap="submitApply">提交申请</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  realName: '',
  phone: '',
  applyReason: '',
  intro: ''
})

const province = ref('')
const city = ref('')
const area = ref('')
const provinceId = ref(0)
const cityId = ref(0)
const areaId = ref(0)
const addrIds = ref([])
const showPicker = ref(false)
const isSubmitting = ref(false)

const addressPickerConfirm = (selectedAddrInfo, isChange) => {
  if (isChange) {
    province.value = selectedAddrInfo.province
    city.value = selectedAddrInfo.city
    area.value = selectedAddrInfo.area
    provinceId.value = selectedAddrInfo.provinceId
    cityId.value = selectedAddrInfo.cityId
    areaId.value = selectedAddrInfo.areaId
    addrIds.value = [selectedAddrInfo.provinceId, selectedAddrInfo.cityId, selectedAddrInfo.areaId]
  }
  showPicker.value = false
}

const submitApply = () => {
  if (isSubmitting.value) {
    return
  }

  if (!formData.realName) {
    uni.showToast({
      title: '请输入真实姓名',
      icon: 'none'
    })
    return
  }

  if (formData.realName.length < 2 || formData.realName.length > 20) {
    uni.showToast({
      title: '真实姓名需在2-20个字符之间',
      icon: 'none'
    })
    return
  }

  if (!formData.phone) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  if (!formData.applyReason) {
    uni.showToast({
      title: '请输入申请理由',
      icon: 'none'
    })
    return
  }

  if (formData.applyReason.length < 10 || formData.applyReason.length > 500) {
    uni.showToast({
      title: '申请理由需在10-500个字符之间',
      icon: 'none'
    })
    return
  }

  isSubmitting.value = true

  const params = {
    realName: formData.realName,
    phone: formData.phone,
    province: province.value,
    city: city.value,
    area: area.value,
    applyReason: formData.applyReason,
    intro: formData.intro
  }

  http.request({
    url: '/mall4cloud_user/a/talent/apply',
    method: 'POST',
    data: params
  }).then(() => {
    uni.showToast({
      title: '申请提交成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }).catch(() => {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
    isSubmitting.value = false
  })
}
</script>

<style lang="scss" scoped>
@import './talent-apply';
</style>
