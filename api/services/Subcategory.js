var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    //urlSlug: String,
    imgLink: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: String
});

schema.plugin(deepPopulate, {
    populate: {
        category: {
            select: "name"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Subcategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category", "category"));
var model = {};
module.exports = _.assign(module.exports, exports, model);