module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledCategories: function (req, res) {
        Category.getEnabledCategories(res.callback);
    },

    getCategoriesWithParent: function (req, res) {
        if (req.body)
            Category.getCategoriesWithParent(req.body, res.callback);
        else
            res.json({
                value: false,
                message: {
                    data: "Invalid request!"
                }
            });
    },

    getCategoryBySlug: function (req, res) {
        if (req.body)
            Category.getCategoryBySlug(req.body, res.callback);
        else
            res.json({
                value: false,
                message: {
                    data: "Invalid request!"
                }
            });
    },

    getCategorySlug: function (req, res) {
        if (req.body)
            Category.getCategorySlug(req.body, res.callback);
        else
            res.json({
                value: false,
                message: {
                    data: "Invalid request!"
                }
            });
    },
    getAllCategories: function (req, res) {
        Category.getAllCategories(res.callback);
    },

    getCategoryByName: function (req, res) {
        if (req.body) {
            Category.getCategoryByName(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request!"
                }
            });
        }
    },
    getIdByNameForCategory: function (req, res) {
        if (req.body)
            Category.getIdByNameForCategory(req.body, res.callback);
        else
            res.json({
                value: false,
                message: {
                    data: "Invalid request!"
                }
            });
    },
};
module.exports = _.assign(module.exports, controller);