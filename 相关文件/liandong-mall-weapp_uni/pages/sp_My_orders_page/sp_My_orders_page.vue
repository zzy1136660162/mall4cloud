<template>
    <view class="orders-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-title">我的订单</view>
            </view>

            <view class="tabs-container">
                <scroll-view class="tabs-scroll" scroll-x :enhanced="true" :show-scrollbar="false">
                    <view class="tabs">
                        <view :class="'tab-item ' + (currentTab === item.key ? 'active' : '')" @tap="switchTab" :data-key="item.key" v-for="(item, index) in tabs" :key="index">
                            <text class="tab-text">{{ item.label }}</text>

                            <view class="tab-indicator" v-if="currentTab === item.key"></view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <scroll-view class="orders-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="orders-content">
                <view v-if="orderList.length === 0" class="empty-state">
                    <text class="empty-emoji">📦</text>
                    <text class="empty-title">暂无订单</text>
                    <text class="empty-desc">快去选购心仪的商品吧</text>
                    <view class="empty-action">
                        <view class="go-shopping-btn" @tap="goToShopping">
                            <text class="go-shopping-text">去逛逛</text>
                        </view>
                    </view>
                </view>

                <view v-else class="orders-list">
                    <view class="order-card" @tap="goToDetail" :data-orderid="item.orderId" v-for="(item, index) in orderList" :key="index">
                        <view class="order-header">
                            <view class="order-info">
                                <text class="order-id">订单号：{{ item.orderId }}</text>
                                <text class="order-time">{{ item.createTime }}</text>
                            </view>
                            <view :class="'order-status ' + item.status">{{ item.statusText }}</view>
                        </view>

                        <view class="order-products">
                            <view class="order-product" v-for="(product, productIndex) in item.products" :key="productIndex">
                                <view class="product-image-wrapper">
                                    <image class="product-image" :src="product.productImage || product.mainImage" mode="aspectFill" :lazy-load="true" />
                                </view>

                                <view class="product-info">
                                    <view class="product-name">{{ product.productName }}</view>
                                    <view class="product-specs" v-if="product.skuName || product.specs">{{ product.skuName || product.specs }}</view>
                                    <view class="product-bottom">
                                        <view class="product-price">
                                            <text class="currency">¥</text>
                                            <text class="price">{{ product.memberPrice || product.price }}</text>
                                        </view>
                                        <view class="product-quantity">×{{ product.quantity }}</view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <view class="order-footer">
                            <view class="order-total">
                                <text class="total-label">实付：</text>
                                <view class="total-amount">
                                    <text class="currency">¥</text>
                                    <text class="amount">{{ item.finalAmount || item.payAmount }}</text>
                                </view>
                            </view>

                            <view class="order-actions">
                                <view v-if="item.status === 'PENDING_PAY'" class="action-btn" @tap="cancelOrder" :data-orderid="item.orderId" @tap.stop.prevent="trueFun">
                                    <text class="action-text">取消订单</text>
                                </view>

                                <view v-if="item.status === 'PENDING_PAY'" class="action-btn primary" @tap="payOrder" :data-orderid="item.orderId" @tap.stop.prevent="trueFun">
                                    <text class="action-text primary">去支付</text>
                                </view>

                                <view v-if="item.status === 'SHIPPED'" class="action-btn primary" @tap="confirmReceipt" :data-orderid="item.orderId" @tap.stop.prevent="trueFun">
                                    <text class="action-text primary">确认收货</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view v-if="hasMore && orderList.length > 0" class="load-more">
                    <text class="load-more-text">加载更多...</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
const orderApi = require('../../utils/sp_api.js').orderApi;
const { checkLogin, getLoginStatus } = require('../../utils/sp_auth.js');
const DEFAULT_PRODUCT_IMAGE = 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/products/product_1_main.jpg';
export default {
    data() {
        return {
            tabs: [
                {
                    key: 'all',
                    label: '全部'
                },
                {
                    key: 'PENDING_PAY',
                    label: '待付款'
                },
                {
                    key: 'PAID',
                    label: '待发货'
                },
                {
                    key: 'SHIPPED',
                    label: '待收货'
                },
                {
                    key: 'FINISHED',
                    label: '已完成'
                },
                {
                    key: 'CANCELLED',
                    label: '已取消'
                }
            ],

            currentTab: 'all',
            orderList: [],
            page: 1,
            pageSize: 10,
            hasMore: true,
            useMockData: false,
            isLoading: false,
            isLoggedIn: false,
            searchKeyword: '',
            showSearch: false,
            orderStatistics: null,
            productIndex: 0,

            product: {
                productImage: '',
                mainImage: '',
                productName: '',
                skuName: '',
                specs: '',
                memberPrice: '',
                price: '',
                quantity: ''
            }
        };
    },
    onLoad(options) {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (!loginStatus.isLoggedIn) {
            checkLogin({
                showToast: true
            });
            return;
        }
        const { tab } = options;
        if (tab) {
            this.setData({
                currentTab: tab
            });
        }
        this.loadOrders();
        this.loadOrderStatistics();
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (loginStatus.isLoggedIn) {
            this.loadOrders();
        }
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true
        });
        Promise.all([this.loadOrders(), this.loadOrderStatistics()]).finally(() => {
            uni.stopPullDownRefresh();
        });
    },
    onReachBottom() {
        if (this.hasMore && !this.isLoading) {
            this.loadMoreOrders();
        }
    },
    methods: {
        async loadOrderStatistics() {
            try {
                const statistics = await orderApi.getOrderStatistics();
                if (statistics) {
                    this.setData({
                        orderStatistics: statistics
                    });
                    uni.setStorageSync('orderStatistics', statistics);
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载订单统计失败:', error);
                const cachedStatistics = uni.getStorageSync('orderStatistics');
                if (cachedStatistics) {
                    this.setData({
                        orderStatistics: cachedStatistics
                    });
                }
            }
        },

        async loadOrders() {
            if (this.isLoading) {
                return;
            }
            try {
                this.setData({
                    isLoading: true
                });
                uni.showLoading({
                    title: '加载中...'
                });
                const { currentTab, page, pageSize, searchKeyword } = this;
                const status = currentTab === 'all' ? null : currentTab;
                let res;
                if (searchKeyword) {
                    res = await orderApi.searchOrders(searchKeyword, page, pageSize);
                } else {
                    res = await orderApi.getOrderList(status, page, pageSize);
                }
                let orders = [];
                if (res) {
                    if (Array.isArray(res)) {
                        orders = res;
                    } else if (res.list && Array.isArray(res.list)) {
                        orders = res.list;
                    } else if (res.orders && Array.isArray(res.orders)) {
                        orders = res.orders;
                    } else {
                        orders = [res];
                    }
                }
                const orderList = orders.map((order) => ({
                    ...order,
                    statusText: this.getStatusText(order.status)
                }));
                if (page === 1) {
                    this.setData({
                        orderList
                    });
                    uni.setStorageSync('orderList', orderList);
                } else {
                    this.setData({
                        orderList: [...this.orderList, ...orderList]
                    });
                }
                this.setData({
                    hasMore: orders.length >= pageSize,
                    useMockData: false
                });
                uni.hideLoading();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载订单列表失败:', error);
                uni.hideLoading();
                if (page === 1) {
                    const cachedOrders = uni.getStorageSync('orderList');
                    if (cachedOrders && cachedOrders.length > 0) {
                        this.setData({
                            orderList: cachedOrders
                        });
                        uni.showToast({
                            title: '数据加载失败，已显示缓存',
                            icon: 'none'
                        });
                        return;
                    }
                }
                this.setData({
                    useMockData: true
                });
                this.loadMockData();
                uni.showToast({
                    title: '网络异常，请检查网络',
                    icon: 'none'
                });
            } finally {
                this.setData({
                    isLoading: false
                });
            }
        },

        async loadMoreOrders() {
            this.setData({
                page: this.page + 1
            });
            await this.loadOrders();
        },

        loadMockData() {
            const { currentTab } = this;
            let mockOrders = [];
            if (currentTab === 'all' || currentTab === 'PENDING_PAY') {
                mockOrders.push({
                    orderId: 1,
                    orderNo: 'ORD20240320001',
                    status: 'PENDING_PAY',
                    statusText: '待付款',
                    createTime: '2024-03-20 10:30:00',
                    products: [
                        {
                            productId: 42,
                            productName: '焕颜修护精华液',
                            productImage: DEFAULT_PRODUCT_IMAGE,
                            skuName: '30ml',
                            price: 299,
                            quantity: 2
                        }
                    ],
                    finalAmount: 598,
                    remainingSeconds: 1800
                });
            }
            if (currentTab === 'all' || currentTab === 'PAID') {
                mockOrders.push({
                    orderId: 2,
                    orderNo: 'ORD20240319001',
                    status: 'PAID',
                    statusText: '待发货',
                    createTime: '2024-03-19 15:20:00',
                    products: [
                        {
                            productId: 43,
                            productName: '水感透白面霜',
                            productImage: DEFAULT_PRODUCT_IMAGE,
                            skuName: '50g',
                            price: 199,
                            quantity: 1
                        }
                    ],
                    finalAmount: 199
                });
            }
            if (currentTab === 'all' || currentTab === 'SHIPPED') {
                mockOrders.push({
                    orderId: 3,
                    orderNo: 'ORD20240318001',
                    status: 'SHIPPED',
                    statusText: '待收货',
                    createTime: '2024-03-18 09:15:00',
                    products: [
                        {
                            productId: 44,
                            productName: '紧致眼霜',
                            productImage: DEFAULT_PRODUCT_IMAGE,
                            skuName: '15ml',
                            price: 159,
                            quantity: 1
                        }
                    ],
                    finalAmount: 159,
                    logisticsCompany: '顺丰速运',
                    logisticsNo: 'SF1234567890'
                });
            }
            if (currentTab === 'all' || currentTab === 'FINISHED') {
                mockOrders.push({
                    orderId: 4,
                    orderNo: 'ORD20240315001',
                    status: 'FINISHED',
                    statusText: '已完成',
                    createTime: '2024-03-15 14:45:00',
                    products: [
                        {
                            productId: 45,
                            productName: '温和洁面乳',
                            productImage: DEFAULT_PRODUCT_IMAGE,
                            skuName: '100ml',
                            price: 89,
                            quantity: 2
                        }
                    ],
                    finalAmount: 178
                });
            }
            if (currentTab === 'all' || currentTab === 'CANCELLED') {
                mockOrders.push({
                    orderId: 5,
                    orderNo: 'ORD20240321001',
                    status: 'CANCELLED',
                    statusText: '已取消',
                    createTime: '2024-03-21 09:30:00',
                    products: [
                        {
                            productId: 46,
                            productName: '补水面膜',
                            productImage: DEFAULT_PRODUCT_IMAGE,
                            skuName: '5片装',
                            price: 69,
                            quantity: 1
                        }
                    ],
                    finalAmount: 69,
                    cancelReason: '用户主动取消'
                });
            }
            this.setData({
                orderList: mockOrders,
                hasMore: false,
                useMockData: true
            });
        },

        switchTab(e) {
            const { key } = e.currentTarget.dataset;
            if (key === this.currentTab) {
                return;
            }
            this.setData({
                currentTab: key,
                page: 1,
                hasMore: true,
                searchKeyword: '',
                showSearch: false
            });
            this.loadOrders();
        },

        onSearchInput(e) {
            this.setData({
                searchKeyword: e.detail.value
            });
        },

        onSearchConfirm(e) {
            const { value } = e.detail;
            this.setData({
                searchKeyword: value,
                page: 1,
                hasMore: true
            });
            this.loadOrders();
        },

        toggleSearch() {
            this.setData({
                showSearch: !this.showSearch
            });
            if (!this.showSearch) {
                this.setData({
                    searchKeyword: '',
                    page: 1,
                    hasMore: true
                });
                this.loadOrders();
            }
        },

        clearSearch() {
            this.setData({
                searchKeyword: '',
                page: 1,
                hasMore: true
            });
            this.loadOrders();
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

        goToDetail(e) {
            const { orderid } = e.currentTarget.dataset;
            if (!orderid) {
                uni.showToast({
                    title: '订单ID错误',
                    icon: 'none'
                });
                return;
            }
            uni.navigateTo({
                url: `/pages/sp_Order_detail_page/sp_Order_detail_page?orderId=${orderid}`
            });
        },

        async cancelOrder(e) {
            const { orderid } = e.currentTarget.dataset;
            uni.showModal({
                title: '提示',
                content: '确定要取消该订单吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            uni.showLoading({
                                title: '取消中...'
                            });
                            await orderApi.cancelOrder(orderid);
                            uni.hideLoading();
                            uni.showToast({
                                title: '取消成功',
                                icon: 'success'
                            });
                            this.setData({
                                page: 1,
                                hasMore: true
                            });
                            this.loadOrders();
                            this.loadOrderStatistics();
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

        async payOrder(e) {
            const { orderid } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Payment/sp_Payment?orderId=${orderid}`
            });
        },

        async confirmReceipt(e) {
            const { orderid } = e.currentTarget.dataset;
            uni.showModal({
                title: '提示',
                content: '确定要确认收货吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            uni.showLoading({
                                title: '确认中...'
                            });
                            await orderApi.confirmReceipt(orderid);
                            uni.hideLoading();
                            uni.showToast({
                                title: '确认成功',
                                icon: 'success'
                            });
                            this.loadOrders();
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
        },

        buyAgain(e) {
            const { orderid } = e.currentTarget.dataset;
            uni.showToast({
                title: '再次购买功能开发中',
                icon: 'none'
            });
        },

        goToShopping() {
            uni.switchTab({
                url: '/pages/Product_list_page/Product_list_page'
            });
        },

        trueFun() {
            console.log('占位：函数 true 未声明');
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.orders-page {
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

.page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #ffffff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.header-content {
    padding: 32rpx 40rpx 20rpx;
}

.header-title {
    font-size: 44rpx;
    color: #2c2c2c;
    font-weight: 600;
    letter-spacing: 2rpx;
}

.tabs-container {
    background: #ffffff;
}

.tabs-scroll {
    white-space: nowrap;
}

.tabs {
    display: flex;
    padding: 0 40rpx;
    gap: 48rpx;
}

.tab-item {
    position: relative;
    padding: 20rpx 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-text {
    font-size: 28rpx;
    color: #666666;
    font-weight: 500;
    letter-spacing: 0.5rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item.active .tab-text {
    color: #ffc107;
    font-weight: 600;
    transform: scale(1.05);
}

.tab-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 48rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 3rpx;
    animation: indicatorSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes indicatorSlide {
    0% {
        width: 0;
        opacity: 0;
    }
    100% {
        width: 48rpx;
        opacity: 1;
    }
}

.orders-scroll {
    height: 100vh;
    padding-top: 220rpx;
    background: #fafafa;
}

.orders-content {
    padding: 20rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 0;
    animation: emptyFadeIn 0.6s ease;
}

@keyframes emptyFadeIn {
    0% {
        opacity: 0;
        transform: translateY(30rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-emoji {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.25;
    filter: grayscale(0.3);
    animation: emojiBounce 1.5s ease-in-out infinite;
}

@keyframes emojiBounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10rpx);
    }
}

.empty-title {
    font-size: 36rpx;
    color: #333333;
    font-weight: 600;
    margin-bottom: 16rpx;
    letter-spacing: 1rpx;
}

.empty-desc {
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
    margin-bottom: 40rpx;
    letter-spacing: 0.5rpx;
}

.empty-action {
    animation: buttonFadeIn 0.8s ease 0.3s both;
}

@keyframes buttonFadeIn {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.go-shopping-btn {
    padding: 24rpx 64rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 48rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.25);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.go-shopping-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.2);
}

.go-shopping-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.order-card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: cardSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20rpx);
}

.order-card:nth-child(1) {
    animation-delay: 0s;
}

.order-card:nth-child(2) {
    animation-delay: 0.08s;
}

.order-card:nth-child(3) {
    animation-delay: 0.16s;
}

.order-card:nth-child(4) {
    animation-delay: 0.24s;
}

.order-card:nth-child(5) {
    animation-delay: 0.32s;
}

.order-card:nth-child(6) {
    animation-delay: 0.4s;
}

.order-card:nth-child(7) {
    animation-delay: 0.48s;
}

.order-card:nth-child(8) {
    animation-delay: 0.56s;
}

.order-card:nth-child(9) {
    animation-delay: 0.64s;
}

.order-card:nth-child(10) {
    animation-delay: 0.72s;
}

@keyframes cardSlideIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.order-card:active {
    transform: scale(0.98);
}

.order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
    margin-bottom: 20rpx;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}

.order-id {
    font-size: 24rpx;
    color: #666666;
    font-weight: 400;
}

.order-time {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
}

.order-status {
    font-size: 26rpx;
    font-weight: 600;
    padding: 8rpx 20rpx;
    border-radius: 40rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-status.PENDING_PAY {
    color: #ffc107;
    background: rgba(255, 193, 7, 0.1);
}

.order-status.PAID {
    color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
}

.order-status.SHIPPED {
    color: #2196f3;
    background: rgba(33, 150, 243, 0.1);
}

.order-status.FINISHED {
    color: #999999;
    background: rgba(153, 153, 153, 0.1);
}

.order-status.CANCELLED {
    color: #999999;
    background: rgba(153, 153, 153, 0.1);
}

.order-products {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 20rpx;
}

.order-product {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx;
    background: #fafafa;
    border-radius: 12rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-product:active {
    transform: scale(0.98);
    background: #f5f5f5;
}

.product-image-wrapper {
    width: 120rpx;
    height: 120rpx;
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

.order-product:active .product-image {
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
    font-size: 26rpx;
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
    font-size: 28rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.product-quantity {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
}

.order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.04);
}

.order-total {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.total-label {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.total-amount {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
}

.amount {
    font-size: 36rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.order-actions {
    display: flex;
    gap: 12rpx;
}

.action-btn {
    padding: 16rpx 32rpx;
    background: #fafafa;
    border-radius: 40rpx;
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
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.25);
}

.action-btn.primary:active {
    box-shadow: 0 1rpx 4rpx rgba(255, 193, 7, 0.2);
}

.action-text {
    font-size: 24rpx;
    color: #666666;
    font-weight: 500;
    letter-spacing: 0.3rpx;
}

.action-btn.primary .action-text {
    color: #ffffff;
    font-weight: 600;
}
</style>
