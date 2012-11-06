// sample is many-to-many with measurement.
// create a go-between "Condition" for that relationship.
var Model = require('./relational_model.js');

Sample = Model.extend({
	relations: [
		{
			type: 'HasMany',
			key:'condition',
			relatedModel: 'Condition',
			reverseRelation: {
				key:'sample'
			}	
		}
	]
});