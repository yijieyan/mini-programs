var app = getApp();
var util = require('../../../utils/util');
Page({
    data: {
        isStart: false,
        iscollected: false,
        isShared: false,
        isFirstPlay: false,
        id: null,
        collectionImg: '/images/others/collection.png',
        collectionNotImg: '/images/others/collection-anti.png',
        shareImg: '/images/others/share.png',
        shareNotImg: '/images/others/share-anti.png'
    },
    collected: function () {
        wx.showToast({
            title: this.data.iscollected? '取消收藏' : '收藏成功',
            icon: 'success',
            duration: 1000
        });
        this.setData({
            iscollected: !this.data.iscollected
        })
    },
    shared: function () {
        wx.showToast({
            title: this.data.isShared? '取消分享' : '分享成功',
            icon: 'success',
            duration: 1000
        });
        this.setData({
            isShared: !this.data.isShared
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        this.requestData(id);
        this.setData({
            id
        });
        if (id === app.globalData.isPlayId) {
            this.setData({
                isStart: true
            });

        }
    },
    audioPlay: function () {
        var that = this;
        wx.playBackgroundAudio({
            dataUrl: this.data.music.url,
            title: this.data.music.title,
            coverImgUrl: this.data.music.coverImgUrl
        });
        if (!this.isFirstPlay) {
            that.setData({
                isFirstPlay: true
            });
            app.globalData.isPlayId = this.data.id;
            wx.onBackgroundAudioPlay(function() {
                that.setData({
                    isStart: true
                });
            });

            wx.onBackgroundAudioPause(function() {
                that.setData({
                    isStart: false
                });
            });

            wx.onBackgroundAudioStop(function() {
                that.setData({
                    isStart: false
                });
                app.globalData.isPlayId = null;
            });
        }
        this.setData({
            isStart: true
        });
    },
    audioPause: function () {
        wx.pauseBackgroundAudio();
        this.setData({
            isStart: false
        });
    },
    requestData: function (id) {
        var url = app.globalData.baseUrl + '/getReadDetail';
        var data = {id};
        util.http(url, 'GET', data, this.callback);
    },
    callback: function (data) {
        this.setData({
            img: data.img,
            music: data.music,
            avatar: data.avatar,
            name: data.name,
            day: data.day,
            title: data.title,
            content: data.content
        })
    }
});