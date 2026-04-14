<template>
  <view class="page">
    <view class="header-bg">
      <view class="header-content">
        <view class="header-icon">🎁</view>
        <view class="header-title">免费申请样品</view>
        <view class="header-subtitle">申请成功后商家将免费寄送样品</view>
      </view>
    </view>

    <view class="card products-card">
      <view class="card-header">
        <view class="header-left">
          <text class="required">*</text>
          <text class="card-title">申请商品</text>
        </view>
        <text class="card-subtitle">{{ selectedProducts.length }}件商品</text>
      </view>

      <view class="products-list">
        <view class="product-item" v-for="item in selectedProducts" :key="item.id">
          <view class="product-image-wrap">
            <image class="product-image" :src="util.getImgUrl(item.image)" mode="aspectFill" />
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-meta">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="product-commission">佣金{{ item.commissionRate }}%</text>
            </view>
          </view>
          <view class="product-remove" @tap="removeProduct(item.id)">
            <text class="remove-icon">✕</text>
          </view>
        </view>
      </view>

      <view class="add-product" @tap="addProduct">
        <view class="add-btn">
          <text class="add-icon">+</text>
          <text class="add-text">添加更多商品</text>
        </view>
      </view>
    </view>

    <view class="card info-card">
      <view class="card-header">
        <view class="header-left">
          <text class="required">*</text>
          <text class="card-title">收件信息</text>
        </view>
        <view class="header-right" @tap="selectAddress">
          <text class="select-address">选择地址</text>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="form-list">
        <view class="form-item">
          <view class="form-label">
            <text class="label-icon">👤</text>
            <text class="label-text">收件人</text>
          </view>
          <input class="form-input" placeholder="请输入姓名" v-model="formData.name" />
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="label-icon">📱</text>
            <text class="label-text">手机号</text>
          </view>
          <input class="form-input" placeholder="请输入手机号" type="number" maxlength="11" v-model="formData.phone" />
        </view>

        <view class="form-item" @tap="showRegionPicker">
          <view class="form-label">
            <text class="label-icon">📍</text>
            <text class="label-text">所在地区</text>
          </view>
          <view :class="['picker-value', { placeholder: !formData.regionText }]">
            {{ formData.regionText || '请选择省市区' }}
            <text class="arrow">></text>
          </view>
        </view>

        <view class="form-item address-item">
          <view class="form-label">
            <text class="label-icon">🏠</text>
            <text class="label-text">详细地址</text>
          </view>
          <textarea class="form-textarea" placeholder="请输入街道、门牌号等详细地址" v-model="formData.address" />
        </view>
      </view>
    </view>

    <view class="card remark-card">
      <view class="card-header">
        <view class="header-left">
          <text class="card-title">申请备注</text>
          <text class="optional">（选填）</text>
        </view>
      </view>
      <view class="remark-wrap">
        <textarea class="remark-input" placeholder="如有特殊要求请在此说明，如：希望尽快发货、指定快递等" v-model="formData.remark" maxlength="200" />
        <view class="word-count">{{ formData.remark.length }}/200</view>
      </view>
    </view>

    <view class="card notice-card">
      <view class="card-header">
        <view class="header-left">
          <text class="notice-icon">📋</text>
          <text class="card-title">申请须知</text>
        </view>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(item, index) in notices" :key="index">
          <view class="notice-num">{{ index + 1 }}</view>
          <text class="notice-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <view class="safe-area"></view>
  </view>

  <view class="bottom-bar">
    <view class="bottom-content">
      <view class="total-info">
        <view class="info-item">
          <text class="info-label">已选商品</text>
          <text class="info-value">{{ selectedProducts.length }}件</text>
        </view>
        <view class="info-divider"></view>
        <view class="info-item">
          <text class="info-label">预计佣金</text>
          <text class="info-value commission">¥{{ totalCommission }}</text>
        </view>
      </view>
      <button :class="['btn-submit', { disabled: !canSubmit }]" @tap="submitApplication">
        <text class="btn-text">提交申请</text>
        <text class="btn-arrow">→</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import selectionApi from '@/utils/api/selection.js'
import util from '@/utils/util.js'

const selectedProducts = ref([])
const spuId = ref(null)
const submitting = ref(false)
const formData = reactive({
  name: '',
  phone: '',
  region: [],
  regionText: '',
  address: '',
  remark: ''
})

const notices = [
  '样品申请需经过审核，审核通过后才会寄出',
  '每个达人每月最多可申请5个样品',
  '收到样品后需在7天内完成测评并发布',
  '样品仅供测评使用，禁止转售',
  '如未按时完成测评，将影响后续样品申请资格'
]

const totalCommission = computed(() => {
  const total = selectedProducts.value.reduce((sum, item) => {
    return sum + parseFloat(item.commissionAmount || 0)
  }, 0)
  return total.toFixed(2)
})

const canSubmit = computed(() => {
  return (
    selectedProducts.value.length > 0 &&
    formData.name.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.address.trim() !== ''
  )
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || currentPage.$page?.options || {}

  const productSpuId = options.spuId
  if (productSpuId) {
    spuId.value = productSpuId
    loadProductInfo(productSpuId)
  }

  loadDefaultAddress()
})

async function loadProductInfo(productSpuId) {
  try {
    const res = await selectionApi.getSelectionDetail(productSpuId)
    if (res) {
      const product = {
        id: res.spuId,
        image: res.mainImgUrl,
        name: res.name,
        price: res.priceFee ? (res.priceFee / 100).toFixed(2) : '0.00',
        commissionRate: res.commissionRate || 0,
        commissionAmount: res.commissionAmount ? (res.commissionAmount / 100).toFixed(2) : '0.00'
      }
      selectedProducts.value = [product]
    }
  } catch (error) {
    uni.showToast({ title: '加载商品信息失败', icon: 'none' })
    console.error('加载商品信息失败', error)
  }
}

function loadDefaultAddress() {
  const address = uni.getStorageSync('cloudDeliveryAddrInfo')
  if (address) {
    formData.name = address.consignee || ''
    formData.phone = address.mobile || ''
    formData.regionText = `${address.province || ''} ${address.city || ''} ${address.district || ''}`
    formData.region = [address.province, address.city, address.district].filter(Boolean)
    formData.address = address.addr || address.addrDetails || ''
  }
}

function removeProduct(id) {
  selectedProducts.value = selectedProducts.value.filter(item => item.id !== id)
}

function addProduct() {
  uni.navigateTo({
    url: '/pages/sample/selection/selection?mode=select'
  })
}

function selectAddress() {
  console.log('selectAddress function called')
  uni.navigateTo({
    url: '/pages/address-list/address-list?type=select',
    events: {
      selectAddress: (address) => {
        console.log('selectAddress event received!')
        console.log('选择的地址数据:', address)
        formData.name = address.consignee || ''
        formData.phone = address.mobile || ''
        formData.regionText = `${address.province || ''} ${address.city || ''} ${address.district || ''}`
        formData.region = [address.province, address.city, address.district].filter(Boolean)
        formData.address = address.addr || address.addrDetails || ''
        console.log('formData after update:', formData)
      }
    },
    success: (res) => {
      console.log('navigateTo success, eventChannel:', res.eventChannel)
    },
    fail: (err) => {
      console.log('navigateTo failed:', err)
    }
  })
}

function showRegionPicker() {
  uni.showToast({
    title: '请使用选择地址功能',
    icon: 'none'
  })
}

function validateForm() {
  if (selectedProducts.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return false
  }
  if (!formData.name.trim()) {
    uni.showToast({ title: '请填写收件人', icon: 'none' })
    return false
  }
  if (!formData.phone.trim()) {
    uni.showToast({ title: '请填写手机号', icon: 'none' })
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return false
  }
  if (!formData.address.trim()) {
    uni.showToast({ title: '请填写收货地址', icon: 'none' })
    return false
  }
  return true
}

function submitApplication() {
  if (!validateForm()) {
    return
  }

  uni.showModal({
    title: '确认提交',
    content: '提交后不可修改，是否确认提交样品申请？',
    success: (res) => {
      if (res.confirm) {
        doSubmit()
      }
    }
  })
}

async function doSubmit() {
  if (submitting.value) return
  submitting.value = true

  uni.showLoading({
    title: '提交中...'
  })

  try {
    const deliveryAddress = formData.regionText ? `${formData.regionText} ${formData.address}` : formData.address

    const res = await selectionApi.submitSelectionApply({
      spuId: spuId.value,
      userName: formData.name,
      contactPhone: formData.phone,
      deliveryAddress: deliveryAddress,
      remark: formData.remark
    })

    uni.hideLoading()

    if (res && res.applyId) {
      uni.showToast({
        title: '申请成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.msg || '申请失败',
      icon: 'none'
    })
    console.error('提交申请失败', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(180deg, #fff8f5 0%, #f5f5f5 200rpx);
  min-height: 100vh;
  padding-bottom: 160rpx;
}

.header-bg {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa94d 100%);
  padding: 40rpx 30rpx 60rpx;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.header-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12rpx;
}

.header-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.card {
  background: #fff;
  border-radius: 24rpx;
  margin: -30rpx 24rpx 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.header-left {
  display: flex;
  align-items: center;
}

.required {
  color: #ff4757;
  font-size: 28rpx;
  margin-right: 8rpx;
  font-weight: bold;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  font-size: 26rpx;
  color: #999;
}

.optional {
  font-size: 24rpx;
  color: #999;
  margin-left: 12rpx;
  font-weight: normal;
}

.header-right {
  display: flex;
  align-items: center;
}

.select-address {
  font-size: 26rpx;
  color: #ff6b35;
}

.products-list {
  margin-bottom: 20rpx;
}

.product-item {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #f0f0f0;
}

.product-image-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-right: 20rpx;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.product-price {
  font-size: 30rpx;
  color: #ff4757;
  font-weight: bold;
}

.product-commission {
  font-size: 22rpx;
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.product-remove {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 50%;
  margin-left: 16rpx;
}

.remove-icon {
  font-size: 24rpx;
  color: #ff4757;
  font-weight: bold;
}

.add-product {
  padding-top: 10rpx;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border: 2rpx dashed #ff6b35;
  border-radius: 16rpx;
  background: rgba(255, 107, 53, 0.03);
}

.add-icon {
  font-size: 32rpx;
  color: #ff6b35;
  margin-right: 12rpx;
  font-weight: bold;
}

.add-text {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: 500;
}

.form-list {
  background: #fff;
}

.form-item {
  display: flex;
  align-items: flex-start;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 180rpx;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.label-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.label-text {
  font-size: 28rpx;
  color: #666;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 44rpx;
  line-height: 44rpx;
}

.picker-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 44rpx;
  line-height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-value.placeholder {
  color: #999;
}

.arrow {
  font-size: 28rpx;
  color: #ccc;
  margin-left: 8rpx;
}

.address-item {
  flex-direction: column;
}

.address-item .form-label {
  margin-bottom: 16rpx;
}

.form-textarea {
  width: 100%;
  font-size: 28rpx;
  color: #333;
  height: 120rpx;
  line-height: 1.5;
  padding: 16rpx;
  background: #fafafa;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.remark-wrap {
  position: relative;
}

.remark-input {
  width: 100%;
  height: 160rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  padding: 20rpx;
  background: #fafafa;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.word-count {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  font-size: 22rpx;
  color: #999;
  background: rgba(255, 255, 255, 0.8);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.notice-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.notice-list {
  background: linear-gradient(135deg, #fff9f7 0%, #fff5f0 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 107, 53, 0.1);
}

.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-num {
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #ff6b35, #ff8c42);
  color: #fff;
  font-size: 22rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.notice-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.safe-area {
  height: 40rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.bottom-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.info-value {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.info-value.commission {
  color: #ff4757;
}

.info-divider {
  width: 1rpx;
  height: 40rpx;
  background: #eee;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.3);
}

.btn-submit.disabled {
  background: #ccc;
  box-shadow: none;
}

.btn-text {
  margin-right: 8rpx;
}

.btn-arrow {
  font-size: 28rpx;
}
</style>
