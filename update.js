/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
(function(){
	var urlParams = {};
	var debug=2;
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();

	

var ifupdate_url=location.href.slice(0,29)=="http://www.douban.com/update/";
var voice_img = chrome.extension.getURL("images/ico-voice.gif");
var test_wav = chrome.extension.getURL("test.wav");
var worker_src=chrome.extension.getURL("worker.js");
//这是一个全局变量，用来防止用户多次重复按下录音按钮的一个小东西
var reverse_clock=null;
var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
	// HTML5 voice record demo
	//http://jsfiddle.net/DerekL/JV996/
	//以后可能也需要deffered化这一段代码，返回的无非就是一段BASE64的东西就可以了
	doRecord=function(){
    var obj = {}, txt="";
        obj = {
            video: false,
            audio: true
        };
        txt = "<audio controls autoplay>";
    if (reverse_clock===null) {
    navigator.webkitGetUserMedia(obj, function(stream) {
        $("#voice-result").empty();       
        stream.onended=function(){
        	console.log("Hi...I am end");
        	console.log(stream);
        	var output = $(txt).appendTo("#voice-result")[0];
        }
        //设置一个倒计时
        $("#voice-result").after("<span id='voice-clock'>14</span>");
        var clock=$('#voice-clock');
        reverse_clock=setInterval(function(){
        	var time=parseInt(clock.html());
        	clock.html(time-1)
        },1000);
        //14秒钟后停止倒计时，并REMOVE钟表元素
        //todo:可以在14秒后把录音按钮写成重录...另外在录音未完结前，不显示上传按钮
        //另外考虑一下用户有可能会重复上传时的逻辑
        setTimeout(function(){        	
        	stream.stop();
        	clearInterval(reverse_clock);
        	clock.remove();
        	reverse_clock=null;
        	$(".bn-upload").show();
        },2000);
    }, function(err) {
        console.log(err);
        err.code == 1 && (alert("可以再次点击录音，直到你想好了为止"))
    });
	}//end of if of reverse_clock 
	},
	//用FileReader将任何BLOB对象转换成BASE64编码
	//loadBlobToBase64(xhr.response).then(function(base64){});
	loadBlobToBase64=function(blob){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		var reader = new FileReader();
		reader.onload = function() {
			  deferred.resolve(reader.result);
        }
       	reader.readAsDataURL(blob);
       	return promise;
	},
	renderUploader=function(){
			var li=$("#voice-name");
			var p = "<p width='300px' class='loader'></p>";
			li.after(p);
		//有两个功能性的BUG
		//1、第二次点击上传后，会重复加载的问题。。这个得改，换成HTML()方法也许可以
		//2、识别输入框，加入锚记的功能，另外也许还得搞定字数的问题
		var options={responseType:'blob',uri:test_wav};
		xhr2(options).then(function(xhr){

			loadBlobToBase64(xhr.response).then(function(base64){
				var dom=$('.loader');
	        		var src=" src='"+base64+"' ";
					var audio_tag="<audio autoplay controls "+ 
										src+
										//"id=audio_"+
										//Statue.data_sid+
										">";
					dom.html(audio_tag);
			      	//console.log(reader.result);
			    var text_obj=$('#isay-cont');
			    var text_label=$('#isay-label');
			    var label=text_label.html();
			    if (label==='说点什么吧...') {
			    //为空的情况下，清空LABLE，并加入自定义字体的标签
			    	text_label.html('');
			    	text_obj.text("؆");
			    }else{
			    //已经有内容了,则仅仅加入特殊字符标记
			    	console.log("saying is not null");
			    	var text=text_obj.text();
			    	text_obj.text(text+"؆");	
			    }
			    console.log("saying is not null?????"+label);			    
			});        		
				
		}, function(){
				console.log("error");
		});				

	},
	redirectToNote=function(){
		location.href="http://www.douban.com/note/create/?voice=true";
	},
	renderActField=function(){
		var field="<div class='field'>";
		var bd="<div class='bd'>";		
		var cancel_btn="<a href='javascript:void(0);' class='bn-x isay-cancel'>×</a>";
		var input="<input type='text' id='isay-inp-url'"+ 
	     		   "value='http://www.baidu.com' class='url' name='url'"+ 
	     		   "autocomplete='off' goog_input_chext='chext'>";
		var span_btn="<span class='bn-flat'>"+
						"<input type='button' value='录音'"+
						"class='bn-record'></span>";
		var upload_btn="<span class='bn-flat'>"+
				"<input type='button' value='上传'"+
				"class='bn-upload'></span>";
		var test="<input type='file' accept='audio/*;capture=microphone'>";
		var end_div="</div>";
		var result="<span id='voice-result'></span>";
		var name="<span id='voice-name'><p><div></div></p></span>​";
		var final_html=field+
						  bd+
		                    result+
		                    name+
		                   // test+
		                   cancel_btn+
		                    span_btn+upload_btn+
		                   end_div+
		               end_div;
		$("#isay-act-field").html(final_html);
		//$("#isay-act-field").show();
		$("#isay-act-field .field").show();
		//默认不显示上传
		$(".bn-upload").hide();
		//取消录音
		$("#isay-act-field .isay-cancel").click(function(){
				$("#isay-act-field .field").hide();
		});
		//录音	
		$("#isay-act-field .bn-record").click(function(){
						doRecord();
		});
		//上传	
		$("#isay-act-field .bn-upload").click(function(){
						//renderUploader();
						redirectToNote();
		});	
				
	},
	xhr2=function(options){
		var that=this;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
        var xhr = new XMLHttpRequest(),
            method = options.method || 'get';
        xhr.responseType = options.responseType ||'blob';   

		xhr.onload = function() {
			deferred.resolve(xhr);
		};

        xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }
    
        xhr.open(method, options.uri);
        xhr.send();
    
        //xhr.send((options.data) ? urlstringify(options.data) : null);

		return promise;
	},
	//有则读缓存，无则取数据并存入当地
	//以后可以把这里的逻辑用WEBSQL来搞定，毕竟可以无限使用空间
	getFile=function(id){
		var id=id || 'dbVoice_test';
		var base64File=undefined;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		if(localStorage.hasOwnProperty(id)){
			base64File=localStorage[id];
			deferred.resolve(base64File);
		}else{
			var options=undefined;
			//for debug			
			if (id==='dbVoice_test') {
				options={responseType:'blob',uri:test_wav};
			}else{
				//以后的URI就可以取实际的远程地址了
				options={responseType:'blob',uri:test_wav};
			}
			xhr2(options).then(function(xhr){
				loadBlobToBase64(xhr.response).then(function(base64){
					localStorage.setItem(id, base64);
					base64File=base64;
					deferred.resolve(base64File);
				});
			});
		}
		return promise;
	},
	renderPlayer=function(dom,base64File){
			var src=" src='"+base64File+"' ";
			var audio_tag="<audio autoplay controls "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.after(audio_tag);
	},
	// Example:
	// getFileFromNote().then(function(xhr){
	// 		console.log(xhr.response);
	// });
	getFileFromNote=function(){
		var note='http://www.douban.com/note/225350522/';
		var options={responseType:'document',uri:note};
		var that=this;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
        var xhr = new XMLHttpRequest(),
            method = options.method || 'get';
        xhr.responseType = options.responseType ||'document';   

		xhr.onload = function() {
			deferred.resolve(xhr);
		};

        xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }
    
        xhr.open(method, options.uri);
        xhr.send();
    
        //xhr.send((options.data) ? urlstringify(options.data) : null);

		return promise;
	},
	initPlayer=function(){
		var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};

		var need_save_kind={1026:"相册推荐",1013:"推荐小组话题",1015:"推荐/新日记",1012:"推荐书评",3065:"东西",1025:"推荐相片"}

		$("div.status-item").each(function(){
			var myself=$(this);
				//优先判断是否为值得存取的类型
				//【存入数据库】类型
				var data_kind=myself.attr("data-object-kind");
				//【存入数据库】数据行为
				var data_action=myself.attr("data-action");
					if(debug==1){console.log("Action:"+data_action);}
			//============================================
				//打印人性化的提示信息
				var action=datatypehash[data_kind]===undefined?data_kind:datatypehash[data_kind];
					if(debug==1){console.log("Kind:"+action);}		
				//【数据库KEY】SID
				var data_sid=myself.attr("data-sid");
					if(debug==1){console.log("ID:"+data_sid);}
				//用户地址
				var user_url=myself.find("div.bd p.text a:first").attr("href");
					if(debug==1){console.log("user_url:"+user_url);}		
				//用户的昵称
				var user_name=myself.find("div.bd p.text a:first").html();
					if(debug==1){console.log("user_name:"+user_name);}
				//用户的发言
				var user_quote=myself.find("div.bd blockquote p").html();
					if(debug==1){console.log("user_quote:"+user_quote);}
				//【存入数据库】用户的唯一ID
				var user_uid=user_url.slice(29,-1);
					if(debug==1){console.log("user_uid:"+user_uid);}
				//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
				var data_object=myself.find("div.bd p.text a:eq(1)").attr("href");
					if(debug==1){console.log("行为对象:"+data_object);}
				//【存入数据库】行为对象的描述
				var data_description=myself.find("div.bd p.text a:eq(1)").html();
					if(debug==1){console.log("行为对象:"+data_description);}
				//【存入数据库？】时间对象？
				var time=myself.find("div.actions span.created_at").attr("title");
					if(debug==1){console.log("Time:"+time);}
				//生成一个全局对象ID的URL并存入数据库
				var uid_url=user_url+"status/"+data_sid;

				var Statue={};
					Statue.action=action;
					Statue.data_sid=data_sid;
					Statue.user_url=user_url;
					Statue.user_name=user_name;
					Statue.user_quote=user_quote;
					Statue.user_uid=user_uid;
					Statue.data_object=data_object;
					Statue.data_description=data_description;
					Statue.time=time;
					Statue.uid_url=uid_url;
			//to render player? or not
			if(Statue.user_quote!=null){
			  var ifPlayer=(Statue.user_quote.indexOf("؆")===-1)?false:true;
				if(ifPlayer){
					console.log("ifPlayer holder?"+ifPlayer);
					var user_quote_obj=myself.find("div.bd blockquote p");
					getFile().then(function(base64File){
						renderPlayer(user_quote_obj,base64File);
					});						
				}
			}//end of not user quote null
		//===========================================
		});//end of each itor
	},
	initVoiceAction=function(){
		//<a href="javascript:void(0);" tabindex="2" data-action="topic" 
		//class="ico ico-topic" title="添加话题">话题</a>
		var topic=$(".ico-topic");
			topic.after("<a href='javascript:void(0);' tabindex='4'"+
						"class='ico ico-voice' data-action='voice' "+
						"style='background:"+ 
						       "url("+voice_img+") "+
								"no-repeat 0 0;'"+
					    "title='添加语音'>语音</a>");
			var voice_btn=$(".ico-voice");

			voice_btn.bind("click",function(event){
				console.log("Voice Btn clicked");
				renderActField();
			});
			//对文件上传的两个小HACKS，一个是改变了我说未弹出前的右边距
			//这是两个HACKS，针对我们加入了自己的按钮后改变了人家原有的流程
			var file_uploder=$("#isay-upload");
				file_uploder.css({right: '72px'});
			//监听BTN-GROUP，如果长度改变了，说明db-isay展开了，加上处理的流程
			//即将右边距设置成120PX
			var btn_group=$('.btn-group');
			btn_group.bind('DOMSubtreeModified', function() {
 					var file_uploder=$("#isay-upload");
						file_uploder.css({right: '120px'});
    		
			});		
	},
	//理应被废止的函数，准备移除
	renderUploadIframe=function(dom){
		//http://www.douban.com/note/create
		var src="'http://www.douban.com/note/create'";
		var iframe="<iframe width='200px' height='200px' "+ 
							"src="+src+
							" >";
			dom.after(iframe);

	},
	initUpdateView = function (){
			initVoiceAction();
			initPlayer();
			//var user_quote_obj=$("h1:first");
			//renderUploadIframe(user_quote_obj);

			// getFileFromNote().then(function(xhr){
			// 		var body=xhr.response;
			// 		var note = $(".note:eq(1)", body);
			// 		var audio_src=note.html();
			// 		var user_quote_obj=$("h1:first");
			// 		//renderPlayer(user_quote_obj,audio_src);
			// 		renderUploadIframe(user_quote_obj);
			// });
	},
	//getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
	//	.then(function(xhr){
	//得到某个文件的串列
	getArrayBuffer=function(url){
		var resourceUrl = url || "http://img1.douban.com/pics/nav/lg_main_a10.png";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', resourceUrl, true);

	    // Response type arraybuffer - XMLHttpRequest 2
	    xhr.responseType = 'arraybuffer';
	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };
	    xhr.send();
	    return promise;
	},
	//送入一个文件URL，得到串列，上传至豆瓣的POST接口，得到返回的值
	//然后对返回值进行计算，得到RAW DATA的图像地址
	//调用了getArrayBuffer以及uploadImg
	upload_xhr2=function(){
		getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
		.then(function(xhr){
			//arrayBuffer
			uploadImg(xhr.response).then(function(xhr){
				var img=JSON.parse(xhr.responseText);
				//console.log(img);
				//http://img3.douban.com/view/status/small/public/39bf2861338e7cc.jpg
				//img.url
				var rawImg=getRawUrl(img.url);
			});
		});
	},
	//从文件最后四位得到该图像文件的大小信息
	//EXAMPLE:
	// var size=getHideFileSizeMeta(new_TypedArray.buffer.byteLength-4,new_TypedArray.buffer);		
	// console.log(size);
	getHideFileSizeMeta=function(offset,arrayBuffer){
		var dataview = new DataView(arrayBuffer);	
		var img_length= dataview.getUint32(offset);
		return img_length;
	},
	setHideFileSizeMeta=function(offset,arrayBuffer,size){
		var dataview = new DataView(arrayBuffer);
			dataview.setUint32(offset,size); 
	}
	//http://stackoverflow.com/questions/10786128/appending-arraybuffers
	//将两个buffer合并的函数
	//EXAMPLE:
	// getArrayBuffer(test_wav).then(function(wav_buffer){
	// 	getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png").then(function(img_buffer){
	// 		//记录一下图像的大小以供SLICE
	// 		var new_TypedArray=appendBuffer_and_fileSizeMeta(img_buffer.response,wav_buffer.response);
	appendBuffer_and_fileSizeMeta=function ( buffer1, buffer2 ) {
  		var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength + 4);
  			tmp.set( new Uint8Array( buffer1 ), 0 );
  			tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
  			//将图像文件的大小，即偏移量信息，写入最后四位，这样以后就可以方便解析
  			var offset=buffer1.byteLength + buffer2.byteLength,
  				imgSize=buffer1.byteLength;
  				setHideFileSizeMeta(offset,tmp.buffer,imgSize);
		//返回一个Typed Array，而不是一个ArrayBuffer
  		return tmp;
	},
	//简单替换字符串得到实际的RAW地址
	//EXAMPLE:
	// var rawImg=getRawUrl("http://img3.douban.com/view/status/small/public/39bf2861338e7cc.jpg");
	// 		console.log(rawImg);
	getRawUrl=function(smallUrl){
		//TODO:consider img1???
		var img_url=smallUrl;
		var new_url=img_url.replace('http://img3.douban.com/view/status/small/public/','http://img3.douban.com/view/status/raw/public/');
		return new_url;
	},
	//EXAMPLE:
	//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// var blob = new Blob([new_TypedArray.buffer], { type: "image/png" });
	// var url = window.webkitURL.createObjectURL(blob);
	// var h1=$("h1:first");
	// 	renderImg(h1,url);
	renderImg=function(dom,base64File){
		var src=" src='"+base64File+"' ";
			var img_tag="<img "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.after(img_tag);

	},
	//Return a buffer object
	//EXAMPLE:
	// var wav_blob=new Blob([splitWavFromImage(new_TypedArray.buffer)],{type:"audio/wav"});
	// var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	splitWavFromImage=function(arraybuffer){
		var size=getHideFileSizeMeta(arraybuffer.byteLength-4,arraybuffer);
		var wav_buffer=	arraybuffer.slice(size,arraybuffer.byteLength-4);
		return wav_buffer;
	},
	//异步得将两种数据柔和在一起，并返回
	//
	//EXAMPLE:
	// hideDataIntoImage().then(function(new_buffer){
	// 		//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// 		var blob = new Blob([new_buffer], { type: "image/png" });
	// 		var url = window.webkitURL.createObjectURL(blob);
	// 		var h1=$("h1:first");
	// 			renderImg(h1,url);
	// 		var wav_blob=new Blob([splitWavFromImage(new_buffer)],{type:"audio/wav"});
	// 		var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	// 	});
	hideDataIntoImage=function(){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		getArrayBuffer(test_wav).then(function(wav_buffer){
			getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png").then(function(img_buffer){
				var new_TypedArray=appendBuffer_and_fileSizeMeta(img_buffer.response,wav_buffer.response);
				deferred.resolve(new_TypedArray.buffer);

			});
		});
		return promise;
	},
	//hideDataIntoImage的测试？或者说是EXAMPLE都可以
	testDataHided=function(){
		hideDataIntoImage().then(function(new_buffer){
			//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
			var blob = new Blob([new_buffer], { type: "image/png" });
			var url = window.webkitURL.createObjectURL(blob);
			var h1=$("h1:first");
				renderImg(h1,url);
			var wav_blob=new Blob([splitWavFromImage(new_buffer)],{type:"audio/wav"});
			var wav_url=window.webkitURL.createObjectURL(wav_blob);
				renderPlayer(h1,wav_url);
		});
	},
	//依靠图像来走上传之路的原型，主要就是个流程
	uploadToImgServer=function(){
		//混合已知数据
		hideDataIntoImage().then(function(new_buffer){
			//将混合数据上传到服务器
			uploadImg(new_buffer).then(function(xhr){
					var img=JSON.parse(xhr.responseText);
					var rawImg=getRawUrl(img.url);
				});

		});
		//分解出WAV数据，并存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
	},
	//依靠日记来保存数据的原型
	uploadToNoteServer=function(){
		//将WAV数据存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
		//redirectTo createNote.js
	},
	//依靠自己的服务器来保存数据的原型
	uploadToSinaServer=function(){
		//将WAV数据存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
		//xhr2到新浪的特定服务上，POST一段BASE64过的数据即可
		//关键是缓存以及，防止重复提交的逻辑要写好
	},
	//上传至豆瓣，使用了自定义的方式来组建FORM。。。
	//
	uploadImg=function (arrayBuffer) {
// Request URL:http://www.douban.com/j/upload
// Request Method:POST
// Status Code:200 OK
// Request Headersview source
// Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8
// Accept-Charset:UTF-8,*;q=0.5
// Accept-Encoding:gzip,deflate,sdch
// Accept-Language:zh-CN,zh;q=0.8
// Cache-Control:max-age=0
// Connection:keep-alive
// Content-Length:149884
// Content-Type:multipart/form-data; boundary=----WebKitFormBoundary5US7mCZXN7ecSiNt
// Cookie:bid="UxnM1mg/5v0"; dbcl2="55895127:HF2B9NoPKEI"; ct=y; ck="HwkQ"; __utma=30149280.2077510121.1342357707.1342357707.1342401260.2; __utmb=30149280.298.10.1342401260; __utmc=30149280; __utmz=30149280.1342357707.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=30149280.5589
// Host:www.douban.com
// Origin:http://www.douban.com
// Referer:http://www.douban.com/update/
// User-Agent:Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
// Request Payload
// ------WebKitFormBoundary5US7mCZXN7ecSiNt
// Content-Disposition: form-data; name="ck"
// HwkQ
// ------WebKitFormBoundary5US7mCZXN7ecSiNt
// Content-Disposition: form-data; name="image"; filename="hideData.png"
// Content-Type: image/png
// ------WebKitFormBoundary5US7mCZXN7ecSiNt--
	    var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");

	    var fd = new FormData();
		    //先传递钥匙过去
		    fd.append('ck', ck);
		    //再传递一个name=image的arrayBuffer过去
		    fd.append('image', arrayBuffer);
	    xhr.open('POST', 'http://www.douban.com/j/upload', true);

	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

	    // Transmit the form to the server
	    xhr.send(fd);

	    return promise;
	    //http://img3.douban.com/view/status/small/public/2e9e707ab7aee90.jpg
	    //http://img3.douban.com/view/status/raw/public/2e9e707ab7aee90.jpg
	},
	//取得相关的文件信息，以及经过BASE64编码后的信息后，上传到服务器
	//TODO:
	//1、这里需要考虑的比较多，我决定先使用LOCALSTORAGE来模拟
	//2、这样同时也可以在本地加入缓存逻辑，如果有，则直接取LOCALSTORAGE，然后渲染就可以
	//3、重复上传的逻辑？如果两次录音不同，则抹掉，这倒是比较简单....
	//4、不过这里也出现了一个逻辑上的意味，即，如果上一次录音与这一次录音的HASH值完全相同
	//	 则可以用这种方式来避免同一条广播被重复提交
	uploadFile = function (id,base64) {
		var id=id || 'dbVoice_test';
		var base64File=undefined;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		//如果有缓存则首先更新缓存
		if(localStorage.hasOwnProperty(id)){
			localStorage[id]=base64;
			deferred.resolve(true);
		}
		//然后需要构造一个XHR2对象并上传
		return promise;
	},
	deleteNewStatu=function(ck,data_sid){
		var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();

	    var fd = new FormData();    
			fd.append('sid', data_sid);
	    	fd.append('ck', ck);

	    xhr.open('POST', 'http://www.douban.com/j/status/delete', true);

	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

	    // Transmit the form to the server
	    xhr.send(fd);
	    return promise;

	},
	scanNewNote=function(){
		//构造并找到新的日记的ID
		var debug=1;
		var temp_note_id=localStorage["temp_note_id"];
		var new_note_url="http://www.douban.com/note/"+temp_note_id+"/";
		var ref=$("a[href='"+new_note_url+"']");
		var statu=ref.parent().parent().parent().parent();
		var data_kind=statu.attr("data-object-kind");
		var data_sid=statu.attr("data-sid");
		var ck=$("input[name='ck']").attr("value");
		if(debug===1){
			console.log(ck);
			console.log(data_sid);
		}
		//如果不为undefined则开始删除工作
		if (data_sid!=undefined) {
			deleteNewStatu(ck,data_sid).then(function(xhr){
					console.log(xhr);
			},function(e){
					console.log(e);
			});

		};
		//var del=ref.parent().parent().find(".btn-action-reply-delete");
		

		//todo:找到日记，得到SID，构造FORM DATA，执行删除
		//并执行HIDE...（因为没有刷新什么的，必须我来手动执行隐藏）
		//del.trigger('click')
		// Request URL:http://www.douban.com/j/status/delete
		// Request Method:POST
		// Status Code:200 OK
		// Request Headersview source
		// Accept:text/plain, *; q=0.01
		// Accept-Charset:UTF-8,*;q=0.5
		// Accept-Encoding:gzip,deflate,sdch
		// Accept-Language:zh-CN,zh;q=0.8
		// Connection:keep-alive
		// Content-Length:21
		// Content-Type:application/x-www-form-urlencoded
		// Cookie:bid="UxnM1mg/5v0"; dbcl2="55895127:HF2B9NoPKEI"; ck="HwkQ"; ct=y; __utma=30149280.2077510121.1342357707.1342357707.1342357707.1; __utmb=30149280.458.10.1342357707; __utmc=30149280; __utmz=30149280.1342357707.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=30149280.5589
		// Host:www.douban.com
		// Origin:http://www.douban.com
		// Referer:http://www.douban.com/update/?p=2
		// User-Agent:Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
		// X-Requested-With:XMLHttpRequest
		// Form Dataview URL encoded
		// sid:969282745
		// ck:HwkQ

	},
	//用来测试以及调试的函数
	testDeletePostInterFace=function(){
		var data_sid='931234';
		var ck='HwkQ';
			deleteNewStatu(ck,data_sid).then(function(xhr){
					console.log(xhr);
			},function(e){
					console.log(e);
			});
		});
	},
	router = function (){
		if(ifupdate_url){
			initUpdateView();
			//scanNewNote();
			//testDeletePostInterFace();
		

		}//fiupdate_url end	
	}
	router();
 
} )();