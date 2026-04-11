<template>
    <view class="chat-container">
        <!-- 消息列表 -->
        <scroll-view class="message-list" scroll-y :scroll-into-view="scrollToMessage" scroll-with-animation>
            <view
                :class="'message-item ' + item.type"
                :id="'msg-' + item.id"
                @longpress="onMessageLongPress"
                :data-content="item.content"
                v-for="(item, index) in messages"
                :key="index"
            >
                <!-- 用户头像 -->

                <image v-if="item.type === 'user'" class="avatar" :src="userInfo.avatarUrl || ''" mode="aspectFill" />

                <!-- 客服头像 -->

                <view v-if="item.type === 'agent' || item.type === 'system'" class="avatar avatar-service">
                    <text class="avatar-text">客</text>
                </view>

                <view class="message-content">
                    <!-- 消息气泡 -->
                    <view :class="'bubble ' + item.type">
                        <!-- AI 消息使用 rich-text 解析 Markdown -->
                        <rich-text v-if="item.type === 'agent' || item.type === 'system'" class="message-text" :nodes="item.htmlContent || item.content" />
                        <!-- 用户消息使用普通文本 -->
                        <text v-else class="message-text">{{ item.content }}</text>
                    </view>

                    <!-- 建议选项 -->
                    <view class="suggestions" v-if="item.suggestions && item.suggestions.length > 0">
                        <view class="suggestion-item" @tap="onSuggestionTap" :data-suggestion="suggestion" v-for="(suggestion, index1) in item.suggestions" :key="index1">
                            {{ suggestion }}
                        </view>
                    </view>

                    <!-- 时间 -->
                    <text class="message-time">{{ item.time }}</text>
                </view>
            </view>

            <!-- 加载状态 -->
            <view class="loading-indicator" v-if="isLoading">
                <view class="loading-dots">
                    <view class="dot"></view>
                    <view class="dot"></view>
                    <view class="dot"></view>
                </view>
            </view>
        </scroll-view>

        <!-- 快捷问题 -->
        <view class="quick-questions" v-if="messages.length <= 2">
            <text class="quick-title">常见问题</text>
            <scroll-view class="quick-scroll" scroll-x>
                <view class="quick-item" @tap="onQuickQuestionTap" :data-question="item" v-for="(item, index) in quickQuestions" :key="index">
                    {{ item }}
                </view>
            </scroll-view>
        </view>

        <!-- 底部输入框 -->
        <view class="input-area">
            <view class="input-main">
                <input class="message-input" placeholder="请输入您的问题..." :value="inputValue" @input="onInputChange" confirm-type="send" @confirm="sendMessage" />
                <view class="send-btn-wrap">
                    <button :class="'send-btn ' + (inputValue ? 'active' : '')" @tap="sendMessage">
                        <text class="send-icon">➤</text>
                    </button>
                </view>
            </view>
            <view class="human-btn" @tap="contactHuman">
                <text class="human-icon">👤</text>
                <text class="human-text">人工</text>
            </view>
        </view>
    </view>
</template>

<script>
const chatService = require('../../utils/chatService');
const app = getApp();

// 调试日志
const log = (tag, data) => {
    console.log(`[ChatPage] ${tag}:`, data);
};
export default {
    data() {
        return {
            messages: [],
            inputValue: '',
            sessionId: '',
            scrollToMessage: '',
            isLoading: false,
            userInfo: null,
            quickQuestions: ['如何提交研发需求？', '需求审核需要多久？', '怎么查看需求进度？', '如何申请成为达人？', '样品申请流程是什么？'],
            suggestion: ''
        };
    },
    onLoad() {
        log('页面加载', 'onLoad');

        // 获取用户信息
        const userInfo = uni.getStorageSync('userInfo') || {};
        log('获取用户信息', userInfo);
        this.setData({
            userInfo
        });

        // 初始化会话
        this.initChatSession();

        // 添加欢迎消息
        this.addMessage({
            type: 'system',
            content: '欢迎使用智能客服，我是您的专属助手，请问有什么可以帮助您？'
        });
    },
    onUnload() {
        log('页面卸载', 'onUnload');
        // 页面卸载时结束会话
        if (this.sessionId) {
            chatService.endSession(this.sessionId).catch((err) => {
                console.error('结束会话失败:', err);
            });
        }
    },
    methods: {
        // 初始化会话
        async initChatSession() {
            log('初始化会话', '开始');
            try {
                const userData = {
                    userId: app.globalData.userId,
                    ...this.userInfo
                };
                log('初始化会话参数', userData);
                const res = await chatService.initSession(userData);
                log('初始化会话响应', res);
                if (res.sessionId) {
                    this.setData({
                        sessionId: res.sessionId
                    });
                    log('会话ID已设置', res.sessionId);
                }
            } catch (err) {
                console.log('CatchClause', err);
                console.log('CatchClause', err);
                console.error('初始化会话失败:', err);
                log('初始化会话错误', err);
            }
        },

        // 添加消息到列表
        addMessage(message) {
            log('添加消息', message);
            const messages = this.messages;

            // 检查是否是重复消息（防止重复添加）
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.type === message.type && lastMessage.content === message.content && Date.now() - lastMessage.id < 1000) {
                log('检测到重复消息，跳过添加');
                return;
            }
            message.id = Date.now();
            message.time = this.formatTime(new Date());
            messages.push(message);
            log('当前消息列表长度', messages.length);
            this.setData({
                messages: messages,
                scrollToMessage: `msg-${message.id}`
            });
        },

        // 格式化时间
        formatTime(date) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },

        // 输入框变化
        onInputChange(e) {
            const value = e.detail.value;
            this.setData({
                inputValue: value
            });
        },

        // 发送消息
        async sendMessage() {
            const content = this.inputValue.trim();
            log('发送消息', {
                content,
                isLoading: this.isLoading
            });
            if (!content || this.isLoading) {
                log('发送消息被阻止', {
                    empty: !content,
                    loading: this.isLoading
                });
                return;
            }

            // 添加用户消息
            this.addMessage({
                type: 'user',
                content
            });
            this.setData({
                inputValue: '',
                isLoading: true
            });
            try {
                log('调用chatService.sendMessage', {
                    content,
                    sessionId: this.sessionId,
                    userInfo: this.userInfo
                });

                // 调用智能客服接口
                const res = await chatService.sendMessage(content, this.sessionId, this.userInfo);
                log('sendMessage 响应', res);

                // 添加客服回复
                if (res.reply) {
                    // 去除重复内容
                    let reply = this.removeDuplicateContent(res.reply);
                    log('添加客服回复', reply);
                    this.addMessage({
                        type: 'agent',
                        content: reply,
                        suggestions: res.suggestions || []
                    });
                } else {
                    log('响应中没有reply字段', res);
                    this.addMessage({
                        type: 'system',
                        content: '抱歉，服务器返回数据异常，请稍后重试。'
                    });
                }

                // 更新会话ID
                if (res.sessionId) {
                    log('更新会话ID', res.sessionId);
                    this.setData({
                        sessionId: res.sessionId
                    });
                }
            } catch (err) {
                console.log('CatchClause', err);
                console.log('CatchClause', err);
                console.error('发送消息失败:', err);
                log('发送消息错误', err);
                this.addMessage({
                    type: 'system',
                    content: '抱歉，网络连接出现问题，请稍后重试。'
                });
            } finally {
                this.setData({
                    isLoading: false
                });
                log('发送消息完成', 'finally');
            }
        },

        // 点击快捷问题
        onQuickQuestionTap(e) {
            const question = e.currentTarget.dataset.question;
            log('点击快捷问题', question);
            this.setData({
                inputValue: question
            });
            this.sendMessage();
        },

        // 点击建议选项
        onSuggestionTap(e) {
            const suggestion = e.currentTarget.dataset.suggestion;
            log('点击建议选项', suggestion);
            this.setData({
                inputValue: suggestion
            });
            this.sendMessage();
        },

        // 长按消息复制
        onMessageLongPress(e) {
            const content = e.currentTarget.dataset.content;
            log('长按消息', content);
            uni.setClipboardData({
                data: content,
                success: () => {
                    uni.showToast({
                        title: '已复制',
                        icon: 'success'
                    });
                }
            });
        },

        // 返回上一页
        goBack() {
            log('返回上一页', 'goBack');
            uni.navigateBack();
        },

        // 跳转到人工客服
        contactHuman() {
            log('联系人工客服', 'contactHuman');
            uni.showModal({
                title: '联系人工客服',
                content: '人工客服工作时间：9:00-18:00\n客服电话：400-xxx-xxxx',
                showCancel: false
            });
        },

        // 去除重复内容
        removeDuplicateContent(content) {
            if (!content || typeof content !== 'string') {
                return content;
            }
            // 按换行符分割
            const lines = content.split('\n');
            // 去重
            const uniqueLines = [];
            const seen = new Set();
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !seen.has(trimmed)) {
                    seen.add(trimmed);
                    uniqueLines.push(line);
                }
            }
            return uniqueLines.join('\n');
        }
    }
};
</script>
<style>
/* 聊天页面样式 */
page {
    height: 100%;
    background-color: #f5f5f5;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* 顶部导航 */
.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background: linear-gradient(135deg, #f5d547, #ffec8b);
    color: #333;
}

.back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-btn .icon {
    font-size: 40rpx;
}

.title {
    font-size: 36rpx;
    font-weight: 500;
}

.human-btn {
    padding: 10rpx 20rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30rpx;
    font-size: 24rpx;
}

/* 消息列表 */
.message-list {
    flex: 1;
    padding: 20rpx;
    overflow-y: auto;
}

.message-item {
    display: flex;
    margin-bottom: 30rpx;
    align-items: flex-start;
}

.message-item.user {
    flex-direction: row-reverse;
}

.avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 20rpx;
    background: #e8e8e8;
}

.avatar-service {
    background: linear-gradient(135deg, #f5d547, #ffec8b);
    position: relative;
}

.avatar-service::after {
    content: '客';
    color: #333;
    font-size: 32rpx;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 1;
}

.avatar-text {
    color: #fff;
}

.message-content {
    max-width: 70%;
    display: flex;
    flex-direction: column;
}

.message-item.user .message-content {
    align-items: flex-end;
}

.bubble {
    padding: 20rpx 24rpx;
    border-radius: 20rpx;
    word-wrap: break-word;
}

.bubble.user {
    background: #f5d547;
    color: #333;
    border-bottom-right-radius: 4rpx;
}

.bubble.agent {
    background: #fff;
    color: #333;
    border-bottom-left-radius: 4rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.bubble.system {
    background: #f6ffed;
    color: #52c41a;
    border: 1rpx solid #b7eb8f;
}

.message-text {
    font-size: 30rpx;
    line-height: 1.6;
}

.message-time {
    font-size: 22rpx;
    color: #999;
    margin-top: 8rpx;
}

/* 建议选项 */
.suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 10rpx;
}

.suggestion-item {
    padding: 10rpx 20rpx;
    background: #fffbe6;
    color: #d4a017;
    border-radius: 30rpx;
    font-size: 26rpx;
    border: 1rpx solid #ffe58f;
}

/* 加载动画 */
.loading-indicator {
    display: flex;
    justify-content: center;
    padding: 20rpx;
}

.loading-dots {
    display: flex;
    gap: 10rpx;
}

.dot {
    width: 16rpx;
    height: 16rpx;
    background: #ccc;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
    animation-delay: -0.32s;
}

.dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

/* 快捷问题 */
.quick-questions {
    padding: 20rpx;
    background: #fff;
    border-top: 1rpx solid #e8e8e8;
}

.quick-title {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 15rpx;
    display: block;
}

.quick-scroll {
    white-space: nowrap;
}

.quick-item {
    display: inline-block;
    padding: 15rpx 25rpx;
    margin-right: 15rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
    border: 1rpx solid #e8e8e8;
}

.quick-item:active {
    background: #fffbe6;
    color: #d4a017;
    border-color: #ffe58f;
}

/* 输入区域 */
.input-area {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background: #fff;
    border-top: 1rpx solid #e8e8e8;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    gap: 16rpx;
}

.input-main {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 6rpx 6rpx 6rpx 30rpx;
}

.message-input {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    height: 60rpx;
    min-width: 0;
}

.send-btn-wrap {
    flex-shrink: 0;
    margin-left: 10rpx;
}

.send-btn {
    width: 72rpx !important;
    height: 72rpx !important;
    line-height: 72rpx !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: #ccc !important;
    border-radius: 50% !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    font-size: 0;
}

.send-btn.active {
    background: #1890ff !important;
    background: #f5d547;
}

.send-btn:active {
    opacity: 0.8;
}

.send-icon {
    color: #fff;
    font-size: 28rpx;
    margin-left: 4rpx;
    line-height: 1;
}

.human-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 16rpx;
    flex-shrink: 0;
}

.human-icon {
    font-size: 36rpx;
    margin-bottom: 4rpx;
}

.human-text {
    font-size: 22rpx;
    color: #666;
}
</style>
