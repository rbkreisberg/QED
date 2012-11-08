// Base class for all models.
module.exports = Backbone.RelationalModel.extend({


select : function(obj) {
	this.trigger('selected',obj);
},

hide : function(obj) {
	this.trigger('hidden',obj);
},

unhide : function(obj) {
	this.trigger('unhidden',obj);
},

change : function(obj) {
	this.trigger('changed',obj);
}

});
