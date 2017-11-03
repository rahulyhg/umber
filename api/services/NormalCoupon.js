var schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    couponType: {
        type: String,
        default: "Amount",
        enum: ['Percentage', 'Amount']
    },
    startDate: Date,
    endDate: Date,
    percentage: Number,
    amount: Number,
    maxAmount: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('NormalCoupon', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    //get discount while entering coupon code
    //input: Coupon Code
    getDiscount: function (data, callback) {
        console.log("in getDiscount", data);
        var percentage = {};
        var perDiscount = {};
        var discount = {};
        var discountOnCoupon = {};
        var todayDate = new Date();
        var one_day = 1000 * 60 * 60 * 24;
        NormalCoupon.findOne({
            code: data.couponCode
        }).exec(function (err, coupon) {
            console.log("in coupon", coupon)
            if (err) {
                callback(null, err);
            } else if (_.isEmpty(coupon)) {
                callback(null, false);
            } else {
                if (todayDate >= coupon.startDate && todayDate <= coupon.endDate) {
                    if (coupon.couponType == 'Percentage') {
                        percentage = coupon.percentage / 100;
                        discountOnCoupon.perDiscount = data.subTotal * (percentage);
                        if (discountOnCoupon.perDiscount > coupon.maxAmount) {
                            discountOnCoupon.perDiscount = coupon.maxAmount;
                            discountOnCoupon.discount = data.subTotal - coupon.maxAmount
                        } else {
                            discountOnCoupon.discount = data.subTotal - discountOnCoupon.perDiscount;
                        };
                        callback(null, discountOnCoupon);
                    } else {
                        discountOnCoupon.perDiscount = coupon.amount;
                        discountOnCoupon.discount = data.subTotal - coupon.amount;
                        callback(null, discountOnCoupon);
                    }
                } else {
                    callback(null, "coupon has expired");
                }
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);