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
    skuOfProducts: String,
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

    discountsParticularProduct: function (data, callback) {
        Discount.aggregate([{
            $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true
            }
        }, {
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
                'products._id': ObjectId(data._id)

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
                "xValue": {
                    $first: '$xValue'
                },
                "yValue": {
                    $first: '$yValue'
                },
                "discountType": {
                    $first: '$discountType'
                },
                "products": {
                    $first: '$products'
                }
            }
        }, {
            $lookup: {
                "from": "discounttypes",
                "localField": "discountType",
                "foreignField": "_id",
                "as": "discounttypes"
            }
        }, {
            $unwind: {
                path: "$discounttypes",
                preserveNullAndEmptyArrays: true
            }
        }], function (err, result) {
            if (err) {
                callback(err, null);
            } else {
                // console.log("last result######################", result); // OUTPUT OK
                callback(null, result);
            }
        })
    },


    applicableDiscounts: function (data, callback) {
        var convertedArray = [];
        async.waterfall([
                function (callback) {
                    _.forEach(data.productIds, function (n, key) {
                        var convertedId = ObjectId(n);
                        // console.log("type ",typeof(convertedId));
                        // var changedId="ObjectId("+n+")";
                        convertedArray.push(convertedId);

                        // console.log(n, key);
                    });
                    callback(null, convertedArray);
                },
                function (convertedArray, callback) {
                    Discount.aggregate([{
                        $unwind: {
                            path: '$products',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
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
                            "xValue": {
                                $first: '$xValue'
                            },
                            "yValue": {
                                $first: '$yValue'
                            },
                            "discountType": {
                                $first: '$discountType'
                            },
                            "products": {
                                $first: '$products'
                            }
                        }
                    }, {
                        $lookup: {
                            "from": "discounttypes",
                            "localField": "discountType",
                            "foreignField": "_id",
                            "as": "discounttypes"
                        }
                    }, {
                        $unwind: {
                            path: "$discounttypes",
                            preserveNullAndEmptyArrays: true
                        }
                    }], function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            console.log("last result", result); // OUTPUT OK
                            callback(null, result);
                        }
                    });
                }
            ],
            function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
                // result now equals 'done' 
            });

        // var allProductsIds=

        // console.log(convertedArray);
        // callback(null, convertedArray);

    },


    getDiscountProducts: function (data, callback) {
        console.log("Inside getDiscountProducts service", data);

        Discount.aggregate([{
            $unwind: {
                path: '$products',
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $lookup: {
                "from": "products",
                "localField": "products",
                "foreignField": "_id",
                "as": "productsData"
            }
        }, {
            $group: {
                _id: "$products",
                products: {
                    $first: "$productsData"
                }
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