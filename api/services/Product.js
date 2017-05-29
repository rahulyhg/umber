// Fields fabric, type, baseColor are converted 
// into separate schemas for ease of query & retrieval.
var schema = new Schema({
    name: {
        type: String
    },
    // This will be same for the same product
    // regardless of size, color
    productId: {
        type: String,
        index: true
    },
    // This will be like full sleeve in Men's shirt
    // Categories on home page are different
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'Type'
    }],
    featured: Boolean,
    newArrival: Boolean,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    prodCollection: [{
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    }],
    sleeve: {
        type: String,
        enum: ["Half sleeve", "Full sleeve"]
    },
    //TODO: Will the fabric & basecolor be multiple?
    fabric: [{
        type: Schema.Types.ObjectId,
        ref: 'Fabric'
    }],
    washcare: String,
    description: String,
    // Should be unique to identify individual product
    skuId: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    quantity: Number,
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size'
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'BaseColor'
    },
    price: Number,
    images: [{
        image: String,
        order: Number
    }],
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

// Select required fields
schema.plugin(deepPopulate, {
    populate: {
        'category': {
            select: "name"
        },
        'brand': {
            select: "name"
        },
        'prodCollection': {
            select: "name"
        },
        'fabric': {
            select: "name"
        },
        'type': {
            select: "name"
        },
        'color': {
            select: "name"
        },
        'size': {
            select: "name"
        }
    }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category brand prodCollection fabric type color size",
    "category brand prodCollection fabric type color size"));
var model = {
    getAllSKUsWithProductId: function (data, callback) {
        Product.find({
            productId: data.productId
        }).exec(function (err, SKUs) {
            callback(err, SKUs);
        });
    },

    getProductSizesWithProductId: function (data, callback) {
        Product.distinct("size", {
            productId: data.productId
        }).exec(function (err, sizes) {
            callback(err, sizes);
        })
    },

    getProductColorsWithProductId: function (data, callback) {
        Product.distinct("color", {
            productId: data.productId
        }).exec(function (err, sizes) {
            callback(err, sizes);
        })
    },

    // Get the common product details with 
    // SKU specific details like sizes, colors
    getProductDetails: function (data, callback) {

        async.waterfall([
            function commonDetails(cbWaterfall1) {
                Product.findOne({
                    productId: data.productId,
                    name: {
                        $exists: true
                    },
                    category: {
                        $exists: true
                    },
                    brand: {
                        $exists: true
                    },
                    prodCollection: {
                        $exists: true
                    },
                    type: {
                        $exists: true
                    },
                    fabric: {
                        $exists: true
                    },
                    washcare: {
                        $exists: true
                    },
                    description: {
                        $exists: true
                    }
                }).lean().exec(cbWaterfall1);
            },
            function getSizes(product, cbWaterfall2) {
                Product.distinct("size", {
                    productId: product.productId
                }).lean().exec(function (err, prodSizes) {
                    Size.find({
                        _id: {
                            '$in': prodSizes
                        }
                    }).exec(function (err, sizesDetails) {
                        product.sizes = sizesDetails.slice();
                        cbWaterfall2(err, product);
                    });
                });
            },
            function getColors(product, cbWaterfall3) {
                Product.distinct("color", {
                    productId: product.productId
                }).lean().exec(function (err, prodColors) {
                    BaseColor.find({
                        _id: {
                            '$in': prodColors
                        }
                    }).exec(function (err, colorsDetails) {
                        product.colors = colorsDetails.slice();
                        cbWaterfall3(err, product);
                    });
                });
            }
        ], function (err, productDetails) {
            callback(err, productDetails);
        });
    },

    // This function will retrieve all the unique products with available details
    // req-> {category: category._id}
    getProductsWithCategory: function (data, callback) {
        async.waterfall([
            // Gets all the unique product ids related to the category
            function getCategoryProducts(callback1) {
                Product.aggregate([{
                        $match: {
                            category: mongoose.Types.ObjectId(data.category)
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: "$productId"
                        }
                    },
                    {
                        $project: {
                            productId: '$_id'
                        }
                    }
                ]).skip((data.page - 1) * Config.maxRow).limit(Config.maxRow).exec(callback1);
            },
            // Retrieve one document containing all the detail based on productId.
            function getDetailsOfProducts(categoryProducts, callback2) {
                var consolidatedProducts = [];
                async.each(categoryProducts, function (product, eachCallback) {
                    Product.getProductDetails(product, function (err, productDetails) {
                        if (!_.isEmpty(productDetails))
                            consolidatedProducts.push(productDetails);
                        eachCallback(err, productDetails);
                    });
                }, function (err1) {
                    callback2(err1, consolidatedProducts);
                });
            },
        ], function (err, products) {
            callback(err, products);
        });
    },

    getAllProducts: function (data, callback) {
        Product.find({}).exec(function (error, data) {
            if (error) {
                callback(error, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        });
    },

    getEnabledProducts: function (data, callback) {
        Product.find({
            status: 'Enabled'
        }).deepPopulate("category brand prodCollection fabric type color size").exec(function (error, data) {
            if (error) {
                callback(error, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        });
    },

    getNewArrivals: function (callback) {
        async.waterfall([
            function (callback1) {
                Product.aggregate([{
                    $group: {
                        _id: '$productId'
                    }
                }]).exec(function (err, products) {
                    callback1(err, products);
                });
            },
            function (products, callback2) {
                var newArrivals = [];
                async.each(products, function (product, eachCallback) {
                    Product.findOne({
                        productId: product._id,
                        newArrival: true
                    }).exec(function (err, product) {
                        if (!_.isEmpty(product))
                            newArrivals.push(product);
                        eachCallback(err, product);
                    });
                }, function (err) {
                    callback2(err, newArrivals);
                });
            }
        ], function (err, results) {
            callback(err, results);
        });
    },

    getFeatured: function (callback) {
        async.waterfall([
            function (callback1) {
                Product.aggregate([{
                    $group: {
                        _id: '$productId'
                    }
                }]).exec(function (err, products) {
                    callback1(err, products);
                });
            },
            function (products, callback2) {
                var featureds = [];
                async.each(products, function (product, eachCallback) {
                    Product.findOne({
                        productId: product._id,
                        newArrival: true
                    }).exec(function (err, product) {
                        if (!_.isEmpty(product))
                            featureds.push(product);
                        eachCallback(err, product);
                    });
                }, function (err) {
                    callback2(err, featureds);
                });
            }
        ], function (err, results) {
            callback(err, results);
        });
    },

    getProductWithId: function (data, callback) {
        Product.findOne({
            _id: mongoose.Types.ObjectId(data.id)
        }).deepPopulate('category brand prodCollection fabric type color size').exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials!"
                }, null);
            }
        });
    },

    isProductAvailable: function (product, callback) {
        Product.findOne({
            _id: mongoose.Types.ObjectId(product._id)
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                if (product.reqQuatity <= product.quantity)
                    callback(null, data);
                else
                    callback(null, {});
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    },

    updateProductQuantity: function (product, count, callback) {
        Product.findOne({
            _id: product._id
        }).exec(function (err, data) {
            data.quantity += count;
            Product.saveData(data, function (err, data) {
                if (err) {
                    callback(err, null);
                } else if (data) {
                    callback(null, data);
                } else {
                    callback({
                        message: {
                            data: "Invalid credentials!"
                        }
                    }, null);
                }
            })
        });
    }
};
module.exports = _.assign(module.exports, exports, model);