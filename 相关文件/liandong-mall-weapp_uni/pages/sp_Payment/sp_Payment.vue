<template>
    <view class="sp-payment-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="back-btn" @tap="goBack">
                        <text class="back-icon">←</text>
                    </view>
                    <view class="header-title">
                        <text class="title-text">确认订单</text>
                    </view>
                    <view class="header-placeholder"></view>
                </view>
            </view>
        </view>

        <scroll-view class="page-content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
            <view class="product-info">
                <view class="product-image-container">
                    <image class="product-image" :src="product.mainImage" mode="aspectFill" />
                </view>
                <view class="product-details">
                    <view class="product-name">{{ product.name }}</view>
                    <view class="product-specs" v-if="selectedSpecs && Object.keys(selectedSpecs).length > 0">
                        <view class="spec-item" v-for="(specValue, specName) in selectedSpecs" :key="specName">
                            <text class="spec-name">{{ specName }}:</text>

                            <text class="spec-value">{{ specValue }}</text>
                        </view>
                    </view>
                    <view class="product-price-info">
                        <view class="price-item">
                            <text class="price-label">单价:</text>
                            <text class="price-value">¥{{ price }}</text>
                        </view>
                        <view class="price-item">
                            <text class="price-label">数量:</text>
                            <text class="price-value">{{ quantity }}</text>
                        </view>
                        <view class="price-item total">
                            <text class="price-label">合计:</text>
                            <text class="price-value total">¥{{ totalPrice }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="address-section">
                <view class="section-header">
                    <text class="section-title">收货地址</text>
                    <view class="section-action" @tap="selectAddress">
                        <text class="action-text">{{ address ? '更换' : '选择' }}</text>
                    </view>
                </view>
                <view class="address-content" v-if="address">
                    <view class="address-info">
                        <text class="address-name">{{ address.name }}</text>
                        <text class="address-phone">{{ address.phone }}</text>
                        <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
                    </view>
                    <view class="address-default" v-if="address.isDefault">
                        <text class="default-tag">默认</text>
                    </view>
                </view>
                <view class="address-empty" v-else>
                    <view class="empty-icon">📍</view>
                    <text class="empty-text">请选择收货地址</text>
                </view>
            </view>

            <view class="order-section">
                <view class="section-header">
                    <text class="section-title">订单备注</text>
                </view>
                <view class="order-remark">
                    <textarea
                        class="remark-input"
                        placeholder="请输入订单备注（选填）"
                        :value="remark"
                        @input="onRemarkInput"
                        maxlength="200"
                        :show-confirm-bar="false"
                        :auto-height="true"
                    />
                    <text class="remark-count">{{ remark.length }}/200</text>
                </view>
            </view>

            <view class="payment-section">
                <view class="section-header">
                    <text class="section-title">支付方式</text>
                </view>
                <view class="payment-methods">
                    <view :class="'payment-method ' + (selectedPayment === 'wechat' ? 'active' : '')" @tap="selectPayment" data-method="wechat">
                        <view class="payment-icon">💳</view>
                        <text class="payment-name">微信支付</text>
                        <view class="payment-check" v-if="selectedPayment === 'wechat'">
                            <text class="check-icon">✓</text>
                        </view>
                    </view>
                    <view :class="'payment-method ' + (selectedPayment === 'alipay' ? 'active' : '')" @tap="selectPayment" data-method="alipay">
                        <view class="payment-icon">💰</view>
                        <text class="payment-name">支付宝</text>
                        <view class="payment-check" v-if="selectedPayment === 'alipay'">
                            <text class="check-icon">✓</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="bottom-bar">
            <view class="bar-content">
                <view class="total-info">
                    <text class="total-label">实付款:</text>
                    <text class="total-price">¥{{ totalPrice }}</text>
                </view>
                <view :class="'submit-btn ' + (submitting ? 'disabled' : '')" @tap="submitOrder">
                    <text class="btn-text">{{ submitting ? '提交中...' : '提交订单' }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const { checkLogin, getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    data() {
        return {
            productId: '',
            skuId: '',
            quantity: 1,
            price: 0,
            totalPrice: 0,

            product: {
                mainImage: '',
                name: ''
            },

            selectedSpecs: {},
            address: null,
            remark: '',
            selectedPayment: 'wechat',
            submitting: false,
            isLoggedIn: false,
            selectedAddress: '',
            Object: {},
            specName: '',
            specValue: ''
        };
    },
    onLoad(options) {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (!loginStatus.isLoggedIn) {
            checkLogin({
                showToast: false
            });
            setTimeout(() => {
                checkLogin({
                    showToast: true
                });
            }, 100);
            return;
        }
        if (options.productId) {
            this.setData({
                productId: parseInt(options.productId) || 0,
                skuId: options.skuId ? parseInt(options.skuId) : null,
                quantity: parseInt(options.quantity) || 1,
                price: parseFloat(options.price) || 0,
                totalPrice: parseFloat(options.totalPrice) || 0
            });
            this.loadProductDetail();
        }
        this.loadDefaultAddress();
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
    },
    onShow() {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage.data.selectedAddress) {
            this.setData({
                address: currentPage.data.selectedAddress
            });
            currentPage.setData({
                selectedAddress: null
            });
        }
    },
    methods: {
        async loadDefaultAddress() {
            try {
                const address = await this.getDefaultAddress();
                if (address) {
                    this.setData({
                        address
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载默认地址失败:', error);
            }
        },

        getDefaultAddress() {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: 'http://localhost:5000/api/sp/address/default',
                    method: 'GET',
                    success: (res) => {
                        if (res.data.code === 200) {
                            resolve(res.data.data);
                        } else {
                            resolve(null);
                        }
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
        },

        async loadProductDetail() {
            try {
                const product = await this.getProductDetail(this.productId);
                this.setData({
                    product
                });
                if (this.skuId) {
                    this.loadSkuSpecs();
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品详情失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        },

        getProductDetail(productId) {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: `http://localhost:5000/api/sp/product/${productId}`,
                    method: 'GET',
                    success: (res) => {
                        if (res.data.code === 200) {
                            resolve(res.data.data);
                        } else {
                            reject(new Error(res.data.message));
                        }
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
        },

        loadSkuSpecs() {
            const product = this.product;
            if (!product.skus || product.skus.length === 0) {
                return;
            }
            const skuId = parseInt(this.skuId);
            const matchedSku = product.skus.find((sku) => sku.skuId === skuId);
            if (matchedSku && matchedSku.spec) {
                this.setData({
                    selectedSpecs: matchedSku.spec
                });
            }
        },

        selectAddress() {
            uni.navigateTo({
                url: '/pages/sp_Address_page/sp_Address_page?fromOrder=true'
            });
        },

        onRemarkInput(e) {
            this.setData({
                remark: e.detail.value
            });
        },

        selectPayment(e) {
            const method = e.currentTarget.dataset.method;
            this.setData({
                selectedPayment: method
            });
        },

        async submitOrder() {
            if (this.submitting) {
                return;
            }
            if (!this.address) {
                uni.showToast({
                    title: '请选择收货地址',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            this.setData({
                submitting: true
            });
            try {
                const orderData = {
                    items: [
                        {
                            productId: parseInt(this.productId),
                            skuId: this.skuId ? parseInt(this.skuId) : null,
                            quantity: parseInt(this.quantity)
                        }
                    ],
                    address: this.address,
                    remark: this.remark
                };
                const order = await this.createOrder(orderData);
                uni.showToast({
                    title: '订单创建成功',
                    icon: 'success',
                    duration: 1500
                });
                setTimeout(() => {
                    uni.redirectTo({
                        url: `/pages/sp_Order_detail_page/sp_Order_detail_page?orderId=${order.orderId}`
                    });
                }, 1500);
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('提交订单失败:', error);
                uni.showToast({
                    title: error.message || '提交失败',
                    icon: 'none',
                    duration: 2000
                });
            } finally {
                setTimeout(() => {
                    this.setData({
                        submitting: false
                    });
                }, 2000);
            }
        },

        createOrder(orderData) {
            return new Promise((resolve, reject) => {
                const userId = uni.getStorageSync('userId') || 1;
                console.log('创建订单 - 用户ID:', userId);
                console.log('创建订单 - 数据:', JSON.stringify(orderData, null, 2));
                uni.request({
                    url: 'http://localhost:5000/api/sp/order/create',
                    method: 'POST',
                    data: orderData,
                    header: {
                        'Content-Type': 'application/json',
                        'X-User-Id': userId
                    },
                    success: (res) => {
                        console.log('创建订单 - 响应:', JSON.stringify(res.data, null, 2));
                        if (res.data.code === 200) {
                            resolve(res.data.data);
                        } else {
                            reject(new Error(res.data.message || '创建订单失败'));
                        }
                    },
                    fail: (err) => {
                        console.error('创建订单 - 请求失败:', err);
                        reject(err);
                    }
                });
            });
        },

        goBack() {
            uni.navigateBack({
                delta: 1
            });
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
    padding-bottom: 160rpx;
}

.sp-payment-page {
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
}

.header-content {
    padding: 24rpx 32rpx;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.back-btn {
    width: 64rpx;
    height: 64rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.back-btn:active {
    transform: scale(0.92);
    background: #e8e8e8;
}

.back-icon {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 300;
}

.header-title {
    flex: 1;
    text-align: center;
}

.title-text {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.header-placeholder {
    width: 64rpx;
}

.page-content {
    height: 100vh;
    padding-top: 112rpx;
    padding-bottom: 160rpx;
    box-sizing: border-box;
}

.product-info {
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 16rpx;
    display: flex;
    gap: 24rpx;
}

.product-image-container {
    width: 200rpx;
    flex-shrink: 0;
}

.product-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    background: #f5f5f5;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.product-name {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
    line-height: 1.4;
}

.product-specs {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    margin-top: 12rpx;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.spec-name {
    font-size: 24rpx;
    color: #999999;
}

.spec-value {
    font-size: 24rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.product-price-info {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f5f5f5;
}

.price-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.price-label {
    font-size: 24rpx;
    color: #999999;
}

.price-value {
    font-size: 28rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.price-item.total .price-label {
    color: #2c2c2c;
    font-weight: 600;
}

.price-item.total .price-value {
    font-size: 36rpx;
    color: #ffc107;
    font-weight: 600;
}

.address-section {
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 16rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.section-title {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.section-action {
    font-size: 24rpx;
    color: #ffc107;
}

.action-text {
    font-size: 24rpx;
    color: #ffc107;
}

.address-content {
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    position: relative;
}

.address-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.address-name {
    font-size: 28rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.address-phone {
    font-size: 24rpx;
    color: #666666;
}

.address-detail {
    font-size: 24rpx;
    color: #666666;
    line-height: 1.5;
}

.address-default {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
}

.default-tag {
    padding: 4rpx 12rpx;
    background: #ffc107;
    color: #ffffff;
    font-size: 20rpx;
    border-radius: 4rpx;
}

.address-empty {
    padding: 48rpx 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    text-align: center;
}

.empty-icon {
    font-size: 64rpx;
    margin-bottom: 16rpx;
}

.empty-text {
    font-size: 24rpx;
    color: #999999;
}

.order-section {
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 16rpx;
}

.order-remark {
    position: relative;
}

.remark-input {
    width: 100%;
    min-height: 120rpx;
    padding: 16rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 26rpx;
    color: #2c2c2c;
    line-height: 1.6;
}

.remark-count {
    position: absolute;
    bottom: 16rpx;
    right: 16rpx;
    font-size: 22rpx;
    color: #999999;
}

.payment-section {
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 16rpx;
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.payment-method {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;
}

.payment-method.active {
    background: rgba(255, 193, 7, 0.1);
    border-color: #ffc107;
}

.payment-method:active {
    transform: scale(0.98);
}

.payment-icon {
    font-size: 40rpx;
}

.payment-name {
    flex: 1;
    font-size: 28rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.payment-check {
    width: 32rpx;
    height: 32rpx;
    background: #ffc107;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.check-icon {
    font-size: 20rpx;
    color: #ffffff;
    line-height: 1;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #ffffff;
    border-top: 1rpx solid rgba(0, 0, 0, 0.04);
    padding: 16rpx 32rpx;
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}

.bar-content {
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.total-info {
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 8rpx;
}

.total-label {
    font-size: 26rpx;
    color: #666666;
}

.total-price {
    font-size: 40rpx;
    color: #ffc107;
    font-weight: 600;
}

.submit-btn {
    flex: 1;
    height: 88rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
    transition: all 0.3s ease;
}

.submit-btn.disabled {
    opacity: 0.6;
    pointer-events: none;
}

.submit-btn:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.15);
}

.btn-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 500;
}
</style>
