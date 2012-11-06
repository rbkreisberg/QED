//RelationalMediator

module.exports = function RelationalMediator(){
	var binder = new Backbone.EventBinder();



};

//Pathways is many FeatureLabels.
//FeatureLabel is something like TP53.  It can map to many Features.  It can map to many Pathways
//Feature is something like C:GEXP:TP53:chrX:start:stop:strand
//Measurement is the instance of a feature for a particular dataset, 
//Condition describes the unique condition/disease of the measurement
//SampleMeasurement is one sample measurement for one feature for a unique condition.

//Association is a pair of measurements with a set of associated values describing the association

//AssociationList is a collection of Associations
//MeasurementList is a collection of Measurements


Term = Backbone.RelationalModel.extend({
	subModelTypes: {
			'condition' : 'Condition',
			'feature_label' : 'FeatureLabel'
	}
	relations: [
			type: 'hasMany',
			key : 'LiteratureTags',
			relatedModel : 'Tag',
			reverseRelation : {
				key : 'term'
			}
	]
});

Literature = Backbone.RelationalModel.extend( {
	relations : [
		{
			type:'hasMany',
			key: 'LiteratureTags',
			relatedModel: 'Tag',
			reverseRelation : {
				key : 'literature'
			}
		}
	]
});

// a tag for a particular piece of literature
LiteratureTag = Backbone.RelationalModel.extend({

});
