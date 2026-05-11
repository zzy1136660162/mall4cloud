<template>
  <view class="page-demand-submit">
    <view class="header-banner">
      <view class="form-title">📝 填写研发需求</view>
      <view class="form-subtitle">告诉我们您的需求，我们为您定制专属产品</view>
    </view>

    <view class="form-card">
      <view class="form-item">
        <text class="form-label">
          <text class="required">*</text>
          需求标题
        </text>
        <input class="form-input" placeholder="请输入需求标题，如：美白保湿面膜研发" v-model="form.title" maxlength="200" />
      </view>

      <view class="form-item">
        <text class="form-label">
          <text class="required">*</text>
          功能诉求
        </text>
        <textarea class="form-textarea" placeholder="请详细描述您的产品功能诉求，如功效、成分要求等" v-model="form.functionalAppeal" maxlength="1000" />
      </view>

      <view class="form-item">
        <text class="form-label">
          <text class="required">*</text>
          目标人群
        </text>
        <input class="form-input" placeholder="如：25-35岁女性，敏感肌" v-model="form.targetAudience" maxlength="100" />
      </view>

      <view class="form-item">
        <text class="form-label">剂型偏好</text>
        <input class="form-input" placeholder="如：面膜贴、精华液、乳液等（选填）" v-model="form.dosageFormPreference" maxlength="100" />
      </view>

      <view class="form-item">
        <text class="form-label">
          <text class="required">*</text>
          预算范围
        </text>
        <picker mode="selector" :range="budgetOptions" @change="onBudgetChange">
          <view class="form-picker">
            <text :class="form.budgetRange ? '' : 'picker-placeholder'">
              {{ form.budgetRange || '请选择预算范围' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">
          <text class="required">*</text>
          期望交付时间
        </text>
        <picker mode="date" @change="onDateChange" :start="today">
          <view class="form-picker">
            <text :class="form.expectedDeliveryTime ? '' : 'picker-placeholder'">
              {{ form.expectedDeliveryTime || '请选择期望交付时间' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea class="form-textarea" placeholder="其他需要说明的信息（选填）" v-model="form.remark" maxlength="500" />
      </view>

      <view class="divider"></view>
      <view class="form-section-title">联系信息</view>

      <view class="form-item">
        <text class="form-label">联系人姓名</text>
        <input class="form-input" placeholder="请输入您的姓名" v-model="form.submitterName" maxlength="50" />
      </view>

      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input class="form-input" placeholder="请输入您的手机号" v-model="form.submitterPhone" type="number" maxlength="20" />
      </view>
    </view>

    <view class="submit-section">
      <button class="submit-btn" @tap="submitForm">✅ 提交需求</button>
    </view>

    <view class="tips">
      <text class="tips-text">提交后我们的专业团队将在1-3个工作日内与您联系</text>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

const Data = reactive({
  form: {
    title: '',
    functionalAppeal: '',
    targetAudience: '',
    dosageFormPreference: '',
    budgetRange: '',
    expectedDeliveryTime: '',
    remark: '',
    submitterName: '',
    submitterPhone: ''
  },
  budgetOptions: ['50000以下', '50000-100000', '100000-200000', '200000-500000', '500000以上'],
  today: ''
})

const { form, budgetOptions, today } = toRefs(Data)

onLoad(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  Data.today = `${year}-${month}-${day}`
})

const onBudgetChange = (e) => {
  const { value } = e.detail
  Data.form.budgetRange = Data.budgetOptions[value]
}

const onDateChange = (e) => {
  const { value } = e.detail
  Data.form.expectedDeliveryTime = value
}

const validateForm = () => {
  const requiredFields = [
    { field: 'title', label: '需求标题' },
    { field: 'functionalAppeal', label: '功能诉求' },
    { field: 'targetAudience', label: '目标人群' },
    { field: 'budgetRange', label: '预算范围' },
    { field: 'expectedDeliveryTime', label: '期望交付时间' }
  ]
  for (const item of requiredFields) {
    if (!Data.form[item.field] || Data.form[item.field].trim() === '') {
      uni.showToast({
        title: `请填写${item.label}`,
        icon: 'none'
      })
      return false
    }
  }
  return true
}

const submitForm = () => {
  if (!validateForm()) {
    return
  }
  uni.showLoading({
    title: '提交中...'
  })
  http.request({
    url: '/mall4cloud_platform/demand/submit',
    method: 'POST',
    data: Data.form
  }).then((res) => {
    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }).catch(() => {
    uni.hideLoading()
  })
}
</script>

<style lang="scss" scoped>
@use "demand-submit";
</style>
