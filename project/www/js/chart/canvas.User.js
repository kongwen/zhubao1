/**
 * @author zhouyuan
 * @version 1.0
 */

var options = {drawWidth:950,drawHeight:400,drawleftpadding:70,yNum:12};
var optionsMin = {drawWidth:180,drawHeight:60,drawleftpadding:0,yNum:12,isMini:true};
var color =['#89ab2a','#46b6ba','#f9df90',"#ef894c","#4c85e2"];
var colorlight =['#ebfbbf','#a9f4f7','#fff3ce',"#fcd4bc","#83b2ff"];
var colorFill =['#597802','#3c8285','#b49e5c',"#925733","#2e5ba5"];

var inboundColor =['#89ab2a','#46b6ba','#674dd4',"#ef894c","#4c85e2"];
var inboundColorlight =['#ebfbbf','#a9f4f7','#9c85fd',"#fcc09c","#83b2ff"];
var inboundColorFill =['#597802','#3c8285','#351f93',"#83380b","#2e5ba5"];


var outboundColor =['#89ab2a','#f9df90','#3dd85a',"#ef894c","#4c85e2"];
var outboundColorlight =['#ebfbbf','#fff3ce','#b0fbbe',"#fcd4bc","#83b2ff"];
var outboundColorFill =['#597802','#b49e5c','#0b8e23',"#925733","#2e5ba5"];

var linezheUser = [];//存储所有的折线
var DotX = [];
var lineTitleArray = [];
var dotLength = 91;
var fontSize = 12;
var canvasMainUser;
var canvasMin=[];
var startDate,endDate;//存储时间区间
var xTitle;
var mainNUM = 0;
var lastoutbound,lastinbound,totaloutbound;
var canvaslist=[];
var dotPosition = {};
var dotValue = {};
var noteYP;
			
//配置画那几条曲线
var UserListType={"Total":{"totalUser":"Total User","inbound":"Inbound","outbound":"Outbound"},
				  "In":{"totalUser":"Total User","inbound":"Inbound","inbound7Avg":"Inbound 7 RA","inbound14Avg":"Inbound 14 RA","inbound30Avg":"Inbound 30 RA"},
				  "Out":{"totalUser":"Total User","outbound":"Outbound","outbound7Avg":"Outbound 7 RA","outbound14Avg":"Outbound 14 RA","outbound30Avg":"Outbound 30 RA"},
				  "InMin":{"totalUser":"Total User","inbound":"Inbound"},
				  "OutMin":{"totalUser":"Total User","outbound":"Outbound"}
				 };
var noteList = {"totalUser":"Total User","inbound":"Inbound","outbound":"Outbound",
				"totalUser":"Total User","inbound":"Inbound","inbound7Avg":"Inbound 7 RA",
				"inbound14Avg":"Inbound 14 RA","inbound30Avg":"Inbound 30 RA",
				"totalUser":"Total User","outbound":"Outbound","outbound7Avg":"Outbound 7 RA",
				"outbound14Avg":"Outbound 14 RA","outbound30Avg":"Outbound 30 RA",
				"totalUser":"Total User","inbound":"Inbound",
				"totalUser":"Total User","outbound":"Outbound"
				};
function drawUser(options,id,data,color,type){
        if($("#"+id)&&$("#"+id).length>0){}else{return;}
        var Rel = $("#"+id).attr("rel");
        //获取数据
        var canvas = oCanvas.create({
            canvas: "#"+id,
            fps: 10
        });
		canvas.Rel = Rel;
		canvaslist.push(canvas);
        mainNUM++;

        if(id == "canvasUser"){
            canvasMainUser = canvas;
            canvasMainUser._index = mainNUM
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
		
        if(!options.isMini){
			//计算因为数值太大而text不显示

			var leftMax = data.leftYAll+"";
			var rightMax = data.rightY+"";
			var options = {drawWidth:930,drawHeight:400,drawleftpadding:70,yNum:12};
			options.drawleftpadding +=(leftMax.length+2.6)*3;
			options.drawWidth = options.drawWidth-(rightMax.length-1)*3;
			

			 
            UserDrawXY(options,lineIni,textIni,canvas);	
            UserDrawText(options,data,lineIni,textIni,canvas,Rel);
            drawMark(options,lineIni,arcIni,textIni,canvas);
            zhelineUser = [];
            noteCon = [];
        }
		if(options.isMini){
			UserDrawLine(options,data,lineIni,textIni,canvas,color);
		}else{
			setTimeout(function(){
				UserDrawLine(options,data,lineIni,textIni,canvas,color);
				UserDrawNote(options,textIni,arcIni,data,canvas,Rel,color);
			},200);
			if(type == 'inbound'){
					bindTapNote(options,id,data,inboundColor,inboundColorFill,inboundColorlight,canvas,lineIni,arcIni,textIni);//点击曲线后显示详细信息
				}else if(type == 'outbound'){
					bindTapNote(options,id,data,outboundColor,outboundColorFill,outboundColorlight,canvas,lineIni,arcIni,textIni);//点击曲线后显示详细信息
				}else{
					bindTapNote(options,id,data,color,colorFill,colorlight,canvas,lineIni,arcIni,textIni);//点击曲线后显示详细信息
				}
		}
		 setSubNum();		
}


var TipLine;
var TipArc = [];
var TipText,TipImage;
function bindTapNote(options,id,data,color,colorFill,colorlight,canvas,lineIni,arcIni,textIni){
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var perWidth = (drawWidth-drawleftpadding)/(xTitle.length);
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
				canvasMainUser.addChild(TipLine);//绘制竖向虚线
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
function UserDrawXY(options,lineIni,textIni,canvas){//绘制横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;

	var positionX = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawWidth,y:drawHeight},
			stroke: "2px #3a3a3a"
		});//横坐标线
	var positionYLeft = lineIni.clone({
			start:{x:drawleftpadding,y:drawHeight},
			end:{x:drawleftpadding,y:50},
			stroke: "2px #3a3a3a"
		});//左侧纵标线
	var positionYRight = lineIni.clone({
			start:{x:drawWidth,y:drawHeight},
			end:{x:drawWidth,y:50},
			stroke: "2px #3a3a3a"
		});//右侧纵坐标

	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	canvas.addChild(positionYRight);

    drawleftpadding = null;drawHeight=null;drawWidth=null;positionYLeft=null;positionYRight = null;
}

function UserDrawText(options,data,lineIni,textIni,canvas,Rel){//绘制横纵坐标刻度
		var lineShort=[],textX=[],textYleft=[],textYright=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		if(Rel == "Total"){
			var leftMax = data.leftYAll;
		}else if(Rel == "In"){
			var leftMax = data.leftYIn;
		}else if(Rel == "Out"){
			var leftMax = data.leftYOut;
		}

		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
		var dataList = data.number;//横坐标上有多少个点
		var xNum = dotLength;//标记
		
		var rightMax = data.rightY;

		xTitle =  data.bottomX;
		startDate = xTitle[0];
		endDate = xTitle[xTitle.length-1];
		setTitleDate(startDate,endDate);
		
		
		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		var titleWidth = (drawWidth-drawleftpadding)/13;
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/yNum)*j+4,
				origin: { x: "right", y: "bottom" },
				text:FormatNUM((leftMax/(yNum-2)*j+""))
			}));
		
		canvas.addChild(textYleft[j]);
	
		textYright.push(textIni.clone({
				x:drawWidth+8,
				y:drawHeight-(drawHeight/yNum)*j+4,
				origin: { x: "left", y: "bottom" },
				text:FormatNUM(rightMax/(yNum-2)*j+"")
			}));
		canvas.addChild(textYright[j]);
	
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/yNum)*j-3},
			end:{x:drawWidth,y:drawHeight-(drawHeight/yNum)*j-2},
			stroke: "1px #161616"
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
			y:drawHeight+10,
			origin: { x: "right", y: "top" },
			rotation: -50,
			text:dealDate4(xTitle[num])
		}));
		canvas.addChild(textX[m]);
	}
	
}

var zhelineUser = [];
function UserDrawLine(options,data,lineIni,textIni,canvas,color){
	var Rel = canvas.Rel;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var yNum = options.yNum;//绘制纵坐标上刻度
	var dataList = data.number;
	var xNum = dotLength;//标记

	if(Rel == "Total"){
		var leftMax = data.leftYAll;
	}else if(Rel == "In" || Rel == "InMin"){
		var leftMax = data.leftYIn;
	}else if(Rel == "Out" || Rel == "OutMin" ){
		var leftMax = data.leftYOut;
	}

	var rightMax = data.rightY;
	
	var xWidth = (drawWidth-drawleftpadding)/xNum;
	var leftPerHeight = drawHeight/yNum;
	var dataList = data.number;//横坐标上有多少个点

	var targetDate = UserListType[Rel];
	

	
	var i =0;
	var lineListIni = canvas.display.lineList({
			pointList:[],
			stroke: "2px #fff"
	});

	var zheline = [];
	dotPosition={};
	for (var x in targetDate){
		var title = x;
		var list = dataList[x];

		var perWidth = xWidth/list.length;
		var lastX = xWidth*0+drawleftpadding;
		var lastY = drawHeight-list[0]*drawHeight*10/(12*leftMax);
		
		var lineAry =[];
		var lineValue = [];	
	
		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			
			if(/total/.test(title)){
				
				if(rightMax==0 || rightMax=="0" || rightMax==""){
					var curY =drawHeight;	
				}else{
					var curY = drawHeight-list[y]*drawHeight*10/(12*rightMax);	
				}	
			}else{
				
				
				if(leftMax==0 || leftMax=="0" || leftMax==""){
					var curY =drawHeight;	
				}else{
					var curY = drawHeight-list[y]*drawHeight*10/(12*leftMax);	
				}
			}
			var temp = [curX,curY];
			var temp2 = [curX,list[y]];
			lineAry.push(temp);		
			lineValue.push(temp2);
			
			if(DotX.length<list.length && !options.isMini){
				DotX.push(curX);
			}
			
		}	
		dotPosition[x] = lineAry;//记录曲线坐标
		dotValue[x] = lineValue;		if(title == "inbound"){
			lastinbound = list[list.length-1];
		}
		
		if(title == "outbound"){
			lastoutbound = list[list.length-1];
		}
		
		//20141216
		if(title == "totalUser"){
			totaloutbound = list[list.length-1];
		}
		
		if(!options.isMini){
			zheline.push(lineListIni.clone({
				pointList:lineAry,
				stroke: "2px "+color[i]
			}));
		}else{
			zheline.push(lineListIni.clone({
				pointList:lineAry,
				stroke: "2px "+color[i]
			}));
		}
		
		canvas.addChild(zheline[i]);

		zhelineUser.push(zheline[i]);
		i++;
	}
}


function setSubNum(){
	$("#inboundNum").text(FormatNUM(lastinbound+""));
	$("#outboundNum").text(FormatNUM(lastoutbound+""));
	$('#totalboundNum').text(FormatNUM(totaloutbound+''));
}

var noteCon=[];function UserDrawNote(options,textIni,arcIni,data,canvas,rel,color){//绘制图例下方的圈圈
	var dataList = data.number;
	var xTitle =  data.bottomX;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [];
	var lastWidth =  drawleftpadding+6;
	var targetDate = UserListType[rel];
	
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	var i = 0;
	for(var x in targetDate){
		var length = xTitle[i].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: drawHeight+87,
			start:0,
			end:360,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:drawHeight+87,
			text:targetDate[x]
		}));
		canvas.addChild(noteText[i]);
		noteYP = drawHeight+57;
		
		var conWidth = targetDate[x].length*9;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-5,
				y: drawHeight+67,
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
				var linezhe = zhelineUser[i];
				
				if(isShow == '1'){
					noteArc[i].stroke = "2px #666666";
					this._show = '0';
					zhelineUser[i].opacity = 0;
				}else if(isShow == '0'){
					noteArc[i].stroke = "2px "+color[i];
					this._show = '1';
					zhelineUser[i].opacity = 1;
				}
				canvas.redraw();	
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
				return false;		
			});
		
		
		lastWidth += fontSize*length+30;
		i++;
	}

	if(noteCon.length>3){
		noteCon[3].trigger("tap");
	}
	
	if(noteCon.length>4){
		noteCon[4].trigger("tap");
	}
}

function drawMark(options,lineIni,arcIni,textIni,canvasMainUsers){//当点击新消息时画标记线
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var perWidth = (drawWidth-drawleftpadding)/(xTitle.length);
	var line;
	var arc;
	var text;
	$("#messagecon dd").attr("isDraw","false").unbind("tap").tap(function(){
		$(this).addClass("active");
		var isDraw = $(this).attr("isDraw");
		if(isDraw != "true"){
		var date = $(this).attr("date");
		var index = 0;
		var has = false;
		$(this).attr("isDraw","true");
		var num = $(this).attr("index");
		for(var i =0;i<xTitle.length;i++){
			if(date == xTitle[i]){
				index = i;
				has = true;
			}
		}
		
		var dotListIni = canvasMainUser.display.dotList({
			pointList:[],
			stroke: "2px #222"
		});
	
		if(has){
			var height = 10*drawHeight/12;
			var lineAry;
			var j = 0;
			
			lineAry=dotListIni.clone({//绘制横坐标的短线
				width:drawleftpadding+index*perWidth,
				height:height,
				stroke: "1px #fff",
				ju:6
			});
			canvasMainUser.addChild(lineAry);	
		
		
			
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
				fill:"#fff",
				text:num
			});
			
			canvasMainUser.addChild(arc);
			canvasMainUser.addChild(text);
		}
		}
	});
}







