<template>
    <view class="page">
        <!-- 顶部导航 -->
        <view class="header">
            <view class="nav-tabs">
                <view :class="'nav-item ' + (currentTab === 'sales' ? 'active' : '')" @tap="switchTab" data-tab="sales">
                    <text class="nav-text">销量榜</text>
                </view>
                <view :class="'nav-item ' + (currentTab === 'commission' ? 'active' : '')" @tap="switchTab" data-tab="commission">
                    <text class="nav-text">佣金榜</text>
                </view>
                <view :class="'nav-item ' + (currentTab === 'rising' ? 'active' : '')" @tap="switchTab" data-tab="rising">
                    <text class="nav-text">飙升榜</text>
                </view>
                <view :class="'nav-item ' + (currentTab === 'new' ? 'active' : '')" @tap="switchTab" data-tab="new">
                    <text class="nav-text">新品榜</text>
                </view>
            </view>
        </view>

        <!-- 榜单说明 -->
        <view class="rank-info">
            <text class="info-text">{{ rankInfo }}</text>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <!-- 排名标识 -->

                <view :class="'rank-badge ' + (index < 3 ? 'top' : '')">
                    <text class="rank-number">{{ index + 1 }}</text>
                </view>

                <view class="product-img-wrap">
                    <image class="product-img" :src="item.image" mode="aspectFill" />
                    <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
                </view>

                <view class="product-info">
                    <view class="product-title">{{ item.title }}</view>

                    <!-- 服务标签 -->
                    <view class="service-tags" v-if="item.tags">
                        <text class="service-tag" v-for="(item, index1) in item.tags" :key="index1">{{ item }}</text>
                    </view>

                    <!-- 店铺信息 -->
                    <view class="shop-info">
                        <text class="shop-name">{{ item.shop }}</text>
                        <text class="shop-score" v-if="item.shopScore">{{ item.shopScore }}分</text>
                    </view>

                    <view class="product-price-wrap">
                        <text class="price-symbol">¥</text>
                        <text class="product-price">{{ item.price }}</text>
                        <text class="product-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                    </view>

                    <view class="product-commission-wrap">
                        <text class="commission-tag">佣金{{ item.commissionRate }}%</text>
                        <text class="commission-amount">预计赚¥{{ item.commissionAmount }}</text>
                    </view>

                    <view class="product-bottom">
                        <view class="sales-info">
                            <text class="sales-text">已售{{ item.salesText }}</text>
                            <text class="location" v-if="item.location">{{ item.location }}</text>
                        </view>
                        <view class="btn-apply" @tap.stop.prevent="applySample" :data-id="item.id">申请样品</view>
                    </view>

                    <!-- 榜单数据展示 -->
                    <view class="rank-data" v-if="currentTab === 'sales'">
                        <text class="data-text">24小时销量 {{ item.dailySales || item.salesText }}</text>
                    </view>
                    <view class="rank-data" v-if="currentTab === 'rising'">
                        <text class="data-text rise">↑ 销量增长 {{ item.riseRate || '200%' }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'sales',
            rankInfo: '根据近24小时销量排序，每小时更新',
            products: []
        };
    },
    onLoad() {
        this.loadProducts();
    },
    methods: {
        // 切换榜单
        switchTab(e) {
            const tab = e.currentTarget.dataset.tab;
            const infoMap = {
                sales: '根据近24小时销量排序，每小时更新',
                commission: '根据佣金比例从高到低排序',
                rising: '根据销量增长率排序，发现潜力爆款',
                new: '近7天上新商品，按销量排序'
            };
            this.setData({
                currentTab: tab,
                rankInfo: infoMap[tab]
            });
            this.loadProducts();
        },

        // 加载商品数据
        loadProducts() {
            const allProducts = [
                {
                    id: 1,
                    image: 'https://picsum.photos/400/400?random=1',
                    title: '立白大师香氛洗衣液持久留香护色护衣天然酵素',
                    price: '39.9',
                    originalPrice: '69.9',
                    commissionRate: 20,
                    commissionAmount: '7.98',
                    sales: 120000,
                    salesText: '12万',
                    dailySales: '1.2万',
                    riseRate: '150%',
                    tag: '爆款',
                    tags: ['正品保障', '7天无理由', '运费险'],
                    shop: '立白官方旗舰店',
                    shopScore: 4.9,
                    location: '广东广州'
                },
                {
                    id: 6,
                    image: 'https://picsum.photos/400/400?random=6',
                    title: '完美日记眼影盘动物盘十二色眼影小猫盘',
                    price: '99',
                    originalPrice: '159',
                    commissionRate: 20,
                    commissionAmount: '19.8',
                    sales: 210000,
                    salesText: '21万',
                    dailySales: '2.1万',
                    riseRate: '300%',
                    tag: '爆款',
                    tags: ['正品保障', '7天无理由'],
                    shop: '完美日记旗舰店',
                    shopScore: 4.7,
                    location: '广东广州'
                },
                {
                    id: 5,
                    image: 'https://picsum.photos/400/400?random=5',
                    title: '花西子散粉定妆粉饼持久控油防水防汗不脱妆',
                    price: '149',
                    originalPrice: '199',
                    commissionRate: 22,
                    commissionAmount: '32.78',
                    sales: 156000,
                    salesText: '15.6万',
                    dailySales: '1.5万',
                    riseRate: '180%',
                    tags: ['正品保障', '7天无理由', '国货之光'],
                    shop: '花西子旗舰店',
                    shopScore: 4.8,
                    location: '浙江杭州'
                },
                {
                    id: 2,
                    image: 'https://picsum.photos/400/400?random=2',
                    title: '维达超韧抽纸3层130抽24包整箱装家用实惠',
                    price: '45.9',
                    originalPrice: '59.9',
                    commissionRate: 18,
                    commissionAmount: '8.26',
                    sales: 85000,
                    salesText: '8.5万',
                    dailySales: '8500',
                    riseRate: '120%',
                    tag: '官方',
                    tags: ['正品保障', '极速退款'],
                    shop: '维达官方旗舰店',
                    shopScore: 4.8,
                    location: '浙江杭州'
                },
                {
                    id: 3,
                    image: 'https://picsum.photos/400/400?random=3',
                    title: '漫花悬挂式抽纸整箱批发家用实惠装10提',
                    price: '29.9',
                    originalPrice: '49.9',
                    commissionRate: 25,
                    commissionAmount: '7.48',
                    sales: 56000,
                    salesText: '5.6万',
                    dailySales: '5600',
                    riseRate: '200%',
                    tags: ['正品保障', '7天无理由'],
                    shop: '漫花旗舰店',
                    shopScore: 4.7,
                    location: '江苏苏州'
                },
                {
                    id: 4,
                    image: 'https://picsum.photos/400/400?random=4',
                    title: 'SK-II神仙水精华液护肤套装补水保湿230ml',
                    price: '899',
                    originalPrice: '1299',
                    commissionRate: 15,
                    commissionAmount: '134.85',
                    sales: 23000,
                    salesText: '2.3万',
                    dailySales: '2300',
                    riseRate: '80%',
                    tag: '精选',
                    tags: ['正品保障', '假一赔十', '专柜直发'],
                    shop: 'SK-II官方旗舰店',
                    shopScore: 4.9,
                    location: '上海'
                },
                {
                    id: 7,
                    image: 'https://picsum.photos/400/400?random=7',
                    title: '兰蔻小黑瓶精华肌底液修护保湿50ml',
                    price: '680',
                    originalPrice: '850',
                    commissionRate: 12,
                    commissionAmount: '81.6',
                    sales: 32000,
                    salesText: '3.2万',
                    dailySales: '3200',
                    riseRate: '90%',
                    tags: ['正品保障', '专柜直发'],
                    shop: '兰蔻官方旗舰店',
                    shopScore: 4.9,
                    location: '上海'
                },
                {
                    id: 8,
                    image: 'https://picsum.photos/400/400?random=8',
                    title: '雅诗兰黛小棕瓶精华液抗老修护50ml第七代',
                    price: '720',
                    originalPrice: '900',
                    commissionRate: 10,
                    commissionAmount: '72',
                    sales: 45000,
                    salesText: '4.5万',
                    dailySales: '4500',
                    riseRate: '110%',
                    tag: '大牌',
                    tags: ['正品保障', '假一赔十'],
                    shop: '雅诗兰黛官方旗舰店',
                    shopScore: 4.9,
                    location: '上海'
                }
            ];
            let sortedProducts = [...allProducts];

            // 根据当前榜单类型排序
            switch (this.currentTab) {
                case 'sales':
                    sortedProducts.sort((a, b) => b.sales - a.sales);
                    break;
                case 'commission':
                    sortedProducts.sort((a, b) => b.commissionRate - a.commissionRate);
                    break;
                case 'rising':
                    sortedProducts.sort((a, b) => parseInt(b.riseRate) - parseInt(a.riseRate));
                    break;
                case 'new':
                    // 新品榜 - 假设id大的为新品
                    sortedProducts.sort((a, b) => b.id - a.id);
                    break;
            }
            this.setData({
                products: sortedProducts
            });
        },

        // 跳转到商品详情
        goToProductDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + productId
            });
        },

        // 申请样品
        applySample(e) {
            e.stopPropagation();
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/sample-apply/sample-apply?productId=' + productId
            });
        }
    }
};
</script>
<style>
page {
    background-color: #f5f5f5;
}

.page {
    min-height: 100vh;
}

/* 顶部导航 */
.header {
    background-color: #fff;
    padding: 20rpx 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-tabs {
    display: flex;
    justify-content: space-around;
    padding: 0 30rpx;
}

.nav-item {
    padding: 16rpx 32rpx;
    position: relative;
}

.nav-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    border-radius: 2rpx;
}

.nav-text {
    font-size: 30rpx;
    color: #666;
}

.nav-item.active .nav-text {
    color: #ff5000;
    font-weight: 600;
}

/* 榜单说明 */
.rank-info {
    background: linear-gradient(135deg, #fff5f0, #ffe8e0);
    padding: 20rpx 30rpx;
    margin: 0 20rpx 16rpx;
    border-radius: 12rpx;
}

.info-text {
    font-size: 24rpx;
    color: #ff5000;
}

/* 商品列表 */
.product-list {
    padding: 0 20rpx;
}

.product-item {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    padding: 20rpx;
    position: relative;
}

/* 排名标识 */
.rank-badge {
    position: absolute;
    top: 0;
    left: 0;
    width: 60rpx;
    height: 60rpx;
    background-color: #999;
    border-radius: 16rpx 0 60rpx 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 8rpx 12rpx;
    z-index: 10;
}

.rank-badge.top {
    background: linear-gradient(135deg, #ff5000, #ff7b00);
}

.rank-number {
    color: #fff;
    font-size: 24rpx;
    font-weight: 600;
}

.product-img-wrap {
    position: relative;
    width: 240rpx;
    height: 240rpx;
    flex-shrink: 0;
    margin-right: 20rpx;
    border-radius: 12rpx;
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 100%;
}

.product-tag {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    color: #fff;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-title {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    height: 80rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 12rpx;
}

/* 服务标签 */
.service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    margin-bottom: 8rpx;
}

.service-tag {
    font-size: 20rpx;
    color: #ff5000;
    border: 1rpx solid #ffd8bf;
    padding: 4rpx 10rpx;
    border-radius: 6rpx;
}

/* 店铺信息 */
.shop-info {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.shop-name {
    font-size: 22rpx;
    color: #999;
    margin-right: 12rpx;
}

.shop-score {
    font-size: 22rpx;
    color: #ff5000;
}

.product-price-wrap {
    display: flex;
    align-items: baseline;
    margin-bottom: 8rpx;
}

.price-symbol {
    font-size: 24rpx;
    color: #ff5000;
    font-weight: 600;
}

.product-price {
    font-size: 36rpx;
    color: #ff5000;
    font-weight: 600;
    margin-right: 12rpx;
}

.product-original {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
}

.product-commission-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.commission-tag {
    background: linear-gradient(135deg, #fff5f0, #ffe8e0);
    color: #ff5000;
    font-size: 22rpx;
    padding: 6rpx 12rpx;
    border-radius: 8rpx;
    margin-right: 12rpx;
}

.commission-amount {
    font-size: 22rpx;
    color: #ff5000;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.sales-info {
    display: flex;
    align-items: center;
}

.sales-text {
    font-size: 22rpx;
    color: #999;
    margin-right: 12rpx;
}

.location {
    font-size: 22rpx;
    color: #999;
}

.btn-apply {
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    color: #fff;
    font-size: 24rpx;
    padding: 12rpx 24rpx;
    border-radius: 28rpx;
}

/* 榜单数据 */
.rank-data {
    margin-top: 8rpx;
    padding-top: 8rpx;
    border-top: 1rpx solid #f0f0f0;
}

.data-text {
    font-size: 22rpx;
    color: #666;
}

.data-text.rise {
    color: #ff5000;
    font-weight: 500;
}
</style>
