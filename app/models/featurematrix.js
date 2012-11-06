//FeatureMatrix
//managed 2d array (data).  Internal client-side only model for manipulation

var Model = require('./model.js');

FeatureMatrix = Model.extend({

	defaults : {
		data : new Array(),
		transposed_data : new Array(), //key = case id, value = column index
		row_map : new Object(), //key = feature id, value = row index
		col_map : new Object() //key = case id, value = column index
	}


	getCases : function() { //return case ids in sorted order of index
		return _.chain(col_map)
		   			.pairs()
		   			.sortBy(function(f) {return f[1];})
		   			.first()
		   			.value();
		   		},

//return row-wise?
	getDataByFeatures: function getDataForFeatures(features){
		return _.map(features, function(feature) { 
				return {
							"feature":feature, 
							data:data[row_map[feature]]
					};
				}
				);
		},

//get intersection of feature data for NonNA cases. expensive operation

	getMatrixByFeatures_NonNA: function getMatrixByFeatures_NonNA(features){
		var matrix = getDataByFeatures(features);
			var cases = _.keys(col_map);
			var features = feature.pluck('feature');

			// for each row (feature)
			_.each(matrix, function (row) { 
				//for each column (case)
				_.each(cases, function(case){
						//if the value is NA, remove the case
						if (isNA(row[col_map[case]])) {
							delete cases[case];
						}
				});
			});
				//returns the list of column indices to keep
			var colsToKeep = _.map(cases, function(case) { return col_map[case];});

			//for each row (feature)
			matrix = _.map(matrix, function(row,index){
						//keep any column
					return _.filter(row, function(val,index) { 
							//whose index is in the list of columns to keep
							return _.contains(colsToRemove,index);
						});
				});

			return { "cases":cases, "features":features, data: matrix };
		},


	getDataByCases: function getDataByCases(cases) {
		return _.map(cases, function(case) { 
				return {
							"case":case,
							data:transposed_data[col_map[case]]
				}})
	},

	isNA : function isNA(val) {
		return val === 'NA';
	},

	cleanValue : function(val) {
		return ((_.isUndefined(val) || _.isNull(val)) ? 'NA' : val);
	}

});