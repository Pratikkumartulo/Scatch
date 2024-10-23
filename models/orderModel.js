// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  image : Buffer,
  name:String,
  price:Number,
  discount:{
      type:Number,
      default:0
  },
  otherdicnt:{
    type:Number,
    default:0
  },
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"product",
    required:true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  review:String,
  ratting:Number
});

module.exports = mongoose.model('Order', orderSchema);
