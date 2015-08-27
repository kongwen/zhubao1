/**
 * @author zhouyuan
 * @version 1.0
 * @describe 满意度界面
 */

var options = {drawWidth:980,drawHeight:460,drawleftpadding:70,yNum:12,fontSize:14,drawtoppadding:40};
var optionsMin = {drawWidth:230,drawHeight:120,drawleftpadding:0,xinX:115,xinY:60,radius:45,borderWidth:7};

var optionsTrend = {xinX:258,xinY:120,radius:45,hoverRadius:50,borderWidth:20,fontSize:14};

var color =['#2a4e91','#8c7704','#3d8d2a','#ffae0d'];
var subcolor = ['#b49c19','#b6b413','#839d1d'];
var satDateName={"allService":"Overall","voice":"Voice","data":"Mobile internet"};
var linezheSat = [];

function drawSat(options,id,data){
    if($("#"+id)&&$("#"+id).size()>0){}else{return;}

	//获取数据
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
		font: "normal 14px GOTHIC",
		fill: "#b9b9b9"
	});
	
	var arcIni = canvas.display.arc({
        start: 0,
        end: 360,
        stroke: "1px #161616",
        radius:4
    });
	

	var rel = $("#"+id).attr("rel");

	var ini = function(data){
		var dataList = data[rel];
		if(rel=='keyArea'){
			drawLeftArea(dataList);
			dataList = dataList["area"];
		}

		var bottomX = dataList["bottomX"];
		linezheSat = [];
		drawSatTop(options,dataList,bottomX,canvas,lineIni,textIni,arcIni,satDateName);

	}
	ini(data);
}



function GetMaxInt(OldInt)	
{
   var SourceValue=OldInt
   var SourceLen=SourceValue.length
   var LastTowNum
   
      LastTowNum=SourceValue.substr(SourceLen-2,2)
    
   var Temp=100-LastTowNum
   var PerfectValue=parseInt(SourceValue)+parseInt(Temp)
        return PerfectValue
}

function drawLeftArea(data){//绘制左侧的area list
	var satified = data["verySatisfied"];
	var Marginal = data["satisfied"];
	var Dissatisfied = data["dissatisfied"];
	resetValue(satified,".Satisfied");
	resetValue(Marginal,".Marginal");
	resetValue(Dissatisfied,".Dissatisfied");
}

function resetValue(ary,target){
	var str = "";
	for(var i =0;i<ary.length;i++){
		var num = i+1;
		str += "<dd titles='"+ary[i]+"'><div><b >"+num+"</b>"+ary[i]+"</div></dd>";
	}
	$(str).appendTo($(target));
}


function drawSatTop(options,data,bottomX,canvas,lineIni,textIni,arcIni,satDateName){
	PDrawXY(options,lineIni,textIni,canvas,'0');
    DrawSatText(options,data,bottomX,lineIni,textIni,canvas,'0');
	
	DrawSatBar(options,data,bottomX,canvas);
	DrawSatNote(options,data,bottomX,textIni,arcIni,canvas,color);
	
	setTimeout(function(){
		DrawSatLine(options,data,bottomX,canvas,lineIni,textIni,arcIni);
	},200);
}


function bindSat(){
	$("#satUp").bind("click",function(){
		if($(".areaLeft").css("margin-left") != "0px"){
			$(".areaLeft").animate({"margin-left":"0"},500);
			$(this).removeClass("satIcon").addClass("satIconleft").animate({"margin-left":"200px"},500);;
		}else{
			$(".areaLeft").animate({"margin-left":"-220px"},500);
			$(this).removeClass("satIconleft").addClass("satIcon").animate({"margin-left":"0"},500);;
		}
	});
	bindNote();
}


 function bindNote(){
	$(".areaLeft dd").click(function(){
		if($(this).find(".canvasNote2").size()==0){
			$("<i class='canvasNote2' ></i>").appendTo($(this));
		}
		var note = $(this).attr("titles");
		$(".canvasNote2").hide();
		$(".canvasNote2",$(this)).show().text(note).css("left",0).css("top",0);
		setTimeout(function(){$(".canvasNote2").hide()},3000);
	});
 }
 
 
 
function drawSatMin(options,data,id,color,key,showTitle){
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
        font: "normal 12px GOTHIC",
        fill: "#b9b9b9"
    });

    var arcIni = canvas.display.arc({
        x:options.xinX,
        y:options.xinY,
        start: 180,
        end: 360,
        stroke: "1px #161616",
        radius:options.radius
    });

    var rate = data[key+"Rate"];
    var count = data[key];
    var yu = data["chartThresholds"];
    var yu1,yu2;
    var key1 = key.replace("total","");

    if(key1 == "Users"){
        yu1 = yu["allUserThresholds"][0];
        yu2 = yu["allUserThresholds"][1];
    }else if(key1 == "Vips"){
        yu1 = yu["vipThresholds"][0];
        yu2 = yu["vipThresholds"][1];
    }else if(key1 == "Areas"){
        yu1 = yu["areaThresholds"][0];
        yu2 = yu["areaThresholds"][1];
    }

    if(/%/.test(rate)){
        rate = rate.replace(/%/,"");
    }

    var wrapPiece = arcIni.clone({
        stroke: options.borderWidth+"px #1b1b1b"
    });
    if(rate<yu1){
        color= "#ab2d15";
    }else if(rate >=yu1 && rate<yu2){
        color="#d18005";
    }else{
        color="#429230";
    }
    var innerPiece= arcIni.clone({
        end:180+180*rate/100,
        stroke: options.borderWidth+"px "+color
    });

    var titleText = textIni.clone({
        x:options.xinX,
        y:options.xinY,
        origin: { x: "center", y: "center" },
        font: "normal 16px GOTHIC",
        text:rate+"%",
        fill: "#fff"
    });

    var startNum = textIni.clone({
        x:options.xinX-options.radius-options.borderWidth,
        y:options.xinY-10,
        origin: { x: "right", y: "top" },
        text:'0',
        fill: "#505050"
    });

    var EndNum = textIni.clone({
        x:options.xinX+options.radius+options.borderWidth,
        y:options.xinY-10,
        origin: { x: "left", y: "top" },
        text:'100',
        fill: "#505050"
    });

    var totalTitle=textIni.clone({
        x:options.xinX,
        y:options.xinY+18,
        origin: { x: "center", y: "center" },
        font: "normal 11px GOTHIC",
        text:"Total "+showTitle+":"+FormatNUM(count+""),
        fill: "#bfbfbf"
    });

    var dot1 = arcIni.clone({
        x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI/360*(-90)),
        y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI/360*(-90)),
        start:0,
        end:360,
        radius:2,
        fill: "#ab2d15"
    });

    var dot2Rate = -90+yu1*180/100;
    var dot2 = arcIni.clone({
        x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI /360*dot2Rate),
        y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI /360*dot2Rate),
        start:0,
        end:360,
        radius:2,
        fill: "#d18005"
    });

    var dot3Rate = -90+yu2*180/100;
    var dot3 = arcIni.clone({
        x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI /360*dot3Rate),
        y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI /360*dot3Rate),
        start:0,
        end:360,
        radius:2,
        fill: "#748e2c"
    });

    canvas.addChild(wrapPiece);
    setTimeout(function(){
        canvas.addChild(innerPiece);
    },200);
    canvas.addChild(titleText);
    canvas.addChild(startNum);
    canvas.addChild(EndNum);
    canvas.addChild(totalTitle);

    canvas.addChild(dot1);
    canvas.addChild(dot2);
    canvas.addChild(dot3);
    wrapPiece=null;titleText=null;startNum=null;EndNum=null;totalTitle=null;
    dot2=null;dot3=null;
    lineIni = null;textIni = null;arcIni=null;
}

var titleLength;
function DrawSatNote(options,data,xTitle,textIni,arcIni,canvas){//绘制图例下方的圈圈
	var dataList ={};
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth =300;

    //修正 dataList 顺序
    for(var d in satDateName){
        dataList[d] = data.number[d];
    }

	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	var i = 0;
	for(var x in satDateName){
		var length = xTitle[i].length;

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
			text:satDateName[x]
		}));
		canvas.addChild(noteText[i]);
		
		
		var conWidth = x.length*12;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-5,
				y: 10,
				width: 160,
				height: 30
		}));
		canvas.addChild(noteCon[i]);
		
		
		noteCon[i]._index = i;
		noteCon[i]._show = '1';
		noteCon[i].bind("click tap",function(){
				this.stop();
				var i = this._index;
				var isShow = this._show;

			
				var linezhe = linezheSat[i];
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
}



function DrawSatLine(options,data,bottomX,canvas,lineIni,textIni,arcIni){//绘制折线图
	var dataList = data.number;
	var j =0;
		
	for(var x in satDateName){

		if(x != "allService"){
		
			var data = dataList[x];
            if(!data){return;}
			var arc=[],line=[];
			var perWidth = options.drawWidth/7+5;
			var xWidth = (options.drawWidth-options.drawleftpadding)/(bottomX.length);
	
			for(var i =0;i<data.length;i++){
				
				var x = xWidth*i+perWidth/2.1+options.drawleftpadding+(7-data.length)*xWidth;
				var y = options.drawHeight-data[i]*(options.drawHeight-options.drawtoppadding)/100+2;
	
				var nextx = xWidth*(i+1)+perWidth/2.1+options.drawleftpadding+(7-data.length)*xWidth;
				var nexty = options.drawHeight-data[i+1]*(options.drawHeight-options.drawtoppadding)/100;
				arc.push(arcIni.clone({
						x: x,
						y: y,
						stroke: "2px "+color[j]
				}));
				
				line.push(lineIni.clone({
					start:{x:x+4,y:y},
					end:{x:nextx-4,y:nexty},
					stroke: "2px "+color[j]
				}));
				
				canvas.addChild(arc[i]);	
				canvas.addChild(line[i]);	
				
			}

			var ary =arc.concat(line);
			linezheSat.push(ary);
		}
		j++;
	}
}


function DrawSatBar(options,data,bottomX,canvas){
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100,
						fill: "#0aa"
	});
	var bar = [];
	var dataList = data.number["allService"];

    if(!dataList|| typeof dataList[0] =="undefined"){return;}

    var topPadding = options.drawtoppadding;
	var xWidth = (options.drawWidth-options.drawleftpadding)/(bottomX.length);
	
	var perWidth = options.drawWidth/7+5;
	for(var i =0;i<dataList.length;i++){
		var x = xWidth*i+perWidth/3+options.drawleftpadding+(7-dataList.length)*xWidth;
		var y = options.drawHeight-(((options.drawHeight-topPadding)/100)*dataList[i]);
		var width = perWidth/4;
		var height = ((options.drawHeight-topPadding)/100)*dataList[i];
		
		bar.push(rectangleIni.clone({
				x: x,
				y: y,
				width: width,
				height: height,
				fill: color[0]
		}));
		canvas.addChild(bar[i]);	
	}
	linezheSat.push(bar);
}


function DrawSatText(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度
		var lineShort=[],textX=[],textYleft=[],textYright=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记
		var leftMax = data.leftY;
		var rightMax = data.rightY;

		startDate = xTitle[0];
		endDate = xTitle[xTitle.length-1];
		setTitleDate(startDate,endDate);

		var unit = "";
		if(/[0-9]+%/.test(leftMax)){
			unit = "%";
			leftMax = leftMax.replace("%","");
		}
		
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var topPadding = options.drawtoppadding;
		var titleWidth = (drawWidth-drawleftpadding)/(xTitle.length);
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "right", y: "top" },
				text: parseInt(leftMax/(yNum-2)*j)+unit
			}));
			canvas.addChild(textYleft[j]);
	
		
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
			x:drawleftpadding+titleWidth*m+30,
			y:drawHeight+16,
			origin: { x: "left", y: "top" },
			fill:"#808080",
			text:dealDate(xTitle[m])
		}));
		canvas.addChild(textX[m]);
	}	
}


