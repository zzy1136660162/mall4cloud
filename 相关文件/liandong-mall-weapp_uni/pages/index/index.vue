<template>
    <view class="index-page">
        <!-- 分类Tab切换 -->
        <sp-category-tab :currentTab="currentTab" @tabchange="onTabChange" />

        <!-- 轮播图区域 -->
        <view class="home-banner">
            <swiper class="banner-swiper" indicator-dots autoplay circular interval="3500" duration="500" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ff5000">
                <swiper-item v-for="(item, index) in banners" :key="index">
                    <image class="banner-image" :src="item.image" mode="aspectFill" />

                    <view class="banner-content" v-if="item.title || item.subtitle">
                        <text class="banner-title" v-if="item.title">{{ item.title }}</text>
                        <text class="banner-subtitle" v-if="item.subtitle">{{ item.subtitle }}</text>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 分类列表 -->
        <sp-category-list :currentTab="currentTab" @categorychange="onCategoryChange" />

        <!-- 商品推荐区组件 -->
        <sp-home-recommend title="热门推荐" productType="recommend" :limit="4" :showMore="true" />

        <!-- 热销商品组件 -->
        <!-- <sp-home-recommend
    title="热销商品"
    productType="hot"
    limit="4"
    showMore="{{true}}"
  /> -->

        <!-- 新品上市组件 -->
        <!-- <sp-home-recommend
    title="新品上市"
    productType="new"
    limit="4"
    showMore="{{true}}"
  /> -->

        <!-- 选品商品推荐组件 -->
        <sp-home-xuanpin title="选品推荐" :limit="3" :showMore="true" />

        <!-- 研发人才库组件 -->
        <home-talent-pool title="研发人才库" :limit="3" :showMore="true" />
    </view>
</template>

<script>
import spHomeRecommend from '../../components/sp_HomeRecommend/sp_HomeRecommend';
import homeTalentPool from '../../components/home_talent_pool/home_talent_pool';
import spHomeXuanpin from '../../components/sp_HomeXuanpin/sp_HomeXuanpin';
import spCategoryTab from '../../components/sp_CategoryTab/sp_CategoryTab';
import spCategoryList from '../../components/sp_CategoryList/sp_CategoryList';
const { productApi } = require('../../utils/sp_api.js');
export default {
    components: {
        spHomeRecommend,
        homeTalentPool,
        spHomeXuanpin,
        spCategoryTab,
        spCategoryList
    },
    data() {
        return {
            currentTab: 'tibao',
            banners: [
                {
                    id: 1,
                    image: 'https://picsum.photos/750/300?random=1',
                    title: '新人专享优惠',
                    subtitle: '首单立减20元'
                },
                {
                    id: 2,
                    image: 'https://picsum.photos/750/300?random=2',
                    title: '热门推荐',
                    subtitle: '精选好物等你来'
                },
                {
                    id: 3,
                    image: 'https://picsum.photos/750/300?random=3',
                    title: '限时秒杀',
                    subtitle: '每天10点准时开抢'
                }
            ]
        };
    },
    onLoad() {
        this.loadBanners();
    },
    methods: {
        async loadBanners() {
            try {
                const banners = await productApi.getHomeBanners();
                if (banners && banners.length > 0) {
                    const formattedBanners = banners.map((banner) => ({
                        id: banner.id,
                        image: banner.imageUrl,
                        title: banner.title || '',
                        subtitle: banner.subtitle || ''
                    }));
                    this.setData({
                        banners: formattedBanners
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载首页轮播图失败:', error);
            }
        },

        onTabChange(e) {
            const { tabId } = e.detail;
            this.setData({
                currentTab: tabId
            });
            console.log('Tab切换:', tabId);
        },

        onCategoryChange(e) {
            const { tabId, categoryId, categoryName } = e.detail;
            console.log('分类切换:', tabId, categoryId, categoryName);
        }
    }
};
</script>
<style>
.container {
    padding: 24rpx;
    background: linear-gradient(180deg, #fffbe6 0%, #f5f5f5 100%);
    min-height: 100vh;
}

.index-page {
    min-height: 100vh;
    background: #f5f5f5;
}

/* 首页轮播图区域 */
.home-banner {
    width: 100%;
    padding: 0 24rpx 40rpx;
    box-sizing: border-box;
    margin-top: 40rpx;
}

.banner-swiper {
    width: 100%;
    height: 300rpx;
    border-radius: 16rpx;
    overflow: hidden;
}

.banner-image {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-content {
    position: absolute;
    bottom: 40rpx;
    left: 40rpx;
    right: 40rpx;
    z-index: 2;
}

.banner-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    margin-bottom: 8rpx;
}

.banner-subtitle {
    display: block;
    font-size: 24rpx;
    color: #ffffff;
    opacity: 0.9;
    text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);
}

/* Banner区域 */
.banner {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    padding: 80rpx 40rpx 100rpx;
    text-align: center;
    color: #333;
    position: relative;
    overflow: hidden;
}

.banner::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400rpx;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.banner::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.banner-title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    position: relative;
    z-index: 1;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.banner-subtitle {
    font-size: 28rpx;
    opacity: 0.95;
    position: relative;
    z-index: 1;
}

/* 卡片样式 */
.card {
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    margin: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;
    margin-top: -40rpx;
}

.section-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: '';
    width: 8rpx;
    height: 36rpx;
    background: linear-gradient(180deg, #1890ff 0%, #36cfc9 100%);
    border-radius: 4rpx;
    margin-right: 16rpx;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.link-text {
    font-size: 26rpx;
    color: #1890ff;
    display: flex;
    align-items: center;
    font-weight: 500;
}

/* 快捷入口 */
.quick-actions {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 50rpx;
    transition: transform 0.2s;
}

.action-item:active {
    transform: scale(0.95);
}

.action-icon {
    width: 140rpx;
    height: 140rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>
