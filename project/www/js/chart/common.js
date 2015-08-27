/**
 * Created by LY on 14-1-4.
 */
 

function getDataThen(url, onSuccess, localKey){
    if(!url)return ;//url 为空直接返回；

    var usageData = storage.getItem(localKey),innerUrl = '..'+url;

   if(!usageData || usageData=="undefined"){
		var serverIP = window.localStorage.getItem("serverIP");
		var UserName = window.localStorage.getItem("UserName");
	   /*远程输入ip*/
       //serverIP = '10.0.4.12:8088';
       //serverIP = '192.168.100.172:8080';

        $("#loading").show();//加载开始
		if(UserName == "Dashboard"){
			$("#dataCon").html("").load(innerUrl,function(str){
                $("#loading").hide();//加载开始
			    eval(str);
			    var dataStr = JSON.stringify(REPORTJSON);//将对象转为JSON格式的文本数据，并将其返回。
			    if(dataStr){
				   storage.setItem(localKey,dataStr);
				   $.isFunction( onSuccess ) && onSuccess(REPORTJSON);
			   }
			});
		}else{
			
            if(localKey =='RISK'){
                $("#dataCon").html("").load(innerUrl,function(str){
                    $("#loading").hide();//加载开始
                    eval(str);
                    var dataStr = JSON.stringify(REPORTJSON);//将对象转为JSON格式的文本数据，并将其返回。
                    storage.setItem(localKey,dataStr);
                    $.isFunction( onSuccess ) && onSuccess(REPORTJSON);
                });
            }else{
                var Control = controlRule.get();
                if(Control.rule == 1 || Control.rule == null || !usageData){

                    $.getJSON("https://"+serverIP+url+"?jsonpCallback=?",function(data){
                        $("#loading").hide();//加载开始
                        var dataStr = JSON.stringify(data);//将对象转为JSON格式的文本数据，并将其返回。
						 if(dataStr){
							storage.setItem(localKey,dataStr);
							$.isFunction( onSuccess ) && onSuccess(data);
						}
                    });
					
					
                }else{
					
                    var data = JSON.parse(usageData);
					if(data){
						$.isFunction( onSuccess ) && onSuccess(data);
					}
                }

            }
		}   
   }else{
        var data = JSON.parse(usageData);
		if(data){
			$.isFunction( onSuccess ) && onSuccess(data);
		}
   }

}



function getDataConfig(url, onSuccess, localKey){
	 var usageData = storage.getItem(localKey);
	if(!usageData || usageData=="undefined"){
		$(".dataCon").load('..'+url,function(str){
			eval("var REPORTJSON = "+str);
			var dataStr = JSON.stringify(REPORTJSON);//将对象转为JSON格式的文本数据，并将其返回。
			storage.setItem(localKey,dataStr);
			$.isFunction( onSuccess ) && onSuccess(REPORTJSON);
		});
	}else{
       var data = JSON.parse(usageData);
       $.isFunction( onSuccess ) && onSuccess(data);
   }
}
