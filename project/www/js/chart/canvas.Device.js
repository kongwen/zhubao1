/**
 * @author zhouyuan
 * @version 1.0
 * @describe pie chart Based on oCanvas graphic
 */
 
var options = {drawWidth:50,drawHeight:100,radius:34,hoverRadius:30,borderWidth:15,xinX:150,xinY:150,fontSize:12,drawleftpadding:70};
var color =['#4cb035','#4078de','#ffae0d','#f7d206'];
 
 function drawDevice(options,id,data){
     if($("#"+id)&&$("#"+id).length>0){
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
             origin: { x: "left", y: "top"},
             font: "normal 12px GOTHIC",
             fill: "#b9b9b9"
         });

         var lineIni2 = canvas.display.line({
             stroke: "2px #747778",
             cap: "round"
         });
         var arcIni = canvas.display.arc({
             x: options.xinX,
             y: options.xinY,
             stroke: "2px #161616",
             radius: options.radius
         });

         var ini = function(data){
             DrawMin(data);
             var dataList = data["feature"];
			 if(dataList){
				setTimeout(function(){
					drawDeviceLeft(options,dataList,canvas,lineIni,lineIni2,textIni,arcIni);
				},200);
			 }
			
			getDataConfig(settingUrl, function (data2) {
				var impact = data2["devices"]["child"][0]["child"];
				for(var i =0;i<impact.length;i++){
					var state = impact[i]["state"];
					var name = impact[i]["name"];
					if(name == "Most Complaints" && state == "1"){
						 var com = data["complaints"];
						 if(com){
							setTimeout(function(){
								drawComPlaint(com,"#Complaints");
							},200);
						 }
						$(".deviceList").eq(0).show();
					}else  if(name == "Most Popular" && state == "1"){
						 var pop = data["populars"];
						 if(pop){
							setTimeout(function(){
								drawItemOther(pop,"#poplur");
							},200);
						 }
						 $(".deviceList").eq(1).show();
					}else  if(name == "Fastest Growing" && state == "1"){
						 var grow = data["growing"];
						 if(grow){
							
							setTimeout(function(){
								drawItemGrow(grow,"#Fastest");
							},200);
						}
						$(".deviceList").eq(2).show();
					}else  if(name == "LTE" && state == "1"){
						var lte = data["lte"];
						if(lte){
							
							setTimeout(function(){
								drawItemOther(lte,"#LTE");
							},200);
						}
						$(".deviceList").eq(3).show();
					}
				}
			},"settings");
					
            
			 bindNote();
             setTitleOneDate();
         }
         ini(data);
     };
 }
 
 
 function bindNote(){
	$(".deviceList dt").tap(function(){
		if($(this).find(".canvasNote2").size()==0){
			$("<b class='canvasNote2' ></b>").appendTo($(this));
		}
		var note = $(this).attr("title");
		$(".canvasNote2").hide();
		$(".canvasNote2",$(this)).show().text(note).css("left",0).css("top",0);
		setTimeout(function(){$(".canvasNote2").hide()},3000);
	});
 }
 
 var noteList = {"Smartphone":"Smart Phone","FeaturePhone":"Feature Phone","Datacard":"Data Card","Others":"Others"};
 function drawDeviceLeft(options,data,canvas,lineIni,lineIni2,textIni,arcIni){

	var data = makeSort(data);
	var pieces = [], end, lastEnd,lines=[],lines2=[],texts=[],textsNum=[],perTexts=[],textsPercent=[],textNum=[];
    //新增
    var abs_cxy = {}, wordX;
	var textPercent = canvas.display.text({
		origin: { x: "center", y: "top" },
		font: "normal 16px sans-serif",
		fill: "#FFFFFF"
	});
	
	var lastCenter;
	var lastrate = 0,lastcenterY=0,lastlastrate=0,lastlastlastrate=0;
	var centerYE = 0;
	for (var i = 0; i < data.length; i++) {

		var rate =  data[i].rate.replace("%","");
		end = (i > 0 ? lastEnd : 0) + 360 / (100 / rate) - (i < 1 ? 90 : 0);
		var start = (i < 1 ? -88 : lastEnd+2);
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
	
		var centerXEnd = coss*(options.radius+options.borderWidth/2+15)+options.xinX;
		var centerYEnd = sins*(options.radius+options.borderWidth/2+15)+options.xinY;
		
		if(noteList[data[i].name] == 'Data Card'){
			noteList[data[i].name] = 'Datacard'
		}
		
		var textFont = noteList[data[i].name]||data[i].name;
		//画饼图上的百分数
		perTexts.push(textPercent.clone({
			x:textX,
			y:textY,
			text:data[i].rate
		}));

		if(centerPoint>90 && centerPoint<=270){
            var centerYAddNum = 25,endCenterY = 0;
            if(centerY < arcIni.y){
                centerYAddNum = -centerYAddNum;
            }
            endCenterY = centerY + centerYAddNum;
            lines.push(lineIni.clone({
				start:{x:centerX,y:centerY},
				end:{x:centerX-10,y:endCenterY},
				stroke: "1px #a6a6a6"
			}));

            lines2.push(lineIni2.clone({
                start:{x:centerX-10,y:endCenterY},
                end:{x:centerX-30,y:endCenterY},
                stroke: "1px #a6a6a6"
            }));

			var texe = textFont;
			var size = texe.length*10;
			texts.push(textIni.clone({
				x:centerX-70,
				y:endCenterY+5,
				text:texe,
				font: "normal "+options.fontSize+"px GOTHIC",
				origin: { x: "left", y: "bottom" }
			}));
			//修改
			textsPercent.push(textIni.clone({
				x:centerX-102,
				y:endCenterY+5,
				text:rate+"%  ",
				font: "normal 14px GOTHIC",
				fill:"#5cb71a",
				origin: { x: "left", y: "bottom" }
			}));
			textsNum.push(textIni.clone({
				x:centerX-75,
				y:endCenterY+20,
				text:FormatNUM(data[i].totalNumber+""),
				font: "normal 10px GOTHIC",
				origin: { x: "left", y: "bottom" }
			}));
		}else{
            var originLR = "left",textsX = 30,textsNumX = 30,wordXRight = 0;
            abs_cxy = reArrHig(arcIni,rate,centerX,centerY,10,25);
            wordX = abs_cxy.x+abs_cxy.lx;
		//修改：	
            lines.push(lineIni.clone({
				start:{x:centerX,y:centerY},
				end:{x:abs_cxy.x,y:abs_cxy.y},
				stroke: "1px #a6a6a6"
			}));
            lines2.push(lineIni2.clone({
                start:{x:abs_cxy.x,y:abs_cxy.y},
                end:{x:abs_cxy.x+abs_cxy.lx,y:abs_cxy.y},
                stroke: "1px #a6a6a6"
            }));
            if(abs_cxy.lx < 0){
                originLR = "right";
                textsX = -textsX;
                textsNumX = -textsNumX;
                wordXRight = 10;
            }
			textsPercent.push(textIni.clone({
				x:wordX+wordXRight,
				y:abs_cxy.y+5,
				text:rate+"%  ",
				font: "normal 14px GOTHIC",
				fill:"#5cb71a",
				origin: { x: originLR, y: "bottom" }
			}));

			texts.push(textIni.clone({
				x:wordX+textsX,
				y:abs_cxy.y+3,
				text:textFont,
				font: "normal "+options.fontSize+"px GOTHIC",
				origin: { x: originLR, y: "bottom" }
			}));
			
			textsNum.push(textIni.clone({
				x:wordX+textsNumX,
				y:abs_cxy.y+13,
				text:FormatNUM(data[i].totalNumber+""),
				font: "normal 10px GOTHIC",
				origin: { x: originLR, y: "bottom" }
			}));
		}
		
		
		canvas.addChild(pieces[i]);
		canvas.addChild(texts[i]);
		canvas.addChild(textsNum[i]);
		canvas.addChild(textsPercent[i]);
		
		
		
		lastEnd = end;
		lastlastlastrate = lastlastrate;
		lastlastrate = lastrate;
		lastrate = rate;

		pieces[i]._start = pieces[i].start;
		pieces[i]._end = pieces[i].end;

		pieces[i]._index = i;
	
	
		pieces[i].bind("mouseenter touchenter", function () {
			this.stroke = this.stroke.replace(/^[0-9]+/,options.borderWidth+5);
			canvas.redraw();
		}).bind("mouseleave touchleave", function () {
			this.stroke = this.stroke.replace(/^[0-9]+/,options.borderWidth);
			canvas.redraw();
		});
		
		lastCenter = centerPoint;
}
		for(var i =0;i<pieces.length;i++){
			canvas.addChild(lines[i]);
            canvas.addChild(lines2[i]);
		}
}


function drawComPlaint(data,id){
	var str = "";
	for(var i = 0;i<data.length;i++){
		var title = data[i].name;
		var rate = data[i].rate;
		var rates = rate.split(":");

		rates[0] = FormatNUM(rates[0]);
		rates[1] = FormatNUM(rates[1]);
		var num = i+1;
		str += "<dl><dt title='"+title+"'><span>"+num+"</span><div>"+title+"</div></dt>";
		str += "<dd>Complaint Ratio:<b>"+rates[0]+":"+rates[1]+"</b></dd></dl>";
	}
	$(id).html(str);
}

//当有数值一样时重排
var arrHig=[];
var reArrHig = function(arcIni,rate,centerX,centerY,abs_x,abs_y){
    var _arrHig = {};
    _arrHig.x = centerX+abs_x ;
    _arrHig.y = centerY-abs_y;
    if((_arrHig.y+abs_y) > arcIni.y){
        _arrHig.y = centerY+abs_y;
    }
    _arrHig.lx = 20;
    if(rate < 15 && arrHig.length==0){
        _arrHig.x = centerX-abs_x ;
        _arrHig.lx = -_arrHig.lx;
    }
    for(var i = 0;i<arrHig.length;i++){
        if(i > 0 && Math.abs(_arrHig.y - arrHig[i].y ) <20 ) {
            _arrHig.y +=(abs_y-3);
            _arrHig.x +=5;
            _arrHig.lx =  1.2*_arrHig.lx;
        }
    }
    arrHig.push(_arrHig);
    return {
        x:_arrHig.x,
        y:_arrHig.y,
        lx:_arrHig.lx
    };
};

function makeSort(obj){//排序，按照1、3、2、4的顺序排序
	var temp;
	for(var i= 0;i<obj.length;i++){
		for(var j = 0;j<obj.length-i-1;j++){
			
			if(parseFloat(obj[j]["rate"].replace("%",""))>parseFloat(obj[j+1]["rate"].replace("%",""))){
				temp = obj[j];
				obj[j] = obj[j+1];
				obj[j+1] = temp;
			}
		}
	}
	return obj;
}

function drawItemGrow(data,id){
	var str = "";
	for(var i = 0;i<data.length;i++){
		var title = data[i]["deviceData"].name;
		var growRate = data[i]["growData"].rate;
		var growTotal =  FormatNUM(data[i]["growData"].totalNumber+"");
		
		var deviceRate = data[i]["deviceData"].rate;
		var deviceTotal =  FormatNUM(data[i]["deviceData"].totalNumber+"");
		var num = i+1;
		str += "<dl><dt  title='"+title+"' ><span>"+num+"</span><div>"+title+"</div></dt>";

		str += "<dd style='height:2em;line-height:2em;'>Growth Rate:<b style='margin-left:3px;'>"+growRate+" </b><i style='inline-block;float:right;font-style:normal;width:130px;text-align:left;color:#fff;'>Unit Growth:<b style='display:inline;'>"+growTotal+"</b></i></dd>";
		str += "<dd class='min' ><i>No.of Device:</i><b style='float:left;'>&nbsp;"+deviceTotal+"</b><span style='display:inline-block;float:right;margin-right:60px;'><b>"+deviceRate+"</b>&nbsp;&nbsp;&nbsp;&nbsp;of total</span></dd>";

		str += "</dl>";
	}
	$(id).html(str);
}





function drawItemOther(data,id){
	var str = "";
	for(var i = 0;i<data.length;i++){
		var title = data[i].name;
		var rate = data[i].rate;
		var total = FormatNUM(data[i].totalNumber+"");
		var num = i+1;
		str += "<dl><dt  title='"+title+"' ><span>"+num+"</span><div>"+title+"</div></dt>";
		str += "<dd>No.of Devices:<b>"+total+"</b><i style='display:inline-block;float:right;font-style:normal;'><span class='black' ><b>"+rate+"&nbsp;&nbsp;&nbsp;</b></span><span class='black' >of total</i></div></dd></dl>";

	}
	$(id).html(str);
}

function DrawMin(data){
    var sets = JSON.parse(window.localStorage.getItem('settings')),
    ds = sets['devices'].child[0].child,dsObj={};
    for(var i=0;i<ds.length;i++){
        dsObj[ds[i].id] =ds[i];
    }
	var str = "";
	var ary = {}
	if(data["complaints"][0]){
		ary["mostComplaint"] ={name:"Most Complaints",val:data["complaints"][0].name||""};
	}
	
	if(data["populars"][0]){
		ary["mostPopular"] = {name:"Most Popular",val:data["populars"][0].name ||""};
	}
	
	if(data["growing"][0]){
		ary["growingFast"] = {name:"Fastest Growing",val:data["growing"][0]["deviceData"].name ||""};
	}
	
	if(data["lte"][0]){
		ary["lte"] = {name:"LTE",val:data["lte"][0].name ||""};
	}
	
	var str="";
	for(var x in ary){
		var temp = shutStr(ary[x].val,25);
        if(dsObj[x] && dsObj[x].state){
            str += "<dl>";
            str += "<dt>"+ary[x].name+"</dt>";
            str += "<dd>"+temp+"</dd>";
            str += "</dl>";
        }
	}
	$("#DeviceMin").html(str);
}

 