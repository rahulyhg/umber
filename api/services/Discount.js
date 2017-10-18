var schema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        excel: {
            name: "Name"
        }
    },
    xValue: Number,
    yValue: Number,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    gifts: [{
        photo: {
            type: String
        },
        name: String,
        description: String
    }],
    amount: Number,
    percent: Number,
    minAmount: Number,
    maxDiscountAmount: Number,
    discountType: {
        type: Schema.Types.ObjectId,
        ref: 'DiscountType'
    }
});

schema.plugin(deepPopulate, {
    Populate: {
        'products': {
            select: '_id name'
        },
        'discountType': {
            select: '_id name'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Discount', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "products discountType", "products discountType"));
var model = {

    applicableDiscounts: function (data, callback) {
        console.log("Insode applicableDiscounts service", data.productIds);
        // var allProductsIds=
        var convertedArray=[];
        _.forEach(data.productIds, function (n, key) {
            var convertedId=ObjectId(n);
            // console.log("type ",typeof(convertedId));
            // var changedId="ObjectId("+n+")";
            convertedArray.push(convertedId);
            // console.log(n, key);
        });
        // console.log(convertedArray);
        // callback(null, convertedArray);
        Discount.aggregate([{
            $lookup: {
                "from": "products",
                "localField": "products",
                "foreignField": "_id",
                "as": "products"
            }
        }, {
            $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $match: {
                'products._id': {
                    $in: convertedArray
                }
            }
        }, {
            $group: {
                _id: "$_id",
                "createdAt": {
                    $first: '$createdAt'
                },
                "updatedAt": {
                    $first: '$updatedAt'
                },
                "name": {
                    $first: '$name'
                },
                "amount": {
                    $first: '$amount'
                },
                "minAmount": {
                    $first: '$minAmount'
                },
                "gifts": {
                    $first: '$gifts'
                },
                "maxDiscountAmount": {
                    $first: '$maxDiscountAmount'
                },
                "percent": {
                    $first: '$percent'
                },
                "variables": {
                    $first: '$variables'
                },
                "discountType": {
                    $first: '$discountType'
                }
            }
        },{
            $lookup: {
                    "from" : "discounttypes",
                    "localField" : "discountType",
                    "foreignField" : "_id",
                    "as" : "discounttypes"
            }
        }, {
            $unwind: {
                path : "$discounttypes",
                preserveNullAndEmptyArrays : true
            }
        }], function (err, result) {
            if (err) {
                callback(err);
            } else {
                console.log("last result", result); // OUTPUT OK
                callback(null, result);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);