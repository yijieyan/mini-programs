var util = require('../../../utils/util');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movieList: [],
        url: '',
        totalCount: 0,
        isEnd: false,
        isRefresh: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var url = app.globalData.baseUrl;
        var name = options.name;
        wx.setNavigationBarTitle({
            title: name
        });
        if (name === '正在上映') {
            url += '/in_theaters'
        } else if (name === '即将上映') {
            url += '/coming_soon'
        } else if (name === 'Top250') {
            url += '/top250'
        }

        var data = {
            start: 0,
            count: 20
        };

        this.setData({
            url: url
        });
        this.requestData(url, data);
    },
    requestData: function(url, data) {

       if (!this.data.isEnd) {
         util.http(url, 'GET', data, this.callback);
       }
    },
    callback: function (data) {
        if (this.data.isRefresh) {
            wx.stopPullDownRefresh();
        }
        let movies = [];
        for (let i= 0 ;i< data.length; i++) {
            let item = data[i];
            movies.push({
                title: item.title,
                stars: {star:  Math.floor(item.rating.stars/ 10)},
                average: item.rating.average,
                src: item.images.small,
                movieId: item.id
            })
        }
        if (data.length === 0) {
            this.setData({
                isEnd: true
            })
        }
        var arr = this.data.movieList.concat(movies);
        this.setData({movieList: arr});
        var count = this.data.totalCount + 20;
        this.setData({
            totalCount: count,
            isRefresh: false
        });
    },
    onReachBottom: function() {
        var url = this.data.url;
        var data = {
            start: this.data.totalCount,
            count: 20
        };
        this.requestData(url, data);
    },
    onPullDownRefresh: function() {

        var url = this.data.url;
        this.setData({
            totalCount: 0,
            isEnd: false,
            isRefresh: true,
            movieList: []
        });
        var data = {
            start: this.data.totalCount,
            count: 20
        };
        this.requestData(url, data);
    },
    jumpDetail: function (ev) {
        var id = ev.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movieDetail/index?id='+id
        })
    }
});