//RelationalMediator

Backbone.RelationalMediator = (function(Backbone, _){
  "use strict";

	this.binder = new Backbone.EventBinder();
	this.models = new Backbone.Collection();

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

    addModel  :function(model, feature_type) {
    	var me = this;
		if (_.isUndefined(feature_type)) {
			feature_type = this.identifyFeatureType(model)
		}
		var rel_model = feature_type.findOrCreate(model.toJSON()));
		this.models.add(rel_model);

		me.binder.bindTo(model,'change', function(obj) {
			rel_model.change();
		}, this);

		me.binder.bindTo(model,'selected', function(obj) {
			rel_model.select();
		}, this);

		me.binder.bindTo(model,'hidden', function() {
			rel_model.hide();
		}, this);

		me.binder.bindTo(model,'unhidden', function() {
			rel_model.unhide();
		}, this);

		me.binder.bindTo(model,'destroy', function(){
			rel_model.destroy();
		}, this);
	},

	addCollection  : function(collection){
		var modelType = this.identifyFeatureType(collection.at(0));
		var addModel = function(model) { this.addModel(model,modelType);};
		collection.each(addModel);
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
