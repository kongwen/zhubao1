/**
 * @author zhouyuan
 * @version 1.0
 * @describe pie chart Based on oCanvas graphic
 */

var options = {drawWidth:400,drawHeight:350,drawleftpadding:180,yNum:12,fontSize:14,drawtoppadding:0};
var optionsMin = {drawWidth:220,drawHeight:90,drawleftpadding:0,xinX:100,xinY:60,radius:50,borderWidth:10};

var optionsTrend = {xinX:258,xinY:120,radius:45,hoverRadius:50,borderWidth:20,fontSize:14};

var color =['#2a4e91','#8c7704','#3d8d2a','#ffae0d'];
var subcolor = ['#b49c19','#b6b413','#839d1d'];
var satDateName=["allService","voice","data"];

var ImpactDefault=[];

function drawUserImpact(options,id,data){
    //if($("#"+id+)&& $("#"+id).length>0){
        var ini = function(data){
            var dataList = data["voiceToActivtion"];
            drawUserImpactLine(options,dataList,id+"Left","left");

            var dataListRight  = data["youtubeToGoogle"];
            drawUserImpactLine(options,dataListRight,id+"Right","right");
            setTitleOneDate();
        }
        ini(data);
   // }
}


function drawUserImpactLine(options,dataList,id,type){
	var canvas = oCanvas.create({
		canvas: "#"+id,
		fps: 10
	});
	
	var lineIni = canvas.display.line({
		stroke: "2px #747778"
	});

	var textIni = canvas.display.text({
		origin: { x: "left", y: "top" },
		font: "normal 12px GOTHIC",
		fill: "#b9b9b9"
	});
	
	var arcIni = canvas.display.arc({
        start: 0,
        end: 360,
        stroke: "2px #161616",
        radius:4
    });

	
	
	
	getDataConfig(settingUrl, function (data){
		var showList =  data["impact"]["child"][0]["child"] || data["impact"]["child"][1]["child"];
		ImpactDrawXY(options,lineIni,textIni,canvas,dataList,showList,type);
		ImpactDrawText(options,dataList,lineIni,textIni,canvas,showList,type);
		setTimeout(function(){
			ImapctDrawBar(options,dataList,lineIni,textIni,arcIni,arcIni,canvas,showList,type);
		},200);
	}, 'settings');
}


function ImpactDrawXY(options,lineIni,textIni,canvas,data,showList,type){//绘制横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var topPadding = options.drawtoppadding || 0;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var dataList = data.number;
	var length = 6;
	var num = 0;
		for(var n =0;n<showList.length;n++){
			var state = showList[n]["state"];
			var position = showList[n]["position"];
			if(state=='1' && position==type){
				num++;
			}
		}

	var positionX = lineIni.clone({
			start:{x:drawleftpadding,y:num*drawHeight/6},
			end:{x:drawWidth,y:num*drawHeight/6},
			stroke: "1px #3a3a3a"
		});//横坐标线
	var positionYLeft = lineIni.clone({
			start:{x:drawleftpadding,y:num*drawHeight/6},
			end:{x:drawleftpadding,y:topPadding},
			stroke: "1px #3a3a3a"
		});//左侧纵标线
		
	canvas.addChild(positionX);
	canvas.addChild(positionYLeft);
	
}

function ImapctDrawBar(options,data,lineIni,textIni,arcIni,arcIni,canvas,showList,type){
	var baseBar=[],baseArc=[],impactBar=[],baseText=[],impactText=[];//横纵坐标
	var drawleftpadding = options.drawleftpadding;
	var topPadding = options.drawtoppadding || 20;
	var drawHeight = options.drawHeight;
	var drawWidth = options.drawWidth;
	var dataList = data.number;
	var max = parseInt(data.bottomXMax);
	var yNum = 6;
	var length = 0;
		for(var n =0;n<showList.length;n++){
			var state = showList[n]["state"];
			var position = showList[n]["position"];
			if(state=='1' && position==type){
				length++;
			}
		}
	

		var j =0;
		var m = 0;
	for(var i =0;i<showList.length;i++){
			var position = showList[i]["position"];
			var state = showList[i]["state"];
			var  key = showList[i]["name"];
		if(position == type && state == '1' && dataList[key]){
		
			var base = dataList[key][1];
			var impact = dataList[key][0];
			var vip = dataList[key][2];
			var endx = (base/max)*(drawWidth-drawleftpadding)+drawleftpadding;
			var endy = (drawHeight/yNum)*(j+0.5);
		
			var color = "#d4691b";
			var basecolor = "#944913";
			if(impact<=base){
				color = "#b7d41b";
				basecolor = "#373737";
			}
		
			baseBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:drawleftpadding+2,y:endy},
				stroke: "3px "+basecolor
			}).animate({end:{x:endx,y:endy}},500));
		
		
				baseText.push(textIni.clone({
					x:endx,
					y:endy-25,
					text:FormatNUM(base+""),
					font: "bold 12px GOTHIC",
					fill: "#494949"
				}));
			
		
			if(impact>base && endx-drawleftpadding-2>=8){
				baseArc.push(arcIni.clone({
					x: endx-3,
					y: endy,
					radius:2.5,
					stroke: "2px "+basecolor
				}));
			}else if(impact>base && endx-drawleftpadding-2<8){
				baseArc.push(arcIni.clone({
					x: endx-3,
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
		
		
			var endimpactx = (impact/max)*(drawWidth-drawleftpadding)+drawleftpadding;
			var textStart = endimpactx;

			if(textStart<drawleftpadding+40){
				textStart = drawleftpadding+50;
			}
			
			
				impactText.push(textIni.clone({
					x:textStart,
					y:endy+15,
					text:FormatNUM(impact+"")+"("+FormatNUM(vip+"")+")",
					origin: { x: "center", y: "top" },
					font: "bold 12px GOTHIC",
					fill: "#494949"
				}));
			
			
		
		
	
			impactBar.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding+2,y:endy},
				end:{x:drawleftpadding+2,y:endy},
				opacity:0.9,
				stroke: "12px "+color
			}).animate({end:{x:endimpactx,y:endy}},500));

			if(impact<=base){
				canvas.addChild(baseBar[m]);
				if(max>0){
					canvas.addChild(baseArc[m]);
				}
				canvas.addChild(impactBar[m]);
			}else{
				canvas.addChild(impactBar[m]);
				canvas.addChild(baseBar[m]);
				if(max>0){
					canvas.addChild(baseArc[m]);
				}
			}
			if(max>0){
				canvas.addChild(baseText[m]);
				canvas.addChild(impactText[m]);
			}
			j++;
			m++;
		}
		
	}
}

function ImpactGetMax(dataList){
	var max = 0;
	for(var x in dataList){
		for(var i =0;i<dataList[x].length;i++){
			if(dataList[x][i]>max){
				max = dataList[x][i];
			}
		}
	}
	return max;
}


function ImpactDrawText(options,data,lineIni,textIni,canvas,showList,type){//绘制横纵坐标刻度
		var lineShort=[],textX=[],textYleft=[],textYright=[],lineheng=[],lineshu=[];//横纵坐标
		var drawleftpadding = options.drawleftpadding;
		var topPadding = options.drawtoppadding || 20;
		var drawHeight = options.drawHeight;
		var drawWidth = options.drawWidth;
		var dataList = data.number;
		var yNum = 6;
		
		//横坐标上有多少个点
		var xNum = 5;//标记
		var leftMax = data.leftY;
		var rightMax = data.rightY;

		var bottomXMax = data.bottomXMax;
	
	
		var leftPerHeight = drawHeight/yNum;
		var titleWidth = (drawWidth-drawleftpadding)/xNum;
		var length = 0;
		for(var n =0;n<showList.length;n++){
			var state = showList[n]["state"];
			var position = showList[n]["position"];
			if(state=='1' && position==type){
				length++;
			}
		}

	var j =1;
	var nn = 0;
	for(var i =0;i<showList.length;i++){//绘制纵坐标
			var position = showList[i]["position"];
			var state = showList[i]["state"];
			var  key = showList[i]["name"];
			if(position == type && state == '1' && dataList[key]){

			textYleft.push(textIni.clone({
				x:drawleftpadding-30,
				y:leftPerHeight*j-30,
				origin: { x: "right", y: "bottom" },
				font: "normal 14px GOTHIC",
				fill:'#fff',
				text:key
			}));
		
			canvas.addChild(textYleft[nn]);	
		
			lineheng.push(lineIni.clone({//绘制横坐标平行的标记线
				start:{x:drawleftpadding,y:leftPerHeight*j},
				end:{x:drawWidth,y:leftPerHeight*j},
				stroke: "1px #3e3d3d"
			}));
			canvas.addChild(lineheng[nn]);		
			
			j++;
			nn++;
		}
	}	
		

	
	for(var m = 0;m<=xNum;m++)
	{
		textX.push(textIni.clone({
			x:drawleftpadding+titleWidth*m+10,
			y:length*drawHeight/yNum+20,
			origin: { x: "right", y: "bottom" },
			rotation: -40,
			text:FormatNUM((bottomXMax/xNum)*m+"")
		}));
		canvas.addChild(textX[m]);
		
		lineshu.push(lineIni.clone({//绘制横坐标平行的标记线
			start:{x:drawleftpadding+titleWidth*m,y:length*drawHeight/yNum},
			end:{x:drawleftpadding+titleWidth*m,y:0},
			stroke: "1px #1f1f1f"
		}));
			canvas.addChild(lineshu[m]);
	}	
}

//逆序hash
function reverseList(obj){
	var i =0;
	var ary = [];
	var ary1 = [];
	var newObj = {};
	for(var x in obj){
		ary.push(x);
		ary1.push(obj[x]);
		i++;
	}
	
	for(var j=ary.length-1;j>=0;j--){
		var key = ary[j];
		var value  = ary1[j];
		newObj[key] = value;
	}
	return newObj;
}


function drawImpactMin(data,ary){
	var str = "<ul>";
	var voiceToActivtion = data["voiceToActivtion"]["number"];
	var youtubeToGoogle = data["youtubeToGoogle"]["number"];
	for(var i =0;i<ary.length;i++){
		var value;
		if(i<4){
		if(voiceToActivtion[ary[i]]){
			value = voiceToActivtion[ary[i]][0];
		}else{
			value = youtubeToGoogle[ary[i]][0];
		}
		str += "<li><span>"+ary[i]+":</span><span class='contentspan'>"+FormatNUM(value+"")+"</span></li>";
		}
	}
	str += "</ul>";
	$("#ImpactMin").html(str);
}
