function checkLogin(options = {}) {
    const { showToast = true, redirectTo = null } = options;
    const userId = uni.getStorageSync('userId');
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');
    const isLoggedIn = !!(userId && token && userInfo);
    if (!isLoggedIn && showToast) {
        uni.showModal({
            title: '提示',
            content: '请先登录后再进行操作',
            confirmText: '去登录',
            cancelText: '取消',
            success: (res) => {
                if (res.confirm) {
                    navigateToLogin(redirectTo);
                }
            }
        });
        return false;
    }
    if (!isLoggedIn && redirectTo) {
        navigateToLogin(redirectTo);
        return false;
    }
    return isLoggedIn;
}
function navigateToLogin(redirectTo = null) {
    const currentPage = getCurrentPages();
    const current = currentPage[currentPage.length - 1];
    let backUrl = '';
    if (current && current.route) {
        const options = current.options || current.data ? current.options || {} : {};
        if (Object.keys(options).length > 0) {
            const queryString = Object.keys(options)
                .map((key) => `${key}=${encodeURIComponent(options[key])}`)
                .join('&');
            backUrl = `/${current.route}?${queryString}`;
        } else {
            backUrl = `/${current.route}`;
        }
    }
    if (redirectTo) {
        backUrl = redirectTo;
    }
    const loginUrl = backUrl ? `/pages/login/index?redirect=${encodeURIComponent(backUrl)}` : '/pages/login/index';
    uni.navigateTo({
        url: loginUrl
    });
}
function getLoginStatus() {
    const userId = uni.getStorageSync('userId');
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');
    return {
        isLoggedIn: !!(userId && token && userInfo),
        userId: userId,
        token: token,
        userInfo: userInfo
    };
}
function setLoginData(userId, token, userInfo = {}) {
    uni.setStorageSync('userId', userId);
    uni.setStorageSync('token', token);
    if (userInfo) {
        uni.setStorageSync('userInfo', userInfo);
    }
}
function clearLoginData() {
    uni.removeStorageSync('userId');
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
}
function requireLogin(callback, options = {}) {
    const loginStatus = getLoginStatus();
    if (!loginStatus.isLoggedIn) {
        checkLogin(options);
        return false;
    }
    if (callback && typeof callback === 'function') {
        callback();
        return true;
    }
    return true;
}
module.exports = {
    checkLogin,
    navigateToLogin,
    getLoginStatus,
    setLoginData,
    clearLoginData,
    requireLogin
};
