const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');


let userSchema = new Schema({
    openid: {
        type: String
    },
    username: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    mail: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    city: String,
    country: String,
    gender: Number,
    language: String,
    province: String
}, {versionKey: false, timestamps: true});

userSchema.plugin(autoIncrement.plugin, {
  model: 'user',
  field: 'userId',
  startAt: 10000,
  incrementBy: 1
});
module.exports = mongoose.model('user', userSchema);
