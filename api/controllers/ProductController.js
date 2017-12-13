module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    excelUpload: function (req, res) {
        if (req.body)
            Product.excelUpload(req.body, res.callback);
        else
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
    },

    getProducts: function (req, res) {
        if (req.body) {
            Product.getAllProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getProductDetails: function (req, res) {
        if (req.body) {
            Product.getProductDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },

    getEnabledProducts: function (req, res) {
        if (req.body) {
            Product.getEnabledProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getNewArrivals: function (req, res) {
        Product.getNewArrivals(res.callback);
    },

    getFeatured: function (req, res) {
        Product.getFeatured(res.callback);
    },

    getProductsWithCategory: function (req, res) {
        if (req.body) {
            Product.getProductsWithCategory(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getFiltersWithCategory: function (req, res) {
        if (req.body) {
            Product.getFiltersWithCategory(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getProductsWithFilters: function (req, res) {
        if (req.body) {

            Product.getProductsWithFilters(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getSKUWithParameter: function (req, res) {
        if (req.body) {
            Product.getSKUWithParameter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getProductWithId: function (req, res) {
        if (req.body) {
            Product.getProductWithId(req.params.id, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getUniqueProducts: function (req, res) {
        Product.getUniqueProducts(res.callback);
    },

    globalSearch: function (req, res) {
        if (req.body) {
            Product.globalSearch(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },

    searchWithFilters: function (req, res) {
        if (req.body) {
            Product.searchWithFilters(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },
    productWithCategory: function (req, res) {
        if (req.body) {
            Product.productWithCategory(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },

    cloneProduct: function (req, res) {
        if (req.body) {
            Product.cloneProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },

    subtractQuantity: function (req, res) {
        if (req.body) {
            Product.subtractQuantity(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },
    /**
     * for get all products by SKU and set he productId in discount 
     */
    getProductAccordingSku: function (req, res) {
        if (req.body) {
            Product.getProductAccordingSku(req.body.skuOfProducts, req.body._id, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);