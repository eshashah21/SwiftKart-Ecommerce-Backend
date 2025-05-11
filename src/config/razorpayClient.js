const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'key_id',
  key_secret: 'key_secret',
});

module.exports = razorpay;