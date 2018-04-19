//index.js
//获取应用实例
const app = getApp();

Page({
    data: {},
    jumpIndex: function() {
        wx.switchTab({
            url: '../read/read/index'
        })
    },
    onLoad: function () {

    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
});
