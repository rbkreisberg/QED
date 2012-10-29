//RelationalMediator

Feature = Backbone.RelationalModel.extend({
    relations: [
        {
            type: 'HasMany',
            key: 'association',
            relatedModel: 'Association',
            reverseRelation: {
                key: 'feature'
            }
        },
 		{
            type: 'HasMany',
            key: 'measurement',
            relatedModel: 'Measurement',
            reverseRelation: {
                key: 'feature'
            }
        },
		{
            type: 'HasOne',
            key: 'label',
            relatedModel: 'FeatureLabel',
            reverseRelation: {
                key: 'feature'

            }
        }
    ]
});

// A link object between 'Person' and 'Company', to achieve many-to-many relations.
Association = Backbone.RelationalModel.extend({
 defaults: {
        features:[],
        values:[],
        directed : false
    },

    target : function() {
    	return directed ? 
    		 			 features[1] : 
    		 			 null ;
    },

    source : function() {
    	return directed ? 
    					 features[0] :
    					 null;
    },

    features : function() {
    	return this.get('features');
    },

    values : function() {
    	return this.get('values');
    }

});

// sample is many-to-many with measurement.
// create a go-between "MeasurementInstance" for that relationship.
Sample = Backbone.RelationalModel.extend({
	relations: [
		{
			type: 'HasMany',
			key:'measurement_instances',
			relatedModel: 'MeasurementInstance',
			reverseRelation: {
				key:'sample'
			}	
		}
	]
});

MeasurementInstance = Backbone.RelationalModel.extend({

});

Measurement = Backbone.RelationalModel.extend({
	relations: [
		{
			type: 'HasMany',
			key:'measurement_instances',
			relatedModel: 'MeasurementInstance',
			reverseRelation: {
				key:'measurement'
			}	
		}
	]
});

FeatureLabel = Backbone.RelationalModel.extend({
		relations: [
			{
				type : 'HasMany',
				key : 'pathway_label_instance',
				relatedModel: 'PathwayLabelInstance',
				reverseRelation: {
					key: 'label'
				}
			}
		]
});

Pathway = Backbone.RelationalModel.extend({
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

//cancer type, disease, etc.
Condition = Backbone.RelationalModel.extend({
    relations: [
        {
            type: 'HasMany',
            key: 'measurements',
            relatedModel: 'Measurement',
            reverseRelation: {
                key: 'condition'
            }
        }
    ]
});

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
