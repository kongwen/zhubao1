/**
 * Created by LY on 13-12-26.
 */
(function () {
    var page = {
        defaults: {
            datas: [
                /*{url:'/window/users/users-1.html',Str:"<h3 class='tt'>All Users</h3><p class='num'>800</p><canvas id=\"canvasMinTotal\" width=\"180px\" height=\"70px\" ></canvas>"},
                 {url:'/window/users/users-2.html',Str:"<h3 class='tt'>Inbound</h3><p class='num'>800</p><canvas id=\"canvasMinInBound\" width=\"180px\" height=\"70px\" >"},
                 {url:'/window/users/users-2.html',Str:"<h3 class='tt'>Outbound</h3><p class='num'>800</p><canvas id=\"canvasMinTotal\" width=\"180px\" height=\"70px\" >"}*/
            ]
        },
        init: function (json) {
            var $this = this;
            $.extend(true, this, page);
            this.a = $.extend(true, {}, page.defaults, json);

            this.obj = this.a.obj;
            this.pageToal = $(".touchN_").length;
            this.localS = this.getlocalStorage();//本地数据
            this.currTotal = this.getLocalLen();
            this.a.datas= this.convertData();
            this.loadState = 0;//加载页面状态，加载完成后驱动翻页事件

            if(this.a.datas && this.a.datas.length<=1){
                /*默认没数据可直接驱动事件翻页*/
                this.loadState = 1;
            }

            /*当前页获取参数*/
            var pageId = PageArgs.pageId,
                subId = PageArgs.subId;
            //根据 backs记录和 nextPreState 确定 当前 currNum值;优先级 backs>nextPreState;
            this.currNum = subId !=''?subId:this.getNextPreState()=='pre'?(this.a.datas.length-1):0;
            /*加载改变状态*/
            if(pageId && pageId !='setting'){
                this.changePageState(pageId);
            }

            if (this.a.datas && this.a.datas.length > 0) {
                this.create();
            }

            this.pageInfo = {pageId:pageId};

            this.event();
            pageId=null;
        },
        create: function () {
            this.obj.empty();
            this.width_ = Math.floor(91 / this.a.datas.length) + "em";

            this.divWap = $("<div class='bt pre' dir_='pre'><div class='btn'></div></div>").appendTo(this.obj),
                this.optWap = $("<div class='options'></div>").appendTo(this.obj),
                this.divWap = $("<div class='bt next' dir_='next'><div class='btn'></div></div>").appendTo(this.obj)
                this.optStr = "";

            this.obj.addClass('selectMore');

            if(this.a.datas.length>=0){
                for(var i= 0,datas = this.a.datas;i<datas.length;i++){
                    datas[i].index = i;
                    this.optStr += this.optionStr(datas[i]);
                }
            }

            this.optWap.html(this.optStr);
			$(".loading").show();
        },
        convertData:function(){
            var newData = [];

            if(this.localS && this.localS.child.length>=0){
                for(var i= 0,datas = this.localS.child;i<datas.length;i++){
                    datas[i].index = i;

                    if(datas[i].state>0){
                        var trueData = this.getTrueData(datas[i].id);
                        newData.push(trueData);
                    }
                }
            }

            return newData;
        },
        getTrueData:function(key){
        /**传入获取真实数据*/
            var reVal = "";
            for (var i = 0, datas = this.a.datas; i < datas.length; i++) {
                if(datas[i].name == key){
                    reVal = datas[i];
                    break;
                }
            }
            return reVal;
        },
        getLocalLen:function(){
         /**获取本地真实数据*/
            var len = 0;
            if(this.localS && this.localS.child.length>0){
                for(var i= 0,datas=this.localS.child;i<datas.length;i++){
                    if(datas[i].state>0){len++;}
                }
            }
            len--;
            return len<0?0:len;
        },
        optionStr: function (json) {
            var optStr = "";
            if (json.index >= 4) {
                optStr += "<div class='opt' style='display:none;' ><a>" + json.Str + "</a></div>";

            } else {
                optStr += "<div class='opt'  style='display:block;'><a>" + json.Str + "</a></div>";
            }
            return optStr;
        },
        event: function () {
            var $this = this;

            this.changeState($('.opt'));//改变状态

            if (this.a.datas && this.a.datas.length > 0 &&this.currNum>=0) {

                $this.route({currNum:$this.currNum});

                $('.bt', this.obj).off().on('tap',function () {
                    if($this.loadState){//加载状态判断
                        var dir = $(this).attr('dir_');
                        switch (dir) {
                            case "pre" :
                                $this.currNum--;

                                $this.route({currNum:$this.currNum});
                                break;
                            case 'next' :
                                $this.currNum++;

                                $this.route({currNum:$this.currNum});
                                break;
                        }
                    }
                    return false;
                });
                //二级菜单选项点击事件
                $('.opt', this.obj).off('tap').on('tap',function (){
                    //标注点击状态，判断是否重复点击
                    var repeatClc = $(this).attr("clcState_")
                    $(this).attr("clcState_",1)
                    $(this).siblings(".opt").removeAttr("clcState_");

                    if($this.loadState && !repeatClc){//加载状态判断
                        $this.currNum = $(this).index();
                        $this.route({currNum:$this.currNum});
                    }
                    return false;
                });
            }

            var subObj = this.a.datas[this.currNum];

            //如果加载地图页则取消滑动
            subObj && subObj.name=='map' && $(".content").off();
            var isSwipe = (subObj && subObj.name=='map')?0:1;

            if(isSwipe){
                // Navigate to the next page on swipeleft
                $('.content').off("swipeleft").on("swipeleft", function (e) {
                    swipeleft();
                    return false;
                });

                // The same for the navigating to the previous page
                $('.content').off("swiperight").on("swiperight", function (event) {
                    swiperight();
                    return false;
                });

            }


            $('.selectMore').off("swipeleft").on("swipeleft", function (event) {
                swipeleft();
                return false;
            })

            $('.selectMore').off("swiperight").on("swiperight", function (event) {
                swiperight();
                return false;
            })

            function swiperight(){
                if($this.loadState){

                    var num = --$this.currNum;

                    if ($this.a.datas && $this.a.datas.length > 0 && $this.currNum>=0) {

                        $this.route({currNum:num})

                    } else {
                        var preId = $("[id_=" + $this.getCurrPageId() + "]").prev().attr('id_');
                        preId = preId ||$('.touchN_').last().attr('id_');

                        if(preId){
                            $this.setNextPreState('pre');//设置翻页状态
                            $this.target(preId);
                        }
                    }
                }
            }

            function swipeleft(){
                if($this.loadState){
                    var nextId = $("[id_=" + $this.getCurrPageId() + "]").next().attr('id_');//下页Id
                    var num = ++$this.currNum;

                    if ($this.a.datas && $this.a.datas.length > 0 && $this.currNum< $this.a.datas.length) {

                        $this.route({currNum:num});
                    } else {
                        var nextId = $("[id_=" + $this.getCurrPageId() + "]").next().attr('id_');
                        nextId = nextId||$('.touchN_').first().attr('id_');

                        $this.setNextPreState('next');//设置翻页状态
                        $this.target(nextId);
                    }
                }
            }

        },
        route: function (json) {//currNum
            var $this = this;
            this.currNum = json.currNum;//重新赋值

            this.currOpt = $('.opt', this.obj).eq(this.currNum);
            this.changeState(this.currOpt);//改变状态

            //记录回退 在subid 正常范围内添加回退记录
            if( this.currNum >=0 && this.currNum <= this.currTotal){
                $this.pageInfo.subId = this.currNum;
                backs.set($this.pageInfo);
            }

            if (this.currNum > this.currTotal) {
                this.currNum = this.currTotal;
                var nextId = $("[id_=" + this.getCurrPageId() + "]").next().attr('id_');
                $this.setNextPreState('next');//设置翻页状态
                $this.target(nextId);
            }

            if (this.currNum < 0) {
                this.currNum = 0;
                var preId = $("[id_=" + this.getCurrPageId() + "]").prev().attr('id_');
                $this.setNextPreState('pre');//设置翻页状态
                $this.target(preId);
            }

            /*在当前子菜单页数之内*/
            if (this.currNum >= 0 && this.currNum <= this.currTotal) {

                this.changeState(this.currOpt);//改变状态

                this.currOpt = $('.opt', this.obj).eq(this.currNum);

                //移动显示中间部分
                $('.opt', this.obj).hide();

                var start = (this.currNum<=3)?0:(this.currNum - 3);
                var end = (this.currNum<=3?3:this.currNum);

                for(var i=start;i<=end;i++){
                    $('.opt', this.obj).eq(i).show();
                }

                var subObj = this.a.datas[this.currNum];
                var urlStr = subObj.url;


                //如果加载地图页则取消滑动
                subObj.name=='map' && $(".content").off();

                if (urlStr) {
					$("#map-canvas").hide().css("z-index",998).height(0);;
					$("#leftCon").hide().css("z-index",999);
					$("#rightNOteTop").hide().css("z-index",999);
					$("#rightNOte").hide().css("z-index",999);
                    $(".chart").empty();//清除
                    $("#loading").show();//加载开始
                    $this.loadState=0;

                    $(".chart").show().load(urlStr, function () {
                        $this.loadState=1;
                        $("#loading").hide();//加载结束
						$(".chart").show();
                    });
                }
            }
        },
        changeState: function (currOpt) {
            currOpt.siblings().removeClass('opt_selected');
            currOpt.addClass('opt_selected');
        },
        getCurrPageId: function () {
            return $('.curr_').attr('id_');
        },
        changePageState:function(pageId){
            if(pageId =='index'){
                $("#endDate").show();
            }else{
                $("#endDate").hide();
            }

            var currObj = $("[id_="+pageId+"]");

            $('.icon',currObj).attr('class').match(/\s(\w+)/);
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
        target: function (pageId) {
            $(".touchN_").removeAttr("clcState_");//清除一级菜单重复点击状态
            var url = 'index.html', sets = JSON.parse(window.localStorage.getItem('settings'));
            if(pageId && sets && sets[pageId]){
                url = sets[pageId].pageUrl;
            }
            this.changePageState(pageId);
            window.PageArgs = {pageId:pageId,subId:0,url:url};//全局页面传参

            if(this.getNextPreState()!='pre'){
                backs.set({pageId:pageId,subId:0});//记录返回
            }

            if(window.oCanvas.canvasList){
                for(var i=0;i<window.oCanvas.canvasList.length;i++){
                  
						try{
								window.oCanvas.canvasList[i].destroy();
							}catch (e){

							} 
                }
                window.oCanvas.canvasList = [];
            }
            window.oCanvas = null;
            oCanvasFN(window,document);

            $('#main-in').empty();//清除对象
            $("#loading").show();//加载开始
            $('#main-in').load(url,function(){
				$("#loading").hide();//加载开始
            });
        },
        getNextPreState:function(){
            return  window.localStorage.getItem('nextPreState');
        },
        setNextPreState:function(state){//next,pre;
          /*设置上一页下一页状态*/
          window.localStorage.setItem('nextPreState',state);
        },
        getlocalStorage:function(){
            var currLocalData = eval("("+window.localStorage.getItem('settings')+")");
            return currLocalData[PageArgs.pageId];
        }
    };
    $.page = null;
    $.page = function (json) {
        var json = json || {};
        json.obj = $(".page");
        window.Page =null;//置空对象
        window.Page=Page = new page.init(json);
        json = null;
        return Page;
    }
})()
//退出按钮
$(function(){
    /**一级菜单跳转遮罩页面加载后取消*/
    $('#cover').hide();

    /*setting 跳转遮罩修复*/
    $(".setting").off().on('tap',function(){

        $(".touchN_").removeAttr("clcState_");//清除一级菜单重复点击状态

        $('#cover').show();//换页遮罩
        $('#main-in').load("setting.html",function(){
            $("#map-canvas").hide();
            $("#leftCon").hide();
            $('#cover').hide();//换页遮罩
        });
        return false;
    });
    $('.content').fadeIn();
});

$(function(){
    /**返回按钮*/
    $('.back').click(function(){
        backs.back(); 
		return false;
    });
});
$(function(){
    $('#exitApp').click(function(){
        var htlStr='<div id="alertLayer" class="p_layer">' +
            '<div class="exitPop">' +
            '<div class="popTit">exit</div><div class="inner">' +
            '<div class="contInner">Are you sure you want to quit?</div><div class="butDiv">' +
            '<a id="exitTheWeb">Sure</a><a id="closeLayer">NO</a>' +
            '</div></div><div class="loading"></div></div></div>';
        $('body').append(htlStr);
        var $date = {
            load : $('#alertLayer .loading'),
            inner: $('#alertLayer .inner'),
            close: $('#closeLayer'),
            exit :  $('#exitTheWeb')
        };
        var errMoth = function(){
            $date.exit.hide();
            $date.close.html('Close');
            $('#alertLayer .contInner').html("Exit failure");
            $date.load.hide();
            $date.inner.show();
        };
        $date.close.click(function(){$('#alertLayer').remove();});
        $date.exit.click(function(){
            $date.load.show();
            $date.inner.hide();
            var ips = window.localStorage.getItem("serverIP");
            var serverUrl = "https://"+ips+"/ced/pad/loginOut.do?jsonpCallback=?";
            /*$.ajax({
                type: "post",
                url: serverUrl,
                async: false,
                dataType: "json",
                success: function(data){
                    if(data.state == "success"){
                        window.localStorage.clear();
                        window.location.href="../index.html";
                    }else{
                        errMoth();
                    }
                },
                error:function(msg){
                    errMoth();
                }
            });*/
            $.getJSON(serverUrl,function(data){
                if(data.state == "success"){
                    window.localStorage.clear();
                    window.location.href="../index.html";
                }else{
                    errMoth();
                }
            });

        });
    });

});