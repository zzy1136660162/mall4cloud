Page({
  data: {
    currentTab: 0
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('首页加载');
  },

  // 切换Tab
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      currentTab: index
    });
    
    // 可以在这里添加切换动画或数据加载逻辑
    console.log('切换到板块:', index);
  },

  // 导航到产品页
  goToProducts() {
    wx.navigateTo({
      url: '/pages/products/products'
    });
  },

  // 导航到咨询页
  goToConsult() {
    wx.navigateTo({
      url: '/pages/consult/consult'
    });
  },

  // 导航到个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 立即咨询认证
  consultCertification() {
    wx.showModal({
      title: '认证咨询',
      content: '即将为您连接专业认证顾问',
      confirmColor: '#134585',
      success: (res) => {
        if (res.confirm) {
          // 这里可以调用客服接口或跳转到咨询页面
          wx.navigateTo({
            url: '/pages/consult/consult?type=certification'
          });
        }
      }
    });
  },

  // 获取贴牌方案
  getOEMPlan() {
    wx.showModal({
      title: '贴牌方案',
      content: '我们的专业团队将为您定制生产方案',
      confirmColor: '#134585',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/consult/consult?type=oem'
          });
        }
      }
    });
  },

  // 浏览产品库
  browseProducts() {
    wx.navigateTo({
      url: '/pages/products/products'
    });
  },

  // 成为合伙人
  becomePartner() {
    wx.showModal({
      title: '合伙人申请',
      content: '加入杰东优品合伙人计划，共享供应链红利',
      confirmColor: '#134585',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/partner/partner'
          });
        }
      }
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '杰东药业 - 共创医健产业创新生态圈',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 模拟数据刷新
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1000
      });
    }, 1000);
  }
});
