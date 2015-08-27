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


require(['jquery','avalon', "domReady!"], function($,avalon) {

    var dateInfo = [];
    for(var i = 0;i<33;i++){
        var temp={};
            temp.src = 'http://127.0.0.1:3000/static/img/tu1/'+(i+1) + '.jpg';
            temp.alt = '这是第'+(i+1) + '张图';
        dateInfo.push(temp);
    }
    var vmodel = avalon.define({
        $id: "root",
        arrDate:dateInfo,
        change:function(Obj){}
    });

    var postEle = function(dateInfo){
        //固定最小基准高度 standard
        var standard = 250,wRow = 0,row = 0,top= 0,imgArr = [];
        $('section ul li').each(function(i,e){
            var e = $(e);
            var xSrc = 'http://127.0.0.1:3000/static/img/tu1/'+(i+1) + '.jpg';
            var real =  $("<img/>").attr("src", xSrc).load(function() {
                if(standard > this.height)  standard = this.height;//得出最小基准高度
                imgArr.push({w:this.width,h:this.height});
                wRow += this.width;
                e.animate({left:"0px",top:top +"px"},500);
                if(wRow > 910){
                    wRow = 0;
                    top += standard + 5;
                    var pw = 0;//等比计算后的总宽度
                    var num = imgArr.length;//每行有多少个图片
                    alert(num)
                    $.each(imgArr,function(i,ths){
                       pw += ths.w * (standard/ths.h);
                    });
                    //当前行总宽度/浏览器当前宽度 = 每个图片当前高度/变化后高度
                    //alert(pw)
                    if(pw < 910){

                    }

                    imgArr.length=0;
                }

                //if(i===24) claImg(standard);
            });
        });
    };

    var claImg = function(standard){
        var heightArr = [],row = 0;
        $('section ul li').each(function(i,e){
            var xSrc = 'http://127.0.0.1:3000/static/img/tu/'+(i+1) + '.jpg';
            var real =  $("<img/>").attr("src", xSrc).load(function() {
                var w =this.width*(standard/this.height)
                $(e).css({width:this.width*(standard/this.height)+"px"});
                row += w;
                if(row > 910)  row += w;
            });
        });
    }

    setTimeout(postEle,100);
});