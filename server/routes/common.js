const router = require('koa-router')()
const File = require('../models/file');
const multer = require('koa-multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
let now = new Date(),
    currMonth = now.toISOString().substr(0, 7);
let dest = `uploads/${currMonth}/`;
let upload = multer({ dest: dest});
let User = require('../models/user');
fs.existsSync(upload) ? '' : mkdirp.sync(path.join(__dirname,'../' ,dest));
let {appid, appsecret} = require('../config');
let request = require('request-promise');
router.prefix('/common')

/**
 * 上传文件
 * @type {[type]}
 */
router.post('/upload',  upload.array('files', 12), async (ctx, next) => {
    try {
        let files = ctx.req.files;
        let f = [];
        for(let i= 0;i < files.length; i++) {
            let item = files[i];
            let ret = await File.create({savePath: item.path, fileName: item.filename, mimeType: item.mimetype, size: item.size, originalname: item.originalname, account: ctx.userId || ''})
            f.push({id: ret._id})
        }
        ctx.body = {code: 0, data: f}
    }catch(err) {
        ctx.body = {code: -1, errmsg: `upload file fail`}
    }
});

/**
 * 下载文件
 * @type {[type]}
 */
router.get('/downLoadFile', async (ctx, next) => {
    let {id} = ctx.query;
    let f = await File.findOne({_id: id});
    ctx.res.setHeader('Content-disposition', `attachment; filename=${encodeURIComponent(f.originalname)};filename*=utf-8${f.fileName}`);
    ctx.res.setHeader('Content-type', f.mimeType);
    f.size ? ctx.res.setHeader("Content-Length", Number(+f.size).toString()) : '';
    ctx.body = fs.createReadStream(path.resolve(process.env.dataDir, f.savePath));
});

router.post('/login', async (ctx, next) => {
  try {
    let {code} = ctx.request.body;
    let options = {
      uri: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`,
      method: 'GET'
    }
    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    let u = await User.findOne({openid: res.openid});
    if (!u) {
      u = await User.create({openid: res.openid});
    }
    let token = ctx.sign(u.userId);
    await ctx.setSession(u, token);
    res.token = token;
    ctx.body = {code: 0, data: res};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});

router.post('/UserInfo', async (ctx, next) => {
  try {
    let {openid, avatarUrl, city, country, gender, language, nickName, province} = ctx.request.body;
    await User.update({openid}, {$set: {
      username: nickName,
      avatar: avatarUrl,
      city,
      country,
      gender,
      language,
      province
    }})
    ctx.body = {code: 0, data: `add userInfo successful!`};
  }catch(err) {
    ctx.body = {code: -1, errmsg: `error: ${err}`};
  }
});


module.exports = router
