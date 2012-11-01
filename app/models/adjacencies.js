var Layout = Backbone.Model.extend({
    defaults:{
        nodes:[],
        edges:[]
    },

    initialize: function() {
        _.bindAll(this, "url", "parse", "filterNodes");
    },

    url:function () {
        return "svc" + this.get("uri");
    },

    parse:function (graphData) {
        var node_data = {};
        _.each(_.without(_.keys(graphData), "adj", "iByn"), function (a) {
            node_data[a] = _.clone(graphData[a]);
        });

        node_data.label = node_data.nByi.map(function (f) {
            var lbl = qed.Lookups.Labels[f];
            if (lbl && _.isString(lbl)) return lbl;
            return f;
        });

        node_data.feature_id = node_data.nByi;

        var data_keys = _.keys(node_data);
        var key_len = data_keys.length;

        var nodes = _.range(node_data[data_keys[0]].length)
            .map(function (row) {
                var obj = {};
                for (var i = 0; i < key_len; i++) {
                    obj[data_keys[i]] = node_data[data_keys[i]][row];
                }
                return obj;
            });

        var edges = graphData.adj.map(function (edge) {
            return { source:edge[1], target:edge[0], weight:edge[2]};
        });

        return { "nodes":nodes, "edges":edges };
    },

    filterNodes:function (nodes) {
        var all_node_index = {};

        var all_nodes = this.get("nodes");
        var all_edges = this.get("edges");
        _.each(all_nodes, function (node, idx) {
            all_node_index[node.feature_id] = {idx:idx, edge_arr:[]};
        });

        _.each(all_edges, function (edge, idx) {
            all_node_index[all_nodes[edge['source']].feature_id].edge_arr.push(idx);
            all_node_index[all_nodes[edge['target']].feature_id].edge_arr.push(idx);
        });

        //build index of current nodes
        var current_node_index = {};

        _.each(nodes, function (node, idx) {
            current_node_index[node.feature_id] = {idx:idx, edge_arr:[]};
        });

        var keepers = [];
        var node_labels = _.pluck(nodes, 'feature_id');
        var edge_helper = _.map(_.range(all_edges.length), function () { return 0; });

        _.each(node_labels, function (label) {
            _.each(all_node_index[label].edge_arr, function (edge_idx) {
                if (++edge_helper[edge_idx] === 2) {
                    keepers.push(all_edges[edge_idx]);
                }
            });
        });

        var edges = _.map(keepers, function (edge) {
            return {
                source: current_node_index[all_nodes[edge.source].feature_id].idx,
                target: current_node_index[all_nodes[edge.target].feature_id].idx,
                weight:edge.weight
            };
        });

        return new Layout({ "nodes":nodes, "edges":edges });
    }
});

var Layouts = Backbone.Model.extend({
    model:Layout,

    url:function () {
        return "svc" + this.get("uri");
    },

    parse:function (json) {
        var _this = this;
        var layouts = _.map(json.files, function (f) {
            return new Layout(f, _this.options);
        });
        return { "layout":layouts };
    }
});

module.exports = Backbone.Model.extend({
    model:Layouts,

    url:function () {
        var dataset_id = this.get("dataset_id");
        return this.get("data_uri").replace(dataset_id, "layouts/" + dataset_id);
    },

    parse:function (json) {
        var _this = this;
        var layouts = _.map(json.directories, function (layoutDir) {
            var layout = _this.get("model_unit").layouts[layoutDir.label];
            var l = new Layouts(_.extend({}, layout, layoutDir, _this.options));
            l.fetch({ async:false });
            return l;
        });
        return { "layouts":layouts }
    }
});