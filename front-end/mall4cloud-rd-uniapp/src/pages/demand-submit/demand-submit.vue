<template>
  <view class="page">
    <scroll-view scroll-y class="content">
      <view class="form-intro">
        <view class="intro-kicker">R&amp;D APPLICATION</view>
        <view class="intro-title">研发立项申请</view>
        <view class="intro-desc">清晰描述研发目标与交付预期，帮助平台更快匹配专家及转化资源。</view>
      </view>
      <!-- 区块 1 基本信息 -->
      <view class="rounded-card block">
        <view class="block-title">
          <text class="block-index">01</text>
          <text class="block-title-text">基本信息</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>项目/产品名称</view>
          <input v-model="form.title" class="form-input" placeholder="请输入明确的项目或产品名称" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>产品品类</view>
          <picker mode="selector" :range="productCategoryOptions" range-key="label" @change="onCategoryChange">
            <view class="form-input select">
              <text v-if="!form.productCategory" class="ph">请选择品类</text>
              <text v-else>{{ productCategoryLabel }}</text>
              <text class="select-action">选择</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <view class="form-label">产品形态偏好</view>
          <picker mode="selector" :range="dosageFormOptions" range-key="label" @change="onDosageFormChange">
            <view class="form-input select">
              <text v-if="!form.dosageFormPreference" class="ph">请选择产品形态</text>
              <text v-else>{{ dosageFormLabel }}</text>
              <text class="select-action">选择</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 区块 2 技术诉求与场景 -->
      <view class="rounded-card block">
        <view class="block-title">
          <text class="block-index">02</text>
          <text class="block-title-text">技术诉求与场景</text>
        </view>
        <view class="form-item">
          <view class="form-label">期望对接领域</view>
          <picker mode="selector" :range="expertiseFieldOptions" range-key="label" @change="onDomainChange">
            <view class="form-input select">
              <text v-if="!form.expertiseField" class="ph">选择技术领域</text>
              <text v-else>{{ expertiseFieldLabel }}</text>
              <text class="select-action">选择</text>
            </view>
          </picker>
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
          <text class="block-index">03</text>
          <text class="block-title-text">期望服务类型</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>可多选</view>
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
          <text class="block-index">04</text>
          <text class="block-title-text">预算与周期</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>预算范围</view>
          <picker mode="selector" :range="budgetRangeOptions" range-key="label" @change="onBudgetChange">
            <view class="form-input select">
              <text v-if="!form.budgetRange" class="ph">请选择预算范围</text>
              <text v-else>{{ budgetRangeLabel }}</text>
              <text class="select-action">选择</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>期望交付时间</view>
          <picker mode="date" :value="form.expectedDeliveryTime" :start="today" @change="onDateChange">
            <view class="form-input with-suffix">
              <text v-if="!form.expectedDeliveryTime" class="ph">yyyy-mm-dd</text>
              <text v-else>{{ expectedDeliveryTimeLabel }}</text>
              <text class="suffix">选择日期</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 区块 5 联系信息 -->
      <view class="rounded-card block">
        <view class="block-title">
          <text class="block-index">05</text>
          <text class="block-title-text">联系信息</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>联系人</view>
          <input v-model="form.submitterName" class="form-input" placeholder="填写项目接口人姓名" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>联系电话</view>
          <input v-model="form.submitterPhone" class="form-input" type="number" maxlength="11" placeholder="填写11位手机号" placeholder-class="ph" />
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
      <view class="btn-save" @tap="onSave">保存草稿</view>
      <view class="btn-submit" :class="{ disabled: submitting }" @tap="onSubmit">{{ submitting ? '提交中...' : '提交申请' }}</view>
      <view class="bottom-safe-space"></view>
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

const DRAFT_KEY = 'rd_demand_draft'

function getLocalDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default {
  data() {
    return {
      productCategoryOptions: PRODUCT_CATEGORY_OPTIONS,
      serviceTypeOptions: SERVICE_TYPE_OPTIONS,
      expertiseFieldOptions: EXPERTISE_FIELD_OPTIONS,
      budgetRangeOptions: BUDGET_RANGE_OPTIONS,
      dosageFormOptions: DOSAGE_FORM_OPTIONS,
      submitting: false,
      today: getLocalDate(),
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
  onLoad() {
    const draft = uni.getStorageSync(DRAFT_KEY)
    if (draft && typeof draft === 'object') {
      this.form = { ...this.form, ...draft, serviceType: Array.isArray(draft.serviceType) ? draft.serviceType : [] }
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
    onCategoryChange(event) {
      const item = this.productCategoryOptions[Number(event.detail.value)]
      if (item) this.form.productCategory = item.value
    },
    onDomainChange(event) {
      const item = this.expertiseFieldOptions[Number(event.detail.value)]
      if (item) this.form.expertiseField = item.value
    },
    onBudgetChange(event) {
      const item = this.budgetRangeOptions[Number(event.detail.value)]
      if (item) this.form.budgetRange = item.value
    },
    onDosageFormChange(event) {
      const item = this.dosageFormOptions[Number(event.detail.value)]
      if (item) this.form.dosageFormPreference = item.value
    },
    onDateChange(event) {
      this.form.expectedDeliveryTime = event.detail.value
    },
    onSave() {
      uni.setStorageSync(DRAFT_KEY, { ...this.form })
      uni.showToast({ title: '草稿已保存', icon: 'success' })
    },
    async onSubmit() {
      if (this.submitting) return
      const phone = String(this.form.submitterPhone || '').trim()
      if (!this.form.title.trim()) return uni.showToast({ title: '请填写项目名称', icon: 'none' })
      if (!this.form.productCategory) return uni.showToast({ title: '请选择产品品类', icon: 'none' })
      if (!this.form.functionalAppeal.trim()) return uni.showToast({ title: '请填写研发目标与功能诉求', icon: 'none' })
      if (!this.form.targetAudience.trim()) return uni.showToast({ title: '请填写目标用户/应用场景', icon: 'none' })
      if (!this.form.serviceType.length) return uni.showToast({ title: '请选择期望服务类型', icon: 'none' })
      if (!this.form.budgetRange) return uni.showToast({ title: '请选择预算范围', icon: 'none' })
      if (!this.form.expectedDeliveryTime) return uni.showToast({ title: '请选择期望交付时间', icon: 'none' })
      if (!this.form.submitterName.trim()) return uni.showToast({ title: '请填写联系人', icon: 'none' })
      if (!/^1[3-9]\d{9}$/.test(phone)) return uni.showToast({ title: '请输入正确的11位手机号', icon: 'none' })

      this.submitting = true
      uni.showLoading({ title: '提交中...' })
      try {
        const payload = {
          ...this.form,
          title: this.form.title.trim(),
          functionalAppeal: this.form.functionalAppeal.trim(),
          targetAudience: this.form.targetAudience.trim(),
          submitterName: this.form.submitterName.trim(),
          submitterPhone: phone,
          serviceType: JSON.stringify(this.form.serviceType)
        }
        const res = await submitDemand(payload)
        uni.hideLoading()
        uni.removeStorageSync(DRAFT_KEY)
        if (!res || !res.demandNo) throw new Error('提交结果缺少需求编号')
        uni.redirectTo({
          url: `/pages/submit-success/submit-success?demandNo=${encodeURIComponent(res.demandNo)}&phone=${encodeURIComponent(phone)}`
        })
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: err && err.message ? err.message : '提交失败，请重试', icon: 'none' })
      } finally {
        this.submitting = false
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
  padding: 24rpx 24rpx 0;
  box-sizing: border-box;
}
.form-intro { margin-bottom: 24rpx; padding: 32rpx 30rpx; border-radius: 24rpx; background: linear-gradient(135deg, #064b9a 0%, #006c75 100%); color: #fff; box-shadow: 0 10rpx 28rpx rgba(0, 88, 190, 0.18); }
.intro-kicker { font-size: 19rpx; font-weight: 700; letter-spacing: 2rpx; opacity: 0.74; }
.intro-title { margin-top: 10rpx; font-size: 36rpx; font-weight: 750; }
.intro-desc { margin-top: 12rpx; font-size: 23rpx; line-height: 1.65; opacity: 0.86; }

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
.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  color: var(--primary);
  font-weight: 600;
  margin-top: 8rpx;
  border: 1rpx solid var(--primary);
  background: #ffffff;
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
  margin-top: 16rpx;
  margin-bottom: 0;
}
.btn-submit.disabled {
  opacity: 0.6;
}
.bottom-safe-space {
  width: 100%;
  height: calc(100rpx + env(safe-area-inset-bottom));
  flex-shrink: 0;
}
.rounded-card { border-width: 1rpx; box-shadow: 0 8rpx 22rpx rgba(60, 90, 170, 0.07); }
.block-title { color: var(--on-surface); font-weight: 700; }
.form-input, .form-textarea { border-width: 1rpx; background: #ffffff; }
.btn-submit { box-shadow: 0 7rpx 18rpx rgba(0, 88, 190, 0.22); }
.block-title { gap: 14rpx; }
.block-index { width: 48rpx; height: 48rpx; border-radius: 13rpx; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 20rpx; font-weight: 700; }
.block-title-text { font-size: 30rpx; font-weight: 750; }
.form-label { font-weight: 600; }
.form-item picker { display: block; width: 100%; }
.select-action { flex-shrink: 0; margin-left: 18rpx; padding: 7rpx 14rpx; border-radius: 9rpx; background: var(--primary-light); color: var(--primary); font-size: 21rpx; font-weight: 700; }
.form-textarea { background: #fbfdff; }
.tag-item.active { background: linear-gradient(135deg, var(--primary) 0%, #006c75 100%); }
.btn-save { box-shadow: 0 5rpx 16rpx rgba(60, 90, 170, 0.06); }
</style>
