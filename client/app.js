var util = require('./utils/util.js');

App({
    onLaunch: function () {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            var url = that.globalData.baseUrl + '/common/login';
            var data = {
              code: res.code
            }
            util.http(url, 'POST', data, that.callback);
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });   
    },
    callback: function(data) {
      this.globalData.openid = data.openid;
      wx.setStorageSync('movie_token', data.token)
      this.globalData.token = data.token;
      var that =this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                wx.getUserInfo({
                  success: function (res) {
                    var url = that.globalData.baseUrl + '/common/UserInfo';
                    var data = res.userInfo;
                    data.openid = that.globalData.openid;
                    util.http(url, 'POST', data, that.cb);
                  }
                })   
              }
            })
          }
        }
      })
    },
    cb: function(data) {
    },
    globalData: {
        userInfo: null,
        baseUrl: 'https://www.ishareu.cn',
        isPlayId: null,
        token: null
    }
});