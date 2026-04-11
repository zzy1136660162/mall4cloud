<template>
    <view class="category-list">
        <view
            :class="'category-item ' + (selectedCategory === item.id ? 'active' : '')"
            @tap="selectCategory"
            :data-id="item.id"
            :data-name="item.name"
            v-for="(item, index) in categories"
            :key="index"
        >
            <text class="category-icon">{{ item.icon }}</text>

            <text class="category-text">{{ item.name }}</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            allCategories: [
                {
                    id: '9',
                    name: '疼痛舒缓',
                    icon: '💆',
                    parentId: 'tibao'
                },
                {
                    id: '10',
                    name: '鼻部护理',
                    icon: '👃',
                    parentId: 'tibao'
                },
                {
                    id: '11',
                    name: '眼部护理',
                    icon: '👁',
                    parentId: 'tibao'
                },
                {
                    id: '12',
                    name: '皮肤护理',
                    icon: '🧴',
                    parentId: 'tibao'
                },
                {
                    id: '13',
                    name: '女性调理',
                    icon: '🌸',
                    parentId: 'tibao'
                },
                {
                    id: '26',
                    name: '男性养护',
                    icon: '💪',
                    parentId: 'tibao'
                },
                {
                    id: '14',
                    name: '小儿护理',
                    icon: '👶',
                    parentId: 'tibao'
                },
                {
                    id: '16',
                    name: '纤体瘦身',
                    icon: '⚖️',
                    parentId: 'tibao'
                },
                {
                    id: '17',
                    name: '养发护发',
                    icon: '💇',
                    parentId: 'tibao'
                },
                {
                    id: '18',
                    name: '泡浴养生',
                    icon: '🛁',
                    parentId: 'tibao'
                },
                {
                    id: '24',
                    name: '人参滋补',
                    icon: '🌿',
                    parentId: 'gongneng'
                },
                {
                    id: '19',
                    name: '阿胶膏滋',
                    icon: '🍯',
                    parentId: 'gongneng'
                },
                {
                    id: '20',
                    name: '草本茶饮',
                    icon: '🍵',
                    parentId: 'gongneng'
                },
                {
                    id: '21',
                    name: '固体饮料',
                    icon: '🥤',
                    parentId: 'gongneng'
                },
                {
                    id: '23',
                    name: '压片糖果',
                    icon: '💊',
                    parentId: 'gongneng'
                },
                {
                    id: '22',
                    name: '营养颗粒',
                    icon: '🧪',
                    parentId: 'gongneng'
                },
                {
                    id: '25',
                    name: '植物饮品',
                    icon: '🌱',
                    parentId: 'gongneng'
                },
                {
                    id: '15',
                    name: '配制酒',
                    icon: '🍶',
                    parentId: 'gongneng'
                }
            ],
            categories: []
        };
    },

    props: {
        currentTab: {
            type: String,
            default: 'tibao'
        },
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
        }
    },

    methods: {
        attached() {
            this.updateCategories();
        },

        selectCategory(e) {
            const { id, name } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/categoryList/categoryList?categoryId=${id}&categoryName=${name}`
            });
        },

        updateCategories() {
            const categories = this.allCategories.filter((item) => item.parentId === this.currentTab);
            this.setData({
                categories: categories
            });
        }
    },

    created: function () {}
};
</script>
<style>
.category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    padding: 24rpx;
    background: #ffffff;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150rpx;
    height: 150rpx;
    border-radius: 16rpx;
    border: 2rpx solid transparent;
}

.category-item.active {
    border-color: #ff6b6b;
}

.category-icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
}

.category-text {
    font-size: 24rpx;
    color: #666666;
    text-align: center;
}

.category-item.active .category-text {
    color: #ff4757;
}
</style>
