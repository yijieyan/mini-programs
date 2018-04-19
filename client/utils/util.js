function http(url, method= 'GET', data = {}, cb) {
    var key = '';
    if (data.key) {
        key = data.key;
        delete data.key;
    }
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    })
    var token = wx.getStorageSync('movie_token') || '';
    wx.request({
        url: url,
        method: method,
        data: data,
        header: {
            'content-type': 'application/json',
            'token': token
        },
        dataType: 'json',
        success: function(res) {
          wx.hideNavigationBarLoading();
          wx.hideLoading()
            res = res.data;
            if (res.code === 0) {
              cb(res.data, key);
             
            } else if (res.code === -1) {
              wx.showToast({
                title: '服务器错误',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 2000
              })
            }
            
        }
    })
};

module.exports = {
    http: http
};
