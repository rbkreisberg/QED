!function ($) {
    var SeqPeekProtype = {
        mutationSortFn: function(a, b) {
            var order = [
                "Silent",
                "Nonsense_Mutation",
                "Frame_Shift_Del",
                "Frame_Shift_Ins",
                "Missense_Mutation"
            ];

            var order_map = {};
            _.each(order, function(label, index) {
                order_map[label] = index;
            });

            if (_.has(order_map, a.mutation_type) && _.has(order_map, b.mutation_type)) {
                return order_map[a.mutation_type] > order_map[b.mutation_type];
            }
            else {
                return 0;
            }
        },

        mutationIdFn: function(d) {
            return d.mutation_id;
        },

        getMutationLabelRows: function(d) {
            var fields = [
                {label: 'ID', name: 'mutation_id'},
                {label: 'Type', name: 'mutation_type'},
                {label: 'Location', name: 'location'}
            ];

            return _
                .chain(fields)
                .map(function(f) {
                    return f.label + " - " + d[f.name];
                })
                .value();
        },

        processData: function() {
            var data = this.data;

            var gatherSamplesFn = function(entries) {
                var mutation_data = _.extend({}, entries[0], {});

                mutation_data.sample_ids = _
                    .chain(entries)
                    .pluck('patient_id')
                    .map(function(id) {
                        return {
                            id: id
                        };
                    })
                    .value();

                mutation_data.patient_id = null;
                return mutation_data;
            };

            data.subtype_to_index_map = {};

            _.each(data.cancer_subtypes, function(subtype, index) {
                data.subtype_to_index_map[subtype.label] = index;

                if (! _.has(subtype, 'mutations_by_loc') && ! _.has(subtype, 'mutations_processed')) {
                    var mutations_by_loc = _
                        .chain(subtype.mutations)
                        .groupBy('mutation_id')
                        .map(gatherSamplesFn)
                        .groupBy('location')
                        .value();

                    var all_mutations = [];

                    _.each(mutations_by_loc, function(mutations, location) {
                        all_mutations.push.apply(all_mutations, mutations);
                    });

                    subtype.mutations_by_loc = mutations_by_loc;
                    subtype.mutations_processed = all_mutations;
                }

                var default_layout = {
                    background_ticks: {
                        y1: 0,
                        y2: 0
                    },
                    mutations: {
                        y: 0
                    },
                    protein_scale_line: {
                        enabled: true,
                        y: 0
                    },
                    protein_scale_ticks: {
                        enabled: true,
                        y: 0
                    },
                    protein_domains: {
                        enabled: true,
                        y: 0
                    },
                    y: 0
                };

                subtype.layout = _.extend(default_layout, subtype.layout);
            });

            data.all_mutations_by_loc = _
                .chain(data.cancer_subtypes)
                .pluck('mutations_by_loc')
                .reduce(function(memo, locations, index) {
                    _.each(locations, function(data, loc) {
                        if (!_.has(memo, loc)) {
                            memo[loc] = data.slice(0);
                        }
                        else {
                            // Concatenate the array 'data' to memo[loc}
                            memo[loc].push.apply(memo[loc], data.slice(0));
                        }
                    });
                    return memo;
                }, {})
                .value();
        },

        doSubtypeLayout: function(subtype, config, param_layout) {
            var that = this;
            var layout = param_layout || _.extend({}, subtype.layout);

            var vert_pad = config.protein_vertical_padding;

            // Resolve the maximum height of the mutation shape stack including stems if needed
            var mutations_height = d3.max(subtype.mutations_processed, function(m) {
                return m.sample_ids.length * config.mutation_shape_width;
            });

            if (config.enable_mutation_stems === true) {
                mutations_height = mutations_height + config.mutation_stem_height;
            }

            // Height of scale line if displayed
            var protein_scale_height = 0;
            if (layout.protein_scale_ticks.enabled === true) {
                protein_scale_height = config.location_tick_height;
            }

            // Height of protein domains in total if displayed
            var domains_height = 0;

            if (layout.protein_domains.enabled === true) {
                domains_height = that.vis.domain_scale.rangeExtent()[1];
            }

            layout.mutations.y = mutations_height;
            layout.protein_scale_line.y = layout.mutations.y;

            // If stems are not drawn, move the scale line down so that it will not overlap with the mutation shapes
            if (config.enable_mutation_stems === false) {
                layout.protein_scale_line.y += config.mutation_shape_width / 2.0;
            }

            layout.protein_scale_ticks.y = layout.protein_scale_line.y + protein_scale_height;

            layout.protein_domains.y = layout.protein_scale_ticks.y + vert_pad + domains_height;

            layout.height = mutations_height + protein_scale_height + domains_height;

            layout.background_ticks.y1 = -mutations_height;
            layout.background_ticks.y2 = 0;

            if (layout.protein_domains.enabled === false) {
                layout.background_ticks.y2 = layout.protein_scale_ticks.enabled ? (config.location_tick_height / 2.0) : config.mutation_shape_width / 2.0;
            }

            return layout;
        },

        updateVerticalScaleRanges: function() {
            var that = this;
            var data = this.data;

            var current_y = 0;

            _.each(data.cancer_subtypes, function(subtype) {
                var layout = that.doSubtypeLayout(subtype, that.config);

                layout.y = current_y;
                _.extend(subtype.layout, layout);

                current_y = current_y + layout.height;

                if (layout.protein_domains.enabled === true ||
                    layout.protein_scale_ticks.enabled === true) {
                    current_y = current_y + that.config.protein_vertical_padding;
                }
                else if (layout.protein_domains.enabled === false ||
                    layout.protein_scale_ticks.enabled === false) {
                    current_y = current_y + 5.0;
                }
            });
        },

        getVisualizationSize: function() {
            var that = this;
            var data = this.data;

            // Resolve the maximum total height of the subtypes, assuming that the protein scale
            // and protein domains are displayed for every subtype.
            var max_height = 0;

            var test_layout = {
                background_ticks: {
                    y1: 0,
                    y2: 0
                },
                mutations: {
                    y: 0
                },
                protein_scale_line: {
                    enabled: true,
                    y: 0
                },
                protein_scale_ticks: {
                    enabled: true,
                    y: 0
                },
                protein_domains: {
                    enabled: true,
                    y: 0
                },
                y: 0
            };

            var test_config = _.extend({}, that.config, {
                enable_mutation_stems: true
            });

            _.each(data.cancer_subtypes, function(subtype) {
                var layout = that.doSubtypeLayout(subtype, test_config, test_layout);

                max_height += (layout.height + that.config.protein_vertical_padding);
            });

            return {
                width: this.config.band_label_width + this.config.protein_scale_width,
                height: max_height
            };
        },

        draw: function(data, param_config) {
            this.config.target_el.innerHTML = "";
            this.data = data;

            _.extend(this.config, param_config);

            this.processData();
            this.vis = {};

            // Linear scale for location in protein
            this.vis.x_scale = d3.scale.linear().domain([0, data.protein.sequence_length]).range([0, this.config.protein_scale_width]);

            // Ordinal scale for vertically positioning InterPro signatures
            var protein_domain_ids = _.pluck(data.protein.domains, 'id');
            this.vis.domain_scale = d3.scale.ordinal().domain(protein_domain_ids).rangeBands([0, protein_domain_ids.length * this.config.signature_height]);

            this.updateVerticalScaleRanges();

            var size_info = this.getVisualizationSize();

            this.vis.root = d3.select(this.config.target_el)
                .append("svg")
                    .attr("width", (2 * this.config.plot.horizontal_padding + size_info.width))
                    .attr("height", (2 * this.config.plot.vertical_padding + 2 * size_info.height));

            this.vis.root
                .append("g")
                    .attr("class", "data-area")
                    .attr("width", size_info.width)
                    .attr("height", size_info.height)
                    .attr("transform", "translate(" + this.config.plot.horizontal_padding + "," + this.config.plot.vertical_padding + ")");

            this.render();
        },

        changeSubtypes: function(new_subtypes, order) {
            var data = this.data;

            // Filter out subtypes that might already be in the visualization
            _.chain(new_subtypes)
                .filter(function(s) {
                    return _.has(data.subtype_to_index_map, s.label) === false || order.indexOf(s.label) === -1
                })
                .each(function(s) {
                    data.cancer_subtypes.push(s);
                });

            data.cancer_subtypes = data.cancer_subtypes.sort(function(a, b) {
                if (order.indexOf(a.label) < order.indexOf(b.label)) {
                    return -1;
                }
                else if (order.indexOf(a.label) == order.indexOf(b.label)) {
                    return 0;
                }
                else {
                    return 1;
                }
            });

            // Do data mangling for new subtypes
            this.processData();

            // Do layouts for new subtypes
            this.updateVerticalScaleRanges();

            this.render();
        },

        render: function() {
            var that = this;
            var data = this.data;

            var cancer_types_g = this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type")
                    .data(data.cancer_subtypes, function(d) {
                        return d.label;
                    });

            var subtypes_enter = cancer_types_g.enter();
            var subtypes_exit = cancer_types_g.exit();

            var subtypes_g = subtypes_enter
                .append("g")
                    .attr("class", "cancer-type")
                    .attr("height", function(d) {
                        return d.layout.subtype_height;
                    })
                    .attr("transform", function(d) {
                        return "translate(0," + d.layout.y + ")";
                    });

            subtypes_g
                .append("g")
                    .attr("class", "protein")
                    .attr("transform", "translate(" + this.config.band_label_width + ",0)")
                // Vertical reference lines on the protein scale
                .append("g")
                    .attr("class", "background-ticks")
                    .attr("transform", function(d) {
                        return "translate(0," + (d.layout.mutations.y) + ")";
                    });

            subtypes_g
                .append("text")
                    .attr("left", 0)
                    .attr("y", function(d) {
                        return d.layout.height / 2.0;
                    })
                    .text(function(d) {
                        return d.label;
                    });

            if (that.config.enable_transitions) {
                cancer_types_g = cancer_types_g
                    .transition()
                    .duration(500);

                subtypes_exit = subtypes_exit
                    .transition()
                    .duration(500);
            }

            // Update
            cancer_types_g
                .attr("height", function(d) {
                    return d.layout.subtype_height;
                })
                .attr("transform", function(d) {
                    return "translate(0," + d.layout.y + ")";
                });

            // Exit
            subtypes_exit
                .remove();

            this.updateMutationLayout();

            this.updateVerticalGroups();

            // Draw the mutation markers for each subtype
            this.updateMutationMarkers();

            // Draw or hide the stems
            this.updateStems();
        },

        updateSubtypePositions: function() {
            this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type")
                    .transition()
                    .duration(500)
                    .attr("height", function(d) {
                        return d.layout.subtype_height;
                    })
                    .attr("transform", function(d) {
                        return "translate(0," + d.layout.y + ")";
                    });
        },

        updateVerticalGroups: function() {
            var that = this;
            var data = this.data;

            var subtypes = this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type");

            //this.vis.cancer_types_g
            subtypes
                .each(function(subtype_data) {
                    var background_lines = d3
                        .select(this)
                        .selectAll(".protein")
                        .selectAll("g.background-ticks");

                    if (that.config.enable_transitions) {
                        background_lines = background_lines
                            .transition()
                            .duration(500);
                    }

                    background_lines
                        .attr("transform", function(d) {
                            return "translate(0," + (d.layout.mutations.y) + ")";
                        });
                });

            //this.vis.cancer_types_g
            subtypes
                .each(function(subtype_data) {
                    var mutation_group = d3
                        .select(this)
                        .selectAll(".protein")
                        .selectAll("g.mutations")
                            .data(function(d) {
                                return [d];
                            }, function(d) {
                                return d.label;
                            });

                    mutation_group
                        .enter()
                        .append("g")
                            .attr("class", "mutations")
                            .attr("transform", function(d) {
                                return "translate(0," + (d.layout.mutations.y) + ") scale(1, -1)";
                            })
                            .style("opacity", 1e-6);

                    mutation_group
                        .attr("transform", function(d) {
                            return "translate(0," + (d.layout.mutations.y) + ") scale(1, -1)";
                        })
                        .style("opacity", 1.0);
                });

            //this.vis.cancer_types_g
            subtypes
                .each(function(subtype_data) {
                    var protein_scales = d3
                        .select(this)
                        .selectAll(".protein")
                        .selectAll("g.scale")
                            .data(function(d) {
                                return (d.layout.protein_scale_ticks.enabled ||
                                    d.layout.protein_scale_line.enabled) === true ? [subtype_data] : [];
                            });

                    protein_scales
                        .enter()
                        .append("g")
                            .attr("class", "scale")
                            .attr("transform", function() {
                                return "translate(0," + (subtype_data.layout.protein_scale_ticks.y) + ")";
                            })
                            .style("opacity", 1e-6);

                    var protein_scales_exit = protein_scales.exit();

                    if (that.config.enable_transitions) {
                        protein_scales = protein_scales
                            .transition()
                            .duration(500);
                    }

                    protein_scales
                        .attr("transform", function() {
                            return "translate(0," + (subtype_data.layout.protein_scale_ticks.y) + ")";
                        })
                        .style("opacity", 1.0);

                    if (that.config.enable_transitions) {
                        protein_scales_exit = protein_scales_exit
                            .transition()
                            .duration(500)
                            .style("opacity", 1e-6);
                    }

                    protein_scales_exit
                        .remove();
                });

            //this.vis.cancer_types_g
            subtypes
                .each(function(subtype_data) {
                    var domains = d3
                        .select(this)
                        .selectAll(".protein")
                        .selectAll("g.domains")
                            .data(function(d) {
                                return d.layout.protein_domains.enabled === true ? [data.protein.domains] : [];
                            });

                    domains
                        .enter()
                        .append("g")
                            .attr("class", "domains")
                            .attr("transform", function() {
                                return "translate(0," + (subtype_data.layout.protein_domains.y) + ") scale(1, -1)";
                            })
                            .style("opacity", 1e-6);

                    var domains_exit = domains.exit();

                    if (that.config.enable_transitions) {
                        domains = domains
                            .transition()
                            .duration(500);
                    }

                    domains
                        .attr("transform", function() {
                            return "translate(0," + (subtype_data.layout.protein_domains.y) + ") scale(1, -1)";
                        })
                        .style("opacity", 1.0);

                    if (that.config.enable_transitions) {
                        domains_exit = domains_exit
                            .transition()
                            .duration(500)
                            .style("opacity", 1e-6);
                    }

                    domains_exit
                        .remove();
                });

            this.applyProteinScales();
            this.applyProteinDomains();
        },

        updateMutationLayout: function() {
            var that = this;
            var data = this.data;
            var mutationIdFn = this.mutationIdFn;

            var buildLocationGroups = function(mutations_by_loc) {
                return _.map(mutations_by_loc, function(mutations, location) {
                    var group,
                        scale = d3.scale.ordinal();

                    mutations.sort(that.mutationSortFn);

                    var mutation_ids_sorted = _
                        .chain(mutations)
                        .map(mutationIdFn)
                        .uniq()
                        .value();

                    scale.domain(mutation_ids_sorted);
                    scale.rangeBands([0, mutation_ids_sorted.length * that.config.mutation_shape_width]);

                    var width = scale.rangeExtent()[1];

                    group = {
                        data: {
                            location: location,
                            mutations: mutations
                        },
                        scale: scale,
                        left_extent: width / 2.0,
                        right_extent: width / 2.0,
                        start_loc: 0.0,
                        width: width
                    };

                    return group;
                });
            };

            var buildLocationGroupsAcrossSubtypes = _.once(buildLocationGroups);

            _.each(data.cancer_subtypes, function(subtype, index) {
                var layout = {};
                var location_groups;

                if (that.config.mutation_layout == 'by_subtype') {
                    location_groups = buildLocationGroups(subtype.mutations_by_loc);
                }
                else if (that.config.mutation_layout == 'all_subtypes') {
                    location_groups = buildLocationGroupsAcrossSubtypes(that.data.all_mutations_by_loc);
                }

                layout.location_groups = location_groups;

                layout.location_to_node_map = _.reduce(location_groups, function(memo, group) {
                    memo[group.data.location] = group;
                    return memo;
                }, {});

                layout.location_to_node_index_map = _.reduce(location_groups, function(memo, group, index) {
                    memo[group.data.location] = index;
                    return memo;
                }, {});

                subtype.mutation_layout = layout;
            });
        },

        applyProteinScales: function() {
            var that = this;

            var subtypes = this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type");


            //this.vis.cancer_types_g
            subtypes
                .selectAll(".protein")
                .selectAll("g.background-ticks")
                .each(function(subtype_data) {
                    var layout = subtype_data.layout;

                    var background_tick = d3.select(this)
                        .selectAll(".loc-tick")
                            .data(function() {
                                return that.vis.x_scale.ticks(20);
                            }, String);

                    background_tick
                        .enter()
                        .append("g")
                            .attr("class", "loc-tick")
                            .attr("transform", function(d) {
                                return "translate(" + that.vis.x_scale(d) + ",0)";
                            })
                        .append("svg:line")
                            .attr("y1", layout.background_ticks.y1)
                            .attr("y2", layout.background_ticks.y2)
                            .style("stroke-width", 1.0)
                            .style("stroke", "#ccc");

                    d3.select(this)
                        .selectAll(".loc-tick line")
                        .transition()
                        .duration(500)
                        .attr("y1", layout.background_ticks.y1)
                        .attr("y2", layout.background_ticks.y2);
            });

            //that.vis.cancer_types_g
            subtypes
                .selectAll(".protein")
                .selectAll(".scale")
                .each(function(subtype_data) {
                    var scale_line = d3.select(this)
                        .selectAll(".protein-scale")
                            .data(function(d) {
                                if (d.layout.protein_scale_line.enabled === true) {
                                    return [{
                                        y1: d.layout.protein_scale_ticks.enabled === true ? -that.config.location_tick_height : 0,
                                        y2: d.layout.protein_scale_ticks.enabled === true ? -that.config.location_tick_height : 0
                                    }];
                                }

                            return [];
                        });

                    scale_line
                        .enter()
                        .append("svg:line")
                            .attr("class", "protein-scale")
                            .attr("y1", function(d) { return d.y1; })
                            .attr("y2", function(d) { return d.y2; })
                            .attr("x1", 0)
                            .attr("x2", that.config.protein_scale_width)
                            .style("stroke", "black");

                    scale_line
                        .exit()
                        .remove();

                    var scale_ticks = d3.select(this)
                        .selectAll(".loc-tick")
                        .data(function(d) {
                            if (d.layout.protein_scale_ticks.enabled === true) {
                                return that.vis.x_scale.ticks(20);
                            }

                            return [];
                        }, String);

                    scale_ticks
                        .enter()
                        .append("g")
                            .attr("class", "loc-tick")
                            .attr("transform", function(d) {
                                return "translate(" + that.vis.x_scale(d) + ",0)";
                            })
                        .append("svg:text")
                            .attr("text-anchor", "middle")
                            .attr("y", function() {
                                return 0;
                            })
                            .text(function(d) {
                                return d;
                            });

                    scale_ticks
                        .exit()
                        .remove();
            });
        },

        updateMutationMarkers: function() {
            var that = this;
            var mutationIdFn = this.mutationIdFn;

            var subtypes = this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type");

            //that.vis.cancer_types_g
            subtypes
                .selectAll(".protein")
                .selectAll(".mutations")
                .each(function(mutation_data) {
                    var location_groups = mutation_data.mutation_layout.location_groups;
                    var location_to_node_map = mutation_data.mutation_layout.location_to_node_map;
                    var location_to_node_index_map = mutation_data.mutation_layout.location_to_node_index_map;

                    var node_locations = _.keys(location_to_node_map);
                    var pivot_location = node_locations[Math.floor(node_locations.length / 2)];

                    var x_scale = that.vis.x_scale;

                    var pivot_node = location_to_node_map[pivot_location];
                    var pivot_index = location_to_node_index_map[pivot_location];

                    pivot_node.start_loc = x_scale(pivot_node.data.location) - pivot_node.left_extent;

                    // Justify locations right of the pivot
                    var current_loc = pivot_node.start_loc + pivot_node.width + that.config.mutation_group_padding;

                    _.chain(location_groups.slice(pivot_index))
                        .rest()
                        .each(function(node) {
                            if ((x_scale(node.data.location) - node.left_extent) >= current_loc) {
                                node.start_loc = x_scale(node.data.location) - node.left_extent;
                                current_loc = node.start_loc + node.width + that.config.mutation_group_padding;
                            }
                            else {
                                node.start_loc = current_loc;
                                current_loc = current_loc + node.width + that.config.mutation_group_padding;
                            }
                        });

                    // Justify locations left of the pivot
                    current_loc = pivot_node.start_loc - that.config.mutation_group_padding;

                    _.chain(location_groups.slice(0, pivot_index + 1).reverse())
                        .rest()
                        .each(function(node) {
                            if ((x_scale(node.data.location) + node.right_extent) < current_loc) {
                                node.start_loc = x_scale(node.data.location) - node.left_extent;
                                current_loc = node.start_loc - that.config.mutation_group_padding;
                            }
                            else {
                                node.start_loc = current_loc - node.width;
                                current_loc = current_loc - node.width - that.config.mutation_group_padding;
                            }
                        });

                    var renderCircles = function(d) {
                        d3.select(this)
                            .selectAll(".mutation-type.mutation")
                                .data(d.sample_ids, String)
                                .enter()
                            .append("svg:circle")
                                .attr("r", that.config.mutation_shape_width / 2.0)
                                .attr("class", "mutation")
                                .attr("cx", 0.0)
                                .attr("cy", function(sample, index) {
                                    return index * that.config.mutation_shape_width;
                                });

                        d3.select(this)
                            .selectAll(".mutation")
                            .call(applySampleLabel, d);
                    };

                    var applySampleLabel = function(selection, mutation_data) {
                        var label_rows = that.getMutationLabelRows(mutation_data);

                        selection.each(function(d) {
                            var sample_rows = label_rows.slice();
                            sample_rows.push("Sample - " + d.id);

                            d3.select(this)
                                .append("svg:title")
                                    .text(function() {
                                        return sample_rows.join("\n");
                                    });
                        });
                    };

                    var applyMutationTypeGroups = function(data) {
                        var group = location_to_node_map[data.location];

                        var node_g = d3
                            .select(this)
                            .selectAll("g.mutation-type")
                                .data(function() {
                                    return data.mutations;
                                }, mutationIdFn);

                        node_g
                            .enter()
                            .append("svg:g")
                                .attr("class", "mutation-type")
                                .attr("transform", function(d) {
                                    var x = group.scale(mutationIdFn(d)) + that.config.mutation_shape_width / 2.0;
                                    var y = that.config.mutation_stem_height * (that.config.enable_mutation_stems === true ? 1 : 0);
                                    return "translate(" + x + "," + y + ")";
                                })
                                .style("fill", function(d) {
                                    var colors = that.config.mutation_colors;
                                    if (_.has(colors, d.mutation_type)) {
                                        return colors[d.mutation_type];
                                    }
                                    else {
                                        return 'lightgray';
                                    }
                                })
                            .each(renderCircles);

                        // Update
                        node_g
                            .attr("transform", function(d) {
                                var x = group.scale(mutationIdFn(d)) + that.config.mutation_shape_width / 2.0;
                                var y = that.config.mutation_stem_height * (that.config.enable_mutation_stems === true ? 1 : 0);
                                return "translate(" + x + "," + y + ")";
                            });
                    };

                    var mutation_group_g = d3.select(this)
                        .selectAll(".mutation.group")
                            .data(_.map(mutation_data.mutations_by_loc, function(mutations, location) {
                                    return {
                                        location: location,
                                        mutations: mutations
                                    }
                            }, function(d) {
                                return d.location;
                            }));

                    mutation_group_g
                            .enter()
                        .append("svg:g")
                            .attr("class", "mutation group")
                            .attr("transform", function(d) {
                                var node = location_to_node_map[d.location];
                                return "translate(" + node.start_loc + ",0)";
                            });

                    // Update
                    mutation_group_g
                        .each(applyMutationTypeGroups);

                    mutation_group_g
                        .transition()
                        .duration(500)
                        .attr("transform", function(d) {
                            var node = location_to_node_map[d.location];
                            return "translate(" + node.start_loc + ",0)";
                        });

                    mutation_group_g
                        .exit()
                        .remove();
            });
        },

        applyProteinDomains: function() {
            var that = this;

            var subtypes = this.vis.root
                .selectAll("g.data-area")
                .selectAll("g.cancer-type");

            //that.vis.cancer_types_g
            subtypes
                .selectAll(".protein")
                .selectAll(".domains")
                .each(function() {
                    var domains_g =  d3.select(this)
                        .selectAll("g.match")
                            .data(function(d) {
                                return d;
                            })
                        .enter()
                        .append("g")
                            .attr("class", function(d) {
                                return "match " + d.dbname;
                            })
                            .attr("transform", function(d) {
                                return "translate(0," + that.vis.domain_scale(d.id) + ")";
                            });

                    domains_g
                        .selectAll("rect.domain-location")
                            .data(function(d) {
                                var fields = ['dbname', 'evd', 'id', 'name', 'status'];
                                var loc_data = [];
                                _.each(d.locations, function(loc) {
                                    var obj = _.pick(d, fields);
                                    obj.location = loc;
                                    loc_data.push(obj);
                                });

                                return loc_data;
                            })
                        .enter()
                        .append("rect")
                            .attr("class", "domain-location")
                            .attr("x", function(d) {
                                return that.vis.x_scale(d.location.start);
                            })
                            .attr("width", function(d) {
                                var aa_length = d.location.end - d.location.start;
                                return that.vis.x_scale(aa_length);
                            })
                            .attr("height", that.config.signature_height)
                        .append("svg:title")
                            .text(function(d) {
                                var fields = ['dbname', 'evd', 'id', 'name', 'status'];
                                var value_list =_.reduce(fields, function(memo, field_label) {
                                    memo.push(field_label + ": " + d[field_label]);
                                    return memo;
                                }, []);

                                value_list.push("location: " + d.location.start + " - " + d.location.end);
                                return value_list.join("\n");
                            });
            });
        },

        updateStems: function() {
            var that = this;
            var mutationIdFn = this.mutationIdFn;

            var mutation_group = this.vis.root
                            .selectAll("g.data-area")
                            .selectAll("g.cancer-type")
                .selectAll(".protein")
                .selectAll(".mutations");

            mutation_group
                .each(function(subtype_data) {
                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) {
                            return [d.x, d.y];
                        })
                        .source(function(d) {
                            return {
                                x: that.vis.x_scale(d.location),
                                y: 0
                            };
                        })
                        .target(function(d) {
                            var node = subtype_data.mutation_layout.location_to_node_map[d.location];
                            return {
                                x: node.start_loc + that.config.mutation_shape_width / 2.0 + node.scale(mutationIdFn(d)),
                                y: that.config.mutation_stem_height - that.config.mutation_shape_width + 1
                            };
                        });

                    var stem = d3
                        .select(this)
                        .selectAll("path.stem")
                            .data(function(d) {
                                return that.config.enable_mutation_stems ? d.mutations_processed : [];
                            }, mutationIdFn);

                    var stem_exit = stem.exit();

                    stem
                        .enter()
                        .append("svg:path")
                            .attr("class", "stem")
                            .style("fill", "none")
                            .style("stroke", "gray")
                            .style("stroke-width", 2)
                        .append("svg:title")
                            .text(function(d) {
                                return that.getMutationLabelRows(d).join("\n");
                            });

                    if (that.config.enable_transitions) {
                        stem = stem
                            .transition()
                            .duration(500);
                    }

                    stem
                        .attr("d", diagonal);

                    stem_exit
                        .remove();
            });
        },

        setStems: function(stems_enabled) {
            this.config.enable_mutation_stems = stems_enabled;

            this.updateStems();
            this.updateMutationLayout();
            this.updateVerticalScaleRanges();
            this.updateVerticalGroups();
            this.updateSubtypePositions();
            this.updateMutationMarkers();
        },

        setProteinScales: function(param_subtypes) {
            var that = this;
            var data = this.data;

            _.each(param_subtypes, function(s) {
                if (_.has(data.subtype_to_index_map, s.label)) {
                    var subtype_data = data.cancer_subtypes[data.subtype_to_index_map[s.label]];
                    subtype_data.layout.protein_scale.enabled = s.enabled;

                    that.updateVerticalScaleRanges();
                    that.updateVerticalGroups();
                    that.updateSubtypePositions();
                }
                else {
                    console.warn("Unknown subtype: " + s.label);
                }
            });
        },

        setProteinDomains: function(param_subtypes) {
            var that = this;
            var data = this.data;

            _.each(param_subtypes, function(s) {
                if (_.has(data.subtype_to_index_map, s.label)) {
                    var subtype_data = data.cancer_subtypes[data.subtype_to_index_map[s.label]];
                    subtype_data.layout.protein_domains.enabled = s.enabled;

                    that.updateVerticalScaleRanges();
                    that.updateVerticalGroups();
                    that.updateSubtypePositions();
                }
                else {
                    console.warn("Unknown subtype: " + s.label);
                }
            });
        }
    };

    var SeqPeekFactory = {
        create: function(target_el) {
            var obj = Object.create(SeqPeekProtype, {});
            obj.config = {
                target_el: target_el
            };

            return obj;
        }
    };

    // jQuery Plugin
    var methods = {
        init : function(data, options) {
            return this.each(function() {
                var $this = $(this);
                var vis;
                $this.data("SeqPeek", (vis = SeqPeekFactory.create($this.get(0))));
                vis.draw(data, options);
            });
        },
        change_subtypes : function(new_subtypes, order) {
            return this.each(function() {
                var vis = $(this).data("SeqPeek");
                if (vis) {
                    vis.changeSubtypes(new_subtypes, order);
                }
            });
        },
        set_subtype_order: function() {
            return this;
        },
        set_stems : function(stems_enabled) {
            return this.each(function() {
                var vis = $(this).data("SeqPeek");
                if (vis) {
                    vis.setStems(stems_enabled);
                }
            });
        },
        set_protein_domains : function(param_subtypes) {
            return this.each(function() {
                var vis = $(this).data("SeqPeek");
                if (vis) {
                    vis.setProteinDomains(param_subtypes);
                }
            });
        },
        set_protein_scales : function(param_subtypes) {
            return this.each(function() {
                var vis = $(this).data("SeqPeek");
                if (vis) {
                    vis.setProteinScales(param_subtypes);
                }
            });
        }
    };

    $.fn.seqpeek = function( method ) {
        if ( methods[method] ){
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        }
        else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.seqpeek' );
        }
    };
}(window.jQuery);