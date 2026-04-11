<template>
    <view class="container">
        <!-- 状态卡片 -->
        <view :class="'status-card ' + (application.status === 'pending' ? 'status-pending' : application.status === 'approved' ? 'status-approved' : 'status-rejected')">
            <view class="status-icon">
                <text class="icon-text" v-if="application.status === 'pending'">⏳</text>
                <text class="icon-text" v-if="application.status === 'approved'">✓</text>
                <text class="icon-text" v-if="application.status === 'rejected'">✕</text>
            </view>
            <view class="status-info">
                <text class="status-title">{{ application.statusText }}</text>
                <text class="status-desc">{{ statusDesc }}</text>
            </view>
        </view>

        <!-- 审核备注 -->
        <view class="content-card" v-if="application.reviewRemark">
            <view class="card-header">
                <view class="card-icon remark">💬</view>
                <text class="card-title">审核备注</text>
            </view>
            <view class="card-body">
                <view class="remark-box">
                    <text class="remark-text">{{ application.reviewRemark }}</text>
                    <text class="remark-time" v-if="application.reviewTime">审核时间：{{ application.reviewTime }}</text>
                </view>
            </view>
        </view>

        <!-- 商品信息 -->
        <view class="content-card">
            <view class="card-header">
                <view class="card-icon product">🛍️</view>
                <text class="card-title">申请商品</text>
            </view>
            <view class="card-body">
                <view class="product-list">
                    <view class="product-item" v-for="(item, index) in application.products" :key="index">
                        <image class="product-image" :src="item.image" mode="aspectFill" />

                        <view class="product-info">
                            <text class="product-name">{{ item.name }}</text>
                            <view class="product-meta">
                                <text class="product-price">¥{{ item.price }}</text>
                                <text class="product-commission" v-if="item.commission">佣金{{ item.commission }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 收件信息 -->
        <view class="content-card">
            <view class="card-header">
                <view class="card-icon address">📍</view>
                <text class="card-title">收件信息</text>
            </view>
            <view class="card-body">
                <view class="info-list">
                    <view class="info-item">
                        <text class="info-label">收件人</text>
                        <text class="info-value">{{ application.recipient.name }}</text>
                    </view>
                    <view class="info-item">
                        <text class="info-label">联系电话</text>
                        <text class="info-value">{{ application.recipient.phone }}</text>
                    </view>
                    <view class="info-item">
                        <text class="info-label">收货地址</text>
                        <text class="info-value">
                            {{ application.recipient.province }}{{ application.recipient.city }}{{ application.recipient.district }}{{ application.recipient.address }}
                        </text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 物流信息 -->
        <view class="content-card" v-if="application.shipStatus !== 'not_shipped'">
            <view class="card-header">
                <view class="card-icon shipping">🚚</view>
                <text class="card-title">物流信息</text>
            </view>
            <view class="card-body">
                <view class="shipping-box">
                    <view class="shipping-header">
                        <view class="shipping-company">
                            <view class="company-icon">📦</view>
                            <text class="company-name">{{ application.logisticsCompany || '顺丰速运' }}</text>
                        </view>
                        <view :class="'shipping-status ' + application.shipStatus">{{ application.shipStatusText }}</view>
                    </view>
                    <view class="tracking-row" v-if="application.trackingNo">
                        <text class="tracking-label">物流单号</text>
                        <text class="tracking-no">{{ application.trackingNo }}</text>
                        <text class="copy-btn" @tap="copyTrackingNo">复制</text>
                    </view>
                    <!-- 物流轨迹 -->
                    <view class="timeline" v-if="application.trackingList && application.trackingList.length > 0">
                        <view :class="'timeline-item ' + (index === 0 ? 'active' : '')" v-for="(item, index) in application.trackingList" :key="index">
                            <view class="timeline-dot"></view>

                            <view class="timeline-content">
                                <text class="timeline-text">{{ item.content }}</text>
                                <text class="timeline-time">{{ item.time }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 申请信息 -->
        <view class="content-card">
            <view class="card-header">
                <view class="card-icon info">📋</view>
                <text class="card-title">申请信息</text>
            </view>
            <view class="card-body">
                <view class="info-grid">
                    <view class="info-box">
                        <text class="info-box-label">申请编号</text>
                        <text class="info-box-value">{{ application.id }}</text>
                    </view>
                    <view class="info-box">
                        <text class="info-box-label">申请时间</text>
                        <text class="info-box-value">{{ application.applyTime }}</text>
                    </view>
                    <view class="info-box" v-if="application.reviewTime">
                        <text class="info-box-label">审核时间</text>
                        <text class="info-box-value">{{ application.reviewTime }}</text>
                    </view>
                    <view class="info-box" v-if="application.shipTime">
                        <text class="info-box-label">发货时间</text>
                        <text class="info-box-value">{{ application.shipTime }}</text>
                    </view>
                    <view class="info-box" v-if="application.receiveTime">
                        <text class="info-box-label">签收时间</text>
                        <text class="info-box-value">{{ application.receiveTime }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作栏 -->
        <view class="footer-bar" v-if="application.shipStatus === 'shipped'">
            <view class="btn btn-secondary" @tap="contactService">联系客服</view>
            <view class="btn btn-primary" @tap="confirmReceive">确认收货</view>
        </view>
    </view>
</template>

<script>
const sampleService = require('../../services/sampleService');
export default {
    data() {
        return {
            application: {
                status: '',
                statusText: '',
                reviewRemark: '',
                reviewTime: '',
                products: [],

                recipient: {
                    name: '',
                    phone: '',
                    province: '',
                    city: '',
                    district: '',
                    address: ''
                },

                shipStatus: '',
                logisticsCompany: '',
                shipStatusText: '',
                trackingNo: '',
                trackingList: '',
                id: '',
                applyTime: '',
                shipTime: '',
                receiveTime: ''
            },
            statusDesc: ''
        };
    },
    onLoad(options) {
        const applicationId = options.id;
        if (applicationId) {
            this.loadApplicationDetail(applicationId);
        }
    },
    methods: {
        // 加载申请详情
        async loadApplicationDetail(applicationId) {
            uni.showLoading({
                title: '加载中...'
            });
            try {
                const res = await sampleService.getSampleDetail(applicationId);
                if (res.code === 200) {
                    const application = res.data;
                    const statusDesc = this.getStatusDesc(application.status, application.shipStatus);
                    this.setData({
                        application,
                        statusDesc
                    });
                } else {
                    uni.showToast({
                        title: res.message || '加载失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载申请详情失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },

        // 获取模拟详情数据
        getMockDetail(applicationId) {
            return {
                id: applicationId,
                applyTime: '2026-03-14 06:17:00',
                reviewTime: '2026-03-14 08:30:00',
                shipTime: '2026-03-14 10:00:00',
                receiveTime: '2026-03-15 14:30:00',
                status: 'approved',
                statusText: '审核通过',
                shipStatus: 'shipped',
                shipStatusText: '已寄出',
                logisticsCompany: '顺丰速运',
                trackingNo: 'SF1234567890',
                reviewRemark: '审核通过，样品质量优良，适合推广',
                remark: '希望尽快发货，谢谢！',
                recipient: {
                    name: '张三',
                    phone: '13800138000',
                    province: '广东省',
                    city: '深圳市',
                    district: '南山区',
                    address: '科技园南路88号'
                },
                products: [
                    {
                        id: 1,
                        image: 'https://picsum.photos/160/160?random=10',
                        name: '立白大师香氛洗衣液持久留香护色护衣天然酵素',
                        price: '39.9',
                        commission: '20%'
                    }
                ],
                trackingList: [
                    {
                        content: '快件已签收，感谢您使用顺丰速运，期待再次为您服务',
                        time: '2026-03-15 14:30:00'
                    },
                    {
                        content: '【深圳市】快件已送达【深圳南山营业点】，正在派送中',
                        time: '2026-03-15 08:20:00'
                    },
                    {
                        content: '【深圳市】快件已发车，下一站【深圳南山营业点】',
                        time: '2026-03-14 22:15:00'
                    },
                    {
                        content: '【深圳市】顺丰速运 已收取快件',
                        time: '2026-03-14 18:30:00'
                    }
                ]
            };
        },

        // 获取状态描述
        getStatusDesc(status, shipStatus) {
            if (status === 'pending') {
                return '您的申请正在审核中，请耐心等待';
            } else if (status === 'rejected') {
                return '您的申请未通过审核，请查看审核备注';
            } else if (status === 'approved') {
                if (shipStatus === 'not_shipped') {
                    return '您的申请已通过审核，样品准备中';
                } else if (shipStatus === 'shipped') {
                    return '样品已寄出，请注意查收';
                } else if (shipStatus === 'received') {
                    return '样品已签收，请尽快完成测评';
                }
            }
            return '';
        },

        // 复制快递单号
        copyTrackingNo() {
            const trackingNo = this.application.trackingNo;
            if (!trackingNo) {
                return;
            }
            uni.setClipboardData({
                data: trackingNo,
                success: () => {
                    uni.showToast({
                        title: '单号已复制',
                        icon: 'success'
                    });
                }
            });
        },

        // 确认收货
        confirmReceive() {
            uni.showModal({
                title: '确认收货',
                content: '确认已收到样品吗？确认后将开始计算测评期限',
                confirmText: '确认收货',
                cancelText: '取消',
                success: (res) => {
                    if (res.confirm) {
                        this.doConfirmReceive();
                    }
                }
            });
        },

        // 执行确认收货
        doConfirmReceive() {
            const applicationId = this.application.id;

            // 从本地存储获取数据
            let applications = uni.getStorageSync('sampleApplications') || [];

            // 更新对应申请的状态
            const index = applications.findIndex((item) => item.id === applicationId);
            if (index !== -1) {
                applications[index].shipStatus = 'received';
                applications[index].shipStatusText = '已签收';

                // 保存回本地存储
                uni.setStorageSync('sampleApplications', applications);

                // 刷新页面数据
                this.loadApplicationDetail(applicationId);
                uni.showToast({
                    title: '确认收货成功',
                    icon: 'success'
                });
            }
        },

        // 联系客服
        contactService() {
            uni.showModal({
                title: '联系客服',
                content: '客服电话: 400-123-4567',
                confirmText: '拨打',
                success: (res) => {
                    if (res.confirm) {
                        uni.makePhoneCall({
                            phoneNumber: '4001234567'
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
.container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 40rpx;
}

/* 状态卡片 - 新设计 */
.status-card {
    background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
    padding: 60rpx 40rpx;
    display: flex;
    align-items: center;
    color: #fff;
    position: relative;
    overflow: hidden;
}

.status-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.status-card::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.status-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10rpx);
    z-index: 1;
}

.icon-text {
    font-size: 56rpx;
}

.status-info {
    flex: 1;
    z-index: 1;
}

.status-title {
    font-size: 44rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 12rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.status-desc {
    font-size: 26rpx;
    opacity: 0.95;
    line-height: 1.4;
}

/* 内容卡片 */
.content-card {
    background-color: #fff;
    margin: 20rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    padding: 30rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.card-icon {
    width: 48rpx;
    height: 48rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    font-size: 28rpx;
}

.card-icon.remark {
    background-color: #fff3cd;
}

.card-icon.product {
    background-color: #dbeafe;
}

.card-icon.address {
    background-color: #fce7f3;
}

.card-icon.shipping {
    background-color: #d1fae5;
}

.card-icon.info {
    background-color: #e0e7ff;
}

.card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.card-body {
    padding: 25rpx 30rpx;
}

/* 审核备注 */
.remark-box {
    background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
    border-radius: 16rpx;
    padding: 25rpx;
    border-left: 6rpx solid #f59e0b;
}

.remark-text {
    font-size: 28rpx;
    color: #92400e;
    line-height: 1.6;
}

.remark-time {
    font-size: 24rpx;
    color: #b45309;
    margin-top: 15rpx;
    display: block;
}

/* 商品列表 */
.product-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.product-item {
    display: flex;
    background-color: #f8fafc;
    border-radius: 16rpx;
    padding: 20rpx;
    transition: transform 0.2s;
}

.product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    background-color: #fff;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-name {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 15rpx;
    margin-top: 15rpx;
}

.product-price {
    font-size: 32rpx;
    color: #ff4757;
    font-weight: bold;
}

.product-commission {
    font-size: 24rpx;
    color: #10b981;
    background-color: #d1fae5;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

/* 信息列表 */
.info-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.info-item {
    display: flex;
    align-items: flex-start;
}

.info-label {
    width: 160rpx;
    font-size: 28rpx;
    color: #666;
    flex-shrink: 0;
}

.info-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    line-height: 1.5;
}

/* 物流卡片 */
.shipping-box {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 16rpx;
    padding: 25rpx;
    border: 1rpx solid #bae6fd;
}

.shipping-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx dashed #bae6fd;
}

.shipping-company {
    display: flex;
    align-items: center;
}

.company-icon {
    width: 60rpx;
    height: 60rpx;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15rpx;
    font-size: 32rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.company-name {
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
}

.shipping-status {
    font-size: 26rpx;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-weight: 500;
}

.shipping-status.shipped {
    background-color: #dbeafe;
    color: #3b82f6;
}

.shipping-status.received {
    background-color: #d1fae5;
    color: #059669;
}

.tracking-row {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
}

.tracking-label {
    font-size: 26rpx;
    color: #666;
    margin-right: 15rpx;
}

.tracking-no {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    font-family: monospace;
}

.copy-btn {
    font-size: 24rpx;
    color: #3b82f6;
    background-color: #eff6ff;
    padding: 10rpx 24rpx;
    border-radius: 24rpx;
    border: 1rpx solid #bfdbfe;
}

/* 物流时间线 */
.timeline {
    position: relative;
    padding-left: 40rpx;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 12rpx;
    top: 10rpx;
    bottom: 10rpx;
    width: 2rpx;
    background: linear-gradient(to bottom, #3b82f6, #93c5fd);
}

.timeline-item {
    position: relative;
    padding-bottom: 30rpx;
}

.timeline-item:last-child {
    padding-bottom: 0;
}

.timeline-dot {
    position: absolute;
    left: -34rpx;
    top: 6rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: #93c5fd;
    border: 4rpx solid #fff;
    box-shadow: 0 0 0 2rpx #93c5fd;
}

.timeline-item.active .timeline-dot {
    background-color: #3b82f6;
    box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.3);
    width: 24rpx;
    height: 24rpx;
    left: -36rpx;
    top: 4rpx;
}

.timeline-content {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.timeline-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    display: block;
    margin-bottom: 10rpx;
}

.timeline-time {
    font-size: 24rpx;
    color: #3b82f6;
}

.timeline-item.active .timeline-text {
    color: #1e40af;
    font-weight: 500;
}

/* 申请信息 */
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
}

.info-box {
    background-color: #f8fafc;
    border-radius: 12rpx;
    padding: 20rpx;
}

.info-box-label {
    font-size: 24rpx;
    color: #666;
    display: block;
    margin-bottom: 10rpx;
}

.info-box-value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    font-family: monospace;
}

/* 底部操作栏 */
.footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
    display: flex;
    gap: 20rpx;
}

.btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 500;
}

.btn-secondary {
    background-color: #f3f4f6;
    color: #666;
}

.btn-primary {
    background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(255, 71, 87, 0.3);
}

/* 状态颜色 */
.status-pending {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%) !important;
}

.status-approved {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important;
}

.status-rejected {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%) !important;
}
</style>
