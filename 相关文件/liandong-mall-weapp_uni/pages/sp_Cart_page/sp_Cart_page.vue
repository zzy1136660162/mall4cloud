<template>
    <view class="cart-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-title">购物车</view>
                <view class="header-actions">
                    <view class="action-btn edit-btn" @tap="toggleEditMode">
                        <text class="action-text">{{ editMode ? '完成' : '编辑' }}</text>
                    </view>
                    <view class="action-btn" @tap="selectAll">
                        <text class="action-text">{{ allSelected ? '取消全选' : '全选' }}</text>
                    </view>
                    <view class="action-btn delete-btn" v-if="editMode" @tap="deleteSelected">
                        <text class="action-text">删除</text>
                    </view>
                </view>
            </view>
        </view>

        <scroll-view class="cart-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="cart-content">
                <view v-if="cartList.length === 0" class="empty-state">
                    <text class="empty-emoji">🛒</text>
                    <text class="empty-title">购物车空空如也</text>
                    <text class="empty-desc">快去添加心仪的商品吧</text>
                    <view class="empty-action">
                        <view class="go-shopping-btn" @tap="goToShopping">
                            <text class="go-shopping-text">去逛逛</text>
                        </view>
                    </view>
                </view>

                <view v-else class="cart-list">
                    <view :class="'cart-item ' + (item.selected ? 'selected' : '')" v-for="(item, index) in cartList" :key="index">
                        <view class="item-checkbox" @tap="toggleSelect" :data-id="item.cartId">
                            <view :class="'checkbox ' + (item.selected ? 'checked' : '')">
                                <text class="check-icon">{{ item.selected ? '✓' : '' }}</text>
                            </view>
                        </view>

                        <view class="item-content" @tap="goToDetail" :data-id="item.productId">
                            <view class="item-image-wrapper">
                                <image class="item-image" :src="item.mainImage" mode="aspectFill" :lazy-load="true" />
                            </view>

                            <view class="item-info">
                                <view class="item-name">{{ item.productName }}</view>
                                <view class="item-specs" v-if="item.specs">{{ item.specs }}</view>
                                <view class="item-price">
                                    <text class="currency">¥</text>
                                    <text class="price">{{ item.price }}</text>
                                </view>
                            </view>
                        </view>

                        <view class="item-actions">
                            <view class="quantity-control">
                                <view class="quantity-btn" @tap="decreaseQuantity" :data-id="item.cartId">
                                    <text class="quantity-icon">−</text>
                                </view>
                                <view class="quantity-value">{{ item.quantity }}</view>
                                <view class="quantity-btn" @tap="increaseQuantity" :data-id="item.cartId">
                                    <text class="quantity-icon">+</text>
                                </view>
                            </view>
                            <view class="item-delete" v-if="editMode" @tap="deleteItem" :data-id="item.cartId">
                                <text class="delete-icon">×</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="cart-footer" v-if="cartList.length > 0">
            <view class="footer-content">
                <view class="select-info">
                    <text class="select-text">已选</text>
                    <text class="select-count">{{ selectedCount }}件</text>
                </view>

                <view class="price-info">
                    <view class="price-label">合计：</view>
                    <view class="price-value">
                        <text class="currency">¥</text>
                        <text class="total-price">{{ totalPrice }}</text>
                    </view>
                </view>

                <view class="checkout-btn" @tap="goToCheckout">
                    <text class="checkout-text">去结算</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const cartApi = require('../../utils/sp_api.js').cartApi;
const { checkLogin, getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    data() {
        return {
            cartList: [],
            allSelected: false,
            selectedCount: 0,
            totalPrice: 0,
            useMockData: false,
            editMode: false,
            isLoggedIn: false
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
        this.loadCart();
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (loginStatus.isLoggedIn) {
            this.loadCart();
        }
    },
    onPullDownRefresh() {
        this.loadCart().then(() => {
            uni.stopPullDownRefresh();
        });
    },
    methods: {
        async loadCart() {
            try {
                console.log('开始加载购物车...');
                const res = await cartApi.getCartList();
                console.log('购物车API返回数据:', res);
                const cartList = (res || []).map((item) => ({
                    ...item,
                    selected: false
                }));
                console.log('处理后的购物车数据:', cartList);
                this.setData({
                    cartList,
                    useMockData: false
                });
                this.calculateTotal();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载购物车失败:', error);
                this.setData({
                    useMockData: true
                });
                this.loadMockData();
            }
        },

        loadMockData() {
            const mockCartList = [
                {
                    cartId: 1,
                    productId: 42,
                    productName: '焕颜修护精华液',
                    mainImage: 'https://images.unsplash.com/photo-1522335789203-aabd016d8d3?w=400&h=400&fit=crop',
                    specs: '30ml',
                    price: 299,
                    quantity: 2,
                    selected: false
                },
                {
                    cartId: 2,
                    productId: 43,
                    productName: '深层清洁洁面乳',
                    mainImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
                    specs: '100ml',
                    price: 158,
                    quantity: 1,
                    selected: false
                },
                {
                    cartId: 3,
                    productId: 44,
                    productName: '保湿修护面霜',
                    mainImage: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
                    specs: '50g',
                    price: 358,
                    quantity: 1,
                    selected: false
                },
                {
                    cartId: 4,
                    productId: 45,
                    productName: '舒缓修护精华水',
                    mainImage: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc8?w=400&h=400&fit=crop',
                    specs: '150ml',
                    price: 228,
                    quantity: 3,
                    selected: false
                },
                {
                    cartId: 5,
                    productId: 46,
                    productName: '紧致抗皱眼霜',
                    mainImage: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=400&fit=crop',
                    specs: '15g',
                    price: 268,
                    quantity: 1,
                    selected: false
                }
            ];
            this.setData({
                cartList: mockCartList
            });
            this.calculateTotal();
        },

        toggleSelect(e) {
            const { id } = e.currentTarget.dataset;
            const { cartList } = this;
            const index = cartList.findIndex((item) => item.cartId === id);
            if (index !== -1) {
                cartList[index].selected = !cartList[index].selected;
                this.setData({
                    cartList
                });
                this.calculateTotal();
            }
        },

        selectAll() {
            const { cartList, allSelected } = this;
            cartList.forEach((item) => {
                item.selected = !allSelected;
            });
            this.setData({
                cartList,
                allSelected: !allSelected
            });
            this.calculateTotal();
        },

        toggleEditMode() {
            const { editMode } = this;
            this.setData({
                editMode: !editMode
            });
        },

        calculateTotal() {
            const { cartList } = this;
            const selectedItems = cartList.filter((item) => item.selected);
            const selectedCount = selectedItems.length;
            const totalPrice = selectedItems
                .reduce((sum, item) => {
                    return sum + item.price * item.quantity;
                }, 0)
                .toFixed(2);
            const allSelected = cartList.length > 0 && cartList.every((item) => item.selected);
            this.setData({
                selectedCount,
                totalPrice,
                allSelected
            });
        },

        async increaseQuantity(e) {
            const { id } = e.currentTarget.dataset;
            const { cartList } = this;
            const index = cartList.findIndex((item) => item.cartId === id);
            if (index !== -1) {
                const newQuantity = cartList[index].quantity + 1;
                try {
                    await cartApi.updateCartQuantity(id, newQuantity);
                    cartList[index].quantity = newQuantity;
                    this.setData({
                        cartList
                    });
                    this.calculateTotal();
                } catch (error) {
                    console.log('CatchClause', error);
                    console.log('CatchClause', error);
                    console.error('更新数量失败:', error);
                    uni.showToast({
                        title: '更新失败',
                        icon: 'none'
                    });
                }
            }
        },

        async decreaseQuantity(e) {
            const { id } = e.currentTarget.dataset;
            const { cartList } = this;
            const index = cartList.findIndex((item) => item.cartId === id);
            if (index !== -1 && cartList[index].quantity > 1) {
                const newQuantity = cartList[index].quantity - 1;
                try {
                    await cartApi.updateCartQuantity(id, newQuantity);
                    cartList[index].quantity = newQuantity;
                    this.setData({
                        cartList
                    });
                    this.calculateTotal();
                } catch (error) {
                    console.log('CatchClause', error);
                    console.log('CatchClause', error);
                    console.error('更新数量失败:', error);
                    uni.showToast({
                        title: '更新失败',
                        icon: 'none'
                    });
                }
            }
        },

        async deleteItem(e) {
            const { id } = e.currentTarget.dataset;
            console.log('准备删除购物车商品, cartId:', id);
            uni.showModal({
                title: '提示',
                content: '确定要删除该商品吗？',
                success: async (res) => {
                    if (res.confirm) {
                        console.log('用户确认删除, cartId:', id);
                        try {
                            console.log('调用删除API...');
                            const result = await cartApi.deleteCartItem(id);
                            console.log('删除API返回:', result);
                            const { cartList } = this;
                            const newCartList = cartList.filter((item) => item.cartId !== id);
                            console.log('删除前商品数:', cartList.length, '删除后商品数:', newCartList.length);
                            this.setData({
                                cartList: newCartList
                            });
                            this.calculateTotal();
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                        } catch (error) {
                            console.log('CatchClause', error);
                            console.log('CatchClause', error);
                            console.error('删除失败, 错误:', error);
                            uni.showToast({
                                title: '删除失败',
                                icon: 'none'
                            });
                        }
                    } else {
                        console.log('用户取消删除');
                    }
                }
            });
        },

        deleteSelected() {
            const { cartList } = this;
            const selectedItems = cartList.filter((item) => item.selected);
            if (selectedItems.length === 0) {
                uni.showToast({
                    title: '请先选择商品',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '提示',
                content: `确定要删除${selectedItems.length}件商品吗？`,
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await Promise.all(selectedItems.map((item) => cartApi.deleteCartItem(item.cartId)));
                            const newCartList = cartList.filter((item) => !item.selected);
                            this.setData({
                                cartList: newCartList
                            });
                            this.calculateTotal();
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                        } catch (error) {
                            console.log('CatchClause', error);
                            console.log('CatchClause', error);
                            console.error('批量删除失败:', error);
                            uni.showToast({
                                title: '删除失败',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        },

        goToShopping() {
            uni.switchTab({
                url: '/pages/Product_list_page/Product_list_page'
            });
        },

        goToCheckout() {
            if (
                !checkLogin({
                    showToast: false
                })
            ) {
                checkLogin({
                    showToast: true
                });
                return;
            }
            const { cartList } = this;
            const selectedItems = cartList.filter((item) => item.selected);
            if (selectedItems.length === 0) {
                uni.showToast({
                    title: '请先选择商品',
                    icon: 'none'
                });
                return;
            }
            uni.navigateTo({
                url: '/pages/sp_Order_confirm_page/sp_Order_confirm_page'
            });
        },

        goToDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
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

.cart-page {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 40rpx;
}

.header-title {
    font-size: 44rpx;
    color: #2c2c2c;
    font-weight: 600;
    letter-spacing: 2rpx;
}

.header-actions {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    padding: 16rpx 32rpx;
    background: #fafafa;
    border-radius: 40rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeIn 0.5s ease;
}

.action-btn.edit-btn {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-color: #ffc107;
}

.action-btn.edit-btn:active {
    background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.2);
}

.action-btn.edit-btn .action-text {
    color: #ffffff;
    font-weight: 600;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(-10rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.action-btn:active {
    transform: scale(0.95);
    background: #f5f5f5;
}

.action-btn.delete-btn {
    border-color: rgba(255, 107, 7, 0.3);
}

.action-btn.delete-btn:active {
    background: rgba(255, 107, 7, 0.1);
}

.action-text {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
    letter-spacing: 0.5rpx;
}

.cart-scroll {
    height: 100vh;
    padding-top: 120rpx;
    padding-bottom: 160rpx;
    background: #fafafa;
}

.cart-content {
    padding: 20rpx 0;
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

.cart-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding: 0 20rpx;
}

.cart-item {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: itemSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20rpx);
}

.cart-item:nth-child(1) {
    animation-delay: 0s;
}

.cart-item:nth-child(2) {
    animation-delay: 0.08s;
}

.cart-item:nth-child(3) {
    animation-delay: 0.16s;
}

.cart-item:nth-child(4) {
    animation-delay: 0.24s;
}

.cart-item:nth-child(5) {
    animation-delay: 0.32s;
}

.cart-item:nth-child(6) {
    animation-delay: 0.4s;
}

.cart-item:nth-child(7) {
    animation-delay: 0.48s;
}

.cart-item:nth-child(8) {
    animation-delay: 0.56s;
}

.cart-item:nth-child(9) {
    animation-delay: 0.64s;
}

.cart-item:nth-child(10) {
    animation-delay: 0.72s;
}

@keyframes itemSlideIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.cart-item.selected {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.04) 0%, rgba(255, 193, 7, 0.02) 100%);
    border: 1rpx solid rgba(255, 193, 7, 0.2);
    box-shadow: 0 4rpx 20rpx rgba(255, 193, 7, 0.12);
}

.cart-item:active {
    transform: scale(0.98);
}

.item-checkbox {
    flex-shrink: 0;
    margin-right: 16rpx;
}

.checkbox {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #fafafa;
    border: 2rpx solid rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox.checked {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-color: #ffc107;
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.3);
}

.check-icon {
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 600;
}

.item-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16rpx;
    transition: all 0.3s ease;
}

.item-image-wrapper {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background: #fafafa;
    flex-shrink: 0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.item-image {
    width: 100%;
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-content:active .item-image {
    transform: scale(1.05);
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;
}

.item-name {
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

.item-specs {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.2rpx;
}

.item-price {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
}

.currency {
    font-size: 22rpx;
    color: #ffc107;
    font-weight: 600;
}

.price {
    font-size: 36rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.item-actions {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: #fafafa;
    border-radius: 40rpx;
    padding: 8rpx 12rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
}

.quantity-btn {
    width: 48rpx;
    height: 48rpx;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quantity-btn:active {
    transform: scale(0.9);
    box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
}

.quantity-icon {
    font-size: 32rpx;
    color: #666666;
    font-weight: 300;
    line-height: 1;
}

.quantity-value {
    min-width: 60rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333333;
    font-weight: 600;
}

.item-delete {
    width: 48rpx;
    height: 48rpx;
    background: rgba(255, 107, 7, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.item-delete:active {
    transform: scale(0.9);
    background: rgba(255, 107, 7, 0.2);
}

.delete-icon {
    font-size: 32rpx;
    color: #ffc107;
    font-weight: 300;
    line-height: 1;
}

.cart-footer {
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

.select-info {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.select-text {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.select-count {
    font-size: 28rpx;
    color: #ffc107;
    font-weight: 700;
}

.price-info {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.price-label {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.price-value {
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

.checkout-btn {
    padding: 24rpx 64rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 48rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.3);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkout-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.2);
}

.checkout-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx;
}
</style>
