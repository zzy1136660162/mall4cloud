<template>
    <view class="category-tab">
        <view :class="'tab-item ' + (currentTab === item.id ? 'active' : '')" @tap="switchTab" :data-id="item.id" v-for="(item, index) in tabs" :key="index">
            <text class="tab-text">{{ item.name }}</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tabs: [
                {
                    id: 'tibao',
                    name: '体表保健'
                },
                {
                    id: 'gongneng',
                    name: '功能食品'
                }
            ]
        };
    },
    props: {
        currentTab: {
            type: String,
            default: 'tibao'
        }
    },
    methods: {
        switchTab(e) {
            const id = e.currentTarget.dataset.id;
            if (id !== this.currentTab) {
                this.$emit('tabchange', {
                    detail: {
                        tabId: id
                    }
                });
            }
        }
    },
    created: function () {}
};
</script>
<style>
.category-tab {
    display: flex;
    gap: 24rpx;
    padding: 24rpx 24rpx 0;
    background: #ffffff;
}

.tab-item {
    padding: 12rpx 0 20rpx;
    position: relative;
}

.tab-text {
    font-size: 30rpx;
    color: #999999;
    font-weight: 400;
}

.tab-item.active .tab-text {
    color: #333333;
    font-weight: 600;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
    border-radius: 3rpx;
}
</style>
