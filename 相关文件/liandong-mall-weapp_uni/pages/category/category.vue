<template>
    <view class="page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="'height: ' + statusBarHeight + 'rpx;'"></view>

        <!-- 顶部搜索栏 -->
        <view class="search-bar">
            <view class="search-box" @tap="goToSearch">
                <text class="search-icon">🔍</text>
                <text class="search-text">搜索商品</text>
            </view>
            <image
                class="camera-btn"
                src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260319090524623_666695127685.png"
                mode="aspectFit"
                @tap="takePhoto"
            ></image>
        </view>

        <!-- 主分类标签 -->
        <scroll-view class="category-scroll" scroll-x enhanced :show-scrollbar="false">
            <view class="category-list">
                <view :class="'category-item ' + (currentMainCategory === 'all' ? 'active' : '')" @tap="goToHome">
                    <text class="category-text">首页</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '疼痛舒缓' ? 'active' : '')" @tap="switchMainCategory" data-category="疼痛舒缓">
                    <text class="category-text">疼痛舒缓</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '鼻部护理' ? 'active' : '')" @tap="switchMainCategory" data-category="鼻部护理">
                    <text class="category-text">鼻部护理</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '眼部护理' ? 'active' : '')" @tap="switchMainCategory" data-category="眼部护理">
                    <text class="category-text">眼部护理</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '皮肤护理' ? 'active' : '')" @tap="switchMainCategory" data-category="皮肤护理">
                    <text class="category-text">皮肤护理</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '女性调理' ? 'active' : '')" @tap="switchMainCategory" data-category="女性调理">
                    <text class="category-text">女性调理</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '男性养护' ? 'active' : '')" @tap="switchMainCategory" data-category="男性养护">
                    <text class="category-text">男性养护</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '小儿护理' ? 'active' : '')" @tap="switchMainCategory" data-category="小儿护理">
                    <text class="category-text">小儿护理</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '纤体瘦身' ? 'active' : '')" @tap="switchMainCategory" data-category="纤体瘦身">
                    <text class="category-text">纤体瘦身</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '养发护发' ? 'active' : '')" @tap="switchMainCategory" data-category="养发护发">
                    <text class="category-text">养发护发</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '泡浴养生' ? 'active' : '')" @tap="switchMainCategory" data-category="泡浴养生">
                    <text class="category-text">泡浴养生</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '人参滋补' ? 'active' : '')" @tap="switchMainCategory" data-category="人参滋补">
                    <text class="category-text">人参滋补</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '阿胶膏滋' ? 'active' : '')" @tap="switchMainCategory" data-category="阿胶膏滋">
                    <text class="category-text">阿胶膏滋</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '草本茶饮' ? 'active' : '')" @tap="switchMainCategory" data-category="草本茶饮">
                    <text class="category-text">草本茶饮</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '固体饮料' ? 'active' : '')" @tap="switchMainCategory" data-category="固体饮料">
                    <text class="category-text">固体饮料</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '压片糖果' ? 'active' : '')" @tap="switchMainCategory" data-category="压片糖果">
                    <text class="category-text">压片糖果</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '营养颗粒' ? 'active' : '')" @tap="switchMainCategory" data-category="营养颗粒">
                    <text class="category-text">营养颗粒</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '植物饮品' ? 'active' : '')" @tap="switchMainCategory" data-category="植物饮品">
                    <text class="category-text">植物饮品</text>
                </view>
                <view :class="'category-item ' + (currentMainCategory === '配制酒' ? 'active' : '')" @tap="switchMainCategory" data-category="配制酒">
                    <text class="category-text">配制酒</text>
                </view>
            </view>
        </scroll-view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <view class="product-image-wrap">
                    <image class="product-image" :src="item.image" mode="aspectFill" />
                    <view class="product-badge" v-if="item.badge">{{ item.badge }}</view>
                </view>

                <view class="product-info">
                    <!-- 榜单标签 -->
                    <view class="rank-tag" v-if="item.rankTag">
                        <text class="rank-icon">🏆</text>
                        <text>{{ item.rankTag }}</text>
                        <text class="rank-arrow">></text>
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
                        <text class="commission-text">赚¥{{ item.commissionAmount }}</text>
                        <text class="commission-rate">{{ item.commissionRate }}%佣</text>
                    </view>
                    <!-- 价格销量 -->
                    <view class="price-row">
                        <text class="price-label">售价¥{{ item.price }}</text>
                        <text class="sales-text">{{ item.salesText }}</text>
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
const productService = require('../../services/productService.js');
const categoryData = require('../../utils/category-data.js');
const categoryNameMap = {
    疼痛舒缓: '疼痛舒缓',
    鼻部护理: '鼻部护理',
    眼部护理: '眼部护理',
    皮肤护理: '皮肤护理',
    女性调理: '女性调理',
    男性养护: '男性养护',
    小儿护理: '小儿护理',
    纤体瘦身: '纤体瘦身',
    养发护发: '养发护发',
    泡浴养生: '泡浴养生',
    人参滋补: '人参滋补',
    阿胶膏滋: '阿胶膏滋',
    草本茶饮: '草本茶饮',
    固体饮料: '固体饮料',
    压片糖果: '压片糖果',
    营养颗粒: '营养颗粒',
    植物饮品: '植物饮品',
    配制酒: '配制酒'
};
export default {
    data() {
        return {
            currentMainCategory: 'all',
            products: [],
            page: 1,
            pageSize: 20,
            loading: false,
            hasMore: true,
            statusBarHeight: ''
        };
    },
    onLoad(options) {
        // 获取系统状态栏高度和胶囊按钮位置
        const systemInfo = uni.getSystemInfoSync();
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
        const statusBarHeight = systemInfo.statusBarHeight || 20;
        const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height * 2;
        const category = options.category || 'all';
        this.setData({
            currentMainCategory: category,
            statusBarHeight: (statusBarHeight + navBarHeight / 2) * 2
        });
        this.loadProducts(category);
    },
    methods: {
        // 加载商品数据
        async loadProducts(categoryId) {
            if (this.loading) {
                return;
            }
            this.setData({
                loading: true,
                products: []
            });
            uni.showLoading({
                title: '加载中...'
            });
            try {
                let params = {
                    page: 1,
                    pageSize: this.pageSize
                };

                // 根据分类ID查询
                if (categoryId && categoryId !== 'all') {
                    // 将分类ID转换为分类名称
                    const categoryName = categoryNameMap[categoryId] || categoryId;
                    params.category = categoryName;
                }
                const res = await productService.getProducts(params);
                uni.hideLoading();
                let products = [];
                if (res && res.list) {
                    products = res.list.map((item) => ({
                        id: item.id,
                        title: item.name,
                        price: item.price,
                        commissionAmount: item.commission_amount || item.commission || '0',
                        commissionRate: item.commission_rate || '0',
                        salesText: item.sales || '0',
                        image: item.main_image || item.image
                    }));
                }
                this.setData({
                    products: products,
                    loading: false,
                    hasMore: products.length >= this.pageSize
                });
            } catch (err) {
                console.log('CatchClause', err);
                console.log('CatchClause', err);
                uni.hideLoading();
                console.error('加载商品失败:', err);
                this.setData({
                    loading: false
                });
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        },

        // 切换主分类
        switchMainCategory(e) {
            const category = e.currentTarget.dataset.category;
            this.setData({
                currentMainCategory: category
            });
            this.loadProducts(category);
        },

        // 显示更多分类
        showMoreCategories() {
            const categories = [
                '疼痛舒缓',
                '鼻部护理',
                '眼部护理',
                '皮肤护理',
                '女性调理',
                '男性养护',
                '小儿护理',
                '纤体瘦身',
                '养发护发',
                '泡浴养生',
                '人参滋补',
                '阿胶膏滋',
                '草本茶饮',
                '固体饮料',
                '压片糖果',
                '营养颗粒',
                '植物饮品',
                '配制酒'
            ];
            uni.showActionSheet({
                itemList: categories,
                success: (res) => {
                    this.switchMainCategory({
                        currentTarget: {
                            dataset: {
                                category: categories[res.tapIndex]
                            }
                        }
                    });
                }
            });
        },

        // 返回
        goBack() {
            uni.navigateBack();
        },

        // 返回首页
        goToHome() {
            uni.switchTab({
                url: '/pages/xuanpinindex/xuanpinindex'
            });
        },

        // 跳转到商品详情
        goToProductDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + productId
            });
        },

        // 去搜索
        goToSearch() {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        },

        // 拍照搜索和扫码
        onCameraTap() {
            uni.showActionSheet({
                itemList: ['拍照搜索', '扫码识别'],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        this.takePhoto();
                    } else if (res.tapIndex === 1) {
                        this.scanCode();
                    }
                }
            });
        },

        // 拍照搜索
        takePhoto() {
            uni.showActionSheet({
                itemList: ['拍照识别', '扫码识别'],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        uni.chooseMedia({
                            count: 1,
                            mediaType: ['image'],
                            sourceType: ['camera'],
                            success: (photoRes) => {
                                const tempFilePath = photoRes.tempFiles[0].tempFilePath;
                                this.processImage(tempFilePath);
                            }
                        });
                    } else {
                        uni.scanCode({
                            success: (scanRes) => {
                                if (scanRes.result) {
                                    this.processScanResult(scanRes.result);
                                }
                            }
                        });
                    }
                }
            });
        },

        processImage(imagePath) {
            uni.showLoading({
                title: '识别中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '图片已选择',
                    icon: 'none'
                });
            }, 1000);
        },

        processScanResult(result) {
            uni.showLoading({
                title: '识别中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '扫码成功',
                    icon: 'none'
                });
            }, 1000);
        },

        // 切换Tab
        switchTab(e) {
            const page = e.currentTarget.dataset.page;
            const urls = {
                index: '/pages/index/index',
                shelf: '/pages/my/my',
                data: '/pages/rank/rank',
                my: '/pages/my/my'
            };
            if (page !== 'index') {
                uni.switchTab({
                    url: urls[page]
                });
            }
        },

        // 加入货架
        addToShelf(e) {
            const productId = e.currentTarget.dataset.id;
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

/* 底部操作栏 */
.action-bar {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 40rpx;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 40rpx;
    background: #f7f7f7;
    border-radius: 12rpx;
}

.action-icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
}

.action-text {
    font-size: 24rpx;
    color: #666;
}

/* 状态栏占位 */
.status-bar {
    background: #fff;
}

/* 顶部搜索栏 */
.search-bar {
    display: flex;
    align-items: center;
    padding: 16rpx 30rpx;
    background: #fff;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 32rpx;
    padding: 16rpx 24rpx;
}

.search-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
}

.search-text {
    font-size: 28rpx;
    color: #999;
}

.camera-btn {
    width: 56rpx;
    height: 56rpx;
    margin-left: 20rpx;
}

/* 分类标签 */
.category-scroll {
    background: #fff;
    white-space: nowrap;
}

.category-list {
    display: flex;
    padding: 0 20rpx;
}

.category-item {
    display: inline-flex;
    padding: 16rpx 24rpx;
    margin: 0 8rpx;
    border-radius: 24rpx;
    transition: all 0.3s;
}

.category-item .category-text {
    font-size: 28rpx;
    color: #666;
}

.category-item.active {
    background-color: #ff5000;
}

.category-item.active .category-text {
    color: #fff;
}

/* 商品列表 */
.product-list {
    padding: 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.product-item {
    width: 48.5%;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
}

.product-image-wrap {
    position: relative;
    width: 100%;
    height: 340rpx;
}

.product-image {
    width: 100%;
    height: 100%;
}

.product-badge {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 22rpx;
    padding: 6rpx 12rpx;
    border-radius: 6rpx;
}

.product-info {
    padding: 16rpx;
}

.rank-tag {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #fff5e6, #fff);
    padding: 8rpx 12rpx;
    border-radius: 8rpx;
    margin-bottom: 12rpx;
}

.rank-icon {
    font-size: 24rpx;
    margin-right: 8rpx;
}

.rank-tag text {
    font-size: 24rpx;
    color: #ff9500;
}

.rank-arrow {
    margin-left: auto;
}

.product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12rpx;
}

.tag {
    padding: 4rpx 10rpx;
    border-radius: 6rpx;
    font-size: 20rpx;
    margin-right: 8rpx;
    margin-bottom: 8rpx;
}

.tag.cashback {
    background: #ff4757;
    color: #fff;
}

.tag.trust {
    background: #fff0f0;
    color: #ff4757;
    border: 1rpx solid #ffcdd2;
}

.tag.brand {
    background: #333;
    color: #fff;
}

.product-title {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    margin-bottom: 12rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.commission-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.commission-text {
    font-size: 28rpx;
    color: #ff4757;
    font-weight: 600;
    margin-right: 16rpx;
}

.commission-rate {
    font-size: 24rpx;
    color: #999;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.price-label {
    font-size: 24rpx;
    color: #666;
}

.sales-text {
    font-size: 22rpx;
    color: #999;
}

.add-btn {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 28rpx;
    text-align: center;
    padding: 16rpx 0;
    border-radius: 32rpx;
}

/* 底部安全区域 */
.safe-area {
    height: 40rpx;
}

/* 底部TabBar */
.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    border-top: 1rpx solid #f0f0f0;
    z-index: 100;
}

.tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tab-icon {
    font-size: 40rpx;
    margin-bottom: 4rpx;
}

.tab-text {
    font-size: 22rpx;
    color: #999;
}

.tab-item.active .tab-text {
    color: #ff4757;
}
</style>
