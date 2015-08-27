/**
 * @author zhouyuan
 * @version 1.0
 */

var options = {drawWidth:940,drawHeight:400,drawleftpadding:70,yNum:12};
var optionsMin = {drawWidth:180,drawHeight:60,drawleftpadding:0,yNum:12,isMini:true};
var color =['#46B6BA','#f9df90','#b8d50d','#3F76DA'];
var colorFill =['#02797d','#916e02','#748701','#043b9e'];
var colorlight =['#b1f8fb','#fff5d6','#eefba0','#a5c4fc'];

var linezheUsage = [];//存储所有的折线

var lineTitleArray = [];
var dotLength = 91;
var fontSize = 12;
var canvasMainUspage;
var canvasMin=[];
var startDate,endDate;//存储时间区间
var xTitleUsage;
var lastNum =[];
var Usage = {};//定义命名空间
var voiceNum,dataNum,smsNum,voiceRONum,dataRONum,smsRONum;
var dotPosition = {};
var dotValue = {};
var noteYP;
var DotX = [];
var lineTitleArray = [];
//配置画那几条曲线
var UsageListType={"voice":{"voice":"Voice (Min per User)",
							"voice7Avg":"Voice (Min per User) 7 RA",
							"voice14Avg":"Voice (Min per User) 14 RA",
							"voice30Avg":"Voice (Min per User) 30 RA"},
				  "data":{"data":"Data (MB User Day)",
						"data7Avg":"Data (MB User Day) 7 RA",
						"data14Avg":"Data (MB User Day) 14 RA",
						"data30Avg":"Data (MB User Day) 30 RA"
					},
				  "sms":{"sms":"SMS (User Day)",
						 "sms7Avg":"SMS (User Day) 7 RA",
						 "sms14Avg":"SMS (User Day) 14 RA",
						 "sms30Avg":"SMS (User Day) 30 RA"
					},
				  "voice roaming":{"voiceRoaming":"Voice Roaming (Min User Day)",
								   "voiceRoaming7Avg":"Voice Roaming (Min User Day) 7 RA",
								   "voiceRoaming14Avg":"Voice Roaming (Min User Day) 14 RA",
								   "voiceRoaming30Avg":"Voice Roaming (Min User Day) 30 RA"
								 },
				  "sms roaming":{"smsRoaming":"SMS Roaming (User Day)",
								"smsRoaming7Avg":"SMS Roaming (User Day) 7 RA",
								"smsRoaming14Avg":"SMS Roaming (User Day) 14 RA",
								"smsRoaming30Avg":"SMS Roaming (User Day) 30 RA"
							},
				  "data roaming":{"dataRoaming":"Data Roaming (MB User Day)",
								"dataRoaming7Avg":"Data Roaming (MB User Day) 7 RA",
								"dataRoaming14Avg":"Data Roaming (MB User Day) 14 RA",
								"dataRoaming30Avg":"Data Roaming (MB User Day) 30 RA"
							}
				 };

var noteList = {"voice":"Voice (Min per User)",
					"voice7Avg":"Voice (Min per User) 7 RA",
					"voice14Avg":"Voice (Min per User) 14 RA",
					"voice30Avg":"Voice (Min per User) 30 RA",
					"data":"Data (MB User Day)",
					"data7Avg":"Data (MB User Day) 7 RA",
					"data14Avg":"Data (MB User Day) 14 RA",
					"data30Avg":"Data (MB User Day) 30 RA",
					"sms":"SMS (User Day)",
					"sms7Avg":"SMS (User Day) 7 RA",
					"sms14Avg":"SMS (User Day) 14 RA",
					"sms30Avg":"SMS (User Day) 30 RA",
					"voiceRoaming":"Voice Roaming (Min User Day)",
					"voiceRoaming7Avg":"Voice Roaming (Min User Day) 7 RA",
					"voiceRoaming14Avg":"Voice Roaming (Min User Day) 14 RA",
					"voiceRoaming30Avg":"Voice Roaming (Min User Day) 30 RA",
					"smsRoaming":"SMS Roaming (User Day)",
					"smsRoaming7Avg":"SMS Roaming (User Day) 7 RA",
					"smsRoaming14Avg":"SMS Roaming (User Day) 14 RA",
					"smsRoaming30Avg":"SMS Roaming (User Day) 30 RA",
					"dataRoaming":"Data Roaming (MB User Day)",
					"dataRoaming7Avg":"Data Roaming (MB User Day) 7 RA",
					"dataRoaming14Avg":"Data Roaming (MB User Day) 14 RA",
					"dataRoaming30Avg":"Data Roaming (MB User Day) 30 RA"
				};
				
				
function drawUsage(options, id, data){

    if($("#"+id) && $("#"+id).length>0 && data){
        var Rel = $("#"+id).attr("rel");
        //获取数据
        var canvas = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });

        if(id == "canvasUsage"){
            canvasMainUspage = canvas;
        }else{
            canvasMin.push(canvas);
        }

        var lineIni = canvas.display.line({
            stroke: "2px #747778",
            cap: "round"
        });

        var textIni = canvas.display.text({
            origin: { x: "left", y: "top" },
            font: "normal "+fontSize+"px GOTHIC",
            fill: "#b9b9b9"
        });

        var arcIni = canvas.display.arc({
            x: 0,
            y: 0,
            stroke: "2px #161616",
            radius:7
        });

		var rels = $("#"+id).attr("rels");
        if(!options.isMini){
            UsageDrawXY(options,lineIni,textIni,canvas);
            UsageDrawText(options,data,lineIni,textIni,canvas,rels);
            
            UsagedrawMark(options,lineIni,arcIni,textIni);
            usagezhelineAll = [];
			noteCon = [];
        }
		if(options.isMini){
			UsageDrawLine(options,data,lineIni,textIni,canvas,Rel,rels);
		}else{
			setTimeout(function(){
				UsageDrawLine(options,data,lineIni,textIni,canvas,Rel,rels);
				UsageDrawNote(options,textIni,arcIni,data,canvas,Rel);
			},200);
			bindTapNote(options,id,data,color,colorFill,colorlight,canvas,lineIni,arcIni,textIni);//点击曲线后显示详细信息
					}
		setSubNum();
    }
}


var TipLine;
var TipArc = [];
var TipText,TipImage;
function bindTapNote(options,id,data,color,colorFill,colorlight,canvas,lineIni,arcIni,textIni){
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var perWidth = (drawWidth-drawleftpadding)/(xTitleUsage.length);
	var height = 10*drawHeight/12;
	var title = data.bottomX;
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
	 
	 $("#"+id+"Con").tap(function(e){
		var pointer = getCoordInDocument(id,e);
		var xP = pointer.x;
		var yP =  pointer.y;
		var dotObj = getDotNum(xP);
		if(yP<noteYP && dotObj){
		var dot = dotObj.p;
		var index = dotObj.i;
			if(TipLine){
				canvasMainUspage.removeChild(TipLine);
				canvasMainUspage.removeChild(TipText);
				canvasMainUspage.removeChild(TipImage);
				for(var i =0;i<TipArc.length;i++){
					canvasMainUspage.removeChild(TipArc[i]);
				}
				TipArc = [];
			}
			
			$(".tipContent").remove();
			var n = 0;
			var hasshow = 0;
			var str="<div class='tipContent'>";
			for(var x in dotPosition){
				if(noteCon[n]._show == '1'){
					var position = dotPosition[x][index];
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
					str += "<dd>"+dotValue[x][index][1]+"</dd>";
					str += "</dl>";
					hasshow++;
				}
				n++;
			}
			str += "</div>";
			$(str).appendTo($(this));
			if(hasshow>0){
				$(".tipContent").show();
				TipLine=dotListIni.clone({//绘制横坐标的短线
					width:dot,
					height:height,
					stroke: "1px #fff",
					ju:6
				});
				canvasMainUspage.addChild(TipLine);//绘制竖向虚线
				
				TipImage = canvas.display.image({
						x: position[0],
						y: drawHeight,
						width:100,
						height:44,
						origin: { x: "center", y: "top" },
						image: "../css/images/tipsBg.png"
				});


				TipText = textIni.clone({
						x: position[0],
						y: drawHeight+20,
						font: "bold 14px GOTHIC",
						origin: { x: "center", y: "top" },
						text:title[index+91-data.number[x].length]
				});
				canvas.addChild(TipImage);
				canvas.addChild(TipText);
				for(var j = 0;j<hasshow;j++){
					canvas.addChild(TipArc[j]);//绘制竖向虚线
				}
			}
			var contentWidth  = $(".tipContent").width();
			if(xP+10+contentWidth<=drawWidth){
				$(".tipContent").css("left",xP+10+"px").css("top","30px");
			}else{
				$(".tipContent").css("left",xP-contentWidth-20+"px").css("top","30px");
			}
			
			
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




function UsageDrawXY(options,lineIni,textIni,canvas){//绘制横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;

	var positionX = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawWidth+20,y:drawHeight},
			stroke: "2px #3a3a3a",
		});//横坐标线
	var positionYLeft = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawleftpadding,y:50},
			stroke: "2px #3a3a3a",
		});//左侧纵标线
	

	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
}

function UsagegetMax(data){
	var item = {};
	item.leftYVoice = data.leftYVoice;
	item.leftYData = data.leftYData;
	item.leftYSms = data.leftYSms;
	item.leftYVoiceRoaming = data.leftYVoiceRoaming;
	item.leftYDataRoaming = data.leftYDataRoaming;
	item.leftYSmsRoaming = data.leftYSmsRoaming;
	var max =0;
	for(var x in item){
		var value = parseInt(item[x]);
		if(value > max){
			max = value;
		}	
	}
	return max;
}

function UsageDrawText(options,data,lineIni,textIni,canvas,leftY){//绘制横纵坐标刻度
		var lineShort=[],textX=[],textYleft=[],textYright=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记

		var leftMax = data[leftY];


		xTitleUsage =  data.bottomX;
		startDate = xTitleUsage[0];
		endDate = xTitleUsage[xTitleUsage.length-1];
		setTitleDate(startDate,endDate);
		
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var titleWidth = (drawWidth-drawleftpadding)/13;
		
		
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
			var value =leftMax/(yNum-2)*j;
			if(/Roaming/.test(leftY)){
				value= value.toFixed(3);
			}else{
				value= value.toFixed(1);
			}
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/yNum)*j,
				origin: { x: "right", y: "top" },
				text:value
			}));
		
		canvas.addChild(textYleft[j]);
	
	
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/yNum)*j},
			end:{x:drawWidth,y:drawHeight-(drawHeight/yNum)*j},
			stroke: "1px #161616"
		}));
		canvas.addChild(lineheng[j],false);
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
			y:drawHeight+10,
			origin: { x: "right", y: "top" },
			rotation: -50,
			text:dealDate4(xTitleUsage[num])
		}));
		canvas.addChild(textX[m]);
	}
		
}


var usagezhelineAll = [];
function UsageDrawLine(options,data,lineIni,textIni,canvas,Rel,leftY){
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var yNum = options.yNum;//绘制纵坐标上刻度
	var dataList = data.number;
	var xNum = dotLength;//标记
	var leftMax = data[leftY];
	
	var xWidth = (drawWidth-drawleftpadding)/xNum;
	var leftPerHeight = drawHeight/yNum;
	var dataList = data.number;//横坐标上有多少个点
	var targetDate = UsageListType[Rel];
	
	var i =0;
	var lineListIni = canvas.display.lineList({
			pointList:[],
			stroke: "2px #fff"
	});
	var zheline = [];
	var i =0;
	if(options.isMini){
		for (var x in targetDate){

		if(i == 0){
		var list = dataList[x];
		if(list.length>0){
		if(x == "voice"){
			voiceNum = list[list.length-1];
		}
		
		if(x == "data"){
			dataNum = list[list.length-1];
		}
		
		if(x == "sms"){
			smsNum  = list[list.length-1];
		}
		
		if(x == "voiceRoaming"){
			voiceRONum = list[list.length-1];
		}
		
		if(x == "dataRoaming"){
			dataRONum = list[list.length-1];
		}
		
		if(x == "smsRoaming"){
			smsRONum  = list[list.length-1];
		}
		var perWidth = xWidth/list.length;
		var lastX = xWidth*0+drawleftpadding;
		var lastY = drawHeight-list[0]*drawHeight*10/(12*leftMax);
		
		var lineAry =[];

		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			if(leftMax==0 || leftMax=="0" || leftMax==""){
				var curY =drawHeight;	
			}else{
				var curY = drawHeight-list[y]*drawHeight*10/(12*leftMax);	
			}	
			var temp = [curX,curY];
			
			lineAry.push(temp);		
		}	
		
			zheline.push(lineListIni.clone({
				pointList:lineAry,
				stroke: "2px "+color[i]
			}));
	

		if(i==0){
			lastNum.push(list[list.length-1]);
		}
		canvas.addChild(zheline[i]);
		usagezhelineAll.push(zheline);
		i++;
		}
		}
	}
	}else{
	
		dotPosition={};
		for (var x in targetDate){

		var list = dataList[x];
		if(list.length>0){
		var perWidth = xWidth/list.length;
		var lastX = xWidth*0+drawleftpadding;
		var lastY = drawHeight-list[0]*drawHeight*10/(12*leftMax);
		
		var lineAry =[];
		var lineValue = [];

		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			if(leftMax==0 || leftMax=="0" || leftMax==""){
				var curY =drawHeight;	
			}else{
				var curY = drawHeight-list[y]*drawHeight*10/(12*leftMax);	
			}
			var temp = [curX,curY];
			
			lineAry.push(temp);	
			var temp2 = [curX,list[y]];		
			lineValue.push(temp2);

			if(DotX.length<list.length && !options.isMini){
				DotX.push(curX);
			}			
		}	
		dotPosition[x] = lineAry;//记录曲线坐标
		dotValue[x] = lineValue;		
		zheline.push(lineListIni.clone({
			pointList:lineAry,
			stroke: "2px "+color[i]
		}));

		if(i==0){
			lastNum.push(list[list.length-1]);
		}
		
		
		
		canvas.addChild(zheline[i]);
		usagezhelineAll.push(zheline);
		i++;
		
		}
	
	}
	}
}


var noteCon=[];
function UsageDrawNote(options,textIni,arcIni,data,canvas,Rel){//绘制图例下方的圈圈
	var dataList = data.number;
	var xTitleUsage =  data.bottomX;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [];
	var lastWidth =  drawleftpadding+6;
	var targetDate = UsageListType[Rel];
	var i = 0;
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	for(var x in targetDate){
		var length = xTitleUsage.length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: drawHeight+89,
			start:0,
			end:360,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:drawHeight+89,
			text:targetDate[x]
		}));
		canvas.addChild(noteText[i]);
		noteYP = drawHeight+57;
		
		
		var conWidth = targetDate[x].length*9;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-5,
				y: drawHeight+73,
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

				var linezhe = linezheUsage[i];
				
				if(isShow == '1'){
					noteArc[i].stroke = "2px #666666";
					this._show = '0';
					usagezhelineAll[0][i].opacity = 0;
				}else if(isShow == '0'){
					noteArc[i].stroke = "2px "+color[i];
					this._show = '1';
					usagezhelineAll[0][i].opacity = 1;
				}
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
				canvas.redraw();	
		});
		
		lastWidth += 240;
		i++;
	}
	

	if(noteCon.length>3){
		noteCon[3].trigger("tap");
	}
	
	if(noteCon.length>4){
		noteCon[4].trigger("tap");
	}

}


function setSubNum(){
	$("#voiceNum>span").text(voiceNum);
	$("#dataNum>span").text(dataNum);
	$("#smsNum>span").text(smsNum);
	$("#voiceRONum>span").text(voiceRONum);
	$("#dataRONum>span").text(dataRONum);
	$("#smsRONum>span").text(smsRONum);
}





function UsagedrawMark(options,lineIni,arcIni,textIni){//当点击新消息时画标记线
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var perWidth = (drawWidth-drawleftpadding)/(xTitleUsage.length);
	var line;
	var arc;
	var text;
	$("#messagecon dd").attr("isDraw","false");
	$("#messagecon dd").unbind("click").bind("click",function(){

		var isDraw = $(this).attr("isDraw");
		if(isDraw != "true"){
		var date = $(this).attr("date");
		var index = 0;
		var has = false;
		$(this).attr("isDraw","true");
		var num = $(this).attr("index");
		for(var i = 0;i<xTitleUsage.length;i++){
			if(date == xTitleUsage[i]){
				index = i;
				has = true;
			}
		}
		var dotListIni = canvasMainUspage.display.dotList({
			pointList:[],
			stroke: "2px #222"
		});
		if(has){
			var height = 10*drawHeight/12;
			var lineAry;
			lineAry=dotListIni.clone({//绘制横坐标的短线
				width:drawleftpadding+index*perWidth,
				height:height,
				stroke: "1px #fff",
				ju:6
			});
			canvasMainUspage.addChild(lineAry);	
			arc = arcIni.clone({
				x:  drawleftpadding+index*perWidth+15,
				y: drawHeight-20,
				start:0,
				end:360,
				radius:10,
				stroke: "2px #fff"
			});
			
			text = textIni.clone({
				x:drawleftpadding+index*perWidth+15,
				y:drawHeight-26,
				origin: { x: "center", y: "middle" },
				text:num
			});
			
			
			canvasMainUspage.addChild(arc);
			canvasMainUspage.addChild(text);
		}
		}
	});
}

function UsagesetNumData(){
	$(".opt").each(function(i){
		$(this).find("h2>b").text(lastNum[i]);
	});
}



