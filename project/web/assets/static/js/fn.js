(function($){
    $.fn.adSd=function(settings,p){
        var options = $.extend({
            pageLinkFun:function(){},sss:function(){}
        },settings||{});
        return this.each(function(){
            var $this = $(this);
                var _html = "";
                for(var i = 1;i<=p.a ; i++){
                    _html += "<p>"+ p.b + i +"</p>";
                }
            var page = 2,www = 3;
            if(typeof options.pageLinkFun=="function") options.pageLinkFun(page);
            $this.append(_html);
        });
    };
})(jQuery);
;(function(){
    window.debug = { ec : false };
    window.console = (function(){
        if ( window.console ) {
            return window.console;
        } else {
            return { log:function() {} };
            // test code
            var $debug = $('<ul id="debug"><input type="button" value="clear" id="clear-debug"/><input type="button" value="pause" id="pause-debug"/></ul>');
            $debug.pause = true;
            $(function(){
                $debug.prependTo('body');
                $debug.on('dblclick','.remove',function(e) {
                    $(this).parent().remove();
                });
                $('#clear-debug').click(function() {
                    $debug.find('li').remove();
                });
                $('#pause-debug').click(function() {
                    $debug.pause = !!$debug.pause;
                });
            })
            var console = {
                log : function( ) {
                    $debug.pause && $debug.append(
                        ['<li><span class="remove">$ su :&nbsp;</span>','</li>'].join(
                            _.map(arguments,function( log ) {
                                return ['<span>','</span>'].join( log );
                            }).join('&nbsp;')
                        )
                    );
                }
            };
            return console;
        }
    })();
})();


