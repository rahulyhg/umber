var schema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        excel: {
            name: "Name"
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    generatedOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    usedOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        enum: ['Used', 'unUsed'],
        default: 'unUsed'
    },
    isActive: {
        type: String,
        enum: ['True', 'False'],
        default: 'True'
    },
    startDate: Date,
    endDate: Date,
    couponType: {
        type: String,
        enum: ['Festival', 'Discount']
    },
    valueType: {
        type: String,
        enum: ['Percentage', 'Amount']
    },
    percentage: Number,
    cAmount: Number,
    maxAmount: Number
});

schema.plugin(deepPopulate, {
    Populate: {
        'generatedOrderId': {
            select: '_id name'
        },
        'usedOrderId': {
            select: '_id name'
        },
        'user': {
            select: '_id firstName'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Coupon', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "generatedOrderId usedOrderId user", "generatedOrderId usedOrderId user"));
var model = {
    // get coupon information 
    // input coupon name
    getCoupon: function (data, callback) {
        Coupon.findOne({
            name: data.couponCode
        }).exec(function (err, coupon) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(coupon)) {
                    callback(null, "Coupon Invalid");
                } else {
                    var percentage = {};
                    var perDiscount = {};
                    var discount = {};
                    var discountOnCoupon = {};
                    var todayDate = new Date();
                    var one_day = 1000 * 60 * 60 * 24;
                    if ((todayDate >= coupon.startDate && todayDate <= coupon.endDate) && coupon.isActive) {
                        if (coupon.couponType == 'Festival') {
                            if (coupon.valueType == 'Percentage') {
                                discount._id = coupon._id;
                                discount.name = coupon.name;
                                discount.user = coupon.user;
                                discount.usedOrderId = coupon.usedOrderId;
                                discount.generatedOrderId = coupon.generatedOrderId;
                                discount.usedOrderId = coupon.usedOrderId;
                                discount.percentage = coupon.percentage;
                                discount.maxAmount = coupon.maxAmount;
                                callback(null, discount);
                            } else {
                                discount._id = coupon._id;
                                discount.name = coupon.name;
                                discount.user = coupon.user;
                                discount.usedOrderId = coupon.usedOrderId;
                                discount.generatedOrderId = coupon.generatedOrderId;
                                discount.usedOrderId = coupon.usedOrderId;
                                discount.cAmount = coupon.cAmount;
                                callback(null, discount);
                            }
                        } else {
                            if (coupon.status == "unUsed") {
                                if (coupon.valueType == 'Percentage') {
                                    discount._id = coupon._id;
                                    discount.name = coupon.name;
                                    discount.user = coupon.user;
                                    discount.usedOrderId = coupon.usedOrderId;
                                    discount.generatedOrderId = coupon.generatedOrderId;
                                    discount.usedOrderId = coupon.usedOrderId;
                                    discount.percentage = coupon.percentage;
                                    discount.maxAmount = coupon.maxAmount;
                                    callback(null, discount);
                                } else {
                                    discount._id = coupon._id;
                                    discount.name = coupon.name;
                                    discount.user = coupon.user;
                                    discount.couponType = coupon.couponType;
                                    discount.generatedOrderId = coupon.generatedOrderId;
                                    discount.usedOrderId = coupon.usedOrderId;
                                    discount.cAmount = coupon.cAmount;
                                    console.log("discount", discount)
                                    callback(null, discount);
                                }
                            } else {
                                callback(null, "coupon already Used");
                            }
                        }
                    } else {
                        callback(null, "coupon has expired");
                    }

                }
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);