(function(){
	var debug=2;
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
	setTimeout(function(){
		console.log("3s !!!!");
		var msg={method:"getFile",id:Statue.data_sid};
		bgFileHandler(msg).then(function(response){
			if (response.file) {
				renderPlayer(user_quote_obj,response.file);
				console.log("Ok....3s after");
			};
			if(response.error){
				console.log("3s after...fail again");
			}
		});
	},3000);
	},
	initPlayer=function(){
	$("div.mod").each(function(){
	//优化了一下，尽力少扫描些信息
	var myself=$(this);
		var data_sid=myself.attr("data-status-id");
		var user_url=myself.find("div.hd a:first").attr("href");	
		var user_quote=myself.find("div.bd blockquote p").html();
		var user_uid=user_url.slice(29,-1);
		var Statue={};
			Statue.data_sid=data_sid;
			Statue.user_url=user_url;
			Statue.user_quote=user_quote;
			Statue.user_uid=user_uid;
	//to render player? or not
	if(Statue.user_quote!=null){
	  var ifPlayer=(Statue.user_quote.indexOf(replace_player_holder)===-1)?false:true;
		if(ifPlayer){
			console.log("ifPlayer holder?"+ifPlayer);
			var user_quote_obj=myself.find("div.bd blockquote p");

		var msg={method:"getFile",id:Statue.data_sid};
		bgFileHandler(msg).then(function(response){
				if (response.file) {
					renderPlayer(user_quote_obj,response.file);
				};
				if(response.error){
					getFileAgain(Statue,user_quote_obj);
				}
		});				
		}//end of ifplayer?
	}//end of not user quote null
		//===========================================
		});//end of each itor
	},
	bgFileHandler=function(msg){
		var msg=msg||{method: 'heartBeat'};
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		chrome.extension
			  .sendMessage(msg, function(response) {
			  		deferred.resolve(response);
			});
		return promise;
	};

	initPlayer();
 
} )();