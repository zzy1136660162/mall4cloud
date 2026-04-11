<template>
    <view class="sp-spec-selector-mask" v-if="show" @tap="onClose">
        <view class="sp-spec-selector-container" @tap.stop.prevent="stopPropagation">
            <view class="sp-spec-selector-header">
                <text class="sp-spec-selector-title">选择规格</text>
                <view class="sp-spec-selector-close" @tap="onClose">
                    <text class="sp-spec-selector-close-icon">×</text>
                </view>
            </view>

            <scroll-view class="sp-spec-selector-content" :scroll-y="true">
                <view class="sp-spec-product-info">
                    <image class="sp-spec-product-image" :src="product.mainImage" mode="aspectFill" />
                    <view class="sp-spec-product-details">
                        <view class="sp-spec-product-price">
                            <text class="sp-spec-price-symbol">¥</text>
                            <text class="sp-spec-price-value">{{ selectedPrice }}</text>
                        </view>
                        <view class="sp-spec-product-stock">
                            <text class="sp-spec-stock-label">库存:</text>
                            <text class="sp-spec-stock-value">{{ selectedStock }}</text>
                        </view>
                    </view>
                </view>

                <view class="sp-spec-list">
                    <view class="sp-spec-item" v-for="(item, index) in product.specs" :key="index">
                        <view class="sp-spec-name">{{ item.name }}</view>

                        <view class="sp-spec-values">
                            <view
                                :class="'sp-spec-value ' + (selectedSpecs[item.name] === value ? 'active' : '')"
                                @tap="onSelectSpec"
                                :data-name="item.name"
                                :data-value="value"
                                v-for="(value, index1) in item.values"
                                :key="index1"
                            >
                                {{ value }}
                            </view>
                        </view>
                    </view>
                </view>

                <view class="sp-spec-quantity">
                    <text class="sp-spec-quantity-label">购买数量</text>
                    <view class="sp-spec-quantity-controls">
                        <view :class="'sp-spec-quantity-btn ' + (quantity <= 1 ? 'disabled' : '')" @tap="onDecrease">
                            <text class="sp-spec-quantity-icon">-</text>
                        </view>
                        <view class="sp-spec-quantity-value">{{ quantity }}</view>
                        <view :class="'sp-spec-quantity-btn ' + (quantity >= selectedStock ? 'disabled' : '')" @tap="onIncrease">
                            <text class="sp-spec-quantity-icon">+</text>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <view class="sp-spec-selector-footer">
                <view class="sp-spec-total">
                    <text class="sp-spec-total-label">合计:</text>
                    <text class="sp-spec-total-price">¥{{ totalPrice }}</text>
                </view>
                <view class="sp-spec-actions">
                    <view class="sp-spec-btn sp-spec-btn-secondary" @tap="onAddToCart">
                        <text class="sp-spec-btn-text">加入购物车</text>
                    </view>
                    <view class="sp-spec-btn sp-spec-btn-primary" @tap="onBuyNow">
                        <text class="sp-spec-btn-text">立即购买</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            selectedSpecs: {},
            quantity: 1,
            selectedPrice: 0,
            selectedStock: 0,
            totalPrice: 0,
            value: ''
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        product: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        product_selectedSpecs: {
            deep: true,
            immediate: true,

            handler: function (newValue, oldValue) {
                const { product, selectedSpecs } = newValue;

                this.updatePriceAndStock();
            }
        },
        quantity: function (quantity) {
            this.updateTotalPrice();
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
        stopPropagation() {},
        onSelectSpec(e) {
            const { name, value } = e.currentTarget.dataset;
            const selectedSpecs = {
                ...this.selectedSpecs
            };
            selectedSpecs[name] = value;
            this.setData({
                selectedSpecs
            });
        },
        onDecrease() {
            const quantity = this.quantity;
            if (quantity > 1) {
                this.setData({
                    quantity: quantity - 1
                });
            }
        },
        onIncrease() {
            const quantity = this.quantity;
            const selectedStock = this.selectedStock;
            if (quantity < selectedStock) {
                this.setData({
                    quantity: quantity + 1
                });
            }
        },
        updatePriceAndStock() {
            const product = this.product;
            const selectedSpecs = this.selectedSpecs;
            if (!product.skus || product.skus.length === 0) {
                this.setData({
                    selectedPrice: product.price || 0,
                    selectedStock: product.stock || 0
                });
                this.updateTotalPrice();
                return;
            }
            let matchedSku = null;
            for (const sku of product.skus) {
                if (!sku.spec) {
                    continue;
                }
                let isMatch = true;
                for (const key in selectedSpecs) {
                    if (sku.spec[key] !== selectedSpecs[key]) {
                        isMatch = false;
                        break;
                    }
                }
                if (isMatch) {
                    matchedSku = sku;
                    break;
                }
            }
            if (matchedSku) {
                this.setData({
                    selectedPrice: matchedSku.price,
                    selectedStock: matchedSku.stock
                });
            } else {
                this.setData({
                    selectedPrice: product.price,
                    selectedStock: product.stock
                });
            }
            this.updateTotalPrice();
        },
        updateTotalPrice() {
            const selectedPrice = this.selectedPrice;
            const quantity = this.quantity;
            const totalPrice = (selectedPrice * quantity).toFixed(2);
            this.setData({
                totalPrice
            });
        },
        onAddToCart() {
            if (!this.validateSelection()) {
                return;
            }
            const { selectedSpecs, quantity } = this;
            const product = this.product;
            let skuId = null;
            if (product.skus && product.skus.length > 0) {
                for (const sku of product.skus) {
                    if (!sku.spec) {
                        continue;
                    }
                    let isMatch = true;
                    for (const key in selectedSpecs) {
                        if (sku.spec[key] !== selectedSpecs[key]) {
                            isMatch = false;
                            break;
                        }
                    }
                    if (isMatch) {
                        skuId = sku.skuId;
                        break;
                    }
                }
            }
            this.$emit('addtocart', {
                detail: {
                    productId: product.id,
                    skuId: skuId,
                    quantity: quantity,
                    specs: selectedSpecs
                }
            });
        },
        onBuyNow() {
            if (!this.validateSelection()) {
                return;
            }
            const { selectedSpecs, quantity } = this;
            const product = this.product;
            let skuId = null;
            if (product.skus && product.skus.length > 0) {
                for (const sku of product.skus) {
                    if (!sku.spec) {
                        continue;
                    }
                    let isMatch = true;
                    for (const key in selectedSpecs) {
                        if (sku.spec[key] !== selectedSpecs[key]) {
                            isMatch = false;
                            break;
                        }
                    }
                    if (isMatch) {
                        skuId = sku.skuId;
                        break;
                    }
                }
            }
            this.$emit('buynow', {
                detail: {
                    productId: product.id,
                    skuId: skuId,
                    quantity: quantity,
                    specs: selectedSpecs,
                    price: this.selectedPrice,
                    totalPrice: this.totalPrice
                }
            });
        },
        validateSelection() {
            const product = this.product;
            const selectedSpecs = this.selectedSpecs;
            if (product.specs && product.specs.length > 0) {
                for (const spec of product.specs) {
                    if (!selectedSpecs[spec.name]) {
                        uni.showToast({
                            title: `请选择${spec.name}`,
                            icon: 'none',
                            duration: 2000
                        });
                        return false;
                    }
                }
            }
            return true;
        }
    },
    created: function () {},
    computed: {
        product_selectedSpecs() {
            const { product, selectedSpecs } = this;

            return {
                product,
                selectedSpecs
            };
        }
    }
};
</script>
<style>
.sp-spec-selector-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
}

.sp-spec-selector-container {
    width: 100%;
    background: #ffffff;
    border-radius: 32rpx 32rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

.sp-spec-selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.sp-spec-selector-title {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.sp-spec-selector-close {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sp-spec-selector-close-icon {
    font-size: 48rpx;
    color: #999999;
    line-height: 1;
}

.sp-spec-selector-content {
    flex: 1;
    padding: 32rpx;
    overflow-y: auto;
}

.sp-spec-product-info {
    display: flex;
    gap: 24rpx;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    margin-bottom: 32rpx;
}

.sp-spec-product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
}

.sp-spec-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12rpx;
}

.sp-spec-product-price {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
}

.sp-spec-price-symbol {
    font-size: 24rpx;
    color: #ffc107;
    font-weight: 600;
}

.sp-spec-price-value {
    font-size: 40rpx;
    color: #ffc107;
    font-weight: 600;
}

.sp-spec-product-stock {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.sp-spec-stock-label {
    font-size: 24rpx;
    color: #999999;
}

.sp-spec-stock-value {
    font-size: 24rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.sp-spec-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    margin-bottom: 32rpx;
}

.sp-spec-item {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.sp-spec-name {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.sp-spec-values {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.sp-spec-value {
    padding: 16rpx 28rpx;
    background: #f5f5f5;
    color: #666666;
    font-size: 24rpx;
    border-radius: 8rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;
}

.sp-spec-value.active {
    background: #ffc107;
    color: #ffffff;
    border-color: #ffc107;
}

.sp-spec-value:active {
    transform: scale(0.95);
}

.sp-spec-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    margin-bottom: 32rpx;
}

.sp-spec-quantity-label {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.sp-spec-quantity-controls {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.sp-spec-quantity-btn {
    width: 64rpx;
    height: 64rpx;
    background: #ffffff;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2rpx solid #e0e0e0;
    transition: all 0.3s ease;
}

.sp-spec-quantity-btn.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.sp-spec-quantity-btn:active {
    transform: scale(0.95);
    background: #f5f5f5;
}

.sp-spec-quantity-icon {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
    line-height: 1;
}

.sp-spec-quantity-value {
    min-width: 80rpx;
    text-align: center;
    font-size: 28rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.sp-spec-selector-footer {
    padding: 24rpx 32rpx;
    border-top: 1rpx solid #f5f5f5;
    background: #ffffff;
}

.sp-spec-total {
    display: flex;
    align-items: baseline;
    gap: 8rpx;
    margin-bottom: 24rpx;
}

.sp-spec-total-label {
    font-size: 26rpx;
    color: #666666;
}

.sp-spec-total-price {
    font-size: 36rpx;
    color: #ffc107;
    font-weight: 600;
}

.sp-spec-actions {
    display: flex;
    gap: 16rpx;
}

.sp-spec-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.sp-spec-btn:active {
    transform: scale(0.98);
}

.sp-spec-btn-secondary {
    background: #f5f5f5;
}

.sp-spec-btn-secondary:active {
    background: #e8e8e8;
}

.sp-spec-btn-primary {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
}

.sp-spec-btn-primary:active {
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.15);
}

.sp-spec-btn-text {
    font-size: 28rpx;
    font-weight: 500;
}

.sp-spec-btn-primary .sp-spec-btn-text {
    color: #ffffff;
}
</style>
