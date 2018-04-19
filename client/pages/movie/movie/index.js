var util = require('../../../utils/util');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        theater: [],
        coming_soon: [],
        top250: [],
        isSearch: false,
        value:'',
        searchList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var baseUrl = app.globalData.baseUrl;
        var theaterUrl = baseUrl + '/in_theaters';
        var coming_soon = baseUrl + '/coming_soon';
        var top250 = baseUrl + '/top250';
        this.rquestData(theaterUrl, 'theater');
        this.rquestData(coming_soon, 'coming_soon');
        this.rquestData(top250, 'top250');
    },

    rquestData (url, key) {
        var data = {
          start: 0,
          count: 3,
          key:key
        };
        util.http(url, 'GET', data, this.callback);
    },
    callback: function(data, key) {
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
        if (key === 'theater') {
            this.setData({theater: {name: '正在上映', list: movies}});
        } else if (key === 'coming_soon') {
            this.setData({coming_soon: {name: '即将上映', list: movies}});
        } else if (key === 'top250') {
            this.setData({top250: {name: 'Top250', list: movies}});
        }else {
            this.setData({searchList: movies});
        }
    },
    jumpMovieList: function(ev) {
        wx.navigateTo({
            url: '../movieList/index?name=' + ev.target.dataset.name
        })
    },
    bindfocus: function() {
        this.setData({
            isSearch:true
        });
    },
    cancel: function() {
      this.setData({
          isSearch: false,
          searchList: []
      });
      this.setData({
          value: ''
      })
    },
    bindconfirm: function(ev) {
        var value = ev.detail.value;
        var url= app.globalData.baseUrl + '/searchMovie';
        var data = {
            q: value
        };

        util.http(url, 'GET', data, this.callback);
    },
    jumpDetail: function(ev) {
        var id = ev.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movieDetail/index?id='+id
        })
    }

});