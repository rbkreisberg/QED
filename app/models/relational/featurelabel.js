var RelationalModel = require('./relational_model.js');

//FeatureLabel 

module.exports = RelationalModel.extend({
		relations: [
			
		],

		initialize: function(options) {
			 this.bind('selected:features',function(obj){

        });
		}
});