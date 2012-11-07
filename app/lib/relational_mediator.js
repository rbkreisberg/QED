//RelationalMediator

Backbone.RelationalMediator = (function(Backbone, _){
  "use strict";

	this.binder = new Backbone.EventBinder();
	this.models = new Array();

   // Constructor function
  var RelationalMediator = function(){
    this._eventBindings = [];
  };

  // Copy the `extend` function used by Backbone's classes
  RelationalMediator.extend = Backbone.View.extend;

  // Extend the RelatinalMediator with additional methods
  _.extend(RelationalMediator.prototype, {

    //identify the general data type 
    identifyFeatureType: function(/* args... */) {
     
     return null;
    },

    addModel  :function(model,) {
		var feature_type;
		if (feature_type = this.identifyFeatureType())

		this.binder.bindTo('destroy', function())
	},

	addCollection  : function(models){

	}
   
  });

  return RelationalMediator;
})(Backbone, _);


//Pathways is many FeatureLabels.
//FeatureLabel is something like TP53.  It can map to many Features.  It can map to many Pathways
//Feature is something like C:GEXP:TP53:chrX:start:stop:strand
//Measurement is the instance of a feature for a particular dataset, 
//Condition describes the unique condition/disease of the measurement
//SampleMeasurement is one sample measurement for one feature for a unique condition.

//Association is a pair of measurements with a set of associated values describing the association

//AssociationList is a collection of Associations
//MeasurementList is a collection of Measurements
