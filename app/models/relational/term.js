//Term Model

var RelationalModel = require('./relational_model.js');
var Condition = require('./condition.js');
var FeatureLabel = require('./featurelabel.js');

var LiteratureTag = require('./literatureTag.js');

Term = Backbone.RelationalModel.extend({
	subModelTypes: {
			'condition' : 'Condition',
			'feature_label' : 'FeatureLabel'
	}
	relations: [
			type: 'hasMany',
			key : 'LiteratureTags',
			relatedModel : 'LiteratureTag',
			reverseRelation : {
				key : 'term'
			}
	]
});