//Dataset

//A dataset is a collection of measurements, as fetched from the server side

var RelationalModel = require('./relational_model.js');

var Measurement = require('./measurement.js');

module.exports = RelationalModel.extend({
	relations: [
		{
			type: 'HasMany',
			key:'measurement',
			relatedModel: 'Measurement',
			reverseRelation: {
				key:'dataset'
			}	
		}
	]
});

