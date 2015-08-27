/**
 * @author zhouyuan
 * @version 1.0
 */

var options = {drawWidth:920,drawHeight:150,drawleftpadding:86,yNum:7,fontSize:12,drawtoppadding:20,xPian:0,levelPian:0};
var optionsTop = {drawWidth:935,drawHeight:410,drawleftpadding:70,yNum:13,fontSize:12,drawtoppadding:40,xPian:0,levelPian:10};

var optionsMin = {drawWidth:230,drawHeight:100,drawleftpadding:15,yNum:7,isMini:true,drawtoppadding:0,xPian:0,levelPian:0};
var color =['#3aaee3','#a2ca33','#3aaee3','#a2ca33'];
var colorV = ["#364606","#d07407"];
var linezheRISK = [];
var riskList = 0;
var linezheRISKBarV = [];
var canvas1;
var canvas2;

function drawRiskchurn(options,id,data,rel,show){
    if($("#"+id)&&$("#"+id).size()>0){}else{return;}

	var canvas = oCanvas.create({
        canvas: "#"+id,
        fps: 10
    });

	if(id =="canvasRISK"){
		canvas1 =canvas;
	}
	
	if(id =="canvasRISKPost"){
		canvas2 =canvas;
	}
	
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
		PDrawXY(options,lineIni,textIni,canvas,'1');
		var xTitle = data["bottomX"];
		var chDate = data[rel];
		DrawRISKText(options,chDate,xTitle,lineIni,textIni,canvas,'1');
		DrawRISKBar(options,chDate,canvas,xTitle);
		DrawRISKLine(options,chDate,canvas,lineIni,textIni,arcIni);
		if(show == '1'){
			DrawRISKNote(options,chDate,xTitle,textIni,arcIni,canvas);
		}
	}
	ini(data);
}


function GetMaxInt(OldInt)	
{
   var SourceValue=OldInt+"";
   var SourceLen=SourceValue.length;
   var LastTowNum;
   LastTowNum=SourceValue.substr(SourceLen-2,2);
   
   var Temp=100-LastTowNum;
   var PerfectValue=parseInt(SourceValue)+parseInt(Temp);
   return PerfectValue;
}


function drawRISKConsumption(options,id,data,rel){
    if($("#"+id)&&$("#"+id).size()>0){}else{return;}

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
	
	
	
	var canvasfixed = oCanvas.create({
        canvas: "#"+id+"fixed",
        fps: 10
    });

	 var lineInifixed = canvasfixed.display.line({
        stroke: "2px #747778",
        cap: "round"
    });

    var textInifixed = canvasfixed.display.text({
        origin: { x: "left", y: "top" },
        font: "normal "+options.fontSize+"px GOTHIC",
        fill: "#b9b9b9"
    });

    var arcInifixed = canvasfixed.display.arc({
        x: 0,
        y: 0,
		start:0,
		end:360,
        stroke: "2px #161616",
        radius:8
    });

	var ini = function(data){
		linezheRISKBarV = [];
		DrawRISKXYV(options,lineInifixed,textInifixed,canvasfixed,'0');
		DrawRISKTextV(options,data,lineIni,textIni,canvas,textInifixed,canvasfixed);
		
		setTimeout(function(){
			DrawRISKBarV(options,data,canvas,lineIni);
			DrawRISKNoteV(options,data,textInifixed,arcInifixed,canvasfixed,canvas);
		},200);
		var xTitle = data.bottomX;
		if(xTitle.length>13){
			bindDrag();
		}
	}
	ini(data);
}

function bindDrag(){
	$("#riskCon").off("swipeleft");
	$("#riskCon").on("swipeleft",function(){
		$("#canvasRISKConsumption").stop().animate({"margin-left":"-860px"},1000);
		return false;
	});
	$("#riskCon").off("swiperight");
	$("#riskCon").on("swiperight",function(){
		$("#canvasRISKConsumption").stop().animate({"margin-left":"0px"},1000);
		return false;
	});
}


function DrawRISKXYV(options,lineIni,textIni,canvas){//绘制横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var topPadding = options.drawtoppadding || 20;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;

	var positionX = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:2000,y:drawHeight},
			stroke: "1px #151515"
		});//横坐标线
	var positionYLeft = lineIni.clone({
			start:{x:drawleftpadding+5,y:drawHeight},
			end:{x:drawleftpadding+5,y:topPadding-7},
			stroke: "1px #3a3a3a"
		});//左侧纵标线
		
	
	
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	
}



function drawRISKConMin(options,data,id){
    if($("#"+id)&&$("#"+id).size()>0){}else{return;}

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
        DrawRISKBarV(options,data,canvas,lineIni);
    }
    ini(data);
}



function DrawRISKMIN(options,data,id){
    if($("#"+id)&&$("#"+id).size()>0){}else{return;}

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

    DrawRISKBar(options,data,canvas);
    DrawRISKLine(options,data,canvas,lineIni,textIni,arcIni);
}

function DrawRISKNoteV(options,data,textIni,arcIni,canvas,canvasO){//绘制图例下方的圈圈
	var dataList = data.number;
	var xTitle = data.bottomX;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth =680;
	
	var i = 0;
	
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	var vNOte={"goodQuality":"Good Quality","poorQuality":"Poor Quality"};
	for(var x in vNOte){
		var length = xTitle[i].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 10,
			start:0,
			end:360,
			radius:6,
			stroke: "2px "+colorV[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:10,
			text:vNOte[x]
		}));
		canvas.addChild(noteText[i]);
		
		
		var conWidth = x.length*9;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-5,
				y: 0,
				width: conWidth,
				height: 30
		}));
		canvas.addChild(noteCon[i]);
		
		
		noteCon[i]._index = i;
		noteCon[i]._show = '1';
		noteCon[i].bind("click tap",function(){
				this.stop();
				var i = this._index;
				var isShow = this._show;
				var linezhe = linezheRISKBarV[i];
				if(isShow == '1'){
					noteArc[i].stroke = "2px #666666";
					this._show = '0';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 0;
					}
				}else if(isShow == '0'){
					noteArc[i].stroke = "2px "+colorV[i];
					this._show = '1';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 1;
					}
				}
				
				canvas.redraw();
				canvasO.redraw();
		});
		
		
		lastWidth += options.fontSize*length+65;
		i++;
		}
}


var riskNoteList = {"capitalLost":"Potential revenue lost","churnUsers":"Potential churn users"}
function DrawRISKNote(options,data,xTitle,textIni,arcIni,canvas){//绘制图例下方的圈圈
	var dataList = data.number;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth =670;
	
	var i = 0;
	
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	for(var x in riskNoteList){
		var length = xTitle[i].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 7,
			start:0,
			end:360,
			radius:6,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i],false);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:7,
			fill:"#666666",
			text:riskNoteList[x]
		}));
		canvas.addChild(noteText[i]);
		
		var conWidth = x.length*9;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-5,
				y: 0,
				width: conWidth,
				height: 30
		}));
		canvas.addChild(noteCon[i]);
		
		
		noteCon[i]._index = i;
		noteCon[i]._show = '1';
		noteCon[i].bind("click tap",function(){
				this.stop();
				var i = this._index;

				var isShow = this._show;
				if(i==0){
					var linezhe = linezheRISK[1];
					var linezhe2 = linezheRISK[3];
				}else{
					var linezhe = linezheRISK[0];
					var linezhe2 = linezheRISK[2];
				}

				if(isShow == '1'){
					noteArc[i%2].stroke = "2px #666666";
					this._show = '0';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 0;
					}
					
					for (var j = 0; j < linezhe2.length; j++) {
						linezhe2[j].opacity = 0;
					}
				}else if(isShow == '0'){
					noteArc[i%2].stroke = "2px "+color[i];
					this._show = '1';
					for (var j = 0; j < linezhe.length; j++) {
						linezhe[j].opacity = 1;
					}
					for (var j = 0; j < linezhe2.length; j++) {
						linezhe2[j].opacity = 1;
					}
					
				}
				
				canvas1.redraw();	
				canvas2.redraw();
		});
		
		
		lastWidth += options.fontSize*length+33;
		i++;
		riskList++;
		}
}


function DrawRISKBarV(options,data,canvas,lineIni){
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100,
						fill: "#0aa"
	});
	

	var datas = data.number;
	var bottomX = data.bottomX;
	var leftYTop  = data.leftYTop;
	var leftYBottom  = data.leftYBottom;
	var Max = leftYTop;
	var yNum = options.yNum;
	var j =0;
	var drawleftpadding= 0;
		var newBottom = leftYBottom;
		var newTop = leftYTop;
		if(newTOPV){
			newBottom = newBottomV;
			newTop = newTOPV;
		}
		
		var newHeight = newTop-newBottom;
		var topPadding = options.drawtoppadding;
		
		var zeroHeight = options.drawHeight+(newBottom)*(options.drawHeight-topPadding)/newHeight;
		
		if(!options.isMini){	
			var lineheng = lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding,y:zeroHeight},
				end:{x:2000,y:zeroHeight},
				stroke: "1px #292929"
			});
			canvas.addChild(lineheng);
		}
		
	for(var title in datas){

		var bar = [];
		var dataList = datas[title];
		
		
		
		
		
		if(!options.isMini){
			var length = dataList.length>13?13:dataList.length;
		}else{
			var length = dataList.length>8?8:dataList.length;
		}
			
		for(var i =0;i<dataList.length;i++){	
			var value = dataList[i];
			var perWidth = options.drawWidth/(length+1);
			var x = perWidth*i+perWidth/4.2+drawleftpadding;
			var y = zeroHeight;
		
			 if(!options.isMini){
				var width = perWidth/4;
			}else{
				var width = 12;
			}

			var height = (zeroHeight-topPadding+6)*(dataList[i]/newTop);
			if(title =='goodQuality'){
				bar.push(rectangleIni.clone({
					x: x,
					y: y-height,
					width: width,
					height: height,
					fill: "#232f00"
				}));
				canvas.addChild(bar[i]);	
			}else{
				bar.push(rectangleIni.clone({
					x: x,
					y: y-height,
					width: width,
					height: height,
					fill: "#d07407"
				}));
				canvas.addChild(bar[i]);	
			}
			
		}
		if(!options.isMini){	
			linezheRISKBarV.push(bar);
		}
	}
}



function DrawRISKBar(options,data,canvas,xTitle){
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100,
						fill: "#0aa"
	});
	var bar = [];
	var dataList = data.number["churnUsers"];
	var topPadding = options.drawtoppadding;
	var bottomX = data.bottomX;
	var Max  = data.leftY;
	var perWidth = options.drawWidth/9;
	if(!options.isMini){	
		var width = perWidth/5;
	}else{
		var width = perWidth/2;
	}
	
	var titleWidth = (options.drawWidth-options.drawleftpadding)/8+options.levelPian;
	for(var i =0;i<dataList.length;i++){
		var value = dataList[i];

		var x = options.drawleftpadding+titleWidth*i+options.xPian-15+perWidth/2+(8-dataList.length)*titleWidth;
		var y = options.drawHeight-(((options.drawHeight-topPadding)/Max)*value);
		
		var height = ((options.drawHeight-topPadding)/Max)*value;
		
		bar.push(rectangleIni.clone({
			x: x,
			y: y,
			width: width,
			height: height,
			fill: "#a2ca33"
		}));
		
		canvas.addChild(bar[i]);	
	}
	if(!options.isMini){		
		linezheRISK.push(bar);
	}
}


function DrawRISKLine(options,data,canvas,lineIni,textIni,arcIni){//绘制折线图
	var Max = data.rightY.replace("$","").replace("K","");
	var dataList = data.number;
	var data = dataList["capitalLost"];
	var arcs=[],line=[];
	
	var topPadding = options.drawtoppadding;
	var titleWidth = (options.drawWidth-options.drawleftpadding)/8+options.levelPian;
	var perWidth = options.drawWidth/9;
	for(var i =0;i<data.length;i++){
		
		var value = data[i];

		var x = options.drawleftpadding+titleWidth*i+options.xPian-7+perWidth/2+(8-data.length)*titleWidth;	
		
		var y = options.drawHeight-(((options.drawHeight-topPadding)/Max)*value);

		var nextx = options.drawleftpadding+titleWidth*(i+1)+options.xPian-7+perWidth/2+(8-data.length)*titleWidth;	
		var nexty = options.drawHeight-(((options.drawHeight-topPadding)/Max)*data[i+1]);
		if(!options.isMini){	
			arcs.push(arcIni.clone({
				x: x,
				y: y,
				radius:4,
				stroke: "2px #3aaee3"
			}));
		}else{
			arcs.push(arcIni.clone({
				x: x,
				y: y,
				radius:2.5,
				stroke: "2px #3aaee3"
			}));
		}
				
		
		line.push(lineIni.clone({
			start:{x:x+4,y:y},
			end:{x:nextx-4,y:nexty},
			stroke: "2px #3aaee3"
		}));	
		canvas.addChild(arcs[i]);	
		canvas.addChild(line[i]);	
	}
	
	
	if(!options.isMini){		
		var ary =arcs.concat(line);
		linezheRISK.push(ary);
	}
}


var newTOPV,newBottomV;
function DrawRISKTextV(options,data,lineIni,textIni,canvas,text2,canvas2){//绘制横纵坐标刻度

		var lineShort=[],textX=[],textYleft=[],textYRight=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记
		var xTitle = data.bottomX;
		
		var leftYTop = data.leftYTop;
		var leftYBottom = data.leftYBottom;


		var leftPerHeight = drawHeight/yNum;
		var topPadding = options.drawtoppadding;
		
		var length = xTitle.length>13?13:xTitle.length;
		if(xTitle.length>10){
			var titleWidth = (drawWidth-drawleftpadding)/(length+2)+options.levelPian;
		}else if(xTitle.length<10 && xTitle.length>7){
			var titleWidth = (drawWidth-drawleftpadding)/(length+1.1)+options.levelPian;
		}else{
			var titleWidth = (drawWidth-drawleftpadding)/(length+1)+options.levelPian;
		}
		var newTop = GetMaxInt(leftYTop);
		var newBottom = 0-GetMaxInt(0-leftYBottom);
		var newHeight = newTop-newBottom;
	
		var ArrayTemp1 = new Array();//Y所有值
        var ArrayTemp2 = new Array();//Y正值
        var ArrayTemp3 = new Array();//Y负值
		var Index=0;
		var list =[];
		var list2 =[];
		for(var i=1;i<11;i++)
		{
			ArrayTemp1[i-1]=newHeight*i/10;
		} 

		for(var i=0;i<10;i++)
		{
			if(parseInt(ArrayTemp1[i])<parseInt(newTop))
			{
				
				ArrayTemp2.push(ArrayTemp1[i]);
				Index=i+1;
			}
		}
 
		ArrayTemp2.push(ArrayTemp1[Index])
		for(var j=0;j<10;j++)
		{
			if(parseInt(ArrayTemp1[j])<parseInt(0-newBottom))
			{
				ArrayTemp3.push(0-ArrayTemp1[j]);
				Index=j+1;
			}
		}
 
		ArrayTemp3.push(0-ArrayTemp1[Index]);
		ArrayTemp2=ArrayTemp2.reverse();

		newTOPV = ArrayTemp2[0];
		newBottomV = ArrayTemp3[ArrayTemp3.length-1];
		ArrayTemp2.push(0);
		ArrayTemp2 = ArrayTemp2.concat(ArrayTemp3);
		ArrayTemp2 = ArrayTemp2.reverse();
	
	
	for(var j = 0;j<12;j++){//绘制纵坐标
			textYleft.push(text2.clone({
				x:60,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "right", y: "top" },
				text:FormatNUM(ArrayTemp2[j]+"")
			}));
		
		canvas2.addChild(textYleft[j]);
		
		
		
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/(yNum-1))*j},
			end:{x:2000,y:drawHeight-(drawHeight/(yNum-1))*j},
			stroke: "1px #161616"
		}));
		canvas.addChild(lineheng[j]);
	}

	
	for(var m = 0;m<xTitle.length;m++)
	{
		textX.push(textIni.clone({
			x:titleWidth*m+options.xPian+30,
			y:drawHeight+20,
			origin: { x: "right", y: "top" },
			rotation: -50,
			text:xTitle[m]+"B"
		}));
		canvas.addChild(textX[m]);
	}	
}

function DrawRISKText(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度

		var lineShort=[],textX=[],textYleft=[],textYRight=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记
		var leftMax = data.leftY;
		var rightMax = data.rightY;
		var isRight = arguments[6] || '0';
		
		startDate = xTitle[0];
		endDate = xTitle[xTitle.length-1];
		setTitleDate(startDate,endDate);
		
		var unit = "";
		
		
		rightMax = rightMax.replace("$","");
		rightMax = rightMax.replace("K","");
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var topPadding = options.drawtoppadding;
		var titleWidth = (drawWidth-drawleftpadding)/(xTitle.length-0.75)+options.levelPian;
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "right", y: "center" },
				fill:"#5b5a5a",
				text: FormatNUM(leftMax/(yNum-2)*j+"")
			}));
		
		canvas.addChild(textYleft[j]);
		
		if(isRight == '1'){
			textYRight.push(textIni.clone({
				x:drawWidth+5,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "left", y: "center" },
				fill:"#5b5a5a",
				text: "$"+FormatNUM(rightMax/(yNum-2)*j+"")+"k"
			}));
			canvas.addChild(textYRight[j]);
		}
		
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/(yNum-1))*j},
			end:{x:drawWidth,y:drawHeight-(drawHeight/(yNum-1))*j},
			stroke: "1px #161616"
		}));
		canvas.addChild(lineheng[j]);
	}

	
	for(var m = 0;m<xTitle.length;m++)
	{
		textX.push(textIni.clone({
			x:drawleftpadding+titleWidth*m+options.xPian-15,
			y:drawHeight+20,
			origin: { x: "left", y: "top" },
			font: "bold 12px GOTHIC",
			text:xTitle[m]
		}));
		canvas.addChild(textX[m]);
	}	
}



