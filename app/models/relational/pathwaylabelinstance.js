var RelationalModel = require('./relational_model.js');

//PathwayFeaturelabelInstance Model
module.exports = RelationalModel.extend({
		relations: [
			{
				type : 'HasMany',
				key : 'featurelabel',
				relatedModel: 'FeatureLabel',
				reverseRelation: {
					key: 'pathway_label_instance'
				}
			}
		]
});
