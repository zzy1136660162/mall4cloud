<template>
    <view class="apply-container">
        <!-- 页面标题 -->
        <view class="page-header">
            <text class="header-title">达人申请</text>
            <text class="header-subtitle">成为我们的达人，分享你的才华</text>
        </view>

        <!-- 表单区域 -->
        <view class="form-section">
            <!-- 真实姓名 -->
            <view class="form-item">
                <view class="item-label">
                    <text class="label-text">真实姓名</text>
                    <text class="label-required">*</text>
                </view>
                <input class="item-input" placeholder="请输入真实姓名" placeholder-class="placeholder" :value="formData.realName" data-field="realName" @input="onInputChange" />
            </view>

            <!-- 手机号码 -->
            <view class="form-item">
                <view class="item-label">
                    <text class="label-text">手机号码</text>
                    <text class="label-required">*</text>
                </view>
                <input
                    class="item-input"
                    placeholder="请输入手机号码"
                    placeholder-class="placeholder"
                    :value="formData.phone"
                    data-field="phone"
                    @input="onInputChange"
                    type="number"
                />
            </view>

            <!-- 所在地区 -->
            <view class="form-item">
                <view class="item-label">
                    <text class="label-text">所在地区</text>
                </view>
                <picker mode="multiSelector" :range="[provinces, cities, districts]" :value="regionIndex" @change="onRegionChange" @columnchange="onColumnChange">
                    <view class="picker-value">
                        <text v-if="region.length > 0" class="picker-text">{{ region[0] }} {{ region[1] }} {{ region[2] }}</text>
                        <text v-else class="placeholder">请选择省/市/区</text>
                        <text class="picker-arrow">›</text>
                    </view>
                </picker>
            </view>

            <!-- 申请理由 -->
            <view class="form-item form-item-textarea">
                <view class="item-label">
                    <text class="label-text">申请理由</text>
                    <text class="label-required">*</text>
                </view>
                <textarea
                    class="item-textarea"
                    placeholder="请简要描述你的特长和申请理由（10-500字）"
                    placeholder-class="placeholder"
                    :value="formData.applyReason"
                    data-field="applyReason"
                    @input="onInputChange"
                    maxlength="500"
                />
                <text class="textarea-count">{{ formData.applyReason.length }}/500</text>
            </view>

            <!-- 个人简介 -->
            <view class="form-item form-item-textarea">
                <view class="item-label">
                    <text class="label-text">个人简介</text>
                </view>
                <textarea
                    class="item-textarea"
                    placeholder="请简要介绍自己（选填）"
                    placeholder-class="placeholder"
                    :value="formData.intro"
                    data-field="intro"
                    @input="onInputChange"
                    maxlength="500"
                />
                <text class="textarea-count">{{ formData.intro.length }}/500</text>
            </view>
        </view>

        <!-- 权益说明 -->
        <view class="benefits-section">
            <text class="benefits-title">成为达人你将获得</text>
            <view class="benefits-list">
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">专属达人标识</text>
                </view>
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">高曝光推荐位</text>
                </view>
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">专属活动邀请</text>
                </view>
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">优先审核通道</text>
                </view>
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">内容创作指导</text>
                </view>
                <view class="benefit-item">
                    <view class="benefit-dot"></view>
                    <text class="benefit-text">专属客服支持</text>
                </view>
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-section">
            <view class="submit-btn" @tap="submitApply">提交申请</view>
        </view>
    </view>
</template>

<script>
// 达人申请页
const { api } = require('../../../utils/api.js');
export default {
    data() {
        return {
            formData: {
                realName: '',
                phone: '',
                applyReason: '',
                intro: ''
            },
            region: [],
            regionIndex: [0, 0, 0],
            isSubmitting: false,
            provinces: [],
            cities: [],
            districts: [],
            provincesData: [],
            citiesData: {},
            districtsData: {}
        };
    },
    onLoad() {
        this.loadRegionData();
    },
    methods: {
        loadRegionData() {
            uni.showLoading({
                title: '加载中...'
            });
            uni.request({
                url: 'http://localhost:5000/api/region/data',
                method: 'GET',
                success: (res) => {
                    uni.hideLoading();
                    if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
                        const regionData = res.data.data;
                        const provincesData = regionData.map((p) => ({
                            code: p.code,
                            name: p.name
                        }));
                        const citiesData = {};
                        const districtsData = {};
                        regionData.forEach((province) => {
                            citiesData[province.code] = province.children.map((c) => ({
                                code: c.code,
                                name: c.name
                            }));
                            province.children.forEach((city) => {
                                districtsData[city.code] = city.children.map((d) => ({
                                    code: d.code,
                                    name: d.name
                                }));
                            });
                        });
                        const firstProvince = provincesData[0];
                        let firstCities = [];
                        let firstDistricts = [];
                        if (firstProvince && citiesData[firstProvince.code]) {
                            firstCities = citiesData[firstProvince.code];
                            const firstCity = firstCities[0];
                            if (firstCity && districtsData[firstCity.code]) {
                                firstDistricts = districtsData[firstCity.code];
                            }
                        }
                        this.setData({
                            provinces: provincesData.map((p) => p.name),
                            provincesData: provincesData,
                            citiesData: citiesData,
                            districtsData: districtsData,
                            cities: firstCities.map((c) => c.name),
                            districts: firstDistricts.map((d) => d.name)
                        });
                    } else {
                        uni.showToast({
                            title: '地区数据为空',
                            icon: 'none'
                        });
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '加载地区数据失败',
                        icon: 'none'
                    });
                }
            });
        },

        onInputChange(e) {
            const { field } = e.currentTarget.dataset;
            const { value } = e.detail;
            this.setData({
                [`formData.${field}`]: value
            });
        },

        onRegionChange(e) {
            const value = e.detail.value;
            const { provinces, cities, districts } = this;
            if (value[0] >= 0 && value[1] >= 0 && value[2] >= 0) {
                this.setData({
                    region: [provinces[value[0]], cities[value[1]], districts[value[2]]],
                    regionIndex: value
                });
            }
        },

        onColumnChange(e) {
            const column = e.detail.column;
            const value = e.detail.value;
            const { provincesData, citiesData, districtsData, regionIndex } = this;
            if (column === 0) {
                const province = provincesData[value];
                if (!province) {
                    return;
                }
                const newCities = citiesData[province.code] || [];
                const firstCity = newCities[0] || {
                    code: '',
                    name: ''
                };
                const newDistricts = districtsData[firstCity.code] || [];
                this.setData({
                    cities: newCities.map((c) => c.name),
                    districts: newDistricts.map((d) => d.name),
                    regionIndex: [value, 0, 0]
                });
            } else if (column === 1) {
                const province = provincesData[regionIndex[0]];
                if (!province) {
                    return;
                }
                const cities = citiesData[province.code] || [];
                const city = cities[value] || {
                    code: '',
                    name: ''
                };
                const newDistricts = districtsData[city.code] || [];
                this.setData({
                    districts: newDistricts.map((d) => d.name),
                    regionIndex: [regionIndex[0], value, 0]
                });
            }
        },

        async submitApply() {
            if (this.isSubmitting) {
                return;
            }
            const { formData } = this;
            if (!formData.realName) {
                uni.showToast({
                    title: '请输入真实姓名',
                    icon: 'none'
                });
                return;
            }
            if (formData.realName.length < 2 || formData.realName.length > 20) {
                uni.showToast({
                    title: '真实姓名需在2-20个字符之间',
                    icon: 'none'
                });
                return;
            }
            if (!formData.phone) {
                uni.showToast({
                    title: '请输入手机号码',
                    icon: 'none'
                });
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                });
                return;
            }
            if (!formData.applyReason) {
                uni.showToast({
                    title: '请输入申请理由',
                    icon: 'none'
                });
                return;
            }
            if (formData.applyReason.length < 10 || formData.applyReason.length > 500) {
                uni.showToast({
                    title: '申请理由需在10-500个字符之间',
                    icon: 'none'
                });
                return;
            }
            this.setData({
                isSubmitting: true
            });
            try {
                const params = {
                    realName: formData.realName,
                    phone: formData.phone,
                    region: this.region.length > 0 ? `${this.region[0]} ${this.region[1]} ${this.region[2]}` : '',
                    applyReason: formData.applyReason,
                    intro: formData.intro
                };
                const res = await api.post('/api/user/talent/apply', params);
                uni.showToast({
                    title: '申请提交成功',
                    icon: 'success'
                });
                setTimeout(() => {
                    uni.redirectTo({
                        url: '/pages/talent/status/index'
                    });
                }, 1500);
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('提交申请失败:', error);
                uni.showToast({
                    title: '网络错误，请重试',
                    icon: 'none'
                });
                this.setData({
                    isSubmitting: false
                });
            }
        }
    }
};
</script>
<style>
/* 达人申请页样式 - 淡黄色风格 */
.apply-container {
    min-height: 100vh;
    background-color: #fafafa;
    padding-bottom: 60rpx;
}

/* 页面标题 */
.page-header {
    background: #fe944d;
    padding: 60rpx 40rpx;
    margin-bottom: 30rpx;
}

.header-title {
    display: block;
    font-size: 48rpx;
    font-weight: 600;
    color: #fff;
    margin-bottom: 16rpx;
}

.header-subtitle {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
}

/* 表单区域 */
.form-section {
    background: #fff;
    margin: 0 30rpx 30rpx;
    border-radius: 16rpx;
    padding: 20rpx 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
    border-bottom: none;
}

.form-item-textarea {
    position: relative;
}

.item-label {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.label-text {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
}

.label-required {
    font-size: 30rpx;
    color: #ff4757;
    margin-left: 8rpx;
}

.item-input {
    height: 80rpx;
    font-size: 30rpx;
    color: #333;
    border: 2rpx solid #e8e8e8;
    border-radius: 12rpx;
    padding: 0 24rpx;
    background: #fafafa;
    transition: all 0.3s;
}

.item-input:focus {
    border-color: #fe944d;
    background: #fff;
}

.picker-value {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    border: 2rpx solid #e8e8e8;
    border-radius: 12rpx;
    background: #fafafa;
    font-size: 30rpx;
    color: #333;
}

.picker-value .placeholder {
    color: #999;
}

.picker-arrow {
    font-size: 28rpx;
    color: #ccc;
}

.item-textarea {
    width: calc(100% - 48rpx);
    height: 200rpx;
    font-size: 30rpx;
    color: #333;
    border: 2rpx solid #e8e8e8;
    border-radius: 12rpx;
    padding: 24rpx;
    background: #fafafa;
    line-height: 1.6;
}

.item-textarea:focus {
    border-color: #fe944d;
    background: #fff;
}

.textarea-count {
    position: absolute;
    bottom: 50rpx;
    right: 24rpx;
    font-size: 24rpx;
    color: #999;
}

/* 权益说明 */
.benefits-section {
    background: #fff;
    margin: 0 30rpx 30rpx;
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.benefits-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.benefits-list {
    display: flex;
    flex-wrap: wrap;
}

.benefit-item {
    display: flex;
    align-items: center;
    width: 50%;
    margin-bottom: 24rpx;
}

.benefit-dot {
    width: 16rpx;
    height: 16rpx;
    background: #fe944d;
    border-radius: 50%;
    margin-right: 16rpx;
    flex-shrink: 0;
}

.benefit-text {
    font-size: 28rpx;
    color: #666;
}

/* 提交区域 */
.submit-section {
    padding: 0 30rpx;
}

.submit-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: #fe944d;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 48rpx;
    border: none;
    margin-bottom: 20rpx;
    transition: all 0.3s;
    box-shadow: 0 8rpx 24rpx rgba(254, 148, 77, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-btn:disabled {
    background: #e0e0e0;
    color: #999;
    box-shadow: none;
}

.submit-btn::after {
    border: none;
}

.submit-btn text {
    display: block;
    text-align: center;
    width: 100%;
}

.submit-tip {
    display: block;
    text-align: center;
    font-size: 26rpx;
    color: #999;
}

.picker-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    border: 2rpx solid #e8e8e8;
    border-radius: 12rpx;
    background: #fafafa;
    height: 80rpx;
}

.picker-text {
    font-size: 30rpx;
    color: #333;
}

.picker-arrow {
    font-size: 28rpx;
    color: #ccc;
}
</style>
