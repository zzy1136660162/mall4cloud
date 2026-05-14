<template>
  <view class="page-register">
    <view class="register-hero">
      <view class="hero-badge">新账号注册</view>
      <view class="hero-title">创建您的杰东优选账号</view>
      <view class="hero-desc">设置登录信息后即可进入杰东优选平台，继续浏览商品、提交需求和管理订单。</view>
    </view>

    <view class="register-card">
      <view class="card-header">
        <view class="header-title">账号信息</view>
        <view class="header-link" @tap="toLogin">已有账号，去登录</view>
      </view>

      <view class="con">
        <view class="field-group">
          <view class="field-label">账号名称</view>
          <view :class="['item', { 'has-error': errorTips === 4 }]">
            <input
              v-model="userName"
              type="text"
              class="text"
              maxlength="30"
              placeholder="请设置账号名称，建议使用手机号或常用名称"
              placeholder-class="input-placeholder"
              @blur="simpleValidate"
            >
          </view>
          <view v-if="errorTips === 4" class="error">
            <text class="error-icon">!</text>账号长度至少 6 位
          </view>
        </view>

        <view class="field-group">
          <view class="field-label">登录密码</view>
          <view :class="['item', { 'has-error': errorTips === 5 }]">
            <input
              v-model="password"
              type="password"
              class="text"
              maxlength="32"
              password
              placeholder="请设置登录密码"
              placeholder-class="input-placeholder"
              @input="simpleValidate"
              @blur="simpleValidate"
            >
          </view>
          <view class="password-rules">
            <view :class="['rule', { pass: password.length >= 6 }]">不少于 6 位</view>
            <view :class="['rule', { pass: !!password }]">支持字母或数字</view>
          </view>
          <view v-if="errorTips === 5" class="error">
            <text class="error-icon">!</text>密码长度至少 6 位
          </view>
        </view>

        <view class="field-group">
          <view class="field-label">确认密码</view>
          <view :class="['item', { 'has-error': errorTips === 6 || errorTips === 7 }]">
            <input
              v-model="confirmPwd"
              type="password"
              class="text"
              maxlength="32"
              password
              placeholder="请再次输入登录密码"
              placeholder-class="input-placeholder"
              @input="simpleValidate"
              @blur="simpleValidate"
            >
          </view>
          <view v-if="errorTips === 6" class="error">
            <text class="error-icon">!</text>确认密码不能为空
          </view>
          <view v-if="errorTips === 7" class="error">
            <text class="error-icon">!</text>两次输入的密码不一致，请重新确认
          </view>
        </view>

        <view v-if="submitError" class="submit-error">{{ submitError }}</view>

        <view
          :class="['btn', 'register-btn', { disabled: !formReady || submitting }]"
          @tap="getRegister"
        >
          {{ submitting ? '注册中...' : '立即注册' }}
        </view>

        <view class="register-footer">
          <view class="footer-tip">注册成功后将自动登录并跳转首页</view>
        </view>
      </view>
    </view>

    <view class="popup-min" :class="{ show: isShowSuccessPopup }">
      <view class="popup-mask" />
      <view class="popup-con-middle register-success">
        <view class="img" />
        <view class="text">注册成功</view>
        <view class="des">正在进入首页 {{ loCount }}s</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, reactive, toRefs } from 'vue'
import Wechat from '../../utils/wechat.js'

const Data = reactive({
  isWechat: false,
  isSetInfo: false,
  isShowSuccessPopup: false,
  password: '',
  confirmPwd: '',
  nickName: '',
  userName: '',
  submitting: false,
  submitError: '',
  errorTips: 0,
  registerType: 0,
  tempUid: '',
  loRedirectTimer: null,
  loTimer: null,
  loCount: 0
})

const {
  isShowSuccessPopup,
  password,
  confirmPwd,
  userName,
  submitting,
  submitError,
  loCount
} = toRefs(Data)

const formReady = computed(() => {
  return Data.userName.length >= 6 && Data.password.length >= 6 && Data.confirmPwd === Data.password && !!Data.confirmPwd
})

onLoad(() => {
  // #ifdef H5
  Data.isWechat = Wechat.isWechat()
  if (Data.isWechat) {
    Data.registerType = 1
    Data.tempUid = uni.getStorageSync('cloudTempUid')
  }
  // #endif

  // #ifdef MP-WEIXIN
  Data.registerType = 2
  Data.tempUid = uni.getStorageSync('cloudTempUid')
  // #endif
})

onUnmounted(() => {
  clearSuccessTimer()
})

const clearSuccessTimer = () => {
  if (Data.loRedirectTimer) {
    clearTimeout(Data.loRedirectTimer)
    Data.loRedirectTimer = null
  }
  if (Data.loTimer) {
    clearInterval(Data.loTimer)
    Data.loTimer = null
  }
}

const simpleValidate = () => {
  if (!Data.userName || Data.userName.length < 6) {
    Data.errorTips = 4
    return false
  }
  if (!Data.password || Data.password.length < 6) {
    Data.errorTips = 5
    return false
  }
  if (!Data.confirmPwd) {
    Data.errorTips = 6
    return false
  }
  if (Data.confirmPwd !== Data.password) {
    Data.errorTips = 7
    return false
  }
  Data.errorTips = 0
  return true
}

const toLogin = () => {
  uni.redirectTo({
    url: '/pages/login/login'
  })
}

const getRegister = () => {
  if (Data.submitting) return
  const isvalid = simpleValidate()
  if (!isvalid) return

  Data.submitting = true
  Data.submitError = ''
  uni.showLoading({
    title: '注册中...',
    mask: true
  })

  const params = {
    url: '/mall4cloud_user/ua/user/register',
    method: 'POST',
    data: {
      userName: Data.userName,
      password: Data.password,
      tempUid: Data.tempUid
    }
  }

  http.request(params).then((res) => {
    clearSuccessTimer()
    Data.isShowSuccessPopup = true
    uni.setStorageSync('cloudToken', res.accessToken)
    uni.setStorageSync('cloudLoginResult', res)
    Data.loRedirectTimer = setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 3000)
    const loTimeCount = 3
    if (!Data.loTimer) {
      Data.loCount = loTimeCount
      Data.loTimer = setInterval(() => {
        if (Data.loCount > 0 && Data.loCount <= loTimeCount) {
          Data.loCount--
        } else {
          clearInterval(Data.loTimer)
          Data.loTimer = null
        }
      }, 1000)
    }
  }).catch((err) => {
    Data.submitError = err?.msg || '注册失败，请稍后再试'
  }).finally(() => {
    Data.submitting = false
    uni.hideLoading()
  })
}
</script>

<style lang="scss" scoped>
@use "../login/login.scss";
@use "../../popup.scss";

.page-register {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(252, 27, 53, 0.08), transparent 32%),
    linear-gradient(180deg, #fff7f7 0%, #ffffff 38%, #f5f7fb 100%);
  box-sizing: border-box;
  padding: 0 32rpx calc(48rpx + env(safe-area-inset-bottom));

  .register-hero {
    padding: 92rpx 8rpx 36rpx;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    background: rgba(252, 27, 53, 0.08);
    color: #d91e38;
    font-size: 22rpx;
    font-weight: 600;
  }

  .hero-title {
    margin-top: 24rpx;
    font-size: 56rpx;
    line-height: 1.15;
    font-weight: 700;
    color: #1f1f1f;
  }

  .hero-desc {
    margin-top: 18rpx;
    max-width: 620rpx;
    font-size: 28rpx;
    line-height: 1.65;
    color: #6f7785;
  }

  .register-card {
    background: rgba(255, 255, 255, 0.96);
    border: 1rpx solid rgba(255, 255, 255, 0.72);
    border-radius: 24rpx;
    padding: 34rpx 28rpx 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(31, 35, 41, 0.08);
    backdrop-filter: blur(14rpx);
    box-sizing: border-box;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28rpx;
  }

  .header-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #1f1f1f;
  }

  .header-link {
    font-size: 24rpx;
    color: #fc1b35;
  }

  .con {
    padding: 0;
  }

  .field-group + .field-group {
    margin-top: 28rpx;
  }

  .field-label {
    margin-bottom: 14rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #2f3440;
  }

  .con .item {
    margin-top: 0;
    min-height: 96rpx;
    padding: 0 24rpx;
    background: #f6f7f9;
    border: 2rpx solid transparent;
    border-radius: 16rpx;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .con .item.has-error {
    background: #fff6f7;
    border-color: rgba(252, 27, 53, 0.28);
  }

  .con .item .text {
    height: 96rpx;
    line-height: 96rpx;
    font-size: 28rpx;
    color: #1f1f1f;
    margin-right: 12rpx;
  }

  .input-placeholder {
    color: #a0a7b4;
  }

  .password-rules {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 14rpx;
  }

  .rule {
    padding: 6rpx 14rpx;
    border-radius: 10rpx;
    background: #f0f2f5;
    color: #8a93a3;
    font-size: 22rpx;
  }

  .rule.pass {
    background: rgba(24, 160, 88, 0.12);
    color: #198754;
  }

  .error {
    display: flex;
    align-items: center;
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #fc1b35;
    line-height: 1.5;
  }

  .error .error-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28rpx;
    height: 28rpx;
    line-height: 28rpx;
    font-size: 20rpx;
    border-radius: 50%;
    background: #fc1b35;
    color: #fff;
    text-align: center;
    margin-right: 10rpx;
    flex-shrink: 0;
  }

  .submit-error {
    margin-top: 24rpx;
    padding: 18rpx 22rpx;
    color: #d91e38;
    background: #fff1f3;
    border-radius: 14rpx;
    font-size: 24rpx;
    line-height: 1.5;
  }

  .con .register-btn {
    margin-top: 40rpx;
    height: 96rpx;
    line-height: 96rpx;
    border-radius: 16rpx;
    background: linear-gradient(135deg, #fc1b35 0%, #ff7d4d 100%);
    box-shadow: 0 16rpx 36rpx rgba(252, 27, 53, 0.24);
  }

  .con .register-btn.disabled {
    opacity: 0.62;
  }

  .register-footer {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
  }

  .footer-tip {
    font-size: 24rpx;
    color: #8a93a3;
  }

  .popup-con-middle.register-success {
    border-radius: 24rpx;
  }
}
</style>
