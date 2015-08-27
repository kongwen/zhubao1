/**
 * @overview rebuild uxe core lib
 * @author
*/

/*jslint indent: 4, maxerr: 50, white: true, browser: true, widget: false, windows: false, rhino: false, debug: true, evil: false, continue: false, forin: true, sub: false, css: true, es5: true, vars: true, nomen: true, node: false, plusplus: true, bitwise: false, regexp: true, newcap: true, unparam: false, eqeq: true */

/* 
	todo : 数据缓存机制
*/

if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());



/**
 * logs
 */
;(function(){
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

(function () {

	window.debug = { ec : false };
	
	if ( window.uxe ) {
		return;
	}
	window.uxe = {};
	
	// get session control
	(function () {
		function parseCookie() {
			var cookies = {};
			$.each( document.cookie.split("; "), function( key, val){
				val.replace ( /^([^=]*)\=([^\;]*)/g, function( $, $1, $2 ) {
					cookies[$1] = $2;
				});
			});
			return cookies;
		}
		window.Cookie = function  ( key, value ) {
			if ( value === undefined ) {
				return parseCookie ()[key];
			} else if ( value === "" ) {
				document.cookie = key + "=" + value +"; expires=" + (new Date).toGMTString();
			} else {
				var curTime = new Date();
				document.cookie = key + "=" + value + "; expires=" + (new Date( curTime*2 )).toGMTString();
			} 
		}
	})();

	// not get the idea of this block
	(function () {
		// uxe ref
		var A = window.uxe;
		A.isFullUrl = function (B) {
			if (B.indexOf("http://") == 0) {
				return true;
			}
			return (B.indexOf("https://") == 0);
		};
		A.parseArguments = function (D, C) {
			var F = 0;
			if (C) {
				if (C >= D.length) {
					return [];
				} else {
					F = C;
				}
			}
			var B = [];
			for (var E = F; E < D.length; E++) {
				B.push(D[E]);
			}
			return B;
		};
		A.vars = function (B) {
			A.vars[B] = A.vars[B] || {};
			return A.vars[B];
		};
		A.define = {
			"uxetype" : {
				"PAGE" : "PAGE",
				"ROW" : "ROW",
				"ROWTOOL" : "ROWTOOL",
				"AREA" : "AREA",
				"BORDER" : "BORDER",
				"APP" : "APP",
				"APPTITLE" : "APPTITLE"
			},
			"viewtype" : {
				"FTL" : "FTL",
				"HTML" : "HTML",
				"STRING" : "STRING",
				"IMAGE" : "IMAGE"
			},
			"prefix" : {
				"APP" : "app",
				"APPCONTAINER" : "appcntr"
			}
		};
		A.vars["nodeClickedAndSelected"] = function (B, E, C) {
			$("#" + E, $("#" + B)).find("a").trigger("click");
			var D = C || false;
			if (D) {
				$("#" + E, $("#" + B)).trigger("click");
			}
		};
		A.vars["nodeStatus"] = function (C, D) {
			var B = $("#" + D, $("#" + C));
			A.vars["ondeOpenFlage"] = B.hasClass("leaf") ? true : B.hasClass("open");
		}
	})();



	// uxe.session, deal with ie7
	(function ($) {
		uxe.session = {};

		var loadData;
		var refreshSessionMap;

		if ($.browser.msie && $.browser.version == "7.0") {
			loadData = function () {
				var apd;
				try {
					apd = window.name != "" ? 
							JSON.parse( window.name ) :
							{};
				} catch (e) {}
				
				if ( apd != undefined && typeof apd == "object") {
					uxe.sessionMap = $.extend({}, apd)
				}
			};
			refreshSessionMap = function () {
				var tempData = {};
				var len = 0;
				var key;
				for ( key in uxe.sessionMap) {
					if ( uxe.sessionMap.hasOwnProperty(key) ) {
						tempData[key] = uxe.sessionMap[key];
					};
				}
				window.name = JSON.stringify(tempData);
			};
		} else {
			loadData = function() {
				// other browser
				if ( sessionStorage.uxeSessionMap ) {
					uxe.sessionMap = $.parseJSON ( sessionStorage.uxeSessionMap );
				} else {
					uxe.sessionMap = {};
					sessionStorage.uxeSessionMap = '{}';
				}
			};
			refreshSessionMap = function () {
				sessionStorage.uxeSessionMap = JSON.stringify(uxe.sessionMap);
			};
		}
		// init
		loadData();

		uxe.session.set = function (key, value) {
			uxe.sessionMap[key] = value;
			refreshSessionMap();
		};
		uxe.session.get = function (key) {
			return uxe.sessionMap[key]
		};
		uxe.session.del = function (key) {
			uxe.sessionMap[key] = null;
			refreshSessionMap();
		};
		// 更新session缓存
		uxe.session.update = function  ( key, updater) {
			var data =  uxe.sessionMap[key];
			if ( data != undefined ) {
				// 遍历指定data
				_.each(data,updater);
				refreshData();
			};
		};
		uxe.session.destroy = function () {
			uxe.sessionMap = {};
			refreshSessionMap();
		};
	})(jQuery);

	
	// simply event center
	(function ( $ ) {
		if ( window.ec ) {
			return;
		}
		var debug = window.debug.ec  = console && window.debug.ec && true;
		// use jQuery's Callbacks to build eventCenter
		var eclist = {};
		
		function nameSpaceFiler ( type, list ) {
			var type = type.split(':');
			var namespace;
			if ( type.length === 1 ) {
				type = type[0];
				if ( !list[type] ) {
					if ( type.match('Ready') ) {
						debug && console.log( 'regist ready', type );
						list[ type ] = $.Callbacks ();
					} else {
						debug && console.log( 'regist memory', type );
						list[ type ] = $.Callbacks ( "memory" );
					}
				}
				return list[type];
			} else {
				if ( !list[type[0]] ){
					list[type[0]] = {};
				}
				namespace = list[type[0]];
				if ( !namespace[type[1]]){
					if ( type[1].match('Ready') ) {
						debug && console.log( 'regist ready', type );
						namespace[ type[1] ] = $.Callbacks ();
					} else {
						debug && console.log( 'regist memory', type );
						namespace[ type[1] ] = $.Callbacks ( "memory" );
					}
				}
				return namespace[type[1]];
			}
		}
		// simply ec
		var eventCenter = window.ec = {
			on : function  ( type, handle ) {
				debug && console.log( "listen", type, handle );
				nameSpaceFiler( type, eclist ).add( handle );
			},
			fire : function  ( type, data, callback ) {
				debug && console.log( "fire", type, data, callback );
				nameSpaceFiler( type, eclist )
				.fire ( data, callback );
			},
			remove : function  ( type, handle  ) {
				debug && console.log( "remove", type, handle );
				nameSpaceFiler( type, eclist ).remove ( handle );
			},
			once : function  ( type, handle ) {
				debug && console.log( "once", type, handle );
				var evt = nameSpaceFiler( type,eclist);
				var onetimeEvent = function  ( data, callback ) {
					handle ( data, callback );
					evt.remove ( onetimeEvent );
				}
				evt.add( onetimeEvent );
			}
		}
	})(jQuery);

	// uxe app constructor
	(function ( $ ) {

		uxe.app = {
			instances : {}
		};
		// uxe app constructor
		uxe.App = function ( id ) {
			if ( uxe.app.instances [ id ] ) {
				var app = uxe.app.instances[id];
				return app;
			} else {
				uxe.app.instances[id] = this;
			}
			var self = this;
			this.debug = console && true;
		};
		
		window.debug.i18n = console && window.debug.i18n || true;
		
		var publicMessageError = {
			'00000009' : 'sessionOutOfDate',
			'00000021' : 'subscribeStatusChange',
			'00000022' : 'serviceSwitchChange',
			'00000023' : 'contactListChange'
		}
		uxe.App.prototype = {
			appId : null,
			containerId : null,
			resource : null,
			preference : null,
			executor : null,
			address : {},
			transfering : false, 
			inited : false,
			init : function () {
				this.container = $("#" + this.appId );
				var self = this;
				// 重置dom绑定
				var executor = this.executor;

				if ( executor && executor.system ) {
					var sys = executor.system;
					if ( !this.inited  && typeof sys.oncreate == "function") {
						sys.oncreate();
					}
					"function" === typeof  sys.oninit && sys.oninit();
				};

				
				uxe.doI18N ( self.container );
				this.inited = true;
			},
			
			// hold render func for render, renderAdd
			_render : function  ( viewId, data ) {
				data = data || {};
				data = "string" === typeof data ? $.parseJSON ( data ) : data;
				var view = this.resource [ viewId ];
				var ret = '';
				switch (view.type) {
					case uxe.define.viewtype.FTL:
					case uxe.define.viewtype.HTML:
						ret = ( typeof view.content == "function" ? view.content ( data ) : view.content );
						break;
					case uxe.define.viewtype.STRING:
						ret = view.content;
						break;
					case uxe.define.viewtype.IMAGE:
						ret = ( "<img src='" + view.content + "' border='0' />" );
						break;
					default:
						ret =  "";
						break;
				}
				if ( ret != '' ) {
					return uxe.doI18N ( $(ret) );
				} 
				return $(ret);
			},
			render : function (viewId, data, target ) {
				debug.render && console.log( viewId, data );
				// format input
				target = !target ? 
					// target to self container
					this.container :
					// css selector or dom or jQuery obj
					$(target);
				target.empty().append ( this._render ( viewId, data ) );
				return this;
			},
			renderPopwin : function (viewId, data, optn) {
				var popwin = uxe.Popwin( optn || {} );
				this.render ( viewId, data, popwin.body );
				return popwin;
			},
			renderAdd : function (viewId, data, target ) {
				target = target || this.container;
				target.append( this._render ( viewId, data ) );
				return this;
			},
			find : function (selector) {
				return $('#' + this.appId).find(selector);
			},
			//通讯接口
			send : function  ( type/* url别名 */,
							   data/* 发送的数据 */,
							   success /* 通讯结束的回调 */,
							   noWaiting /* 是否显示等待层 */
			){
				// // 单模块保持单异步链接
				// if ( this.transfering ){
				// 	return;
				// }
				// 是否有配置过url

				var url = this.address[ type ];
				if ( url === undefined ) {
					return ;
				}
				// 开始通讯
				
				this.transfering = true;
				noWaiting || ec.fire('showWaiting');
				var self = this;
//				self.debug && console.log( 'transfering', type );
				data.timestamp = new Date().getTime()+Math.random();
				return $.post ( url, 
					data,
					function  ( data ) {
						noWaiting || ec.fire('clearWaiting');
						self.transfering = false;
						if ( data ) {
							if ( data.resultCode && data.resultCode.slice(-2) === '00' ) {
								// 成功
								uxe.session.set ( 'sessionOutOfDate', 'false' );
								
								// 通讯成功
								success ( null, data );
							} else if ( data.resultCode in publicMessageError ) {
								ec.fire( 'errMsg', data.resultCode );
								ec.fire('publiceMessageError', data.resultCode, function(){
									success( data.resultCode );
								});
							} else {
								// 失败
								success ( data.resultCode || '00000099', data );
							}
						} else {
							success ( '00000099', data );
						}
				       /*
						if($('#forgetPassword,#getAuthCode').length==0){
							var popLen = $('[_pop=pop]').length;
							$('[_pop=pop]').each(function(i,v){
								if(i!=popLen-1){
									$('[_pop=mask]').eq(i).remove();
									$(this).remove();
								}
							});
						}
						*/
					},'json')
					.error(function () {
						self.transfering = false;
						ec.fire('clearWaiting');
						success( 'TOOLS_NET_WORK_ERR' );
						
//						if($('#forgetPassword,#getAuthCode').length==0){
//							var popLen = $('[_pop=pop]').length;
//							$('[_pop=pop]').each(function(i,v){
//								if(i!=popLen-1){
//									$('[_pop=mask]').eq(i).remove();
//									$(this).remove();
//								}
//							});
//						}
					});
			},
			synSend:function(   type/* url别名 */,
							   data/* 发送的数据 */,
							   success /* 通讯结束的回调 */,
							   noWaiting /* 是否显示等待层 */){
				// 是否有配置过url
				var url = this.address[ type ];
				if ( url === undefined ) {
					return ;
				}
				// 开始通讯
				
				this.transfering = true;
				noWaiting || ec.fire('showWaiting');
				var self = this;
//				self.debug && console.log( 'transfering', type );
				data.timestamp = new Date().getTime()+Math.random();
				return $.ajax({
						 type: "post",
			             async: false,
			             url: url,
			             data: data,
			             dataType: "json",
			             success: function  ( data ) {
								noWaiting || ec.fire('clearWaiting');
								self.transfering = false;
								if ( data ) {
									if ( data.resultCode && data.resultCode.slice(-2) === '00' ) {
										// 成功
										uxe.session.set ( 'sessionOutOfDate', 'false' );
										
										// 通讯成功
										success ( null, data );
									} else if ( data.resultCode in publicMessageError ) {
										ec.fire( 'errMsg', data.resultCode );
										ec.fire('publiceMessageError', data.resultCode, function(){
											success( data.resultCode );
										});
									} else {
										// 失败
										success ( data.resultCode || '00000099', data );
									}
								} else {
									success ( '00000099', data );
								}
							},
							error:function(){
								self.transfering = false;
								ec.fire('clearWaiting');
								success( 'TOOLS_NET_WORK_ERR' );
							}}) 
			}
		};
	})( jQuery );

	// uxe popup sys
	(function ($) {
		/**
		 * popup class
		 * @class
		 * @constructor
		 * @param {Object} optns { [width], [height], [model] }
		*/
		function popwin ( optns ) {
			optns = optns || {};
			this.width = optns.width || 600;
			this.height = optns.height || 400;
			this.model = optns.model || false;
			this.elem = null;
			this.body = null;
			this.constructor();
		}
		popwin.prototype = {
			constructor : function () {
				if ($("body").find("[uxetype='POPWIN']").size() > 0) {
					this.elem = $("body").find("[uxetype='POPWIN']:eq(0)")
				} else {
					var C = "<div uxetype='POPWIN' style='position: fixed; z-index: 99999; left: 50%; top: 50%; display: none;'><div uxetype='POPWINBODY'></div></div>";
					this.elem = $(C).appendTo("body")
				}
				this.body = this.elem.find("[uxetype='POPWINBODY']:eq(0)");
				if (this.model) {
					var D = "<div uxetype= 'POPWINMASKER' style='position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #ffffff; filter: alpha(opacity=50); -moz-opacity: 0.5; opacity: 0.5;  overflow: hidden; z-index: 99998;'></div>";
					this.masker = $(D).insertBefore(this.elem)
				}
				this.elem.width(this.width);
				this.elem.height(this.height);
				this.elem.css("margin-left", -this.width / 2 + "px");
				this.elem.css("margin-top", -this.height / 2 + "px")
			},
			addContent : function ( content ) {
				this.body.html( content );
				return this;
			},
			empty : function () {
				this.body.html("");
				return this;
			},
			show : function () {
				this.elem.show();
				if (this.model) {
					this.masker.show()
				}
				return this;
			},
			hide : function () {
				if (this.model) {
					this.masker.hide()
				}
				this.elem.hide();
				return this;
			}
		};
		uxe.Popwin = function ( optns ) {
			return new popwin( optns );
		};
	})(jQuery);
})();

// for complex json pass to struct2
(function () {
	var r20 = /%20/g;
	function Model ( name, data ) {
		var s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = $.isFunction( value ) ? value() : value;
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};
		buildParams( name, data, add );
		return s.join('&').replace ( r20,'+');
	}
	function buildParams( prefix, obj, add ) {
		if ( $.isArray( obj ) ) {
			// Serialize array item.
			$.each( obj, function( key, val ) {
				buildParams( prefix /* + "[" + ( typeof val === "object" || jQuery.isArray(val) ?  key : "" ) + "]"  // fuck struct2 */, val,  add );
			});
		} else if ( obj != null && typeof obj === "object" ) {
			// Serialize object item.
			for ( var name in obj ) {
				buildParams( ( prefix == '' ? '':prefix + '.' ) + name, obj[ name ],  add );
			}
		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	uxe.Model = Model;
})();
(function () {
	/**
	 * 获取国际化参数
	 * @param  {jQuery}   $item 待国际化的元素
	 * @param  {String}   [key] 国际化参数key
	 * @return {Array}		  国际化用参数
	 *		 {Function}	   构建国际化参数		  
	 */
	function getParams ( $item, key ){
		var params = $($item).attr("msgplus-params");
		if ( params ) {
			params = params.split(',');
		} else{
			params = [];
		}
		if (key) {
			params.unshift(key);
			if (params.length > 1 ) {
				console.log( params );
			}
			return params;
		} else {
			return function( key ){
				key != undefined && params.unshift(key);
//				if (params.length > 1 ) {
//					console.log( params );
//				}
				return params;
			};
		}
	}
	uxe.doI18N = function  ( $item ) {
		$item.find('[msgplus]').each (function  () {
			var $self = $(this);
			var key =  $self.attr("msgplus");

			var string = getI18N ( getParams( $self, key ) );

			if ( string !== undefined ) {
				$self.text ( string );
			}
		});
		// 国际化title
		$item.find("[msgplus-title]").each (function  () {
			var $self = $(this);
			
			var i18nKey = $self.attr("msgplus-title");
			var string = getI18N ( getParams( $self, i18nKey )  );

			if ( string !== undefined ) {
				$self.attr ( 'title', string );
			}
		});
		// 国际匿placeholder
		$item.find("[msgplus-placeholder]").each (function  ( key, value ) {
			var $self = $(this);

			var i18nKey = $self.attr("msgplus-placeholder");
			var string = getI18N ( getParams( $self, i18nKey )  );

			if ( string !== undefined ) {
				$self.attr ( 'placeholder', string );
			}
		});
		$item.filter('[msgplus],[msgplus-title],[msgplus-placeholder]').each(function () {
			var $self = $(this);
			var params = getParams( $self );

			var i18n 			= $self.attr('msgplus'); 
			var i18nTitle 		= $self.attr('msgplus-title');
			var i18nPlacholder	= $self.attr('msgplus-placeholder');
			
			i18n 			!= undefined && $self.text( getI18N( params ( i18n ) ) );
			i18nTitle 		!= undefined && $self.attr( 'title',	   getI18N( params ( i18nTitle ) ) );
			i18nPlacholder 	!= undefined && $self.attr( 'placeholder', getI18N( params ( i18nPlacholder ) ) );
		});
		return $item;
	}
})();
//Emitter
// emitter 
(function () {
	function _emitter ( nomemory ) {
		var handleList = {};
		this._get = function  ( type ) {
			if ( handleList [ type ] === undefined ) {
				handleList [ type ] = $.Callbacks( nomemory ? undefined : 'memory');
			}
			return handleList[type];
		}
	}
	_emitter.prototype = {
		on : function ( type, handle ) {
			this._get(type).add(handle);
		},
		fire : function ( type, data ) {
			var data = [].slice.call( arguments, 1 );
			this._get(type).fire
			.apply( this, data);
		},
		remove : function ( type, handle ) {
			this._get(type).remove(handle);
		}
	}
	uxe.Emitter = function  ( nomemory ) {
		return new _emitter( nomemory );
	};
})();
// observer
(function () {
	function observer ( data ) {
		var data = data;
		var cb = uxe.Emitter( true );
		var ob = {
			_set : function  ( val ) {
				data = val;
			},
			set : function  ( val ) {
				var old = data;
				this._set ( val );
				
				cb.fire('set', data, old );
				if ( data != old ) {
					if ( "object" === typeof data ){
						if( !_.isEqual( data, old ) ) {
							this.changed = true;
							cb.fire('change', data, old );
						}
					} else {
						this.changed = true;
						cb.fire('change', data, old );
					}
				} else {
					this.changed = false;
				}
			},
			get : function () {
				this.changed = false;
				return data;
			},
			_get : function(){
				return data;
			}
		};
		ob.on = function  ( type, handle ) {
			cb.on( type, handle );
		} 
		ob.fire = function  ( type ) {
			cb.fire( type );
		} 
		ob.remove = function  ( type, handle ) {
			cb.remove( type, handle );
		} 
		return ob;
	}
	uxe.Observer = observer;
})();
//easyTemplate
(function () {
	var A = function (C) {
		if (!C) {
			return "";
		}
		if (C !== A.template) {
			A.template = C;
			A.aStatement = A.parsing(A.separate(C))
		}
		var B = A.aStatement;
		return new Function(B[0], "uxe_param", B[1])
	};
	A.separate = function (B) {
		var D = /\\'/g;
		var C = B.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g, function (F, E, L, K, J, I, H, G) {
				if (E) {
					return "{|}" + (L ? "-" : "+") + K + "{|}"
				}
				if (J) {
					return "\\'";
				}
				if (I) {
					return "";
				}
				if (H) {
					return "'+(" + G.replace(D, "'") + ")+'";
				}
			});
		return C
	};
	A.parsing = function (D) {
		var G,
		F,
		I,
		H,
		B,
		C = ["var aRet = [];"];
		D = D.replace(/\+if\(/, "+if (");
		D = D.replace(/\+elseif\(/, "+elseif (");
		B = D.split(/\{\|\}/);
		var E = /\s/;
		while (B.length) {
			G = B.shift();
			if (!G) {
				continue
			}
			I = G.charAt(0);
			if (I !== "+" && I !== "-") {
				G = "'" + G + "'";
				C.push("aRet.push(" + G + ");");
				continue
			}
			F = G.split(E);
			switch (F[0]) {
			case "+if":
				F.splice(0, 1);
				C.push("if(" + F.join(" ") + "){");
				break;
			case "+elseif":
				F.splice(0, 1);
				C.push("}else if" + F.join(" ") + "{");
				break;
			case "-if":
				C.push("}");
				break;
			case "+else":
				C.push("}else{");
				break;
			case "+list":
				C.push("if(" + F[1] + ".constructor === Array){with({i:0,l:" + F[1] + ".length," + F[3] + "_index:0," + F[3] + ":null}){for(i=l;i--;){" + F[3] + "_index=(l-i-1);" + F[3] + "=" + F[1] + "[" + F[3] + "_index];");
				break;
			case "-list":
				C.push("}}}");
				break;
			default:
				break
			}
		}
		C.push('return aRet.join("");');
		return ["data", C.join("")]
	};
	uxe.easyTemplate = A
})();

;(function () {
	// 列表view databind
	function _List ( optn ) {
		if ( !optn ) {
			throw new Error ('List need arguments');
		}
		this.selector = optn.selector;
		this.itemSelector = optn.itemSelector;
		this.createItem = optn.createItem;
		this.cb = uxe.Emitter();
		this.data = [];
		this.isSelected = undefined || optn.isSelected;
	}
	
	_List.prototype = {
		prepend : function  ( data ) {
			var self = this;
			//
			var $item = this.createItem ( data, this.data.length, this );
			$item = uxe.doI18N( $item );
			this.getContainer().prepend ( $item );
			$item.data ( data );
			this.cb.fire('prepend', data, $item);
			this.data.unshift ( data );
		},
		append : function  ( data ) {
			var self = this;
			var $item = this.createItem ( data, this.data.length, this );
			$item = uxe.doI18N( $item );
			this.getContainer().append ( $item );
			$item.data ( data );
			this.cb.fire('append', data, $item);
			this.data.push ( data );
		},
		add : function  ( data ) {
			var self = this;
			if ( $.isArray ( data ) ) {
				_.each ( data , function  ( item ) {
					self.append( item );
				});
			} else {
				self.append ( data );
			}
			if (window.PIE) {
	            $('.rounded').each(function() {
		            PIE.attach(this,20);
		        });
		    }
			this.cb.fire('add', data);
		},
		reset : function  ( data, cb ) {
			this.getContainer().empty();
			this.otherContainer().empty();
			this.data = [];
			this.add( data );
			this.cb.fire ( 'reset', data );
			$.isFunction(cb) && cb();
		},
		// 事件绑定代理
		on : function  ( type, selector, handle) {
			var _thislist = this;
			this.getContainer().on( type, selector, function  ( e ) {
				var $item = $(this).parents( _thislist.itemSelector );
				if ( !$item.length ) {
					$item = $(this);
				}
				handle.call ( this, e, $.extend(true, {}, $item.data()), $item );
			});
		},
		// 获取列表容器
		getContainer : function () {
			if( "function" === typeof this.selector ) return $(this.selector());
			if( "string" === typeof   this.selector ) return $(this.selector);
		},
		otherContainer : function () {
			if( "function" === typeof this.otherSelector ) return $(this.otherSelector());
			if( "string" === typeof   this.otherSelector ) return $(this.otherSelector);
			if( "undefined" === typeof this.otherSelector ) return {empty:function(){}};
		},
		// 获取被鿤ح的元素对应的忍
		getSelectedData : function () {
			var data = [];
			// 从鿤ح的元素上获取数捿
			_.each( this.getSelectedItem(), function  ( $item ) {
				data.push ( $item.data() );
			});
			return data;
		},
		// 获取被鿤ح的元素
		getSelectedItem : function () {
			var items = [];
			if ( "function" === typeof this.isSelected ) {
				var isSelected = this.isSelected;
				this.getContainer().find(this.itemSelector).each(function  ( key, val ) {
					var $self = $(this);
					if( isSelected ( $(this) ) ){
						items.push ( $self );
					}
				});
			}
			return items;
		},
		getAllData: function () {
			var data = [];
			this.getContainer().find(this.itemSelector).each( function ( ) {
				data.push( $(this).data() );
			});
			return data;
		}
	};
	if ( $.browser.msie && $.browser.version < 8 ) {
		_List.prototype.add = function( data ) {
			var id = '%%  list    '+(Math.random()*1000).toPrecision(3) + 
							 ' ' + this.selector + ' %%';
			var start = new Date().getTime();
		    var self = this;
		    var len = data.length;
		    var counter = 0;
		    function finish () {
		        counter ++;
		        if ( counter >= len ){
		        	self.cb.fire('add', data);
		        	var end = new Date().getTime();
		        }
		    }
			if ( $.isArray ( data ) ) {
				_.each ( data , function  ( item ) {
				    setTimeout(function() {
						self.append( item );
						finish();
		    		}, 10);
				});
			} else {
				len = 1;
				self.append ( data );
				finish ();
			}
		}
	}
	window.List = function  ( optn ) {
		return new _List( optn );
	};
})()


;(function () {

	var i18nCache = {};
	ec.on('i18n',function  ( data ) {
		i18nCache = data;
	});
	// 读取国际化内容的接口
	window.getI18N = function  ( key ) {
		if ( $.isArray( key ) ){
			var args = Array.prototype.slice.call ( key, 1 );
//			key.length > 1 && console.log( key );
			var ret = key[0];
		} else {
			var args = Array.prototype.slice.call ( arguments, 1 );
			var ret = key;
		}
		if ( 'string' !== typeof ret ) {
			return ret;
		}
		ret = ret.toUpperCase();
		var defaultLanguage = window.defaultLanguage || 'en-US';
		
		if ( i18nCache[ret] ) {
			ret = i18nCache[ret];
		} else if ( msgplus[ defaultLanguage ][ret] ){
			ret = 	msgplus[ defaultLanguage ][ret];
		}

		if ( args.length ) {
			ret = ret.replace(/\{(\d+)\}/g,function  ( $, $1 ) {
				return args[$1] === 0 ? 0 : ( args[$1] ? args[$1] : '' );
			});
		}
		return ret;
	};
})();


;(function () {
	// 翻页控制器
	 function _pager ( optn ) {
	 	var self = this;
	 	this.data 		  = [];
		this.curPageIndex = 0;
		this.maxIndex	 = 0;
		this.curPageData  = [];
		this.pageItems	= optn.pageItems 	  || 10;
		this.indexItems   = optn.indexItems   || 10;
		this.onPageChange = optn.onPageChange || function(){};
		this.onDataChange = optn.onDataChange || function(){};
		this.prev 		  = $(optn.prev);
		this.next 		  = $(optn.next);
		
		//this.prev.length &&
			this.prev.live('click', function(){
				self.page({index:self.curPageIndex - 1 });
			} );
		//this.next.length &&
			this.next.live('click', function(){ 
				self.page({index:self.curPageIndex + 1 });
			});
	 }
	 _pager.prototype = {
	 	constructor : _pager,
		page : function  ( index ) {
			// 规整index
			index = index.index;

			// 保证为正
			var max = this.maxIndex - 1;

			if( this.maxIndex == 1 ){
				// 如果最大页数
				this.curPageIndex = 0;
			} else {
				this.curPageIndex = index < 0 ? 
															0 :
														index > max ?
															max :
															index;
			}
			// 计算当前页内容	
			this.curPageData = this.data.slice ( this.curPageIndex * this.pageItems,
																(this.curPageIndex +1 ) * this.pageItems );
			
			"function" === typeof  this.onPageChange && this.onPageChange ( this.curPageData );
		},
		update : function  ( data, page ) {
			this.data = data;
			// 重新计算页数
			this.maxIndex = Math.ceil(this.data.length / this.pageItems); 
			// 保证至少为1
			this.maxIndex = this.maxIndex == 0 ? 1 : this.maxIndex;
			
			this.page ({ index : ( page != undefined ?  page : this.curPageIndex ) });

			"function" === typeof this.onDataChange && this.onDataChange ( this.data );													
		},
		prev : function () {
			this.page({ index : this.curPageIndex - 1 });
		},
		next : function () {
			this.page({ index : this.curPageIndex + 1 });
		},
		del  : function  ( toDel ) {
			var self = this;
			this.update( 
				_.filter ( self.data, function  ( item ) {
					return item.id != toDel.id;
				})
			);
		}
		
	 };
	 window.Pager = function  ( optn ) {
	 	return new _pager ( optn );
	 };
})();
(function(){
	// 提供简易的滚动动画
	function _slider ( optn ) {
		var self = this;
		this.list = List( optn );
		this.$prev = $(optn.prev);
		this.$next = $(optn.next);
		this.animate = false;
		this.$prev.click(function(){
			if(self.list.data.length>1){
				self.update(-1);
			}
		});
		this.$next.click(function(){
			if(self.list.data.length>1){
				self.update(1);
			}
		});
	}
	_slider.prototype = {
		constructor : _slider,
		reset : function( data, cb ){
			this.list.reset( data );
			$.isFunction(cb) && cb();
		},
		update : function ( direct ) {
			var self = this;
			var _temp;
			if ( this.animate ) {
				return;
			};
			this.animate = true;
			var elems = this.list.getContainer()
							.find( this.list.itemSelector );
			if ( direct === 1 ) {
				var le = elems.last (),
				w = le.width() + 30;
				_temp = le.data();
				le.insertBefore ( elems.first() ).data( _temp );
				this.list.getContainer().css ({ "left" : -1*w });
			} else {
				var w = elems.first().width() + 30;
			}
			/* animate */
			var scrollDeleta = ( direct === 1 ) ? 0 : -1 * w ;
			this.list.getContainer()
				.animate({
					"left":scrollDeleta
					},"slow",
					function() {
						if ( direct !== 1){
							var fe = elems.first();
							_temp = fe.data();
							fe.insertAfter ( elems.last() ).data( _temp );
							self.list.getContainer().css ({ "left": 0 } );
						}
						self.animate = false;
					});
		}	
	};
	window.Slider = function( optn ){
		return new _slider( optn );
	};
})();

(function(){
	// 有标题的块
	var defaults = {
		wrapperClass : 'panel_wrapper',
		titleClass   : 'panel_title',
		bodyClass	: 'panel_body',

		title		: 'title',
		container	: 'body',
		initImmediate: true
	};

	function _panel( optn ) {
		// 设置参数
		$.extend( this, defaults, optn );
		this.container = $( this.container );
		
		this.container.data('Panel', this);
		// 是否直接初始化
		this.initImmediate && this.init();
		this.inited = false;
	}
	var fn = _panel.fn = _panel.prototype;

	fn.init = function() {
		this.getContainer().append( this.createItem( this.helper ) );
		this.inited = true;
	};
	// 包装jq的on用以给参数表多传一个参数
	fn.on = function( type,  selector, handle ) {
		var self = this;
		this.getContainer().on( type,  selector, function() {
		 	handle.call( this, e, self);
		});
	};
	fn.createItem= function( helper ) {
		var ret = [];
		ret.push('<div class="'+ this.wrapperClass +'">');
			ret.push('<div class="'+ this.titleClass +'"></div>');
			ret.push('<div class="'+ this.bodyClass +'"></div>');
		ret.push('</div>');
		ret = $( ret.join('') );
		var $title = ret.find( '.'+this.titleClass );
		var $body  = ret.find( '.'+this.bodyClass  );
		// instance method
		this.getTitle = function() { return $title;}
		this.getBody  = function() { return $body; }
		$title.append( this.createTitle() );
		$body .append( this.createBody()  );
		if ( "function" === typeof helper ) { 
			ret = helper( ret );
		}
		return ret;
	};
	// should be implement by user
	fn.createTitle = function() {
		return $('<span>' + this.title + '</span>');
	}
	// should be implement by user
	fn.createBody = function() {
		return $('<span>' + this.body  + '</span>');
	}
	fn.getContainer = function() {
		return $( this.container );
	};

	function Panel ( optn ) {
		// 单元素单实例
		return $(optn.container).data('Panel') || new _panel( optn );
	}
	window.Panel = Panel;
})();

(function($){
    $.pageLinksInit=function(p){
        var html = '';
        var pageFrom = p.current - p.linkstep > 0 ? p.current - p.linkstep : 1;
        var pageTo = p.current + p.linkstep <= p.max ? p.current + p.linkstep : p.max;
        html += '<a id="prevad" href="#" msgplus="PREVIOUSE_PAGE" data-val="-1" class="prev'+ (p.current === 1 ? ' disabled' : '') +'">previous</a>';
        if( pageFrom != 1 ){
            html += '<a href="#" data-val="1">1</a>';
            html += (pageFrom == 2) ? '' : '<span>...</span>';
        }
        for( var i = pageFrom; i <= pageTo; i++ ){
            html += i == p.current ? '<strong data-val="'+ i +'">' + i + '</strong>' : '<a href="#" data-val="'+ i +'">'+ i +'</a>';
        }
        if( pageTo != p.max ){
            html += (pageTo + 1 == p.max) ? '' : '<span>...</span>';
            html += '<a href="#" data-val="'+ p.max +'">'+ p.max +'</a>';
        }
        html += '<a id="nextad" href="#" msgplus="NEXT_PAGE" data-val="+1" class="next'+ (p.current === p.max ? ' disabled' : '') +'">next</a>';
        return html;
    };
    $.fn.page=function(settings,p){
        var options = $.extend({
            pageLinkFun:function(){}
        },settings||{});
        return this.each(function(){
            var $this = $(this);
            var pageLinks = $("<div class=\"pageLinks\"></div>");            
            if(p.max==0) return;
            pageLinks.append($.pageLinksInit(p));
            pageLinks.on("click","a",function(){
                var $this = $(this);
                var dataVal = $this.attr("data-val");
                var page;
                if($this.is(".disabled")) return false;
                if(dataVal=="-1") {
                    page = (p.current - 1);
                }else if(dataVal=="+1") {
                    page = (p.current + 1);
                }else{
                    page = Number(dataVal);
                }
                if(typeof options.pageLinkFun=="function") options.pageLinkFun(page);
                return false;
            });
            $this.append(pageLinks);
            $("#prevad").text(getI18N('PREVIOUSE_PAGE'));
            $("#nextad").text(getI18N('NEXT_PAGE'));
        });
    };
})(jQuery);

