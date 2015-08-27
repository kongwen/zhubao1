/**
 * Created by LY on 13-12-26.
 */
 
 
var settingUrl = '/js/framework/data/setting.json';
var settingIndex = 1;//默认为读取本地数据
var UserName = window.localStorage.getItem("UserName");
if(UserName != "Dashboard"){
	settingUrl = '/js/framework/data/setting.json';
	settingIndex = 0;//读取服务器端数据
}

var canvaslist = [];
    var navigate={
        init:function(){
            /**
             * 初始化
             * */

            var $this = this;
            this.loadSetting(function(settings){
                $this.settings = JSON.parse(settings);
                $this.create();
            });
        },
        create:function(){
            /**
             * 创建tag结构
             * */
            this.obj.empty();
            this.currPageId = 'index';//默认当前页Id 为 "index";
            var navObj = $("<ul></ul>").appendTo(this.obj),
                optStr = "",datas = this.settings,index = 0;
            for(var pageId in datas){
                index++;
                datas[pageId].index =index;//在settings对象上添加参数 index
                datas[pageId].pageId =pageId;//在settings对象上添加参数 pageId
                optStr +=this.optionStr(datas[pageId]);
            }
            optStr +="<li id='endDate'>2014-06-12</li>";
            navObj.html(optStr);
            navObj = null;
            this.event();
            this.style();
        },
        loadSetting:function(callback){
            /**
             * 加载setting.js数据
             * */
            if($("#setingData") && $("#setingData").length>0){
                $("#setingData").empty();
            }
            $("<div id='setingData' style='display: none;height:0;width:0;overflow: hidden;'></div>").prependTo("body");
            var localS = window.localStorage,data_ = localS.getItem("settings");

            if(!data_ || data_ =='undefined'){


               $("#setingData").load(".."+settingUrl,function(data){
                   localS.setItem("settings",data);
                   callback && callback(data);//加载成功后加载页面
               });
            }else{
                callback && callback(data_);//加载成功后加载页面
            }
        },
        optionStr:function(json){
            /**
             * 菜单项tag
             * */
            var optStr = "<li class='touchN_ "+(json.index==0 ?"curr_":"") +"' id_="+json.pageId+"  id='P"+json.pageId+"'>" +
                "<a hrefs='"+json.pageUrl+"' target='main-in'>" +
                "<div class='icon "+json.pageId+"'></div>" +
                "<p class='tt'>"+json.name+"</p>" +
                "</a></li>";
            return this.getlocalStorage()[json.pageId] ?this.getlocalStorage()[json.pageId].state>0?optStr:"":"";
        },
        event:function(){
            /**
             * 绑定事件
             * */
            var $this = this;

            this.changeState();//默认状态

            if(!this.fromSettingPageId){
					this.loadPage("index.html");//默认加载页;
            }else{
                $("#loading").hide();//加载结束
                $("#loading .loadings").hide();//加载结束
            }

            $('.touchN_').tap(function(){
                //标注点击状态
                var repeatClc = $(this).attr("clcState_")
                $(this).attr("clcState_",1)
                $(this).siblings(".touchN_").removeAttr("clcState_");

                //if(!repeatClc){
                    $this.currPageId = $(this).attr('id_');
                    $this.fromSettingPageId = "";//清除setting传过来的PageId;
                    $this.changeState();
                    var url = $(this).find(">a").attr("hrefs")+"?subId=0";
                    var ottargs= $(this).attr('urlarg')||"";
                    window.PageArgs.ottArg=ottargs;//全局页面传参
                    $this.loadPage(url);
               // }
				return false;
            });

        },
        loadPage:function(url){
            /**
             * 加载页面
             * */
			
            url.match(/(\w+)\.html/ig);
            var pageId = RegExp.$1;

            window.PageArgs = $.extend(window.PageArgs,{pageId:pageId,subId:0,url:url})//全局页面传参

            window.localStorage.setItem('nextPreState',"");//二级菜单左右跳页状态
			
			
            if(window.oCanvas.canvasList){
				
				if(window.oCanvas.canvasList){
					
					for(var i=0;i<window.oCanvas.canvasList.length;i++){
					
						if(window.oCanvas.canvasList[i] && window.oCanvas.canvasList[i].destroy.constructor==Function){
						
							try{
								window.oCanvas.canvasList[i].destroy();
							}catch (e){

							} 
						}
						
					}
					
				}
				

                window.oCanvas.canvasList = [];
            }
		
            window.oCanvas = null;
			
            oCanvasFN(window,document);
		
            $("#loading").show();//加载开始
				$('#main-in').load(url,function(){
					$("#loading").hide();//加载结束
					$('#main-in').show();
					$("#map-canvas").hide();
					$('#main-in').attr("isLoad") =='0';
				});
			

        },
        changeState:function(){
            /**
             * 菜单状态处理
             * */
            if(this.fromSettingPageId){
                this.currPageId = this.fromSettingPageId;
            };
            //back记录
            backs.set({pageId:this.currPageId});//记录返回

            var currObj = $("[id_="+this.currPageId+"]");
            currObj = currObj.size()==0?$("[id_=index]"):currObj;
            if(this.currPageId =='index'){
                $("#endDate").show();
            }else{
                $("#endDate").hide();
            }

            var dd = $('.icon',currObj).attr('class').match(/\s(\w+)/);
            var currClass= RegExp.$1;
            //清除hover状态
            $('.icon[class *=hover]',currObj.parent()).each(function(i){
                var hover = $(this).attr('class').match(/\s\w+_hover/ig);
                if(hover.length>0){$(this).removeClass(hover[0]);}
            });

            currObj.siblings().removeClass('curr_');

            $('.'+currClass).addClass(currClass+'_hover');

            currObj.addClass('curr_');//标记状态
            $('p',$(currObj).parent()).removeClass('tt_hover');
            $('p',currObj).addClass('tt_hover');
            currObj = null;currClass=null;
        },
        getCurrPageId:function(){
            var href = $('#main-in').attr('src'),navIdStr = href.match(/(\w+)\.html/ig);
            href=null;navIdStr=null;
            return RegExp.$1;
        },
        style:function(){
            $("#main-in").height(window.screen.height-250);
        },
        getlocalStorage:function(){
            return eval("("+window.localStorage.getItem('settings')+")");
        }
    };
    $.navigate = function(json){
        var json = json || {};
        navigate.obj = top.$('.nav');
        navigate.fromSettingPageId= json.pageId;
        navigate.init();
        json = null;
		setRightTime();
        return navigate;
    }

    $.ajaxSetup({
        global: false,
        type: "POST"
    });

$(function(){
    /**主页遮罩*/
    var ifr = $('iframe');
    if($('#cover')[0]){
        $('#cover')[0].style.cssText = "position:absolute;top:0;left:0; background:#000;width:"+(ifr.width()/10)+"em;height:"+(ifr.height()/10)+"em; z-index:1000;";
    }
})

/**
 * 公共函数
 * */
function getUrl(pageId){
    /*获得url*/
    var ldatas = window.localStorage.getItem("settings"),url;
    if(ldatas){
         url = JSON.parse(ldatas)[pageId].serverUrl[settingIndex] || "";
    }
	return url;
}




function getSettingObj(pageId){
    /*获得setting 对象*/
    var ldatas = window.localStorage.getItem("settings"),obj;
    if(ldatas){
        obj = JSON.parse(ldatas)[pageId];
        obj = obj || JSON.parse(ldatas);
    }
    return obj;
}

/**
 * 读取后台服务器数据规则控制
 * */
var controlRule = {
    add:function(json){
        if(json){
            var pre = json.yesterday && json.yesterday.match(/\d+/ig);
            var curr = this.get().time && this.get().time.match(/\d+/ig);
            
            if(pre && curr){
                var diffTime = (new Date(curr[2],curr[1],curr[0])).getTime()-(new Date(pre[2],pre[1],pre[0])).getTime(),limit = 24*60*60*1000;
               
                if((diffTime>=limit || !this.settings) && json.isReadMark){
                    this.set({rule:1,time:json.yesterday});
                }else{
                    this.set({rule:0,time:json.yesterday});
                }

            }else{
                this.set({rule:1,time:pre});
            }

        }else{
            this.set({rule:1,time:""});
        }
        
    },
    get:function(){
        return {
            rule:window.localStorage.getItem("controlRule"),
            time:window.localStorage.getItem("serverTime")
        }
    },
    set:function(json){
        window.localStorage.setItem("controlRule",json.rule);
        window.localStorage.setItem("serverTime",json.time);
    },
    settings:window.localStorage.getItem("settings")
};