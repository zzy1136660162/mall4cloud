<template>
    <view class="address-page">
        <view class="page-background"></view>

        <scroll-view class="address-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="address-content">
                <view v-if="addressList.length === 0" class="empty-state">
                    <text class="empty-emoji">📍</text>
                    <text class="empty-title">暂无收货地址</text>
                    <text class="empty-desc">添加收货地址，方便快速下单</text>
                    <view class="empty-action">
                        <view class="add-address-btn" @tap="addAddress">
                            <text class="add-address-text">添加地址</text>
                        </view>
                    </view>
                </view>

                <view v-else class="address-list">
                    <view
                        :class="'address-item ' + (item.isDefault ? 'default' : '') + ' ' + (item.selected ? 'selected' : '')"
                        @tap="selectAddress"
                        :data-id="item.addressId"
                        v-for="(item, index) in addressList"
                        :key="index"
                    >
                        <view class="address-header">
                            <view class="address-info">
                                <text class="address-name">{{ item.name }}</text>
                                <text class="address-phone">{{ item.phone }}</text>
                                <view class="default-tag" v-if="item.isDefault">默认</view>
                            </view>
                            <view class="address-actions">
                                <view class="action-btn" @tap.stop.prevent="editAddress" :data-id="item.addressId">
                                    <text class="action-icon">✏️</text>
                                </view>
                                <view class="action-btn" @tap.stop.prevent="deleteAddress" :data-id="item.addressId">
                                    <text class="action-icon">🗑️</text>
                                </view>
                            </view>
                        </view>

                        <view class="address-detail">
                            <text class="address-text">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
                        </view>

                        <view class="address-footer">
                            <view class="default-switch" @tap.stop.prevent="setDefault" :data-id="item.addressId">
                                <view :class="'switch-icon ' + (item.isDefault ? 'active' : '')">
                                    <text class="switch-text">{{ item.isDefault ? '✓' : '' }}</text>
                                </view>
                                <text class="switch-label">设为默认地址</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="address-footer" v-if="addressList.length > 0">
            <view class="footer-content">
                <view class="add-new-btn" @tap="addAddress">
                    <text class="add-icon">+</text>
                    <text class="add-text">添加新地址</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const addressApi = require('../../utils/sp_api.js').addressApi;
const { checkLogin, getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    data() {
        return {
            addressList: [],
            useMockData: false,
            fromOrder: false,
            isLoggedIn: false,
            selectedAddress: ''
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
        const { fromOrder } = options;
        if (fromOrder === 'true') {
            this.setData({
                fromOrder: true
            });
        }
        this.loadAddressList();
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (loginStatus.isLoggedIn) {
            this.loadAddressList();
        }
    },
    onPullDownRefresh() {
        this.loadAddressList().then(() => {
            uni.stopPullDownRefresh();
        });
    },
    methods: {
        async loadAddressList() {
            try {
                const res = await addressApi.getAddressList();
                this.setData({
                    addressList: res || [],
                    useMockData: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载地址列表失败:', error);
                this.setData({
                    useMockData: true
                });
                this.loadMockData();
            }
        },

        loadMockData() {
            const mockAddressList = [
                {
                    addressId: 1,
                    name: '张三',
                    phone: '138****8888',
                    province: '北京市',
                    city: '北京市',
                    district: '朝阳区',
                    detail: 'xxx街道xxx号xxx小区xxx号楼xxx室',
                    isDefault: true,
                    selected: false
                },
                {
                    addressId: 2,
                    name: '李四',
                    phone: '139****9999',
                    province: '上海市',
                    city: '上海市',
                    district: '浦东新区',
                    detail: 'xxx路xxx号xxx大厦xxx楼xxx室',
                    isDefault: false,
                    selected: false
                },
                {
                    addressId: 3,
                    name: '王五',
                    phone: '137****7777',
                    province: '广东省',
                    city: '深圳市',
                    district: '南山区',
                    detail: 'xxx大道xxx号xxx科技园xxx栋xxx室',
                    isDefault: false,
                    selected: false
                }
            ];
            this.setData({
                addressList: mockAddressList
            });
        },

        addAddress() {
            uni.navigateTo({
                url: '/pages/sp_Address_edit_page/sp_Address_edit_page'
            });
        },

        editAddress(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Address_edit_page/sp_Address_edit_page?id=${id}`
            });
        },

        async deleteAddress(e) {
            const { id } = e.currentTarget.dataset;
            uni.showModal({
                title: '提示',
                content: '确定要删除该地址吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            uni.showLoading({
                                title: '删除中...'
                            });
                            await addressApi.deleteAddress(id);
                            uni.hideLoading();
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                            this.loadAddressList();
                        } catch (error) {
                            console.log('CatchClause', error);
                            console.log('CatchClause', error);
                            uni.hideLoading();
                            console.error('删除地址失败:', error);
                            uni.showToast({
                                title: '删除失败',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        },

        async setDefault(e) {
            const { id } = e.currentTarget.dataset;
            try {
                uni.showLoading({
                    title: '设置中...'
                });
                await addressApi.setDefaultAddress(id);
                uni.hideLoading();
                uni.showToast({
                    title: '设置成功',
                    icon: 'success'
                });
                this.loadAddressList();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('设置默认地址失败:', error);
                uni.showToast({
                    title: '设置失败',
                    icon: 'none'
                });
            }
        },

        selectAddress(e) {
            const { id } = e.currentTarget.dataset;
            const { addressList, fromOrder } = this;
            if (fromOrder) {
                const selectedAddress = addressList.find((item) => item.addressId === id);
                if (selectedAddress) {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];
                    if (prevPage) {
                        prevPage.setData({
                            selectedAddress: selectedAddress
                        });
                        uni.navigateBack();
                    }
                }
            }
        },

        stopPropagation() {
            event.stopPropagation();
        }
    }
};
</script>
<style>
.address-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fff9e6 0%, #fafafa 100%);
    position: relative;
}

.page-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, #fff9e6 0%, #fafafa 100%);
    z-index: -1;
}

.address-scroll {
    height: calc(100vh - 120rpx);
    padding-bottom: 120rpx;
}

.address-content {
    padding: 24rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
    animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-emoji {
    font-size: 120rpx;
    margin-bottom: 24rpx;
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20rpx);
    }
}

.empty-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
    margin-bottom: 12rpx;
}

.empty-desc {
    font-size: 26rpx;
    color: #999999;
    margin-bottom: 48rpx;
}

.empty-action {
    width: 100%;
    display: flex;
    justify-content: center;
}

.add-address-btn {
    padding: 24rpx 64rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-address-btn:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
}

.add-address-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 600;
}

.address-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.address-item {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideIn 0.5s ease;
    border: 2rpx solid transparent;
}

@keyframes slideIn {
    0% {
        opacity: 0;
        transform: translateX(-20rpx);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.address-item:active {
    transform: scale(0.98);
}

.address-item.default {
    border-color: rgba(255, 193, 7, 0.3);
    background: linear-gradient(135deg, #ffffff 0%, #fff9e6 100%);
}

.address-item.selected {
    border-color: #ffc107;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.2);
}

.address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.address-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.address-name {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
}

.address-phone {
    font-size: 28rpx;
    color: #666666;
}

.default-tag {
    padding: 4rpx 16rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 20rpx;
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 600;
}

.address-actions {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    width: 56rpx;
    height: 56rpx;
    background: #fafafa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:active {
    transform: scale(0.9);
    background: #f5f5f5;
}

.action-icon {
    font-size: 28rpx;
}

.address-detail {
    margin-bottom: 20rpx;
}

.address-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
}

.address-footer {
    display: flex;
    justify-content: flex-end;
}

.default-switch {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.switch-icon {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #fafafa;
    border: 2rpx solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-icon.active {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-color: #ffc107;
}

.switch-text {
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 600;
}

.switch-label {
    font-size: 26rpx;
    color: #666666;
}

.address-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
    padding: 24rpx;
    z-index: 100;
}

.footer-content {
    max-width: 750rpx;
    margin: 0 auto;
}

.add-new-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-new-btn:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
}

.add-icon {
    font-size: 36rpx;
    color: #ffffff;
    font-weight: 300;
    line-height: 1;
}

.add-text {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 600;
}
</style>
