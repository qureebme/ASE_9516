let h = window.screen.availHeight;
let w = window.screen.availWidth;


var s = new Snap(w, h + 200).attr({
    viewBox: "0,0,1536,1024",
    preserveAspectRatio: "xMidYMid meet"
}); //scalable drawing board

var x, y, width, height;
x = 0.1 * w;
y = 0.1 * h;
width = 0.8 * w; // 80% of available space
height = 0.8 * h;

/*
    console.log("width:", width)
    console.log("height:", height)
    console.log("width:", w)
    console.log("height:", h)
*/

var s_width = 250, // station width
    s_height = 150, //station height
    stationFill = "#90a4ae";

// var bigRect = s.rect(0, 0, w, h)
var bigRect = s.rect(0, 0, w, h + 200) //our stuff
    .attr({
        fill: "#9e9e9e",
        stroke: "#125470",
        strokeWidth: 5,
        rx: 5,
        ry: 5,
        id: "bigrect",
        opacity: 0.3
    }),
    //horizontal centre line
    cLine = s.line(x, y + height / 2 + 150, x + width, y + height / 2 + 150).attr({ //mv dw hr
        stroke: "#000000",
        strokeWidth: 4,
        id: "cline",
        opacity: 0
    }); // centre line

var spread = 50,
    clipoff = 50;

//Conveyor, outer part
var cnvBig = s.rect($("#cline").attr("x1"), Number(cLine.attr("y1")) - spread * 1.3, width, spread * 2.6).attr({
        fill: "#000000",
        id: "cnvBig",
        rx: 40,
        ry: 40
    }), // -spread *k,,spread*k*2

    //Conveyor, inner part
    cnvSm = s.rect(Number($("#cnvBig").attr("x")) + clipoff, Number(cLine.attr("y1")) - spread / 2, width - 2 * clipoff, spread).attr({
        fill: $("#bigrect").attr("fill"),
        id: "cnvSm",
        rx: 15,
        ry: 15
    });

var c_x = Number(s.select("#cnvBig").attr("x")) + Number(s.select("#cnvBig").attr("width")) / 2, //cnv, middle
    c_y1 = Number(s.select("#cnvBig").attr("y")) + Number(s.select("#cnvBig").attr("height")) + 10; // for hand and proc


//UPPER SIDE
var c_y2 = Number(s.select("#cnvBig").attr("y")) - 160; // - 10(spacing) - height_of_asrs// for asrs
var asrs = s.rect(c_x - 150, c_y2 - 100, 300, 250).attr({
        id: "asrs",
        fill: stationFill
    }), //asrs station

    //robot station
    robs = s.rect(x + width - 40 - s_width, s.select("#cnvBig").attr("y") - 160, s_width, s_height).attr({ //mv dw hr
        id: "robs",
        fill: stationFill
    }), // y + height / 2 - Number($("#bigRect").attr("height")) / 2 - 10 - s_height

    asse = s.rect(s.select("#robs").attr("x"), s.select("#robs").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "asse",
        fill: stationFill
    }), // assembling stationn

    stor = s.rect(s.select("#asse").attr("x"), s.select("#asse").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "stor",
        fill: stationFill
    }); // storing station

let text2 = s.text(Number(stor.attr('x'))+2, Number(stor.attr('y'))+13, 'dblClick to retrieve wkpc').attr({
    opacity: 0
});
    
stor.hover(function(){return text2.attr({opacity:1})}, function(){return text2.attr({opacity:0})})


// LOWER SIDE
var hand = s.rect(c_x - 100, c_y1, s_width, s_height).attr({
        id: "hand",
        fill: stationFill
    }), // handling station

    proc = s.rect(s.select("#hand").attr("x"), Number($("#hand").attr("y")) + Number($("#hand").attr("height")) + 5,
        s_width, s_height).attr({
        id: "proc",
        fill: stationFill
    }), // processing station

    test = s.rect(Number(s.select("#cnvBig").attr("x")) + 40, c_y1, s_width, s_height).attr({
        id: "test",
        fill: stationFill
    }), // testing station

    dist = s.rect(s.select("#test").attr("x"), Number(s.select("#test").attr("y")) + Number(s.select("#test").attr("height")) + 5,
        s_width, s_height).attr({
        id: "dist",
        fill: stationFill
    }); // distribution station

var cnv = s.group(cnvBig, cnvSm).attr({}); // the conveyor

// PROCESSING STATION COMPONENTS

var procc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 65).attr({
        fill: "#ffffff",
        opacity: 0,
        id: "procc"
    }), // the bounding circle, hidden

    flange0 = s.rect(Number(s.select("#proc").attr("x")) + 90, Number(s.select("#proc").attr("y")) + 10, 20, s.select("#procc").attr("r") * 2).attr({
        fill: "#ffffff",
        rx: 7,
        ry: 7,
        strokeWidth: 2,
        id: "flan0"
    }),

    hole1 = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 20, 8).attr({ fill: stationFill }),

    hole2 = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 130, 8).attr({ fill: stationFill }),

    flange1 = s.group(flange0, hole1, hole2).attr({
        stroke: "#b00020",
        id: 'flan1'
    });
    s.select("#flan1").transform("r60"); // 60 deg slant

var flange2 = flange1.clone().attr({
        stroke: "#6200ee",
        id: "flan2",
    }); //flange 2
s.select("#flan2").transform("r120"); // 60 deg off flange1

var    flange3 = flange1.clone().attr({
        stroke: "#03dac5",
        id: "flan3",
    }); // flange 3
s.select("#flan3").transform("r0"); // 120 deg off flange1

var ccc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 30).attr({
    fill: "#ffffff",
    opacity: 1,
    stroke: "#50ff50",
    strokeWidth: 2,
    id: "ccc"
}); // the centre circle

let wkpc_proc = makeWkpc2(s,768,812,'green') // opacity to 0

var spinner = s.group(flange1, flange2, flange3, ccc, wkpc_proc).attr({
    id: "spin"
}); // make the spinner whole

// accesories

let line1 = s.line(663, 840, 638, 840),
    line2 = s.line(638, 837, 638, 950),
    line3 = s.line(638, 946, 685, 946),
    line4 = s.line(685, 950, 685, 900),
    lines = s.group(line1, line2, line3, line4).attr({
        stroke: "black",
        strokeWidth: 7,
    });

// drilling mach
let base = s.rect(s.select("#proc").attr("x") - 15, Number(s.select("#proc").attr("y")) + 35, 25, 24).attr({
        fill: "blue",
    }),

    jjc = s.line(Number(s.select("#proc").attr("x")) + 10, Number(s.select("#proc").attr("y")) + 47, Number(s.select("#proc").attr("x")) + 27, Number(s.select("#proc").attr("y")) + 47).attr({
        stroke: "#6200ee",
        strokeWidth: 4,
    })

s.path("M678 827 l 10 10 l 0 4 L 678 851").attr({
    //stroke: "black",
})

let tip = s.line(695, Number(s.select("#proc").attr("y")) + 47, 701, Number(s.select("#proc").attr("y")) + 47).attr({
        stroke: "#b00020",
        strokeWidth: 6,
    }) // reddish tip

//gripping mach
let body = s.rect(Number(s.select("#proc").attr("x")) + 5, Number(s.select("#proc").attr("y")) + 93, 25, 20).attr({
        rx: 3,
        ry: 3,
        fill: "black",
    }),

    bodyBox = body.getBBox(body),

    plungerRod = s.line(bodyBox.x - 10, bodyBox.cy, bodyBox.x2 + 5, bodyBox.cy).attr({
        strokeWidth: 5,
        stroke: "black",
    }),

    plunBox = plungerRod.getBBox(),

    capR = s.line(plunBox.x2 - 1, plunBox.y2 - 5, plunBox.x2 - 1, plunBox.y2 + 5).attr({
        strokeWidth: 5,
        stroke: "black",
    }),
    capL = s.line(plunBox.x, plunBox.y - 5, plunBox.x, plunBox.y + 5).attr({
        strokeWidth: 5,
        stroke: "black",
    }),
    plunger = s.group(capL, plungerRod, capR).attr({
        id: 'plun'
    }); //at testing pt

// HANDLING STATION COMPONENTS
let handler = s.rect(Number(s.select("#hand").attr("x")) + 50+42, Number(s.select("#hand").attr("y")) - 5-15, 16, 183).attr({
        id: "handler",
        rx: 5,
        ry: 5,
        fill: "white",
        stroke: "#6200ee",
        strokeWidth: 4
    }), //anim to h=~185 to reach nxt station

    line_m = s.line (Number(handler.attr('x'))+8, handler.attr('y'), Number(handler.attr('x'))+8, Number(handler.attr('y'))+150),
    line_c = s.line(line_m.attr('x2')-5, line_m.attr('y2'), Number(line_m.attr('x2'))+5, line_m.attr('y2')),
    line_r = s.line(line_c.attr('x2'), line_c.attr('y2'), line_c.attr('x2'), Number(line_c.attr('y2'))+20),
    line_l = s.line(line_c.attr('x1'), line_c.attr('y1'), line_c.attr('x1'), Number(line_c.attr('y1'))+20),
    gr_line = s.group(line_m, line_c, line_r, line_l).attr({
        stroke: 'black',
        strokeWidth: 3,
        opacity: 0,
    }),

    wkpc_hand = makeWkpc(s,Number(s.select("#handler").attr("x")) + 8, Number(s.select("#handler").attr("y")) + Number(s.select("#handler").attr("height")) - 10)

// DISTRIBUTING STATION COMPONENTS

var holder = s.rect(Number(s.select("#dist").attr("x")) + 23, Number(s.select("#dist").attr("y")) + 100, 160, 25).attr({
        id: "holder",
        stroke: "#6200ee",
        strokeWidth: 1,
        fill: "white",
        opacity: 1,
        rx: 3,
        ry: 3
    });

var pusher = s.rect(Number(s.select("#dist").attr("x")) + 20, Number(s.select("#dist").attr("y"))-3 + 112.5,0,7).attr({
    strokeWidth: 2,
    fill: 'black',
    rx: 3,
    ry: 3
}), // animate the width
    pusherCasing = s.rect(Number(s.select("#dist").attr("x")) + 23, Number(s.select("#dist").attr("y"))-3 + 103,15,25).attr({
        opacity: 0.8,
        rx: 3,
        ry:3
    }),

wkpc_dist2 = makeWkpc(s, Number(pusherCasing.getBBox().x2) + 8, pusherCasing.getBBox().y2-12.5)

var distbBox = s.select('#dist').getBBox();
var testbBox = s.select('#test').getBBox();
//TESTING STATION COMPONENTS

var slides = s.rect(distbBox.x2-50, distbBox.y-165,25,210).attr({
    strokeWidth: 1,
    stroke: '#b00020',
    fill: 'white',
    rx: 3,
    ry:3
}),
vac1 = s.circle(Number(slides.attr('x'))+12.5, Number(slides.attr('y'))+20,1).attr({opacity:0.4}),
vac2 = vac1.clone().attr({transform: new Snap.Matrix().translate(0,40)}),
vac3 = vac1.clone().attr({transform: new Snap.Matrix().translate(0,80)}),
vac4 = vac1.clone().attr({transform: new Snap.Matrix().translate(0,120)}),
testPusher = s.rect(Number(slides.getBBox().x) + 9, slides.getBBox().y2 - 20, 7, 0), //animate x and height
testCasing = s.rect(distbBox.x2-50, Number(slides.getBBox().y2)-15,25,15).attr({
    opacity: 0.8,
    rx: 3,
    ry:3
}), // testPusherCasing
cir = s.circle(distbBox.x2, Number(distbBox.y)+90, 10).attr({
    id: 'circ'
}) //black

let swivel = drawMyrect(Number(s.select('#circ').attr('cx'))+2, Number(s.select('#circ').attr('cy'))+2, -77,-5).attr({
    id: 'myrect1',
    rx: 2,
    ry: 2,
    transform: new Snap.Matrix().rotate(10, cir.attr('cx'), cir.attr('cy'))//10
})

let knob = s.circle(distbBox.x2, Number(distbBox.y)+90, 10).attr({
    fill: stationFill,
    id: 'circ2'
})
//////////////////////////////

//let wkpc_test = makeWkpc(s, Number(testCasing.getBBox().x) + 12.5, testCasing.getBBox().y - 8).attr({opacity:1})

////////////////////////
s.circle(distbBox.x2-50, distbBox.y-2.5, 5).attr({fill: stationFill})
s.circle(distbBox.x2-25, distbBox.y-2.5, 5).attr({fill: stationFill})


// STORING STATION COMPONENTS
var rr = 8, // radius of the circles
    transMatrix2 = new Snap.Matrix().translate(10, 0),
    transMatrix3 = new Snap.Matrix().translate(20, 0);

var storBox = stor.getBBox(),
    point = s.circle(storBox.x2 - 100, storBox.y + 75, 5).attr({ id: "pt" }),

    cp = [s.select("#pt").attr("cx"), s.select("#pt").attr("cy")], //center coords of point

    lev1_color = "#03dac5",
    lev2_color = "#b00020", //reddish brown
    lev3_color = "#6200ee", //deep blue

    line0 = s.line(cp[0]+10, cp[1], storBox.x + 20, cp[1]).attr({ //hidden line, used for placing circles
        strokeWidth: 2,
        stroke: 'green',
        id: "line0",
        opacity: 0
    }),
    [c01, c02] = [Number(s.select("#line0").attr("x2")) + rr, s.select("#line0").attr("y2")];

    c0 = s.circle(c01, c02, rr).attr({
        opacity: 1,
        fill: "#90a4ae", // matches the bg
        strokeWidth: 2,
        class: 'slot'
    }),

    gr0 = s.group(line0, c0).attr({}), // a (hidden) line with a circle on its end

    gr1f = gr0.clone().attr({
        transform: setTransform(-25, cp[0], cp[1]),
        id: "line1",
        opacity: 1,
        stroke: lev1_color,

    }), // lowest

    gr1e = gr0.clone().attr({
        transform: setTransform(-15, cp[0], cp[1]),
        id: "line2",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1d = gr0.clone().attr({
        transform: setTransform(-5, cp[0], cp[1]),
        id: "line3",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1c = gr0.clone().attr({
        transform: setTransform(5, cp[0], cp[1]),
        id: "line4",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1b = gr0.clone().attr({
        transform: setTransform(15, cp[0], cp[1]),
        id: "line5",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1a = gr0.clone().attr({
        transform: setTransform(25, cp[0], cp[1]),
        id: "line6",
        opacity: 1,
        stroke: lev1_color,
    }); // highest

let gr2a = gr1a.clone().attr({ stroke: lev2_color, }),
    gr2b = gr1b.clone().attr({ stroke: lev2_color, }),
    gr2c = gr1c.clone().attr({ stroke: lev2_color, }),
    gr2d = gr1d.clone().attr({ stroke: lev2_color, }),
    gr2e = gr1e.clone().attr({ stroke: lev2_color, }),
    gr2f = gr1f.clone().attr({ stroke: lev2_color, });

let gr3a = gr1a.clone().attr({ stroke: lev3_color, }),
    gr3b = gr1b.clone().attr({ stroke: lev3_color, }),
    gr3c = gr1c.clone().attr({ stroke: lev3_color, }),
    gr3d = gr1d.clone().attr({ stroke: lev3_color, }),
    gr3e = gr1e.clone().attr({ stroke: lev3_color, }),
    gr3f = gr1f.clone().attr({ stroke: lev3_color, });

let getRed = drawMyrect(storBox.x2-5, Number(storBox.y)+3, -20, 10).attr({rx:2, ry:2, fill: 'red'}),
    getSilver = drawMyrect(storBox.x2-28, Number(storBox.y)+3, -20, 10).attr({rx:2, ry:2, fill: 'white'}),
    getBlack = drawMyrect(storBox.x2-51, Number(storBox.y)+3, -20, 10).attr({rx:2, ry:2});

getRed.dblclick(() => {storSocket.emit('getRed')})
getSilver.dblclick(() => {storSocket.emit('getSilver')})
getBlack.dblclick(() => {storSocket.emit('getBlack')})

let pickP = s.circle(Number(s.select('#stor').attr('x'))+80, Number(s.select('#stor').attr('y'))+130, rr ).attr({
    stroke: 'black',
    opacity: 1,
    fill: stationFill
});


var bigGr = s.group(gr1a, gr1b, gr1c, gr1d, gr1e, gr1f).attr({ id: "bg1", }), //level1, red pcs

    bigGr2 = s.group(gr2a, gr2b, gr2c, gr2d, gr2e, gr2f).attr({ transform: transMatrix2 }); //level2, silver pcs

    bigGr3 = s.group(gr3a, gr3b, gr3c, gr3d, gr3e, gr3f).attr({ transform: transMatrix3 }); //level3, black pcs

s.rect(cp[0] - 5, cp[1] - 5, 30, 10).attr({
    opacity: 0.5,
    rx: 2,
    ry: 2
}); // layer over 3 points

var s_arm = s.line(s.select("#pt").attr("cx") - 80, s.select("#pt").attr("cy"), s.select("#pt").attr("cx"), s.select("#pt").attr("cy")).attr({ //robot arm
        id: "s_arm",
        stroke: "black",
        strokeWidth: 4,
    }),// -40 to holder, 30 to ,,,

    bx0 = s_arm.getBBox();
//console.log("bx0:: ", bx0)

var gr_2 = s.line(bx0.x, bx0.y - 7, bx0.x, Number(bx0.y) + 7).attr({ //gripper, base
        stroke: "#000000",
        strokeWidth: 4
    }),

    bx2 = gr_2.getBBox(),

    gr_u = s.line(bx2.x - 10, bx2.y, bx2.x, bx2.y).attr({ //gripper,upper side
        stroke: "#000000",
        strokeWidth: 4
    }),

    gr_d = s.line(bx2.x - 10, bx2.y2, bx2.x, bx2.y2).attr({ //gripper, down side
        stroke: "#000000",
        strokeWidth: 4
    }),

    gripper_s = s.group(s_arm, gr_2, gr_u, gr_d).attr({
        transform: new Snap.Matrix().rotate(-38, cp[0], cp[1])
    })

// utilities

let red1 = makeWkpc2(s,gr1a.children()[1].attr('cx'),gr1a.children()[1].attr('cy'),'red').attr({
    //opacity: 1,
    transform: gr1a.attr('transform')
    }),
    red2 = makeWkpc2(s,gr1b.children()[1].attr('cx'),gr1b.children()[1].attr('cy'),'red').attr({
        //opacity: 1,
        transform: gr1b.attr('transform')
    }),
    red3 = makeWkpc2(s,gr1c.children()[1].attr('cx'),gr1c.children()[1].attr('cy'),'red').attr({
        //opacity: 1,
        transform: gr1c.attr('transform')
    }),
    red4 = makeWkpc2(s,gr1d.children()[1].attr('cx'),gr1d.children()[1].attr('cy'),'red').attr({
        //opacity: 1,
        transform: gr1d.attr('transform')
    }),
    red5 = makeWkpc2(s,gr1e.children()[1].attr('cx'),gr1e.children()[1].attr('cy'),'red').attr({
        //opacity: 1,
        transform: gr1e.attr('transform')
    }),
    red6 = makeWkpc2(s,gr1f.children()[1].attr('cx'),gr1f.children()[1].attr('cy'),'red').attr({
        //opacity: 1,
        transform: gr1f.attr('transform')
    });

let sil1 = makeWkpc2(s,gr2a.children()[1].attr('cx'),gr2a.children()[1].attr('cy'),'white').attr({
    //opacity: 1,
    transform: gr2a.attr('transform')
    }),
    sil2 = makeWkpc2(s,gr2b.children()[1].attr('cx'),gr2b.children()[1].attr('cy'),'white').attr({
        //opacity: 1,
        transform: gr2b.attr('transform')
    }),
    sil3 = makeWkpc2(s,gr2c.children()[1].attr('cx'),gr2c.children()[1].attr('cy'),'white').attr({
        //opacity: 1,
        transform: gr2c.attr('transform')
    }),
    sil4 = makeWkpc2(s,gr2d.children()[1].attr('cx'),gr2d.children()[1].attr('cy'),'white').attr({
        //opacity: 1,
        transform: gr2d.attr('transform')
    }),
    sil5 = makeWkpc2(s,gr2e.children()[1].attr('cx'),gr2e.children()[1].attr('cy'),'white').attr({
        //opacity: 1,
        transform: gr2e.attr('transform')
    }),
    sil6 = makeWkpc2(s,gr2f.children()[1].attr('cx'),gr2f.children()[1].attr('cy'),'white').attr({
        //opacity: 1,
        transform: gr2f.attr('transform')
    });

sil1[0].animate({'cx': Number(sil1[0].attr('cx'))+9.5, 'cy': Number(sil1[0].attr('cy'))-4},500);
sil1[1].animate({'cx': Number(sil1[1].attr('cx'))+9.5, 'cy': Number(sil1[1].attr('cy'))-4},500);

sil2[0].animate({'cx': Number(sil2[0].attr('cx'))+9.5, 'cy': Number(sil2[0].attr('cy'))-2.5},500); 
sil2[1].animate({'cx': Number(sil2[1].attr('cx'))+9.5, 'cy': Number(sil2[1].attr('cy'))-2.5},500);

sil3[0].animate({'cx': Number(sil3[0].attr('cx'))+9.5, 'cy': Number(sil3[0].attr('cy'))-1},500); 
sil3[1].animate({'cx': Number(sil3[1].attr('cx'))+9.5, 'cy': Number(sil3[1].attr('cy'))-1},500);

sil4[0].animate({'cx': Number(sil4[0].attr('cx'))+9.5, 'cy': Number(sil4[0].attr('cy'))+1},500); 
sil4[1].animate({'cx': Number(sil4[1].attr('cx'))+9.5, 'cy': Number(sil4[1].attr('cy'))+1},500);

sil5[0].animate({'cx': Number(sil5[0].attr('cx'))+9.5, 'cy': Number(sil5[0].attr('cy'))+2.5},500); 
sil5[1].animate({'cx': Number(sil5[1].attr('cx'))+9.5, 'cy': Number(sil5[1].attr('cy'))+2.5},500);

sil6[0].animate({'cx': Number(sil4[0].attr('cx'))+9.5, 'cy': Number(sil6[0].attr('cy'))+4},500);
sil6[1].animate({'cx': Number(sil4[1].attr('cx'))+9.5, 'cy': Number(sil6[1].attr('cy'))+4},500);

let bla1 = makeWkpc2(s,gr3a.children()[1].attr('cx'),gr3a.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3a.attr('transform')
        }),
    bla2 = makeWkpc2(s,gr3b.children()[1].attr('cx'),gr3b.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3b.attr('transform')
        }),
    bla3 = makeWkpc2(s,gr3c.children()[1].attr('cx'),gr3c.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3c.attr('transform')
        }),
    bla4 = makeWkpc2(s,gr3d.children()[1].attr('cx'),gr3d.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3d.attr('transform')
        }),
    bla5 = makeWkpc2(s,gr3e.children()[1].attr('cx'),gr3e.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3e.attr('transform')
        }),
    bla6 = makeWkpc2(s,gr3f.children()[1].attr('cx'),gr3f.children()[1].attr('cy'),'black').attr({
        //opacity: 1,
        transform: gr3f.attr('transform')
        });
bla1[0].animate({'cx': Number(bla1[0].attr('cx'))+18, 'cy': Number(bla1[0].attr('cy'))-8.5},1000);
bla1[1].animate({'cx': Number(bla1[1].attr('cx'))+18, 'cy': Number(bla1[1].attr('cy'))-8.5},1000);

bla2[0].animate({'cx': Number(bla2[0].attr('cx'))+19, 'cy': Number(bla2[0].attr('cy'))-5},1000);
bla2[1].animate({'cx': Number(bla2[1].attr('cx'))+19, 'cy': Number(bla2[1].attr('cy'))-5},1000);

bla3[0].animate({'cx': Number(bla3[0].attr('cx'))+20, 'cy': Number(bla3[0].attr('cy'))-2},1000);
bla3[1].animate({'cx': Number(bla3[1].attr('cx'))+20, 'cy': Number(bla3[1].attr('cy'))-2},1000);

bla4[0].animate({'cx': Number(bla4[0].attr('cx'))+20, 'cy': Number(bla4[0].attr('cy'))+2},1000);
bla4[1].animate({'cx': Number(bla4[1].attr('cx'))+20, 'cy': Number(bla4[1].attr('cy'))+2},1000);

bla5[0].animate({'cx': Number(bla5[0].attr('cx'))+19, 'cy': Number(bla5[0].attr('cy'))+5},1000);
bla5[1].animate({'cx': Number(bla5[1].attr('cx'))+19, 'cy': Number(bla5[1].attr('cy'))+5},1000);

bla6[0].animate({'cx': Number(bla6[0].attr('cx'))+18, 'cy': Number(bla6[0].attr('cy'))+8.5},1000);
bla6[1].animate({'cx': Number(bla6[1].attr('cx'))+18, 'cy': Number(bla6[1].attr('cy'))+8.5},1000);

function setTransform(theta, x, y){
    return new Snap.Matrix().rotate(theta, x, y)
}

function drawMyrect(x, y, width, height){
    if (width < 0) {
        width = Math.abs(width)
        x = x - width
    }
    if (height < 0) {
        height = Math.abs(height)
        y = y - height
    }
    return s.rect(x, y, width, height)
}

function makeWkpc(s, x, y){
    let part1 = s.circle(x,y,3).attr({
        fill: 'yellow',
    }),
        part2 = s.circle(x,y,8).attr({
            fill: 'green',
        });
    return s.group(part2, part1).attr({opacity: 0})
}

function makeWkpc2(s, x, y, color){
    let part1 = s.circle(x,y,3).attr({
        fill: 'yellow',
    }),
        part2 = s.circle(x,y,8).attr({
            fill: color,
        });
    return s.group(part2, part1).attr({opacity: 0})
}

let fromAng = -38, toAng;
//fromAng: angle, toAng: angle, fromPos: realWorldPos, toPos: realWorldPos
function rotateGroup(group, fromPos, toPos){
    //console.log('from-to: ', fromPos, toPos)
    if (fromPos==0) fromAng = 35
    else if (fromPos==1) fromAng = 30
    else if (fromPos==2) fromAng = 18
    else if (fromPos==3) fromAng = 6
    else if (fromPos==4) fromAng = -6
    else if (fromPos==5) fromAng = -18
    else if (fromPos==6) fromAng = -30
    else if (fromPos==7) fromAng = -38

    if (toPos==0) toAng = 35
    else if (toPos==1) toAng = 30
    else if (toPos==2) toAng = 18
    else if (toPos==3) toAng = 6
    else if (toPos==4) toAng = -6
    else if (toPos==5) toAng = -18
    else if (toPos==6) toAng = -30
    else if (toPos==7) toAng = -38

    Snap.animate(fromAng, toAng, function(step){
        group = group.attr({
            transform: new Snap.Matrix().rotate(step, cp[0], cp[1])
        })
        if(retrieveMode || storeMode) pc = pc.attr({transform: new Snap.Matrix().rotate(step-fromAng, cp[0], cp[1])})
    }, Math.abs(fromPos-toPos)*550, mina.linear, function() {
        fromPos2 = toPos
        storeMode = false; retrieveMode = false;
        if (pc) {pc = pc.animate({opacity: 0}, 2000, mina.linear, () =>{})}
    })
}

function findCoords(the, x, y){
    let r2 = 89 * Snap.sin(the)/Snap.tan(the)
    return [x-r2, y-89*Snap.sin(the)]
}