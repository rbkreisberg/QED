var View = require('./view');
var template = require('./templates/graph_list');
var GraphList = require('../models/old/graphList');

module.exports = View.extend({

  tagName: 'div',
  model: new GraphList,
  
  getRenderData : function() { },

  afterRender: function() {}

});
