<template>
    <view>
        <view class="page">
            <!-- 顶部渐变背景 -->
            <view class="header-bg">
                <view class="header-content">
                    <view class="header-icon">🎁</view>
                    <view class="header-title">免费申请样品</view>
                    <view class="header-subtitle">申请成功后商家将免费寄送样品</view>
                </view>
            </view>

            <!-- 已选商品卡片 -->
            <view class="card products-card">
                <view class="card-header">
                    <view class="header-left">
                        <text class="required">*</text>
                        <text class="card-title">申请商品</text>
                    </view>
                    <text class="card-subtitle">{{ selectedProducts.length }}件商品</text>
                </view>

                <view class="products-list">
                    <view class="product-item" v-for="(item, index) in selectedProducts" :key="index">
                        <view class="product-image-wrap">
                            <image class="product-image" :src="item.image" mode="aspectFill" />
                        </view>

                        <view class="product-info">
                            <text class="product-name">{{ item.name }}</text>
                            <view class="product-meta">
                                <text class="product-price">¥{{ item.price }}</text>
                                <text class="product-commission">佣金{{ item.commissionRate }}%</text>
                            </view>
                        </view>

                        <view class="product-remove" @tap="removeProduct" :data-id="item.id">
                            <text class="remove-icon">✕</text>
                        </view>
                    </view>
                </view>

                <view class="add-product" @tap="addProduct">
                    <view class="add-btn">
                        <text class="add-icon">+</text>
                        <text class="add-text">添加更多商品</text>
                    </view>
                </view>
            </view>

            <!-- 收件信息卡片 -->
            <view class="card info-card">
                <view class="card-header">
                    <view class="header-left">
                        <text class="required">*</text>
                        <text class="card-title">收件信息</text>
                    </view>
                    <view class="header-right" @tap="selectAddress">
                        <text class="select-address">选择地址</text>
                        <text class="arrow">></text>
                    </view>
                </view>

                <view class="form-list">
                    <view class="form-item">
                        <view class="form-label">
                            <text class="label-icon">👤</text>
                            <text class="label-text">收件人</text>
                        </view>
                        <input class="form-input" placeholder="请输入姓名" :value="formData.name" @input="onNameInput" />
                    </view>

                    <view class="form-item">
                        <view class="form-label">
                            <text class="label-icon">📱</text>
                            <text class="label-text">手机号</text>
                        </view>
                        <input class="form-input" placeholder="请输入手机号" type="number" maxlength="11" :value="formData.phone" @input="onPhoneInput" />
                    </view>

                    <view class="form-item">
                        <view class="form-label">
                            <text class="label-icon">📍</text>
                            <text class="label-text">所在地区</text>
                        </view>
                        <region-picker @change="onRegionChange" :value="formData.region">
                            <view :class="'picker-value ' + (formData.region.length === 0 ? 'placeholder' : '')">
                                {{ formData.region.length > 0 ? formData.region[0] + ' ' + formData.region[1] + ' ' + formData.region[2] : '请选择省市区' }}
                                <text class="arrow">></text>
                            </view>
                        </region-picker>
                    </view>

                    <view class="form-item address-item">
                        <view class="form-label">
                            <text class="label-icon">🏠</text>
                            <text class="label-text">详细地址</text>
                        </view>
                        <textarea class="form-textarea" placeholder="请输入街道、门牌号等详细地址" :value="formData.address" @input="onAddressInput" />
                    </view>
                </view>
            </view>

            <!-- 申请备注卡片 -->
            <view class="card remark-card">
                <view class="card-header">
                    <view class="header-left">
                        <text class="card-title">申请备注</text>
                        <text class="optional">（选填）</text>
                    </view>
                </view>
                <view class="remark-wrap">
                    <textarea
                        class="remark-input"
                        placeholder="如有特殊要求请在此说明，如：希望尽快发货、指定快递等"
                        :value="formData.remark"
                        @input="onRemarkInput"
                        maxlength="200"
                    />
                    <view class="word-count">{{ formData.remark.length }}/200</view>
                </view>
            </view>

            <!-- 申请须知卡片 -->
            <view class="card notice-card">
                <view class="card-header">
                    <view class="header-left">
                        <text class="notice-icon">📋</text>
                        <text class="card-title">申请须知</text>
                    </view>
                </view>
                <view class="notice-list">
                    <view class="notice-item" v-for="(item, index) in notices" :key="index">
                        <view class="notice-num">{{ index + 1 }}</view>

                        <text class="notice-text">{{ item }}</text>
                    </view>
                </view>
            </view>

            <!-- 底部安全区域 -->
            <view class="safe-area"></view>
        </view>

        <!-- 底部提交栏 -->
        <view class="bottom-bar">
            <view class="bottom-content">
                <view class="total-info">
                    <view class="info-item">
                        <text class="info-label">已选商品</text>
                        <text class="info-value">{{ selectedProducts.length }}件</text>
                    </view>
                    <view class="info-divider"></view>
                    <view class="info-item">
                        <text class="info-label">预计佣金</text>
                        <text class="info-value commission">¥{{ totalCommission }}</text>
                    </view>
                </view>
                <button :class="'btn-submit ' + (canSubmit ? '' : 'disabled')" @tap="submitApplication">
                    <text class="btn-text">提交申请</text>
                    <text class="btn-arrow">→</text>
                </button>
            </view>
        </view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
const sampleService = require('../../services/sampleService');
const { checkLogin, isLogin } = require('../../utils/user');
export default {
    data() {
        return {
            selectedProducts: [],

            formData: {
                name: '',
                phone: '',
                region: [],
                address: '',
                remark: ''
            },

            notices: [
                '样品申请需经过审核，审核通过后才会寄出',
                '每个达人每月最多可申请5个样品',
                '收到样品后需在7天内完成测评并发布',
                '样品仅供测评使用，禁止转售',
                '如未按时完成测评，将影响后续样品申请资格'
            ],
            canSubmit: false,
            totalCommission: '0.00',
            options: ''
        };
    },
    onLoad(options) {
        this.setData({
            options
        });

        // 检查登录状态，未登录则跳转登录页
        if (!isLogin()) {
            uni.showModal({
                title: '提示',
                content: '请先登录后再申请样品',
                confirmText: '去登录',
                success: (res) => {
                    if (res.confirm) {
                        let redirectUrl = '/pages/sample-apply/sample-apply';
                        if (options.productId) {
                            redirectUrl += `?productId=${options.productId}`;
                        }
                        uni.redirectTo({
                            url: `/pages/login/index?redirect=${encodeURIComponent(redirectUrl)}`
                        });
                    }
                }
            });
            return;
        }

        // 获取传入的商品ID
        const productId = options.productId;
        if (productId) {
            this.loadProductInfo(productId);
        }

        // 检查提交按钮状态
        this.checkCanSubmit();
    },
    methods: {
        // 加载商品信息
        async loadProductInfo(productId) {
            uni.showLoading({
                title: '加载中...'
            });
            try {
                const res = await productService.getXpProductDetail(productId);
                console.log('商品详情返回:', res);

                // 处理不同的返回格式
                let data = null;
                if (res.code === 200 && res.data) {
                    data = res.data;
                } else if (res.id) {
                    // 直接返回商品对象
                    data = res;
                }
                if (data) {
                    const product = {
                        id: data.id || productId,
                        image: data.image || data.main_image || '/images/default-product.png',
                        name: data.name || data.product_name || '未知商品',
                        price: data.price || data.sale_price || '0',
                        commissionRate: data.commissionRate || data.commission_rate || 0,
                        commissionAmount: data.commissionAmount || ((parseFloat(data.price || 0) * (data.commissionRate || data.commission_rate || 0)) / 100).toFixed(2)
                    };
                    this.setData(
                        {
                            selectedProducts: [product]
                        },
                        () => {
                            this.calculateTotalCommission();
                            this.checkCanSubmit();
                        }
                    );
                } else {
                    uni.showToast({
                        title: '加载商品失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
                uni.showToast({
                    title: '加载商品失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },

        // 计算总佣金
        calculateTotalCommission() {
            const total = this.selectedProducts.reduce((sum, item) => {
                return sum + parseFloat(item.commissionAmount || 0);
            }, 0);
            this.setData({
                totalCommission: total.toFixed(2)
            });
        },

        // 添加商品
        addProduct() {
            uni.navigateTo({
                url: '/pages/index/index?selectMode=true'
            });
        },

        // 移除商品
        removeProduct(e) {
            const productId = e.currentTarget.dataset.id;
            const products = this.selectedProducts.filter((item) => item.id != productId);
            this.setData(
                {
                    selectedProducts: products
                },
                () => {
                    this.calculateTotalCommission();
                    this.checkCanSubmit();
                }
            );
        },

        // 选择地址
        selectAddress() {
            uni.showActionSheet({
                itemList: ['使用微信地址', '手动填写', '从收货地址选择'],
                success: (res) => {
                    switch (res.tapIndex) {
                        case 0:
                            this.getWXAddress();
                            break;
                        case 1:
                            // 手动填写，保持当前状态
                            break;
                        case 2:
                            uni.showToast({
                                title: '地址簿功能开发中',
                                icon: 'none'
                            });
                            break;
                    }
                }
            });
        },

        // 获取微信地址
        getWXAddress() {
            uni.chooseAddress({
                success: (res) => {
                    this.setData({
                        'formData.name': res.userName,
                        'formData.phone': res.telNumber,
                        'formData.region': [res.provinceName, res.cityName, res.countyName],
                        'formData.address': res.detailInfo
                    });
                    this.checkCanSubmit();
                },
                fail: (err) => {
                    if (err.errMsg.indexOf('fail auth') > -1) {
                        uni.showModal({
                            title: '需要授权',
                            content: '请授权访问您的通讯地址',
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openSetting();
                                }
                            }
                        });
                    }
                }
            });
        },

        // 输入姓名
        onNameInput(e) {
            this.setData({
                'formData.name': e.detail.value
            });
            this.checkCanSubmit();
        },

        // 输入电话
        onPhoneInput(e) {
            this.setData({
                'formData.phone': e.detail.value
            });
            this.checkCanSubmit();
        },

        // 选择地区
        onRegionChange(e) {
            this.setData({
                'formData.region': e.detail.value
            });
            this.checkCanSubmit();
        },

        // 输入详细地址
        onAddressInput(e) {
            this.setData({
                'formData.address': e.detail.value
            });
            this.checkCanSubmit();
        },

        // 输入备注
        onRemarkInput(e) {
            this.setData({
                'formData.remark': e.detail.value
            });
        },

        // 检查是否可以提交
        checkCanSubmit() {
            const { selectedProducts, formData } = this;
            const canSubmit =
                selectedProducts.length > 0 && formData.name.trim() !== '' && formData.phone.trim() !== '' && formData.region.length > 0 && formData.address.trim() !== '';
            this.setData({
                canSubmit
            });
        },

        // 提交申请
        submitApplication() {
            if (!this.canSubmit) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                });
                return;
            }

            // 验证手机号
            const phone = this.formData.phone;
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                });
                return;
            }

            // 构建提交数据
            const submitData = {
                products: this.selectedProducts.map((item) => item.id),
                recipient: {
                    name: this.formData.name,
                    phone: this.formData.phone,
                    province: this.formData.region[0],
                    city: this.formData.region[1],
                    district: this.formData.region[2],
                    address: this.formData.address
                },
                remark: this.formData.remark,
                applyTime: new Date().toISOString()
            };
            console.log('提交数据:', submitData);

            // 显示确认弹窗
            uni.showModal({
                title: '确认提交',
                content: '提交后不可修改，是否确认提交样品申请？',
                success: (res) => {
                    if (res.confirm) {
                        this.doSubmit(submitData);
                    }
                }
            });
        },

        // 执行提交
        async doSubmit(data) {
            uni.showLoading({
                title: '提交中...'
            });
            try {
                // 构建请求数据
                const requestData = {
                    productIds: data.products,
                    recipientName: data.recipient.name,
                    phone: data.recipient.phone,
                    province: data.recipient.province || '',
                    city: data.recipient.city || '',
                    district: data.recipient.district || '',
                    address: data.recipient.address,
                    remark: data.remark || ''
                };
                console.log('提交样品申请数据:', requestData);

                // 调用后端API提交样品申请
                const result = await sampleService.applySample(requestData);
                console.log('提交样品申请返回:', result);
                uni.hideLoading();

                // api.js 在成功时直接返回 data 部分
                if (result) {
                    uni.showToast({
                        title: '申请成功',
                        icon: 'success',
                        duration: 1500,
                        success: () => {
                            setTimeout(() => {
                                // 跳转到我的样品申请页
                                uni.redirectTo({
                                    url: '/pages/my-samples/my-samples'
                                });
                            }, 1500);
                        }
                    });
                } else {
                    uni.showToast({
                        title: '申请失败',
                        icon: 'none',
                        duration: 3000
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('提交样品申请失败:', error);
                uni.showToast({
                    title: '申请失败: ' + (error.message || '网络错误'),
                    icon: 'none',
                    duration: 3000
                });
            }
        }
    }
};
</script>
<style>
.page {
    background: linear-gradient(180deg, #fff8f5 0%, #f5f5f5 200rpx);
    min-height: 100vh;
    padding-bottom: 160rpx;
}

/* 顶部渐变背景 */
.header-bg {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa94d 100%);
    padding: 40rpx 30rpx 60rpx;
    position: relative;
    overflow: hidden;
}

.header-bg::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400rpx;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.header-bg::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.header-content {
    position: relative;
    z-index: 1;
    text-align: center;
}

.header-icon {
    font-size: 60rpx;
    margin-bottom: 16rpx;
}

.header-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.header-subtitle {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
}

/* 卡片样式 */
.card {
    background: #fff;
    border-radius: 24rpx;
    margin: -30rpx 24rpx 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.header-left {
    display: flex;
    align-items: center;
}

.required {
    color: #ff4757;
    font-size: 28rpx;
    margin-right: 8rpx;
    font-weight: bold;
}

.card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

.card-subtitle {
    font-size: 26rpx;
    color: #999;
}

.optional {
    font-size: 24rpx;
    color: #999;
    margin-left: 12rpx;
    font-weight: normal;
}

.header-right {
    display: flex;
    align-items: center;
}

.select-address {
    font-size: 26rpx;
    color: #ff6b35;
}

/* 商品列表 */
.products-list {
    margin-bottom: 20rpx;
}

.product-item {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    border: 1rpx solid #f0f0f0;
}

.product-image-wrap {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.product-image {
    width: 100%;
    height: 100%;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 12rpx;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.product-price {
    font-size: 30rpx;
    color: #ff4757;
    font-weight: bold;
}

.product-commission {
    font-size: 22rpx;
    color: #ff6b35;
    background: rgba(255, 107, 53, 0.1);
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

.product-remove {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 71, 87, 0.1);
    border-radius: 50%;
    margin-left: 16rpx;
}

.remove-icon {
    font-size: 24rpx;
    color: #ff4757;
    font-weight: bold;
}

/* 添加商品 */
.add-product {
    padding-top: 10rpx;
}

.add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx;
    border: 2rpx dashed #ff6b35;
    border-radius: 16rpx;
    background: rgba(255, 107, 53, 0.03);
}

.add-icon {
    font-size: 32rpx;
    color: #ff6b35;
    margin-right: 12rpx;
    font-weight: bold;
}

.add-text {
    font-size: 28rpx;
    color: #ff6b35;
    font-weight: 500;
}

/* 表单样式 */
.form-list {
    background: #fff;
}

.form-item {
    display: flex;
    align-items: flex-start;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
    border-bottom: none;
}

.form-label {
    width: 180rpx;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.label-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
}

.label-text {
    font-size: 28rpx;
    color: #666;
}

.form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    height: 44rpx;
    line-height: 44rpx;
}

.picker-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    height: 44rpx;
    line-height: 44rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.picker-value.placeholder {
    color: #999;
}

.arrow {
    font-size: 28rpx;
    color: #ccc;
    margin-left: 8rpx;
}

.address-item {
    flex-direction: column;
}

.address-item .form-label {
    margin-bottom: 16rpx;
}

.form-textarea {
    width: 100%;
    font-size: 28rpx;
    color: #333;
    height: 120rpx;
    line-height: 1.5;
    padding: 16rpx;
    background: #fafafa;
    border-radius: 12rpx;
    box-sizing: border-box;
}

/* 备注卡片 */
.remark-wrap {
    position: relative;
}

.remark-input {
    width: 100%;
    height: 160rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    padding: 20rpx;
    background: #fafafa;
    border-radius: 16rpx;
    box-sizing: border-box;
}

.word-count {
    position: absolute;
    bottom: 16rpx;
    right: 16rpx;
    font-size: 22rpx;
    color: #999;
    background: rgba(255, 255, 255, 0.8);
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

/* 申请须知 */
.notice-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
}

.notice-list {
    background: linear-gradient(135deg, #fff9f7 0%, #fff5f0 100%);
    border-radius: 16rpx;
    padding: 24rpx;
    border: 1rpx solid rgba(255, 107, 53, 0.1);
}

.notice-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
}

.notice-item:last-child {
    margin-bottom: 0;
}

.notice-num {
    width: 36rpx;
    height: 36rpx;
    background: linear-gradient(135deg, #ff6b35, #ff8c42);
    color: #fff;
    font-size: 22rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    flex-shrink: 0;
}

.notice-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    flex: 1;
}

/* 底部安全区域 */
.safe-area {
    height: 40rpx;
}

/* 底部提交栏 */
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
    z-index: 100;
}

.bottom-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.total-info {
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.info-item {
    display: flex;
    flex-direction: column;
}

.info-label {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 4rpx;
}

.info-value {
    font-size: 30rpx;
    color: #333;
    font-weight: 600;
}

.info-value.commission {
    color: #ff4757;
}

.info-divider {
    width: 1rpx;
    height: 40rpx;
    background: #eee;
}

.btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 48rpx;
    height: 88rpx;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    border-radius: 44rpx;
    border: none;
    box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.3);
}

.btn-submit.disabled {
    background: #ccc;
    box-shadow: none;
}

.btn-text {
    margin-right: 8rpx;
}

.btn-arrow {
    font-size: 28rpx;
}
</style>
