const security = require('../libs/security');
const redisService = require('../libs/redis');
module.exports = async function(ctx, next){
    try {
      ctx.getSession = async function(__token) {
          try {
              if (__token)
                  cookie = __token;
              let [secret, userId] = security.decipher(cookie).split(":");
              let session = await redisService.get(`${userId}`);
              if (!session || session.secret !== secret) throw new commonError.tokenValidationFailure();
              delete session.secret;
              session;
              return session;
          } catch (error) {
              throw new Error('token error');
          }
      };

      ctx.reSetSession = async function(value, token=ctx.req.headers.token) {
          let [secret, userId] = security.decipher(token).split(":");
          let session = await redisService.get(`${userId}`);
          if (session.secret !== secret) throw new commonError.tokenValidationFailure();
          Object.assign(session, value);
          return await redisService.set(`${userId}`, session);
      };

      ctx.setSession = async function(seems, token = cookie) {
          let [secret, userId] = security.decipher(token).split(":");
          seems.secret = secret;
          seems._doc.secret = secret;
          return  await redisService.set(`${userId}`, seems);
      };

      ctx.delSession = async function(token) {
          let [secret, userId] = security.decipher(token).split(":");
          return  await redisService.del(`${userId}`);
      };
      ctx.sign = function(userId) {
          let cookie = security.cipher(`${new Date().getTime()}:${userId}`);
          return cookie;
      };
      if(ctx.url == '/favicon.ico') return;

      if(ctx.path.startsWith('/common')) {
          console.log(ctx.path);
      }else {
          let token = ctx.req.headers.token;
          let user= await ctx.getSession(token);
          if(!token) {
              throw new Error('token error');
          }
          ctx.userId = user.userId;
      }
      await next();
    }catch(err) {
      ctx.body = {code: -1, errmsg: `error: ${err}`};
    }

};
