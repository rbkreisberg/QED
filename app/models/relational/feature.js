// Feature Model

//Feature is something like C:GEXP:TP53:chrX:start:stop:strand

var Model = require('./relational_model.js');

Feature = Model.extend({
	// do we differentaite between subtypes of features here?
	// subModelTypeAttribute : 'feature_type'
	// subModelTypes: {
	// 		'genomic' : 'GenomicFeature',
	// 		'clinical': 'ClinicalFeature',
	//		...
	// },
	defaults: {
		id:'',  //eg. C:GEXP:TP53:chr20:987232:14671982:-1:modifier
		genomic: false,
		data_type:null,  //C
		feature_type:null  //GEXP
	},

	label: function() {
		return this.get('label');
	},

	siblings : function() {
		return this.get('label').get('features')
	},

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
                key: 'features',
                type: 'HasMany'
            }
        }
    ],

});