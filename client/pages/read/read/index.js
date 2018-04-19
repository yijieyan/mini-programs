var app = getApp();
var util = require('../../../utils/util');
Page({

    data: {
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        items: []
    },
    jumpReadDetail: function(ev) {
        var id = ev.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../readDetail/index?id='+id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },
    requestData: function() {
        var url = app.globalData.baseUrl + '/getReadList';
        var data = {};
        util.http(url, 'GET', data, this.callback);
    },
    callback: function(data) {
        this.setData({
          imgUrls: data.imgUrls,
            items: data.items
        });
    }
});