/**
 * Created by LY on 14-1-14.
 */
(function(){
    var Setting={
        defaults:{
            datas:[]
        },
        init:function(json){
			$("#map-canvas").hide().css("z-index",998);
			$("#leftCon").hide().css("z-index",999);;
            this.a=$.extend(true,{},this.defaults,json);

            this.containorObj = this.a.containor;
            this.currPageId = this.getCurrPageId();
            this.datas = this.get();


            window.backFromSetting = 1;//backs 记录是否从setting页面过来


            this.structure();
            this.loadMenu();
        },
        getCurrPageId:function(){
            return PageArgs.pageId;
        },
        structure:function(){
            this.menuObj = $("<div class='menu'></div> ").appendTo(this.containorObj);
            this.menuUlObj  = $("<ul></ul>").appendTo(this.menuObj);
            this.setObjCon= $("<div class=\"sets\" id=\"sets\"></div>").appendTo(this.containorObj);
            this.setObj= $("<div></div>").appendTo(this.setObjCon);
            this.msgObj= $("<div class=\"msg\">Save successfully!</div>").appendTo(this.containorObj);
            this.style();
        },
        loadMenu:function(){
            var liStr = "",datas = this.datas;
            for(var i in datas){
                if(i !='index' && datas[i].name){
                    liStr +="<li setId_="+i+"><div>"+datas[i].name+"</div></li>";
                }
            };
            this.menuUlObj.html(liStr);
            liStr =null;
            this.menuEvent();
        },
        menuEvent:function(){
            var $this = this,defaultPage='users';
            if(this.datas[this.currPageId] && this.currPageId != 'index'){
                defaultPage = this.currPageId;
            }
            $this.loadCont(defaultPage);

            var Setscroll = new IScroll("#sets");//增加滚动

            $('li',this.menuObj).tap(function(){
                $this.setObj.children().remove();
                var id= $(this).attr("setId_");
                $this.loadCont(id);

                if(!Setscroll){
                    var Setscroll = new IScroll("#sets");//增加滚动
                }

            });
        },
        loadCont:function(menuId){
            this.menuId = menuId;
            this.currData = this.datas[this.menuId];
            this.currHomeData = this.datas['index'].child[this.menuId];

            /*二级选项数据*/
            this.data2 =this.currData.child;
            this.addHome();
            this.addBottom();
            this.saveBt();

            //改变状态
            $("[setId_="+menuId+"]").siblings().removeClass('curr');
            $("[setId_="+menuId+"]").addClass('curr');
        },
        addHome:function(){
            var showHome = $("<div class='showHome'></div>").appendTo(this.setObj);
            this.homeHead = $("<h3 class=\"head\">Show in Home Page <span class=\"onOff "+(this.currHomeData.state>0?"addOn":"")+"\"></span></h3>").appendTo(showHome);
            this.HulObj = $("<ul></ul>").appendTo(showHome);
            showHome = null;
            this.homeHeadEvent();//加入事件
            this.currData.isHome &&this.homeOpt();
        },
        homeOpt:function(){
            this.HulObj.children().remove();
            var liStr="";

            //获取当前首页数组;
            this.currHomeData = this.datas['index'].child[this.menuId];

            var tempHomeData = [];
            //加入首页数组
            for(var i= 0,data=this.data2;i<data.length;i++){
                if(data[i].state>0){
                   /* data[i].hstate = this.getHomeVal(data[i].id).hstate?this.getHomeVal(data[i].id).hstate:0;
                    tempHomeData.push(data[i]);//加入首页数据*/
                    if(data[i].child && data[i].child.length>0){
                        for(var j = 0,dataj=data[i].child;j<dataj.length;j++){
                            if(dataj[j].state>0){
                                dataj[j].hstate = this.getHomeVal(dataj[j].id).hstate?this.getHomeVal(dataj[j].id).hstate:0;
                                tempHomeData.push(dataj[j]);//加入首页数据
                            }
                        }
                    }
                }
            }

            //清除旧数据
            this.currHomeData.child = [];

            //清除引用
            this.currHomeData.child = tempHomeData;

            //首页数据显示
            for(var i = 0,data =this.currHomeData.child;i<data.length;i++){
                liStr +="<li class=\"cell\" id_="+i+">"+data[i].name+"<span class=\"onOff "+(data[i].hstate>0?"addOn":"")+"\"></span></li>";
            }

            this.HulObj.html(liStr);
            this.homeEvent();
        },
        getHomeVal:function(id){
            var reVal = "";
            for(var i= 0,data= this.currHomeData.child;i<data.length;i++){
                if(data[i].id == id){
                    reVal= data[i];
                    break;
                }
            }
            return reVal;
        },
        homeHeadEvent:function(){
            var $this = this;
            //顶部菜单head onOff
            $('.onOff',this.homeHead).off().on("tap",function(){

                var hasON = /addOn/ig.test($(this).attr('class'));

                if(!hasON){
                    $(this).addClass('addOn');
                    $this.currHomeData.state = 1;
                }else{
                    $(this).removeClass('addOn');
                    $this.currHomeData.state = 0;
                }
                return false;
            });
        },
        homeEvent:function(){
            var $this = this;
            //顶部菜单选项 onOff
            $('.onOff',this.HulObj).off().on("tap",function(){
                var hasON = /addOn/ig.test($(this).attr('class')),id=$(this).parent('li').attr('id_');
                var isOne = $('.addOn',$this.HulObj).length;//有多少选项显示，至少为一个显示

                if(!hasON){
                    $(this).addClass('addOn');
                    isOne++;
                    $this.currHomeData.child[id].hstate = 1;

                }else{
                    $(this).removeClass('addOn');
                    isOne--;
                    $this.currHomeData.child[id].hstate = 0;
                }

                if(isOne<=0){//限制至少一条数据
                    $(this).addClass('addOn');
                    $this.currHomeData.child[id].hstate = 1;
                }
                if(isOne>4){//限制最多4条
                    $(this).removeClass('addOn');
                    $this.currHomeData.child[id].hstate = 0;
                }

                return false;
            })
        },
        addBottom:function(){
            /**底部结构*/
            this.showBottom = $("<div class='showBottom'></div>").appendTo(this.setObj);
            this.bottomHead = $("<h3 class=\"head\">Show in Bottom Menu<span class=\"onOff "+(this.currData.state>0?"addOn":"")+"\"></span></h3>").appendTo(this.showBottom);
            this.bottomOpt2();
        },
        bottomOpt2:function(){
            /**二级选项*/

            /**二级级菜单*/
            this.BulObj3l && this.BulObj3l.empty();
            this.BulObj3r && this.BulObj3r.empty();
            this.BObj2 && this.BObj2.empty();

            this.BObj2 = $("<div class='sub2'></div>").appendTo(this.showBottom);

            this.BulObj2 = $("<ul></ul>").prependTo(this.BObj2);
            var liStr="";
            for(var i= 0,data=this.data2;i<data.length;i++){
                liStr +="<li id_="+i+" s_="+(data[i].state>0?1:0)+" style="+(data[i].show==0?"display:none":"display:block")+">" +
                    "<span class=\"down "+(i==data.length-1?'downNo':data[i].state>0?'':'downNo')+"\"></span>" +
                    "<span class=\"up "+(i==0?"upNo":data[i].state>0?'':'upNo')+"\"></span>" +
                    ""+data[i].name+"<span class=\"onOff "+(data[i].state>0?"addOn":"")+"\"></span></li>";
            }
            this.BulObj2.html(liStr);
            this.bottom2Event();
        },
        bottom2Event:function(){
            /**二级事件*/
            var $this= this;
            $(".up",this.BulObj2).off().on('tap',function(event){
                var currId  = $(this).parent('li').index(),
                isFalse = /No/ig.test($(this).attr("class"));

                //搜索上一个ID
                var pres = $("li[s_='1']",$this.BulObj2),preId=0;//下一个的索引

                for(var i = 0,datas=pres;i<datas.length;i++){
                    if(currId == $(datas[i]).attr('id_')){
                        preId = $(datas[i-1]).attr('id_');
                    }
                }//搜索上一个ID

                if(!isFalse && currId){
                    var temp = $this.data2[preId];
                    $this.data2[preId]=$this.data2[currId];
                    $this.data2[currId]=temp;

                    $this.bottomOpt2();
                    $this.bottomOpt2State(preId);
                    IsFirstOrEndState();//可选元素的第一，最后状态
                }
                currId=null;
                return false;
            });
            $(".down",this.BulObj2).off().on('tap',function(){
                var currId  = $(this).parent('li').attr('id_'),
                    total = $(this).parent('li').siblings("li").length,
                    isFalse = /No/ig.test($(this).attr("class"));
                //搜索下一个ID
                var nexts = $("li[s_='1']",$this.BulObj2),nextId=0;//下一个的索引

                for(var i = 0,datas=nexts;i<datas.length;i++){
                    if(currId == $(datas[i]).attr('id_')){
                        nextId = $(datas[i+1]).attr('id_');
                    }
                }//搜索下一个ID

                if(!isFalse && currId<total){
                    var temp = $this.data2[nextId];
                     $this.data2[nextId]=$this.data2[currId];
                     $this.data2[currId]=temp;

                    $this.bottomOpt2();
                    $this.bottomOpt2State(nextId);
                    IsFirstOrEndState();//可选元素的第一，最后状态
                }
                currId=null;total=null;
                return false;
            })
            //底部菜单选项 onOff
            $('.onOff',this.BulObj2).off().on('tap',function(){

                var hasON = /addOn/ig.test($(this).attr('class')),id=$(this).parent('li').index();
                var isOne = $('.addOn',$this.BulObj2).length;//有多少选项显示，至少为一个显示

                if(!hasON){
                    $(this).addClass('addOn');
                    isOne++;
                    $this.data2[id].state = 1;
                    $(this).siblings('.down').removeClass('downNo');
                    $(this).siblings('.up').removeClass('upNo');
                    $(this).parent('li').attr('s_',1);

                }else{
                    $(this).removeClass('addOn');
                    isOne--;
                    $this.data2[id].state = 0;
                    $(this).siblings('.down').addClass('downNo');
                    $(this).siblings('.up').addClass('upNo');
                    $(this).parent('li').attr('s_',0);
                }


                if(isOne<=0){
                    $(this).addClass('addOn');
                    $this.data2[id].state = 1;
                    $(this).siblings('.down').removeClass('downNo');
                    $(this).siblings('.up').removeClass('upNo');
                    $(this).parent('li').attr('s_',1);
                }
                IsFirstOrEndState();//可选元素的第一，最后状态
                hasON=null,id=null;
                //$this.homeOpt();

                return false;

            })
            //底部菜单head onOff
            $('.onOff',this.bottomHead).off().on('tap',function(){

                var hasON = /addOn/ig.test($(this).attr('class'));

                if(!hasON){
                    $(this).addClass('addOn');
                    $this.currData.state = 1;
                }else{
                    $(this).removeClass('addOn');
                    $this.currData.state = 0;
                }
                hasON=null;

                return false;
            });

            /**3级子数据*/
            //三级默认输出
            /*this.data3= this.data2[i];
            this.bottomOpt3();*/

            for(var i= 0,data=this.data2;i<data.length;i++){
                if(data[i].child && data[i].child.length>0){
                    this.data3= data[i];
                    this.bottomOpt3();
                }
            }

            //二级选中状态
            $('li',this.BulObj2).off().on('tap',function(){
                var index = $(this).index();
                $this.bottomOpt2State($(this));
                index=null;
                //点击三级输出
                /*$this.data3= $this.data2[index];
                $this.bottomOpt3();*/
                return false;
            });

            function IsFirstOrEndState(){
                /**可选元素的第一，最后状态*/
                var alls = $("li[s_='1']",$this.BulObj2);//可排序的元素
                $("li[s_='1'] span[class *='upNo']",$this.BulObj2).removeClass("upNo");
                $("li[s_='1'] span[class *='downNo']",$this.BulObj2).removeClass("downNo");

                $(alls[0]).find('.up').addClass('upNo');
                $(alls[alls.length-1]).find('.down').addClass('downNo');
            }
        },
        bottomOpt2State:function(currObj){
            currObj = typeof currObj =='string'? (currObj*1):currObj;
            var currO="";
            /**点击状态*/
            if(typeof currObj =='number'){
                currO = $('li',this.BulObj2).eq(currObj);
            }else{
                currO = currObj;
            }
            currO.siblings().removeClass('curr');
            currO.addClass('curr');
            currO = null;
        },
        bottomOpt3:function(){
            /**三级选项*/

            //数据存在
            if(this.data3.child && this.data3.child.length>0){
                /**三级级菜单*/
                this.BulObj3l && this.BulObj3l.empty();
                this.BulObj3r && this.BulObj3r.empty();
                this.BObj3 && this.BObj3.empty();
                this.BObj3 = $("<div class='sub3'></div>").appendTo(this.showBottom).hide();

                this.BulObj3l = $("<dl class='left'><dt>Left</dt></dl>").appendTo(this.BObj3).hide();
                this.BulObj3r = $("<dl class='right'><dt>Right</dt></dl>").appendTo(this.BObj3).hide();

                this.BulObj3 = $("<ul></ul>").appendTo(this.BObj3);

                /*三级菜单 标题*/
                if(this.data3.title){
                    this.BObj3.prepend("<p class='tt'>"+this.data3.title+"</p>");
                }

                for(var i= 0,data = this.data3.child;i<data.length;i++){
                    if(data[i].position =='left'){
                        this.BObj3.show();
                        this.BulObj3l.show();
                        this.BulObj3l.append("<dd id_="+i+">"+data[i].name+"<span class=\"onOff "+(data[i].state>0?"addOn":"")+"\"></span></dd>");
                    }else if(data[i].position =='right'){
                        this.BObj3.show();
                        this.BulObj3r.show();
                        this.BulObj3r.append("<dd id_="+i+">"+data[i].name+"<span class=\"onOff "+(data[i].state>0?"addOn":"")+"\"></span></dd>");
                    }else{
                        this.BObj3.show();
                        this.BulObj3.append("<li id_="+i+" s_="+(data[i].state>0?1:0)+" >" +
                            "<span class=\"down "+(i==data.length-1?'downNo':data[i].state>0?'':'downNo')+"\"></span>" +
                            "<span class=\"up "+(i==0?"upNo":data[i].state>0?'':'upNo')+"\"></span>" +
                            ""+data[i].name+"<span class=\"onOff "+(data[i].state>0?"addOn":"")+"\"></span></li>");
                    }
                }
                this.bottom3Event();
            }
        },
        bottom3Event:function(){
            var $this= this;

            $(".up",this.BulObj3).off().on('tap',function(){
                var currId  = $(this).parent('li').index(),
                    isFalse = /No/ig.test($(this).attr("class"));

                //搜索上一个ID
                var pres = $("li[s_='1']",$this.BulObj3),preId=0;//下一个的索引

                for(var i = 0,datas=pres;i<datas.length;i++){
                    if(currId == $(datas[i]).attr('id_')){
                        preId = $(datas[i-1]).attr('id_');
                    }
                }//搜索上一个ID


                if(!isFalse && currId){
                    var temp = $this.data3.child[preId];
                    $this.data3.child[preId]=$this.data3.child[currId];
                    $this.data3.child[currId]=temp;
                    temp = null;
                    $this.bottomOpt3();
                    $this.bottomOpt3State(currId);
                    IsFirstOrEndState();//可选元素的第一，最后状态
                }
                currId=null;
                return false;
            });
            $(".down",this.BulObj3).off().on('tap',function(){
                var currId  = $(this).parent('li').index(),
                    total = $(this).parent('li').siblings('li').length,
                    isFalse = /No/ig.test($(this).attr("class"));

                //搜索下一个ID
                var nexts = $("li[s_='1']",$this.BulObj3),nextId=0;//下一个的索引

                for(var i = 0,datas=nexts;i<datas.length;i++){
                    if(currId == $(datas[i]).attr('id_')){
                        nextId = $(datas[i+1]).attr('id_');
                    }
                }//搜索下一个ID

                if(!isFalse && currId<total){
                    var temp = $this.data3.child[nextId];
                    $this.data3.child[nextId]=$this.data3.child[currId];
                    $this.data3.child[currId]=temp;
                    temp=null;
                    $this.bottomOpt3();
                    $this.bottomOpt3State(currId);
                    IsFirstOrEndState();//可选元素的第一，最后状态
                }
                currId=null;total=null;
                return false;
            })

            //底部菜单选项 onOff
            $('.onOff',this.BulObj3l).off().on('tap',function(){
                change(this);
                return false;
            });

            $('.onOff',this.BulObj3r).off().on('tap',function(){
                change(this);
                return false;
            });

            $('.onOff',this.BulObj3).off().on('tap',function(){
                change(this);
                return false;
            });

            function change(currObj){
                var hasON = /addOn/ig.test($(currObj).attr('class'));
                var id=$(currObj).parent('dd').attr('id_')||$(currObj).parent('li').attr('id_');

                if(!hasON){
                    $(currObj).addClass('addOn');
                    $this.data3.child[id].state = 1;
                    $(currObj).siblings('.down').removeClass('downNo');
                    $(currObj).siblings('.up').removeClass('upNo');
                    $(currObj).parent('li').attr('s_',1);
                }else{
                    $(currObj).removeClass('addOn');
                    $this.data3.child[id].state = 0;
                    $(currObj).siblings('.down').addClass('downNo');
                    $(currObj).siblings('.up').addClass('upNo');
                    $(currObj).parent('li').attr('s_',0);
                }
                IsFirstOrEndState();//可选元素的第一，最后状态
                hasON=null;id=null;
                $this.homeOpt();
            }


            //三级菜单选中状态
            $('li',this.BulObj3).off().on('tap',function(){
                $this.bottomOpt3State($(this));
            });

            function IsFirstOrEndState(){
                /**可选元素的第一，最后状态*/
                var alls = $("li[s_='1']",$this.BulObj3);//可排序的元素
                $("li[s_='1'] span[class *='upNo']",$this.BulObj3).removeClass("upNo");
                $("li[s_='1'] span[class *='downNo']",$this.BulObj3).removeClass("downNo");

                $(alls[0]).find('.up').addClass('upNo');
                $(alls[alls.length-1]).find('.down').addClass('downNo');
            }

        },
        bottomOpt3State:function(currObj){
            var currO="";
            /**点击状态*/
            if(typeof currObj=='number'){
                currO = $('li',this.BulObj3).eq(currObj);
            }else{
                currO = currObj;
            }
            currO.siblings().removeClass('curr');
            currO.addClass('curr');
            currO=null;
        },
        saveBt:function(){
            this.saveBtObj = $('<div class="button"> <span class="save"><p>SAVE</p></span></div>').appendTo(this.setObj);
            this.saveEvent();
        },
        saveEvent:function(){
            var $this = this;
            $('.save',this.saveBtObj).off().on('tap',function(){
                $this.set($this.datas);
                $this.notice();

                $.navigate({pageId:$this.currPageId});
                return false;
            });
        },
        set:function(data){
            window.localStorage.setItem('settings',JSON.stringify(data));
        },
        get:function(){
            return JSON.parse(window.localStorage.getItem('settings'));
        },
        style:function(){
            var $this = this;
            this.containorObj[0].style.cssText="position:relative";
            this.menuObj[0].style.cssText="position:absolute;top:0.3em;left:0";

            var left = this.menuObj.width()/10;
            this.setObjCon[0].style.cssText= "position:absolute;top:0.3em;left:"+(left+1)+"em";
            this.msgObj[0].style.cssText ="position:fixed;left:50%;margin-left:-5em;top:40%;margin-top:-1.5em;width:10em; text-align:center;height:3em;line-height:3em;background:#181818;z-index:10000;font-size:1.6em;color:white;";

            this.msgObj.hide();//defaultes
        },
        notice:function(){
            var $this = this;
            $this.msgObj.fadeIn('slow');
            setTimeout(function(){ $this.msgObj.hide();},1000);
        }

    };
    //接入插件
    $.setting= function(json){
        Setting.init(json);
    };

})()
