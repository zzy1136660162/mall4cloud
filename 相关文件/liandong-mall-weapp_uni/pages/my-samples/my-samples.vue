<template>
    <view class="container">
        <!-- 状态筛选栏 -->
        <view class="filter-bar">
            <view :class="'filter-item ' + (currentFilter === 'all' ? 'active' : '')" @tap="switchFilter" data-filter="all">
                <text class="filter-text">全部</text>
            </view>
            <view :class="'filter-item ' + (currentFilter === 'pending' ? 'active' : '')" @tap="switchFilter" data-filter="pending">
                <text class="filter-text">待审核</text>
            </view>
            <view :class="'filter-item ' + (currentFilter === 'approved' ? 'active' : '')" @tap="switchFilter" data-filter="approved">
                <text class="filter-text">审核通过</text>
            </view>
            <view :class="'filter-item ' + (currentFilter === 'shipped' ? 'active' : '')" @tap="switchFilter" data-filter="shipped">
                <text class="filter-text">已寄出</text>
            </view>
            <view :class="'filter-item ' + (currentFilter === 'rejected' ? 'active' : '')" @tap="switchFilter" data-filter="rejected">
                <text class="filter-text">已拒绝</text>
            </view>
        </view>

        <!-- 申请列表 -->
        <view class="sample-list">
            <view class="sample-card" v-for="(item, index) in sampleList" :key="index">
                <!-- 申请头部 -->

                <view class="sample-header" @tap="goToDetail" :data-id="item.id">
                    <view class="header-left">
                        <text class="apply-id">申请编号: {{ item.id }}</text>
                        <text class="apply-time">申请时间: {{ item.applyTime }}</text>
                    </view>
                    <view :class="'status-badge ' + item.status">
                        <text class="status-text">{{ item.statusText }}</text>
                    </view>
                </view>

                <!-- 商品信息 -->

                <view class="product-list">
                    <view class="product-item" v-for="(product, index1) in item.products" :key="index1">
                        <image class="product-image" :src="product.image" mode="aspectFill" />

                        <view class="product-info">
                            <text class="product-name">{{ product.name }}</text>
                            <view class="product-meta">
                                <text class="product-price">¥{{ product.price }}</text>
                                <text class="product-commission" v-if="product.commission">佣金{{ product.commission }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 物流状态展示 -->

                <view class="shipping-section">
                    <view class="shipping-header">
                        <text class="section-label">📦 物流状态</text>
                        <view
                            :class="'ship-status-badge ' + item.shipStatus"
                            @tap="goToLogistics"
                            :data-tracking="item.trackingNo"
                            :data-company="item.logisticsCompany"
                            :data-status="item.shipStatus"
                            :data-time="item.receiveTime"
                        >
                            <text class="ship-status-text">{{ item.shipStatusText }}</text>
                        </view>
                    </view>

                    <!-- 物流详情（如已寄出或已签收） -->
                    <view
                        class="shipping-detail"
                        v-if="item.shipStatus !== 'not_shipped'"
                        @tap="goToLogistics"
                        :data-tracking="item.trackingNo"
                        :data-company="item.logisticsCompany"
                        :data-status="item.shipStatus"
                        :data-time="item.receiveTime"
                    >
                        <view class="shipping-row" v-if="item.logisticsCompany">
                            <text class="shipping-label">物流公司:</text>
                            <text class="shipping-company">{{ item.logisticsCompany }}</text>
                        </view>
                        <view class="shipping-row" v-if="item.trackingNo">
                            <text class="shipping-label">物流单号:</text>
                            <text class="tracking-no">{{ item.trackingNo }}</text>
                            <text class="copy-btn" @tap="copyTrackingNo" :data-no="item.trackingNo">复制</text>
                        </view>
                        <view class="shipping-row" v-if="item.receiveTime">
                            <text class="shipping-label">签收时间:</text>
                            <text class="receive-time">{{ item.receiveTime }}</text>
                        </view>
                        <view class="shipping-progress" v-if="item.shipStatus === 'shipped'">
                            <view class="progress-dot active"></view>
                            <view class="progress-line"></view>
                            <view class="progress-dot"></view>
                            <view class="progress-line"></view>
                            <view class="progress-dot"></view>
                        </view>
                        <view class="shipping-progress" v-if="item.shipStatus === 'received'">
                            <view class="progress-dot active"></view>
                            <view class="progress-line active"></view>
                            <view class="progress-dot active"></view>
                            <view class="progress-line active"></view>
                            <view class="progress-dot active"></view>
                        </view>
                        <view class="progress-labels" v-if="item.shipStatus !== 'not_shipped'">
                            <text class="progress-label">已发货</text>
                            <text class="progress-label">运输中</text>
                            <text :class="'progress-label ' + (item.shipStatus === 'received' ? 'active' : '')">已签收</text>
                        </view>
                    </view>

                    <!-- 未寄出提示 -->
                    <view class="shipping-empty" v-if="item.shipStatus === 'not_shipped'">
                        <text class="empty-hint" v-if="item.status === 'pending'">审核通过后将安排发货</text>
                        <text class="empty-hint" v-if="item.status === 'approved'">商家正在准备发货</text>
                        <text class="empty-hint" v-if="item.status === 'rejected'">申请未通过，无需发货</text>
                    </view>
                </view>

                <!-- 底部操作 -->

                <view class="sample-footer">
                    <view class="action-btns">
                        <view class="btn-detail" @tap="goToDetail" :data-id="item.id">查看详情</view>
                        <view class="btn-confirm" v-if="item.shipStatus === 'shipped'" @tap="confirmReceive" :data-id="item.id">确认收货</view>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="sampleList.length === 0">
                <view class="empty-icon">📦</view>
                <text class="empty-text">暂无{{ filterText }}的样品申请记录</text>
                <text class="empty-subtext">去选品申请样品，开启带货之旅</text>
                <button class="btn-go-apply" @tap="goToApply">去选品申请样品</button>
            </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="sampleList.length > 0 && hasMore">
            <text class="load-text">加载更多...</text>
        </view>
        <view class="no-more" v-if="sampleList.length > 0 && !hasMore">
            <text class="no-more-text">没有更多了</text>
        </view>
    </view>
</template>

<script>
const { isLogin } = require('../../utils/user');
const sampleService = require('../../services/sampleService');
export default {
    data() {
        return {
            currentFilter: 'all',
            filterText: '',
            sampleList: [],
            hasMore: true,
            page: 1,
            pageSize: 10,

            // 筛选标签映射
            filterMap: {
                all: '',
                pending: '待审核',
                approved: '审核通过',
                shipped: '已寄出',
                rejected: '已拒绝'
            },

            product: {
                image: '',
                name: '',
                price: '',
                commission: ''
            }
        };
    },
    onLoad() {
        // 检查登录状态
        if (!isLogin()) {
            uni.showModal({
                title: '提示',
                content: '请先登录',
                confirmText: '去登录',
                success: (res) => {
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/login/index?redirect=/pages/my-samples/my-samples'
                        });
                    }
                }
            });
            return;
        }
        this.loadSampleList();
    },
    onShow() {
        // 每次显示页面时刷新列表
        this.loadSampleList();
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true
        });
        this.loadSampleList();
        uni.stopPullDownRefresh();
    },
    // 上拉加载更多
    onReachBottom() {
        if (this.hasMore) {
            this.loadMore();
        }
    },
    methods: {
        // 加载样品申请列表
        async loadSampleList() {
            uni.showLoading({
                title: '加载中...'
            });
            try {
                const res = await sampleService.getSamples({
                    status: this.currentFilter === 'all' ? '' : this.currentFilter,
                    page: this.page,
                    pageSize: this.pageSize
                });
                if (res.code === 200) {
                    this.setData({
                        sampleList: res.data.list || [],
                        filterText: this.filterMap[this.currentFilter],
                        hasMore: res.data.list && res.data.list.length >= this.pageSize
                    });
                } else {
                    uni.showToast({
                        title: res.message || '加载失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载样品申请列表失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },

        // 获取模拟数据
        getMockData() {
            return [
                {
                    id: 'SA1773469050335',
                    applyTime: '2026-03-14 06:17',
                    status: 'pending',
                    statusText: '待审核',
                    shipStatus: 'not_shipped',
                    shipStatusText: '未寄出',
                    products: [
                        {
                            id: 1,
                            image: 'https://picsum.photos/140/140?random=1',
                            name: '立白大师香氛洗衣液持久留香护色护衣',
                            price: '39.9',
                            commission: '20%'
                        }
                    ]
                },
                {
                    id: 'SA1773469050336',
                    applyTime: '2026-03-13 15:20:00',
                    status: 'approved',
                    statusText: '审核通过',
                    shipStatus: 'not_shipped',
                    shipStatusText: '未寄出',
                    products: [
                        {
                            id: 2,
                            image: 'https://picsum.photos/140/140?random=2',
                            name: '漫花悬挂式抽纸整箱批发家用实惠装',
                            price: '29.9',
                            commission: '15%'
                        }
                    ]
                },
                {
                    id: 'SA1773469050337',
                    applyTime: '2026-03-12 09:15:00',
                    status: 'approved',
                    statusText: '审核通过',
                    shipStatus: 'shipped',
                    shipStatusText: '已寄出',
                    logisticsCompany: '顺丰速运',
                    trackingNo: 'SF1234567890',
                    products: [
                        {
                            id: 3,
                            image: 'https://picsum.photos/140/140?random=3',
                            name: '维达超韧抽纸3层130抽24包整箱',
                            price: '45.9',
                            commission: '18%'
                        }
                    ]
                },
                {
                    id: 'SA1773469050338',
                    applyTime: '2026-03-10 14:30:00',
                    status: 'approved',
                    statusText: '审核通过',
                    shipStatus: 'received',
                    shipStatusText: '已签收',
                    logisticsCompany: '圆通快递',
                    trackingNo: 'YT9876543210',
                    receiveTime: '2026-03-12 10:30',
                    products: [
                        {
                            id: 4,
                            image: 'https://picsum.photos/140/140?random=4',
                            name: '心相印茶语系列抽纸3层100抽',
                            price: '35.9',
                            commission: '12%'
                        },
                        {
                            id: 5,
                            image: 'https://picsum.photos/140/140?random=5',
                            name: '清风原木纯品抽纸3层100抽',
                            price: '32.9',
                            commission: '10%'
                        }
                    ]
                },
                {
                    id: 'SA1773469050339',
                    applyTime: '2026-03-08 11:20:00',
                    status: 'rejected',
                    statusText: '已拒绝',
                    shipStatus: 'not_shipped',
                    shipStatusText: '未寄出',
                    rejectReason: '库存不足',
                    products: [
                        {
                            id: 6,
                            image: 'https://picsum.photos/140/140?random=6',
                            name: '洁柔纸巾抽纸整箱家用实惠装',
                            price: '28.9',
                            commission: '8%'
                        }
                    ]
                }
            ];
        },

        // 筛选列表
        filterList(list, filter) {
            if (filter === 'all') {
                return list;
            }
            if (filter === 'shipped') {
                // 已寄出包括 shipped 和 received 状态
                return list.filter((item) => item.shipStatus === 'shipped' || item.shipStatus === 'received');
            }
            return list.filter((item) => item.status === filter);
        },

        // 切换筛选
        switchFilter(e) {
            const filter = e.currentTarget.dataset.filter;
            this.setData({
                currentFilter: filter
            });
            this.loadSampleList();
        },

        // 跳转到详情页
        goToDetail(e) {
            const applicationId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/sample-detail/sample-detail?id=${applicationId}`
            });
        },

        // 复制快递单号
        copyTrackingNo(e) {
            const trackingNo = e.currentTarget.dataset.no;
            uni.setClipboardData({
                data: trackingNo,
                success: () => {
                    uni.showToast({
                        title: '单号已复制',
                        icon: 'success'
                    });
                }
            });
        },

        // 确认收货
        confirmReceive(e) {
            const applicationId = e.currentTarget.dataset.id;
            uni.showModal({
                title: '确认收货',
                content: '确认已收到样品吗？',
                success: (res) => {
                    if (res.confirm) {
                        // 更新状态
                        this.updateShipStatus(applicationId, 'received');
                    }
                }
            });
        },

        // 更新物流状态
        updateShipStatus(applicationId, status) {
            // 从本地存储获取数据
            let applications = uni.getStorageSync('sampleApplications') || [];

            // 更新对应申请的状态
            const index = applications.findIndex((item) => item.id === applicationId);
            if (index !== -1) {
                applications[index].shipStatus = status;
                applications[index].shipStatusText = status === 'received' ? '已签收' : '已寄出';

                // 保存回本地存储
                uni.setStorageSync('sampleApplications', applications);

                // 刷新列表
                this.loadSampleList();
                uni.showToast({
                    title: '确认收货成功',
                    icon: 'success'
                });
            }
        },

        // 去申请样品
        goToApply() {
            uni.switchTab({
                url: '/pages/index/index'
            });
        },

        // 跳转物流查询页面
        goToLogistics(e) {
            const dataset = e.currentTarget.dataset;
            const status = dataset.status;
            if (status === 'not_shipped') {
                return;
            }

            // 构建物流查询参数
            const logisticsData = {
                company: dataset.company || '未知物流',
                trackingNo: dataset.tracking,
                status: status,
                receiveTime: dataset.time
            };
            const url = `/pages/logistics/logistics?data=${encodeURIComponent(JSON.stringify(logisticsData))}`;
            uni.navigateTo({
                url
            });
        },

        // 加载更多
        loadMore() {
            // 这里可以实现分页加载逻辑
            console.log('加载更多');
        }
    }
};
</script>
<style>
.container {
    background-color: #f5f5f5;
    min-height: 100vh;
}

/* 筛选栏 */
.filter-bar {
    display: flex;
    background-color: #fff;
    padding: 0 20rpx;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.filter-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.filter-text {
    font-size: 28rpx;
    color: #666;
}

.filter-item.active .filter-text {
    color: #ff4757;
    font-weight: bold;
}

.filter-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 4rpx;
    background-color: #ff4757;
    border-radius: 2rpx;
}

/* 申请列表 */
.sample-list {
    padding: 20rpx;
}

.sample-card {
    background-color: #fff;
    border-radius: 15rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 申请头部 */
.sample-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20rpx 25rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.header-left {
    display: flex;
    flex-direction: column;
}

.apply-id {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 8rpx;
}

.apply-time {
    font-size: 24rpx;
    color: #999;
}

.status-badge {
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
}

.status-badge.pending {
    background-color: #fff3cd;
}

.status-badge.pending .status-text {
    color: #f59e0b;
}

.status-badge.approved {
    background-color: #d4edda;
}

.status-badge.approved .status-text {
    color: #10b981;
}

.status-badge.rejected {
    background-color: #f8d7da;
}

.status-badge.rejected .status-text {
    color: #ef4444;
}

.status-text {
    font-size: 24rpx;
    font-weight: bold;
}

/* 商品列表 */
.product-list {
    padding: 20rpx 25rpx;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}

.product-item:last-child {
    border-bottom: none;
}

.product-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 10rpx;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 15rpx;
}

.product-price {
    font-size: 28rpx;
    color: #ff4757;
    font-weight: bold;
}

.product-commission {
    font-size: 24rpx;
    color: #10b981;
    background-color: #d1fae5;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

/* 物流状态区域 */
.shipping-section {
    background-color: #f8f8f8;
    margin: 0 25rpx 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
}

.shipping-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.section-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.ship-status-badge {
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
}

.ship-status-badge.not_shipped {
    background-color: #f3f4f6;
}

.ship-status-badge.not_shipped .ship-status-text {
    color: #9ca3af;
}

.ship-status-badge.shipped {
    background-color: #dbeafe;
}

.ship-status-badge.shipped .ship-status-text {
    color: #3b82f6;
}

.ship-status-badge.received {
    background-color: #d1fae5;
}

.ship-status-badge.received .ship-status-text {
    color: #059669;
}

.ship-status-text {
    font-size: 24rpx;
    font-weight: bold;
}

/* 物流详情 */
.shipping-detail {
    padding-top: 10rpx;
}

.receive-time {
    font-size: 26rpx;
    color: #059669;
    font-weight: 500;
}

.shipping-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.shipping-label {
    font-size: 26rpx;
    color: #666;
    margin-right: 15rpx;
}

.tracking-no {
    font-size: 26rpx;
    color: #333;
    flex: 1;
    font-weight: 500;
}

.copy-btn {
    font-size: 24rpx;
    color: #ff4757;
    padding: 8rpx 20rpx;
    border: 1rpx solid #ff4757;
    border-radius: 20rpx;
    margin-left: 15rpx;
}

/* 物流进度 */
.shipping-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30rpx 0 20rpx;
}

.progress-dot {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: #e0e0e0;
}

.progress-dot.active {
    background-color: #2ed573;
}

.progress-line {
    width: 120rpx;
    height: 4rpx;
    background-color: #e0e0e0;
    margin: 0 10rpx;
}

.progress-line.active {
    background-color: #2ed573;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 40rpx;
    margin-bottom: 10rpx;
}

.progress-label {
    font-size: 24rpx;
    color: #999;
}

.progress-label.active {
    color: #059669;
    font-weight: 500;
}

.progress-dot.active {
    background-color: #059669;
}

.progress-line.active {
    background-color: #059669;
}

/* 未寄出提示 */
.shipping-empty {
    padding: 30rpx 0;
    text-align: center;
}

.empty-hint {
    font-size: 26rpx;
    color: #999;
}

/* 底部操作 */
.sample-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 25rpx;
    border-top: 1rpx solid #f0f0f0;
}

.sample-id {
    font-size: 24rpx;
    color: #999;
}

.action-btns {
    display: flex;
    gap: 15rpx;
}

.btn-detail,
.btn-confirm {
    font-size: 24rpx;
    padding: 12rpx 25rpx;
    border-radius: 25rpx;
    border: none;
    line-height: 1.5;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.btn-detail {
    background-color: #f5f5f5;
    color: #666;
}

.btn-confirm {
    background-color: #ff4757;
    color: #fff;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 40rpx;
}

.empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
}

.empty-text {
    font-size: 30rpx;
    color: #666;
    margin-bottom: 15rpx;
}

.empty-subtext {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 40rpx;
}

.btn-go-apply {
    background-color: #ff4757;
    color: #fff;
    font-size: 30rpx;
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    border: none;
}

/* 加载更多 */
.load-more,
.no-more {
    text-align: center;
    padding: 30rpx;
}

.load-text,
.no-more-text {
    font-size: 26rpx;
    color: #999;
}
</style>
