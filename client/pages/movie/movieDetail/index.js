var app = getApp();
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var url = app.globalData.baseUrl + '/getMovieDetail';
        var data = {
            id: id
        };
        util.http(url, 'GET', data, this.callback);
    },
    callback: function (data) {
        var movie = {};
        movie.id = data.id;
        movie.title = data.title;
        movie.countries = data.countries.length != 0 ? data.countries[0]: '';
        movie.year = data.year;
        movie.collect_count = data.collect_count;
        movie.comments_count = data.comments_count;
        movie.poster = data.images.large;
        movie.original_title = data.original_title;
        movie.star = data.rating.stars;
        movie.average = data.rating.average;
        movie.directors = data.directors.length != 0 ? {name: data.directors[0].name} : {name: ''};
        var actorName = [], actorAvatar = [];
        for (var i = 0; i < data.casts.length; i++) {
            var item = data.casts[i];
            actorName.push(item.name);
            actorAvatar.push({src: item.avatars.large, name: item.name});
        }
        movie.actors = {
            name: actorName.length != 0 ? actorName.join('/') : '',
            imgs: actorAvatar
        };
        movie.type = data.genres.join('、') || '';
        movie.summary = data.summary;
        console.log(movie.actors.imgs)
        this.setData({
            movie: movie
        })
    }
    ,
    viewPoster: function(ev) {
        var src = ev.currentTarget.dataset.src;
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    }


});