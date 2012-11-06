//Association model

// json: {
//	      feature1: (Feature Model JSON) 
//	      feature2: (Feature Model JSON)
//		  directed: Boolean
//		  values: [
// 					assoc_value1: val,
// 					...
// 					]
// 		}

var Model = require('./relational_model.js')

Association = Model.extend({
 defaults: {
        feature1: new Feature(),
        feature2: new Feature(),
        values:[],
        directed : false
    },

    target : function() {
    	return directed ? 
    		 			 feature2 : 
    		 			 null ;
    },

    source : function() {
    	return directed ? 
    					 features1 :
    					 null;
    },

    features : function() {
    	return [feature1, feature2];
    },

    values : function() {
    	return this.get('values');
    }

});