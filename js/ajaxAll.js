/**
 * Created by Administrator on 2015/8/25.
 */
;$(function(){
    $.fn.ajaxDataPrivate = function(_p){
        var comm = {
            page:"/",
            infuseDataFn:function(data){}
        };
        comm = $.extend(comm,_p);
       $('#dataCon').html("").load('./data/package.json',function(pageData){
            eval(pageData);
            //console.log(pageData.list);
           $.ajax({
                type: "post",
                url: pageData.list.serverUrl[1],
                data: pageData.list.data,
                success: function(msg){
                    comm.infuseDataFn(msg)
                },
                error:function(){
                    popupAlert("系统繁忙，请稍后……");
                }

            });
        });
    };

});