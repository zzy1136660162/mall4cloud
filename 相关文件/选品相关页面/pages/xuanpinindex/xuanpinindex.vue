<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-nav">
            <view class="nav-content">
                <view class="nav-title">选品中心</view>
                <view class="nav-right">
                    <view class="talent-btn" @tap="goToTalentPool">
                        <text class="talent-icon">👥</text>
                        <text class="talent-text">人才库</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 顶部白色区域 -->
        <view class="header">
            <!-- 搜索栏 -->
            <view class="search-bar">
                <view class="search-input-box" @tap="goToSearch">
                    <text class="search-icon">🔍</text>
                    <view class="search-input-wrapper">
                        <input class="search-input" placeholder="搜索商品" placeholder-class="placeholder" confirm-type="search" disabled />
                        <image
                            class="camera-btn"
                            src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260319090524623_666695127685.png"
                            mode="aspectFit"
                            @tap.stop.prevent="goToCamera"
                        ></image>
                    </view>
                </view>
            </view>

            <!-- 分类标签 -->
            <scroll-view class="category-scroll" scroll-x enhanced :show-scrollbar="false">
                <view class="category-list">
                    <view :class="'category-item ' + (currentCategory === 'all' ? 'active' : '')" @tap="switchCategory" data-category="all">
                        <text class="category-text">首页</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '疼痛舒缓' ? 'active' : '')" @tap="goToCategory" data-category="疼痛舒缓">
                        <text class="category-text">疼痛舒缓</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '鼻部护理' ? 'active' : '')" @tap="goToCategory" data-category="鼻部护理">
                        <text class="category-text">鼻部护理</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '眼部护理' ? 'active' : '')" @tap="goToCategory" data-category="眼部护理">
                        <text class="category-text">眼部护理</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '皮肤护理' ? 'active' : '')" @tap="goToCategory" data-category="皮肤护理">
                        <text class="category-text">皮肤护理</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '女性调理' ? 'active' : '')" @tap="goToCategory" data-category="女性调理">
                        <text class="category-text">女性调理</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '男性养护' ? 'active' : '')" @tap="goToCategory" data-category="男性养护">
                        <text class="category-text">男性养护</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '小儿护理' ? 'active' : '')" @tap="goToCategory" data-category="小儿护理">
                        <text class="category-text">小儿护理</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '纤体瘦身' ? 'active' : '')" @tap="goToCategory" data-category="纤体瘦身">
                        <text class="category-text">纤体瘦身</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '养发护发' ? 'active' : '')" @tap="goToCategory" data-category="养发护发">
                        <text class="category-text">养发护发</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '泡浴养生' ? 'active' : '')" @tap="goToCategory" data-category="泡浴养生">
                        <text class="category-text">泡浴养生</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '人参滋补' ? 'active' : '')" @tap="goToCategory" data-category="人参滋补">
                        <text class="category-text">人参滋补</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '阿胶膏滋' ? 'active' : '')" @tap="goToCategory" data-category="阿胶膏滋">
                        <text class="category-text">阿胶膏滋</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '草本茶饮' ? 'active' : '')" @tap="goToCategory" data-category="草本茶饮">
                        <text class="category-text">草本茶饮</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '固体饮料' ? 'active' : '')" @tap="goToCategory" data-category="固体饮料">
                        <text class="category-text">固体饮料</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '压片糖果' ? 'active' : '')" @tap="goToCategory" data-category="压片糖果">
                        <text class="category-text">压片糖果</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '营养颗粒' ? 'active' : '')" @tap="goToCategory" data-category="营养颗粒">
                        <text class="category-text">营养颗粒</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '植物饮品' ? 'active' : '')" @tap="goToCategory" data-category="植物饮品">
                        <text class="category-text">植物饮品</text>
                    </view>
                    <view :class="'category-item ' + (currentCategory === '配制酒' ? 'active' : '')" @tap="goToCategory" data-category="配制酒">
                        <text class="category-text">配制酒</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- Banner 轮播图 -->
        <view class="banner-section">
            <swiper class="banner-swiper" indicator-dots autoplay circular interval="3500" duration="500" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ff5000">
                <swiper-item @tap="onBannerTap" :data-item="item" v-for="(item, index) in banners" :key="index">
                    <image class="banner-image" :src="item.image" mode="aspectFill" />

                    <view class="banner-content">
                        <text class="banner-title">{{ item.title }}</text>
                        <text class="banner-subtitle" v-if="item.subtitle">{{ item.subtitle }}</text>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 快捷入口 - 5个图标 -->
        <view class="quick-entry">
            <view class="entry-list">
                <view class="entry-item" @tap="onEntryTap" data-type="hot">
                    <image class="entry-icon" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142047334_666195650315.png" mode="aspectFit" />
                    <text class="entry-name">超级爆品</text>
                </view>
                <!-- <view class="entry-item" bindtap="onEntryTap" data-type="follow">
        <image class="entry-icon" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142240238_666195763220.png" mode="aspectFit"/>
        <text class="entry-name">同行跟选</text>
      </view> -->
                <view class="entry-item" @tap="onEntryTap" data-type="video">
                    <image class="entry-icon" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142605000_666195967983.png" mode="aspectFit" />
                    <text class="entry-name">视频热卖</text>
                </view>
                <view class="entry-item" @tap="onEntryTap" data-type="merchant">
                    <image class="entry-icon" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142853275_666196136259.png" mode="aspectFit" />
                    <text class="entry-name">商家优选</text>
                </view>
                <view class="entry-item" @tap="onEntryTap" data-type="cheap">
                    <image class="entry-icon" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313145940320_666197983305.png" mode="aspectFit" />
                    <text class="entry-name">低价好卖</text>
                </view>
            </view>
        </view>

        <!-- 筛选栏 -->
        <view class="filter-section">
            <view class="filter-bar">
                <view :class="'filter-item ' + (currentFilter === 'all' ? 'active' : '')" @tap="switchFilter" data-filter="all">
                    <text>精选</text>
                </view>
                <view :class="'filter-item ' + (currentFilter === 'hot' ? 'active' : '')" @tap="switchFilter" data-filter="hot">
                    <text>热销</text>
                </view>
                <view :class="'filter-item ' + (currentFilter === 'new' ? 'active' : '')" @tap="switchFilter" data-filter="new">
                    <text>新品</text>
                </view>
                <view :class="'filter-item ' + (currentFilter === 'commission' ? 'active' : '')" @tap="switchFilter" data-filter="commission">
                    <text>高佣</text>
                </view>
            </view>
            <view class="filter-more" @tap="toggleFilterPanel">
                <text>筛选</text>
                <text class="arrow">▼</text>
            </view>
        </view>

        <!-- 二级筛选面板 -->
        <view class="sub-filter-panel" v-if="showFilterPanel">
            <view class="sub-filter-section">
                <text class="sub-filter-title">佣金比例</text>
                <view class="sub-filter-options">
                    <view
                        :class="'sub-filter-item ' + (currentFilters.commission === item.value ? 'active' : '')"
                        @tap="selectSubFilter"
                        data-type="commission"
                        :data-value="item.value"
                        v-for="(item, index) in filterOptions.commission"
                        :key="index"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
            <view class="sub-filter-section">
                <text class="sub-filter-title">价格区间</text>
                <view class="sub-filter-options">
                    <view
                        :class="'sub-filter-item ' + (currentFilters.price === item.value ? 'active' : '')"
                        @tap="selectSubFilter"
                        data-type="price"
                        :data-value="item.value"
                        v-for="(item, index) in filterOptions.price"
                        :key="index"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
            <view class="sub-filter-section">
                <text class="sub-filter-title">销量</text>
                <view class="sub-filter-options">
                    <view
                        :class="'sub-filter-item ' + (currentFilters.sales === item.value ? 'active' : '')"
                        @tap="selectSubFilter"
                        data-type="sales"
                        :data-value="item.value"
                        v-for="(item, index) in filterOptions.sales"
                        :key="index"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" v-for="(item, index) in products" :key="index">
                <view class="product-content" @tap="goToProductDetail" :data-id="item.id">
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
                        </view>
                    </view>
                </view>

                <view class="btn-apply-wrap">
                    <view class="btn-apply" @tap="applySample" :data-id="item.id">申请样品</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
export default {
    data() {
        return {
            currentCategory: 'all',
            currentFilter: 'all',
            products: [],
            allProducts: [],
            searchHistory: [],
            page: 1,
            pageSize: 10,
            loading: false,
            hasMore: true,
            banners: [],

            // 二级筛选
            filterOptions: {
                commission: [
                    {
                        label: '不限',
                        value: 'all',
                        min: 0
                    },
                    {
                        label: '10%以上',
                        value: '10',
                        min: 10
                    },
                    {
                        label: '20%以上',
                        value: '20',
                        min: 20
                    },
                    {
                        label: '30%以上',
                        value: '30',
                        min: 30
                    }
                ],
                price: [
                    {
                        label: '不限',
                        value: 'all',
                        min: 0,
                        max: 99999
                    },
                    {
                        label: '50元以下',
                        value: '50',
                        min: 0,
                        max: 50
                    },
                    {
                        label: '50-100元',
                        value: '50-100',
                        min: 50,
                        max: 100
                    },
                    {
                        label: '100-500元',
                        value: '100-500',
                        min: 100,
                        max: 500
                    },
                    {
                        label: '500元以上',
                        value: '500',
                        min: 500,
                        max: 99999
                    }
                ],
                sales: [
                    {
                        label: '不限',
                        value: 'all',
                        min: 0
                    },
                    {
                        label: '1万+',
                        value: '1w',
                        min: 10000
                    },
                    {
                        label: '5万+',
                        value: '5w',
                        min: 50000
                    },
                    {
                        label: '10万+',
                        value: '10w',
                        min: 100000
                    }
                ]
            },

            currentFilters: {
                commission: 'all',
                price: 'all',
                sales: 'all'
            },

            showFilterPanel: false,
            searchKeyword: '',
            showSuggestions: '',
            searchSuggestions: [],
            showSearchPanel: false,
            searchStatus: '',
            currentSort: ''
        };
    },
    onLoad() {
        this.checkLoginStatus();
        this.loadBanners();
        this.loadProducts();
        this.loadSearchHistory();
    },
    // 下拉刷新
    async onPullDownRefresh() {
        this.setData({
            page: 1,
            products: []
        });
        await this.loadProducts(true);
        uni.stopPullDownRefresh();
    },
    // 上拉加载更多
    onReachBottom() {
        if (this.hasMore && !this.loading) {
            this.loadProducts();
        }
    },
    methods: {
        // 加载轮播图
        async loadBanners() {
            try {
                const res = await productService.getXpBanners();
                if (res && res.length > 0) {
                    this.setData({
                        banners: res.map((banner) => ({
                            id: banner.id,
                            image: banner.image,
                            title: banner.title || '',
                            subtitle: '',
                            link: banner.link || '',
                            linkType: banner.linkType || ''
                        }))
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载轮播图失败:', error);
            }
        },

        // 检查登录状态
        checkLoginStatus() {
            const token = uni.getStorageSync('token');
            if (!token) {
                console.log('用户未登录');
            }
        },

        // 跳转到人才库
        goToTalentPool() {
            uni.navigateTo({
                url: '/pages/rd_index/rd_index'
            });
        },

        // 加载搜索历史
        loadSearchHistory() {
            const history = uni.getStorageSync('searchHistory') || [];
            this.setData({
                searchHistory: history
            });
        },

        // 保存搜索历史
        saveSearchHistory(keyword) {
            if (!keyword.trim()) {
                return;
            }
            let history = this.searchHistory;
            // 去重并放到最前面
            history = history.filter((item) => item !== keyword);
            history.unshift(keyword);
            // 只保留10条
            history = history.slice(0, 10);
            this.setData({
                searchHistory: history
            });
            uni.setStorageSync('searchHistory', history);
        },

        // 加载商品数据
        async loadProducts(refresh = false) {
            if (this.loading) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const page = refresh ? 1 : this.page;
                const params = {
                    page,
                    pageSize: this.pageSize
                };

                // 添加分类筛选
                if (this.currentCategory !== 'all') {
                    params.category = this.currentCategory;
                }

                // 添加关键词搜索
                if (this.searchKeyword) {
                    params.keyword = this.searchKeyword;
                }

                // 添加排序
                if (this.currentFilter === 'commission') {
                    params.sortBy = 'commission';
                    params.sortOrder = 'desc';
                } else if (this.currentFilter === 'sales') {
                    params.sortBy = 'sales';
                    params.sortOrder = 'desc';
                }
                const res = await productService.getProducts(params);
                console.log('API返回数据:', res);
                console.log('商品列表:', res.list);
                const list = res.list || [];
                console.log('处理后的列表:', list);
                const products = list.map((item) => ({
                    id: item.id,
                    image: item.image,
                    title: item.name || item.title,
                    price: typeof item.price === 'number' ? item.price.toString() : item.price,
                    originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
                    commissionRate: item.commissionRate || 0,
                    commissionAmount: item.commissionAmount
                        ? item.commissionAmount.toString()
                        : item.commissionRate
                        ? ((parseFloat(item.price) * item.commissionRate) / 100).toFixed(2)
                        : '0',
                    sales: item.sales || 0,
                    salesText: item.monthlySales ? item.monthlySales.replace('月销', '').replace('件', '') : item.sales ? item.sales.toString() : '0',
                    tags: item.tags || [],
                    isBrand: item.isBrand || false,
                    hasCashback: item.hasCashback || false
                }));
                this.setData({
                    products: refresh ? products : [...this.products, ...products],
                    allProducts: refresh ? products : [...this.allProducts, ...products],
                    page: page + 1,
                    hasMore: products.length === this.pageSize,
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
                this.setData({
                    loading: false,
                    products: [],
                    allProducts: []
                });
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        },

        // 搜索输入
        onSearchInput(e) {
            const keyword = e.detail.value;
            this.setData({
                searchKeyword: keyword,
                showSuggestions: keyword.length > 0
            });
            if (keyword.length > 0) {
                this.getSearchSuggestions(keyword);
            } else {
                this.setData({
                    searchSuggestions: []
                });
            }
        },

        // 获取搜索联想（本地实现）
        getSearchSuggestions(keyword) {
            const allKeywords = [
                '洗衣液',
                '洗衣粉',
                '洗衣凝珠',
                '洗衣皂',
                '抽纸',
                '卷纸',
                '湿巾',
                '厨房纸',
                '面膜',
                '面霜',
                '乳液',
                '精华',
                '口红',
                '唇膏',
                '零食',
                '坚果',
                '饼干',
                '糖果',
                '巧克力',
                '饮料',
                '矿泉水',
                '果汁',
                '奶茶',
                '咖啡',
                '手机',
                '耳机',
                '充电宝',
                '数据线',
                '手机壳',
                '奶粉',
                '尿不湿',
                '奶瓶',
                '婴儿油',
                '儿童玩具',
                '猪肉',
                '牛肉',
                '鸡肉',
                '海鲜',
                '水果',
                '蔬菜',
                '床品',
                '四件套',
                '被子',
                '枕头',
                '凉席'
            ];
            const suggestions = allKeywords.filter((k) => k.includes(keyword)).slice(0, 5);
            this.setData({
                searchSuggestions: suggestions
            });
        },

        // 点击联想词
        onSuggestionTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword,
                showSuggestions: false,
                showSearchPanel: false
            });
            this.doSearch(keyword);
        },

        // 显示搜索面板
        showSearchPanelFun() {
            console.log('显示搜索面板');
            this.setData({
                showSearchPanel: true
            });
        },

        // 隐藏搜索面板
        hideSearchPanel() {
            this.setData({
                showSearchPanel: false
            });
        },

        // 显示搜索面板（focus时）
        onSearchFocus() {
            console.log('onSearchFocus');
            this.setData({
                showSearchPanel: true
            });
        },

        // 隐藏搜索面板（blur时）
        onSearchBlur() {
            // 延迟隐藏，给点击事件留出时间
            setTimeout(() => {
                this.setData({
                    showSearchPanel: false
                });
            }, 300);
        },

        // 点击热门搜索
        onHotSearchTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword
            });
            this.onSearch();
        },

        // 点击历史搜索
        onHistoryTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword
            });
            this.onSearch();
        },

        // 清除搜索历史
        clearHistory() {
            uni.removeStorageSync('searchHistory');
            this.setData({
                searchHistory: []
            });
        },

        // 执行搜索
        async doSearch(keyword, sort = 'default') {
            if (!keyword) {
                return;
            }
            this.setData({
                searchStatus: 'searching',
                showSearchPanel: false,
                showSuggestions: false
            });
            this.saveSearchHistory(keyword);
            try {
                uni.showLoading({
                    title: '搜索中...'
                });
                const res = await productService.searchProducts(keyword, {
                    page: 1,
                    pageSize: this.pageSize,
                    sort: sort
                });
                uni.hideLoading();
                if (res.code === 200) {
                    const products = res.data.list.map((item) => ({
                        id: item.id,
                        image: item.image,
                        title: item.name,
                        price: item.price.toString(),
                        commissionRate: item.commissionRate,
                        commissionAmount: item.commissionAmount.toString(),
                        sales: item.sales,
                        salesText: item.monthlySales ? item.monthlySales.replace('月销', '').replace('件', '') : '0',
                        tags: item.tags,
                        isBrand: item.isBrand,
                        hasCashback: item.hasCashback
                    }));
                    this.setData({
                        products: products,
                        page: 2,
                        hasMore: products.length === this.pageSize,
                        searchStatus: 'result',
                        currentSort: sort
                    });
                    if (products.length === 0) {
                        uni.showToast({
                            title: '未找到相关商品',
                            icon: 'none'
                        });
                    }
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('搜索失败:', error);
                uni.showToast({
                    title: '搜索失败',
                    icon: 'none'
                });
                this.setData({
                    searchStatus: 'home'
                });
            }
        },

        // 点击搜索按钮
        async onSearch() {
            const keyword = this.searchKeyword.trim();
            console.log('搜索:', keyword);
            if (!keyword) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                });
                return;
            }
            this.doSearch(keyword, this.currentSort);
        },

        // 排序筛选
        onSortChange(e) {
            const sort = e.currentTarget.dataset.value;
            const keyword = this.searchKeyword;
            this.setData({
                currentSort: sort
            });
            if (this.searchStatus === 'result' && keyword) {
                this.doSearch(keyword, sort);
            }
        },

        // 清空搜索，回到首页
        clearSearch() {
            this.setData({
                searchKeyword: '',
                searchStatus: 'home',
                showSearchPanel: false,
                showSuggestions: false,
                products: this.allProducts,
                page: 1,
                hasMore: true
            });
            this.loadProducts(true);
        },

        // 切换分类
        switchCategory(e) {
            const category = e.currentTarget.dataset.category;
            console.log('切换分类:', category);
            this.setData({
                currentCategory: category,
                products: this.allProducts
            });
        },

        // 跳转到分类页面
        goToCategory(e) {
            const category = e.currentTarget.dataset.category;
            uni.navigateTo({
                url: '/pages/category/category?category=' + category
            });
        },

        // 跳转到搜索页面
        goToSearch() {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        },

        // 跳转到相机页面
        goToCamera() {
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

        // 处理拍照识别结果
        processImage(imagePath) {
            uni.showLoading({
                title: '识别中...'
            });
            // TODO: 调用图像识别API
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '图片已选择',
                    icon: 'none'
                });
            }, 1000);
        },

        // 处理扫码结果
        processScanResult(result) {
            uni.showLoading({
                title: '识别中...'
            });
            // TODO: 调用扫码结果处理API
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '扫码成功',
                    icon: 'none'
                });
            }, 1000);
        },

        // 切换筛选
        switchFilter(e) {
            const filter = e.currentTarget.dataset.filter;
            this.setData({
                currentFilter: filter
            });
            this.applyFilters();
        },

        // 显示筛选面板
        toggleFilterPanel() {
            this.setData({
                showFilterPanel: !this.showFilterPanel
            });
        },

        // 选择二级筛选
        selectSubFilter(e) {
            const { type, value } = e.currentTarget.dataset;
            const currentFilters = this.currentFilters;
            currentFilters[type] = value;
            this.setData({
                currentFilters
            });
            this.applyFilters();
        },

        // 应用筛选
        applyFilters() {
            let filtered = this.allProducts;
            const filters = this.currentFilters;

            // 佣金筛选
            if (filters.commission !== 'all') {
                const minCommission = parseInt(filters.commission);
                filtered = filtered.filter((p) => p.commissionRate >= minCommission);
            }

            // 价格筛选
            if (filters.price !== 'all') {
                const priceOption = this.filterOptions.price.find((p) => p.value === filters.price);
                if (priceOption) {
                    filtered = filtered.filter((p) => {
                        const price = parseFloat(p.price);
                        return price >= priceOption.min && price <= priceOption.max;
                    });
                }
            }

            // 销量筛选
            if (filters.sales !== 'all') {
                const salesOption = this.filterOptions.sales.find((s) => s.value === filters.sales);
                if (salesOption) {
                    filtered = filtered.filter((p) => p.sales >= salesOption.min);
                }
            }

            // 主筛选（精选/热销/新品/高佣）
            switch (this.currentFilter) {
                case 'hot':
                    filtered = filtered.sort((a, b) => b.sales - a.sales);
                    break;
                case 'commission':
                    filtered = filtered.sort((a, b) => b.commissionRate - a.commissionRate);
                    break;
                case 'new':
                    filtered = filtered.filter((p) => p.tag === '新品' || p.tag === '精选');
                    break;
            }
            this.setData({
                products: filtered
            });
        },

        // Banner点击
        onBannerTap(e) {
            const item = e.currentTarget.dataset.item;
            switch (item.type) {
                case 'activity':
                    if (item.link) {
                        uni.navigateTo({
                            url: item.link
                        });
                    }
                    break;
                case 'product':
                    if (item.productId) {
                        uni.navigateTo({
                            url: '/pages/product-detail/product-detail?id=' + item.productId
                        });
                    }
                    break;
                case 'brand':
                    uni.showToast({
                        title: '品牌保障说明',
                        icon: 'none'
                    });
                    break;
                case 'guide':
                    uni.showToast({
                        title: '样品攻略详情',
                        icon: 'none'
                    });
                    break;
                default:
                    break;
            }
        },

        // 快捷入口点击
        onEntryTap(e) {
            const type = e.currentTarget.dataset.type;
            const pageMap = {
                hot: '/pages/activity/hot',
                follow: '/pages/activity/follow',
                video: '/pages/activity/video',
                merchant: '/pages/activity/merchant',
                cheap: '/pages/activity/cheap'
            };
            const url = pageMap[type];
            if (url) {
                uni.navigateTo({
                    url
                });
            }
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

/* 顶部区域 */
.header {
    background-color: #fff;
    padding: 20rpx 0;
    position: relative;
    z-index: 100;
}

/* 搜索栏 */
.search-bar {
    display: flex;
    align-items: center;
    padding: 0 30rpx 20rpx;
}

.search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 32rpx;
    padding: 16rpx 24rpx;
    margin-right: 20rpx;
}

.search-icon {
    font-size: 28rpx;
    color: #999;
    margin-right: 12rpx;
}

.search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
}

.camera-btn {
    width: 56rpx;
    height: 56rpx;
    margin-left: 16rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.search-clear {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ccc;
    border-radius: 50%;
}

.search-clear text {
    color: #fff;
    font-size: 24rpx;
    line-height: 1;
}

.search-btn.cancel {
    background: #999;
}

.placeholder {
    color: #999;
}

/* 搜索联想 */
.suggestions-panel {
    position: fixed;
    top: 120rpx;
    left: 30rpx;
    right: 30rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 100;
    max-height: 500rpx;
    overflow-y: auto;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.suggestion-icon {
    margin-right: 16rpx;
    color: #999;
}

.suggestion-text {
    font-size: 28rpx;
    color: #333;
}

/* 搜索结果排序 */
.search-result-header {
    background: #fff;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.sort-tabs {
    display: flex;
    justify-content: space-around;
}

.sort-tab {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx 20rpx;
    position: relative;
}

.sort-tab.active {
    color: #ff9500;
    font-weight: 500;
}

.sort-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background: #ff9500;
    border-radius: 2rpx;
}

.search-btn {
    background: linear-gradient(135deg, #ff9500, #ff7b00);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 32rpx;
    border-radius: 32rpx;
    font-weight: 500;
}

/* 搜索面板遮罩 */
.search-panel-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 98;
}

/* 搜索面板 */
.search-panel {
    position: fixed;
    top: 120rpx;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 20rpx 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 99;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    visibility: hidden;
}

.search-panel.show {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
}

.panel-section {
    margin-bottom: 20rpx;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.panel-title {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
}

.clear-btn {
    font-size: 24rpx;
    color: #999;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.tag-item {
    padding: 12rpx 24rpx;
    background-color: #f5f5f5;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #666;
}

.tag-item.hot {
    background: linear-gradient(135deg, #fff5f0, #ffe8e0);
    color: #ff5000;
}

/* 分类标签 */
.category-scroll {
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
    border-radius: 32rpx;
    transition: all 0.3s;
}

.category-item.active {
    background-color: #ff5000;
}

.category-item.active .category-text {
    color: #fff;
}

.category-text {
    font-size: 26rpx;
    color: #666;
}

.category-item.spring .category-text {
    background: linear-gradient(135deg, #52c41a, #389e0d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
}

.category-item.spring.active {
    background: linear-gradient(135deg, #52c41a, #389e0d);
}

.category-item.spring.active .category-text {
    -webkit-text-fill-color: #fff;
    background: none;
}

/* Banner轮播图 */
.banner-section {
    margin: 16rpx 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
}

.banner-swiper {
    height: 280rpx;
    border-radius: 16rpx;
}

.banner-image {
    width: 100%;
    height: 100%;
}

.banner-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.banner-title {
    font-size: 36rpx;
    color: #fff;
    font-weight: 600;
    display: block;
    margin-bottom: 8rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
    display: block;
}

/* 快捷入口 */
.quick-entry {
    margin: 16rpx 20rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
}

.entry-list {
    display: flex;
    justify-content: space-around;
}

.entry-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
}

.entry-icon {
    width: 70rpx;
    height: 70rpx;
    margin-bottom: 8rpx;
}

.entry-name {
    font-size: 22rpx;
    color: #333;
    text-align: center;
}

/* 筛选栏 */
.filter-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 20rpx 16rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
}

.filter-bar {
    display: flex;
    flex: 1;
}

.filter-item {
    padding: 12rpx 24rpx;
    margin-right: 16rpx;
    font-size: 26rpx;
    color: #666;
    border-radius: 24rpx;
}

.filter-item.active {
    background-color: #fff5f0;
    color: #ff5000;
    font-weight: 500;
}

.filter-more {
    display: flex;
    align-items: center;
    padding: 12rpx 20rpx;
    font-size: 26rpx;
    color: #666;
}

.filter-more .arrow {
    margin-left: 8rpx;
    font-size: 20rpx;
}

/* 二级筛选面板 */
.sub-filter-panel {
    margin: 0 20rpx 16rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
}

.sub-filter-section {
    margin-bottom: 20rpx;
}

.sub-filter-section:last-child {
    margin-bottom: 0;
}

.sub-filter-title {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 16rpx;
    display: block;
}

.sub-filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.sub-filter-item {
    padding: 12rpx 24rpx;
    background-color: #f5f5f5;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #666;
}

.sub-filter-item.active {
    background-color: #ff5000;
    color: #fff;
}

/* 商品列表 */
.product-list {
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.product-item {
    width: 48.5%;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
}

.product-content {
    flex: 1;
}

.product-img-wrap {
    position: relative;
    width: 100%;
    height: 340rpx;
}

.product-img {
    width: 100%;
    height: 100%;
}

.product-tag {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    color: #fff;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
}

.product-info {
    padding: 20rpx;
}

.product-title {
    font-size: 26rpx;
    color: #333;
    line-height: 1.4;
    height: 72rpx;
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
    margin-bottom: 12rpx;
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
    margin-bottom: 12rpx;
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
    margin-bottom: 16rpx;
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

.btn-apply-wrap {
    padding: 0 20rpx 20rpx;
    display: flex;
    justify-content: flex-end;
}

.btn-apply {
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    color: #fff;
    font-size: 24rpx;
    padding: 12rpx 24rpx;
    border-radius: 28rpx;
}

/* 自定义导航栏 */
.custom-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    padding-top: env(safe-area-inset-top);
}

.nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    padding-top: calc(20rpx + env(safe-area-inset-top));
}

.nav-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
}

.nav-right {
    display: flex;
    align-items: center;
}

.talent-btn {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.25);
    padding: 12rpx 20rpx;
    border-radius: 30rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.4);
}

.talent-icon {
    font-size: 28rpx;
    margin-right: 8rpx;
}

.talent-text {
    font-size: 24rpx;
    color: #fff;
    font-weight: 500;
}

.header {
    background-color: #fff;
    padding: 20rpx 0;
    position: relative;
    z-index: 100;
    margin-top: 120rpx;
}
</style>
