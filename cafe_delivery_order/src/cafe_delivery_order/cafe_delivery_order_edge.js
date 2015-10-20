/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
            'bebas-neue, sans-serif': '<script src=\"http://use.edgefonts.net/bebas-neue:n4:all.js\"></script>',
            'average, sans-serif': '<script src=\"http://use.edgefonts.net/average:n4:all.js\"></script>',
            'acme, sans-serif': '<script src=\"http://use.edgefonts.net/acme:n4:all.js\"></script>'        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
            "includes/jquery-1.7.1.min.js"
        ],
        symbols = {
            "stage": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "both",
                centerStage: "both",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'menu',
                            symbolName: 'menu',
                            display: 'none',
                            type: 'rect',
                            rect: ['9px', '10px', '260', '270', 'auto', 'auto'],
                            overflow: 'visible'
                        },
                        {
                            id: 'order_btn',
                            symbolName: 'order_btn',
                            type: 'rect',
                            rect: ['6px', '27px', '227', '69', 'auto', 'auto']
                        },
                        {
                            id: 'progress_status',
                            symbolName: 'progress_status',
                            type: 'rect',
                            rect: ['auto', '2.3%', '401', '68', '10.7%', 'auto']
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: ['null', 'null', '720px', '1280px', 'auto', 'auto'],
                            overflow: 'hidden',
                            fill: ["rgba(255,255,255,1)"]
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [
                        [
                            "eid12",
                            "left",
                            0,
                            0,
                            "linear",
                            "${order_btn}",
                            '6px',
                            '6px'
                        ],
                        [
                            "eid5",
                            "top",
                            0,
                            0,
                            "linear",
                            "${menu}",
                            '10px',
                            '10px'
                        ],
                        [
                            "eid4",
                            "left",
                            0,
                            0,
                            "linear",
                            "${menu}",
                            '9px',
                            '9px'
                        ],
                        [
                            "eid8",
                            "top",
                            0,
                            0,
                            "linear",
                            "${order_btn}",
                            '27px',
                            '27px'
                        ],
                        [
                            "eid6",
                            "display",
                            0,
                            0,
                            "linear",
                            "${menu}",
                            'none',
                            'none'
                        ]
                    ]
                }
            },
            "menu": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0px', '0px', '260px', '270px', 'auto', 'auto'],
                            id: 'menu_bg',
                            stroke: [0, 'rgba(0,0,0,1)', 'none'],
                            type: 'rect',
                            fill: ['rgba(200,209,243,1.00)']
                        },
                        {
                            rect: ['6px', '9px', '246px', '221px', 'auto', 'auto'],
                            borderRadius: ['10px', '10px', '10px', '10px'],
                            id: 'photo',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            type: 'rect',
                            fill: ['rgba(255,255,255,1.00)']
                        },
                        {
                            rect: ['6px', '234px', '246px', '28px', 'auto', 'auto'],
                            textStyle: ['', '', '', '', 'none'],
                            font: ['acme, sans-serif', [24, 'px'], 'rgba(5,17,99,1.00)', '700', 'none', 'normal', 'break-word', ''],
                            id: 'title',
                            text: '<p style=\"margin: 0px;\">​title</p>',
                            align: 'center',
                            type: 'text'
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            isStage: 'true',
                            rect: [undefined, undefined, '260px', '270px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "order_btn": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0%', '0%', '99.8%', '99.6%', 'auto', 'auto'],
                            borderRadius: ['10px', '10px', '10px', '10px'],
                            id: 'order_btn_bg',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            type: 'rect',
                            fill: ['rgba(200,209,243,1)']
                        },
                        {
                            font: ['Tahoma, Geneva, sans-serif', [24, 'px'], 'rgba(5,17,99,1)', '700', 'none', 'normal', 'break-word', 'nowrap'],
                            type: 'text',
                            align: 'center',
                            id: 'order_btn_txt',
                            textStyle: ['', '', '', '', 'none'],
                            text: '<p style=\"margin: 0px;\">​Select Drinks</p>',
                            rect: ['16.7%', '32.1%', 'auto', 'auto', 'auto', 'auto']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '227px', '69px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "progress_status": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0px', '1px', '396px', '18px', 'auto', 'auto'],
                            id: 'progress_bg',
                            stroke: [2, 'rgb(204, 204, 204)', 'solid'],
                            type: 'rect',
                            fill: ['rgba(213,223,232,1.00)']
                        },
                        {
                            rect: ['1px', '3px', '0px', '18px', 'auto', 'auto'],
                            id: 'progress_fg',
                            stroke: [2, 'rgb(204, 204, 204)', 'none'],
                            type: 'rect',
                            fill: ['rgba(41,128,185,1.00)']
                        },
                        {
                            rect: ['1px', '25px', '400px', '27px', 'auto', 'auto'],
                            textStyle: ['', '', '', '', 'none'],
                            font: ['average, sans-serif', [25, 'px'], 'rgba(41,128,185,1)', '400', 'none', 'normal', 'break-word', ''],
                            id: 'status_txt',
                            text: '<p style=\"margin: 0px; text-indent: 0%;\">​<span style=\"font-family: Tahoma, Geneva, sans-serif; font-size: 90%; word-spacing: 0em; letter-spacing: 0em; font-weight: 500;\">YujinRobot&nbsp;Smart cafe&nbsp;</span></p>',
                            align: 'left',
                            type: 'text'
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            isStage: 'true',
                            rect: [undefined, undefined, '401px', '68px']
                        }
                    }
                },
                timeline: {
                    duration: 1000,
                    autoPlay: true,
                    data: [
                        [
                            "eid86",
                            "top",
                            0,
                            0,
                            "linear",
                            "${status_txt}",
                            '25px',
                            '25px'
                        ],
                        [
                            "eid102",
                            "width",
                            0,
                            1000,
                            "linear",
                            "${progress_fg}",
                            '0px',
                            '396px'
                        ],
                        [
                            "eid83",
                            "width",
                            0,
                            0,
                            "linear",
                            "${status_txt}",
                            '400px',
                            '400px'
                        ],
                        [
                            "eid88",
                            "font-size",
                            0,
                            0,
                            "linear",
                            "${status_txt}",
                            '25px',
                            '25px'
                        ],
                        [
                            "eid80",
                            "height",
                            0,
                            0,
                            "linear",
                            "${status_txt}",
                            '27px',
                            '27px'
                        ],
                        [
                            "eid82",
                            "left",
                            0,
                            0,
                            "linear",
                            "${status_txt}",
                            '1px',
                            '1px'
                        ]
                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("cafe_delivery_order_edgeActions.js");
})("EDGE-67918046");
