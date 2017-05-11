module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledSizes: function (req, res) {
        console.log(res.callback);
        Size.getEnabledSizes(res.callback);
    }
};
module.exports = _.assign(module.exports, controller);
