// Base class for all models.
module.exports = Backbone.Model.extend({

    original_model:new Backbone.Model(),

    original:function (value) {
        if (!arguments.length) return this.original_model;
        this.original_model = value;
        return this;
    },

    make_copy: function(ModelClass, options) {
            //nope its a model
            this.original_model = new ModelClass(this.toJSON());
    },

    standard_fetch:function () {
        this.fetch({
            success:function (m) {
                m.trigger('load');
            }
        });
        return this;
    }
});
