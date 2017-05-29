module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledCategories: function (req, res) {
        Category.getEnabledCategories(res.callback);
    }
};
module.exports = _.assign(module.exports, controller);
