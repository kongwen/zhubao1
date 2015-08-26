/**
 * Created by Administrator on 2015/8/25.
 */

    /*
    * 公共提示弹窗
    * str ：传入所需要提示的信息
    */
var popupAlert = function(str){
    $('<div class="modal fade" ><div class="modal-dialog">' +
        '<div class="modal-content"><div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title">提示</h4></div>' +
        '<div class="modal-body">' +
        '<p style="text-align: center;">' +
        '<span class="glyphicon glyphicon-info-sign" style="font-size: 50px;color: #F2F7B4;vertical-align: middle;"></span>' +
        '<span  style="font-size: 20px;">&nbsp;&nbsp;'+ str +'&hellip;</span></p>' +
        '</div><div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
        '</div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div>').modal('show')
};

$(function() {
    $('#reTop').tap(function(){
        console.log(1111);
        window.scrollTo(0,0);
    });
});
