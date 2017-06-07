// Fields fabric, type, baseColor are converted 
// into separate schemas for ease of query & retrieval.
var schema = new Schema({
    // This is SKU no
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    // This will be same for the same product
    // regardless of size, color
    // LOTNO
    productId: {
        type: String,
        index: true
    },
    // Main categories
    homeCategory: {
        type: Schema.Types.ObjectId,
        ref: 'HomeCategory'
    },
    // This will be like full sleeve in Men's shirt
    // Categories on home page are different
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Type'
    },
    featured: Boolean,
    newArrival: Boolean,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    prodCollection: {
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    },
    // Sleeve /trouser style
    style: String,
    styleNo: String,
    fabric: {
        type: Schema.Types.ObjectId,
        ref: 'Fabric'
    },
    washcare: String,
    description: String,
    productName: String,
    productCode: String,
    quantity: Number,
    ratings: Number,
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
        'homeCategory': {
            select: "name"
        },
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "homeCategory category brand prodCollection fabric type color size",
    "homeCategory category brand prodCollection fabric type color size"));
var model = {
    manageForeignKey: function (model, data, callback) {
        model.getIdByName(data, function (err, id) {
            if (id)
                callback(null, id);
            else if (err.code == 11000)
                Product.manageForeignKey(model, data, callback);
            else
                callback(err, null);
        });
    },

    excelUpload: function (data, callback) {
        var filename = data.file;
        var retVal = [];
        Config.importGS(filename, function (err, data) {
            var i = 1;
            async.eachSeries(data, function (product, complete) {
                if (_.isEmpty(product.SKU)) {
                    complete({
                        "message": "No product SKU found"
                    }, null);
                } else {
                    async.waterfall([
                        function UpdateNormalFields(cbWaterfall1) {
                            var newProduct = {};
                            newProduct.images = [];
                            newProduct.name = product.SKU;
                            if (product.DESCRIPTION) {
                                newProduct.productName = product.DESCRIPTION;
                                newProduct.description = product.DESCRIPTION;
                            }

                            if (product.LOTNO)
                                newProduct.productId = product.LOTNO;

                            if (product.Featured)
                                newProduct.featured = product.Featured;

                            if (product.NewArrival)
                                newProduct.newArrival = product.NewArrival;

                            if (product.STYLE1)
                                newProduct.style = product.STYLE1;

                            if (product.STYLENO)
                                newProduct.styleNo = product.STYLENO;

                            if (product.Washcare)
                                newProduct.washcare = product.Washcare;

                            if (product['STOCK QTY'])
                                newProduct.quantity = product['STOCK QTY'];

                            if (product.price)
                                newProduct.price = product.price;

                            if (product.productCode)
                                newProduct.productCode = product.productCode;
                            if (product.image1)
                                newProduct.images.push({
                                    image: product.image1,
                                    order: 1
                                });
                            if (product.image2)
                                newProduct.images.push({
                                    image: product.image2,
                                    order: 2
                                });
                            if (product.image3)
                                newProduct.images.push({
                                    image: product.image3,
                                    order: 3
                                });
                            if (product.IMAGE4)
                                newProduct.images.push({
                                    image: product.IMAGE4,
                                    order: 4
                                });
                            cbWaterfall1(null, newProduct);
                        },
                        function UpdateCategory(newProduct, cbWaterfall2) {
                            console.log(newProduct);
                            if (product.Category) {
                                Product.manageForeignKey(HomeCategory, {
                                    name: product.Category
                                }, function (err, id) {
                                    newProduct.homeCategory = id;
                                    if (product.Subcategory) {
                                        Product.manageForeignKey(Category, {
                                            name: product.Subcategory,
                                            category: newProduct.homeCategory
                                        }, function (err, id) {
                                            newProduct.category = id;
                                            cbWaterfall2(err, newProduct);
                                        });
                                    } else {
                                        cbWaterfall2(err, newProduct);
                                    }
                                });
                            } else {
                                cbWaterfall2(null, newProduct);
                            }
                        },
                        function UpdateType(newProduct, cbWaterfall3) {
                            if (product.Type) {
                                Product.manageForeignKey(Type, {
                                    name: product.Type
                                }, function (err, id) {
                                    newProduct.type = id;
                                    cbWaterfall3(err, newProduct);
                                });
                            } else {
                                cbWaterfall3(null, newProduct);
                            }
                        },
                        function UpdateBrand(newProduct, cbWaterfall4) {
                            if (product.Brand) {
                                Product.manageForeignKey(Brand, {
                                    name: product.Brand
                                }, function (err, id) {
                                    newProduct.brand = id;
                                    cbWaterfall4(err, newProduct);
                                });
                            } else {
                                cbWaterfall4(null, newProduct);
                            }
                        },
                        function UpdateCollection(newProduct, cbWaterfall5) {
                            if (product.COLLECTION) {
                                Product.manageForeignKey(Collection, {
                                    name: product.COLLECTION
                                }, function (err, id) {
                                    newProduct.prodCollection = id;
                                    cbWaterfall5(err, newProduct);
                                });
                            } else {
                                cbWaterfall5(null, newProduct);
                            }
                        },
                        function UpdateFabric(newProduct, cbWaterfall6) {
                            if (product.Fabric) {
                                Product.manageForeignKey(Fabric, {
                                    name: product.Fabric
                                }, function (err, id) {
                                    newProduct.fabric = id;
                                    cbWaterfall6(err, newProduct);
                                });
                            } else {
                                cbWaterfall6(null, newProduct);
                            }
                        },
                        function UpdateColor(newProduct, cbWaterfall7) {
                            if (product.COLOR) {
                                Product.manageForeignKey(BaseColor, {
                                    name: product.COLOR,
                                    code: product.ColorCode
                                }, function (err, id) {
                                    newProduct.color = id;
                                    cbWaterfall7(err, newProduct);
                                });
                            } else {
                                cbWaterfall7(null, newProduct);
                            }
                        },
                        function UpdateSize(newProduct, cbWaterfall8) {
                            if (product.SIZE) {
                                Product.manageForeignKey(Size, {
                                    name: product.SIZE,
                                    description: product['Attribute Garment Size']
                                }, function (err, id) {
                                    newProduct.size = id;
                                    cbWaterfall8(err, newProduct);
                                });
                            } else {
                                cbWaterfall8(null, newProduct);
                            }
                        },
                        function (newProduct, cbWaterfall9) {
                            Product.getIdByName(newProduct, function (err, data) {
                                if (err) {
                                    cbWaterfall9(err, null);
                                } else {
                                    Product.findOneAndUpdate({
                                        _id: data
                                    }, newProduct, {
                                        upsert: true,
                                        new: true
                                    }, function (err, data) {
                                        if (err) {
                                            cbWaterfall9(err, null);
                                        } else {
                                            cbWaterfall9(null, data);
                                        }

                                    });
                                }

                            });
                        }
                    ], function (err, newProduct) { // waterfall callback
                        if (err) {
                            retVal.push(err);

                        } else {
                            retVal.push(newProduct._id);
                        }
                        complete(err, retVal);
                    });
                }
            }, function (err, data) {
                if (err)
                    console.log("async error: ", err);
                callback(null, {
                    total: retVal.length,
                    value: retVal
                });
            });
        });
    },

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
    // Each product id is related with color
    // so no need to get color externally
    // SKU specific details like sizes
    getProductDetails: function (data, callback) {
        async.waterfall([
                // Color is fetched from this record only
                function commonDetails(cbWaterfall1) {
                    Product.findOne({
                        productId: data.productId,
                        name: {
                            $exists: true
                        },
                        category: {
                            $exists: true
                        } //,
                        // brand: {
                        //     $exists: true
                        // },
                        // prodCollection: {
                        //     $exists: true
                        // },
                        // type: {
                        //     $exists: true
                        // },
                        // fabric: {
                        //     $exists: true
                        // },
                        // washcare: {
                        //     $exists: true
                        // },
                        // description: {
                        //     $exists: true
                        // }
                    }).deepPopulate("prodCollection brand fabric color type category").lean().exec(cbWaterfall1);
                },
                function getSizes(product, cbWaterfall2) {
                    if (product) {
                        Product.distinct("size", {
                            productId: product.productId
                        }).lean().exec(function (err, prodSizes) {
                            Size.find({
                                _id: {
                                    '$in': prodSizes
                                }
                            }).sort("name").exec(function (err, sizesDetails) {
                                product.sizes = sizesDetails.slice();
                                cbWaterfall2(err, product);
                            });
                        });
                    } else {
                        cbWaterfall2({
                            message: "Product not found"
                        }, null);
                    }
                },
                function getMinPrice(product, cbWaterfall4) {
                    Product.aggregate([{
                        $group: {
                            _id: product.productId,
                            minPrice: {
                                $min: '$price'
                            }
                        }
                    }]).exec(function (err, price) {
                        console.log(price);
                        product.minPrice = price;
                        cbWaterfall4(err, product);
                    });
                }
            ],
            function (err, productDetails) {
                callback(err, productDetails);
            });
    },

    // For listing page
    // This function will retrieve products grouped by product id and 
    // with available details
    // req-> {category: category._id}
    getProductsWithCategory: function (data, callback) {
        async.waterfall([
            // Gets all the unique product ids related to the category
            function getCategoryProducts(callback1) {
                var pipeline = [];
                // If category filter is applied
                if (data.category)
                    pipeline.push({
                        $match: {
                            category: mongoose.Types.ObjectId(data.category)
                        }
                    });
                // Get products sorted on creation date
                pipeline.push({
                    $sort: {
                        createdAt: -1
                    }
                });
                // Get unique products
                pipeline.push({
                    $group: {
                        _id: "$productId"
                    }
                });
                pipeline.push({
                    $project: {
                        productId: '$_id'
                    }
                });
                Product.aggregate(pipeline).skip((data.page - 1) * Config.maxRow).limit(Config.maxRow).exec(callback1);
            },
            // Retrieve one document containing all the detail based on product id.
            // for individual page
            function getDetailsOfProducts(categoryProducts, callback2) {
                var consolidatedProducts = [];
                async.each(categoryProducts, function (product, eachCallback) {
                    Product.getProductDetails(product, function (err, productDetails) {
                        if (!_.isEmpty(productDetails))
                            consolidatedProducts.push(productDetails);
                        eachCallback(null, productDetails);
                    });
                }, function (err1) {
                    callback2(null, consolidatedProducts);
                });
            },
        ], function (err, products) {
            callback(null, products);
        });
    },

    // Function to retrieve specific SKU with specified parameters
    // Parameters include color, size
    getSKUWithParameter: function (data, callback) {
        Product.findOne({
            productId: data.productId,
            size: data.size,
            color: data.color
        }).exec(callback);
    },

    // Function to retrieve filters on listing page
    // req -> {category: category._id}
    getFiltersWithCategory: function (data, callback) {
        var match = {
            category: mongoose.Types.ObjectId(data.category)
        };
        async.parallel({
                types: function (cbParallel1) {
                    Product.distinct("type", match).exec(function (err, types) {
                        Type.find({
                            _id: {
                                $in: types
                            }
                        }).sort("name").exec(cbParallel1);
                    });
                },
                collections: function (cbParallel2) {
                    Product.distinct("prodCollection", match).exec(function (err, collections) {
                        Collection.find({
                            _id: {
                                $in: collections
                            }
                        }).sort("name").exec(cbParallel2);
                    });
                },
                sizes: function (cbParallel3) {
                    Product.distinct("size", match).exec(function (err, sizes) {
                        Size.find({
                            _id: {
                                $in: sizes
                            }
                        }).sort("name").exec(cbParallel3);
                    });
                },
                colors: function (cbParallel4) {
                    Product.distinct("color", match).exec(function (err, colors) {
                        BaseColor.find({
                            _id: {
                                $in: colors
                            }
                        }).sort("name").exec(cbParallel4);
                    });
                },
                fabrics: function (cbParallel5) {
                    Product.distinct("fabric", match).exec(function (err, fabrics) {
                        Fabric.find({
                            _id: {
                                $in: fabrics
                            }
                        }).sort("name").exec(cbParallel5);
                    });
                },
                priceRange: function (cbParallel6) {
                    Product.aggregate([{
                        $match: match
                    }, {
                        $group: {
                            _id: null,
                            min: {
                                $min: '$price'
                            },
                            max: {
                                $max: '$price'
                            }
                        }
                    }]).exec(cbParallel6);
                }
            },
            function (err, filters) {
                callback(err, filters);
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
    },

    // API for backend buy the look
    // Sending only productId field results in error
    // Cannot cast to string. Dashboard returns object {productId: $productId}
    // in case only if productId sent, which it tries to map to string.
    getUniqueProducts: function (callback) {
        async.waterfall([
            function findDistinctProducts(cbWaterfall1) {
                Product.distinct("productId", {
                    status: 'Enabled'
                }).exec(function (err, data) {
                    cbWaterfall1(err, data);
                });
            },
            function getProductDetails(products, cbWaterfall2) {
                var productsDetails = [];
                async.each(products, function (product, callback) {
                    Product.findOne({
                        productId: product
                    }).exec(function (err, productDetails) {
                        productsDetails.push(productDetails);
                        callback(err);
                    });
                }, function (err) {
                    var finalData = {};
                    finalData.results = productsDetails;
                    cbWaterfall2(err, finalData);
                });
            }
        ], function (err, productDetails) {
            callback(err, productDetails);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);