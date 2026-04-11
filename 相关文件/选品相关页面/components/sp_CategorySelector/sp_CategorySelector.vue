<template>
    <view class="category-selector">
        <view class="tab-bar">
            <view :class="'tab-item ' + (currentTab === item.id ? 'active' : '')" @tap="switchTab" :data-id="item.id" v-for="(item, index) in tabs" :key="index">
                <text class="tab-text">{{ item.name }}</text>
            </view>
        </view>

        <view class="category-list">
            <view
                :class="'category-item ' + (selectedCategoryClone === item.id ? 'active' : '')"
                @tap="selectCategory"
                :data-id="item.id"
                :data-name="item.name"
                v-for="(item, index) in currentCategories"
                :key="index"
            >
                <text class="category-text">{{ item.name }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'tibao',

            tabs: [
                {
                    id: 'tibao',
                    name: '体表保健'
                },
                {
                    id: 'gongneng',
                    name: '功能食品'
                }
            ],

            allCategories: [
                {
                    id: 'tibao_1',
                    name: '疼痛舒缓',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_2',
                    name: '鼻部护理',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_3',
                    name: '眼部护理',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_4',
                    name: '皮肤护理',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_5',
                    name: '女性调理',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_6',
                    name: '男性养护',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_7',
                    name: '小儿护理',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_8',
                    name: '纤体瘦身',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_9',
                    name: '养发护发',
                    parentId: 'tibao'
                },
                {
                    id: 'tibao_10',
                    name: '泡浴养生',
                    parentId: 'tibao'
                },
                {
                    id: 'gongneng_1',
                    name: '人参滋补',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_2',
                    name: '阿胶膏滋',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_3',
                    name: '草本茶饮',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_4',
                    name: '固体饮料',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_5',
                    name: '压片糖果',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_6',
                    name: '营养颗粒',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_7',
                    name: '植物饮品',
                    parentId: 'gongneng'
                },
                {
                    id: 'gongneng_8',
                    name: '配制酒',
                    parentId: 'gongneng'
                }
            ],

            currentCategories: [],
            selectedCategoryClone: ''
        };
    },

    props: {
        selectedCategory: {
            type: String,
            default: ''
        }
    },

    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },

    watch: {
        currentTab: function () {
            this.updateCategories();
        },

        selectedCategory: {
            handler: function (newVal, oldVal) {
                this.selectedCategoryClone = newVal;
            },

            immediate: true
        }
    },

    methods: {
        attached() {
            this.updateCategories();
        },

        switchTab(e) {
            const id = e.currentTarget.dataset.id;
            this.setData({
                currentTab: id,
                selectedCategoryClone: ''
            });
            this.$emit('categorychange', {
                detail: {
                    tabId: id,
                    categoryId: ''
                }
            });
        },

        selectCategory(e) {
            const { id, name } = e.currentTarget.dataset;
            this.setData({
                selectedCategoryClone: id
            });
            this.$emit('categorychange', {
                detail: {
                    tabId: this.currentTab,
                    categoryId: id,
                    categoryName: name
                }
            });
        },

        updateCategories() {
            const categories = this.allCategories.filter((item) => item.parentId === this.currentTab);
            this.setData({
                currentCategories: categories
            });
        }
    },

    created: function () {}
};
</script>
<style>
.category-selector {
    background: #ffffff;
    padding: 24rpx;
}

.tab-bar {
    display: flex;
    gap: 24rpx;
    margin-bottom: 24rpx;
}

.tab-item {
    padding: 12rpx 0;
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

.category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.category-item {
    padding: 12rpx 28rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    border: 2rpx solid transparent;
}

.category-item.active {
    background: #fff0f0;
    border-color: #ff6b6b;
}

.category-text {
    font-size: 26rpx;
    color: #666666;
}

.category-item.active .category-text {
    color: #ff4757;
}
</style>
