// Base class for all models.
module.exports = Backbone.RelationalModel.extend({


triggerRelatedModels : function(type,obj) {
	var relations = this.getRelations();
	_.each(relations, function (rel) { 
		var relatedModels = this.get(rel.key);
		if (relatedModels && relatedModels.length) {// collection
				_.each(relatedModels, function(model) {
					model.trigger(type,obj);
				});
		}
		else {
			relatedModels.trigger(type,obj);
		}
	});
},

select : function(obj) {
	this.triggerRelatedModels('selected',obj);
},

hide : function(obj) {
	this.triggerRelatedModels('hidden',obj);
},

unhide : function(obj) {
	this.triggerRelatedModels('unhidden',obj);
},

change : function(obj) {
	this.triggerRelatedModels('changed',obj);
}

});
