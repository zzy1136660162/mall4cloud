<template>
    <view class="container">
        <!-- 顶部横幅 -->
        <view class="header-banner">
            <view class="form-title">📝 填写研发需求</view>
            <view class="form-subtitle">告诉我们您的需求，我们为您定制专属产品</view>
        </view>

        <view class="form-card">
            <!-- 需求标题 -->
            <view class="form-item">
                <text class="form-label">
                    <text class="required">*</text>
                    需求标题
                </text>
                <input class="form-input" placeholder="请输入需求标题，如：美白保湿面膜研发" :value="form.title" @input="onInput" data-field="title" maxlength="200" />
            </view>

            <!-- 功能诉求 -->
            <view class="form-item">
                <text class="form-label">
                    <text class="required">*</text>
                    功能诉求
                </text>
                <textarea
                    class="form-textarea"
                    placeholder="请详细描述您的产品功能诉求，如功效、成分要求等"
                    :value="form.functionalAppeal"
                    @input="onInput"
                    data-field="functionalAppeal"
                    maxlength="1000"
                />
            </view>

            <!-- 目标人群 -->
            <view class="form-item">
                <text class="form-label">
                    <text class="required">*</text>
                    目标人群
                </text>
                <input class="form-input" placeholder="如：25-35岁女性，敏感肌" :value="form.targetAudience" @input="onInput" data-field="targetAudience" maxlength="100" />
            </view>

            <!-- 剂型偏好 -->
            <view class="form-item">
                <text class="form-label">剂型偏好</text>
                <input
                    class="form-input"
                    placeholder="如：面膜贴、精华液、乳液等（选填）"
                    :value="form.dosageFormPreference"
                    @input="onInput"
                    data-field="dosageFormPreference"
                    maxlength="100"
                />
            </view>

            <!-- 预算范围 -->
            <view class="form-item">
                <text class="form-label">
                    <text class="required">*</text>
                    预算范围
                </text>
                <picker mode="selector" :range="budgetOptions" @change="onBudgetChange">
                    <view class="form-picker">
                        <text :class="form.budgetRange ? '' : 'picker-placeholder'">
                            {{ form.budgetRange || '请选择预算范围' }}
                        </text>
                        <text class="picker-arrow">></text>
                    </view>
                </picker>
            </view>

            <!-- 期望交付时间 -->
            <view class="form-item">
                <text class="form-label">
                    <text class="required">*</text>
                    期望交付时间
                </text>
                <picker mode="date" @change="onDateChange" :start="today">
                    <view class="form-picker">
                        <text :class="form.expectedDeliveryTime ? '' : 'picker-placeholder'">
                            {{ form.expectedDeliveryTime || '请选择期望交付时间' }}
                        </text>
                        <text class="picker-arrow">></text>
                    </view>
                </picker>
            </view>

            <!-- 备注 -->
            <view class="form-item">
                <text class="form-label">备注</text>
                <textarea class="form-textarea" placeholder="其他需要说明的信息（选填）" :value="form.remark" @input="onInput" data-field="remark" maxlength="500" />
            </view>

            <!-- 联系人信息 -->
            <view class="divider"></view>
            <view class="form-section-title">联系信息</view>

            <view class="form-item">
                <text class="form-label">联系人姓名</text>
                <input class="form-input" placeholder="请输入您的姓名" :value="form.submitterName" @input="onInput" data-field="submitterName" maxlength="50" />
            </view>

            <view class="form-item">
                <text class="form-label">联系电话</text>
                <input class="form-input" placeholder="请输入您的手机号" :value="form.submitterPhone" @input="onInput" data-field="submitterPhone" type="number" maxlength="20" />
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-section">
            <button class="submit-btn" @tap="submitForm">✅ 提交需求</button>
        </view>

        <!-- 提示信息 -->
        <view class="tips">
            <text class="tips-text">提交后我们的专业团队将在1-3个工作日内与您联系</text>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            form: {
                title: '',
                functionalAppeal: '',
                targetAudience: '',
                dosageFormPreference: '',
                budgetRange: '',
                expectedDeliveryTime: '',
                remark: '',
                submitterName: '',
                submitterPhone: ''
            },
            budgetOptions: ['50000以下', '50000-100000', '100000-200000', '200000-500000', '500000以上'],
            today: ''
        };
    },
    onLoad() {
        // 设置今天日期为最小日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.setData({
            today: `${year}-${month}-${day}`
        });
    },
    methods: {
        // 输入框变化
        onInput(e) {
            const { field } = e.currentTarget.dataset;
            const { value } = e.detail;
            this.setData({
                [`form.${field}`]: value
            });
        },

        // 预算选择
        onBudgetChange(e) {
            const { value } = e.detail;
            this.setData({
                'form.budgetRange': this.budgetOptions[value]
            });
        },

        // 日期选择
        onDateChange(e) {
            const { value } = e.detail;
            this.setData({
                'form.expectedDeliveryTime': value
            });
        },

        // 表单验证
        validateForm() {
            const { form } = this;
            const requiredFields = [
                {
                    field: 'title',
                    label: '需求标题'
                },
                {
                    field: 'functionalAppeal',
                    label: '功能诉求'
                },
                {
                    field: 'targetAudience',
                    label: '目标人群'
                },
                {
                    field: 'budgetRange',
                    label: '预算范围'
                },
                {
                    field: 'expectedDeliveryTime',
                    label: '期望交付时间'
                }
            ];
            for (const item of requiredFields) {
                if (!form[item.field] || form[item.field].trim() === '') {
                    uni.showToast({
                        title: `请填写${item.label}`,
                        icon: 'none'
                    });
                    return false;
                }
            }
            return true;
        },

        // 提交表单
        submitForm() {
            if (!this.validateForm()) {
                return;
            }
            const submitterId = app.globalData.userId;
            const data = {
                ...this.form,
                submitterId
            };
            uni.showLoading({
                title: '提交中...'
            });
            app.globalData.request({
                url: '/demand/submit',
                method: 'POST',
                data,
                success: (res) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '提交成功',
                        icon: 'success'
                    });

                    // 延迟跳转到列表页
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/demandList/demandList'
                        });
                    }, 1500);
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        }
    }
};
</script>
<style>
/* 页面容器 */
.container {
    padding: 0;
    background: linear-gradient(180deg, #fffbe6 0%, #f5f5f5 100%);
    min-height: 100vh;
}

/* 顶部横幅 */
.header-banner {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    padding: 60rpx 40rpx 80rpx;
    text-align: center;
    color: #333;
    position: relative;
    overflow: hidden;
}

.header-banner::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.header-banner::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.form-title {
    font-size: 44rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
    position: relative;
    z-index: 1;
}

.form-subtitle {
    font-size: 28rpx;
    opacity: 0.9;
    position: relative;
    z-index: 1;
}

/* 表单卡片 */
.form-card {
    background: #fff;
    border-radius: 32rpx;
    padding: 50rpx 40rpx;
    margin: -40rpx 30rpx 30rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 2;
}

/* 表单分组标题 */
.form-section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
}

.form-section-title::before {
    content: '';
    width: 8rpx;
    height: 36rpx;
    background: linear-gradient(180deg, #f5d547 0%, #ffec8b 100%);
    border-radius: 4rpx;
    margin-right: 16rpx;
}

/* 表单项 */
.form-item {
    margin-bottom: 40rpx;
}

.form-item:last-child {
    margin-bottom: 0;
}

.form-label {
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color: #1a1a1a;
    margin-bottom: 16rpx;
    font-weight: 600;
}

.form-label .required {
    color: #ff4d4f;
    margin-right: 8rpx;
    font-size: 32rpx;
}

.form-input,
.form-textarea,
.form-picker {
    width: 100%;
    min-height: 96rpx;
    padding: 24rpx 28rpx;
    border: 2rpx solid #e8e8e8;
    border-radius: 16rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    background: #fafafa;
    transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
    border-color: #f5d547;
    background: #fff;
    box-shadow: 0 0 0 4rpx rgba(245, 213, 71, 0.1);
}

.form-textarea {
    min-height: 200rpx;
}

.form-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafafa;
}

.picker-placeholder {
    color: #999;
}

.picker-arrow {
    color: #999;
    font-size: 32rpx;
    font-weight: bold;
}

/* 提交区域 */
.submit-section {
    padding: 20rpx 30rpx 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.submit-btn {
    width: 100%;
    height: 96rpx;
    border-radius: 48rpx;
    font-size: 34rpx;
    font-weight: 600;
    border: none;
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
    box-shadow: 0 8rpx 32rpx rgba(245, 213, 71, 0.35);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-btn::after {
    border: none;
}

.submit-btn:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(245, 213, 71, 0.25);
}

/* 提示信息 */
.tips {
    text-align: center;
    padding: 40rpx 30rpx;
}

.tips-text {
    font-size: 26rpx;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tips-text::before {
    content: '💡';
    margin-right: 12rpx;
    font-size: 32rpx;
}
</style>
