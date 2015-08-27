/**
 * @author zhouyuan
 * @version 1.0
 * @describe pie chart Based on oCanvas graphic
 */

var options = {drawWidth:960,drawHeight:300,radius:60,hoverRadius:70,borderWidth:40,xinX:360,xinY:160,fontSize:14,drawleftpadding:70};
var options2 = {drawWidth:960,drawHeight:160,radius:70,hoverRadius:80,borderWidth:60,xinX:200,xinY:160,fontSize:14,drawleftpadding:70};
var options3 = {drawWidth:960,drawHeight:240,radius:70,hoverRadius:80,borderWidth:60,xinX:200,xinY:160,fontSize:14,drawleftpadding:70,yNum:12};
var optionsMin = {drawWidth:230,drawHeight:120,drawleftpadding:0,yNum:12,xinX:116,xinY:60,radius:30,hoverRadius:50,borderWidth:10};
var optionsMinDis = {drawWidth:230,drawHeight:120,drawleftpadding:0,yNum:12,xinX:116,xinY:60,radius:27,hoverRadius:50,borderWidth:17,fontSize:9};

var optionsTrend = {xinX:258,xinY:120,radius:45,hoverRadius:50,borderWidth:15,fontSize:12};
var trafficDateName={"totalDataTraffic":"Total Traffic","dataTraffic2G":"2G","dataTraffic3G":"3G","dataTrafficLTE":"LTE"};
var trafficVoiceName={"totalVoiceTraffic":"Total Traffic","voiceTraffic2G":"2G","voiceTraffic3G":"3G"};

var noteList = {"totalDataTraffic":"Total Traffic","dataTraffic2G":"2G","dataTraffic3G":"3G","dataTrafficLTE":"LTE",
				"totalVoiceTraffic":"Total Traffic","voiceTraffic2G":"2G","voiceTraffic3G":"3G",
				"deviceLimitation":"Device Limitation","contractLimitation":"Contract Limitation",
				"technicalIssues":"Technical Issues","normal":"Normal"
			   };
var canvasMainTri;
var xTitleTraffic;
var xTitle;


var color =['#d18005','#f7d206','#4078de','#4cb035',"#252525","#252525","#252525"];
var colorlight =['#fbce89','#fbe881','#669bfb','#9afa84',"#252525","#252525","#252525"];
var colorFill =['#985d02','#ab9205','#043da4','#209605',"#252525","#252525","#252525"];
var colorfill =['#75510b','#816f09','#244684','#144309',"#252525","#252525","#252525"];
var fill =['#241902','#241f01','#041219','#0d1e09'];
var color2 =['#eaa10f','#f7d206','#4078de','#4cb035'];
var subcolor = [['#cd5f05','#d38f28','#d38508'],['#b49c1a','#bab817','#869f20'],['#bbe9ff','#6fd1fd','#16a5e7'],['#20c776','#5abf42','#94cb28']];
var minColor = ["#b8d50d","#4078de","#36951f"];
var minColorBlack = ["#9bb212","#3b68b9","#0d5313"];

var color3 = ["#0fa8a7","#b8d50d","#396bc6","#36951f"];
var color3Fill = ["#02504f","#5e6d03","#04358d","#165f04"];
var color3light = ["#7af4f3","#e5f878","#7caaff","#86fa6a"];
var mainArcList=[];
var canvasMainTraffic;
var canvasTVoice;
var canvasData;

var dotPosition = {};
var dotValue = {};
var noteYP = 25;
var DotX = [];

function drawTraffic(options,id,data){
	//获取数据
	var canvas = oCanvas.create({
		canvas: "#"+id,
		fps: 10
	});
	
	var canvasLine = oCanvas.create({
		canvas: "#"+id+"Line",
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
	
	var lineIni2 = canvasLine.display.line({
		stroke: "2px #747778",
		cap: "round"
	});

	var textIni2 = canvasLine.display.text({
		origin: { x: "left", y: "top" },
		font: "normal 12px GOTHIC",
		fill: "#b9b9b9"
	});
	
	var arcIni = canvas.display.arc({
		x: options.xinX,
		y: options.xinY,
		stroke: "2px #161616",
		radius: options.radius
	});
	dotPosition = {};
	dotValue = {};
	DotX = [];
	noteCon=[];
		
	var list = ["Device Limitation","Contract Limitation","Technical Issues","Normal"];
	var ini = function(data){
		var ary = data["traficDistributionCircle"];
		var newary =[];
		if(ary.length>0){
		for(var i = 0;i<list.length;i++){
			var name = list[i];
			for(var j = 0;j<ary.length;j++){
				if(name == ary[j].name){
					newary.push(ary[j]);	
				}
			}
		}
		
		TrafficPie(options,newary,lineIni,textIni,arcIni,canvas);
		drawRightSub(options,newary,0,canvas,lineIni,textIni);
		drawTopNote(options,newary,canvas,arcIni,textIni);
		
		var xTitle =  data["bottomX"];
		var dataTrend = data["traficDistributionLine"];

		DrawtrafficText(options2,dataTrend,xTitle,lineIni2,textIni2,canvasLine);
		
		setTimeout(function(){
			trafficDrawLine(options2,dataTrend,lineIni2,textIni2,id+"Line",canvasLine);
			drawTrafficLine(options2,lineIni2,textIni2,canvasLine);
		},200);

		bindTapNote(options2,id+"Line",data,color,colorFill,colorlight,canvasLine,0);//点击曲线后显示详细信息
		}
	}
	ini(data);
}


//traffic trend主区域初始化函数
function drawTrafficTrend(options,id,data){

	var canvasLine = oCanvas.create({
		canvas: "#"+id+"Line",
		fps: 10
	});

	var voiceLine = oCanvas.create({
		canvas: "#voiceTraffictTrendLine",
		fps: 10
	});

	dotPosition = {};
	dotValue = {};
	DotX = [];
	noteCon=[];	
	var ini = function(data){
		var menuData =  data["menuData"];
		var menuVoice = data["menuVoice"];

		var ary = data["traficDistributionCircle"];
		if(ary.length>0){
		drawTrafficTrendTop(optionsTrend,menuData,"canvasTrafficTrend",45,minColor,"Data",1);	
		drawTrafficTrendTop(optionsTrend,menuData,"canvasTrafficTrend3",40,minColorBlack,"Data",1);	
		
		drawTrafficTrendTop(optionsTrend,menuVoice,"canvasTrafficTrend2",45,minColor,"Voice",1);	
		drawTrafficTrendTop(optionsTrend,menuVoice,"canvasTrafficTrend4",40,minColorBlack,"Voice",1);
		

		xTitle =  data["bottomX"];
		var dataTraficTrend = data["dataTraffictTrend"];
		var voiceTraficTrend = data["voiceTraffictTrend"];
		canvasMainTri = canvasLine;
		
		xTitleTraffic = xTitle;

		canvasTData = canvasLine;
		canvasTVoice = voiceLine;
		canvasMainTraffic = canvasTData;
		linezheTraffic=[];
		noteCon = [];
		TrafficbindChange(data,menuData,menuVoice,options3,canvasLine,voiceLine,'canvasTrafficTrendLine','voiceTraffictTrendLine');
		}
	}
	ini(data);
	canvasLine = null;voiceLine = null;ini = null;
}


var TipLine;
var TipArc = [];
var TipText,TipImage;
function bindTapNote(options,id,data,color,colorFill,colorlight,canvas,index){
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
		x: options.xinX,
		y: options.xinY,
		stroke: "2px #161616",
		radius: options.radius
	});
	
	var title = data.bottomX;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var height = 10*drawHeight/12;
	var dotListIni = canvas.display.dotList({
			pointList:[],
			stroke: "2px #222"
	});
	 $(document).tap(function(){
			if(TipLine){
				canvas.removeChild(TipLine);
				canvas.removeChild(TipText);
				canvas.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvas.removeChild(TipArc[i]);
				}
				TipArc = [];
				$(".tipContent").remove();
			}
	 });
	 
	 
	$("#lineCOns"+index).unbind("tap").tap(function(e){
		var pointer = getCoordInDocument(id,e);
		var xP = pointer.x;
		var yP =  pointer.y;

		var dotObj = getDotNum(xP);
		if(yP>=noteYP && dotObj){
		var dot = dotObj.p;
		var index = dotObj.i;
			if(TipLine){
				canvas.removeChild(TipLine);
				canvas.removeChild(TipText);
				canvas.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvas.removeChild(TipArc[i]);
				}
				TipArc = [];
			}
			
			$(".tipContent").remove();
			var n = 0;
			var hasshow = 0;
			var str="<div class='tipContent'>";
			var noteCon = canvas.noteCon;
			if(!noteCon){
				for(var x in dotValue){
					if(index>dotValue[x].length-1){
						var posValue = dotValue[x][dotValue[x].length-1];
						var position = dotPosition[x][dotPosition[x].length-1];
					}else{
						var posValue = dotValue[x][index];
						var position = dotPosition[x][index];
					}
					
					TipArc.push(arcIni.clone({
						x:  position[0],
						y: position[1],
						start:0,
						end:360,
						radius:5,
						fill:colorlight[n],
						stroke: "3px "+colorFill[n]
					}));
					canvas.addChild(TipArc[hasshow]);//绘制竖向虚线
					str += "<dl><dt style='color:"+color[n]+"'>"+noteList[x]+"</dt>";
						str += "<dd>"+posValue[1]+"</dd>";
					str += "</dl>";
					hasshow++;
				
					n++;
				}
			}else{
			for(var x in dotValue){
				//n=n%2;
				if(noteCon.length==0 || noteCon[n]._show == '1' ){
					if(index>dotValue[x].length-1){
						var posValue = dotValue[x][dotValue[x].length-1];
						var position = dotPosition[x][dotPosition[x].length-1];
					}else{
						var posValue = dotValue[x][index];
						var position = dotPosition[x][index];
					}
				
					TipArc.push(arcIni.clone({
						x:  position[0],
						y: position[1],
						start:0,
						end:360,
						radius:5,
						fill:colorlight[n],
						stroke: "3px "+colorFill[n]
					}));
					
					str += "<dl><dt style='color:"+color[n]+"'>"+noteList[x]+"</dt>";
						str += "<dd>"+posValue[1]+"</dd>";
					str += "</dl>";
					hasshow++;
				}
				n++;
			}
			}
			str += "</div>";
			$(str).appendTo($("#lineCOns"));
			if(hasshow>0){
				$(".tipContent").show();
				
				TipLine=dotListIni.clone({//绘制横坐标的短线
					width:dot,
					height:height,
					stroke: "1px #fff",
					ju:6
				});
				canvas.addChild(TipLine);//绘制竖向虚线
			
				TipImage = canvas.display.image({
						x: position[0],
						y: drawHeight,
						width:100,
						height:44,
						origin: { x: "center", y: "top" },
						image: "../css/images/tipsBg.png"
				});

				var indexs = data.dataTraffictTrend.number[x]?data.dataTraffictTrend.number[x].length:data.voiceTraffictTrend.number[x].length;
				var titleIndex = index+91-indexs>90?90:index+91-indexs;

				TipText = textIni.clone({
						x: position[0],
						y: drawHeight+20,
						font: "bold 14px GOTHIC",
						origin: { x: "center", y: "top" },
						text:title[titleIndex]
				});
				canvas.addChild(TipImage);
				canvas.addChild(TipText);
				
				for(var j = 0;j<hasshow;j++){
					canvas.addChild(TipArc[j]);//绘制竖向虚线
				
				}
			}
			var contentWidth = $(".tipContent").width();
			if(xP+10+contentWidth<=drawWidth){
				$(".tipContent").css("left",xP+10+"px").css("top","270px");
			}else{
				$(".tipContent").css("left",xP-contentWidth-20+"px").css("top","270px");
			}
			
			
		}else{
			if(TipLine){
				canvas.removeChild(TipLine);
				canvas.removeChild(TipText);
				canvas.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvas.removeChild(TipArc[i]);
				}
				TipArc = [];
			}
			$(".tipContent").remove();
		}
		return false;
	});
}


function getDotNum(x){
	for(var i =0;i<DotX.length;i++){
		if(x>=DotX[i] && x<=DotX[i+1]){
			return {'p':DotX[i],'i':i};
		}
	}

	if(x>DotX[DotX.length-1]){
		return {'p':DotX[DotX.length-1],'i':DotX.length-1};
	}
}

//绘制上方的饼图
function TrafficPie(options,data,lineIni,textIni,arcIni,canvas){
	var pieces = [], end, lastEnd,subEnd,subLastEnd,lines=[],lines2=[],texts=[],perTexts=[],wrapPieces=[],subs=[];
	var wrapPiece = canvas.display.arc({
		x: options.xinX,
		y:options.xinY,
		stroke: "8px #161616",
		radius:options.radius+36
	});
	
	var textPercent = canvas.display.text({
		origin: { x: "center", y: "top" },
		font: "normal 12px GOTHIC",
		fill: "#FFFFFF"
	});
	
	var mark = wrapPiece.clone({//右侧标记
		start: 0,
		end: 1,
		stroke: "6px #838383"
	});


	var rightSector = wrapPiece.clone({//右侧扇形
		x: options.xinX+options.radius+options.borderWidth-4,
		y: options.xinY,
		start: -19,
		end: 19,
		stroke: "0px #838383",
		fill: "linear-gradient(315deg, #484747, #000)",
		radius:200,
		pieSection: true
	});

	var CURINDEX = 0;

    if(!data || (data && data.length<=0)){
        return ;
    }
	var firstRate = data[0].rate.replace("%","");

	var first = 0-180/(100 / firstRate);
	var firstEnd = 0-first;

	for (var i = 0; i < data.length; i++) {

		var rate =  data[i].rate.replace("%","");
		end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ?firstEnd : 0);
		var start = (i < 1 ? first+2 : lastEnd+2);
		
		if(rate == 0){
			start = start;
			end = start;
		}
		
		if(end<start){
			end = start;
		}
			
		pieces.push(arcIni.clone({
			start: 0,
			end: 0,
			stroke: options.borderWidth+"px "+color[i]
		}).animate({
			start: start,
			end: end
		},400));
	
		wrapPieces.push(wrapPiece.clone({
			start: start-2,
			end: end
		}));
	
	
	
	
	var centerPoint = (end+start)/2;//获取饼图的中间
	if(centerPoint<0){
		centerPoint += 360;
	}
	var sins = Math.sin(2*Math.PI /360*centerPoint);
	var coss = Math.cos(2*Math.PI /360*centerPoint);
	
	var centerX = coss*(options.radius+options.borderWidth/2)+options.xinX;//饼图中间点坐标x
	var centerY = sins*(options.radius+options.borderWidth/2)+options.xinY;//饼图中间点坐标y
	
	var textY =  sins*(options.radius+options.borderWidth/2-20)+options.xinY;
	var textX =  coss*(options.radius+options.borderWidth/2-20)+options.xinX;
	
	var centerXEnd = coss*(options.radius+options.borderWidth/2+8)+options.xinX;
	var centerYEnd = sins*(options.radius+options.borderWidth/2+8)+options.xinY;

	//画饼图上的百分数
	perTexts.push(textPercent.clone({
		x:textX,
		y:textY-3,
		text:rate+"%"
	}));
	
	
	
	pieces[i]._index = i;

	canvas.addChild(wrapPieces[i]);//添加外部圈圈
	canvas.addChild(pieces[i]);
	canvas.addChild(perTexts[i]);
	lastEnd = end;

	pieces[i]._start = pieces[i].start;
	pieces[i]._end = pieces[i].end;
	pieces[i]._index = i;

   }
	pieces[0].stroke = pieces[0].stroke.replace(/^[0-9]+/,options.borderWidth+6);
	wrapPieces[0].stroke = "6px #303030";
	
	canvas.addChild(mark);//添加定位
	canvas.addChild(rightSector);

	var length = pieces.length;

	
	
	
	var moveni = function (type) {
		CURINDEX++;
		var temp = CURINDEX%length;

		var start = pieces[temp].start;
		var end = pieces[temp].end;
		var center = (start+end)/2;
		var index = pieces[temp]._index;
		
		center =getZheng(center);
		
		
		if(temp>0){
			pieces[temp-1].stroke = pieces[temp-1].stroke.replace(/^[0-9]+/,options.borderWidth);
			wrapPieces[temp-1].stroke = "6px #161616";
		}else if(temp== 0){
			pieces[length-1].stroke = pieces[length-1].stroke.replace(/^[0-9]+/,options.borderWidth);
			wrapPieces[length-1].stroke = "6px #161616";
		}
		pieces[temp].stroke = pieces[temp].stroke.replace(/^[0-9]+/,options.borderWidth+6);
		wrapPieces[temp].stroke = "6px #303030";
		for (var i = 0; i < pieces.length; i++) {
			var centerPoint = (pieces[i].end+pieces[i].start)/2-center;//获取饼图的中间
			if(centerPoint<0){
				centerPoint += 360;
			}

			pieces[i].stop().animate({
				start: pieces[i].start-center,
				end: pieces[i].end-center
			}, 300);
			
			
			wrapPieces[i].stop().animate({
				start: wrapPieces[i].start-center,
				end: wrapPieces[i].end-center
			}, 300);
			
			
			var sins = Math.sin(2*Math.PI /360*centerPoint);
			var coss = Math.cos(2*Math.PI /360*centerPoint);
			var textY =  sins*(options.radius+options.borderWidth/2-20)+options.xinY;
			var textX =  coss*(options.radius+options.borderWidth/2-20)+options.xinX;
			perTexts[i].x = textX;
			perTexts[i].y = textY-4;


		}
		drawRightSub(options,data,index,canvas,lineIni,textIni);
	}
	
	
	var moveshun = function (type) {
		CURINDEX--;
		if(CURINDEX == 0){
			CURINDEX = length;
		}else if(CURINDEX<0){
			CURINDEX += length;
		}
		var temp = CURINDEX%length;
		var start = pieces[temp].start;
		var end = pieces[temp].end;
		var center = 0-(start+end)/2;
		var index = pieces[temp]._index;
	
		
		center =getZheng(center);
		
		

		if(temp+1<length){
			pieces[temp+1].stroke = pieces[temp+1].stroke.replace(/^[0-9]+/,options.borderWidth);
			wrapPieces[temp+1].stroke = "6px #161616";
		}else{
			pieces[0].stroke = pieces[0].stroke.replace(/^[0-9]+/,options.borderWidth);
			wrapPieces[0].stroke = "6px #161616";
		}
		pieces[temp].stroke = pieces[temp].stroke.replace(/^[0-9]+/,options.borderWidth+6);
		wrapPieces[temp].stroke = "6px #303030";
		for (var i = 0; i < pieces.length; i++) {
			var centerPoint = (pieces[i].end+pieces[i].start)/2+center;//获取饼图的中间
			if(centerPoint<0){
				centerPoint += 360;
			}

			pieces[i].stop().animate({
				start: pieces[i].start+center,
				end: pieces[i].end+center
			},500);
			
			
			wrapPieces[i].stop().animate({
				start: wrapPieces[i].start+center,
				end: wrapPieces[i].end+center
			},500);
			
			
			var sins = Math.sin(2*Math.PI /360*centerPoint);
			var coss = Math.cos(2*Math.PI /360*centerPoint);
			var textY =  sins*(options.radius+options.borderWidth/2-20)+options.xinY;
			var textX =  coss*(options.radius+options.borderWidth/2-20)+options.xinX;
			perTexts[i].x = textX;
			perTexts[i].y = textY-4;


		}
		drawRightSub(options,data,index,canvas,lineIni,textIni);
		
	}
	
	
	$(document).off("swipeleft","#traSwip");
	$(document).on("swipeleft","#traSwip",function(){
		if($("#traSwip").attr("isLoack") != '1'){
			moveshun();
			$("#traSwip").attr("isLoack",'1');
			setTimeout(function(){
				$("#traSwip").attr("isLoack",'0');
			},500);
		}
		return false;
	});
	$(document).off("swipedown","#traSwip");
	$(document).on("swipedown","#traSwip",function(){
		if($("#traSwip").attr("isLoack") != '1'){
			moveshun();
			$("#traSwip").attr("isLoack",'1');
			setTimeout(function(){
				$("#traSwip").attr("isLoack",'0');
			},500);
		}
		return false;
	});
	$(document).off("swiperight","#traSwip");
	$(document).on("swiperight","#traSwip",function(){
		if($("#traSwip").attr("isLoack") != '1'){
			moveni();
			$("#traSwip").attr("isLoack",'1');
			setTimeout(function(){
				$("#traSwip").attr("isLoack",'0');
			},500);
		}
		return false;
	});
	$(document).off("swipeup","#traSwip");
	$(document).on("swipeup","#traSwip",function(){
		if($("#traSwip").attr("isLoack") != '1'){
			moveni();
			$("#traSwip").attr("isLoack",'1');
			setTimeout(function(){
				$("#traSwip").attr("isLoack",'0');
			},500);
		}
		return false;
	});

	
}

function getZheng(num){
	if(num<0){
		while(num<0){
			num+=360;
		}
	}
	
	if(num>360){
		while(num>360){
			num-=360;
		}
	}
	return num;
}

function drawTopNote(options,data,canvas,arcIni,textIni){//绘制上方的注释
	var note = [],noteArc=[],noteCon=[];

	var lastWidth = 46;
	
	var list = {"Device Limitation":"Device Limitation","Contract Limitation":"Contract Limitation","Technical Issues":"Technical Issues","Normal":"Normal(2G on 2G,3G on 3G,LTE on LTE)"}
	var m =0;
	for(var x in list){
		note.push(textIni.clone({
			x:lastWidth+16,
			y:20,
			text:list[x],
			fill: "#b9b9b9"
		}));
		
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 26,
			start:0,
			end:360,
			stroke: "2.5px "+color[m],
			radius:7
		}));
		
		
		canvas.addChild(note[m]);
		canvas.addChild(noteArc[m]);
		var length = list[x].length;
		lastWidth += 8*length+20;
		m++;
	}
}


var RightPieces = [],RightLines = [],RightLinesLevel=[],RightTexts=[];
function drawRightSub(options,data,index,canvas,lineIni,textIni){//传入参数表示当前显示第几个的详情
	
	var end, lastEnd;
	var subX = options.xinX+options.radius+options.borderWidth+140;
	var subY = options.xinY
	var arcIni = canvas.display.arc({
		x:subX-50,
		y:subY,
		stroke: "2px #161616"
	});
    if(!data ||(data && data.length<=0)){
        //判断是否没数据
        return;
    }
	var child = data[index].child;
	var allRate = data[index].rate.replace("%","");
	
	for(var j =0;j<RightPieces.length;j++){
		canvas.removeChild(RightPieces[j]);
		canvas.removeChild(RightLines[j]);	
		canvas.removeChild(RightLinesLevel[j]);	
		canvas.removeChild(RightTexts[j]);	
	}
	RightPieces=[];
	RightLines = [];
	RightLinesLevel=[];
	RightTexts=[];
	
	if(child.length>0){

	for(var i =0;i<child.length;i++){
		var rate = child[i].rate.replace("%","")*1;
		var rates;
		
		if(allRate == 0){
			rates = 68/child.length;
		}else if(allRate!=0){
			rates = 17*4*rate/allRate;
		}
		
		
		end = (i > 0 ? lastEnd : 0) + rates - (i < 1 ? 34 : 0);
		var start = (i < 1 ? -34 : lastEnd+1);
		if(end<start){
			end = start;
		}
		RightPieces.push(arcIni.clone({
			start: 0,
			end: 0,
			radius:80,
			stroke:"74px "+subcolor[index][i]
		}).animate({
			start: start,
			end: end
		},400));
	
	
		var centerPoint = (end+start)/2;
		

		var sins = Math.sin(2*Math.PI /360*centerPoint);
		var coss = Math.cos(2*Math.PI /360*centerPoint);
	
		var centerX = coss*(90+30)+subX-50;//??x??
		var centerY = sins*(90+30)+subY;//??y??
		var centerXEnd = coss*(90+64)+subX-50;
		var centerYEnd = sins*(90+64)+subY;
	
	
		RightLines.push(lineIni.clone({//绘制sub的横线
			start:{x:centerX,y:centerY},
			end:{x:centerXEnd,y:centerYEnd},
			stroke: "1px #a6a6a6"
		}));
		
		RightLinesLevel.push(lineIni.clone({//绘制sub的横线
			start:{x:centerXEnd,y:centerYEnd},
			end:{x:subX+135,y:centerYEnd},
			stroke: "1px #a6a6a6"
		}));
		
		RightTexts.push(textIni.clone({
			x:subX+145,
			y:centerYEnd-6,
			text:child[i].rate+"  "+child[i].name
		}));
		
		lastEnd = end;
		RightPieces[i]._start = RightPieces[i].start;
		RightPieces[i]._end = RightPieces[i].end;
		
		canvas.addChild(RightPieces[i]);
		canvas.addChild(RightLines[i]);
		canvas.addChild(RightLinesLevel[i]);
		canvas.addChild(RightTexts[i]);
	}
	}else{
		var rate = data[index].rate.replace("%","");
		var rates = 17*4*rate/allRate;
		var end = rates -34;
		var start = -34;
		if(end<start){
			end = start;
		}
		RightPieces.push(arcIni.clone({
			start: 0,
			end: 0,
			radius:80,
			stroke:"74px #4078de"
		}).animate({
			start: start,
			end: end
		},400));
	
		
		var centerPoint = (end+start)/2;
		var sins = Math.sin(2*Math.PI /360*centerPoint);
		var coss = Math.cos(2*Math.PI /360*centerPoint);
	
		var centerX = coss*(90+30)+subX-50;//??x??
		var centerY = sins*(90+30)+subY;//??y??
		var centerXEnd = coss*(90+64)+subX-50;
		var centerYEnd = sins*(90+64)+subY;
	
	
		RightLines.push(lineIni.clone({//绘制sub的横线
			start:{x:centerX,y:centerY},
			end:{x:centerXEnd,y:centerYEnd},
			stroke: "1px #a6a6a6"
		}));
		
		RightLinesLevel.push(lineIni.clone({//绘制sub的横线
			start:{x:centerXEnd,y:centerYEnd},
			end:{x:centerXEnd+36,y:centerYEnd},
			stroke: "1px #a6a6a6"
		}));
		
		RightTexts.push(textIni.clone({
			x:centerXEnd+46,
			y:centerYEnd-6,
			text:data[index].rate+"  "+data[index].name
		}));
	
		canvas.addChild(RightPieces[0]);
		canvas.addChild(RightLines[0]);
		canvas.addChild(RightLinesLevel[0]);
		canvas.addChild(RightTexts[0]);
	
	}
}



function drawTrafficLine(options,lineIni,textIni,canvas){//绘制traffic折线图
	 PTRADrawXY(options,lineIni,textIni,canvas,'0');
}


function PTRADrawXY(options,lineIni,textIni,canvas){//绘制横纵坐标
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
			end:{x:drawleftpadding,y:topPadding},
			stroke: "2px #3a3a3a"
		});//左侧纵标线
		
	

	var positionYRight = lineIni.clone({
			start:{x:drawWidth,y:drawHeight},
			end:{x:drawWidth,y:topPadding},
			stroke: "2px #000"
		});//右侧纵坐标
		canvas.addChild(positionYRight);
	
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	
}


function DrawtrafficText(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度
		var lineShort=[],textX=[],textYleft=[],textYright=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = 6;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = 91;//标记
		var leftMax = data.leftY;

		startDate = xTitle[0];
		endDate = xTitle[xTitle.length-1];
		setTitleDate(startDate,endDate);
		
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var titleWidth = (drawWidth-drawleftpadding)/13;
		for(var j = 0;j<=5;j++){//绘制纵坐标
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/yNum)*j-3,
				origin: { x: "right", y: "top" },
				text:j*20+"%"
			}));
		
		canvas.addChild(textYleft[j]);
	
	
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding-5,y:drawHeight-(drawHeight/yNum)*j},
			end:{x:drawWidth,y:drawHeight-(drawHeight/yNum)*j},
			stroke: "1px #393939"
		}));
		canvas.addChild(lineheng[j]);
	}

	
	for(var m = 0;m<14;m++)
	{
		lineShort.push(lineIni.clone({//绘制横坐标的短线
			start: { x: drawleftpadding+titleWidth*m, y: drawHeight },
			end: { x:drawleftpadding+titleWidth*m, y: drawHeight+5 },
			stroke: "2px #3a3a3a"
		}));

		canvas.addChild(lineShort[m],false);
		if(m==0){
			var num = 0;
		}else{
			var num = m*7-1
		}
		textX.push(textIni.clone({
			x:drawleftpadding+titleWidth*m,
			y:drawHeight+20,
			text:dealDate4(xTitle[num]),
			origin: { x: "center", y: "top" }
		}));
		canvas.addChild(textX[m]);
	}
		
}


function trafficDrawLine(options,data,lineIni,textIni,id,canvas){
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var yNum = options.yNum;//绘制纵坐标上刻度
	
	var xNum = 91;//标记
	var leftMax = data.leftYAll;
	var rightMax = data.rightY;
	
	var xWidth = (drawWidth-drawleftpadding)/xNum;
	var leftPerHeight = drawHeight/yNum;
	var dataList = data.number;//横坐标上有多少个点
	var dataListOri = jQuery.extend(true, {}, dataList);
	var trafficTargetDate={"normal":"normal",
							"technicalIssues":"technicalIssues",
							"contractLimitation":"contractLimitation",
							"deviceLimitation":"deviceLimitation"
						  };

	var trafficTargetDateRe={"deviceLimitation":"deviceLimitation",
							"contractLimitation":"contractLimitation",
							"technicalIssues":"technicalIssues",
							"normal":"normal"
							/*,"normal4GOn4G":"normal4GOn4G",
							"normal3GOn3G":"normal3GOn3G",
							"normal2GOn2G":"normal2GOn2G"*/
						  };
	/*var normalSub = {"normal4GOn4G":"normal4GOn4G",
					 "normal3GOn3G":"normal3GOn3G",
					"normal2GOn2G":"normal2GOn2G"};*/
	var normalSub = {};
	var m = 0;
	var lastx;


	for(var x in trafficTargetDate){
		if(m>0){
            if(!dataList[x]) return;

			for(var i =0;i<dataList[x].length;i++){
				dataList[x][i]  =  Number(dataList[x][i]);
				dataList[x][i] += Number(dataList[lastx][i]);
			}
		}
		lastx = x;
		m++;
	}
	
	var n = 0;
	var lastx;
	for(var x in normalSub){
		if(n>0){
			for(var i =0;i<dataList[x].length;i++){
				dataList[x][i] += dataList[lastx][i];
			}
		}
		lastx = x;
		n++
	}
	
	var lineListIni = canvas.display.lineListFill({
			pointList:[],
			stroke: "2px #fff",
			height:drawHeight
	});
	var i =0;
	var zheline = [];
	for (var x in trafficTargetDateRe){
		var title = x;
		var list = dataList[x];
		var list2 = dataListOri[x];
		var perWidth = xWidth/list.length;

		var lineshu =[];
		var linezhe =[];
		var lineAry = [];
		var lineValue = [];
		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			var curY = drawHeight-list[y]*drawHeight*5/(6*100);	

			var temp = [curX,curY];
			var temp2 = [curX,list2[y]];
			lineAry.push(temp);		
			lineValue.push(temp2);
			
			if(DotX.length<91 && !options.isMini){
				DotX.push(curX);
			} 	
		}
		
		dotPosition[x] = lineAry;//记录曲线坐标
		dotValue[x] = lineValue;
		if(fill[i]){
			zheline.push(lineListIni.clone({
				pointList:lineAry,
				stroke: "2px "+colorfill[i],
				fill:fill[i]
			}));
		}else{
			zheline.push(lineListIni.clone({
				pointList:lineAry,
				stroke: "1px "+color[i]
			}));
		}
		
		canvas.addChild(zheline[i]);
		i++;
	}

}


function drawTrafficMinTrend(options,data,id){

    if($("#"+id)&&$("#"+id).length>0){
        //获取数据
        var canvas2 = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });

        var lineIni = canvas2.display.line({
            stroke: "1px #747778",
            cap: "round"
        });

        var textIni = canvas2.display.text({
            origin: { x: "left", y: "top" },
            font: "normal 12px GOTHIC",
            fill: "#b9b9b9"
        });

        var arcIni = canvas2.display.arc({
            x: options.xinX,
            y: options.xinY,
            stroke: "2px #161616",
            radius: options.radius
        });
        var pieces = [],lines=[],linesLevel=[],texts=[];

        var centerData = textIni.clone({
            x:options.xinX,
            y:options.xinY,
            text:"Data",
            font: "bold 12px GOTHIC",
            origin: { x: "center", y: "center" }
        });

       for(var i =0;i<data.length;i++){
			for(var j =i;j<data.length;j++){
				if(j+1<data.length ){
					var nextRate = parseInt(data[j+1].rate.replace("px",""));
					var curRate = parseInt(data[j].rate.replace("px",""));
					if(nextRate>curRate){
					  var temp = data[j];
					  data[j] = data[j+1];
					 data[j+1] = temp;
					}
			  }
			}
	}


        for (var i = 0; i < data.length; i++) {

            var rate =  data[i].rate.replace("%","");
            end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 90 : 0);
            var start = (i < 1 ? -88 : lastEnd+2);
			
			if(rate == 0){
				start = start-2;
				end = start+2;
			}
			if(end<start){
				end = start;
			}


            pieces.push(arcIni.clone({
                start: 0,
                end: 0,
                stroke: options.borderWidth+"px "+minColor[i]
            }).animate({
			start: start,
			end: end
		},400));
	




            var centerPoint = (end+start)/2;//获取饼图的中间
            if(centerPoint<0){
                centerPoint += 360;
            }
            var sins = Math.sin(2*Math.PI /360*centerPoint);
            var coss = Math.cos(2*Math.PI /360*centerPoint);

            var centerX = coss*(options.radius+options.borderWidth/2)+options.xinX;//饼图中间点坐标x
            var centerY = sins*(options.radius+options.borderWidth/2)+options.xinY;//饼图中间点坐标y

            var textY =  sins*(options.radius+options.borderWidth/2-30)+options.xinY;
            var textX =  coss*(options.radius+options.borderWidth/2-30)+options.xinX;

            var centerXEnd = coss*(options.radius+options.borderWidth/2+8)+options.xinX;
            var centerYEnd = sins*(options.radius+options.borderWidth/2+8)+options.xinY;


if(i>=1 && parseInt(data[i].rate.replace("%",""))<10   && parseInt(data[i-1].rate.replace("%",""))<10){
			var sins2 = Math.sin(2*Math.PI /360*(centerPoint+70));
		    var coss2 = Math.cos(2*Math.PI /360*(centerPoint+70)); 
			
			var centerXEnd = coss2*(options.radius+options.borderWidth/2+15)+options.xinX;
		    var centerYEnd = sins2*(options.radius+options.borderWidth/2+15)+options.xinY;
		}
		
		
            lines.push(lineIni.clone({//绘制sub的横线
                start:{x:centerX,y:centerY},
                end:{x:centerXEnd,y:centerYEnd},
                stroke: "1px #a6a6a6"
            }));




            if(centerPoint>=90 && centerPoint<270){
                linesLevel.push(lineIni.clone({
                    start:{x:centerXEnd,y:centerYEnd},
                    end:{x:centerXEnd-80,y:centerYEnd}
                }));

                texts.push(textIni.clone({
                    x:centerXEnd-70,
                    y:centerYEnd,
                    text:data[i].name+"  "+data[i].rate,
                    origin: { x: "left", y: "bottom" }
                }));
            }else{
                linesLevel.push(lineIni.clone({
                    start:{x:centerXEnd,y:centerYEnd},
                    end:{x:centerXEnd+90,y:centerYEnd}
                }));

                texts.push(textIni.clone({
                    x:centerXEnd+30,
                    y:centerYEnd,
                    text:data[i].name+"  "+data[i].rate,
                    origin: { x: "left", y: "bottom" }
                }));
            }



            canvas2.addChild(pieces[i]);
            canvas2.addChild(lines[i]);
            canvas2.addChild(linesLevel[i]);
            canvas2.addChild(texts[i]);

            lastEnd = end;
            pieces[i]._start = pieces[i].start;
            pieces[i]._end = pieces[i].end;

        }

    };

}


function drawTrafficMinDistriBute(options,data,id,color){
    if($("#"+id)&&$("#"+id).length>0){
        //获取数据
        var canvas2 = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });

        var lineIni = canvas2.display.line({
            stroke: "1px #747778",
            cap: "round"
        });

        var textIni = canvas2.display.text({
            origin: { x: "left", y: "top" },
            font: "normal 12px GOTHIC",
            fill: "#b9b9b9"
        });

        var arcIni = canvas2.display.arc({
            x: options.xinX,
            y: options.xinY,
            stroke: "2px #161616",
            radius: options.radius
        });
        var pieces = [],lines=[],linesLevel=[],texts=[];


        for (var i = 0; i < data.length; i++) {

            var rate =  data[i].rate.replace("%","");
            end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 90 : 0);
            var start = (i < 1 ? -88 : lastEnd+2);
			
			if(rate == 0){
				start = start-2;
				end = start+2;
			}
			
			if(end<start){
				end = start;
			}


            pieces.push(arcIni.clone({
                start: 0,
                end: 0,
                stroke: options.borderWidth+"px "+color[i]
           }).animate({
			start: start,
			end: end
		},400));
	




            var centerPoint = (end+start)/2;//获取饼图的中间
            if(centerPoint<0){
                centerPoint += 360;
            }
            var sins = Math.sin(2*Math.PI /360*centerPoint);
            var coss = Math.cos(2*Math.PI /360*centerPoint);

            var centerX = coss*(options.radius+options.borderWidth/2)+options.xinX;//饼图中间点坐标x
            var centerY = sins*(options.radius+options.borderWidth/2)+options.xinY;//饼图中间点坐标y

            var textY =  sins*(options.radius+options.borderWidth/2-30)+options.xinY;
            var textX =  coss*(options.radius+options.borderWidth/2-30)+options.xinX;

            canvas2.addChild(pieces[i]);
            lastEnd = end;
            pieces[i]._start = pieces[i].start;
            pieces[i]._end = pieces[i].end;

        }
    }
}

//traffic trend top 饼图
function  drawTrafficTrendTop(options,data,id,radius,color,title,isBlack){
		//获取数据
		options.radius = radius;
		var canvas2 = oCanvas.create({
			canvas: "#"+id,
			fps: 10
		});
		canvas2.clear();
		var fontColor;
		if(isBlack){
			fontColor = "#b9b9b9";
		}else{
			fontColor = "#fff";
		}
	
		var lineIni = canvas2.display.line({
			stroke: "1px "+fontColor,
			cap: "round"
		});

		var textIni = canvas2.display.text({
			origin: { x: "left", y: "top" },
			font: "normal 12px GOTHIC",
			fill: fontColor
		});
	
		var arcIni = canvas2.display.arc({
			x: options.xinX,
			y: options.xinY,
			stroke: "2px #161616",
			radius:radius
		});
	var pieces = [],lines=[],linesLevel=[],texts=[];

	var centerData = textIni.clone({
		x:options.xinX,
		y:30,
		text:title,
		font: "bold 20px GOTHIC",
		origin: { x: "center", y: "center" }
	});
		
	canvas2.addChild(centerData);
	
	
	for(var i =0;i<data.length;i++){
			for(var j =i;j<data.length;j++){
				if(j+1<data.length ){
					var nextRate = parseInt(data[j+1].rate.replace("px",""));
					var curRate = parseInt(data[j].rate.replace("px",""));
					if(nextRate>curRate){
					  var temp = data[j];
					  data[j] = data[j+1];
					 data[j+1] = temp;
					}
			  }
			}
	}
	for (var i = 0; i < data.length; i++) {

			var rate =  data[i].rate.replace("%","");
			end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 90 : 0);
			var start = (i < 1 ? -88 : lastEnd+2);
			
			if(rate == 0){
				start = start-2;
				end = start+2;
			}
			if(start>end){
				end = start;
			}
		
	
			pieces.push(arcIni.clone({
				start: 0,
				end: 0,
				stroke: options.borderWidth+"px "+color[i]
			}).animate({
			start: start,
			end: end
		},400));
	
		
			
		
	
		var centerPoint = (end+start)/2;//获取饼图的中间
		if(centerPoint<0){
			centerPoint += 360;
		}
		var sins = Math.sin(2*Math.PI /360*centerPoint);
		var coss = Math.cos(2*Math.PI /360*centerPoint);
	
		var centerX = coss*(options.radius+options.borderWidth/2)+options.xinX;//饼图中间点坐标x
		var centerY = sins*(options.radius+options.borderWidth/2)+options.xinY;//饼图中间点坐标y
	
		var textY =  sins*(options.radius+options.borderWidth/2-30)+options.xinY;
		var textX =  coss*(options.radius+options.borderWidth/2-30)+options.xinX;
	
		var centerXEnd = coss*(options.radius+options.borderWidth/2+15)+options.xinX;
		var centerYEnd = sins*(options.radius+options.borderWidth/2+15)+options.xinY;
		
		
		 if(i>=1 && parseInt(data[i].rate.replace("%",""))<10   && parseInt(data[i-1].rate.replace("%",""))<10){
			var sins2 = Math.sin(2*Math.PI /360*(centerPoint+40));
		    var coss2 = Math.cos(2*Math.PI /360*(centerPoint+40)); 
			
			var centerXEnd = coss2*(options.radius+options.borderWidth/2+15)+options.xinX;
		    var centerYEnd = sins2*(options.radius+options.borderWidth/2+15)+options.xinY;
		}
		
		
		lines.push(lineIni.clone({//绘制sub的横线
			start:{x:centerX,y:centerY},
			end:{x:centerXEnd,y:centerYEnd}
		}));
		
		
	
	if(centerPoint>90 && centerPoint<270){
		linesLevel.push(lineIni.clone({
			start:{x:centerXEnd,y:centerYEnd},
			end:{x:centerXEnd-100,y:centerYEnd}
		}));
		
		texts.push(textIni.clone({
			x:centerXEnd-80,
			y:centerYEnd-5,
			text:data[i].name+"  "+data[i].rate,
			font: "normal "+options.fontSize+"px GOTHIC",
			origin: { x: "left", y: "bottom" }
		}));
	}else{
		linesLevel.push(lineIni.clone({
			start:{x:centerXEnd,y:centerYEnd},
			end:{x:centerXEnd+100,y:centerYEnd}
		}));
		
		texts.push(textIni.clone({
			x:centerXEnd+30,
			y:centerYEnd-5,
			text:data[i].name+"  "+data[i].rate,
			font: "normal "+options.fontSize+"px GOTHIC",
			origin: { x: "left", y: "bottom" }
		}));
	}
	
	
		canvas2.addChild(lines[i]);
		canvas2.addChild(pieces[i]);
		canvas2.addChild(linesLevel[i]);
		canvas2.addChild(texts[i]);
		
		lastEnd = end;
		pieces[i]._start = pieces[i].start;
		pieces[i]._end = pieces[i].end;

	}
}

//三级菜单切换
function TrafficbindChange(data,menuData,menuVoice,options,canvas1,canvas2,id1,id2){
	$(".tCON").tap(function(){
		$(".tCON").addClass("tActive");
		$(this).removeClass("tActive");	
		var index = $(this).index();

		$("#trafficCon").attr("choice",index);
		dotPosition = {};
		dotValue = {};
		DotX = [];
		noteCon=[];
			
			
		$(".tipContent").remove();
		
		var dataTraficTrend = data["dataTraffictTrend"];
		var voiceTraficTrend = data["voiceTraffictTrend"];
		$(".trafficeLevel3").hide();
		$(".trafficContent").hide();
		if(index == 0){	
			$(".trafficeLevel3").eq(0).show();
			$(".trafficeLevel3").eq(3).show();
			$(".trafficContent").eq(0).show();	
			PDrawLines(options3,dataTraficTrend,xTitle,canvas1,trafficDateName,color3,'GBytes');
			if(canvas1.isDraw!=1){
				canvas1.isDraw = 1;
				TrafficdrawMark(options,canvas1,'data');
				bindTapNote(options,id1,data,color3,color3Fill,color3light,canvas1,0);//点击曲线后显示详细信息
			}
			if(TipLine){
				canvas1.removeChild(TipLine);
				canvas1.removeChild(TipText);
				canvas1.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvas1.removeChild(TipArc[i]);
				}
				TipArc = [];
			}
			
		}else{
			$(".trafficeLevel3").eq(1).show();
			$(".trafficeLevel3").eq(2).show();
			$(".trafficContent").eq(1).show();
			PDrawLines(options3,voiceTraficTrend,xTitle,canvas2,trafficVoiceName,color3,'Erlang');
			if(canvas2.isDraw!=1){
				canvas2.isDraw = 1;	
				TrafficdrawMark(options,canvas2,'voice');	
				bindTapNote(options,id2,data,color3,color3Fill,color3light,canvas2,1);//点击曲线后显示详细信息
			}
			if(TipLine){
				canvas2.removeChild(TipLine);
				canvas2.removeChild(TipText);
				canvas2.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvas2.removeChild(TipArc[i]);
				}
				TipArc = [];
			}
		}
		
	});
	$(".tCON:eq(0)").tap();
}


function TrafficdrawMark(options,canvas,type){//当点击新消息时画标记线

	var lineIni = canvas.display.line({
        stroke: "2px #747778",
        cap: "round"
    });

    var textIni = canvas.display.text({
        origin: { x: "left", y: "top" },
        font: "bold 12px GOTHIC",
        fill: "#b9b9b9"
    });

    var arcIni = canvas.display.arc({
        x: 0,
        y: 0,
        stroke: "2px #161616",
        radius:8
    });
	
	//drawMark(options,lineIni,arcIni,textIni,canvas,type);
}

function PDrawXY(options,lineIni,textIni,canvas){//绘制横纵坐标
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
			end:{x:drawleftpadding,y:topPadding+2},
			stroke: "2px #3a3a3a"
		});//左侧纵标线
		
	
	
	var positionYRight = lineIni.clone({
			start:{x:drawWidth,y:drawHeight},
			end:{x:drawWidth,y:topPadding},
			stroke: "2px #3a3a3a"
		});//右侧纵坐标
		canvas.addChild(positionYRight);
	
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);

	
}















