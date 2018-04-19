const router = require('koa-router')();
const request = require('request-promise');
const {baseUrl, domain} = require('../config');
const Article = require('../models/article');
const User = require('../models/user');
const Banner = require('../models/banner');


/**
 * 正在上映
 * @type {Object}
 */
router.get('/in_theaters', async (ctx, next) => {
  try {
    let {start= 0, count= 3} = ctx.query;
    let options = {
      uri: `${baseUrl}/v2/movie/in_theaters?`,
      method: 'GET',
      qs: {
        start,
        count
      }
    };
    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res) : res;
    ctx.body = {code: 0, data: res.subjects};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error:${err}`};
  }
});

/**
 * 即将上映
 * @type {Object}
 */
router.get('/coming_soon', async (ctx, next) => {
  try {
    let {start= 0, count= 3} = ctx.query;
    let options = {
      uri: `${baseUrl}/v2/movie/coming_soon`,
      method: 'GET',
      qs: {
        start,
        count
      }
    };
    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res) : res;
    ctx.body = {code: 0, data: res.subjects};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});

/**
 * Top250
 * @type {Object}
 */
router.get('/top250', async (ctx, next) => {
  try {
    let {start= 0, count= 3} = ctx.query;
    let options = {
      uri: `${baseUrl}/v2/movie/top250`,
      method: 'GET',
      qs: {
        start,
        count
      }
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res) : res;
    ctx.body = {code: 0, data: res.subjects};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});

/**
 * 搜索电影
 * @type {Object}
 */
router.get('/searchMovie', async (ctx, next) => {
  try {
    let {q} = ctx.query;
    let options = {
      uri: `${baseUrl}/v2/movie/search?q=${encodeURIComponent(q)}`,
      method: 'GET'
    }
    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res) : res;
    ctx.body = {code: 0, data: res.subjects};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});

/**
 * 搜索电影
 * @type {Object}
 */
router.get('/getMovieDetail', async (ctx, next) => {
  try {
    let {id} = ctx.query;
    let options = {
      uri: `${baseUrl}/v2/movie/subject/` +id,
      method: 'GET'
    };
    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    ctx.body = {code: 0, data: res};
  }catch(err) {

  }
});

/**
 * 添加头图
 * @type {[type]}
 */
router.post('/addBanner', async (ctx, next) => {
  try {
    let {picId} = ctx.request.body;
    if (!picId) {
      throw new Error('lack of parameters');
    }
    await Banner.create({picId, userId: ctx.userId});
    ctx.body = {code: 0, data: `add banner successful`};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});
/**
 * 添加文章
 * @type {Number}
 */
router.post('/addArticle', async (ctx, next) => {
  try {
    let {text, imgId, commentCount=0, shareCount=0, music, title, content } = ctx.request.body;
    if (!text || !imgId || !title || !content || !music.url) {
      throw new Error('lack of parameters');
    }
    await Article.create({
      text, img: imgId, commentCount, shareCount, music, title, content, userId: ctx.userId
    })
    ctx.body = {code: 0, data: `add article successful`};
  }catch(err) {
    ctx.body = {code: -1 ,errmsg: `error:${err}`};
  }
});
/**
 * 获取阅读列表
 * @type {[type]}
 */
router.get('/getReadList', async (ctx, next) => {
  try {
    // let imgUrls =  [
    //         `${domain}/images/swipers/bl.png`,
    //         `${domain}/images/swipers/cat.png`,
    //         `${domain}/images/swipers/crab.png`,
    //         `${domain}/images/swipers/sls.JPG`,
    //         `${domain}/images/swipers/vr.png`,
    //         `${domain}/images/swipers/xiaolong.jpg`
    //     ];
      let imgUrls = await Banner.find({status: true}).select('picId -_id');
      for (let i =0 ;i< imgUrls.length; i++) {
        imgUrls[i] = `${domain}/common/downLoadFile?id=${imgUrls[i].picId}`
      }
      let arr = await Article.find({status: true});
      let items = [];
      for (let i = 0; i< arr.length; i++) {
        let item = arr[i];
        let u = await User.findOne({userId: +item.userId});
        items.push({
          id: item._id,
          avatar: u.avatar,
          date: (new Date (item.createdAt) + '' ).substring(4,15),
          text: item.text,
          img: `${domain}/common/downLoadFile?id=${item.img}`,
          num1: item.commentCount,
          num2: item.shareCount
        });
      }
    // let items = [
    //         {
    //             id: 0,
    //             avatar: `${domain}/images/avatars/1.png`,
    //             date: '9 20 2016',
    //             text: '又是虾肥蟹壮时',
    //             img: `${domain}/images/swipers/crab.png`,
    //             num1: 90,
    //             num2: 60
    //         },
    //         {
    //             id: 1,
    //             avatar: `${domain}/images/avatars/2.png`,
    //             date: '1 21 2017',
    //             text: '金奖名导李安',
    //             img: `${domain}/images/swipers/bl.png`,
    //             num1: 80,
    //             num2: 70
    //         },
    //         {
    //             id: 2,
    //             avatar: `${domain}/images/avatars/3.png`,
    //             date: '4 05 2017',
    //             text: '可爱的喵星人',
    //             img: `${domain}/images/swipers/cat.png`,
    //             num1: 120,
    //             num2: 50
    //         },
    //         {
    //             id: 3,
    //             avatar: `${domain}/images/avatars/4.png`,
    //             date: '8 10 2017',
    //             text: '灵隐寺',
    //             img: `${domain}/images/swipers/sls.JPG`,
    //             num1: 50,
    //             num2: 30
    //         },
    //         {
    //             id: 4,
    //             avatar: `${domain}/images/avatars/5.png`,
    //             date: '1 10 2018',
    //             text: 'vr带你走进神奇的世界',
    //             img: `${domain}/images/swipers/vr.png`,
    //             num1: 200,
    //             num2: 150
    //         }
    //     ];
    ctx.body = {code: 0, data: {imgUrls, items}};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error:${err}`};
  }
})


/**
 * 获取阅读详情
 * @type {[type]}
 */
router.get('/getReadDetail', async (ctx, next) => {
  try {
    let {id} = ctx.query;
    // var data = {
    //    id: 0,
    //    img: `${domain}/images/swipers/sls.JPG`,
    //    music: {
    //      url:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    //      title: '此时此刻',
    //      coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    //    },
    //    avatar: `${domain}/images/avatars/1.png`,
    //    name: '',
    //    day: 3,
    //    title: '当我们在谈论互联网时,我们在谈论哪些技术？',
    //    content: '互联网技术的普遍应用，是进入信息社会的标志。不同的人和不同的书上对此有不同解释。但一个基本上大家都同意的观点是，IT有以下三部分组成：\n' +
    //    '-----传感技术这是人的感觉器官的延伸与拓展，最明显的例子是条码阅读器；\n' +
    //    '-----通信技术这是人的神经系统的延伸与拓展，承担传递信息的功能；\n' +
    //    '-----计算机技术这是人的大脑功能延伸与拓展，承担对信息进行处理的功能。\n' +
    //    '所谓信息化是用信息技术来改造其他产业与行业，从而提高企业的效益。在这个过程中信息技术承担了一个得力工具的角色。'
    // }

    let article = await Article.findOne({_id: id, status: true});
    let u = await User.findOne({userId: article.userId});
    let data = {
      id: article._id,
      img: `${domain}/common/downLoadFile?id=${article.img}`,
      music: article.music,
      avatar: u.avatar,
      name: u.username,
      day: Math.floor((Date.now() - new Date(article.createdAt))/1000/3600/24),
      title: article.title,
      content: article.content
    }

    ctx.body = {code: 0, data};
  }catch(err) {
    ctx.body ={code: -1, errmsg: `error:${err}`};
  }
});



module.exports = router;
