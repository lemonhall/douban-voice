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
//这是一个在此模块内的全局变量
var reverse_clock=null;
var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
	renderIsayTextArea=function(){
		var text_obj=$('#isay-cont');
		var text_label=$('#isay-label');
		var label=text_label.html();
			 if (label==='说点什么吧...') {
			    //为空的情况下，清空LABLE，并加入自定义字体的标签
			    	text_label.html('');
			    	text_obj.val("؆");
			    }else{
			    //已经有内容了,则仅仅加入特殊字符标记
			    	console.log("saying is not null");
			    	var text=text_obj.val();
			    	text_obj.val(text+"؆");	
			    }	
	},
	onRecordSuccess=function(myself,stream){
		var myself=myself||$("#isay-act-field .bn-record");		
		var txt = "<audio controls autoplay>";
		console.log("Hi...I am end");
        console.log(stream);
        	var output = $(txt).appendTo("#voice-result")[0];
        		myself.prop('disabled', false);

        	var options={responseType:'blob',uri:test_wav};
				xhr2(options)
					.then(function(xhr){
				loadBlobToBase64(xhr.response)
					.then(function(base64){
        				var saveToLocal=save.savToSina.saveToLocal;
			    		saveToLocal(base64);
			    		renderIsayTextArea();
			    	});
				});
		myself.prop('value', "重录");
	},
	renderClock=function(myself,stream){
		//保存录音的按钮
		var myself=myself||$("#isay-act-field .bn-record");
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
        	myself.prop('disabled', false);

        },2000);

	},
	// HTML5 voice record demo
	//http://jsfiddle.net/DerekL/JV996/
	//以后可能也需要deffered化这一段代码，返回的无非就是一段BASE64的东西就可以了
	doRecord=function(myself){
		//保存录音的按钮
		var myself=myself||$("#isay-act-field .bn-record");
	    var opt = {}, txt="";
	        opt = {video: false,audio: true};        
		    if (reverse_clock===null) {
			    navigator.webkitGetUserMedia(opt, function(stream) {
			        $("#voice-result").empty();

			        //成功获取到录音片段
			        stream.onended=function(){
			        	onRecordSuccess(myself,stream);
			        }

			        renderClock(myself,stream);
		        
			    }, function(err) {
			    	myself.prop('disabled', false);
			        console.log(err);
			        err.code == 1 && (alert("可以再次点击录音，直到你想好了为止"))
			    });
			}//end of if of reverse_clock 
	},
	renderActField=function(){
		var field="<div class='field'>",
			bd="<div class='bd'>",		
			cancel_btn="<a href='javascript:void(0);' class='bn-x isay-cancel'>×</a>",
			span_btn="<span class='bn-flat'>"+
							"<input type='button' value='录音'"+
							"class='bn-record'></span>",
			end_div="</div>",
			result="<span id='voice-result'></span>",
			name="<span id='voice-name'><p><div></div></p></span>​",
			final_html=field+bd+
							result+name+
								cancel_btn+
		                    span_btn+
		                   end_div+end_div;
		$("#isay-act-field").html(final_html);
		$("#isay-act-field .field").show();
		//取消录音
		$("#isay-act-field .isay-cancel").click(function(){
				$("#isay-act-field .field").hide();
		});
		var bn_record=$("#isay-act-field .bn-record");
		//录音	
		bn_record.click(function(){
				//把自身的指针传过去
				doRecord(bn_record);
				//防止用户猛击
				bn_record.prop('disabled', true);
		});				
	},
	renderPlayer=function(dom,base64File){
			var src=" src='"+base64File+"' ";
			var audio_tag="<audio autoplay controls "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.html(audio_tag);
	},
	getFileAgain=function(Statue,user_quote_obj){
		var getFile=save.savToSina.getFile;
		var setFile=save.savToSina.setFile;
		setTimeout(function(){
				console.log("3s !!!!");	
				getFile(Statue.data_sid).then(function(base64){
					renderPlayer(user_quote_obj,base64);
					console.log("Ok....3s after");	
				},function(){
					console.log("3s after...fail again");						
				});//end of 没有得到恰当的音频文件
			},3000);
	},
	failLoadFile=function(Statue,user_quote_obj){
		var getFile=save.savToSina.getFile;
		var setFile=save.savToSina.setFile;
		//得改成有BACKGROUND来上传
		var cur_usr=getUserName();
		if(Statue.user_uid===cur_usr){
			var temp_base64=localStorage["VOICE_BUFFER"];
			console.log("I am not in remote:"+Statue.data_sid);
			localStorage["VOICE_BUFFER_ID"]=Statue.data_sid;				
			renderPlayer(user_quote_obj,temp_base64);
			//不在远端，那么就开始上传吧
			setFile(Statue.data_sid,temp_base64).then(function(returnID){
					console.log("setSucceed..."+returnID);
			},function(){

			});
				//3秒钟之后再试一次
				getFileAgain(Statue,user_quote_obj);
		}else{
			//等一段时间再刷新一下吧，或者也可以自动更新
			var temp_base64=localStorage["VOICE_BUFFER"];
			renderPlayer(user_quote_obj,temp_base64);
				//3秒钟之后再试一次
				 getFileAgain(Statue,user_quote_obj);
			
		}//end of 如果不是当前用户，又没抓到，来个setTimeOut先？
	},
	initPlayer=function(){
	$("div.status-item").each(function(){
	//优化了一下，尽力少扫描些信息
	var myself=$(this);
		var data_sid=myself.attr("data-sid");
		var user_url=myself.find("div.bd p.text a:first").attr("href");	
		var user_quote=myself.find("div.bd blockquote p").html();
		var user_uid=user_url.slice(29,-1);
		var Statue={};
			Statue.data_sid=data_sid;
			Statue.user_url=user_url;
			Statue.user_quote=user_quote;
			Statue.user_uid=user_uid;
	//to render player? or not
	if(Statue.user_quote!=null){
	  var ifPlayer=(Statue.user_quote.indexOf("؆")===-1)?false:true;
		if(ifPlayer){
			console.log("ifPlayer holder?"+ifPlayer);
			var user_quote_obj=myself.find("div.bd blockquote p");
			//使用了SINA的这个类的接口
			var getFile=save.savToSina.getFile;
			var setFile=save.savToSina.setFile;
			//不能这么快就渲染，得加一个延时的逻辑
			//等待上传以及等待某用户上传完成...这大概需要个3秒钟左右吧？
			//应该比较合适...3秒钟
			getFile(Statue.data_sid).then(function(base64){
				renderPlayer(user_quote_obj,base64);
			},function(){
				failLoadFile(Statue,user_quote_obj);							
			});//end of 没有得到恰当的音频文件
				
		}//end of ifplayer?
	}//end of not user quote null
		//===========================================
		});//end of each itor
	},
	initVoiceAction=function(){
		var topic=$(".ico-topic");
			topic.after("<a href='javascript:void(0);' tabindex='4'"+
						"class='ico ico-voice' data-action='voice' "+
						"style='background:"+ 
						       "url("+voice_img+") "+
								"no-repeat 0 0;'"+
					    "title='添加语音'>语音</a>");
			var voice_btn=$(".ico-voice");

			voice_btn.bind("click",function(event){				
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
	initIconFont=function(){
			var style=$("style:last");
			var css="<style type='text/css'>"+
					"@font-face {font-family:"+
			    	"'RaphaelIcons';"+
			    	"src:"+
			    	"local('☺'),url('"+raphaelicons+"') format('svg');"+
			    	"font-weight: normal;"+
			    	"font-style: normal;}"+
			    	".voice_say {font-family: 'RaphaelIcons';font-size: 18px;}"+
					"</style>";
			style.after(css);
			var testText="<p class='voice_say'>ÜÜÜÜÜÜÜ</>";
			$("h1:first").after(testText);
	},
	router = function (){
		if(ifupdate_url){
			//initIconFont();
			initVoiceAction();
			initPlayer();
			// var uploadToServer=save.savToSina.uploadToServer;
			// 	uploadToServer(getUserName());
		}//if_update_url end	
	}
	router();
 
} )();