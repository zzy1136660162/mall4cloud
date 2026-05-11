<template>
    <view class="page">
        <!-- 活动Banner -->
        <view class="activity-banner">
            <image class="banner-image" src="https://picsum.photos/750/300?random=200" mode="aspectFill" />
            <view class="banner-overlay">
                <text class="banner-title">同行跟选</text>
                <text class="banner-subtitle">看看同行都在卖什么，紧跟市场趋势</text>
            </view>
        </view>

        <!-- 活动数据 -->
        <view class="activity-stats">
            <view class="stat-item">
                <text class="stat-number">{{ stats.followerCount }}</text>
                <text class="stat-label">跟选达人</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.successRate }}%</text>
                <text class="stat-label">成功率</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.avgIncome }}</text>
                <text class="stat-label">平均收益</text>
            </view>
        </view>

        <!-- 达人榜单 -->
        <view class="section-title">
            <text class="title-text">🏆 达人带货榜</text>
            <text class="sub-text">看看谁卖得最好</text>
        </view>

        <!-- 达人列表 -->
        <view class="talent-list">
            <view class="talent-item" v-for="(item, index) in talents" :key="index">
                <view :class="'talent-rank ' + (index < 3 ? 'top' : '')">{{ index + 1 }}</view>

                <image class="talent-avatar" :src="item.avatar" mode="aspectFill" />

                <view class="talent-info">
                    <text class="talent-name">{{ item.name }}</text>
                    <text class="talent-tag">{{ item.tag }}</text>
                    <text class="talent-sales">月销 {{ item.sales }}</text>
                </view>

                <view class="follow-btn" @tap="followTalent" :data-id="item.id">
                    <text>{{ item.isFollowing ? '已关注' : '+ 关注' }}</text>
                </view>
            </view>
        </view>

        <!-- 筛选标签 -->
        <view class="filter-section">
            <scroll-view class="filter-scroll" scroll-x enhanced :show-scrollbar="false">
                <view class="filter-list">
                    <view :class="'filter-item ' + (currentFilter === 'all' ? 'active' : '')" @tap="switchFilter" data-filter="all">
                        <text>全部</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'following' ? 'active' : '')" @tap="switchFilter" data-filter="following">
                        <text>我关注的</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'hot' ? 'active' : '')" @tap="switchFilter" data-filter="hot">
                        <text>热销跟选</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'new' ? 'active' : '')" @tap="switchFilter" data-filter="new">
                        <text>最新跟选</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <view class="product-image-wrap">
                    <image class="product-image" :src="item.image" mode="aspectFill" />
                    <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
                </view>

                <view class="product-info">
                    <!-- 跟选信息 -->
                    <view class="follow-info">
                        <image class="follower-avatar" :src="item.followerAvatar" mode="aspectFill" />
                        <text class="follower-name">{{ item.followerName }}</text>
                        <text class="follow-count">{{ item.followCount }}人跟选</text>
                    </view>

                    <!-- 标签 -->
                    <view class="product-tags">
                        <view class="tag cashback" v-if="item.cashback">单单返现</view>
                        <view class="tag trust" v-if="item.trust">信任购</view>
                        <view class="tag brand" v-if="item.isBrand">品牌</view>
                    </view>

                    <!-- 标题 -->
                    <view class="product-title">{{ item.title }}</view>

                    <!-- 佣金信息 -->
                    <view class="commission-row">
                        <text class="commission-text">赚¥{{ item.commission }}</text>
                        <text class="commission-rate">{{ item.rate }}佣</text>
                    </view>

                    <!-- 价格销量 -->
                    <view class="price-row">
                        <text class="price-label">售价¥{{ item.price }}</text>
                        <text class="sales-text">{{ item.sales }}</text>
                    </view>

                    <!-- 加入货架按钮 -->
                    <view class="add-btn" @tap.stop.prevent="addToShelf" :data-id="item.id">加入货架</view>
                </view>
            </view>
        </view>

        <!-- 底部安全区域 -->
        <view class="safe-area"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentFilter: 'all',
            stats: {
                followerCount: '12.5万',
                successRate: '85',
                avgIncome: '¥3,280'
            },
            talents: [],
            products: []
        };
    },
    onLoad() {
        this.loadTalents();
        this.loadProducts();
    },
    methods: {
        loadTalents() {
            const talents = [
                {
                    id: 1,
                    avatar: 'https://picsum.photos/100/100?random=1',
                    name: '小美带货达人',
                    tag: '美妆达人',
                    sales: '¥128万',
                    isFollowing: true
                },
                {
                    id: 2,
                    avatar: 'https://picsum.photos/100/100?random=2',
                    name: '吃货小王',
                    tag: '美食博主',
                    sales: '¥96万',
                    isFollowing: false
                },
                {
                    id: 3,
                    avatar: 'https://picsum.photos/100/100?random=3',
                    name: '家居生活家',
                    tag: '家居达人',
                    sales: '¥85万',
                    isFollowing: false
                },
                {
                    id: 4,
                    avatar: 'https://picsum.photos/100/100?random=4',
                    name: '潮流穿搭师',
                    tag: '时尚博主',
                    sales: '¥72万',
                    isFollowing: true
                },
                {
                    id: 5,
                    avatar: 'https://picsum.photos/100/100?random=5',
                    name: '数码测评君',
                    tag: '数码达人',
                    sales: '¥68万',
                    isFollowing: false
                }
            ];
            this.setData({
                talents
            });
        },

        loadProducts() {
            const products = [
                {
                    id: 'follow_1',
                    image: 'https://picsum.photos/400/400?random=10',
                    title: '花间颂粉饼控油定妆持久遮瑕散粉',
                    price: '49.9',
                    commission: '13.97',
                    rate: '28%',
                    sales: '月销6.4万件',
                    followerAvatar: 'https://picsum.photos/50/50?random=1',
                    followerName: '小美带货达人',
                    followCount: '2.3万',
                    tag: '跟选爆款',
                    cashback: true,
                    trust: true,
                    isBrand: true
                },
                {
                    id: 'follow_2',
                    image: 'https://picsum.photos/400/400?random=11',
                    title: '【拍1发4包】麻辣牛板筋自拌延边特产',
                    price: '8.98',
                    commission: '1.98',
                    rate: '22%',
                    sales: '月销1.3万件',
                    followerAvatar: 'https://picsum.photos/50/50?random=2',
                    followerName: '吃货小王',
                    followCount: '1.8万',
                    cashback: false,
                    trust: true,
                    isBrand: false
                },
                {
                    id: 'follow_3',
                    image: 'https://picsum.photos/400/400?random=12',
                    title: '南极人A类抗菌大豆被加厚保暖冬被',
                    price: '82',
                    commission: '8.2',
                    rate: '10%',
                    sales: '304人已上架',
                    followerAvatar: 'https://picsum.photos/50/50?random=3',
                    followerName: '家居生活家',
                    followCount: '1.2万',
                    tag: '新品推荐',
                    cashback: true,
                    trust: false,
                    isBrand: true
                },
                {
                    id: 'follow_4',
                    image: 'https://picsum.photos/400/400?random=13',
                    title: '春季爆款高腰显瘦阔腿裤',
                    price: '98',
                    commission: '12.74',
                    rate: '13%',
                    sales: '月销2088件',
                    followerAvatar: 'https://picsum.photos/50/50?random=4',
                    followerName: '潮流穿搭师',
                    followCount: '9,856',
                    cashback: false,
                    trust: true,
                    isBrand: false
                }
            ];
            this.setData({
                products
            });
        },

        switchFilter(e) {
            const filter = e.currentTarget.dataset.filter;
            this.setData({
                currentFilter: filter
            });
        },

        followTalent(e) {
            const id = e.currentTarget.dataset.id;
            const talents = this.talents.map((t) => {
                if (t.id === id) {
                    t.isFollowing = !t.isFollowing;
                }
                return t;
            });
            this.setData({
                talents
            });
            uni.showToast({
                title: '操作成功',
                icon: 'success'
            });
        },

        goToProductDetail(e) {
            const id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + id
            });
        },

        addToShelf(e) {
            uni.showToast({
                title: '已加入货架',
                icon: 'success'
            });
        }
    }
};
</script>
<style>
.page {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 40rpx;
}

/* 状态栏占位 */
.status-bar {
    background: #fff;
}

/* 顶部导航栏 */
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}

.nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-icon {
    font-size: 36rpx;
    color: #333;
}

.nav-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
}

.nav-right {
    width: 60rpx;
}

/* 活动Banner */
.activity-banner {
    position: relative;
    width: 100%;
    height: 280rpx;
}

.banner-image {
    width: 100%;
    height: 100%;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40rpx;
}

.banner-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    margin-bottom: 16rpx;
}

.banner-subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 活动数据 */
.activity-stats {
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-number {
    font-size: 40rpx;
    font-weight: bold;
    color: #ff4757;
    margin-bottom: 8rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #999;
}

/* 区块标题 */
.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background: #fff;
    margin-bottom: 2rpx;
}

.title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

.sub-text {
    font-size: 24rpx;
    color: #999;
}

/* 达人列表 */
.talent-list {
    background: #fff;
    padding: 0 20rpx 20rpx;
    margin-bottom: 20rpx;
}

.talent-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}

.talent-item:last-child {
    border-bottom: none;
}

.talent-rank {
    width: 48rpx;
    height: 48rpx;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    color: #666;
    margin-right: 20rpx;
}

.talent-rank.top {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
}

.talent-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}

.talent-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.talent-name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 8rpx;
}

.talent-tag {
    font-size: 24rpx;
    color: #ff4757;
    background: #ffe4e9;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
    width: fit-content;
    margin-bottom: 8rpx;
}

.talent-sales {
    font-size: 24rpx;
    color: #999;
}

.follow-btn {
    padding: 12rpx 32rpx;
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    border-radius: 32rpx;
}

.follow-btn text {
    font-size: 26rpx;
    color: #fff;
}

/* 筛选标签 */
.filter-section {
    background: #fff;
    padding: 20rpx 0;
    margin-bottom: 20rpx;
}

.filter-scroll {
    white-space: nowrap;
}

.filter-list {
    display: flex;
    padding: 0 20rpx;
}

.filter-item {
    padding: 16rpx 32rpx;
    margin-right: 16rpx;
    background: #f5f5f5;
    border-radius: 32rpx;
}

.filter-item text {
    font-size: 28rpx;
    color: #666;
}

.filter-item.active {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
}

.filter-item.active text {
    color: #fff;
    font-weight: 500;
}

/* 商品列表 */
.product-list {
    padding: 0 20rpx;
}

.product-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
}

.product-image-wrap {
    width: 240rpx;
    height: 240rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
}

.product-image {
    width: 100%;
    height: 100%;
}

.product-tag {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 22rpx;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

.product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
}

/* 跟选信息 */
.follow-info {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.follower-avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 12rpx;
}

.follower-name {
    font-size: 24rpx;
    color: #666;
    margin-right: 16rpx;
}

.follow-count {
    font-size: 22rpx;
    color: #ff4757;
    background: #ffe4e9;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

/* 商品标签 */
.product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12rpx;
}

.tag {
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
    font-size: 22rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
}

.tag.cashback {
    background: #ffe4e9;
    color: #ff4757;
}

.tag.trust {
    background: #e8f5e9;
    color: #2ed573;
}

.tag.brand {
    background: #fff3e0;
    color: #ffa502;
}

/* 标题 */
.product-title {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    margin-bottom: 12rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 佣金信息 */
.commission-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.commission-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #ff4757;
    margin-right: 16rpx;
}

.commission-rate {
    font-size: 24rpx;
    color: #ff4757;
    background: #ffe4e9;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

/* 价格销量 */
.price-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.price-label {
    font-size: 24rpx;
    color: #999;
    margin-right: 20rpx;
}

.sales-text {
    font-size: 24rpx;
    color: #999;
}

/* 加入货架按钮 */
.add-btn {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 0;
    border-radius: 32rpx;
    text-align: center;
    margin-top: auto;
}

/* 底部安全区域 */
.safe-area {
    height: 40rpx;
}
</style>
