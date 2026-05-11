<template>
    <!-- 个人中心页 -->
    <view class="mine-container">
        <!-- 用户信息卡片 -->
        <view class="header">
            <view class="user-card">
                <!-- 已登录状态 -->
                <view v-if="isLogin" class="user-info">
                    <image class="avatar" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" mode="aspectFill"></image>
                    <view class="user-detail">
                        <text class="nickname">{{ userInfo.nickname || '微信用户' }}</text>
                        <text class="user-id">{{ userInfo.phone || '' }}</text>
                        <view class="member-badge" @tap="goToMemberCenter">
                            <text class="badge-icon">👤</text>
                            <text class="badge-text">{{ userInfo.memberLevelName || '普通用户' }}</text>
                            <text class="badge-arrow">></text>
                        </view>
                    </view>
                </view>
                <!-- 未登录状态 -->
                <view v-else class="user-info not-login" @tap="goToLogin">
                    <image class="avatar avatar-default" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" mode="aspectFill"></image>
                    <view class="user-detail">
                        <text class="nickname">未登录</text>
                        <text class="login-tip">点击登录，享受更多服务</text>
                        <view class="login-btn-small" @tap="goToLogin">
                            <text class="login-btn-text">立即登录</text>
                            <text class="login-btn-arrow">></text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 订单区域 -->
        <view class="order-section">
            <view class="order-header">
                <text class="order-title">我的订单</text>
                <text class="order-all" @tap="goToOrderList" data-status="">全部 ></text>
            </view>
            <view class="order-grid">
                <view class="order-item" @tap="checkLoginAndGo" data-url="order" data-status="pending">
                    <view class="order-icon-container">
                        <text class="order-icon">💳</text>
                        <view v-if="isLogin && orderCount.pending > 0" class="order-badge">{{ orderCount.pending }}</view>
                    </view>
                    <text class="order-name">待付款</text>
                </view>
                <view class="order-item" @tap="checkLoginAndGo" data-url="order" data-status="shipped">
                    <view class="order-icon-container">
                        <text class="order-icon">📦</text>
                        <view v-if="isLogin && orderCount.shipped > 0" class="order-badge">{{ orderCount.shipped }}</view>
                    </view>
                    <text class="order-name">待发货</text>
                </view>
                <view class="order-item" @tap="checkLoginAndGo" data-url="order" data-status="received">
                    <view class="order-icon-container">
                        <text class="order-icon">🚚</text>
                        <view v-if="isLogin && orderCount.received > 0" class="order-badge">{{ orderCount.received }}</view>
                    </view>
                    <text class="order-name">待收货</text>
                </view>
                <view class="order-item" @tap="checkLoginAndGo" data-url="order" data-status="refund">
                    <view class="order-icon-container">
                        <text class="order-icon">🔄</text>
                        <view v-if="isLogin && orderCount.refund > 0" class="order-badge">{{ orderCount.refund }}</view>
                    </view>
                    <text class="order-name">退款/售后</text>
                </view>
            </view>
        </view>

        <!-- 常用功能区域 -->
        <view class="common-functions">
            <text class="function-title">常用功能</text>
            <view class="function-grid">
                <view class="func-item" @tap="goToTalentCenterDirect" data-url="talent">
                    <text class="func-icon">👤</text>
                    <text class="func-name">达人中心</text>
                    <text class="func-subtitle">申请成为达人</text>
                </view>
                <view class="func-item" @tap="checkLoginAndGo" data-url="sample">
                    <text class="func-icon">📦</text>
                    <text class="func-name">样品申请</text>
                    <text class="func-subtitle">测试体验</text>
                </view>
                <view class="func-item" @tap="goToRNDemandDirect" data-url="rnd">
                    <text class="func-icon">🔬</text>
                    <text class="func-name">研发需求</text>
                    <text class="func-subtitle">定制研发</text>
                </view>
            </view>
        </view>

        <!-- 底部功能列表 -->
        <view class="bottom-functions">
            <view class="bottom-item" @tap="checkLoginAndGo" data-url="address">
                <text class="bottom-icon">📍</text>
                <text class="bottom-text">收货地址</text>
                <text class="bottom-arrow">></text>
            </view>
            <view class="bottom-item" @tap="goToCustomerService">
                <text class="bottom-icon">💬</text>
                <text class="bottom-text">联系客服</text>
                <text class="bottom-arrow">></text>
            </view>
            <view class="bottom-item" @tap="goToSettings">
                <text class="bottom-icon">⚙️</text>
                <text class="bottom-text">设置</text>
                <text class="bottom-arrow">></text>
            </view>
            <!-- 退出登录按钮（仅登录时显示） -->
            <view v-if="isLogin" class="bottom-item logout-item" @tap="handleLogout">
                <text class="bottom-icon">🚪</text>
                <text class="bottom-text logout-text">退出登录</text>
                <text class="bottom-arrow">></text>
            </view>
        </view>
    </view>
</template>

<script>
// 个人中心页
const { api } = require('../../utils/api.js');
const user = require('../../utils/user.js');
export default {
    data() {
        return {
            isLogin: false,
            userInfo: {
                nickname: '',
                avatar: '',
                phone: '',
                isMember: false,
                memberLevel: null,
                memberLevelName: '普通用户',
                isTalent: false,
                talentStatus: null,
                id: ''
            },
            orderCount: {
                pending: 0,
                shipped: 0,
                received: 0,
                refund: 0
            },
            showUpgradeNotice: false
        };
    },
    onLoad() {
        this.checkLoginStatus();
    },
    onShow() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            const isLogin = user.isLogin();
            this.setData({
                isLogin
            });
            if (isLogin) {
                this.loadUserInfo();
                this.loadOrderCount();
            } else {
                this.setData({
                    userInfo: {
                        nickname: '',
                        avatar: '',
                        phone: '',
                        isMember: false,
                        memberLevel: null,
                        memberLevelName: '普通用户',
                        isTalent: false,
                        talentStatus: null,
                        id: ''
                    },
                    orderCount: {
                        pending: 0,
                        shipped: 0,
                        received: 0,
                        refund: 0
                    }
                });
            }
        },

        async loadUserInfo() {
            try {
                const userInfo = await api.get('/api/user/info');
                this.setData({
                    userInfo: {
                        ...userInfo,
                        nickname: userInfo.nickname || '微信用户',
                        memberLevelName: userInfo.memberLevel?.levelName || (userInfo.isMember ? 'VIP会员' : '普通用户')
                    }
                });
                user.setUserInfo(userInfo);
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载用户信息失败:', error);
                if (error.message === '登录已过期') {
                    this.checkLoginStatus();
                }
            }
        },

        async loadOrderCount() {
            try {
                const res = await api.get('/api/sp/order/count');
                if (res.code === 200) {
                    this.setData({
                        orderCount: res.data
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载订单数量失败:', error);
            }
        },

        goToLogin() {
            uni.navigateTo({
                url: '/pages/login/index?redirect=' + encodeURIComponent('/pages/mine/index')
            });
        },

        checkLoginAndGo(e) {
            const { url, status } = e.currentTarget.dataset;

            // rnd 不需要登录验证
            if (url === 'rnd') {
                this.goToRNDemand();
                return;
            }
            if (!this.isLogin) {
                // 如果是订单页面，保存状态参数用于登录后跳转
                if (url === 'order') {
                    let redirectUrl = '/pages/sp_My_orders_page/sp_My_orders_page';
                    if (status) {
                        const statusMap = {
                            pending: 'PENDING_PAY',
                            shipped: 'PAID',
                            received: 'SHIPPED',
                            refund: 'CANCELLED'
                        };
                        if (statusMap[status]) {
                            redirectUrl += `?tab=${statusMap[status]}`;
                        }
                    }
                    uni.navigateTo({
                        url: '/pages/login/index?redirect=' + encodeURIComponent(redirectUrl)
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/login/index'
                    });
                }
                return;
            }
            switch (url) {
                case 'order':
                    this.goToOrderList(e);
                    break;
                case 'talent':
                    this.goToTalentCenter();
                    break;
                case 'sample':
                    this.goToSampleApplication();
                    break;
                case 'address':
                    this.goToAddress();
                    break;
                case 'cart':
                    this.goToCart();
                    break;
            }
        },

        handleLogout() {
            user.logout(() => {
                this.setData({
                    isLogin: false,
                    userInfo: {
                        nickname: '',
                        avatar: '',
                        phone: '',
                        isMember: false,
                        memberLevel: null,
                        memberLevelName: '普通用户',
                        isTalent: false,
                        talentStatus: null,
                        id: ''
                    }
                });
            });
        },

        goBack() {
            uni.switchTab({
                url: '/pages/index/index'
            });
        },

        goToMemberCenter() {
            if (!this.isLogin) {
                this.goToLogin();
                return;
            }
            uni.navigateTo({
                url: '/pages/member/center/index'
            });
        },

        goToCart() {
            if (!this.isLogin) {
                this.goToLogin();
                return;
            }
            uni.navigateTo({
                url: '/pages/sp_Cart_page/sp_Cart_page'
            });
        },

        goToOrderList(e) {
            const status = e.currentTarget.dataset.status;
            let url = '/pages/sp_My_orders_page/sp_My_orders_page';

            // 映射状态参数
            const statusMap = {
                pending: 'PENDING_PAY',
                // 待付款
                shipped: 'PAID',
                // 待发货（已付款）
                received: 'SHIPPED',
                // 待收货（已发货）
                refund: 'REFUND' // 退款/售后
            };

            if (status && statusMap[status]) {
                url += `?tab=${statusMap[status]}`;
            } else if (status && status === 'refund') {
                // 退款/售后暂时使用已取消的筛选
                url += `?tab=CANCELLED`;
            }
            uni.navigateTo({
                url
            });
        },

        goToFavorites() {
            uni.navigateTo({
                url: '/pages/favorites/index'
            });
        },

        goToHistory() {
            uni.navigateTo({
                url: '/pages/history/index'
            });
        },

        goToComments() {
            uni.navigateTo({
                url: '/pages/comments/index'
            });
        },

        goToCustomer() {
            uni.navigateTo({
                url: '/pages/customer/index'
            });
        },

        goToMemberCard() {
            uni.navigateTo({
                url: '/pages/member/card/index'
            });
        },

        goToDynamicCode() {
            uni.navigateTo({
                url: '/pages/dynamic/code/index'
            });
        },

        goToMyGroup() {
            uni.navigateTo({
                url: '/pages/group/my/index'
            });
        },

        goToMyProject() {
            uni.navigateTo({
                url: '/pages/project/my/index'
            });
        },

        goToSignIn() {
            uni.navigateTo({
                url: '/pages/signin/index'
            });
        },

        goToMaterial() {
            uni.navigateTo({
                url: '/pages/material/index'
            });
        },

        goToActivity() {
            uni.navigateTo({
                url: '/pages/activity/index'
            });
        },

        goToMore() {
            uni.navigateTo({
                url: '/pages/more/index'
            });
        },

        goToSettings() {
            uni.navigateTo({
                url: '/pages/settings/index'
            });
        },

        goToTalentCenter() {
            uni.navigateTo({
                url: '/pages/talent/center/index'
            });
        },

        goToTalentCenterDirect() {
            uni.navigateTo({
                url: '/pages/talent/center/index'
            });
        },

        goToSampleApplication() {
            uni.navigateTo({
                url: '/pages/sample/application/index'
            });
        },

        goToRNDemand() {
            uni.switchTab({
                url: '/pages/rd_index/rd_index'
            });
        },

        goToRNDemandDirect() {
            const token = uni.getStorageSync('token');
            if (!token) {
                uni.showToast({
                    title: '请先登录',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/login/index?redirect=' + encodeURIComponent('/pages/rd_index/rd_index')
                    });
                }, 1500);
                return;
            }
            uni.switchTab({
                url: '/pages/rd_index/rd_index'
            });
        },

        goToAddress() {
            uni.navigateTo({
                url: '/pages/sp_Address_page/sp_Address_page'
            });
        },

        goToCustomerService() {
            uni.navigateTo({
                url: '/pages/chat/chat'
            });
        }
    }
};
</script>
<style>
/* 个人中心页样式 */
.mine-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 40rpx;
}

/* 顶部导航 */
.header {
    background: linear-gradient(to bottom, #fe944dff 0%, #ffffffff 100%);
    padding-bottom: 120rpx;
}

.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 30rpx 20rpx;
}

.back-icon,
.setting-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-home,
.icon-setting {
    font-size: 40rpx;
    color: #fff;
}

.header-title {
    font-size: 36rpx;
    color: #fff;
    font-weight: 500;
}

/* 用户信息卡片 */
.user-card {
    padding: 20rpx 30rpx 0;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-info.not-login {
    cursor: pointer;
}

.avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
    margin-right: 24rpx;
}

.avatar-default {
    opacity: 0.7;
    background: #f0f0f0;
}

.user-detail {
    flex: 1;
}

.nickname {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10rpx;
}

.user-id {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
}

/* 未登录状态样式 */
.login-tip {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 16rpx;
}

.login-btn-small {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 12rpx 28rpx;
    border-radius: 30rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.4);
}

.login-btn-text {
    font-size: 26rpx;
    color: #fff;
    font-weight: 500;
}

.login-btn-arrow {
    font-size: 24rpx;
    color: #fff;
    margin-left: 8rpx;
}

.member-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(139, 90, 0, 0.8);
    padding: 10rpx 24rpx;
    border-radius: 30rpx;
    margin-top: 10rpx;
}

.badge-icon {
    font-size: 28rpx;
    margin-right: 6rpx;
}

.badge-text {
    font-size: 26rpx;
    color: #fff;
    font-weight: 500;
}

.badge-arrow {
    font-size: 24rpx;
    color: #fff;
    margin-left: 8rpx;
}

/* 订单区域 */
.order-section {
    margin: -110rpx 20rpx 20rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.order-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.order-all {
    font-size: 28rpx;
    color: #999;
}

.order-grid {
    display: flex;
    justify-content: space-around;
}

.order-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx;
}

.order-icon-container {
    position: relative;
    margin-bottom: 12rpx;
}

.order-icon {
    font-size: 52rpx;
}

.order-badge {
    position: absolute;
    top: -10rpx;
    right: -15rpx;
    background: #ff4d4f;
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-name {
    font-size: 26rpx;
    color: #333;
}

/* 常用功能区域 */
.common-functions {
    margin: 20rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.function-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
}

.function-grid {
    display: flex;
    justify-content: space-around;
}

.func-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx;
    flex: 1;
}

.func-icon {
    font-size: 56rpx;
    margin-bottom: 12rpx;
}

.func-name {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 6rpx;
}

.func-subtitle {
    font-size: 24rpx;
    color: #999;
}

/* 底部功能列表 */
.bottom-functions {
    margin: 20rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.bottom-item {
    display: flex;
    align-items: center;
    padding: 30rpx 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.bottom-item:last-child {
    border-bottom: none;
}

.bottom-icon {
    font-size: 36rpx;
    margin-right: 20rpx;
    color: #666;
}

.bottom-text {
    flex: 1;
    font-size: 30rpx;
    color: #333;
}

.bottom-arrow {
    font-size: 28rpx;
    color: #999;
}

/* 退出登录按钮样式 */
.logout-item {
    border-top: 8rpx solid #f5f5f5;
}

.logout-text {
    color: #ff4d4f;
}
</style>
