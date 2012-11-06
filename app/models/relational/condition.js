//Condition 
//cancer type, disease, etc.

var RelationalModel = require('./relational_model.js');
modules.export= RelationalModel.extend({
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