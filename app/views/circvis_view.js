var View = require('./view');
var template = require('./templates/circ');

module.exports = View.extend({
    template:template,
    className:"row-fluid",

    initialize:function (options) {
        _.extend(this, options);
        _.bindAll(this, 'loadData');
        this.model.on("load", this.loadData);
    },

    loadData:function () {
        var edges = this.model.get("edges");
        var vis = this.getCirc();
         vis.addEdges(edges);
    },

    getCirc:function () {
        var $div = this.$el.find('.circ-container');
        var div = $div.get(0);
        var width = $div.width();
        var height = $div.height();

        var hovercard_config = {
            Feature:'label',
            Location:function (feature) {
                return 'Chr ' + feature.chr + ' ' + feature.start + (feature.end ? '-' + feature.end : '');
            }
        };

        var annotations = qed.Annotations[this.model.get("dataset_id")] || {};
        if (!_.isEmpty(annotations)) {
            var headers = _.keys(annotations[_.first(_.keys(annotations))]);
            _.each(headers, function (header) {
                hovercard_config[header] = header;
            });
        }

    var  color_scale =    { 'GEXP': '#1f77b4',
            //blue
            'METH': '#2ca02c',
            //green
            'CNVR': '#ff7f0e',
            //orange
            'MIRN': '#9467bd',
            //purple
            'GNAB': '#d62728',
            //red
            'PRDM': '#8c564b',
            //pink
            'RPPA': '#e377c2',
            //brown
            'CLIN': '#aa4444',
            'SAMP': '#bcbd22',
            'other' : '#17becf'
        };

        function feature_type(feature) { return feature && feature.label && !!~feature.label.indexOf(':') ? 
                    feature.label.split(':')[1] : 'other';}
        function clin_type(feature) { return feature && feature.clin_alias && !!~feature.clin_alias.indexOf(':')?
        feature.clin_alias.split(':')[1] : 'other';}
        
        var shape_map ={'CLIN':'square','SAMP':'cross','other':'diamond'};
        function shape(type) { return shape_map[type];}
        function clinical_shape(feature) { return shape(clin_type(feature));}

    var tick_colors = function(data) {       
        return type_color(feature_type(data));
    };

    var type_color = function(type) {
        return color_scale[type] || color_scale['other'];
    };

    var fill_style = d3.scale.linear().domain([0,6]).range(['blue','red']);

    var label_map = {'METH' : 'DNA Methylation',
        'CNVR': 'Copy Number Variation Region',
        'MIRN' :'mircoRNA',
        'GNAB' : 'Gene Abberation',
        'GEXP': 'Gene Expression',
        'CLIN': 'Clinical Data',
        'SAMP': 'Tumor Sample'
    };

    var types = Object.keys(label_map);

    var hovercard_items_config = {Feature:function(feature) { var label = feature.label.split(':'); return label[2] + 
    ' (<span style="color:'+type_color(feature_type(feature))+'">' +
        label_map[feature_type(feature)] + '</span>)';},
        Location: function(feature) { return 'Chr ' + feature.chr + ' ' + feature.start + (feature.end ? '-' + feature.end : '');},
        'Somatic Mutations': 'mutation_count'};

    var clinical_hovercard_items_config  = _.extend({},hovercard_items_config);

     _.extend(clinical_hovercard_items_config,
        {
            'Clinical Coorelate' : function(feature) { var label = feature.clin_alias.split(':'); 
                    return label[2] + ' (<span style="color:'+type_color(clin_type(feature)) +'">' + label_map[clin_type(feature)] + '</span>)';}
    }
        );


    var links = [
        {
            label: 'UCSC Genome Browser',
            key: 'ucsc',
            url: 'http://genome.ucsc.edu/cgi-bin/hgTracks',
            uri: '?db=hg18&position=chr',
            href: function(feature) {
                return 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg18&position=chr' + feature.chr + ':' + feature.start + (feature.end == '' ? '' : '-' + feature.end);
            }
        }, //ucsc_genome_browser
        {
            label: 'Ensembl',
            key: 'ensembl',
            url: 'http://uswest.ensembl.org/Homo_sapiens/Location/View',
            uri: '?r=',
            href: function(feature) {
                return 'http://uswest.ensembl.org/Homo_sapiens/Location/View?r=' + feature.chr + ':' + feature.start + (feature.end == '' ? '' : '-' + feature.end);
            }
        }, //ensemble
        {
            label: 'Cosmic',
            key: 'cosmic',
            url: 'http://www.sanger.ac.uk/perl/genetics/CGP/cosmic',
            uri: '?action=bygene&ln=',
            href: function(feature) {
                return _.include(['CNVR', 'MIRN','METH'],feature.source) ? 'http://www.sanger.ac.uk/perl/genetics/CGP/cosmic?action=bygene&ln=' + feature.label.split(':')[2] : null;
            }
        },
        {
            label: 'miRBase',
            key: 'mirbase',
            url: 'http://mirbase.org/cgi-bin/query.pl',
            uri: '?terms=',
            href: function(feature) {
                return feature.source == 'MIRN' ? 'http://www.mirbase.org/cgi-bin/query.pl?terms=' + feature.label.split(':')[2] : null;
            }
        }
    ];

    var hovercard_links_config = {};

    _.each(links, function(item){hovercard_links_config[item.label]=item;});

    var key_order = _.keys(qed.Lookups.Chromosomes.get("itemsById"));
    var key_length = _.map(qed.Lookups.Chromosomes.get("itemsById"), function(v) {return {'chr_name':v.id,'chr_length':parseInt(v.chr_lengths)};});

           var data = {
     DATA: {
            features: [],
            edges: [],
            hash : function(feature) { return feature.label}
        },
        PLOT: {
            container: div,
            width : width,
            height: height,
            vertical_padding : 10,
            horizontal_padding: 10,
            enable_pan : false,
            enable_zoom : false,
            show_legend: false
        },

        GENOME: {
            DATA:{
                key_order : key_order,
                key_length : key_length
            },
            OPTIONS: {
                radial_grid_line_width : 2,
                label_layout_style:'clock',
                label_font_style:'16px helvetica',
                gap_degrees : 2
            }
        },

        WEDGE:[
        ],
        TICKS : {
            OPTIONS : {
                wedge_height: 15,
                wedge_width:0.7,
                overlap_distance:10000000, //tile ticks at specified base pair distance
                height : 120,
                fill_style : tick_colors,
                tooltip_items: hovercard_items_config,
                tooltip_links: hovercard_links_config
            }
        },
        NETWORK:{
            DATA:{
                data_array : []//
            },
            OPTIONS: {
                render: true,
                outer_padding : 10,
                tile_nodes : Boolean(true),
                node_overlap_distance: 3e7,
                node_radius:6,
                node_fill_style : tick_colors,
                link_stroke_style : 'red',
                link_line_width:8,
                link_alpha : 0.6,
                node_highlight_mode : 'isolate',
                node_key : function(node) { return node.label;},
                node_tooltip_items :  hovercard_items_config,
                node_tooltip_links: hovercard_links_config,
                link_tooltip_items :  {
                    'Target' : function(link) { var label = link.source.label.split(':'); return '<span style="color:'+tick_colors(link.source)+'">' +
                        label_map[label[1]] + '</span> ' + label[2];},
                    'Target Location' : function(link) { return 'Chr ' + link.source.chr + ' ' + link.source.start +
                        (link.source.end ? '-' + link.source.end : '');},
                    'Predictor' : function(link) { var label = link.target.label.split(':'); return '<span style="color:'+tick_colors(link.target)+'">' +
                        label_map[label[1]] + '</span> ' + label[2];},
                    'Predictor Location' : function(link) { return 'Chr ' + link.target.chr + ' ' + link.target.start +
                        (link.target.end ? '-' + link.target.end : '');}
                }
            }
        }
    };
      
      var dataObject = {DATATYPE : "vq.models.CircVisData", CONTENTS : data};
      var circle_vis = new vq.CircVis(dataObject);
      this.vis = circle_vis;    circle_vis();


     //    var extent = [0, 0.5];
     //    var color_scale = d3.scale.linear().domain(extent).range(['green', 'red']);

     //    var data = {
     //        GENOME:{
     //            DATA:{
     //                key_order:_.keys(qed.Lookups.Chromosomes.get("itemsById")),
     //                key_length:_.map(qed.Lookups.Chromosomes.get("itemsById"), function (obj, chr) {
     //                    return {chr_name:chr, chr_length:parseInt(obj["chr_lengths"])};
     //                })
     //            },
     //            OPTIONS:{
     //                label_layout_style:'clock',
     //                label_font_style:'18pt helvetica',
     //                gap_degrees:2
     //            }
     //        },
     //        TICKS:{
     //            DATA:{
     //                data_array:[]
     //            },
     //            OPTIONS:{
     //                wedge_height:8,
     //                wedge_width:0.7,
     //                overlap_distance:10000000, //tile ticks at specified base pair distance
     //                height:80,
     //                tooltip_items:hovercard_config
     //            }
     //        },
     //        PLOT:{
     //            width:width,
     //            height:height,
     //            horizontal_padding:30,
     //            vertical_padding:30,
     //            container:div,
     //            enable_pan:false,
     //            enable_zoom:false,
     //            show_legend:false,
     //            legend_include_genome:false,
     //            legend_corner:'ne',
     //            legend_radius:width / 15
     //        },
     //        WEDGE:[
     //            {
     //                PLOT:{
     //                    height:(width / 10),
     //                    type:'scatterplot'
     //                },
     //                DATA:{
     //                    data_array:[],
     //                    value_key:'ig'
     //                },
     //                OPTIONS:{
     //                    legend_label:'Information Gain',
     //                    legend_description:'',
     //                    outer_padding:6,
     //                    base_value:Math.min(0, (extent[1] - extent[0]) / 2),
     //                    min_value:extent[0] * 0.8,
     //                    max_value:extent[1] * 1.2,
     //                    radius:4,
     //                    draw_axes:true,
     //                    shape:'dot',
     //                    fill_style:function (feature) {
     //                        return color_scale(feature.ig);
     //                    },
     //                    stroke_style:'none',
     //                    tooltip_items:hovercard_config
     //                }
     //            }
     //        ]
     //    };

     //    var circle_vis = new vq.CircVis();
     //    circle_vis.draw({
     //        DATATYPE:"vq.models.CircVisData",
     //        CONTENTS:data
     //    });
        return circle_vis;
    }

});