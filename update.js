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
var voice_img = chrome.extension.getURL("ico-voice.gif");
var test_audio = chrome.extension.getURL("test.mp3");
var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
// HTML5 voice record demo
//http://jsfiddle.net/DerekL/JV996/
	doRecord=function(){
    var obj = {}, txt="";
        obj = {
            video: false,
            audio: true
        };
        txt = "<audio>";
    navigator.webkitGetUserMedia(obj, function(stream) {
        $("#voice-result").empty();
        var output = $(txt).appendTo("#voice-result")[0],
            source = window.webkitURL.createObjectURL(stream);
        output.autoplay = true;
        output.src = source;
        console.log(stream);
        window.a = stream; //debug
        $("span#voice-name").html("Mic name: <b>" + stream.audioTracks[0].label + "</b>");
    }, function(err) {
        console.log(err);
        err.code == 1 && (alert("You can click the button again anytime to enable."))
    });
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
		var test="<input type='file' accept='audio/*;capture=microphone'>";
		var end_div="</div>";
		var result="<span id='voice-result'></span>";
		var name="<span id='voice-name'></span>​";
		var final_html=field+
						  bd+
		                    result+
		                    name+
		                   // test+
		                   cancel_btn+
		                    span_btn+
		                   end_div+
		               end_div;
		$("#isay-act-field").html(final_html);
		//$("#isay-act-field").show();
		$("#isay-act-field .field").show();
		//取消录音
		$("#isay-act-field .isay-cancel").click(function(){
				//$("#isay-act-field").hide();
				$("#isay-act-field .field").hide();
		});
		//录音	
		$("#isay-act-field .bn-record").click(function(){
				//$("#isay-act-field").hide();
						doRecord();
		});	
				// <div id="isay-act-field">
  // 			<div class="field">
  //   		<div class="bd">
	 //    		<input type="text" id="isay-inp-url" 
	 //    		value="http://" class="url" name="url" 
	 //    		autocomplete="off" goog_input_chext="chext">

	 //    		<span class="bn-flat">
	 //    			<input type="button" value="添加" class="bn-preview">
	 //    		</span>
  //   		</div>
  //   	<a href="javascript:void(0);" class="bn-x isay-cancel">×</a>
  // 			</div>
		// </div>

// HTML5 voice record demo
//http://jsfiddle.net/DerekL/JV996/
// <span id="result"></span><br>
// <button id="video">Record video</button> <button id="sound">Record sound</button><br>
// <span id="name"></span>​
	},
	initVoiceAction=function(){
		var topic=$(".ico-topic");
			topic.after("<a class='ico ico-voice' data-action='voice' "+
						"style='background:"+ 
						       "url("+voice_img+") "+
								"no-repeat 0 0;'"+
					    "title='添加语音'>语音</a>");
			var voice_btn=$(".ico-voice");
			voice_btn.bind("click",function(event){
				console.log("Voice Btn clicked");
				renderActField();
			});			
	},
	save_to_fs=function(blob){
		var blob=blob;
		var fs_url=undefined;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		window.URL = window.URL || window.webkitURL;


		function fs_errorHandler (e){
		var msg = '';
		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };
		  console.log('Error: ' + msg);
		  deferred.reject(msg);
		}
		function onInitFs(fs) {
  			console.log('Opened file system: ' + fs.name);
			fs.root.getFile('test.mp3', {create: true}, function(fileEntry) {
		    // Create a FileWriter object for our FileEntry (test.mp3).
		    fileEntry.createWriter(function(fileWriter) {

		      fileWriter.onwriteend = function(e) {
		        console.log('Write completed.');
		        var fs_url=fileEntry.toURL();
		        deferred.resolve(fs_url);
		      };
		      fileWriter.onerror = function(e) {
		        console.log('Write failed: ' + e.toString());
		        deferred.reject(e.toString());
		      };
		      // Create a new Blob and write it to log.txt.
		      fileWriter.write(blob);

    		}, fs_errorHandler);//end of createWriter
  		}, fs_errorHandler);//end of get root
		}//end of onInitFs

		window.requestFileSystem(window.TEMPORARY, 1024*1024 , onInitFs, fs_errorHandler);
		
		return promise;
	},
	xhr2=function(options){
		//xhr2({responseType:'blob',uri:test_audio});
		// var xhr = new XMLHttpRequest();
		// 				xhr.responseType = 'blob';
		// 				xhr.onload = function() {
		// 				    // xhr.response is a Blob
		// 				    var url = webkitURL.createObjectURL(xhr.response);
		// 				    console.log('Blob URL: ', url);
		// 				    //SOMETHING NEED? A DEFFER???
		// 				    var fs_url=save_to_fs(xhr.response);
		// 				    console.log('FS URL: ', fs_url);
		// 			    	return dfd.promise();
		// 				};
		// 				xhr.open('GET', test_audio);
		// 				xhr.send();
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
	renderPlayer=function(dom,blob_url){
		var options={responseType:'blob',uri:blob_url};			
		xhr2(options).then(function(xhr){
				var url = webkitURL.createObjectURL(xhr.response);
				console.log('Blob URL: ', url);
				console.log("blob success");
				save_to_fs(xhr.response).then(function(fs_url){
						console.log('fs URL: ', fs_url);
						console.log("fs success");
					var src=" src='"+fs_url+"' ";
					var audio_tag="<audio autoplay controls "+ 
									src+
									//"id=audio_"+
									//Statue.data_sid+
									">";
					dom.html(audio_tag);
				},function(){
						console.log("fs error");
				});
		}, function(){
				console.log("error");
		});	
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
					renderPlayer(user_quote_obj,test_audio);			
				}
			}//end of not user quote null
		//===========================================
		});//end of each itor
	},
	initUpdateView = function (){
			initVoiceAction();
			initPlayer();
	},
	router = function (){
		if(ifupdate_url){
			initUpdateView();
		}	
	}

	router();
 
} )();