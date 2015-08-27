/**
 * Created by LY on 13-12-26.
 */
(function(W){
    var backs={
        set:function(json){/*json = {pageId:pageId,subId:subId}*/
            var old = window.localStorage.getItem("back");
            if(!old){
                /*old为空*/
                window.localStorage.setItem("back",this.jsonStr(json));
            }else{
                /*old不为空*/
                var olds = old ?old.split("|"):[],
                    curr = this.jsonStr(json);

                if(olds[olds.length-1] != curr){
                    window.localStorage.setItem("back",old+"|"+curr);
                }
            }
            old = null;
        },
        get:function(){
            var backStr = window.localStorage.getItem('back'),backA=[];
            if(backStr){
                backA = backStr.split('|');
            }
            /*转换为json 数组*/
            for(var i=0;i<backA.length;i++){
                backA[i] = JSON.parse(backA[i]);
            }
            backStr = null;
            return backA;
        },
        update:function(jsonStr){
            window.localStorage.setItem("back",jsonStr);
        },
        jsonStr:function(json){
            return JSON.stringify({pageId:json.pageId,subId:json.subId||0});
        },
        back:function(){
            window.localStorage.setItem('nextPreState',"");//清除返回状态

            var backs_ = this.get(),
                last = backs_[backs_.length-2];
            if(window.backFromSetting){
                last = backs_[backs_.length-1];
            }else{
                backs_.splice(backs_.length-1,1);
                for(var i=0;i<backs_.length;i++){
                    backs_[i] = this.jsonStr(backs_[i]);
                }
                backs_ = backs_.join("|");
                this.update(backs_);
                backs_ =null;
            }

            //当前页面PageId
            var currPageId = PageArgs.pageId;

            if(currPageId == last.pageId && window.backFromSetting!=1){
                Page.route({currNum:last.subId});
            }else{
                window.PageArgs = {pageId:last.pageId,subId:last.subId,url:""};//全局页面传参

                var url = last.pageId+".html";
                $("#loading").show();//加载开始
                $('#main-in').load(url,function(){
                    $("#loading").hide();//加载结束
                });
            }
            window.backFromSetting=0;
        }
    }
    W.backs = backs;
})(window);