/**
 * @author zhouyuan
 * @version 1.0
 */

var options = {drawWidth:950,drawHeight:330,drawleftpadding:70,yNum:12,fontSize:14,drawtoppadding:36,xPian:40,levelPian:20};
var optionsTop = {drawWidth:950,drawHeight:390,drawleftpadding:70,yNum:12,fontSize:11,drawtoppadding:40,xPian:0,levelPian:10};
var optionsPie = {drawWidth:960,drawHeight:360,radius:70,hoverRadius:80,xinX:200,xinY:200,fontSize:14,drawleftpadding:70};
var optionsPieMin = {drawWidth:230,drawHeight:100,radius:70,hoverRadius:80,fontSize:14,drawleftpadding:70,isMini:true};

var optionsMin = {drawWidth:230,drawHeight:80,drawleftpadding:15,yNum:11,isMini:true};
var color =['#3d8d2a','#3360b2','#be8006'];
var colorPie=['#3d8d2a',"#c58f24","#3762b0"];
var colorPie2=['#b52d2d',"#c58f24","#3760ab"];


var linezheOTT = [];//存储所有的折线
var linezheOTTTOP = [];


function PDrawXYOTT(options,lineIni,textIni,canvas){//绘制横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var topPadding = options.drawtoppadding || 20;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var isRight = arguments[4] || '1';
	
	var positionX = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawWidth,y:drawHeight},
			stroke: "2px #3a3a3a"
		});//横坐标线
	var positionYLeft = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawleftpadding,y:topPadding-15},
			stroke: "2px #3a3a3a"
		});//左侧纵标线
		
	
	if(isRight == '1'){
	var positionYRight = lineIni.clone({
			start:{x:drawWidth,y:drawHeight},
			end:{x:drawWidth,y:topPadding-15},
			stroke: "2px #3a3a3a"
		});//右侧纵坐标
		canvas.addChild(positionYRight);
	}
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	
}


//draw APP throughput
var curcanvas;
function drawOTTOutPut(options,id,data){
	if(data){
	var canvas = oCanvas.create({
        canvas: "#"+id,
        fps: 10
    });
	curcanvas = canvas;

	 var lineIni = canvas.display.line({
        stroke: "2px #747778",
        cap: "round"
    });

    var textIni = canvas.display.text({
        origin: { x: "left", y: "top" },
        font: "normal "+options.fontSize+"px GOTHIC",
        fill: "#b9b9b9"
    });

    var arcIni = canvas.display.arc({
        x: 0,
        y: 0,
		start:0,
		end:360,
        stroke: "2px #161616",
        radius:8
    });

	var ini = function(data){
		linezheOTT = [];
		var leftMax = data.leftY+"";
		options.drawleftpadding =70+(leftMax.length-4)*11;
		PDrawXYOTT(options,lineIni,textIni,canvas,'0');
		DrawOTTText(options,data,lineIni,textIni,canvas,'0');
		setTimeout(function(){
			DrawOTTBar(options,data,canvas,lineIni,textIni,arcIni);
		},200);
	}
	
	ini(data);
	}
}


function drawOTTOutPutPie(options,id,data,rel){
    if($("#"+id)&&$("#"+id).length>0){
        var canvas = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });
        canvas.clear();
        var lineIni = canvas.display.line({
            stroke: "2px #747778",
            cap: "round"
        });

        var textIni = canvas.display.text({
            origin: { x: "left", y: "top" },
            font: "normal "+options.fontSize+"px GOTHIC",
            fill: "#b9b9b9"
        });

        var arcIni = canvas.display.arc({
            x: 0,
            y: 0,
            start:0,
            end:360,
            pieSection: true,
            radius:8
        });

        var ini = function(data){
            drawOttPie(options,data,canvas,arcIni,textIni,lineIni,rel);
        }
        ini(data);
		ini = null;canvas=ini;lineIni = null;arcIni= null;
    }
}


//判断是否超出阈值
function isStream(stream,i){
	if(i>=stream){
		return true;
	}else{
		return false;
	}
}


function getNum(curValue,ary){
	var index = ary.length;
	for(var i =0;i<ary.length;i++){
		if(ary[i]<=curValue){
			index--;
		}
	}
	return index;
}

var pieces = [];
var firstArray = [];

function drawOttPie(options,data,canvas,arcIni,textIni,lineIni,rel){
	var dataList = data[rel]["accessType"];
	var rangeValues =  data[rel]["rangeValues"];
	var ranges = data[rel]["ranges"];
	var streamOkValue = data[rel]["streamOkValue"];
	var maxradius = getPieMax(rangeValues);

	if(!options.isMini){
		var pieradius = [66,58,52,48,43,36];
	}else{
		var pieradius = [20,16,14,12,9,8];
	}
	

if(!options.isMini){
	var dotListIni = canvas.display.dotList({
			pointList:[],
			stroke: "2px #222"
	});
	
	var indexList = [10,175,340,505,670,835,1000];
	var height = options.drawHeight;
	var lineAry =[];

	for(var y = 0;y<indexList.length;y++){
		lineAry.push(dotListIni.clone({//绘制横坐标的短线
				width:indexList[y],
				height:height,
				stroke: "1px #3e3d3d"
		}));
		canvas.addChild(lineAry[y]);		
	}
}	
	var rectangleIni = canvas.display.rectangle({//定义矩形
		x: 77,
		y: 87,
		width: 200,
		height: 100
	});
	
	var j =0;
	var textLine=[],textTitle=[],noteCon=[],pieces=[];
	var list = {"range1":"range1","range2":"range2","range3":"range3","range4":"range4","range5":"range5","range6":"range6"};
	setTimeout(function(){
	for(var x in list ){
		var temp = dataList[x];
		
		var end, lastEnd;
		pieces[j] = [];
		
		if(!options.isMini){
		
		
		var radius;
		if(getMaxRadius(rangeValues)/rangeValues[j]>51){
			radius = 10;
		}else{
			radius = 72*Math.pow(rangeValues[j]/getMaxRadius(rangeValues),0.5);
		}
			
		if(radius<10){
			radius = 10;
		}
			
		if(rangeValues[j]){
			textLine.push(textIni.clone({
				x:j*165+100,
				y:240-radius-30,
				origin: { x: "center", y: "top"},
				font: "normal 14px GOTHIC",
				text:FormatNUM(rangeValues[j]+""),
				fill: "#807f7f"
			}));
			canvas.addChild(textLine[j]);
		
		}
		if(ranges[j]){
			textTitle.push(textIni.clone({
				x:j*165+100,
				y:options.drawHeight,
				origin: { x: "center", y: "top" },
				font: "normal 16px GOTHIC",
				text:ranges[j],
				fill: "#fff"
			}));
			canvas.addChild(textTitle[j]);
		}	
	}
	
	
	
	for (var i = 0; i < temp.length; i++) {
			
			var rate =  temp[i].replace("%","");
			
			end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 90 : 0);
			var start = (i < 1 ? -88 : lastEnd+2);
			
			if(rate == 0){
				end = start-2;
				start = start-2;
			}
			var isStreams = isStream(streamOkValue,j);
			var colors;
			if(isStreams){
				colors = colorPie[i];
			}else{
				colors = colorPie2[i];
			}
			
		if(!options.isMini){
			pieces[j].push(arcIni.clone({
				x:j*165+98,
				y:240,
				start: 0,
				end: 0,
				radius:radius,
				fill:colors
			}).animate({
				start: start,
				end: end
			},800));		
			canvas.addChild(pieces[j][i]);
		}else{
			var radius;
			if(getMaxRadius(rangeValues)/rangeValues[j]>20){
				radius = 5;
			}else{
				radius =16*rangeValues[j]/getMaxRadius(rangeValues);
			}
			if(radius<5){
				radius = 5;
			}
			
			pieces[j].push(arcIni.clone({
				x:j*38+20,
				y:60,
				start: start,
				end: end,
				radius:radius,
				fill:colors
			}));
			canvas.addChild(pieces[j][i]);
		}
	
		lastEnd = end;
		pieces[j][i]._start = pieces[j][i].start;
		pieces[j][i]._end = pieces[j][i].end;	
	}
	
	
	if(!options.isMini){
	noteCon.push(rectangleIni.clone({
				x:j*170+10,
				y: 160,
				width:160,
				height:150
		}));

		canvas.addChild(noteCon[j]);
		
		
		noteCon[j]._index = j;
		noteCon[j]._num = j;
		noteCon[j]._top = 240-radius-40;
	}	
		
	j++;	
}	


	if(!options.isMini){
		for(var m =0;m<noteCon.length;m++){
			noteCon[m].bind("mouseleave touchleave", function () {
				if(this._show == "show"){
				this._show = "";
				var num = this._num;
				var me = pieces[num][0];
				var start = me._start;
				var end = me._end;
				var centerPoint = (end+start)/2;//获取饼图的中间
				if(centerPoint<0){
					centerPoint += 360;
				}
				
				if(centerPoint>270 && centerPoint<=360){
					me.x = me.x-1.5;
					me.y = me.y+5;
				}else if(centerPoint>0 && centerPoint<=90){
					me.x = me.x-3;
					me.y = me.y-3;
				}else if(centerPoint>90 && centerPoint<=180){
					me.x = me.x+3;
					me.y = me.y-3;
				}else if(centerPoint>180 && centerPoint<=270){
					me.x = me.x+3;
					me.y = me.y+3;
				}
				canvas.redraw();
				}
			}).bind("click tap", function () {
				var num = this._num;
				var top = this._top;
				if(this._show == "show"){
					this._show = "";
					$("#ottDetail").html("");

					var me = pieces[num][0];
					var start = me._start;
					var end = me._end;
					var centerPoint = (end+start)/2;//获取饼图的中间
					if(centerPoint<0){
						centerPoint += 360;
					}
					if(centerPoint>270 && centerPoint<=360){
						me.x = me.x-1.5;
						me.y = me.y+5;
					}else if(centerPoint>0 && centerPoint<=90){
						me.x = me.x-3;
						me.y = me.y-3;
					}else if(centerPoint>90 && centerPoint<=180){
						me.x = me.x+3;
						me.y = me.y-3;
					}else if(centerPoint>180 && centerPoint<=270){
						me.x = me.x+3;
						me.y = me.y+3;
					}
					canvas.redraw();
				}else{
					var me = pieces[num][0];
					var start = me._start;
					var end = me._end;
					var centerPoint = (end+start)/2;//获取饼图的中间
					if(centerPoint<0){
						centerPoint += 360;
					}
				
					if(centerPoint>270 && centerPoint<=360){
						me.x = me.x+1.5;
						me.y = me.y-5;
					}else if(centerPoint>0 && centerPoint<=90){
						me.x = me.x+3;
						me.y = me.y+3;
					}else if(centerPoint>90 && centerPoint<=180){
						me.x = me.x-3;
						me.y = me.y+3;
					}else if(centerPoint>180 && centerPoint<=270){
						me.x = me.x-3;
						me.y = me.y-3;
				}
				
				canvas.redraw();
					this._show = "show";
					$("#ottDetail").html("");
					drawDetail(data[rel]["streamingAppTop3"],num,"140px");
				}
			});
		}
}

},200);

}



function getMaxRadius(ary){
	var temp =0;
	for(var i =0;i<ary.length;i++){
		if(temp<ary[i]){
			temp = ary[i];
		}
	}
	
	return temp;
}


function getPieMax(data){
	var temp = 0;
	for(var i =0;i<data.length;i++){
		if(data[i]>=temp){
			temp = data[i];
		}
	}
	return temp;
}

//当点击饼图后绘制详细信息
function drawDetail(data,num,top){
	num++;
	var dataList = data["topRange"+num];
	var i =0;
	var textDetail = [],arcsDetail=[];
	var str = "<ul>";
	for(var x in dataList){	
		var item = i+1;
		str += "<li><div style='float:left;'><span>"+item+"</span>   "+dataList[x]["name"]+"</div><em style='color:#fff;font-style:normal;display:inline-block;float:right;'> "+dataList[x]["rate"]+"</em></li>";
		i++;
	}
	str += "</ul>";
	$("#ottDetail").html(str).attr("mode",num).css("left",(num-1)*165+20+"px").css("top",top);
}



function drawOTTTOP(options,id,data){

	var canvas = oCanvas.create({
        canvas: "#"+id,
        fps: 10
    });

	 var lineIni = canvas.display.line({
        stroke: "2px #747778",
        cap: "round"
    });

    var textIni = canvas.display.text({
        origin: { x: "left", y: "top" },
        font: "normal "+options.fontSize+"px GOTHIC",
        fill: "#b9b9b9"
    });

    var arcIni = canvas.display.arc({
        x: 0,
        y: 0,
		start:0,
		end:360,
        stroke: "2px #161616",
        radius:8
    });
	
	var ini = function(data){
		linezheOTTTOP = [];
		PDrawXYOTT(options,lineIni,textIni,canvas,'1');
		DrawOTTText(options,data,lineIni,textIni,canvas,'1');
		setTimeout(function(){
			DrawOTTTOPBar(options,data,canvas);
			DrawOTTTOPLine(options,data,canvas,lineIni,textIni,arcIni);
		},200);
		
		DrawOTTTOPNote(options,data,textIni,arcIni,canvas);
	}
	ini(data);
}

var OTTNOTES={"traffic":"Traffic (GBytes)","rate":"Rate (%)"};
function DrawOTTTOPNote(options,data,textIni,arcIni,canvas){//绘制图例下方的圈圈
	var dataList = data.number;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth =400;
	var xTitle = data.bottomX;
	
	var i = 0;
	
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	for(var x in OTTNOTES){
		var length = OTTNOTES[x].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 25,
			start:0,
			end:360,
			radius:6,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:25,
			font: "normal 14px GOTHIC",
			text:OTTNOTES[x]
		}));
		canvas.addChild(noteText[i]);
		
		var conWidth = OTTNOTES[x].length*9+20;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-10,
				y: 0,
				width: conWidth,
				height: 35
		}));
		canvas.addChild(noteCon[i]);
		
		
		noteCon[i]._index = i;
		noteCon[i]._show = '1';
		noteCon[i].bind("click tap",function(){
				this.stop();
				var i = this._index;
				var isShow = this._show;

			
				var linezhe = linezheOTTTOP[i];
				if(isShow == '1'){
					noteArc[i].stroke = "2px #666666";
					this._show = '0';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 0;
					}
				}else if(isShow == '0'){
					noteArc[i].stroke = "2px "+color[i];
					this._show = '1';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 1;
					}
				}
				
				canvas.redraw();	
		});
		
		lastWidth += options.fontSize*length+30;
		i++;
	}
	rectangleIni = null;
	
}

function DrawOTTTOPBar(options,data,canvas){
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100,
						fill: "#0aa"
	});
	var bar = [];
	var dataList = data.number["traffic"];
	var topPadding = options.drawtoppadding;
	var bottomX = data.bottomX;
	var rightMax  = Number(data.leftY);
	var yNum = 12;
	var drawHeight = options.drawHeight;
	for(var i =0;i<dataList.length;i++){
		var value = dataList[i];
		var perWidth = options.drawWidth/(dataList.length+1);
		var x = perWidth*i+perWidth/4.5+options.drawleftpadding;
		
		if(rightMax != 0){
			var y = drawHeight-value*drawHeight*11/(12*rightMax);
			var height = value*drawHeight*11/(12*rightMax);
		}else{
			var y = drawHeight;
			var height = 0;
		}
		var width = perWidth/4;
		
		bar.push(rectangleIni.clone({
				x: x,
				y: y,
				width: width,
				height:height,
				fill: color[0]
		}));
		canvas.addChild(bar[i],false);	
	}
	linezheOTTTOP.push(bar);
	dataList = null;bar = null;
}


function DrawOTTTOPLine(options,data,canvas,lineIni,textIni,arcIni){//绘制折线图
	var leftMax = Number(data.rightY.replace("%",""));
	var dataList = data.number;

	var data = dataList["rate"];
	var arcs=[],line=[];
	var topPadding = options.drawtoppadding;
	var yNum = 12;
	for(var i =0;i<data.length;i++){
		
		var perWidth = options.drawWidth/(data.length+1);
		
		var value = data[i].replace("%","");
		
		var x = perWidth*i+perWidth/4.5+options.drawleftpadding+perWidth/8;
		if(leftMax != 0){
			var y = options.drawHeight-value*options.drawHeight*11/(12*leftMax);
		}else{
			var y  = options.drawHeight;
		}

		arcs.push(arcIni.clone({
				x: x,
				y: y,
				radius:4,
				stroke: "2px "+color[1]
		}));
		
		canvas.addChild(arcs[i],false);		
		if(i<data.length-1){
			var nextvalue = data[i+1].replace("%","");
			var nextx = perWidth*(i+1)+perWidth/4.5+options.drawleftpadding+perWidth/8;
			
			if(leftMax != 0){
				var nexty = options.drawHeight-nextvalue*options.drawHeight*11/(12*leftMax);
			}else{
				var nexty  = options.drawHeight;
			}
		
			line.push(lineIni.clone({
				start:{x:x+4,y:y},
				end:{x:nextx-4,y:nexty},
				stroke: "2px "+color[1]
			}));
			canvas.addChild(line[i],false);	
		}		
		
	}
	
	var ary =arcs.concat(line);
	linezheOTTTOP.push(ary);
	dataList = null;line = null,ary = null,arcs = null;
	
}




function DrawOTTText(options,data,lineIni,textIni,canvas){//绘制横纵坐标刻度

		var lineShort=[],textX=[],textYleft=[],textYRight=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var xTitle = data.bottomX;
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记
		var leftMax = data.leftY;
		var rightMax = data.rightY;
		var isRight = arguments[5] || '0';
		
		
		var unit = "";
		if(/[0-9]+%/.test(leftMax)){
			unit = "%";
			leftMax = leftMax.replace("%","");
		}
		
		if(/[0-9]+%/.test(rightMax)){
			unit = "%";
			rightMax = rightMax.replace("%","");
		}
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var topPadding = options.drawtoppadding;
		var titleWidth = (drawWidth-drawleftpadding)/(xTitle.length+1.23)+options.levelPian;
	for(var j = 0;j<yNum-1;j++){//绘制纵坐标
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j-7,
				origin: { x: "right", y: "top" },
				fill:"#808080",
				font: "normal 12px GOTHIC",
				text: FormatNUM(leftMax/(yNum-2)*j+"")
			}));
		
		canvas.addChild(textYleft[j]);
		
		if(isRight == '1'){
			var temp =rightMax/(yNum-2)*j;
			var value= temp.toFixed(3);
			
			textYRight.push(textIni.clone({
				x:drawWidth+5,
				y:drawHeight-(drawHeight/(yNum-1))*j-7,
				origin: { x: "left", y: "top" },
				text: value+unit
			}));
			canvas.addChild(textYRight[j]);
		}
		
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/(yNum-1))*j-3},
			end:{x:drawWidth,y:drawHeight-(drawHeight/(yNum-1))*j-3},
			stroke: "1px #161616"
		}));
		canvas.addChild(lineheng[j]);
	}

	$("<span class='canvasNote' ></span>").appendTo(".chart");
	for(var m = 0;m<xTitle.length;m++)
	{	
		var str = shutStr(xTitle[m],12);
		var x = drawleftpadding+titleWidth*m+options.xPian;
		var y = drawHeight+20;
		textX.push(textIni.clone({
				x:x+13,
				y:y+20,
				origin: { x: "center", y: "top" },
				rotation: -50,
				font: "normal 12px GOTHIC",
				text:str
		}));
		textX[m]._title = xTitle[m];
		textX[m]._x = x;
		textX[m]._y = y;
		canvas.addChild(textX[m]);
		
		textX[m].bind("click tap",function(){
			var note = this._title;
			var x = this._x;
			var y = this._y;
			$(".canvasNote").show().text(note).css("left",x-20).css("top",y);
			setTimeout(function(){$(".canvasNote").hide()},3000);
			return false;
		});
	}	
}







function DrawOTTBar(options,data,canvas,lineIni,textIni,arcIni){
	var rectangleIni = canvas.display.rectangle({//定义矩形
		x: 77,
		y: 87,
		width: 200,
		height: 100,
		fill: "#0aa"
	});
	
	var datas = data.number;

	var max = data.leftY;
	var topPadding = options.drawtoppadding;
	var bottomX = data.bottomX;
	var j =0;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth =300;
	
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	var lists = {"2G":"2G","3G":"3G","LTE":"LTE"};
	if(bottomX.length>0){
	for(var title in lists){
		var dataList = datas[title];
		var bar = [];
		
		
		

		var length = bottomX[j].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 15,
			start:0,
			end:360,
			radius:6,
			stroke: "2px "+color[j]
		}));

		canvas.addChild(noteArc[j],false);		

		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:15,
			text:title
		}));
		canvas.addChild(noteText[j],false);
		
		
		var conWidth = title.length*9+40;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-10,
				y: 5,
				width: conWidth,
				height: 30
		}));
		canvas.addChild(noteCon[j],false);
		
		
		noteCon[j]._index = j;
		noteCon[j]._show = '1';
		noteCon[j].bind("click tap",function(){
				this.stop();
				var j = this._index;
				var isShow = this._show;

			
				var linezhe = linezheOTT[j];
				if(isShow == '1'){
					noteArc[j].stroke = "2px #666666";
					this._show = '0';
					for (var m = 0; m < linezhe.length; m++) {
						linezhe[m].opacity = 0;
					}
				}else if(isShow == '0'){
					noteArc[j].stroke = "2px "+color[j];
					this._show = '1';
					for (var m = 0; m < linezhe.length; m++) {
						linezhe[m].opacity = 1;
					}
				}
				
				canvas.redraw();	
		});
		
		lastWidth += options.fontSize*length+30;
		
		
		for(var i =0;i<dataList.length;i++){
		
			var perWidth = options.drawWidth/(dataList.length+1);
			var x = perWidth*i+perWidth/4.5+options.drawleftpadding;
			var y = options.drawHeight-dataList[i]*options.drawHeight*11/(12*max);
			var width = perWidth/4;
			var height = dataList[i]*options.drawHeight*11/(12*max);
		
			bar.push(rectangleIni.clone({
				x: x+j*width,
				y: y,
				width: width,
				height:height,
				fill: color[j]
			}));
			canvas.addChild(bar[i]);
		}
		linezheOTT.push(bar);
		
		j++;
	}
	}
	
}



function DrawOTTBarMin(options,id,data){
    if($("#"+id)&&$("#"+id).length>0){
        var canvas = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });
        var rectangleIni = canvas.display.rectangle({//定义矩形
            x: 77,
            y: 87,
            width: 22,
            height: 10,
            fill: "#0aa"
        });

        var datas = data.number;
        var topPadding = options.drawtoppadding;
        var bottomX = data.bottomX;
		var max = data.leftY;
        var noteArc = [],noteText = [];
        var lastWidth =30;
        var j =0;
		var lists = {"2G":"2G","3G":"3G","LTE":"LTE"};
        for(var title in lists){
            var dataList = datas[title];
            var bar = [];

            for(var i =0;i<dataList.length;i++){
                var perWidth = options.drawWidth/(dataList.length+1);
                var x = perWidth*i+perWidth/4.5+options.drawleftpadding;
                var y = options.drawHeight-((options.drawHeight/max)*dataList[i]);
                var width = perWidth/4;
                var height = (options.drawHeight/max)*dataList[i];

                bar.push(rectangleIni.clone({
                    x: x+j*width,
                    y: y,
                    width: width,
                    height: height,
                    fill: color[j]
                }));
                canvas.addChild(bar[i]);
            }
            j++;
        }

    }

}



function OTTBindChange(data){
    var ottArg = window.PageArgs.ottArg;

    if(ottArg){
        var dd = $("#OttTabTitle li[rel='"+ottArg+"']");
        chanageState(dd);
    }

	$("#OttTabTitle>li").bind("tap",function(){
        chanageState($(this));
	});

    function chanageState(obj){
        $("#OttTabTitle>li").removeClass("active");
        obj.addClass("active");
        var rel = obj.attr("rel");
        $("#canvasOTT").remove();
        $(".tabContent").html("<div class='OttVertical'>NO. of transactions</div><canvas id='canvasOTT' width='1024px' height='470px'  style='margin-left:12px;'></canvas>");
        var throughdata = data["appThroughput"][rel];
        drawOTTOutPut(options,"canvasOTT",throughdata);//绘制主曲线图
        $("#ottDetail").html("");
        window.PageArgs.ottArg=null;
    }
}


function OTTPUTBindChange(data){
	$("#OttTabTitle>li").bind("tap",function(){
		$("#OttTabTitle>li").removeClass("active");
		$(this).addClass("active");
		$("#canvasOTTOverAll").remove();
		$(".tabContent").html("<div id='ottDetail'></div><canvas id='canvasOTTOverAll' width='1024px' height='470px' ></canvas>");
		var rel = $(this).attr("rel");
		
		var throughdata = data["overallThroughput"];
		drawOTTOutPutPie(optionsPie,"canvasOTTOverAll",throughdata,rel);//绘制主曲线图
	});
}


function DrawOTTTOPMin(id,data){
	var bottomX = data.bottomX;
	var str = "<ul>";
	var length = bottomX.length;
	if(bottomX.length>3){
		length = 3;
	}
	for(var i =0;i<length;i++){
		var num = i+1;
		var strs =shutStr(bottomX[i],22);
		str += "<li><span class='iconItem' style='margin-top:9px;' >"+num+"</span>"+strs+"</li>";
	}
	str += "</ul>";
	$("#"+id).html(str);
}
