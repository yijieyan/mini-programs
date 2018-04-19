const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let bannerSchema = new Schema({
    picId: String,
    userId:String,
    status: {
      type: Boolean,
      default: true
    }
}, {versionKey: false, timestamps: true});
module.exports = mongoose.model('banner', bannerSchema);
