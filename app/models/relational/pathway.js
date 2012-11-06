var RelationalModel = require('./relational_model.js');
var PathwayLabelInstance = require('./pathwaylabelinstance.js')

//Pathway
module.exports = RelationalModel.extend({
		relations: [
			{
				type : 'HasMany',
				key : 'pathway_label_instance',
				relatedModel: 'PathwayLabelInstance',
				reverseRelation: {
					key: 'pathway'
				}
			}
		]
});

