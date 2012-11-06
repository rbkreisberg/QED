var RelationalModel = require('./relational_model.js');
var PathwayFeaturelabelInstance = require('./relational/pathwaylabelinstance.js')

//Pathway
//Pathway is many FeatureLabels.

module.exports = RelationalModel.extend({
		relations: [
			{
				type : 'HasMany',
				key : 'pathway_featurelabel_instance',
				relatedModel: 'PathwayFeaturelabelInstance',
				reverseRelation: {
					key: 'pathway'
				}
			}
		]
});

