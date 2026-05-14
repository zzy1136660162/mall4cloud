<script>
import { AppType } from './utils/constant.js'

const appVersion = import.meta.env.VITE_APP_VERSION || 'dev'

function initMiniProgramUpdate () {
  // #ifdef MP-WEIXIN
  if (!uni.canIUse('getUpdateManager')) {
    return
  }

  const updateManager = uni.getUpdateManager()

  updateManager.onCheckForUpdate(() => {})

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '发现新版本',
      content: `检测到新版本（当前版本：${appVersion}），是否立即重启更新？`,
      confirmText: '立即更新',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本下载失败，请退出小程序后重新进入重试。',
      showCancel: false,
      confirmText: '知道了'
    })
  })
  // #endif
}

export default {
  onLaunch: function () {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif

    // #ifdef H5
    uni.getSystemInfo({
      success: function (res) {
        if (res.platform == 'ios') {
          uni.setStorageSync('cloudIosUrl', window.location.href.split('#')[0])
        }
      }
    })
    // #endif

    // #ifdef MP-WEIXIN
    uni.setStorageSync('cloudAppVersion', appVersion)
    initMiniProgramUpdate()
    // #endif
  },
  onShow: function () {
    // #ifdef H5
    uni.setStorageSync('cloudAppType', 4)
    const ua = navigator.userAgent.toLowerCase()
    if (ua.search(/MicroMessenger/i) > -1) {
      uni.setStorageSync('cloudAppType', 2)
      http.mpAuthLogin()
    }
    if (ua.search(/Alipay/i) > -1) {
      uni.setStorageSync('cloudAppType', 7)
    }
    const state = util.getUrlKey('state')
    const code = util.getUrlKey('code')
    if ((state == 'needCode' || state == 'unNeedCode') && code) {
      let path = window.location.href
      if (path.indexOf('code=') > 0 && path.indexOf('&state=unNeedCode') > -1) {
        http.mpLogin(null, code)
        path = path.substring(0, path.indexOf('code=') - 1)
        history.replaceState({}, '', path)
      }
      http.getCartCount()
    }
    // #endif

    // #ifdef APP-PLUS
    uni.getSystemInfo({
      success: (sysInfo) => {
        if (sysInfo.platform == 'android') {
          uni.setStorageSync('cloudAppType', AppType.ANDROID)
        } else {
          uni.setStorageSync('cloudAppType', AppType.IOS)
        }
      }
    })
    // #endif

    // #ifdef MP-WEIXIN
    uni.setStorageSync('cloudAppType', AppType.MINI)
    // #endif

    // #ifdef MP-ALIPAY
    uni.setStorageSync('cloudAppType', AppType.ALI)
    // #endif
  },
  globalData: {
    requestQueue: [],
    isLanding: false,
    totalCartCount: 0,
    appVersion
  },
  methods: {}
}
</script>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
@import "./app.css";

uni-page-head {
  display: none;
}

uni-swiper .uni-swiper-dots-horizontal {
  bottom: 20px !important;
}
</style>
