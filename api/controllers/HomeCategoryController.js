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
    }
};
module.exports = _.assign(module.exports, controller);