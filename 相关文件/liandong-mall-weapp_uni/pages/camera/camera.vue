<template>
    <view class="page">
        <!-- 相机预览区域 -->
        <view class="camera-view">
            <camera v-if="showCamera" device-position="back" flash="off" @error="error" class="camera"></camera>

            <!-- 扫描框 -->
            <view class="scan-area">
                <view class="scan-corner top-left"></view>
                <view class="scan-corner top-right"></view>
                <view class="scan-corner bottom-left"></view>
                <view class="scan-corner bottom-right"></view>
                <view class="scan-line"></view>
            </view>

            <!-- 提示文字 -->
            <view class="scan-tip">将商品放入框内即可识别</view>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-action">
            <!-- 相册按钮 -->
            <view class="action-btn album" @tap="chooseFromAlbum">
                <text class="btn-icon">�️</text>
                <text class="btn-text">相册</text>
            </view>

            <!-- 拍照按钮 -->
            <view class="capture-btn" @tap="takePhoto">
                <view class="capture-inner"></view>
            </view>

            <!-- 扫码按钮 -->
            <view class="action-btn scan" @tap="scanCode">
                <text class="btn-icon">🔲</text>
                <text class="btn-text">扫码</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showCamera: ''
        };
    },
    onLoad() {},
    methods: {
        takePhoto() {
            uni.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: ['camera'],
                success: (res) => {
                    const tempFilePath = res.tempFiles[0].tempFilePath;
                    this.handleImage(tempFilePath);
                }
            });
        },

        chooseFromAlbum() {
            uni.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: ['album'],
                success: (res) => {
                    const tempFilePath = res.tempFiles[0].tempFilePath;
                    this.handleImage(tempFilePath);
                }
            });
        },

        scanCode() {
            uni.scanCode({
                success: (res) => {
                    console.log('扫码结果:', res);
                    if (res.result) {
                        uni.navigateTo({
                            url: '/pages/search/search?keyword=' + encodeURIComponent(res.result)
                        });
                    }
                },
                fail: (err) => {
                    console.log('扫码失败:', err);
                }
            });
        },

        handleImage(imagePath) {
            uni.showLoading({
                title: '识别中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.navigateTo({
                    url: '/pages/search/search?image=' + encodeURIComponent(imagePath)
                });
            }, 1000);
        },

        error() {
            console.log('占位：函数 error 未声明');
        }
    }
};
</script>
<style>
.page {
    height: 100vh;
    background: #000;
    display: flex;
    flex-direction: column;
}

.camera-view {
    flex: 1;
    position: relative;
}

.camera {
    width: 100%;
    height: 100%;
}

.scan-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 560rpx;
    height: 360rpx;
}

.scan-corner {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-color: #fff;
    border-style: solid;
}

.top-left {
    top: 0;
    left: 0;
    border-width: 6rpx 0 0 6rpx;
}

.top-right {
    top: 0;
    right: 0;
    border-width: 6rpx 6rpx 0 0;
}

.bottom-left {
    bottom: 0;
    left: 0;
    border-width: 0 0 6rpx 6rpx;
}

.bottom-right {
    bottom: 0;
    right: 0;
    border-width: 0 6rpx 6rpx 0;
}

.scan-line {
    position: absolute;
    top: 10rpx;
    left: 20rpx;
    right: 20rpx;
    height: 4rpx;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scanAnim 2s linear infinite;
}

@keyframes scanAnim {
    0% {
        top: 10rpx;
    }
    50% {
        top: calc(100% - 14rpx);
    }
    100% {
        top: 10rpx;
    }
}

.scan-tip {
    position: absolute;
    bottom: 160rpx;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 26rpx;
}

.bottom-action {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 40rpx 60rpx 60rpx;
    background: rgba(0, 0, 0, 0.8);
}

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn-icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
}

.btn-text {
    color: #fff;
    font-size: 24rpx;
}

.capture-btn {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 6rpx solid #fff;
}

.capture-inner {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #fff;
}
</style>
