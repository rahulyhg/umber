module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledSubcategories: function (req, res) {
        Category.getEnabledSubcategories(res.callback);
    }
};
module.exports = _.assign(module.exports, controller);
