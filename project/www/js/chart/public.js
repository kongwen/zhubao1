/**
 * @author zhouyuan
 * @version 1.0
 * @describe 公共函数库
 */
 
var isRead = false;//标记当前消息是否已读
var dotLength = 91;
var storage = window.localStorage;

var linezheTraffic=[];

//设置message
function setMessage(num,con){
	$("#notice"+con).html("");
	$("<b>"+num+"</b>").appendTo("#notice"+con);
}

function shutStr(str,length){
	var news = str;
	if(str.length>length){
		news = str.substr(0,length)+"..."
	}
	return news;
}


//设置标题数据
function setTitleDate(start,end){
	start = dealDate2(start+"");
	end = dealDate2(end+"");
	$("#title b").text("("+start+" to "+end+")");
}

function getMessage(con){
	 getDataThen(getUrl('public'), function(data){
         if(!data){return;};

         controlRule.add(data);//加入控制规则

          var str = "<dt>Recent Activities</dt>";
		  var message = data["hotMessages"];

		  for(var i =0;i<message.length;i++){
				var num = i+1;
				var date = message[i].date;
				var content = message[i].content;
				str += "<dd date='"+date+"' index='"+num+"' ><b>"+num+"</b>"+content+"</dd>";
		  }
		  $("#messagecon dl").html(str);
		  $("#messagecon").hide();
		
		  if(!storage.getItem("msgIsRead")){
			setMessage(message.length,con);
		  }
		  $("#notice"+con).unbind();
		  $("#notice"+con).unbind("tap").tap(function(){

			if($("#messagecon").css("display") == "none"){
				$("#messagecon").stop().slideDown();
				var storage = window.localStorage;
				storage.setItem("msgIsRead","read");
				$(this).html("");
			}else{
				$("#messagecon").stop().slideUp();
			}
		 });
		$("#messagecon").hide();

         //首页右下角日期
         var d_ = data.yesterday.split("-")
         if(d_ && d_.length>0){
             $("#endDate").html(d_[2]+"-"+d_[0]+"-"+d_[1]);
         }else{
             $("#endDate").html("1977-7-1");
         }

     }, 'Message');

}


//判断是否该画此条线
function isCur(ary,curLine){
	var isDraw = 0;
	for(var i =0;i<ary.length;i++){
		if(curLine == ary[i]){
			return true;
		}
	}
	return false;
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
		
	
	if(isRight == '1'){
	var positionYRight = lineIni.clone({
			start:{x:drawWidth,y:drawHeight},
			end:{x:drawWidth,y:topPadding},
			stroke: "2px #3a3a3a"
		});//右侧纵坐标
		canvas.addChild(positionYRight);
	}
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	
}

function PDrawTextTra(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度
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
		var titleWidth = (drawWidth-drawleftpadding)/13;
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
		
		
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j-3,
				origin: { x: "right", y: "top" },
				text: FormatNUM(leftMax/(yNum-2)*j+"")+unit
			}));
		
		canvas.addChild(textYleft[j]);
	
		var isRight = arguments[6] || '1';
		if(isRight  == '1'){
			textYright.push(textIni.clone({
				x:drawWidth+8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "left", y: "top" },
				text:FormatNUM(rightMax/10*j+"")
			}));
			canvas.addChild(textYright[j]);
		}
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/yNum)*(j+1)+2},
			end:{x:drawWidth,y:drawHeight-(drawHeight/yNum)*(j+1)+2},
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
			y:drawHeight+20,
			origin: { x: "center", y: "top" },
			text:dealDate4(xTitle[num])
		}));
		canvas.addChild(textX[m]);
	}	
}


function PDrawText(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度
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
		var titleWidth = (drawWidth-drawleftpadding)/13;
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
		
		
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "right", y: "top" },
				text: parseInt(leftMax/(yNum-2)*j)+unit
			}));
		
		canvas.addChild(textYleft[j]);
	
		var isRight = arguments[6] || '1';
		if(isRight  == '1'){
			textYright.push(textIni.clone({
				x:drawWidth+8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "left", y: "top" },
				text:parseInt(rightMax/10*j)
			}));
			canvas.addChild(textYright[j]);
		}
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/yNum)*j},
			end:{x:drawWidth,y:drawHeight-(drawHeight/yNum)*j},
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
			y:drawHeight+20,
			origin: { x: "center", y: "top" },
			text:dealDate4(xTitle[num])
		}));
		canvas.addChild(textX[m]);
	}	
}



function PDrawNote(options,data,xTitle,textIni,arcIni,canvas,targetDate,color,typeName){//绘制图例下方的圈圈
	var dataList = data.number;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [],noteCon=[];
	var lastWidth = 256;

	
	var i = 0;
	var rectangleIni = canvas.display.rectangle({//定义矩形
						x: 77,
						y: 87,
						width: 200,
						height: 100
	});
	
	var unit  = textIni.clone({
			x:drawleftpadding-5,
			origin: { x: "right", y: "center" },
			y:8,
			text:typeName
		});
	canvas.addChild(unit);
	

	for(var x in targetDate){

		var length = xTitle[i].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 10,
			start:0,
			end:360,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:10,
			text:targetDate[x]
		}));
		canvas.addChild(noteText[i]);
		
		
		var conWidth = targetDate[x].length*9+20;
		noteCon.push(rectangleIni.clone({
				x: lastWidth-10,
				y: 0,
				width: conWidth+10,
				height: 15
		}));
		canvas.addChild(noteCon[i]);
		
		
		noteCon[i]._index = i;
		noteCon[i]._show = '1';
		
		
		noteCon[i].bind("click tap",function(){
				//this.stop();
				var i = this._index;
				var isShow = this._show;
			
				var choice = $("#trafficCon").attr("choice");
				if(isShow == '1'){
					noteArc[i].stroke = "2px #666666";
					this._show = '0';
					
					if(choice == '0'){
						linezheTraffic[i].opacity = 0;
					}else{
						if(linezheTraffic[i+4]){
							linezheTraffic[i+4].opacity = 0;
						}
					}
				}else if(isShow == '0'){
					noteArc[i].stroke = "2px "+color[i];
					this._show = '1';
					if(choice == '0'){
						linezheTraffic[i].opacity = 1;
					}else{
						if(linezheTraffic[i+4]){
							linezheTraffic[i+4].opacity = 1;
						}
					}
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
				return false;
		});
		
		lastWidth += options.fontSize*length+30;
		i++;
	}
	canvas.noteCon = noteCon;
}


function PDrawLine(options,data,bottomX,textIni,arcIni,lineIni,canvas,trafficDateName,color){
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var yNum = options.yNum;//绘制纵坐标上刻度
	var dataList = data.number;
	var xNum = dotLength;//标记
	var leftMax = data.leftY;
	var rightMax = data.rightY;

	var xWidth = (drawWidth-drawleftpadding)/xNum;
	var leftPerHeight = drawHeight/yNum;
	var dataList = data.number;//横坐标上有多少个点

	
	var i =0;
	var lineListIni = canvas.display.lineList({
			pointList:[],
			stroke: "2px #fff"
	});
	var zheline = [];
	for (var x in trafficDateName){
		var title = x;
		var list = dataList[x];
	
		var perWidth = xWidth/list.length;
		var lastX = xWidth*0+drawleftpadding;
		var lastY = drawHeight-list[0]*drawHeight*10/(11*leftMax);
		

		var lineAry =[];
		var lineValue = [];		
		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			if(/total/.test(title)){
				
				if(rightMax==0 || rightMax=="0" || rightMax==""){
					var curY =drawHeight;	
				}else{
					var curY = drawHeight-list[y]*drawHeight*10/(11*rightMax);	
				}	
			}else{
				
				
				if(leftMax==0 || leftMax=="0" || leftMax==""){
					var curY =drawHeight;	
				}else{
					var curY = drawHeight-list[y]*drawHeight*10/(11*leftMax);	
				}
			}
			var temp = [curX,curY];
			var temp2 = [curX,list[y]];
			lineAry.push(temp);		
			lineValue.push(temp2);
			
			if(DotX.length<91 && !options.isMini){
				DotX.push(curX);
			}
		}	
		dotPosition[x] = lineAry;//记录曲线坐标
		dotValue[x] = lineValue;
		zheline.push(lineListIni.clone({
			pointList:lineAry,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(zheline[i]);
		linezheTraffic.push(zheline[i]);
		i++;
	}
}


function PDrawLines(options,data,bottomX,canvas,trafficDateName,color,typeName){
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
		radius:6
	});
	
	if(canvas.isDraw != 1){
		PDrawXY(options,lineIni,textIni,canvas,'0');
		PDrawTextTra(options,data,bottomX,lineIni,textIni,canvas,'0');
		setTimeout(function(){
			PDrawLine(options,data,bottomX,textIni,arcIni,lineIni,canvas,trafficDateName,color);
			PDrawNote(options,data,bottomX,textIni,arcIni,canvas,trafficDateName,color,typeName);
		},200);
	}else{
		var dataList = data.number;
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
		var dataList = data.number;
		var xNum = dotLength;//标记
		var leftMax = data.leftY;
		var rightMax = data.rightY;

		var xWidth = (drawWidth-drawleftpadding)/xNum;
		var leftPerHeight = drawHeight/yNum;
		for (var x in trafficDateName){
		var title = x;
		var list = dataList[x];
	
		var perWidth = xWidth/list.length;


		var lineAry =[];
		var lineValue = [];		
		for(var y = 0;y<list.length;y++){
			var curX = xWidth*y+drawleftpadding+perWidth*y+(91-list.length)*xWidth;
			if(/total/.test(title)){
				var curY = drawHeight-list[y]*drawHeight*10/(11*rightMax);	
			}else{
				var curY = drawHeight-list[y]*drawHeight*10/(11*leftMax);	
			}
			var temp = [curX,curY];
			var temp2 = [curX,list[y]];
			lineAry.push(temp);		
			lineValue.push(temp2);
			
			if(DotX.length<91 && !options.isMini){
				DotX.push(curX);
			}
		}	
		dotPosition[x] = lineAry;//记录曲线坐标
		dotValue[x] = lineValue;
		}
	}
}



var constructorLineList = function (settings, core) {
	
	return oCanvas.extend({
		core: core,
		
		shapeType: "rectangular",

		init: function () {
			
		},
		
		draw: function () {
			var canvas = this.core.canvas;
				var pointAry = this.pointList;
				var fill = this.fill;
				canvas.beginPath();
				var height = this.height;

			if (this.strokeWidth > 0){
				canvas.strokeStyle = this.strokeColor;
				canvas.lineWidth = this.strokeWidth;
				var startx = pointAry[0][0];
				var starty = pointAry[0][1];
				
				canvas.moveTo(startx,starty);  
				canvas.lineTo(startx+1,starty+1);
				for(var i =1;i<pointAry.length;i++){
					var tempX = pointAry[i][0];
					var tempY = pointAry[i][1];
					canvas.lineTo(tempX,tempY); 
				}
			}

			if(fill){
				canvas.fillStyle = fill;
				canvas.fill();
			}
			canvas.stroke();  
			canvas.closePath();
		}
	}, settings);
};

oCanvas.registerDisplayObject("lineList", constructorLineList, "init");



var constructorLineListFill = function (settings, core) {
	
	return oCanvas.extend({
		core: core,
		
		shapeType: "rectangular",

		init: function () {
			
		},
		
		draw: function () {
			var canvas = this.core.canvas;
				var pointAry = this.pointList;
				var fill = this.fill;
				canvas.beginPath();
				var height = this.height;

			if (this.strokeWidth > 0) {
				canvas.strokeStyle = this.strokeColor;
				canvas.lineWidth = this.strokeWidth;
				var startx = pointAry[0][0];
				var starty = height;
				
				canvas.moveTo(startx,starty);  
				canvas.lineTo(pointAry[0][0],pointAry[0][1]); 
				canvas.stroke();  
				for(var i =1;i<pointAry.length;i++){
					
					var tempX = pointAry[i][0];
					var tempY = pointAry[i][1];
					canvas.lineTo(tempX,tempY); 
				}				
				canvas.lineTo(pointAry[pointAry.length-1][0],height); 
				
			}
			if(fill){
				canvas.fillStyle = fill;
				canvas.fill();
			}
			canvas.stroke();  
			canvas.closePath();
		}
	}, settings);
};

oCanvas.registerDisplayObject("lineListFill", constructorLineListFill, "init");




var constructorDotList = function (settings, core) {
	
	return oCanvas.extend({
		core: core,
		
		shapeType: "rectangular",

		init: function () {
			
		},
		
		draw: function () {
			var canvas = this.core.canvas;
				var pointAry = this.pointList;
				var fill = this.fill;
				canvas.beginPath();
				var height = this.height;
				var width = this.width;
				var ju = this.ju||9;
			if (this.strokeWidth > 0) {
				canvas.strokeStyle = this.strokeColor;
				canvas.lineWidth = this.strokeWidth;
				
				for(var i =0;i<height+5;i++){//绘制标记虚线
					if(i%ju == 0){
						canvas.moveTo(width,i+2+height/6);
						canvas.lineTo(width,i+ju+height/6);
					}
				}
				
			}
			if(fill){
				canvas.fillStyle = fill;
				canvas.fill();
			}
			

			canvas.stroke();  
			canvas.closePath();
		}
	}, settings);
};

oCanvas.registerDisplayObject("dotList", constructorDotList, "init");






function iniChartAry(){
	linezheTraffic =[];
	linezheUser = [];
	linezheUsage = [];
	usagezhelineAll = [];
	zhelineUser = [];
	linezheSat = [];
}

//当切换二级菜单时，相应切换标题
function changeTitle(title){
	var date = $("#title b").text();
	$("#title").html("<span>"+title+"<b>"+date+"</b></span>");
}


function setRightTime(){
	getDataThen(getUrl('index'), function(data){;
		var date = dealDate2(data["yesterday"]+"");
		$("#endDate").text(date);
	}, 'Public');
}



//处理数字为300,000形式
function FormatNUM(NUM) {
	var isfu = 0;
	if(/^-/.test(NUM)){
		NUM = NUM.replace("-","");
		isfu = 1;
	}
     if (/[^0-9\.]/.test(NUM)) return '0.00';
    NUM = NUM.replace(/^(\d*)$/, "$1.");
    NUM = (NUM + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    NUM = NUM.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(NUM)) {
        NUM = NUM.replace(re, "$1,$2");
    }
    NUM = NUM.replace(/,(\d\d)$/, ".$1");
    NUM = NUM.replace(/^\./, "0.");
	NUM = NUM.replace(/\.00$/,"");
	
	if(isfu == 1){
		NUM = "-"+NUM;
	}
	return NUM
}


function setMenuActive(){

}


//处理时间格式
function dealDate2(date){
	if(/^([0-9]+)\-([0-9]+)\-([0-9]+)$/.test(date)){
		return RegExp.$3+"-"+RegExp.$1+"-"+RegExp.$2;
	}
}

//处理时间格式
function dealDate3(date){
	if(/^([0-9]+)\-([0-9]+)\-([0-9]+)$/.test(date)){
		return RegExp.$2+"/"+RegExp.$1+"/"+RegExp.$3;
	}
}

//处理时间格式
function dealDate4(date){
	if(/^([0-9]+)\-([0-9]+)\-([0-9]+)$/.test(date)){
		return RegExp.$1+"-"+RegExp.$2+"-"+RegExp.$3;
	}
}



//处理时间格式
function dealDate(date){
	if(/^([0-9]+)\-([0-9]+)\-([0-9]+)$/.test(date)){
		return RegExp.$3+"/"+RegExp.$1+"/"+RegExp.$2;
	}
}




function setTitleOneDate(){
	getDataThen(getUrl('index'), function(data){
		var date = dealDate2(data["yesterday"]);
		$("#title b").text("("+date+")");
	}, 'Message');
}

//20141229设置时间段
function setTitleOfStartAndEneDate(){
	getDataThen(getUrl('index'), function(data){
		var yesterday = data["yesterday"];
		var date = dealDate2(data["yesterday"]);
		//第七天前
		var today=new Date(yesterday.substring(6,10),(yesterday.substring(0,2) - 1),yesterday.substring(3,5));
		today.setDate(today.getDate() - 6);
		var preSenvenDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		$("#title b").text("("+preSenvenDate+" to "+date+")");
	}, 'Message');
}



$(document).ready(function(){
	setMenuActive();
});


function clearIframe(id){
    var el = document.getElementById(id),
        iframe = el.contentWindow;
    if(el){
        el.src = 'about:blank';
        try{
            iframe.document.write('');
            iframe.document.clear();
        }catch(e){};
        //以上可以清除大部分的内存和文档节点记录数了
        //最后删除掉这个 iframe 就哦咧。
        $(el).remove();
    }
}


function clearCanvas(oldNum){

}


function showNote($this){
	$(".showNote").bind("tap click",function(){
		if($(this).find(".canvasNote2").size()==0){
			$("<b class='canvasNote2' ></b>").appendTo($(this));
		}
		var note = $(this).attr("title");
		$(".canvasNote2").hide();
		$(".canvasNote2",$(this)).show().text(note).css("left",0).css("top",0);
		setTimeout(function(){$(".canvasNote2").hide()},3000);
	});
}



function getX(obj){  
        var parObj=obj;    
        var left=obj.offsetLeft;    
        while(parObj=parObj.offsetParent){    
            left+=parObj.offsetLeft;    
        }    
        return left;    
    }    
    
    function getY(obj){    
        var parObj=obj;    
        var top=obj.offsetTop;    
        while(parObj = parObj.offsetParent){    
            top+=parObj.offsetTop;    
        }    
     return top;    
    }    
    
    function getCoordInDocument(id,event){    
        var top,left,oDiv;    
        oDiv=document.getElementById(id);    
        top=getY(oDiv);    
        left=getX(oDiv);    
        var x = (event.clientX-left+document.body.scrollLeft)-2;    
        var y = (event.clientY-top+document.body.scrollTop)-2;   
		return {'x':x,'y':y};
    }   








