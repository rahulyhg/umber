module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getBrands: function (req, res) {
        Brand.getBrands(res.callback);
    }

};
module.exports = _.assign(module.exports, controller);