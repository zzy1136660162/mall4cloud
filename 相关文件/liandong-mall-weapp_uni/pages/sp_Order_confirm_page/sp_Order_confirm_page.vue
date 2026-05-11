<template>
    <view class="order-confirm-page">
        <view class="page-background"></view>

        <scroll-view class="confirm-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="confirm-content">
                <view class="address-section">
                    <view class="section-header">
                        <text class="section-title">收货地址</text>
                        <view class="edit-btn" @tap="editAddress">
                            <text class="edit-text">编辑</text>
                        </view>
                    </view>

                    <view class="address-card" @tap="selectAddress">
                        <view class="address-icon">
                            <text class="icon">📍</text>
                        </view>
                        <view class="address-info">
                            <view class="address-user">
                                <text class="user-name">{{ address.name }}</text>
                                <text class="user-phone">{{ address.phone }}</text>
                            </view>
                            <view class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</view>
                        </view>
                        <view class="address-arrow">
                            <text class="arrow">›</text>
                        </view>
                    </view>
                </view>

                <view class="products-section">
                    <view class="section-header">
                        <text class="section-title">商品信息</text>
                        <text class="product-count">共{{ orderItems.length }}件</text>
                    </view>

                    <view class="products-list">
                        <view class="product-item" v-for="(item, index) in orderItems" :key="index">
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
                    <view class="price-row">
                        <text class="price-label">商品金额</text>
                        <text class="price-value">¥{{ totalAmount }}</text>
                    </view>
                    <view class="price-row">
                        <text class="price-label">运费</text>
                        <text class="price-value">{{ shippingFee > 0 ? '¥' + shippingFee : '免运费' }}</text>
                    </view>
                    <view class="price-row" v-if="discountAmount > 0">
                        <text class="price-label">优惠金额</text>
                        <text class="price-value discount">-¥{{ discountAmount }}</text>
                    </view>
                    <view class="price-row total-row">
                        <text class="price-label total-label">实付金额</text>
                        <view class="total-value">
                            <text class="currency">¥</text>
                            <text class="total-price">{{ finalAmount }}</text>
                        </view>
                    </view>
                </view>

                <view class="remark-section">
                    <view class="section-header">
                        <text class="section-title">订单备注</text>
                    </view>
                    <view class="remark-input-wrapper">
                        <input class="remark-input" type="text" placeholder="选填，请输入备注信息" :value="remark" @input="onRemarkInput" maxlength="100" />
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="confirm-footer">
            <view class="footer-content">
                <view class="total-info">
                    <text class="total-label">合计：</text>
                    <view class="total-amount">
                        <text class="currency">¥</text>
                        <text class="amount">{{ finalAmount }}</text>
                    </view>
                </view>

                <view class="submit-btn" @tap="submitOrder">
                    <text class="submit-text">提交订单</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const cartApi = require('../../utils/sp_api.js').cartApi;
const orderApi = require('../../utils/sp_api.js').orderApi;
const addressApi = require('../../utils/sp_api.js').addressApi;
export default {
    data() {
        return {
            address: {
                addressId: null,
                name: '张三',
                phone: '138****8888',
                province: '北京市',
                city: '北京市',
                district: '朝阳区',
                detail: 'xxx街道xxx号'
            },
            orderItems: [],
            totalAmount: 0,
            shippingFee: 0,
            discountAmount: 0,
            finalAmount: 0,
            remark: '',
            useMockData: false
        };
    },
    onLoad(options) {
        // 监听来自商品详情页的事件
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
            eventChannel.on('orderDataFromProduct', (data) => {
                // 从商品详情页直接购买
                if (data && data.from === 'buyNow') {
                    this.setData({
                        useMockData: false
                    });
                    this.handleBuyNowData(data.orderItems);
                    return;
                }
            });
        }

        // 正常从购物车加载
        this.loadOrderItems();
        this.loadDefaultAddress();
    },
    onShow() {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage.data.selectedAddress) {
            this.setData({
                address: currentPage.data.selectedAddress
            });
        }
    },
    methods: {
        async loadOrderItems() {
            try {
                const res = await cartApi.getCartList();
                const cartList = res || [];
                const selectedItems = cartList.filter((item) => item.selected);
                if (selectedItems.length === 0) {
                    this.setData({
                        useMockData: true
                    });
                    this.loadMockData();
                    return;
                }
                const totalAmount = selectedItems
                    .reduce((sum, item) => {
                        return sum + item.price * item.quantity;
                    }, 0)
                    .toFixed(2);
                const shippingFee = totalAmount >= 99 ? 0 : 10;
                const discountAmount = 0;
                const finalAmount = (parseFloat(totalAmount) + shippingFee - discountAmount).toFixed(2);
                this.setData({
                    orderItems: selectedItems,
                    totalAmount,
                    shippingFee,
                    discountAmount,
                    finalAmount,
                    useMockData: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载订单商品失败:', error);
                this.setData({
                    useMockData: true
                });
                this.loadMockData();
            }
        },

        loadMockData() {
            const mockOrderItems = [
                {
                    productId: 42,
                    productName: '焕颜修护精华液',
                    mainImage: 'https://images.unsplash.com/photo-1522335789203-aabd016d8d3?w=400&h=400&fit=crop',
                    specs: '30ml',
                    price: 299,
                    quantity: 2
                },
                {
                    productId: 43,
                    productName: '深层清洁洁面乳',
                    mainImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
                    specs: '100ml',
                    price: 158,
                    quantity: 1
                },
                {
                    productId: 44,
                    productName: '保湿修护面霜',
                    mainImage: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
                    specs: '50g',
                    price: 358,
                    quantity: 1
                }
            ];
            const totalAmount = mockOrderItems
                .reduce((sum, item) => {
                    return sum + item.price * item.quantity;
                }, 0)
                .toFixed(2);
            const shippingFee = totalAmount >= 99 ? 0 : 10;
            const discountAmount = 0;
            const finalAmount = (parseFloat(totalAmount) + shippingFee - discountAmount).toFixed(2);
            this.setData({
                orderItems: mockOrderItems,
                totalAmount,
                shippingFee,
                discountAmount,
                finalAmount
            });
        },

        // 处理直接购买的数据
        handleBuyNowData(orderItems) {
            // 计算总金额
            const totalAmount = orderItems
                .reduce((sum, item) => {
                    return sum + item.price * item.quantity;
                }, 0)
                .toFixed(2);

            // 计算运费（满99免运费）
            const shippingFee = totalAmount >= 99 ? 0 : 10;
            const discountAmount = 0;
            const finalAmount = (parseFloat(totalAmount) + shippingFee - discountAmount).toFixed(2);
            this.setData({
                orderItems,
                totalAmount,
                shippingFee,
                discountAmount,
                finalAmount
            });
        },

        async loadDefaultAddress() {
            try {
                const res = await addressApi.getAddressList();
                if (res && res.length > 0) {
                    const defaultAddress = res.find((item) => item.isDefault) || res[0];
                    this.setData({
                        address: {
                            addressId: defaultAddress.addressId,
                            name: defaultAddress.name,
                            phone: defaultAddress.phone,
                            province: defaultAddress.province,
                            city: defaultAddress.city,
                            district: defaultAddress.district,
                            detail: defaultAddress.detail
                        }
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载默认地址失败:', error);
            }
        },

        editAddress() {
            const { address } = this;
            if (address.addressId) {
                uni.navigateTo({
                    url: `/pages/sp_Address_edit_page/sp_Address_edit_page?id=${address.addressId}`
                });
            } else {
                uni.navigateTo({
                    url: '/pages/sp_Address_edit_page/sp_Address_edit_page'
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

        async submitOrder() {
            const { orderItems, address, finalAmount, remark } = this;
            if (!address || !address.name) {
                uni.showToast({
                    title: '请选择收货地址',
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: '提交中...'
            });
            try {
                const orderData = {
                    items: orderItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    address: {
                        name: address.name,
                        phone: address.phone,
                        detail: address.detail
                    },
                    totalAmount: this.totalAmount,
                    shippingFee: this.shippingFee,
                    discountAmount: this.discountAmount,
                    finalAmount: finalAmount,
                    remark: remark
                };
                const res = await orderApi.createOrder(orderData);
                uni.hideLoading();
                if (res.code === 200) {
                    uni.showToast({
                        title: '订单提交成功',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        uni.redirectTo({
                            url: `/pages/sp_Order_detail_page/sp_Order_detail_page?id=${res.data.orderId}`
                        });
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.message || '提交失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('提交订单失败:', error);
                uni.showToast({
                    title: '提交失败',
                    icon: 'none'
                });
            }
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.order-confirm-page {
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

.confirm-scroll {
    height: 100vh;
    padding-bottom: 160rpx;
    background: #fafafa;
}

.confirm-content {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding: 20rpx;
}

.address-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
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

.edit-btn {
    padding: 8rpx 24rpx;
    background: #fafafa;
    border-radius: 40rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.edit-btn:active {
    transform: scale(0.95);
    background: #f5f5f5;
}

.edit-text {
    font-size: 24rpx;
    color: #666666;
    font-weight: 500;
}

.address-card {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 20rpx;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.04) 0%, rgba(255, 193, 7, 0.02) 100%);
    border-radius: 12rpx;
    border: 1rpx solid rgba(255, 193, 7, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.address-card:active {
    transform: scale(0.98);
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.04) 100%);
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

.icon {
    font-size: 28rpx;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 0.3rpx;
}

.address-arrow {
    flex-shrink: 0;
}

.arrow {
    font-size: 48rpx;
    color: #cccccc;
    font-weight: 300;
}

.products-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.1s both;
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
    animation: sectionFadeIn 0.5s ease 0.2s both;
}

.price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 0;
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

.remark-section {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    animation: sectionFadeIn 0.5s ease 0.3s both;
}

.remark-input-wrapper {
    background: #fafafa;
    border-radius: 12rpx;
    padding: 20rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.remark-input-wrapper:focus-within {
    border-color: #ffc107;
    background: #ffffff;
    box-shadow: 0 0 0 4rpx rgba(255, 193, 7, 0.1);
}

.remark-input {
    width: 100%;
    font-size: 28rpx;
    color: #333333;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.confirm-footer {
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
    justify-content: space-between;
    padding: 24rpx 40rpx;
}

.total-info {
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
    font-size: 40rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.submit-btn {
    padding: 24rpx 64rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 48rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.3);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.2);
}

.submit-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx;
}
</style>
