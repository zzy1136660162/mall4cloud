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
          <input v-model="form.name" class="form-input" placeholder="请输入明确的项目或产品名称" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>产品品类</view>
          <view class="form-input select" @tap="onPickCategory">
            <text v-if="!form.category" class="ph">请选择品类</text>
            <text v-else>{{ form.category }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label">产品形态</view>
          <input v-model="form.form" class="form-input" placeholder="例如：SaaS 平台、嵌入式模块、原型机等" placeholder-class="ph" />
        </view>
      </view>

      <!-- 区块 2 技术诉求与场景 -->
      <view class="rounded-card block">
        <view class="block-title">
          <view class="block-title-icon">🧪</view>
          <text class="block-title-text">技术诉求与场景</text>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>期望对接领域</view>
          <view class="form-input select" @tap="onPickDomain">
            <text v-if="!form.domain" class="ph">选择技术领域</text>
            <text v-else>{{ form.domain }}</text>
            <text class="caret">▾</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>研发目标与功能诉求</view>
          <textarea
            v-model="form.goal"
            class="form-textarea"
            placeholder="详细描述项目所需要解决的技术难点、期望实现的核心功能/指标等..."
            placeholder-class="ph"
            maxlength="-1"
          ></textarea>
        </view>
        <view class="form-item">
          <view class="form-label">目标用户/应用场景</view>
          <textarea
            v-model="form.scene"
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
              v-for="t in serviceTypes"
              :key="t"
              class="tag-item"
              :class="{ active: form.services.includes(t) }"
              @tap="toggleService(t)"
            >{{ t }}</view>
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
          <view class="form-label">预算金额（万元）</view>
          <view class="form-input with-suffix">
            <input v-model="form.budget" type="digit" placeholder="输入预估金额" placeholder-class="ph" />
            <text class="suffix">万</text>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>期望交付时间</view>
          <view class="form-input with-suffix" @tap="onPickDate">
            <text v-if="!form.deliverDate" class="ph">yyyy/mm/dd</text>
            <text v-else>{{ form.deliverDate }}</text>
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
          <input v-model="form.contact" class="form-input" placeholder="填写项目接口人姓名" placeholder-class="ph" />
        </view>
        <view class="form-item">
          <view class="form-label"><text class="req">*</text>联系电话</view>
          <input v-model="form.phone" class="form-input" type="number" maxlength="11" placeholder="填写手机号或座机号" placeholder-class="ph" />
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
export default {
  data() {
    return {
      serviceTypes: ['联合研发', '技术咨询', '成果投放', '外包开发'],
      form: {
        name: '',
        category: '',
        form: '',
        domain: '',
        goal: '',
        scene: '',
        services: [],
        budget: '',
        deliverDate: '',
        contact: '',
        phone: ''
      }
    }
  },
  methods: {
    toggleService(t) {
      const idx = this.form.services.indexOf(t)
      if (idx === -1) this.form.services.push(t)
      else this.form.services.splice(idx, 1)
    },
    onPickCategory() {
      uni.showActionSheet({
        itemList: ['软件类', '硬件类', '材料类', '生物医药类', '其他'],
        success: (res) => {
          const list = ['软件类', '硬件类', '材料类', '生物医药类', '其他']
          this.form.category = list[res.tapIndex]
        }
      })
    },
    onPickDomain() {
      uni.showActionSheet({
        itemList: ['人工智能', '生物医药', '新能源材料', '智能制造', '航空航天', '其他'],
        success: (res) => {
          const list = ['人工智能', '生物医药', '新能源材料', '智能制造', '航空航天', '其他']
          this.form.domain = list[res.tapIndex]
        }
      })
    },
    onPickDate() {
      uni.showActionSheet({
        itemList: ['1 个月内', '3 个月内', '6 个月内', '12 个月内'],
        success: (res) => {
          const list = ['1 个月内', '3 个月内', '6 个月内', '12 个月内']
          this.form.deliverDate = list[res.tapIndex]
        }
      })
    },
    onSave() {
      uni.showToast({ title: '草稿已保存', icon: 'success' })
    },
    onSubmit() {
      if (!this.form.name) return uni.showToast({ title: '请填写项目名称', icon: 'none' })
      if (!this.form.goal) return uni.showToast({ title: '请填写研发目标', icon: 'none' })
      if (!this.form.contact) return uni.showToast({ title: '请填写联系人', icon: 'none' })
      if (!this.form.phone) return uni.showToast({ title: '请填写联系电话', icon: 'none' })
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.redirectTo({ url: '/pages/submit-success/submit-success' })
      }, 800)
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
  padding: 24rpx 32rpx 220rpx;
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
