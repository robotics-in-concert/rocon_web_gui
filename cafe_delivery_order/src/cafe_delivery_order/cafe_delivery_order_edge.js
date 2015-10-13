/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
        },
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
                            rect: ['17px', '21', '227', '69', 'auto', 'auto']
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
                            "eid7",
                            "left",
                            0,
                            0,
                            "linear",
                            "${order_btn}",
                            '17px',
                            '17px'
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
                            type: 'rect',
                            id: 'menu_bg',
                            stroke: [0, 'rgba(0,0,0,1)', 'none'],
                            rect: ['0px', '0px', '260px', '270px', 'auto', 'auto'],
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
                            font: ['Tahoma, Geneva, sans-serif', [24, 'px'], 'rgba(5,17,99,1.00)', '700', 'none', 'normal', 'break-word', ''],
                            type: 'text',
                            align: 'center',
                            id: 'title',
                            textStyle: ['', '', '', '', 'none'],
                            text: '<p style=\"margin: 0px;\">​title</p>',
                            rect: ['6px', '234px', '246px', '28px', 'auto', 'auto']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '260px', '270px']
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
                            rect: ['16.7%', '32.1%', 'auto', 'auto', 'auto', 'auto'],
                            textStyle: ['', '', '', '', 'none'],
                            font: ['Tahoma, Geneva, sans-serif', [24, 'px'], 'rgba(5,17,99,1)', '700', 'none', 'normal', 'break-word', 'nowrap'],
                            id: 'order_btn_txt',
                            text: '<p style=\"margin: 0px;\">​Select Drinks</p>',
                            align: 'center',
                            type: 'text'
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            isStage: 'true',
                            rect: [undefined, undefined, '227px', '69px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("cafe_delivery_order_edgeActions.js");
})("EDGE-67918046");
