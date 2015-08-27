/**
 * @author zhouyuan
 * @version 1.0
 * @describe pie chart Based on oCanvas graphic
 */
 
var map;
var makerAry = [];
var colorMAP = ["#9e1900","#f30000","#ff6600","#eeae00"];
var centerMAP;
var map;
var areaId;

var zoomChi = [0.000015,0.000015,0.000015,0.000015,
				0.00003,0.000012,0.00024,0.000485,
				0.00097,0.00194,0.004,0.008,0.016,
				0.031,0.061,0.122,0.244,0.49,0.98,1.96,4];//比例尺数组
				
function leftAreaControl(data){
  var list = data["areaList"];
  var str = "<div class='leftCon' id='leftCon'><span></span><b></b><dl id='leftList'>";
  str += "<dt>Key Areas <b class='back' id='back' ></b></dt>";
  for(var i =0;i<list.length;i++){
	var id = list[i]["areaid"];
	var name = list[i]["areaName"];
	var num = i+1;
	if(i == 0){
		str += "<dd ids='"+id+"'><span class='listIcon' >"+num+"</span><em>"+name+"</em>   <b class='active'></b></dd>";
	}else{
		str += "<dd ids='"+id+"'><span class='listIcon' >"+num+"</span><em>"+name+"</em>   <b></b></dd>";
	}
  }
  str += "</dl></div>";
  $(str).insertAfter($("#map-canvas"));
  
   
    $("#leftCon>span").tap(function() {
		$(this).hide();
		$("#leftCon>b").show();
		$("#leftList").css("margin-left","0");
	});

	$("#leftCon>b").tap(function() {
		$(this).hide();
		$("#leftCon>span").show();
		$("#leftList").css("margin-left","-160px");
	});
	
	$("#leftCon dd").tap(function(){
		var areaid = $(this).attr("ids");
		areaId = areaid;
		initialize(areaid,"2G",data);
		$("#leftCon dd b").removeClass('active');
		$(".tabCon").removeClass("tabConActive");
		$(".tabCon:eq(0)").addClass("tabConActive");
		$(this).find("b").addClass('active');
	});
	
	$("<div id='rightNOteTop'><div class='tabCon tabConActive'><b>2G</b></div><div class='tabCon'><b>3G</b></div><div class='tabCon'><b>LTE</b></div></div>").insertAfter($("#map-canvas"));
	$("#rightNOteTop>div").tap(function(){
		for(var i =0;i<makerAry.length;i++){
			makerAry[i].setMap(null); 
			makerAry[i] = null;
			delete makerAry[i];
		}
		$("#rightNOteTop>div").removeClass("tabConActive");
		$(this).addClass("tabConActive");
		var type = $(this).find(">b").text();
		makePositions(areaId,type,data,map);
		map.panTo(centerMAP);
		updateNoteList(type,data);
	});
	
	$("<div id='rightNOte' class='mapNote' ><dl><dt>Impacted Users & VIP:</dt></dl></div>").insertAfter($("#map-canvas"));
}





//设置地图缩放范围
function setMapResolution(){
      //获取所有地图类型
      var mapTypes = map.getMapTypes();
      //对所有地图类型限制缩放级别
      for(var i=0; i<mapTypes.length; i++)
      {
          mapTypes[i].getMinimumResolution = function() { return 12; };
          mapTypes[i].getMaximumResulution = function() { return 16; };
      }
}

//获取地图显示中心区域
function getCenter(areaid,data){
	var list = data['areaListDetail'];
	for(var i = 0;i<list.length;i++){
		var id = list[i]["areaid"];
		if(id == areaid){
			var centerX = list[i]["longitude"];
			var centerY = list[i]["latitude"];
			centerMAP = new google.maps.LatLng(centerY,centerX);
			return centerMAP;
		}
	}
}


//获取第一个区域的id
function getFirstArea(data){
	var list = data['areaListDetail'];
    if(!list || (list && list.length==0)){return;}
	var firstAreaId = list[0]["areaid"];
	return firstAreaId;
}


//跟新注释信息
function updateNoteList(type,data){
	var list = data['thresholds'][type];
	var str = "<dl>";
		str += "<dt>Impacted Users & VIP:</dt>";
	for(var i = 0;i<list.length;i++){
		var num = i+1;
		var value = list[i];
		 str += "<dd><span class='icon"+num+"' ></span>"+value+"</dd>";
	}
	str += "</dl>";
	$("#rightNOte>dl").html(str);
}

//获取扇形的路径
function getShan(radius,angle){
	var str = 'M';
	str += " 0,0 ";
	var ary = [];
    radius = radius/2;
	for(var x =0;x<=radius;x++){
		if(x%8==0 || x==radius){
			var y = Math.pow(radius*radius-x*x,1/2)//勾股定理开根号
			ary.push("-"+x+","+"-"+y+"   ");
		}
	}
	str += ary.join("");
	str += " 0,0 ";
	str += "z";
	return str;
}


//添加标记
function makePositions(areaid,type,data,maps){
	var list = data['areaListDetail'];
	
	for (i in makerAry){
		makerAry[i].setMap(null);
		makerAry[i] = null;
		delete makerAry[i];
	}
	makerAry.length = 0;
	var zoom = map.getZoom();
	var scale = zoomChi[zoom];
	for(var i = 0;i<list.length;i++){
		var id = list[i]["areaid"];
		if(id == areaid){
			var cellList = list[i]["cellList"][type];
			if(cellList){
			var locationArray = [];
			var locationNameArray = [];
			var rotation = [];
			var level = [];
			var radius = [];
			var angle = [];
			for(var j =0;j<cellList.length;j++){
				var x = cellList[j]["longitude"];//经度
				var y = cellList[j]["latitude"];//纬度
				var name = cellList[j]["cellName"];
				var ro = cellList[j]["DirectionAngle"];
				var range = cellList[j]["range"];
				var radiuss = cellList[j]["radius"];
				var angles = cellList[j]["angle"];
				locationArray.push(new google.maps.LatLng(y,x));
				locationNameArray.push(name);
				rotation.push(ro);//偏转角度
				level.push(range);
				radius.push(radiuss);
				angle.push(angles);
			}
			
			var goldDot = {
					path: 'M 0,2  -2,0 0,-2 2,0  0,2 z',
					fillColor: "#ac412a",
					strokeColor:"#ac412a",
					fillOpacity:1,
					scale:scale,
					strokeColor: "#cf3111",
					strokeWeight:7,
					rotation:0
			};
	

			var m = 0;
			for (var coord in locationArray){
					//定义扇形
					var shanPath = getShan(radius[m],angle[m]);
					var goldShan = {
								path:shanPath,
								fillColor:colorMAP[level[m]-1],
								fillOpacity: 0.8,
								scale:scale,
								strokeColor: "gold",
								strokeWeight: 0,
								rotation:rotation[m]
					};
				
				//var image = '../css/images/mapIcon/map_color'+level[m]+'_'+rotation[m]+'.png';
				//alert(image);
				makerAry.push(new google.maps.Marker({
					position: locationArray[coord],
					map: map,
					icon: goldShan,
					scale:0.3,
					title: locationNameArray[coord]
				}));
				
				makerAry.push(new google.maps.Marker({
					position: locationArray[coord],
					map: map,
					icon: goldDot,
					title: locationNameArray[coord]
				}));
				m++;
			}
			break;
		}
		}
	}
}



function makemap(areaid,data){
	var styles = [{stylers: [{ lightness: -10 }]}];
	var mapOptions = {
		zoom:16,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		styles: styles,
		center:centerMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	map.type='2G';
	map.areaid = areaid;
	
	
	google.maps.event.addListener(map,'zoom_changed', function() {
		var zoomLevel = map.getZoom();
		var type = map.type;
		var areaid = map.areaid;
		makePositions(areaid,type,data,map);
	});
}

function initialize(areaid,type,data) {
	var makerAry = [];
	var cityCircle;
	map.type = type;
	map.areaid = areaid;
	getCenter(areaid,data);
	map.setZoom(16);
	map.panTo(centerMAP);
    makePositions(areaid,"2G",data,map);
	updateNoteList(type,data);
}

