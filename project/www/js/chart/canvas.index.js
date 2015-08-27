/**
 * @author zhouyuan
 * @version 1.0
 * @describe pie chart Based on oCanvas graphic
 */
 
var indexLIST = [["sat2","ott2","impact2"],["users1","devices1","usage1"]];//首页初始化配置

//绘制首页满意度
function indexDrawSat(data,id,color,key,showTitle){
	var options = {drawWidth:200,drawHeight:120,drawleftpadding:0,xinX:95,xinY:110,radius:53,borderWidth:12};
	var canvas = oCanvas.create({
		canvas: "#"+id,
		fps: 10
	});
	canvaslist.push(canvas);

	var lineIni = canvas.display.line({
		stroke: "2px #747778",
		cap: "round"
	});

	var textIni = canvas.display.text({
		origin: { x: "left", y: "top" },
		font: "normal 12pt GOTHIC",
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
	
	var rate;
	var count;
	var yu0,yu1,yu2;
	yu0 = 0;
	for(var i =0;i<data.length;i++){
		var name = data[i].typeKey;

		if(key+"Rate" == name){
			rate = data[i].value1;
		}else if(key+"Satisfaction" == name){
			count = data[i].value1;
		}
		
		if(key == "AllUsers" && name == "allUserThresholds"){
			yu1 = Number(data[i].value1);
			yu2 = Number(data[i].value2);
		}else if(key == "VIP" && name == "vipThresholds"){
			yu1 = Number(data[i].value1);
			yu2 = Number(data[i].value2);
		}else if(key == "KeyArea" && name == "areaThresholds"){
			yu1 = Number(data[i].value1);
			yu2 = Number(data[i].value2);
		}
	}
	count = FormatNUM(count+"");
	if(/%/.test(rate)){
		rate = rate.replace(/%/,"");
	}
	
	var wrapPiece = arcIni.clone({
		stroke: options.borderWidth+"px #1b1b1b"
	});
	
	var rate1;
	
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
		font: "normal 16pt GOTHIC",
		fill:"#fff",
		text:rate+"%"
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
		y:options.xinY+30,
		origin: { x: "center", y: "center" },
		font: "normal 14px GOTHIC",
		text:"Total :"+count,
		fill: "#b3b3b3"
	});
	
	var topTitle = textIni.clone({
		x:options.xinX,
		y:25,
		origin: { x: "center", y: "center" },
		font: "normal 15px GOTHIC",
		text:showTitle,
		fill: "#b3b3b3"
	});
	
	var dot1 = arcIni.clone({
		x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI/360*(-90)),
		y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI/360*(-90)),
		start:0,
		end:360,
		radius:2.5,
		fill: "#ab2d15"
	});
	
	var dot2Rate = -90+yu1*180/100;
	var dot2 = arcIni.clone({
		x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI /360*dot2Rate),
		y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI /360*dot2Rate),
		start:0,
		end:360,
		radius:2.5,
		fill: "#d18005"
	});
	
	var dot3Rate = -90+yu2*180/100;
	var dot3 = arcIni.clone({
		x:options.xinX+(options.radius-options.borderWidth)*Math.sin(2*Math.PI /360*dot3Rate),
		y:options.xinY-(options.radius-options.borderWidth)*Math.cos(2*Math.PI /360*dot3Rate),
		start:0,
		end:360,
		radius:2.5,
		fill: "#357c25"
	});
	
	canvas.addChild(wrapPiece);	
	canvas.addChild(innerPiece);	
	canvas.addChild(titleText);	
	canvas.addChild(startNum);	
	canvas.addChild(EndNum);	
	canvas.addChild(totalTitle);	
	
	canvas.addChild(dot1);
	canvas.addChild(dot2);
	canvas.addChild(dot3);
	canvas.addChild(topTitle);
	canvas = null;lineIni= null;textIni = null;arcIni = null;
	wrapPiece = null;innerPiece = null;titleText = null;startNum = null;EndNum = null;totalTitle = null;dot2 = null;dot3 = null;topTitle = null;
}


function iniIndexUser(data,id){
	var rightY;
	var inMax = data["leftYIn"];
	var outMax = data["leftYOut"];
	for(var i =0;i<data.length;i++){
		var name = data[i].typeKey;
		if(name == "Total"){
			rightY = data[i].value1;
		}else if(name == "Inbound"){
			inMax =  Number(data[i].value1);
		}else if(name == "Outbound"){
			outMax =  Number(data[i].value1);
		}
	}
	rightY= FormatNUM(rightY+"");
	var inMax2= FormatNUM(inMax+"");
	var outMax2= FormatNUM(outMax+"");
	var str = "<h2><span>Total :</span>"+rightY+"</h2>";
	str += "<dl><dt>Inbound</dt>";
	str += "<dd><span>"+inMax2+"</span><div id='inbar' ></div></dd>";
	str += "<dt>Outbound</dt>";
	str += "<dd><span>"+outMax2+"</span><div id='outbar' ></div></dd>";
	str += "</dl>";
	$(id).html(str);

	if(inMax == outMax && inMax== 0){
		$("#outbar").width(0);
		$("#inbar").width(0);
	}else{
	if(inMax>outMax){
		$("#inbar").width(150);
		var width = (outMax/inMax)*150;
		$("#outbar").width(width);
	}else{
		$("#outbar").width(150);
		var width = (inMax/outMax)*150
		$("#inbar").width(width);
	}
	}
}

function indexDrawTraffic(data,id){
		var options = {drawWidth:600,drawHeight:150,drawleftpadding:0,yNum:12,xinX:300,xinY:80,radius:45,hoverRadius:50,borderWidth:30,fontSize:14};
		var color =['#D18005','#F7D206','#4078DE','#4CB035'];
		var canvas2 = oCanvas.create({
			canvas: "#"+id,
			fps: 10
		});
		canvaslist.push(canvas2);
		var lineIni = canvas2.display.line({
			stroke: "1px #747778",
			cap: "round"
		});

		var textIni = canvas2.display.text({
			origin: { x: "left", y: "top" },
			font: "normal 14px GOTHIC",
			fill: "#b9b9b9"
		});
	
		var arcIni = canvas2.display.arc({
			x: options.xinX,
			y: options.xinY,
			stroke: "2px #161616",
			radius: options.radius
		});
	var pieces = [],lines=[],linesLevel=[],texts=[];

	if(!data ||(data && data.length==0))return;
	var lastrate = 0,lastcenterY=0,lastlastrate=0,lastlastlastrate=0;
	for (var i = 0; i < data.length; i++) {

			var rate =  data[i]["value1"].replace("%","");
			end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 60 : 0);
			var start = (i < 1 ? -58 : lastEnd+2);
			
		
	
			pieces.push(arcIni.clone({
				start: start,
				end: end,
				stroke: options.borderWidth+"px "+color[i]
			}));
		
			
		
	
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
		var centerYE = centerY;
	

		if(centerPoint>90 && centerPoint<=270){

			if(rate<6 && lastrate<6 && i!=0){
				centerYE= centerYE-13;
			}
			
			if(rate<6 && lastrate<6 && lastlastrate<6 && i!=0 && i!=1){
				centerYE= centerYE-13;
			}
			
			if(rate<6 && lastrate<6 && lastlastrate<6 && lastlastlastrate<6&& i!=0 && i!=1 && i!=2){
				centerYE= centerYE-13;
			}
			linesLevel.push(lineIni.clone({
				start:{x:centerX,y:centerY},
				end:{x:centerX-20,y:centerYE}
			}));
		
			var texe = rate+"%  "+data[i].typeKey;
			var size = texe.length*9;
			texts.push(textIni.clone({
				x:centerX-size,
				y:centerYE+5,
				text:texe,
				font: "normal "+options.fontSize+"px GOTHIC",
				origin: { x: "left", y: "bottom" }
			}));
		}else{
			if(rate<6 && lastrate<6 && i!=0){
				centerYE= centerYE+13;
			}
			
			if(rate<6 && lastrate<6 && lastlastrate<6 && i!=0 && i!=1){
				centerYE= centerYE+13;
			}
			
			if(rate<6 && lastrate<6 && lastlastrate<6 && lastlastlastrate<6&& i!=0 && i!=1 && i!=2){
				centerYE= centerYE+13;
			}
			
			
			
			
			linesLevel.push(lineIni.clone({
				start:{x:centerX,y:centerY},
				end:{x:centerX+20,y:centerYE}
			}));
		
			texts.push(textIni.clone({
				x:centerX+30,
				y:centerYE+5,
				text:rate+"%  "+data[i].typeKey,
				font: "normal "+options.fontSize+"px GOTHIC",
				origin: { x: "left", y: "bottom" }
			}));
		}
		
		canvas2.addChild(linesLevel[i]);
		canvas2.addChild(texts[i]);

		canvas2.addChild(pieces[i]);
		
		
		
		lastEnd = end;
		lastlastlastrate = lastlastrate;
		lastlastrate = lastrate;
		lastrate = rate;

		pieces[i]._start = pieces[i].start;
		pieces[i]._end = pieces[i].end;

	}
	
	canvas2 = null;lineIni= null;textIni = null;arcIni = null;
}


function indexDrawDevice(data,id){
	var str = "";	
	getDataConfig(settingUrl, function (data2) {
		var device = data2["index"]["child"]["devices"]["child"];
		var obj = [];
		for(var i =0;i<device.length;i++){
			var state = device[i]["hstate"];
			var name = device[i]["name"];
			if(state == "1"){
				for(var  j =0;j<data.length;j++){
					var title = data[j].typeKey;
					
					if(name == "Most Complaints"){
						name = "Most Complaint"
					}
					if(name == title && name != "Most Complaint"){//暂时屏蔽most Complaints
						var value = data[j].value1;
						str += "<dl>";
						if(title == 'Most Complaint'){
							title = "Most Complaints";
						}
						str += "<dt>"+title+"</dt>";
						str += "<dd class='showNote' title='"+value+"' >"+value+"</dd>";
						str += "</dl>";
						break;
					}
				}
			}
		}
		
	$(str).appendTo($(id));
	},"settings");	
}



var ImpactDefault=[];

function indexDrawImpact(data,id){
	var min = arguments[2] ||'0';
	var newList = {};
	
	
	var canvas = oCanvas.create({
		canvas: "#"+id,
		fps: 10
	});
	canvaslist.push(canvas);
	var lineIni = canvas.display.line({
		stroke: "2px #747778"
	});

	var textIni = canvas.display.text({
		origin: { x: "left", y: "top" },
		font: "normal 14px GOTHIC",
		fill: "#b9b9b9"
	});
	
	var arcIni = canvas.display.arc({
        start: 0,
        end: 360,
        stroke: "2px #161616",
        radius:3
    });

	getDataConfig(settingUrl, function (data2) {
		var impact = data2["index"]["child"]["impact"]["child"];

		for(var i =0;i<impact.length;i++){
			var state = impact[i]["hstate"];
			var name = impact[i]["name"];
			if(state == "1"){
				ImpactDefault.push(name);
			}
		}
		IndexImpactDrawText(data,lineIni,textIni,arcIni,canvas,min);
	},"settings");
	canvas = null;lineIni= null;textIni = null;arcIni = null;
}

function IndexImpactDrawText(data,lineIni,textIni,arcIni,canvas,min){//绘制横纵坐标刻度
		if(min == 'min'){
			var options = {drawWidth:200,drawHeight:160,drawleftpadding:80,yNum:12,fontSize:12,drawtoppadding:40};
		}else{
			var options = {drawWidth:340,drawHeight:160,drawleftpadding:80,yNum:12,fontSize:12,drawtoppadding:40};
		}
		
		var textX=[],textYleft=[],textYright=[],lineheng=[],lineshu=[];//横纵坐标
		var baseBar=[],baseArc=[],impactBar=[],baseText=[],impactText=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var topPadding = options.drawtoppadding || 20;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;

		var yNum = data.length;
		var leftPerHeight = drawHeight/5;

		var max = ImpactGetMax(data);//获取最大值

		var lLength = ImpactDefault.length;
		var newLength = lLength;
		if(lLength<4){
			var pian = lLength-4;
		}else{
			var pian = 0;
			newLength = 4; 
		}

		for(var j =0;j<newLength;j++){//绘制纵坐标	
			var name =ImpactDefault[newLength-1-j];
			if(name == 'WhatsApp'){
				name ="whatApp";
			}
			for(var i =0;i<data.length;i++){
			
			var names = data[i].typeKey;
			
			if(name == names){
			var value = name;
			
			if(value == 'whatApp'){
				value ="WhatsApp";
			}
			
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-leftPerHeight*(j-pian)-35,
				origin: { x: "right", y: "bottom" },
				font: "normal 12px GOTHIC",
				text:value
			}));
			canvas.addChild(textYleft[j]);
			
			
			var impact = parseInt(data[i].value1);
			var base = parseInt(data[i].value2);
			var vip =  parseInt(data[i].value3);
			var endx = (base/max)*drawWidth+drawleftpadding;

			var endy = drawHeight-leftPerHeight*(j-pian)-40;
		
		
			var color = "#cc8b0a";
			var  basecolor="#915805";
			if(impact<base){
				color = "#92aa16";
				basecolor = "#373737";
			}
			
			baseBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:endx,y:endy},
				stroke: "3px "+basecolor
			}));

		baseText.push(textIni.clone({
			x:endx,
			y:endy-18,
			text:FormatNUM(base+""),
			font: "normal 12px GOTHIC",
			fill: "#494949"
		}));

		
		
		if(impact>base && endx-drawleftpadding-2>=6){
				baseArc.push(arcIni.clone({
					x: endx-3,
					y: endy,
					radius:2.5,
					stroke: "2px "+basecolor
				}));
			}else if(impact>base && endx-drawleftpadding-2<6){
				baseArc.push(arcIni.clone({
					x: endx-3.5,
					y: endy,
					radius:0,
					stroke: "2px "+basecolor
				}));
			}else if(impact<=base){
				baseArc.push(arcIni.clone({
					x: endx+2.5,
					y: endy,
					radius:2.5,
					stroke: "2px "+basecolor
				}));
			}

		var endimpactx = (impact/max)*drawWidth+drawleftpadding;
		var textStart = endimpactx;

		if(textStart<drawleftpadding+40){
			textStart = drawleftpadding+20;
		}
		impactText.push(textIni.clone({
			x:textStart,
			y:endy+5,
			text:FormatNUM(impact+""),
			origin: { x: "left", y: "top" },
			font: "normal 12px GOTHIC",
			fill: "#494949"
		}));

	
		impactBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:endimpactx,y:endy},
				stroke: "10px "+color,
				opacity:0.9
		}));
		if(impact>base){
			canvas.addChild(impactBar[j]);
			canvas.addChild(baseBar[j]);
			if(max>0){
				canvas.addChild(baseArc[j]);
			}
		}else{
			canvas.addChild(baseBar[j]);
			if(max>0){
				canvas.addChild(baseArc[j]);
			}
			canvas.addChild(impactBar[j]);
		}
		
		if(max>0){
			canvas.addChild(baseText[j]);
			canvas.addChild(impactText[j]);
		}
		
		break;
		}
	}
	}
}


function IndexImapctDrawBar(data,lineIni,textIni,arcIni,arcIni,canvas){
	var options = {drawWidth:460,drawHeight:160,drawleftpadding:80,yNum:12,fontSize:14,drawtoppadding:30};
	var baseBar=[],baseArc=[],impactBar=[],baseText=[],impactText=[];//横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var topPadding = options.drawtoppadding || 20;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var dataList = data.number;
	
	var yNum = 0;
	for(var x in dataList){
		yNum++;
	}
	
	var max = ImpactGetMax(dataList);//获取最大值
	var j =0;
	for(var x in dataList){
		var base = dataList[x][1];
		var impact = dataList[x][0];
		var vip = dataList[x][2];
		var endx = (base/max)*(drawWidth-drawleftpadding)+drawleftpadding;
		var endy = drawHeight-(drawHeight/yNum)*(j+0.5);
		
		var color = "#d4691b";
		var basecolor = "#92aa16";
		if(impact<base){
			color = "#b7d41b";
			basecolor = "#cc8b0a";
		}
		
		baseBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:endx,y:endy},
				stroke: "3px "+basecolor
		}));
		
		baseText.push(textIni.clone({
			x:endx,
			y:endy-18,
			text:base,
			font: "normal 12px GOTHIC",
			fill: "#494949"
		}));
		
		
		baseArc.push(arcIni.clone({
				x: endx+4,
				y: endy,
				stroke: "3px "+basecolor
		}));
		
		
		var endimpactx = (impact/max)*(drawWidth-drawleftpadding)+drawleftpadding;
		var textStart = endimpactx;

		if(textStart<drawleftpadding+40){
			textStart = drawleftpadding+20;
		}
		impactText.push(textIni.clone({
			x:textStart,
			y:endy+10,
			text:impact,
			origin: { x: "right", y: "top" },
			font: "normal 12px GOTHIC",
			fill: "#494949"
		}));
		

		impactBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:endimpactx,y:endy},
				stroke: "10px "+color
		}));
		if(impact>base){
			canvas.addChild(impactBar[j]);
			canvas.addChild(baseBar[j]);
			canvas.addChild(baseArc[j]);
		}else{
			canvas.addChild(baseBar[j]);
			canvas.addChild(baseArc[j]);
			canvas.addChild(impactBar[j]);
		}
		canvas.addChild(baseText[j]);
		canvas.addChild(impactText[j]);
		j++;
	}
}

function ImpactGetMax(dataList){
	var max = 0;
	for(var i =0;i<dataList.length;i++){
		var value1 = parseInt(dataList[i].value1);
		var value2 = parseInt(dataList[i].value2);
		var value3 = parseInt(dataList[i].value3);
		if(value3>max){
			max = value3;
		}
		if(value2>max){
			max = value2;
		}
		if(value1>max){
			max = value1;
		}
	}
	return max;
}


//绑定首页点击链接
function bindLink(){

	$(".twoCOl").unbind("tap").tap(function(){
		var mode = $("#content").attr("mode");
		
		$(this).addClass("hitActive");
		if($(this).find(".deleteIcon").size()==0){
			var rel = $(this).find(">div").attr("rel");
			var mode = $("#content").attr("mode");

			if(mode == "edit"){
				$(".deleteIcon").remove();
				$(".twoCOl>div").removeClass("active");
				$(".oneCOl>div").removeClass("active");
				$(".twoCOl").removeClass("hitActive");
				$(".oneCOl").removeClass("hitActive");
				$("#content").attr("mode","");
			}else if(rel && mode != "edit"){
				var id = "P"+rel.replace(".html","");
				id=="Pott" && $("#"+id).attr('urlArg',$("#ottTitle").html());
				$("#"+id).tap();
			}
			return false;
		}
	});
	
	$(".oneCOl").unbind("tap").tap(function(){
		var mode = $("#content").attr("mode");
		var rel = $(this).find(">div").attr("rel");
		
		$(this).addClass("hitActive");
		
		if($(this).find(".deleteIcon").size()==0){
		if(mode == "edit"){
			$(".deleteIcon").remove();
			$(".twoCOl>div").removeClass("active");
			$(".oneCOl>div").removeClass("active");
			$(".twoCOl").removeClass("hitActive");
			$(".oneCOl").removeClass("hitActive");
			$("#content").attr("mode","");
		}else if(rel && mode != "edit"){
			var id = "P"+rel.replace(".html","");

            id=="Pott" && $("#"+id).attr('urlArg',$("#ottTitle").html());
			$("#"+id).tap();
		}
		}
		return false;
	});
	
	
	$(".twoCOl").bind("taphold",function(){//轻击不放删除
		if($(this).find(".addIcon").size()==0){
			$(".deleteIcon").remove();
			$(".twoCOl>div").removeClass("active");
			$(".oneCOl>div").removeClass("active");
			$("<span class='deleteIcon'></span>").appendTo($(this));
			$(this).find(">div").addClass("active");
			var  me = $(this);
			var index = me.attr("index");
			$(this).addClass("hitActive");
			me.find(".deleteIcon").tap(function(){
				me.html("<div><div class='addIcon'></div></div>");
				$(".twoCOl").removeClass("hitActive");
				$(".oneCOl").removeClass("hitActive");
				setIndexConfig(0,index,"");
				bindAdd(me,2);
				return false;
			});
			$("#content").attr("mode","edit");
			return false;
		}else{
			return false;
		}
	});
	
	
	$(".oneCOl").bind("taphold",function(){//轻击不放删除
		if($(this).find(".addIcon").size()==0){
			$(".deleteIcon").remove();
			$(".twoCOl>div").removeClass("active");
			$(".oneCOl>div").removeClass("active");
			$("<span class='deleteIcon'></span>").appendTo($(this));
			$(this).find(">div").addClass("active");
			var  me = $(this);
			var index = me.attr("index");
			me.find(".deleteIcon").tap(function(){
				me.html("<div><div class='addIcon'></div></div>");
				$(".twoCOl").removeClass("hitActive");
				$(".oneCOl").removeClass("hitActive");
				setIndexConfig(1,index,"");
				bindAdd(me,1);
				return false;
			});
			$("#content").attr("mode","edit");
			return false;
		}else{
			return false;
		}
	});
	
	
	$(".popDIv").tap(function(){
		$("#config").html("");
		$("#content").attr("mode","no");
		$(this).hide();
		return false;
	});
}

//更新首页配置本地存储
function setIndexConfig(i,j,value){
	var str = window.localStorage.getItem("INDEXCONFIG");
	var list = JSON.parse(str);
	list[i][j] = value;
	window.localStorage.setItem("INDEXCONFIG",JSON.stringify(list));
}


function indexiniUsage(data,id){
	var str = "";
	var list = ["Voice","VoiceRoming","Data","SMSRoming","SMS","DataRoming"];
	var newdata = [];
	for(var i =0;i<list.length;i++){
		var name = list[i];
		for(var j =0;j<data.length;j++){
			if(name == data[j]["typeKey"]){
				newdata.push(data[j]);
			}
		}
	}
	for(var i =0;i<newdata.length;i++){
		var title = newdata[i]["typeKey"];
		var num = parseFloat(newdata[i]["value1"]);
		var change =  newdata[i]["value2"];
		var classs = "up";
		var unit = "Min/User/Day";
		if(change == "-"){
			classs = "down";
		}else{
            classs = "up";
        }
		if(title == "SMS" ){
			unit = "/User/Day";
		}else if(title == "SMSRoaming" || title == "SMSRoming"){
			unit = "/User/Day";
			title = "SMS Roaming"
		}else if(title == "Data"){
			unit = "MB/User/Day";
		}else if(title == "DataRoaming"|| title == "DataRoming"){
			unit = "MB/User/Day";
			title = "Data Roaming"
		}else if(title == "VoiceRoaming"|| title == "VoiceRoming"){
			title = "Voice Roaming"
		}
		str += "<dl><dt>"+title+":</dt>";

		
		if(parseFloat(change) != 0){
			str += "<dd><span class='"+classs+"'></span><b class='"+classs+"'>"+num+"</b><i>"+unit+"</i></dd></dl>";
		}else{
			str += "<dd><b class='zero'> </b><b class='none'>"+num+"</b><i>"+unit+"</i></dd></dl>";
		}
	}
	$(id).html(str);
}




function indexiniRISK(data,id){
	var options = {drawWidth:580,drawHeight:140,drawleftpadding:55,yNum:7,fontSize:12,drawtoppadding:0,xPian:0,levelPian:10};
	var canvas = oCanvas.create({
        canvas: "#"+id,
        fps: 10
    });
	canvaslist.push(canvas);
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
		var xTitle = data["bottomX"];
		indexDrawRISKText(options,data,xTitle,lineIni,textIni,canvas,'1');
		indexDrawRISKBar(options,data,canvas,xTitle);
		indexDrawRISKLine(options,data,canvas,lineIni,textIni,arcIni,xTitle);
		indexDrawRISKNote(options,data,xTitle,textIni,arcIni,canvas);
	}
	ini(data);
}

function indexDrawOTTword(data,id){
	var str = "";
	var list1 = [0,0,0];
	var list2 = [0,0,0];
	for(var i =0;i<data.length;i++){
		var title = data[i]["typeKey"];
		var sort =  data[i]["value2"];
		var value = data[i]["value1"];
		if(title == "Top3AppsByTraffic"){
			if(sort == 1){
				list1[0] = value;
			}else if(sort == 2){
				list1[1] = value;
			}else if(sort == 3){
				list1[2] = value;
			}
		}
		
		if(title == "Top3AppsByGrowth"){
			if(sort == 1){
				list2[0] = value;
			}else if(sort == 2){
				list2[1] = value;
			}else if(sort == 3){
				list2[2] = value;
			}
		}
	}
	str += "<h3>Top3 OTT Services by Traffic</h3><ul>";
	for(var i =0;i<list1.length;i++){
		var num = i+1;
		str += "<li><span>"+num+"</span>"+list1[i]+"</li>";
	}
	str += "</ul><ul><h3>Top3 OTT Services by Growth</h3>";
	for(var i =0;i<list2.length;i++){
		var num = i+1;
		str += "<li><span>"+num+"</span>"+list2[i]+"</li>";
	}
	str += "</ul>";
	$(id).html(str);
}

function indexDrawOTT(data,id,min,id2){
	var options = {drawWidth:630,drawHeight:140,drawleftpadding:20,yNum:7,fontSize:14,drawtoppadding:30,xPian:0,levelPian:6};
	var optionsMin =  {drawWidth:300,drawHeight:135,drawleftpadding:0,yNum:7,fontSize:0,drawtoppadding:50,xPian:17,levelPian:0,isMini:true};
	var canvas = oCanvas.create({
        canvas: "#"+id,
        fps: 10
    });
	canvaslist.push(canvas);
	 var lineIni = canvas.display.line({
        stroke: "2px #747778",
        cap: "round"
    });

    var textIni = canvas.display.text({
        origin: { x: "left", y: "top" },
        font: "normal 11px GOTHIC",
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
		var xTitles = {};
		var xTitle = [];
		var datas = data["ottInsight"];
		var config;
		
		getDataConfig(settingUrl, function (data2) {
		var ott = data2["index"]["child"]["ott"]["child"];

		for(var i =0;i<ott.length;i++){
			var state = ott[i]["hstate"];
			var name = ott[i]["name"];
			if(state == "1"){
				config = name;
				break;
			}
		}
		
		var conText;
		if(config == "speedTest"){
			config = "Speed Test";
		}else if(config == "whatsAPP"){
			conText = "whats APP";
		}
		
		
		$(id2).text(config);
		if(config){
		for(var i =0;i<datas.length;i++){
			var value1 = datas[i].value1;
			var typeKey =  datas[i].typeKey;
			if(typeKey == "youtube"){
				typeKey = "Youtube";
			}else if(typeKey == "whatsAPP"){
				typeKey = "WhatsApp";
			}
			if(typeKey == config){
				xTitles[value1] = value1;
			}
		}
		
		for(var x in xTitles){
			if(x != "leftY"){
				xTitle.push(x);
			}
		}
		
		
		if(min == '1'){
			indexDrawOTTText(optionsMin,data,lineIni,textIni,canvas,'0',xTitle,config);
			indexDrawOTTBar(optionsMin,data,canvas,lineIni,textIni,arcIni,xTitle,config);
			indexDrawOTTNote(optionsMin,data,textIni,arcIni,canvas);
		}else{
			indexDrawOTTText(options,data,lineIni,textIni,canvas,'0',xTitle,config);
			indexDrawOTTBar(options,data,canvas,lineIni,textIni,arcIni,xTitle,config);
			indexDrawOTTNote(options,data,textIni,arcIni,canvas);
		}
		}
	},"settings");
	
	
		
	}
	ini(data);
	canvas = null;lineIni= null;textIni = null;arcIni = null;
	ini = null;
}


function indexDrawOTTNote(options,data,textIni,arcIni,canvas){//绘制图例下方的圈圈
	var xTitle = ["2G","3G","LTE"];
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [];
	if(!options.isMini){
		var lastWidth =410;
		var y = 8;
	}else{
		var lastWidth =150;
		var y = 20;
	}
	var color = ["#3d8d2a","#3360b2","#ffae0d"];
	var i = 0;
	var length = xTitle[i].length;
	for(var x in xTitle){
		
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: y,
			start:0,
			end:360,
			radius:6,
			stroke: "2.5px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:y,
			text:xTitle[x]
		}));
		canvas.addChild(noteText[i]);
		
		lastWidth += options.fontSize*length+50;
		i++;
	}
}


function indexDrawOTTBar(options,data,canvas,lineIni,textIni,arcIni,xTitle,type){
	var color = ["#3d8d2a","#3360b2","#ffae0d"];
	var rectangleIni = canvas.display.rectangle({//定义矩形
		x: 77,
		y: 87,
		width: 200,
		height: 100,
		fill: "#0aa"
	});

	var dataList = data["ottInsight"];
	if(dataList){
	var topPadding = options.drawtoppadding;
	var bottomX = data.bottomX;

	var noteArc = [],noteText = [];
	var bar = [],bar3 = [],bar4 = [];
	
	var size = data["ottInsight"].length;
	var lastX =10;
	var start = 0;
	var newList2 = [];
	var newList3 = [];
	var newList4 = [];
	var max = 0;

	if(type == "Speed Test"){	
		for(var i = 0;i<size;i++){
			var typeKey = data["ottInsight"][i].typeKey;
			if(typeKey == 'Speed Test'){
				if(data["ottInsight"][i]["value1"] == 'leftY'){
					max = data["ottInsight"][i]["value2"];
				}else if(data["ottInsight"][i]["value2"] == "2G"){
					newList2.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "3G"){
					newList3.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "LTE"){
					newList4.push(data["ottInsight"][i]);
				}
			}
		}
	}else if(type == "youtube" || type == "Youtube"){
		for(var i = 0;i<size;i++){
			var typeKey = data["ottInsight"][i].typeKey;
			if(typeKey == "youtube"){
				typeKey = "Youtube";
			}
			if(typeKey == 'Youtube'){
				if(data["ottInsight"][i]["value1"] == 'leftY'){
					max = data["ottInsight"][i]["value2"];
				}
				if(data["ottInsight"][i]["value2"] == "2G"){
					newList2.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "3G"){
					newList3.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "LTE"){
					newList4.push(data["ottInsight"][i]);
				}
			}
		}
	}else if(type == "whatsAPP" || type == "WhatsApp" ){
		for(var i = 0;i<size;i++){
			var typeKey = data["ottInsight"][i].typeKey;
			if(typeKey == "whatsAPP"){
				typeKey = "WhatsApp";
			}
			if(typeKey == 'WhatsApp'){
				if(data["ottInsight"][i]["value1"] == 'leftY'){
					max = data["ottInsight"][i]["value2"];
				}
				if(data["ottInsight"][i]["value2"] == "2G"){
					newList2.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "3G"){
					newList3.push(data["ottInsight"][i]);
				}else if(data["ottInsight"][i]["value2"] == "LTE"){
					newList4.push(data["ottInsight"][i]);
				}
			}
		}
	}

	var m =0;
	
	for(var j = 0;j<newList2.length;j++){
		var value2 = parseInt(newList2[j]["value3"])||0;
		var value3 = parseInt(newList3[j]["value3"])||0;
		var value4 = parseInt(newList4[j]["value3"])||0;

		var perWidth = options.drawWidth/(newList2.length*2.2);
		var x2 = lastX+perWidth;
		var x3 = lastX+perWidth+ perWidth/3;
		var x4 = lastX+perWidth+2*perWidth/3;

		var y2 = options.drawHeight-(((options.drawHeight-topPadding)/max)*value2);
		var y3 = options.drawHeight-(((options.drawHeight-topPadding)/max)*value3);
		var y4 = options.drawHeight-(((options.drawHeight-topPadding)/max)*value4);
		var width = perWidth/3;
		var height2 = ((options.drawHeight-topPadding)/max)*value2;
		var height3 = ((options.drawHeight-topPadding)/max)*value3;
		var height4 = ((options.drawHeight-topPadding)/max)*value4;

		bar.push(rectangleIni.clone({
			x: x2+m*width,
			y: y2,
			width: width,
			height: height2,
			fill: color[0]
		}));
		
		bar3.push(rectangleIni.clone({
			x: x3+m*width,
			y: y3,
			width: width,
			height: height3,
			fill: color[1]
		}));
		
		bar4.push(rectangleIni.clone({
			x: x4+m*width,
			y: y4,
			width: width,
			height: height4,
			fill: color[2]
		}));
		
		canvas.addChild(bar[m]);	
		canvas.addChild(bar3[m]);
		canvas.addChild(bar4[m]);
		lastX = x4;
		m++;
	}
	}
}

function indexDrawOTTText(options,data,lineIni,textIni,canvas,isRight,xTitle){//绘制横纵坐标刻度

		var lineShort=[],textX=[],textYleft=[],textYRight=[],lineheng=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var yNum = options.yNum;//绘制纵坐标上刻度
	
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
		var titleWidth = (drawWidth-drawleftpadding)/(xTitle.length)+options.levelPian;
		

	var lastX = 10;
	var perWidth = options.drawWidth/(xTitle.length*2.2);
	for(var m = 0;m<xTitle.length;m++)
	{
		var x3 = lastX+perWidth+ 2*perWidth/3+m*perWidth/3;
		textX.push(textIni.clone({
			x:x3-5,
			y:drawHeight+10,
			origin: { x: "center", y: "top" },
			text:xTitle[m]
		}));
		canvas.addChild(textX[m]);
		lastX = lastX+perWidth+2*perWidth/3;
	}	
}


var riskNote = {"capitalLost":"Potential  revenue lost","churnUsers":"Potential churn users"};
function indexDrawRISKNote(options,data,xTitle,textIni,arcIni,canvas){//绘制图例下方的圈圈
	var dataList = data.number;
	var drawleftpadding = options.drawleftpadding;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var noteArc = [],noteText = [];
	var lastWidth =300;
	var color =['#3aaee3','#a2ca33','#a2ca33','#3aaee3'];
	var i = 0;
	for(var x in riskNote){
		var length = xTitle[i].length;
		noteArc.push(arcIni.clone({
			x: lastWidth,
			y: 8,
			start:0,
			end:360,
			radius:6,
			stroke: "2px "+color[i]
		}));
		
		canvas.addChild(noteArc[i]);		
		
		noteText.push(textIni.clone({
			origin: { x: "left", y: "center" },
			x:lastWidth+15,
			y:8,
			text:riskNote[x]
		}));
		canvas.addChild(noteText[i]);
		
		lastWidth += options.fontSize*length+40;
		i++;
		}
}


function indexDrawRISKLine(options,data,canvas,lineIni,textIni,arcIni,xTitle){//绘制折线图
	var Max = data.rightY.replace("$","").replace("K","");
	var dataList = data.number;
	var data = dataList["capitalLost"];

	var arcs=[],line=[];
	var topPadding = options.drawtoppadding;
	var titleWidth = (options.drawWidth-options.drawleftpadding)/(xTitle.length+1)+options.levelPian;
	var perWidth = options.drawWidth/9;
	for(var i =0;i<data.length;i++){
		
		var value = data[i];
		
		var x = options.drawleftpadding+titleWidth*i+perWidth/3+perWidth/6+(8-data.length)*titleWidth;
		var y = options.drawHeight-5/6*options.drawHeight/Max*data[i];

		
		var nextx = options.drawleftpadding+titleWidth*(i+1)+perWidth/3+perWidth/6+(8-data.length)*titleWidth;
		var nexty = options.drawHeight-5/6*options.drawHeight/Max*data[i+1];
	
		arcs.push(arcIni.clone({
				x: x,
				y: y,
				radius:4,
				fill:"#47c5fe",
				stroke: "3px #4078de"
		}));

				
		
		line.push(lineIni.clone({
			start:{x:x+4,y:y},
			end:{x:nextx-4,y:nexty},
			stroke: "2px #4078de"
		}));	
		canvas.addChild(arcs[i]);	
		canvas.addChild(line[i]);	
	}
}

function indexDrawRISKBar(options,data,canvas,xTitle){
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
	var titleWidth = (options.drawWidth-options.drawleftpadding)/(xTitle.length+1)+options.levelPian;
	for(var i =0;i<dataList.length;i++){
		
		var value = dataList[i];
		var perWidth = options.drawWidth/8;
		var x = options.drawleftpadding+titleWidth*i+perWidth/3+(8-dataList.length)*titleWidth;;
		var y = options.drawHeight;
		var width = perWidth/4;
		var height = 5/6*options.drawHeight/Max*value;
		
		bar.push(rectangleIni.clone({
				x: x,
				y: y-height,
				width: width,
				height: height,
				fill: "#a2ca33"
		}));
		canvas.addChild(bar[i]);	
	}
	rectangleIni = null;
}


function indexDrawRISKText(options,data,xTitle,lineIni,textIni,canvas){//绘制横纵坐标刻度

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
		var titleWidth = (drawWidth-drawleftpadding)/(xTitle.length+1)+options.levelPian;
		for(var j = 0;j<yNum-1;j++){//绘制纵坐标
		
		
			textYleft.push(textIni.clone({
				x:drawleftpadding-8,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "right", y: "center" },
				text: FormatNUM(leftMax/(yNum-2)*j+"")
			}));
		
		canvas.addChild(textYleft[j]);
		
		if(isRight == '1'){
			textYRight.push(textIni.clone({
				x:drawWidth+5,
				y:drawHeight-(drawHeight/(yNum-1))*j,
				origin: { x: "left", y: "center" },
				text: "$"+FormatNUM(rightMax/(yNum-2)*j+"")+"k"
			}));
			canvas.addChild(textYRight[j]);
		}
		
		lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding,y:drawHeight-(drawHeight/(yNum-1))*j},
			end:{x:drawWidth,y:drawHeight-(drawHeight/(yNum-1))*j},
			stroke: "1px #282828"
		}));
		canvas.addChild(lineheng[j]);
	}

	
	for(var m = 0;m<xTitle.length;m++)
	{
		lineShort.push(lineIni.clone({//绘制横坐标的短线
			start: { x: drawleftpadding+titleWidth*m, y: drawHeight },
			end: { x:drawleftpadding+titleWidth*m, y: drawHeight+3 },
			stroke: "2px #3a3a3a"
		}));

		canvas.addChild(lineShort[m],false);
		
		textX.push(textIni.clone({
			x:drawleftpadding+titleWidth*m+options.xPian,
			y:drawHeight+10,
			origin: { x: "center", y: "top" },
			font: "normal 10px GOTHIC",
			text:xTitle[m]
		}));
		canvas.addChild(textX[m]);
	}	
}


function bindAdd($this,type){//type字段用于判断是两列还是一列
	$(".addIcon",$this).tap(function(){
		var str ="";
		var $con = $(this).parent().parent();
		var index = $con.attr("index");
		getDataConfig(settingUrl, function (data) {

			str += "<div class='choiceCon' ><span class='last' ></span>";
			str += "<div  class='hiddenCons'><ul id='choice' type='"+type+"'>";
			
			var homeConfig =  data["index"]["child"];
	
			for(var x in homeConfig){
				var state = homeConfig[x]["state"];
				
				if(state == '1'){
					if(type ==2){
						if(x == "sat" || x == "traffic" || x == "risk" || x == "impact" || x == "ott"){
							if($("div[type='"+x+"2']").size()>0 || $("div[type='"+x+"1']").size()>0 || $("div[type='"+x+"1word']").size()>0){
								str += "<li class='"+x+"2Active  columntwo' ></li>";
							}else{
								str += "<li class='"+x+"2  columntwo' rel='"+x+"' rel2='"+x+"2'  type='0' ></li>";
							}
						}
					}else if(type == 1){
						if(x == "users" || x == "devices"  || x == "impact" || x == "usage"){
							if($("div[type='"+x+"1']").size()>0 || $("div[type='"+x+"2']").size()>0){
								str += "<li class='"+x+"1Active  columnone' ></li>";
							}else{
								str += "<li class='"+x+"1  columnone' rel='"+x+"'   rel2='"+x+"1' type='1' ></li>";
							}
						}else if(x == "ott"){
							if($("div[type='ott1']").size()>0 || $("div[type='ott2']").size()>0){
								str += "<li class='ott1Active  columnone'  ></li>";
							}else if($("div[type='ott1']").size()==0 || $("div[type='ott2']").size()==0){
								str += "<li class='ott1  columnone' rel='ott1'   rel2='"+x+"1' type='1' ></li>";
							}
							
							if($("div[type='ott1word']").size()>0 || $("div[type='ott1']").size()>0 || $("div[type='ott2']").size()>0){
								str += "<li class='ott1wordActive  columnone'  ></li>";
							}else{
								str += "<li class='ott1word  columnone' rel='ott1word'   rel2='"+x+"1word' type='1' ></li>";
							}
						}
					}
					
				}
			}
			
			str += "</div></ul><span class='next' ></span>";
			str += "</div>";

			$("#config").html(str);
			$(".popDIv").show();
		}, 'settings');
		
		var time = 0;
		function movelast(){
			var marginLeft = parseInt($("#choice").css("margin-left").replace("px",""));
			var width = $("#choice").parent().width()+3;
			if(time>0){
				if(time == 1){
					$("#choice").stop().animate({"margin-left":0},800);
				}else{
					var margin = marginLeft+width;
					$("#choice").stop().animate({"margin-left":margin},800);
				}
				time--;
			}
			
		}
		$("span.last").tap(function(){
			movelast();
			return false;
		});
		

		
	
		
		function movenext(type){
			var marginLeft = parseInt($("#choice").css("margin-left").replace("px",""));
			var width = $("#choice").parent().width()-2;
			if(type == 1){
				var li = $("#choice>li").size();
				if(time<li/4-1){
					var margin = marginLeft-width;
					$("#choice").stop().animate({"margin-left":margin},800);
					time++;
				}
			}else{
				var li = $("#choice>li").size();
				if(time<li/2-1 ){
					var margin = marginLeft-width;
					$("#choice").stop().animate({"margin-left":margin},800);
					time++;
				}
			}
			
		}
		
		$("span.next").tap(function(){
			movenext(type);
			return false;
		});
		
		
		$(document).off("swipeleft","#config");
		$(document).on("swipeleft","#config",function(){
			movenext(type);
			return false;
		});

		$(document).off("swiperight","#config");
		$(document).on("swiperight","#config",function(){
			movelast();
			return false;
		});
		
		
		
		$("#config li").tap(function(){
			var rel = $(this).attr("rel");
			if(rel){
				var rel2 = $(this).attr("rel2");
				var type = $(this).attr("type");
				var url = "index/"+rel2+".html";
				//alet(rel2);
				$con.html("").attr("rel",rel+".html").load(url,function(){
					setIndexConfig(type,index,rel2);
					$(".popDIv").hide();
					$("#config").html("");
					$("#content").attr("mode","");
				});
			}
			return false;
		});
		
		return false;
	});
}


function readIndexSetting(){
	 getDataConfig(settingUrl, function (data) {
		var config = data["index"]["child"];
		for(var x in config){
			
		}
	 },"settings");
}

//初始化首页各个模块
function  iniINDEX(){
	var  INDEXCONFIG =  window.localStorage.getItem("INDEXCONFIG");
	var list = [];
	if(INDEXCONFIG){
		list = JSON.parse(INDEXCONFIG);
	}else{
		list = indexLIST;
		var str = JSON.stringify(indexLIST);
		window.localStorage.setItem("INDEXCONFIG",str);
	}
	
	 getDataConfig(settingUrl, function (data) {
		var config = data["index"]["child"];
		
		for(var i = 0;i<3;i++){
			var modeName1 = list[0][i].replace(/[0-9]/,"").replace("word","");
			var modeName2 = list[1][i].replace(/[0-9]/,"").replace("word","");
			if(list[0][i] && config[modeName1].state == 1){
				var url1 = "index/"+list[0][i]+".html";
			}else{
				var url1 = "index/add.html";
			}
		
			if(list[1][i] && config[modeName2].state == 1){
				var url2 = "index/"+list[1][i]+".html";
			}else{
				var url2 = "index/add.html";
			}
			
			$(".twoCOl:eq("+i+")").load(url1);
			$(".oneCOl:eq("+i+")").load(url2);
		}
	 },"settings");
	
}






