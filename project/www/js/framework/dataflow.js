/**
 * Created by Yang on 13-12-31.
 */
(function(){
    var dataflow={
        defaults:{
            name:"Most Complaint",
            datas:[
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'},
                {title:'Huawei C8813',data:'Complaint Ratio: <span class="num">18:10000</span>'}
            ]
        },
        init:function(json){
            this.a = $.extend(true,{},this.defaults,json);
            this.obj = this.a.obj;
            this.load();
            this.style();
            this.event();
        },
        load:function(){
            var infoStr="";
            this.listObj = $("<div class='list'><h3 class=\"t3\">"+this.a.name+"</h3></div>").appendTo(this.obj);

            for(var i= 0,datas= this.a.datas;i<datas.length;i++){
                infoStr += this.info(datas[i]);
            }
            this.listObj.html(infoStr);
            infoStr = null;
        },
        info:function(json){
            var info = "<p class=\"t4\">"+json.title+"</p>" +
                "<p class=\"t5\">"+json.data+"</p>";
            return info;
        },
        event:function(){
            this.listObj.on('swipe',function(e){
                //console.log(e)
            });
        },
        style:function(){
            this.listObj.width(this.obj.width());
        }
    };
    $.fn.dataflow=function(json){
        var json = json || {};
        json.obj =this;
        dataflow.init(json);
        json = null;
        return dataflow;
    }

})()