var Model = require('./model');
var REQUIRED = null;

module.exports = Model.extend({
    analysis_id:REQUIRED,
    dataset_id:REQUIRED,

    initialize:function (options) {
        _.extend(this, options);
    },

    url:function () {
        return "svc/data/sources/" + this.analysis_id + "/" + this.dataset_id;
    },

    parse:function (tsv_text) {
        var tsv_rows = tsv_text.split("\n");

        var COLUMNS = _.rest(_.first(tsv_rows).split("\t"), 1),
            ROWS = [],
            DATA = [];

        _.each(_.rest(tsv_rows, 1), function (tsv_row, tsv_row_idx) {
            var data_values = tsv_row.split("\t");
            ROWS.push(_.first(data_values));
            DATA[tsv_row_idx] = _.rest(data_values, 1);
        });

        return {"DATA":DATA, "COLUMNS":COLUMNS, "ROWS":ROWS};
    },

    fetch:function (options) {
        return Model.prototype.fetch.call(this, _.extend({}, options, {dataType:'text'}));
    }

});