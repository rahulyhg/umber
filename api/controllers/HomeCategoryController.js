module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledCategories: function (req, res) {
        if (req.body)
            HomeCategory.getEnabledCategories(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getIdByNameForCategory: function (req, res) {
        if (req.body)
            HomeCategory.getIdByNameForCategory(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getCategoryWithId: function (req, res) {
        if (req.body)
            HomeCategory.getCategoryWithId(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getCategoryBySlug: function (req, res) {
        if (req.body)
            HomeCategory.getCategoryBySlug(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getCategoryByName: function (req, res) {
        if (req.body) {
            HomeCategory.getCategoryByName(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);