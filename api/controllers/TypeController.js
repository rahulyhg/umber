module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledTypes: function (req, res) {
        if (req.body) {
            BaseColor.getEnabledTypes(req.body, res.callback);
        } else {
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
