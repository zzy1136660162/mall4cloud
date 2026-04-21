<template>
  <view class="page-register">
    <view class="register-hero">
      <view class="hero-title">创建账号</view>
      <view class="hero-desc">设置登录信息后即可进入杰东优选平台</view>
    </view>

    <view class="register-card">
      <view class="tab">
        <view class="item active">
          注册
        </view>
        <view
          class="item"
          @tap="toLogin"
        >
          登录
        </view>
      </view>

      <!-- 设置密码 -->
      <view class="con">
        <view class="field-group">
          <view class="field-label">账户名称</view>
          <view :class="['item', { 'has-error': errors.userName }]">
            <input
              v-model="userName"
              type="text"
              class="text"
              maxlength="16"
              placeholder="4-16位字母、数字或下划线"
              placeholder-class="input-placeholder"
              @input="onFieldInput('userName')"
              @blur="validateField('userName')"
            >
          </view>
          <view
            v-if="errors.userName"
            class="error"
          >
            <text class="error-icon">!</text>{{ errors.userName }}
          </view>
        </view>

        <view class="field-group">
          <view class="field-label">登录密码</view>
          <view :class="['item', { 'has-error': errors.password }]">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="text"
              maxlength="20"
              placeholder="请输入登录密码"
              placeholder-class="input-placeholder"
              @input="onFieldInput('password')"
              @blur="validateField('password')"
            >
            <view class="field-action" @tap="togglePassword">
              {{ showPassword ? '隐藏' : '显示' }}
            </view>
          </view>
          <view class="password-rules">
            <text :class="['rule', { pass: passwordLengthValid }]">6-20位</text>
            <text :class="['rule', { pass: passwordMixValid }]">至少两种字符</text>
            <text :class="['rule', { pass: passwordHalfWidthValid }]">半角字符</text>
          </view>
          <view
            v-if="errors.password"
            class="error"
          >
            <text class="error-icon">!</text>{{ errors.password }}
          </view>
        </view>

        <view class="field-group">
          <view class="field-label">确认密码</view>
          <view :class="['item', { 'has-error': errors.confirmPwd }]">
            <input
              v-model="confirmPwd"
              :type="showConfirmPwd ? 'text' : 'password'"
              class="text"
              maxlength="20"
              placeholder="请再次输入密码"
              placeholder-class="input-placeholder"
              @input="onFieldInput('confirmPwd')"
              @blur="validateField('confirmPwd')"
            >
            <view class="field-action" @tap="toggleConfirmPwd">
              {{ showConfirmPwd ? '隐藏' : '显示' }}
            </view>
          </view>
          <view
            v-if="errors.confirmPwd"
            class="error"
          >
            <text class="error-icon">!</text>{{ errors.confirmPwd }}
          </view>
        </view>

        <view
          v-if="submitError"
          class="submit-error"
        >
          {{ submitError }}
        </view>

        <view
          class="btn register-btn"
          :class="{ disabled: submitting }"
          @tap="getRegister"
        >
          {{ submitting ? '注册中...' : '立即注册' }}
        </view>
      </view>
    </view>

    <!-- 注册成功 -->
    <view
      class="popup-min"
      :class="{ 'show': isShowSuccessPopup }"
    >
      <view class="popup-mask" />
      <view class="popup-con-middle register-success">
        <view class="img" />
        <view class="text">
          恭喜您注册成功
        </view>
        <view class="des">
          正在进入首页 {{ loCount }}s
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, reactive } from 'vue'
import Wechat from '../../utils/wechat.js'

const Data = reactive({
  isWechat: false, // 是否为微信环境
  isSetInfo: false, // 设置信息
  isShowSuccessPopup: false, // 注册成功弹窗
  password: '', // 密码
  confirmPwd: '', // 确认密码
  nickName: '', // 昵称
  userName: '', // 用户名
  showPassword: false,
  showConfirmPwd: false,
  submitting: false,
  submitError: '',
  errors: {
    userName: '',
    password: '',
    confirmPwd: ''
  },

  errorTips: 0, // 输入错误提示

  registerType: 0, // 注册方式 0.直接注册
  tempUid: '', // 当账户未绑定时，临时的uid

  // 完成跳转首页倒计时
  loRedirectTimer: null,
  loTimer: null,
  loCount: 0
})
const {
  isShowSuccessPopup,
  password,
  confirmPwd,
  userName,
  showPassword,
  showConfirmPwd,
  submitting,
  submitError,
  errors,
  loCount
} = toRefs(Data)

const passwordLengthValid = computed(() => Data.password.length >= 6 && Data.password.length <= 20)
const passwordHalfWidthValid = computed(() => !!Data.password && /^[\x21-\x7E]*$/.test(Data.password))
const passwordMixValid = computed(() => {
  const types = [
    /[A-Za-z]/.test(Data.password),
    /\d/.test(Data.password),
    /[^A-Za-z0-9]/.test(Data.password)
  ]
  return types.filter(Boolean).length >= 2
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

const setFieldError = (field, message) => {
  Data.errors[field] = message
  return !message
}

const validateField = (field) => {
  const userName = Data.userName.trim()
  const validators = {
    userName: () => {
      if (!userName) {
        return setFieldError('userName', '请设置账户名称')
      }
      if (!util.checkUserName(userName)) {
        return setFieldError('userName', '账号需为4-16位字母、数字或下划线，且不能为纯数字')
      }
      return setFieldError('userName', '')
    },
    password: () => {
      if (!Data.password) {
        return setFieldError('password', '请设置登录密码')
      }
      if (!passwordLengthValid.value || !passwordHalfWidthValid.value || !passwordMixValid.value) {
        return setFieldError('password', '密码需为6-20位半角字符，且至少包含字母、数字、符号中的两种')
      }
      return setFieldError('password', '')
    },
    confirmPwd: () => {
      if (!Data.confirmPwd) {
        return setFieldError('confirmPwd', '请再次输入密码')
      }
      if (Data.confirmPwd !== Data.password) {
        return setFieldError('confirmPwd', '两次输入的密码不一致')
      }
      return setFieldError('confirmPwd', '')
    }
  }
  return validators[field] ? validators[field]() : true
}

const onFieldInput = (field) => {
  Data.submitError = ''
  if (Data.errors[field]) {
    Data.errors[field] = ''
  }
  if (field === 'password' && Data.errors.confirmPwd) {
    Data.errors.confirmPwd = ''
  }
}

const validate = () => {
  Data.userName = Data.userName.trim()
  const results = ['userName', 'password', 'confirmPwd'].map(validateField)
  const isValid = results.every(Boolean)
  if (!isValid) {
    const firstError = Data.errors.userName || Data.errors.password || Data.errors.confirmPwd
    uni.showToast({
      title: firstError,
      icon: 'none'
    })
  }
  return isValid
}

const togglePassword = () => {
  Data.showPassword = !Data.showPassword
}

const toggleConfirmPwd = () => {
  Data.showConfirmPwd = !Data.showConfirmPwd
}

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

// 去登录
const toLogin = () => {
  uni.redirectTo({
    url: '/pages/login/login'
  })
}

// 注册
const getRegister = () => {
  if (Data.submitting) return
  const isvalid = validate()
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
      userName: Data.userName, // 昵称
      password: Data.password, // 密码
      tempUid: Data.tempUid // 当账户未绑定时，临时的uid
    }
  }
  http.request(params).then((res) => {
    clearSuccessTimer()
    Data.isShowSuccessPopup = true
    uni.setStorageSync('cloudToken', res.accessToken)
    uni.setStorageSync('cloudLoginResult', res) // 保存整个登录数据
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
  background: linear-gradient(180deg, #fff5f6 0%, #ffffff 42%, #f7f8fa 100%);
  box-sizing: border-box;
  padding: 0 32rpx calc(48rpx + env(safe-area-inset-bottom));

  .register-hero {
    padding: 96rpx 8rpx 36rpx;
  }

  .hero-title {
    font-size: 52rpx;
    line-height: 1.2;
    font-weight: 700;
    color: #1f1f1f;
  }

  .hero-desc {
    margin-top: 16rpx;
    font-size: 28rpx;
    line-height: 1.5;
    color: #777;
  }

  .register-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 36rpx 28rpx 44rpx;
    box-shadow: 0 16rpx 48rpx rgba(252, 27, 53, 0.08);
    box-sizing: border-box;
  }

  .tab {
    padding: 0 0 44rpx;
  }

  .tab .item {
    color: #999;
  }

  .tab .item.active {
    color: #1f1f1f;
    font-size: 44rpx;
  }

  .con {
    padding: 0;
  }

  .field-group {
    margin-bottom: 28rpx;
  }

  .field-label {
    margin-bottom: 14rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
  }

  .con .item {
    margin-top: 0;
    min-height: 92rpx;
    padding: 0 24rpx;
    background: #f8f8f8;
    border: 2rpx solid transparent;
    border-radius: 12rpx;
    box-sizing: border-box;
  }

  .con .item.has-error {
    background: #fff7f7;
    border-color: rgba(252, 27, 53, 0.35);
  }

  .con .item .text {
    height: 92rpx;
    line-height: 92rpx;
    font-size: 28rpx;
    margin-right: 16rpx;
  }

  .field-action {
    min-width: 64rpx;
    font-size: 26rpx;
    color: #fc1b35;
    text-align: right;
  }

  .password-rules {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 14rpx;
  }

  .rule {
    padding: 6rpx 14rpx;
    border-radius: 8rpx;
    background: #f1f1f1;
    color: #999;
    font-size: 22rpx;
  }

  .rule.pass {
    background: rgba(25, 190, 107, 0.12);
    color: #18a058;
  }

  .error {
    margin-top: 12rpx;
    font-size: 24rpx;
  }

  .submit-error {
    margin-top: 8rpx;
    padding: 18rpx 22rpx;
    color: #fc1b35;
    background: #fff0f2;
    border-radius: 12rpx;
    font-size: 24rpx;
    line-height: 1.4;
  }

  .con .register-btn {
    margin-top: 44rpx;
    border-radius: 12rpx;
    background: linear-gradient(135deg, #fc1b35 0%, #ff6b4a 100%);
    box-shadow: 0 12rpx 28rpx rgba(252, 27, 53, 0.24);
  }

  .con .register-btn.disabled {
    opacity: 0.65;
  }

  .popup-con-middle.register-success {
    border-radius: 24rpx;
  }
}
</style>
