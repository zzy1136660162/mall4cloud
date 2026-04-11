<template>
    <!-- 登录页面 -->
    <view class="login-container">
        <!-- 顶部装饰 -->
        <view class="header-decoration">
            <view class="circle circle-1"></view>
            <view class="circle circle-2"></view>
        </view>

        <!-- Logo 区域 -->
        <view class="logo-section">
            <image class="logo" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" mode="aspectFit"></image>
            <text class="app-name">链动商城</text>
            <text class="app-slogan">品质生活，从这里开始</text>
        </view>

        <!-- 登录表单 -->
        <view class="login-form">
            <view class="form-item">
                <text class="input-icon">📱</text>
                <input class="input-field" type="number" placeholder="请输入手机号" maxlength="11" :value="phone" @input="onPhoneInput" />
            </view>

            <view class="form-item">
                <text class="input-icon">🔐</text>
                <input class="input-field code-input" type="number" placeholder="请输入验证码" placeholder-class="placeholder" maxlength="6" :value="code" @input="onCodeInput" />
                <button class="code-btn" @tap="sendCode" :disabled="codeDisabled">
                    {{ codeText }}
                </button>
            </view>

            <button class="login-btn" @tap="handleLogin" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
            </button>

            <view class="agreement">
                <checkbox :checked="agreed" @tap="toggleAgreement" class="agreement-checkbox"></checkbox>
                <text class="agreement-text">我已阅读并同意</text>
                <text class="agreement-link" @tap="goToAgreement">《用户协议》</text>
                <text class="agreement-text">和</text>
                <text class="agreement-link" @tap="goToPrivacy">《隐私政策》</text>
            </view>
        </view>

        <!-- 其他登录方式 -->
        <view class="other-login">
            <view class="divider">
                <view class="divider-line"></view>
                <text class="divider-text">其他登录方式</text>
                <view class="divider-line"></view>
            </view>
            <view class="login-methods">
                <view class="method-item" @tap="wechatLogin">
                    <view class="method-icon-wrapper">
                        <image class="method-icon" src="https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico" mode="aspectFit"></image>
                    </view>
                    <text class="method-name">微信登录</text>
                </view>
            </view>
        </view>

        <!-- 底部提示 -->
        <view class="footer-tip">
            <text>登录即表示您同意我们的</text>
            <text class="footer-link" @tap="goToAgreement">服务条款</text>
            <text class="dot">和</text>
            <text class="footer-link" @tap="goToPrivacy">隐私政策</text>
        </view>
    </view>
</template>

<script>
// 登录页面
const app = getApp();
const { api } = require('../../utils/api');
export default {
    data() {
        return {
            phone: '',
            code: '',
            codeText: '获取验证码',
            codeDisabled: false,
            countdown: 60,
            agreed: false,
            loading: false,
            redirect: ''
        };
    },
    onLoad(options) {
        // 检查是否从其他页面跳转过来
        const redirect = options.redirect || '';
        this.setData({
            redirect
        });
    },
    methods: {
        onPhoneInput(e) {
            this.setData({
                phone: e.detail.value
            });
        },

        onCodeInput(e) {
            this.setData({
                code: e.detail.value
            });
        },

        toggleAgreement() {
            this.setData({
                agreed: !this.agreed
            });
        },

        sendCode() {
            const phone = this.phone;
            if (!phone) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                });
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                });
                return;
            }
            if (this.codeDisabled) {
                return;
            }
            api.post(
                '/api/auth/send-code',
                {
                    phone
                },
                {
                    showLoading: true
                }
            )
                .then((res) => {
                    uni.showToast({
                        title: '验证码已发送',
                        icon: 'success'
                    });
                    this.startCountdown();
                })
                .catch((err) => {
                    console.error('发送验证码失败:', err);
                    uni.showToast({
                        title: '发送失败，请重试',
                        icon: 'none'
                    });
                });
        },

        startCountdown() {
            this.setData({
                codeDisabled: true,
                countdown: 60
            });
            const timer = setInterval(() => {
                const countdown = this.countdown - 1;
                if (countdown <= 0) {
                    clearInterval(timer);
                    this.setData({
                        codeText: '获取验证码',
                        codeDisabled: false,
                        countdown: 60
                    });
                } else {
                    this.setData({
                        codeText: `${countdown}s后重新获取`,
                        countdown: countdown
                    });
                }
            }, 1000);
        },

        handleLogin() {
            const { phone, code, agreed, redirect } = this;
            if (!phone) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                });
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                });
                return;
            }
            if (!code) {
                uni.showToast({
                    title: '请输入验证码',
                    icon: 'none'
                });
                return;
            }
            if (!agreed) {
                uni.showToast({
                    title: '请先同意用户协议',
                    icon: 'none'
                });
                return;
            }
            this.setData({
                loading: true
            });
            api.post(
                '/api/auth/login',
                {
                    phone,
                    code
                },
                {
                    showLoading: true
                }
            )
                .then((res) => {
                    const token = res.token;
                    const userInfo = res.userInfo;
                    const userId = res.userId || (userInfo && userInfo.userId);
                    uni.setStorageSync('token', token);
                    uni.setStorageSync('userInfo', userInfo);
                    uni.setStorageSync('userId', userId);
                    app.globalData.userId = userId;
                    uni.showToast({
                        title: '登录成功',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        const url = decodeURIComponent(redirect);
                        const urlPath = url.split('?')[0];
                        const tabBarPages = [
                            '/pages/mine/index',
                            '/pages/index/index',
                            '/pages/xuanpinindex/xuanpinindex',
                            '/pages/rd_index/rd_index',
                            '/pages/Product_list_page/Product_list_page'
                        ];
                        if (tabBarPages.includes(urlPath)) {
                            uni.switchTab({
                                url
                            });
                        } else if (url.startsWith('/pages')) {
                            const pages = getCurrentPages();
                            let pageExists = false;
                            for (let i = 0; i < pages.length - 1; i++) {
                                if (pages[i].route === urlPath || pages[i].route === urlPath.slice(1)) {
                                    pageExists = true;
                                    break;
                                }
                            }
                            if (pageExists) {
                                uni.navigateBack({
                                    delta: 1
                                });
                            } else {
                                uni.redirectTo({
                                    url
                                });
                            }
                        } else {
                            uni.switchTab({
                                url: '/pages/mine/index'
                            });
                        }
                    }, 1500);
                })
                .catch((err) => {
                    console.error('登录失败:', err);
                    uni.showToast({
                        title: '登录失败，请重试',
                        icon: 'none'
                    });
                })
                .finally(() => {
                    this.setData({
                        loading: false
                    });
                });
        },

        wechatLogin() {
            const { agreed } = this;
            if (!agreed) {
                uni.showToast({
                    title: '请先同意用户协议',
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: '登录中...',
                mask: true
            });

            // 调用微信登录获取 code
            uni.login({
                success: (res) => {
                    if (res.code) {
                        // 获取用户信息
                        this.getWechatUserInfo(res.code);
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            title: '微信登录失败',
                            icon: 'none'
                        });
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '微信登录失败',
                        icon: 'none'
                    });
                }
            });
        },

        getWechatUserInfo(wxCode) {
            // 获取用户信息
            uni.getUserProfile({
                desc: '用于完善用户资料',
                success: (res) => {
                    const userInfo = res.userInfo;
                    this.doWechatLogin(wxCode, userInfo);
                },
                fail: () => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '需要授权才能登录',
                        icon: 'none'
                    });
                }
            });
        },

        doWechatLogin(wxCode, userInfo) {
            const { redirect } = this;
            api.post(
                '/api/auth/wechat-login',
                {
                    code: wxCode,
                    nickname: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    gender: userInfo.gender,
                    country: userInfo.country,
                    province: userInfo.province,
                    city: userInfo.city
                },
                {
                    showLoading: false
                }
            )
                .then((res) => {
                    uni.hideLoading();
                    const { token, userInfo: serverUserInfo, userId } = res;
                    uni.setStorageSync('token', token);
                    uni.setStorageSync('userInfo', serverUserInfo);
                    uni.setStorageSync('userId', userId);
                    app.globalData.userId = userId;
                    uni.showToast({
                        title: '登录成功',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        if (redirect && redirect !== '/pages/login/index') {
                            const url = decodeURIComponent(redirect);
                            if (url.startsWith('/pages')) {
                                const pages = getCurrentPages();
                                const redirectPath = url.split('?')[0];
                                let pageExists = false;
                                for (let i = 0; i < pages.length - 1; i++) {
                                    if (pages[i].route === redirectPath) {
                                        pageExists = true;
                                        break;
                                    }
                                }
                                if (pageExists) {
                                    uni.navigateBack({
                                        delta: 1
                                    });
                                } else {
                                    uni.redirectTo({
                                        url
                                    });
                                }
                            } else {
                                uni.switchTab({
                                    url: '/pages/mine/index'
                                });
                            }
                        } else {
                            uni.switchTab({
                                url: '/pages/mine/index'
                            });
                        }
                    }, 1500);
                })
                .catch((err) => {
                    uni.hideLoading();
                    console.error('微信登录失败:', err);
                    uni.showToast({
                        title: '登录失败，请重试',
                        icon: 'none'
                    });
                });
        },

        goToAgreement() {
            uni.showToast({
                title: '用户协议页面开发中',
                icon: 'none'
            });
        },

        goToPrivacy() {
            uni.showToast({
                title: '隐私政策页面开发中',
                icon: 'none'
            });
        }
    }
};
</script>
<style>
/* 登录页面样式 */
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #fe944d 0%, #ff6b6b 100%);
    padding: 40rpx 30rpx;
    position: relative;
    overflow: hidden;
}

/* 顶部装饰 */
.header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400rpx;
    overflow: hidden;
}

.circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
    width: 300rpx;
    height: 300rpx;
    top: -100rpx;
    right: -50rpx;
}

.circle-2 {
    width: 200rpx;
    height: 200rpx;
    top: 50rpx;
    left: -50rpx;
}

/* Logo 区域 */
.logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0 60rpx;
    position: relative;
    z-index: 1;
}

.logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 6rpx solid rgba(255, 255, 255, 0.3);
    margin-bottom: 24rpx;
    background: #fff;
}

.app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12rpx;
}

.app-slogan {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
}

/* 登录表单 */
.login-form {
    background: #fff;
    border-radius: 32rpx;
    padding: 50rpx 40rpx;
    box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
}

.form-item {
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border-radius: 16rpx;
    padding: 24rpx 30rpx;
    margin-bottom: 24rpx;
}

.input-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
}

.input-field {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    min-width: 0;
}

.code-input {
    flex: 1;
    margin-right: 20rpx;
    min-width: 200rpx;
}

.placeholder {
    color: #999;
}

.code-btn {
    font-size: 26rpx;
    color: #fe944d;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    line-height: 1;
    min-width: 160rpx;
    text-align: right;
}

.code-btn::after {
    border: none;
}

.code-btn[disabled] {
    color: #999;
}

.login-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #fe944d 0%, #ff6b6b 100%);
    border-radius: 48rpx;
    color: #fff;
    font-size: 34rpx;
    font-weight: bold;
    border: none;
    margin-top: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(254, 148, 77, 0.3);
}

.login-btn::after {
    border: none;
}

.login-btn[disabled] {
    opacity: 0.6;
}

/* 协议 */
.agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
    flex-wrap: wrap;
}

.agreement-checkbox {
    margin-right: 10rpx;
    transform: scale(0.8);
}

.agreement-text {
    font-size: 24rpx;
    color: #999;
}

.agreement-link {
    font-size: 24rpx;
    color: #fe944d;
    margin: 0 4rpx;
}

/* 其他登录方式 */
.other-login {
    margin-top: 60rpx;
    position: relative;
    z-index: 1;
}

.divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 40rpx;
}

.divider-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1rpx;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
}

.divider-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
    padding: 0 24rpx;
    letter-spacing: 2rpx;
    background: linear-gradient(135deg, #ff7c60 0%, #ff7862 100%);
    position: relative;
    z-index: 1;
}

.login-methods {
    display: flex;
    justify-content: center;
    gap: 60rpx;
}

.method-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx 48rpx;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 24rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.method-item:active {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0.96);
}

.method-name {
    font-size: 24rpx;
    color: #fff;
    font-weight: 500;
}

.method-icon-wrapper {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.method-icon {
    width: 48rpx;
    height: 48rpx;
}

/* 底部提示 */
.footer-tip {
    position: absolute;
    bottom: 100rpx;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer-tip text {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
}

.footer-tip .dot {
    margin: 0 16rpx;
    color: rgba(255, 255, 255, 0.4);
}

.footer-link {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: underline;
}
</style>
