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
    for(var i = 0;i<15;i++){
        var temp={};
            temp.src = 'http://127.0.0.1:3000/static/img/tu/'+(i+1) + '.jpg';
            temp.alt = '这是第'+(i+1) + '张图';
        dateInfo.push(temp);
    }
    var vmodel = avalon.define({
        $id: "root",
        arrDate:dateInfo,
        change:function(Obj){}
    });

    var postEle = function(dateInfo){
        var t1 = 0,t2 = 0,t3 = 0;
        $('section ul li').each(function(i,e){
            var e =  $(e);
            var xSrc = 'http://127.0.0.1:3000/static/img/tu/'+(i+1) + '.jpg';
            var real =  $("<img/>").attr("src", xSrc).load(function() {
                if(i < 3) {
                    !(i % 3)    ? (e.animate({left:"0px",top:"0px"},500) ,t1 += this.height+5):
                    !(i % 3 -1) ? (e.animate({left:"305px",top:"0px"},500),t2 += this.height+5) :
                        (e.animate({left:"610px",top:"0px"},500),t3 += this.height+5);
                }else{
                    !(i % 3)     ? (e.animate({left:"0px",top:t1},500),t1 += this.height+5) :
                    !(i % 3 -1)  ? (e.animate({left:"305px",top:t2},500),t2 += this.height+5) :
                        (e.animate({left:"610px",top:t3},500),t3 += this.height+5 );
                }
            });

        });
    };

    setTimeout(postEle,100);

});