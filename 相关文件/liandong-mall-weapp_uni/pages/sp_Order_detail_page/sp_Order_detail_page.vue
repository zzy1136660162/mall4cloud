<template>
    <view class="order-detail-page">
        <view class="page-background"></view>

        <scroll-view class="detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="detail-content">
                <view class="status-section">
                    <view class="status-icon">
                        <text class="icon">{{ statusIcon }}</text>
                    </view>
                    <view class="status-info">
                        <text class="status-title">{{ orderDetail.statusText }}</text>
                        <text class="status-desc">{{ orderDetail.statusDesc }}</text>
                        <text class="countdown-text" v-if="orderDetail.status === 'PENDING_PAY' && countdownText">⏰ 剩余支付时间：{{ countdownText }}</text>
                    </view>
                </view>

                <view class="address-section">
                    <view class="section-header">
                        <text class="section-title">收货信息</text>
                    </view>

                    <view class="address-card">
                        <view class="address-icon">
                            <text class="icon">📍</text>
                        </view>
                        <view class="address-info">
                            <view class="address-user">
                                <text class="user-name">{{ orderDetail.address.name }}</text>
                                <text class="user-phone">{{ orderDetail.address.phone }}</text>
                            </view>
                            <view class="address-detail">{{ orderDetail.address.detail }}</view>
                        </view>
                    </view>
                </view>

                <view class="products-section">
                    <view class="section-header">
                        <text class="section-title">商品信息</text>
                        <text class="product-count">共{{ orderDetail.products.length }}件</text>
                    </view>

                    <view class="products-list">
                        <view class="product-item" @tap="goToProductDetail" :data-id="item.productId" v-for="(item, index) in orderDetail.products" :key="index">
                            <view class="product-image-wrapper">
                                <image class="product-image" :src="item.mainImage" mode="aspectFill" :lazy-load="true" />
                            </view>

                            <view class="product-info">
                                <view class="product-name">{{ item.productName }}</view>
                                <view class="product-specs" v-if="item.specs">{{ item.specs }}</view>
                                <view class="product-bottom">
                                    <view class="product-price">
                                        <text class="currency">¥</text>
                                        <text class="price">{{ item.price }}</text>
                                    </view>
                                    <view class="product-quantity">×{{ item.quantity }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="price-section">
                    <view class="section-header">
                        <text class="section-title">费用明细</text>
                    </view>

                    <view class="price-list">
                        <view class="price-row">
                            <text class="price-label">商品金额</text>
                            <text class="price-value">¥{{ orderDetail.totalAmount }}</text>
                        </view>
                        <view class="price-row">
                            <text class="price-label">运费</text>
                            <text class="price-value">{{ orderDetail.shippingFee > 0 ? '¥' + orderDetail.shippingFee : '免运费' }}</text>
                        </view>
                        <view class="price-row" v-if="orderDetail.discountAmount > 0">
                            <text class="price-label">优惠金额</text>
                            <text class="price-value discount">-¥{{ orderDetail.discountAmount }}</text>
                        </view>
                        <view class="price-row total-row">
                            <text class="price-label total-label">实付金额</text>
                            <view class="total-value">
                                <text class="currency">¥</text>
                                <text class="total-price">{{ orderDetail.finalAmount }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="info-section">
                    <view class="section-header">
                        <text class="section-title">订单信息</text>
                    </view>

                    <view class="info-list">
                        <view class="info-row">
                            <text class="info-label">订单编号</text>
                            <view class="info-value-wrapper">
                                <text class="info-value">{{ orderDetail.orderId }}</text>
                                <view class="copy-btn" @tap="copyOrderId">
                                    <text class="copy-text">复制</text>
                                </view>
                            </view>
                        </view>
                        <view class="info-row">
                            <text class="info-label">下单时间</text>
                            <text class="info-value">{{ orderDetail.createTime }}</text>
                        </view>
                        <view class="info-row" v-if="orderDetail.payTime">
                            <text class="info-label">支付时间</text>
                            <text class="info-value">{{ orderDetail.payTime }}</text>
                        </view>
                        <view class="info-row" v-if="orderDetail.shipTime">
                            <text class="info-label">发货时间</text>
                            <text class="info-value">{{ orderDetail.shipTime }}</text>
                        </view>
                        <view class="info-row" v-if="orderDetail.finishTime">
                            <text class="info-label">完成时间</text>
                            <text class="info-value">{{ orderDetail.finishTime }}</text>
                        </view>
                        <view class="info-row" v-if="orderDetail.remark">
                            <text class="info-label">订单备注</text>
                            <text class="info-value">{{ orderDetail.remark }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="detail-footer" v-if="orderDetail.status === 'PENDING_PAY' || orderDetail.status === 'SHIPPED'">
            <view class="footer-content">
                <view v-if="orderDetail.status === 'PENDING_PAY'" class="action-btn" @tap="cancelOrder">
                    <text class="action-text">取消订单</text>
                </view>
                <view v-if="orderDetail.status === 'PENDING_PAY'" class="action-btn primary" @tap="payOrder">
                    <text class="action-text">立即支付</text>
                </view>
                <view v-if="orderDetail.status === 'SHIPPED'" class="action-btn" @tap="contactService">
                    <text class="action-text">联系客服</text>
                </view>
                <view v-if="orderDetail.status === 'SHIPPED'" class="action-btn primary" @tap="confirmReceipt">
                    <text class="action-text">确认收货</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const orderApi = require('../../utils/sp_api.js').orderApi;

// 默认图片
const DEFAULT_PRODUCT_IMAGE = 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/products/product_1_main.jpg';
export default {
    data() {
        return {
            orderId: '',
            orderDetail: {
                orderId: '',
                status: '',
                statusText: '',
                statusDesc: '',
                address: {
                    name: '',
                    phone: '',
                    detail: ''
                },
                products: [],
                totalAmount: 0,
                shippingFee: 0,
                discountAmount: 0,
                finalAmount: 0,
                createTime: '',
                payTime: '',
                shipTime: '',
                finishTime: '',
                remark: ''
            },
            statusIcon: '📦',
            useMockData: false,
            remainingSeconds: 0,
            // 剩余支付时间（秒）
            countdownText: '' // 倒计时文本
        };
    },
    onLoad(options) {
        console.log('订单详情页 - onLoad options:', options);
        console.log('订单详情页 - options.orderId:', options.orderId);
        const { orderId } = options;
        if (orderId) {
            console.log('订单详情页 - 有效orderId:', orderId);
            this.setData({
                orderId: orderId
            });
            this.loadOrderDetail();
        } else {
            console.error('订单详情页 - orderId无效或为空!');
            uni.showToast({
                title: '订单ID不存在',
                icon: 'none'
            });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        }
    },
    onShow() {
        if (this.orderId) {
            this.loadOrderDetail();
        }
    },
    onPullDownRefresh() {
        this.loadOrderDetail().then(() => {
            uni.stopPullDownRefresh();
        });
    },
    methods: {
        // 图片加载失败处理
        handleImageError(e) {
            const { index } = e.currentTarget.dataset;
            const { orderDetail } = this;
            if (orderDetail.products && orderDetail.products[index]) {
                orderDetail.products[index].productImage = DEFAULT_PRODUCT_IMAGE;
                this.setData({
                    orderDetail
                });
            }
        },

        async loadOrderDetail() {
            try {
                console.log('开始加载订单详情, orderId:', this.orderId);
                const { orderId } = this;
                console.log('调用API: orderApi.getOrderDetail(', orderId, ')');
                const res = await orderApi.getOrderDetail(orderId);
                console.log('API返回结果:', res);
                console.log('API返回类型:', typeof res);
                console.log('API返回是否为空:', res === null, res === undefined);
                if (res) {
                    const orderDetail = {
                        ...res,
                        statusText: this.getStatusText(res.status),
                        statusDesc: this.getStatusDesc(res.status)
                    };
                    this.setData({
                        orderDetail,
                        statusIcon: this.getStatusIcon(res.status),
                        useMockData: false
                    });

                    // 检查订单是否需要设置自动取消定时器
                    this.checkAutoCancelOrder(orderDetail);
                } else {
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载订单详情失败:', error);
                this.setData({
                    useMockData: true
                });
                this.loadMockData();
            }
        },

        // 检查订单是否需要自动取消
        checkAutoCancelOrder(orderDetail) {
            // 如果是待付款状态，设置30分钟自动取消
            if (orderDetail.status === 'PENDING_PAY') {
                // 清除之前的定时器（如果有）
                if (this.cancelTimer) {
                    clearTimeout(this.cancelTimer);
                }
                if (this.countdownTimer) {
                    clearInterval(this.countdownTimer);
                }

                // 使用后端返回的剩余时间，如果没有则计算
                let remainingTime = 1800000; // 默认30分钟

                if (orderDetail.remainingSeconds) {
                    remainingTime = orderDetail.remainingSeconds * 1000;
                } else {
                    // 计算剩余时间
                    const createTime = new Date(orderDetail.createTime);
                    const expireTime = new Date(createTime.getTime() + 1800000); // 30分钟后
                    const now = new Date();
                    remainingTime = expireTime - now;
                }

                // 如果还没到过期时间，设置倒计时和定时器
                if (remainingTime > 0) {
                    this.setData({
                        remainingSeconds: Math.floor(remainingTime / 1000),
                        countdownText: this.formatCountdown(Math.floor(remainingTime / 1000))
                    });

                    // 启动倒计时更新（每秒更新一次）
                    this.countdownTimer = setInterval(() => {
                        const currentRemaining = this.remainingSeconds - 1;
                        if (currentRemaining > 0) {
                            this.setData({
                                remainingSeconds: currentRemaining,
                                countdownText: this.formatCountdown(currentRemaining)
                            });
                        } else {
                            // 时间到，取消订单
                            if (this.countdownTimer) {
                                clearInterval(this.countdownTimer);
                            }
                        }
                    }, 1000);

                    // 设置超时取消定时器
                    this.cancelTimer = setTimeout(() => {
                        this.autoCancelOrder();
                    }, remainingTime);
                } else {
                    // 已经过期，直接取消订单
                    this.autoCancelOrder();
                }
            } else {
                // 非待付款状态，清除定时器
                if (this.cancelTimer) {
                    clearTimeout(this.cancelTimer);
                    this.cancelTimer = null;
                }
                if (this.countdownTimer) {
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = null;
                }
            }
        },

        // 格式化倒计时文本
        formatCountdown(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}分${secs.toString().padStart(2, '0')}秒`;
        },

        // 自动取消订单
        async autoCancelOrder() {
            try {
                const { orderId } = this;
                await orderApi.cancelOrder(orderId, '订单超时自动取消');

                // 更新订单状态
                const orderDetail = {
                    ...this.orderDetail,
                    status: 'CANCELLED',
                    statusText: '已取消',
                    statusDesc: '订单超时自动取消'
                };
                this.setData({
                    orderDetail,
                    statusIcon: this.getStatusIcon('CANCELLED')
                });

                // 显示取消通知
                uni.showToast({
                    title: '订单已超时自动取消',
                    icon: 'none'
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('自动取消订单失败:', error);
            }
        },

        loadMockData() {
            const { orderId } = this;
            const mockOrderDetail = {
                orderId: orderId || 'ORD20240320001',
                status: 'SHIPPED',
                statusText: '待收货',
                statusDesc: '商品正在配送中',
                address: {
                    name: '张三',
                    phone: '138****8888',
                    detail: '北京市朝阳区xxx街道xxx号xxx小区xxx号楼xxx室'
                },
                products: [
                    {
                        productId: 42,
                        productName: '焕颜修护精华液',
                        productImage: DEFAULT_PRODUCT_IMAGE,
                        specs: '30ml',
                        price: 299,
                        quantity: 2
                    },
                    {
                        productId: 43,
                        productName: '深层清洁洁面乳',
                        productImage: DEFAULT_PRODUCT_IMAGE,
                        specs: '100ml',
                        price: 158,
                        quantity: 1
                    }
                ],
                totalAmount: 756,
                shippingFee: 0,
                discountAmount: 0,
                finalAmount: 756,
                createTime: '2024-03-20 10:30:00',
                payTime: '2024-03-20 10:35:00',
                shipTime: '2024-03-21 09:00:00',
                finishTime: '',
                remark: '请尽快发货，谢谢'
            };
            this.setData({
                orderDetail: mockOrderDetail,
                statusIcon: this.getStatusIcon(mockOrderDetail.status)
            });
        },

        getStatusText(status) {
            const statusMap = {
                PENDING_PAY: '待付款',
                PAID: '待发货',
                SHIPPED: '待收货',
                FINISHED: '已完成',
                CANCELLED: '已取消'
            };
            return statusMap[status] || '未知状态';
        },

        getStatusDesc(status) {
            const descMap = {
                PENDING_PAY: '请在30分钟内完成支付',
                PAID: '商家正在准备发货',
                SHIPPED: '商品正在配送中',
                FINISHED: '订单已完成',
                CANCELLED: '订单已取消'
            };
            return descMap[status] || '';
        },

        getStatusIcon(status) {
            const iconMap = {
                PENDING_PAY: '💳',
                PAID: '📦',
                SHIPPED: '🚚',
                FINISHED: '✅',
                CANCELLED: '❌'
            };
            return iconMap[status] || '📦';
        },

        copyOrderId() {
            const { orderId } = this;
            uni.setClipboardData({
                data: orderId,
                success: () => {
                    uni.showToast({
                        title: '复制成功',
                        icon: 'success'
                    });
                }
            });
        },

        goToProductDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        async cancelOrder() {
            const { orderId } = this;
            uni.showModal({
                title: '提示',
                content: '确定要取消该订单吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            uni.showLoading({
                                title: '取消中...'
                            });
                            await orderApi.cancelOrder(orderId);
                            uni.hideLoading();
                            uni.showToast({
                                title: '取消成功',
                                icon: 'success'
                            });
                            this.loadOrderDetail();
                        } catch (error) {
                            console.log('CatchClause', error);
                            console.log('CatchClause', error);
                            uni.hideLoading();
                            console.error('取消订单失败:', error);
                            uni.showToast({
                                title: '取消失败',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        },

        // 支付订单
        async payOrder() {
            const { orderId, orderDetail } = this;
            try {
                uni.showLoading({
                    title: '正在发起支付...',
                    mask: true
                });

                // 调用后端支付API
                const userId = uni.getStorageSync('userId') || 1;
                const payResult = await new Promise((resolve, reject) => {
                    uni.request({
                        url: `http://localhost:5000/api/sp/order/pay/${orderId}`,
                        method: 'POST',
                        data: {
                            paymentMethod: 'WECHAT_PAY'
                        },
                        header: {
                            'Content-Type': 'application/json',
                            'X-User-Id': userId
                        },
                        success: (res) => {
                            if (res.data.code === 200) {
                                resolve(res.data.data);
                            } else {
                                reject(new Error(res.data.message || '支付失败'));
                            }
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                });
                uni.hideLoading();
                console.log('支付成功，返回数据:', payResult);

                // 显示支付成功弹窗
                this.showPaySuccessModal();

                // 重新加载订单详情，获取最新状态
                await this.loadOrderDetail();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('支付失败:', error);
                uni.hideLoading();

                // 如果是用户取消支付
                if (error.errMsg && error.errMsg.includes('cancel')) {
                    uni.showToast({
                        title: '已取消支付',
                        icon: 'none'
                    });
                } else {
                    uni.showToast({
                        title: error.message || '支付失败，请重试',
                        icon: 'none'
                    });
                }
            }
        },

        // 显示支付成功弹窗
        showPaySuccessModal() {
            uni.showModal({
                title: '支付成功',
                content: '您的订单已支付成功，商家正在准备发货',
                showCancel: false,
                confirmText: '查看订单',
                success: (res) => {
                    if (res.confirm) {
                        // 可以跳转到订单列表或其他页面
                    }
                }
            });
        },

        contactService() {
            uni.showToast({
                title: '联系客服功能开发中',
                icon: 'none'
            });
        },

        async confirmReceipt() {
            const { orderId } = this;
            uni.showModal({
                title: '提示',
                content: '确定要确认收货吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            uni.showLoading({
                                title: '确认中...'
                            });
                            await orderApi.confirmReceipt(orderId);
                            uni.hideLoading();
                            uni.showToast({
                                title: '确认成功',
                                icon: 'success'
                            });
                            this.loadOrderDetail();
                        } catch (error) {
                            console.log('CatchClause', error);
                            console.log('CatchClause', error);
                            uni.hideLoading();
                            console.error('确认收货失败:', error);
                            uni.showToast({
                                title: '确认失败',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.order-detail-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

.page-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafafa;
    z-index: 0;
}

.detail-scroll {
    height: 100vh;
    padding-bottom: 160rpx;
    background: #fafafa;
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding: 20rpx;
}

.status-section {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 16rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(255, 193, 7, 0.25);
    display: flex;
    align-items: center;
    gap: 24rpx;
    animation: sectionFadeIn 0.5s ease;
}

@keyframes sectionFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.status-icon {
    width: 96rpx;
    height: 96rpx;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.icon {
    font-size: 48rpx;
}

.status-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.status-title {
    font-size: 36rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.status-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.countdown-text {
    font-size: 26rpx;
    color: #ffffff;
    font-weight: 600;
    margin-top: 8rpx;
    padding: 8rpx 16rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8rpx;
    display: inline-block;
    width: fit-content;
}

.address-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.1s both;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 30rpx;
    color: #333333;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.product-count {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
}

.address-card {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 20rpx;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.04) 0%, rgba(255, 193, 7, 0.02) 100%);
    border-radius: 12rpx;
    border: 1rpx solid rgba(255, 193, 7, 0.15);
}

.address-icon {
    flex-shrink: 0;
    width: 56rpx;
    height: 56rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.25);
}

.address-info {
    flex: 1;
    min-width: 0;
}

.address-user {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 8rpx;
}

.user-name {
    font-size: 30rpx;
    color: #333333;
    font-weight: 600;
    letter-spacing: 0.3rpx;
}

.user-phone {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
}

.address-detail {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.3rpx;
}

.products-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.2s both;
}

.products-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx;
    background: #fafafa;
    border-radius: 12rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-item:active {
    transform: scale(0.98);
    background: #f5f5f5;
}

.product-image-wrapper {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.product-image {
    width: 100%;
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-item:active .product-image {
    transform: scale(1.05);
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;
}

.product-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 0.3rpx;
}

.product-specs {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.2rpx;
}

.product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.product-price {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
}

.currency {
    font-size: 20rpx;
    color: #ffc107;
    font-weight: 600;
}

.price {
    font-size: 32rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.product-quantity {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
}

.price-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.3s both;
}

.price-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12rpx 0;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
}

.price-row:last-child {
    border-bottom: none;
}

.price-label {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
}

.price-value {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.price-value.discount {
    color: #ffc107;
}

.total-row {
    margin-top: 8rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.total-label {
    font-size: 30rpx;
    color: #333333;
    font-weight: 600;
}

.total-value {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
}

.total-price {
    font-size: 40rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.info-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.4s both;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12rpx 0;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
    flex-shrink: 0;
}

.info-value-wrapper {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.info-value {
    font-size: 26rpx;
    color: #333333;
    font-weight: 500;
    text-align: right;
    word-break: break-all;
}

.copy-btn {
    padding: 6rpx 16rpx;
    background: #fafafa;
    border-radius: 40rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.copy-btn:active {
    transform: scale(0.95);
    background: #f5f5f5;
}

.copy-text {
    font-size: 22rpx;
    color: #666666;
    font-weight: 500;
}

.detail-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: #ffffff;
    border-top: 1rpx solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.footer-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16rpx;
    padding: 24rpx 40rpx;
}

.action-btn {
    padding: 20rpx 48rpx;
    background: #fafafa;
    border-radius: 48rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:active {
    transform: scale(0.95);
    background: #f5f5f5;
}

.action-btn.primary {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-color: #ffc107;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.3);
}

.action-btn.primary:active {
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.2);
}

.action-text {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
    letter-spacing: 0.3rpx;
}

.action-btn.primary .action-text {
    color: #ffffff;
    font-weight: 600;
}
</style>
