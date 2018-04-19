const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let musicSchema = new Schema({
  _id: 0,
  url: String,
  title: String,
  coverImgUrl: String
})

let articleSchema = new Schema({
    userId: String,
    text: String,
    img: String,
    commentCount: {
      type: Number,
      defalut: 0
    },
    shareCount:  {
      type: Number,
      defalut: 0
    },
    music: musicSchema,
    title: String,
    content: String,
    status: {
      type: Boolean,
      default: true
    }
}, {versionKey: false, timestamps: true});
module.exports = mongoose.model('article', articleSchema);
