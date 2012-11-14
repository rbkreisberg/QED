var View = require('./view');
var template = require('./templates/branch');
var BranchMatrix = require('../models/branchMatrix');

module.exports = View.extend({

  model:BranchMatrix,
  template:template,

  initialize : function() {
  	_.bindAll(this, 'getRenderData', 'afterRender', 'renderGrid');
  },
  
  getRenderData : function() {},

  afterRender: function() {
  	var _this = this;
    this.$el.addClass('row-fluid');
    //this.model.bind('load',_this.renderGrid);
    this.model.on('load',_this.renderGrid);
  },

  renderGrid : function(){
    var scatdata = this.model.getD3Data();
    var length = scatdata.length;
    var height = 400;
    var width = 1000;
    var x = function(d) {
          return d.r1*(width/length);
      };
    var y = function(d) {
          return d.r2*(height/length);
      };
   
    var colors = ["#D7191C", "#FDAE61", "#FFFFBF", "#ABD9E9", "#2C7BB6"]
    var color = function(d){
        if ( ! colors.hasOwnProperty(d.termcat)){
          console.log("bad color "+ d.termcat);
        }
        return colors[d.termcat];
      };
    console.log("scatter");
    var svg = d3.select(".scat-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
      //.margin({ top: 120, left: 80, bottom: 80, right: 80 });
    
    svg.selectAll("circle")
      .data(scatdata)
      .enter()
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 10)
      .attr("fill",color)
      .attr("stroke",color)
      .style('stroke-opacity',.8)
      .style('fill-opacity',.8);

    svg.selectAll("text")
      .data(scatdata)
      .enter()
      .append("text")
      .text(function(d) {
        return d.n;
      })
      .attr("x", x)
      .attr("y", y)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .style('stroke-opacity',.8)
      .style('fill-opacity',.8)
      .attr("fill", "grey");



    var me = this;
    var pcdata = this.model.get('branches');
    var ignore_keys = ['label','type','source','feature_id','nByi',"feature"];
    var keys = _.difference(Object.keys(pcdata[0]),ignore_keys);

    var pc = d3.parcoords()(".pc-container");

    pc.dimensions(keys)
      .data(pcdata)
      .render()
      .color("#000")
      .alpha(0.3)
      .margin({ top: 0, left: 0, bottom: 0, right: 0 })
      .render()/*
      .reorderable()
      .brushable()
      .on('brush', function(data){
      me.model.filterNodes(data);
      })*/;
		
	}

});