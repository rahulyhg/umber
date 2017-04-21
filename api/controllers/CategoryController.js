module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledCategories: function (req, res) {
        if (req.body)
            Category.getEnabledCategories(req.body, res.callback);
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
