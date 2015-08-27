require.config({//第一块，配置
    baseUrl: '',
    paths: {
        jquery: '../static/vendor/jquery/jquery-2.1.1',
        avalon: "../static/vendor/avalon/avalon",//必须修改源码，禁用自带加载器，或直接删提AMD加载器模块
        text: '../static/vendor/require/text',
        domReady: '../static/vendor/require/domReady',
        css: '../static/vendor/require/css.js'
    },
    priority: ['text', 'css'],
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        }
    }
});


require(['jquery', "domReady!"], function($) {


    var postEle = function(){
        /*
        * standard 固定最小基准高度
        * wRow     等比计算后的总宽度
        *
        */
        var standard = 250,wRow = 0,rCount= 0,top= 0,imgArr = [],left= 0,lastLen= 0,lastPerW,lastTop = 0;
        $('section ul li').each(function(i,e){
                wRow += $(e).width();
                imgArr.push({w: $(e).width() * (standard / $(e).height())});
                 if (wRow > 910) {
                     var per = (910 - (imgArr.length - 1) * 5) / wRow;
                     $.each(imgArr, function (j, ths) {
                         $('section ul li').eq((rCount + j)).css({width: ths.w * per + "px", height: per * standard + "px"});
                         $('section ul li').eq((rCount + j)).animate({left: left + "0px", top: top + "px"}, 500);
                         left += ths.w * per + 5;
                     });
                     rCount += imgArr.length;
                     lastLen = imgArr.length;
                     lastPerW = wRow;
                     lastTop = top;
                     //当前行总宽度/浏览器当前宽度 = 每个图片当前高度/变化后高度
                     imgArr.length = 0, left = 0, top += per * standard + 5;
                     wRow = 0;
                 }
        });
        if($('section ul li').length-rCount){
            //syu 图片剩余数
            var wHRow = 0 ,syu = $('section ul li').length-rCount,objLi = $('section ul li');
            for(var i = 0;i< syu ;i++ ){
                wHRow += objLi.eq((rCount + i)).width();
            }
            if(wHRow < 910/2){
                rCount = rCount - lastLen;
                alert(syu)
                syu = $('section ul li').length-rCount;
              /*  for(var i = 0;i< syu ;i++ ){
                    if(i < lastLen){
                        swHRow += objLi.eq((rCount + i)).width()/lastPer + 5;
                    }else{
                        swHRow += objLi.eq((rCount + i)).width();
                    }
                }*/
                var per = (910 - (syu - 1) * 5) / (wHRow +lastPerW);
                for(var i = 0;i< syu ;i++ ){
                    var thsM = objLi.eq((rCount + i));
                    var thsMW = thsM.width() * per;
                    thsM.css({width: thsMW + "px", height: per * standard + "px"});
                    thsM.animate({left: left + "px", top: lastTop + "px"}, 500);
                    left += thsMW + 5;
                }
                left = 0;
            }else{
                var per = (910 - (syu - 1) * 5) / wHRow;
                for(var i = 0;i< syu ;i++ ){
                    var thsM = objLi.eq((rCount + i));
                    var thsMW = thsM.width() * per;
                    thsM.css({width: thsMW + "px", height: per * standard + "px"});
                    thsM.animate({left: left + "px", top: top + "px"}, 500);
                    left += thsMW + 5;
                }
                left = 0;
            }

        }
    };
    var pbl = function(){
        //模拟数据 在这里可用ajax去后台取数据
        var dateInfoNum = 0;
        $.ajax({
            type: "get",//使用get方法访问后台
            dataType: "json",//返回json格式的数据
            url: "../static/js/imgTu1.txt",
            async: false,
            success: function(msg){
                //将数据塞进html
              dateInfoNum = msg.length;
              $.each(msg, function (i, ths) {
                  $("<img/>").attr("src", ths.src).load(function() {
                      $('#arrDate').append('<li style="height: 250px;width: '+ this.width * (250 / this.height) +'px"><img src="'+ ths.src +'"alt="' + ths.alt +'"/></li>');
                      if($('section ul li').length  === dateInfoNum )  postEle();
                  });
              });
            },
            error:function(){
                alert('error')
            }
        });

    }();
});