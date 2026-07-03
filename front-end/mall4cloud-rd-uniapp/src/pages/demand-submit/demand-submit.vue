<template>
  <view class="page">
    <scroll-view scroll-y class="content">
      <!-- 区块 1 基本信息 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">🔍</view>
          <text class="block-title-text">基本信息</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>项目/产品名称</view>
          <input v-model="form.title" class="form-input" placeholder="请输入明确的项目或产品名称" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>产品品类</view>
          <view class="form-input select" @tap="onPickCategory">
            <text v-if="!form.productCategory" class="ph">请选择品类</text>
            <text v-else>{{ productCategoryLabel }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label">产品形态偏好</view>
          <view class="form-input select" @tap="onPickDosageForm">
            <text v-if="!form.dosageFormPreference" class="ph">请选择产品形态</text>
            <text v-else>{{ dosageFormLabel }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
      </view>

      <!-- 区块 2 技术诉求与场景 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">🧪</view>
          <text class="block-title-text">技术诉求与场景</text>
        </view>
        <view class="form-item">
          <view class="form-label">期望对接领域</view>
          <view class="form-input select" @tap="onPickDomain">
            <text v-if="!form.expertiseField" class="ph">选择技术领域</text>
            <text v-else>{{ expertiseFieldLabel }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>研发目标与功能诉求</view>
          <textarea
            v-model="form.functionalAppeal"
            class="form-textarea"
            placeholder="详细描述项目所需要解决的技术难点、期望实现的核心功能/指标等..."
            placeholder-class="ph"
            maxlength="-1"
          ></textarea>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>目标用户/应用场景</view>
          <textarea
            v-model="form.targetAudience"
            class="form-textarea"
            placeholder="描述该产品或技术最终服务的对象及具体使用的业务场景..."
            placeholder-class="ph"
          ></textarea>
        </view>
      </view>

      <!-- 区块 3 期望服务类型 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">📋</view>
          <text class="block-title-text">期望服务类型</text>
        </view>
        <view class="form-item">
          <view class="form-label">可多选</view>
          <view class="tag-list">
            <view
              v-for="t in serviceTypeOptions"
              :key="t.value"
              class="tag-item"
              :class="{ active: form.serviceType.includes(t.value) }"
              @tap="toggleService(t.value)"
            >{{ t.label }}</view>
          </view>
        </view>
      </view>

      <!-- 区块 4 预算与周期 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">💰</view>
          <text class="block-title-text">预算与周期</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>预算范围</view>
          <view class="form-input select" @tap="onPickBudget">
            <text v-if="!form.budgetRange" class="ph">请选择预算范围</text>
            <text v-else>{{ budgetRangeLabel }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>期望交付时间</view>
          <view class="form-input with-suffix" @tap="onPickDate">
            <text v-if="!form.expectedDeliveryTime" class="ph">yyyy/mm/dd</text>
            <text v-else>{{ expectedDeliveryTimeLabel }}</text>
            <text class="suffix icon">📅</text>
          </view>
        </view>
      </view>

      <!-- 区块 5 联系信息 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">📞</view>
          <text class="block-title-text">联系信息</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>联系人</view>
          <input v-model="form.submitterName" class="form-input" placeholder="填写项目接口人姓名" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>联系电话</view>
          <input v-model="form.submitterPhone" class="form-input" type="number" maxlength="11" placeholder="填写手机号或座机号" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label">补充说明</view>
          <textarea
            v-model="form.remark"
            class="form-textarea"
            placeholder="其他需要补充的信息..."
            placeholder-class="ph"
          ></textarea>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="footer">
        <view class="btn-save" @tap="onSave">保存草稿</view>
        <view class="btn-submit" @tap="onSubmit">提交申请 ▸</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  PRODUCT_CATEGORY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  EXPERTISE_FIELD_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  DOSAGE_FORM_OPTIONS
} from '@/utils/dict.js'
import { submitDemand } from '@/utils/api/demand.js'

export default {
  data() {
    return {
      productCategoryOptions: PRODUCT_CATEGORY_OPTIONS,
      serviceTypeOptions: SERVICE_TYPE_OPTIONS,
      expertiseFieldOptions: EXPERTISE_FIELD_OPTIONS,
      budgetRangeOptions: BUDGET_RANGE_OPTIONS,
      dosageFormOptions: DOSAGE_FORM_OPTIONS,
      form: {
        title: '',
        productCategory: null,
        dosageFormPreference: '',
        expertiseField: '',
        functionalAppeal: '',
        targetAudience: '',
        serviceType: [],
        budgetRange: '',
        expectedDeliveryTime: '',
        remark: '',
        submitterName: '',
        submitterPhone: ''
      }
    }
  },
  computed: {
    productCategoryLabel() {
      const item = this.productCategoryOptions.find(i => i.value === this.form.productCategory)
      return item ? item.label : ''
    },
    expertiseFieldLabel() {
      const item = this.expertiseFieldOptions.find(i => i.value === this.form.expertiseField)
      return item ? item.label : ''
    },
    budgetRangeLabel() {
      const item = this.budgetRangeOptions.find(i => i.value === this.form.budgetRange)
      return item ? item.label : ''
    },
    dosageFormLabel() {
      const item = this.dosageFormOptions.find(i => i.value === this.form.dosageFormPreference)
      return item ? item.label : ''
    },
    expectedDeliveryTimeLabel() {
      return this.form.expectedDeliveryTime || ''
    }
  },
  methods: {
    toggleService(value) {
      const idx = this.form.serviceType.indexOf(value)
      if (idx === -1) this.form.serviceType.push(value)
      else this.form.serviceType.splice(idx, 1)
    },
    onPickCategory() {
      uni.showActionSheet({
        itemList: this.productCategoryOptions.map(i => i.label),
        success: (res) => {
          this.form.productCategory = this.productCategoryOptions[res.tapIndex].value
        }
      })
    },
    onPickDomain() {
      uni.showActionSheet({
        itemList: this.expertiseFieldOptions.map(i => i.label),
        success: (res) => {
          this.form.expertiseField = this.expertiseFieldOptions[res.tapIndex].value
        }
      })
    },
    onPickBudget() {
      uni.showActionSheet({
        itemList: this.budgetRangeOptions.map(i => i.label),
        success: (res) => {
          this.form.budgetRange = this.budgetRangeOptions[res.tapIndex].value
        }
      })
    },
    onPickDosageForm() {
      uni.showActionSheet({
        itemList: this.dosageFormOptions.map(i => i.label),
        success: (res) => {
          this.form.dosageFormPreference = this.dosageFormOptions[res.tapIndex].value
        }
      })
    },
    onPickDate() {
      uni.showDatePicker({
        success: (res) => {
          this.form.expectedDeliveryTime = res.date
        }
      })
    },
    onSave() {
      uni.showToast({ title: '草稿已保存', icon: 'success' })
    },
    async onSubmit() {
      if (!this.form.title) return uni.showToast({ title: '请填写项目名称', icon: 'none' })
      if (!this.form.productCategory) return uni.showToast({ title: '请选择产品品类', icon: 'none' })
      if (!this.form.functionalAppeal) return uni.showToast({ title: '请填写研发目标与功能诉求', icon: 'none' })
      if (!this.form.targetAudience) return uni.showToast({ title: '请填写目标用户/应用场景', icon: 'none' })
      if (!this.form.budgetRange) return uni.showToast({ title: '请选择预算范围', icon: 'none' })
      if (!this.form.expectedDeliveryTime) return uni.showToast({ title: '请选择期望交付时间', icon: 'none' })
      if (!this.form.submitterName) return uni.showToast({ title: '请填写联系人', icon: 'none' })
      if (!this.form.submitterPhone) return uni.showToast({ title: '请填写联系电话', icon: 'none' })

      uni.showLoading({ title: '提交中...' })
      try {
        const payload = {
          ...this.form,
          serviceType: JSON.stringify(this.form.serviceType)
        }
        const res = await submitDemand(payload)
        uni.hideLoading()
        uni.redirectTo({
          url: `/pages/submit-success/submit-success?demandNo=${res && res.demandNo ? res.demandNo : ''}`
        })
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: err && err.message ? err.message : '提交失败，请重试', icon: 'none' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx 0;
  box-sizing: border-box;
}

.rounded-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid var(--outline-variant);
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
}

.block-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 28rpx;
}

.block-title-icon {
  font-size: 32rpx;
}

.form-item {
  margin-bottom: 24rpx;
}
.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 26rpx;
  color: var(--on-surface);
  margin-bottom: 12rpx;
  font-weight: 500;
}

.req {
  color: var(--error);
  margin-right: 4rpx;
}

.form-input {
  background: #ffffff;
  border: 2rpx solid var(--outline-variant);
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: var(--on-surface);
  min-height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-input.select,
.form-input.with-suffix {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.caret {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.suffix {
  color: var(--on-surface-variant);
  font-size: 26rpx;
}

.suffix.icon {
  font-size: 30rpx;
}

.form-textarea {
  background: #ffffff;
  border: 2rpx solid var(--outline-variant);
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: var(--on-surface);
  width: 100%;
  min-height: 200rpx;
}

.ph {
  color: #9aa0b0;
}

/* tag 列表 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14rpx 28rpx;
  background: #ffffff;
  color: var(--on-surface-variant);
  border: 2rpx solid var(--outline-variant);
  border-radius: 999rpx;
  font-size: 26rpx;
  transition: all 0.2s;
}

.tag-item.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

/* 底部按钮 */
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(11, 28, 48, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  color: var(--primary);
  font-weight: 600;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  border-radius: 16rpx;
  background: var(--primary);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
