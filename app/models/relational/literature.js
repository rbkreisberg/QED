//Literature
//represents a single piece of literature

var RelationalModel = require('./relational_model.js');
var LiteratureTag = require('./literatureTag.js');

Literature = Backbone.RelationalModel.extend( {
	relations : [
		{
			type:'hasMany',
			key: 'LiteratureTags',
			relatedModel: 'LiteratureTag',
			reverseRelation : {
				key : 'literature'
			}
		}
	]
});