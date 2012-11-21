module.exports = Backbone.Model.extend({

    initialize: function (options) {
        _.extend(this, options);

        this.set("edges", [    
            {"node1":{"label":"N:METH:AVRO:22:2912955:2962955::","chr":"22","start":2912955,"end":2962955,"source":"METH","mutation_count":346,"annotated_type":0},"node2":{"label":"N:GEXP:TIEN:9:101290283:101340283::","chr":"9","start":101290283,"end":101340283,"source":"GEXP","mutation_count":399,"annotated_type":4},"logged_pvalue":112},
            {"node1":{"label":"N:MIRN:XCNO:2:98822145:98872145::","chr":"2","start":98822145,"end":98872145,"source":"MIRN","mutation_count":155,"annotated_type":4},"node2":{"label":"N:CNVR:SVIA:3:19189109:19239109::","chr":"3","start":19189109,"end":19239109,"source":"CNVR","mutation_count":214,"annotated_type":2},"logged_pvalue":46},
            {"node1":{"label":"N:METH:TJDK:11:72914085:72964085::","chr":"11","start":72914085,"end":72964085,"source":"METH","mutation_count":35,"annotated_type":1},"node2":{"label":"N:MIRN:VDNU:9:95238918:95288918::","chr":"9","start":95238918,"end":95288918,"source":"MIRN","mutation_count":55,"annotated_type":1},"logged_pvalue":271},
            {"node1":{"label":"N:CNVR:CFCP:16:2009256:2059256::","chr":"16","start":2009256,"end":2059256,"source":"CNVR","mutation_count":345,"annotated_type":0},"node2":{"label":"N:GEXP:ROOZ:18:36978100:37028100::","chr":"18","start":36978100,"end":37028100,"source":"GEXP","mutation_count":354,"annotated_type":1},"logged_pvalue":184},
            {"node1":{"label":"N:MIRN:KOWH:7:77077895:77127895::","chr":"7","start":77077895,"end":77127895,"source":"MIRN","mutation_count":287,"annotated_type":3},"node2":{"label":"N:GNAB:ZKTK:5:38495666:38545666::","chr":"5","start":38495666,"end":38545666,"source":"GNAB","mutation_count":167,"annotated_type":3},"logged_pvalue":144},
            {"node1":{"label":"N:GEXP:DNMF:7:98488214:98538214::","chr":"7","start":98488214,"end":98538214,"source":"GEXP","mutation_count":82,"annotated_type":2},"node2":{"label":"N:MIRN:RWWH:X:113955223:114005223::","chr":"X","start":113955223,"end":114005223,"source":"MIRN","mutation_count":273,"annotated_type":4},"logged_pvalue":236},
            {"node1":{"label":"N:GNAB:RJIJ:5:9359096:9409096::","chr":"5","start":9359096,"end":9409096,"source":"GNAB","mutation_count":2,"annotated_type":4},"node2":{"label":"N:CNVR:MKPB:Y_random:20:50020::","chr":"Y_random","start":20,"end":50020,"source":"CNVR","mutation_count":101,"annotated_type":1},"logged_pvalue":231},
            {"node1":{"label":"N:METH:GAFD:5:129448868:129498868::","chr":"5","start":129448868,"end":129498868,"source":"METH","mutation_count":227,"annotated_type":1},"node2":{"label":"N:METH:JQEG:21:1718615:1768615::","chr":"21","start":1718615,"end":1768615,"source":"METH","mutation_count":49,"annotated_type":4},"logged_pvalue":197},
            {"node1":{"label":"N:CNVR:TTUH:6:112549724:112599724::","chr":"6","start":112549724,"end":112599724,"source":"CNVR","mutation_count":173,"annotated_type":1},"node2":{"label":"N:GNAB:CJWK:3:123342568:123392568::","chr":"3","start":123342568,"end":123392568,"source":"GNAB","mutation_count":245,"annotated_type":2},"logged_pvalue":193},
            {"node1":{"label":"N:MIRN:JVBW:17:10874459:10924459::","chr":"17","start":10874459,"end":10924459,"source":"MIRN","mutation_count":208,"annotated_type":2},"node2":{"label":"N:METH:FCSU:20:59768348:59818348::","chr":"20","start":59768348,"end":59818348,"source":"METH","mutation_count":92,"annotated_type":1},"logged_pvalue":150},
            {"node1":{"label":"N:GEXP:NCCT:Y:38826056:38876056::","chr":"Y","start":38826056,"end":38876056,"source":"GEXP","mutation_count":129,"annotated_type":2},"node2":{"label":"N:CNVR:PWJD:20:32644097:32694097::","chr":"20","start":32644097,"end":32694097,"source":"CNVR","mutation_count":69,"annotated_type":1},"logged_pvalue":87},
            {"node1":{"label":"N:GNAB:HTBK:4:138610628:138660628::","chr":"4","start":138610628,"end":138660628,"source":"GNAB","mutation_count":203,"annotated_type":0},"node2":{"label":"N:MIRN:UDZU:1:53664295:53714295::","chr":"1","start":53664295,"end":53714295,"source":"MIRN","mutation_count":144,"annotated_type":2},"logged_pvalue":5},
            {"node1":{"label":"N:METH:OLTP:16:36986118:37036118::","chr":"16","start":36986118,"end":37036118,"source":"METH","mutation_count":365,"annotated_type":3},"node2":{"label":"N:GEXP:ZGFZ:17:69151651:69201651::","chr":"17","start":69151651,"end":69201651,"source":"GEXP","mutation_count":46,"annotated_type":2},"logged_pvalue":70},
            {"node1":{"label":"N:MIRN:QFTX:X:62207526:62257526::","chr":"X","start":62207526,"end":62257526,"source":"MIRN","mutation_count":142,"annotated_type":4},"node2":{"label":"N:CNVR:RJRT:10:58600459:58650459::","chr":"10","start":58600459,"end":58650459,"source":"CNVR","mutation_count":76,"annotated_type":3},"logged_pvalue":255},
            {"node1":{"label":"N:MIRN:VWKL:15:29768077:29818077::","chr":"15","start":29768077,"end":29818077,"source":"MIRN","mutation_count":243,"annotated_type":1},"node2":{"label":"N:CNVR:KKBC:7:79145643:79195643::","chr":"7","start":79145643,"end":79195643,"source":"CNVR","mutation_count":6,"annotated_type":1},"logged_pvalue":35},
            {"node1":{"label":"N:CNVR:JCZH:6:128738121:128788121::","chr":"6","start":128738121,"end":128788121,"source":"CNVR","mutation_count":398,"annotated_type":2},"node2":{"label":"N:CNVR:RRVC:10:123922939:123972939::","chr":"10","start":123922939,"end":123972939,"source":"CNVR","mutation_count":261,"annotated_type":1},"logged_pvalue":278},
            {"node1":{"label":"N:MIRN:KARH:9:109571056:109621056::","chr":"9","start":109571056,"end":109621056,"source":"MIRN","mutation_count":387,"annotated_type":0},"node2":{"label":"N:METH:UKTQ:Y:40995221:41045221::","chr":"Y","start":40995221,"end":41045221,"source":"METH","mutation_count":371,"annotated_type":2},"logged_pvalue":276},
            {"node1":{"label":"N:MIRN:HRTV:18:33645387:33695387::","chr":"18","start":33645387,"end":33695387,"source":"MIRN","mutation_count":253,"annotated_type":1},"node2":{"label":"N:GEXP:RWTL:2:112723565:112773565::","chr":"2","start":112723565,"end":112773565,"source":"GEXP","mutation_count":221,"annotated_type":4},"logged_pvalue":227},
            {"node1":{"label":"N:GNAB:ENRT:15_random:20:50020::","chr":"15_random","start":20,"end":50020,"source":"GNAB","mutation_count":116,"annotated_type":3},"node2":{"label":"N:MIRN:LPPW:X_random:20:50020::","chr":"X_random","start":20,"end":50020,"source":"MIRN","mutation_count":244,"annotated_type":3},"logged_pvalue":189},
            {"node1":{"label":"N:GNAB:TPDE:10:130247450:130297450::","chr":"10","start":130247450,"end":130297450,"source":"GNAB","mutation_count":76,"annotated_type":4},"node2":{"label":"N:CNVR:VOLZ:3:133523581:133573581::","chr":"3","start":133523581,"end":133573581,"source":"CNVR","mutation_count":365,"annotated_type":3},"logged_pvalue":102},
            {"node1":{"label":"N:GEXP:ULOP:7:37805631:37855631::","chr":"7","start":37805631,"end":37855631,"source":"GEXP","mutation_count":217,"annotated_type":0},"node2":{"label":"N:CNVR:LVSC:3:33836350:33886350::","chr":"3","start":33836350,"end":33886350,"source":"CNVR","mutation_count":120,"annotated_type":2},"logged_pvalue":272},
            {"node1":{"label":"N:GNAB:IOTU:20:43386491:43436491::","chr":"20","start":43386491,"end":43436491,"source":"GNAB","mutation_count":116,"annotated_type":3},"node2":{"label":"N:GEXP:AUXE:X:44629354:44679354::","chr":"X","start":44629354,"end":44679354,"source":"GEXP","mutation_count":141,"annotated_type":4},"logged_pvalue":11},
            {"node1":{"label":"N:CNVR:QKPB:21:17912508:17962508::","chr":"21","start":17912508,"end":17962508,"source":"CNVR","mutation_count":382,"annotated_type":2},"node2":{"label":"N:GEXP:NLTM:16:14641935:14691935::","chr":"16","start":14641935,"end":14691935,"source":"GEXP","mutation_count":174,"annotated_type":4},"logged_pvalue":66},
            {"node1":{"label":"N:MIRN:WPKX:17:73785723:73835723::","chr":"17","start":73785723,"end":73835723,"source":"MIRN","mutation_count":97,"annotated_type":0},"node2":{"label":"N:GEXP:ERKC:17_random:20:50020::","chr":"17_random","start":20,"end":50020,"source":"GEXP","mutation_count":184,"annotated_type":4},"logged_pvalue":155},
            {"node1":{"label":"N:CNVR:XLDT:15:58878611:58928611::","chr":"15","start":58878611,"end":58928611,"source":"CNVR","mutation_count":58,"annotated_type":3},"node2":{"label":"N:GNAB:LENP:7:70719102:70769102::","chr":"7","start":70719102,"end":70769102,"source":"GNAB","mutation_count":326,"annotated_type":3},"logged_pvalue":161},
            {"node1":{"label":"N:GEXP:TPQB:X:102927046:102977046::","chr":"X","start":102927046,"end":102977046,"source":"GEXP","mutation_count":305,"annotated_type":2},"node2":{"label":"N:MIRN:DLIC:1:90082194:90132194::","chr":"1","start":90082194,"end":90132194,"source":"MIRN","mutation_count":21,"annotated_type":3},"logged_pvalue":186},
            {"node1":{"label":"N:GEXP:HVFR:11:32876469:32926469::","chr":"11","start":32876469,"end":32926469,"source":"GEXP","mutation_count":274,"annotated_type":1},"node2":{"label":"N:GNAB:FMDN:9:111064480:111114480::","chr":"9","start":111064480,"end":111114480,"source":"GNAB","mutation_count":114,"annotated_type":4},"logged_pvalue":143},
            {"node1":{"label":"N:MIRN:MBFH:1:229034326:229084326::","chr":"1","start":229034326,"end":229084326,"source":"MIRN","mutation_count":37,"annotated_type":3},"node2":{"label":"N:CNVR:RVMM:X:85397227:85447227::","chr":"X","start":85397227,"end":85447227,"source":"CNVR","mutation_count":118,"annotated_type":4},"logged_pvalue":99},
            {"node1":{"label":"N:GEXP:GOMK:5:75687139:75737139::","chr":"5","start":75687139,"end":75737139,"source":"GEXP","mutation_count":179,"annotated_type":1},"node2":{"label":"N:GEXP:IDTF:14:49210147:49260147::","chr":"14","start":49210147,"end":49260147,"source":"GEXP","mutation_count":313,"annotated_type":3},"logged_pvalue":204},
            {"node1":{"label":"N:GEXP:OACE:18:3497568:3547568::","chr":"18","start":3497568,"end":3547568,"source":"GEXP","mutation_count":395,"annotated_type":1},"node2":{"label":"N:METH:LWAO:12:112404332:112454332::","chr":"12","start":112404332,"end":112454332,"source":"METH","mutation_count":199,"annotated_type":2},"logged_pvalue":7}
            ]
        );
    },

    url: function () {
        return "svc" + this.data_uri;
    },

    fetch: function (options) {
        // _.extend(this, options);

        // // TODO :: Fetch all gene combinations a priori?
        // var gene1 = this.genes[0];
        // var gene2 = this.genes[1];
        // var data_uri = this.data_uri;
        // var perCancers = _.map(this.cancers, function(cancer) {
        //     return new PerCancer(_.extend(options, { "data_uri": data_uri, "gene1": gene1, "gene2": gene2, "cancer": cancer }));
        // });

        // this.set("data", perCancers);

        // var successFn = _.after(perCancers.length, options.success || function(){});
        // _.each(perCancers, function(perCancer) {
        //     perCancer.fetch({ "success": successFn, "error": successFn });
        // });
        this.trigger("load");
    },

    // allFeatures: function() {
    //     if (!this.get("allFeatures")) {
    //         var allFeatures = {};
    //         _.each(this.cancers, function(cancer) {
    //             allFeatures[cancer] = {};
    //         });

    //         _.each(this.get("data"), function(perCancer) {
    //             var featuresByGene = perCancer.get("features");
    //             var cancer = perCancer.get("cancer");
    //             _.each(featuresByGene, function(fByGene) {
    //                 _.each(fByGene, function(feature) {
    //                     if (allFeatures[cancer][feature.id]) {
    //                         console.log("duplicate!" + feature.id);
    //                     }
    //                     allFeatures[cancer][feature.id] = feature;
    //                 });
    //             });
    //         });

    //         this.set("allFeatures", allFeatures);
    //     }

    //     return this.get("allFeatures");
    // }
});