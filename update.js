/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
 
(function(){
	var urlParams = {};
	var debug=1;
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();

var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
	//如果转到了自己给自己写邮件的页面则
	//可以插入一个遮罩层，然后让用户察觉不到存储的过程，待搞定后再转回
	//主界面，然后可以用spin.js来搞定AJAX效果什么的
	redirecttoDouMail = function(){
			var username=getUserName();
				if(debug===1){console.log("username:"+username);}
				setTimeout(function(){
					location.href="http://www.douban.com/doumail/write?to="+username+"&savebyme=true";
				},1000);

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
		var field="<div class='field'>";
		var bd="<div class='bd'>";		
		var cancel_btn="<a href='javascript:void(0);' class='bn-x isay-cancel'>×</a>";
		var input="<input type='text' id='isay-inp-url'"+ 
	     		   "value='http://www.baidu.com' class='url' name='url'"+ 
	     		   "autocomplete='off' goog_input_chext='chext'>";
		var span_btn="<span class='bn-flat'>"+
						"<input type='button' value='录音'"+
						"class='bn-record'></span>";
		var end_div="</div>";
		var result="<span id='voice-result'></span>";
		var name="<span id='voice-name'></span>​";
		var final_html=field+
						  bd+
		                    result+
		                    name+
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
	},
	initUpdateView = function (){
			var topic=$(".ico-topic");
			topic.after("<a data-action='voice' "+
						"	style='width: auto;"+
						"	text-indent: 0;"+
						"	padding-left: 20px;"+
						"	background: url(http://img3.douban.com/pics/isay-icos.gif) "+
						"				no-repeat 0 0;"+
						"	display: inline-block;"+
						"	height: 20px;overflow: hidden;"+
						"	line-height: 20px;"+
						"	color: #888;"+
						"	font-family: stheiti,tahoma,simsun,sans-serif;"+
						"	margin-right: 15px;' "+
						"	class='ico-voice' "+
							"title='添加语音'>语音</a>");
			var voice_btn=$(".ico-voice");
			voice_btn.bind("click",function(event){
				console.log("Voice Btn clicked");
				renderActField();
			});			
	},
	getStatuData = function(objStatu){
				//优先判断是否为值得存取的类型
				//【存入数据库】类型
				var data_kind=objStatu.attr("data-object-kind");
				//【存入数据库】数据行为
				var data_action=objStatu.attr("data-action");
					if(debug==1){console.log("Action:"+data_action);}
			//============================================
				//打印人性化的提示信息
				var action=datatypehash[data_kind]===undefined?data_kind:datatypehash[data_kind];
					if(debug==1){console.log("Kind:"+action);}		
				//【数据库KEY】SID
				var data_sid=objStatu.attr("data-sid");
					if(debug==1){console.log("ID:"+data_sid);}
				//用户地址
				var user_url=objStatu.find("div.bd p.text a:first").attr("href");
					if(debug==1){console.log("user_url:"+user_url);}		
				//用户的昵称
				var user_name=objStatu.find("div.bd p.text a:first").html();
					if(debug==1){console.log("user_name:"+user_name);}
				//用户的发言
				var user_quote=objStatu.find("div.bd blockquote p").html();
					if(debug==1){console.log("user_quote:"+user_quote);}
				//【存入数据库】用户的唯一ID
				var user_uid=user_url.slice(29,-1);
					if(debug==1){console.log("user_uid:"+user_uid);}
				//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
				var data_object=objStatu.find("div.bd p.text a:eq(1)").attr("href");
					if(debug==1){console.log("行为对象:"+data_object);}
				//【存入数据库】行为对象的描述
				var data_description=objStatu.find("div.bd p.text a:eq(1)").html();
					if(debug==1){console.log("行为对象:"+data_description);}
				//【存入数据库？】时间对象？
				var time=objStatu.find("div.actions span.created_at").attr("title");
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

				return Statue;

	},
	addVoiceBtn = function (){
		//在Action条下运行的，收藏按钮
		btn_tag_it=$("a.btn-tag-it");

		btn_tag_it.bind("click",function(event){
				
				var myself=$(this).parent().parent().parent().parent();
				var oneStatue=getStatuData(myself);
					if(debug==1){console.log("用户发言:"+oneStatue.user_quote);}
				savetoDB(oneStatue);			
				
		});//End of 收藏 LocalStorage				
	},
	router = function (){
		if(location.href==='http://www.douban.com/update/'){
			initUpdateView();
		}	
	}

	router();
 
} )();