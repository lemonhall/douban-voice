(function () {	
//使用了SINA的这个类的接口
var getFile=save.savToSina.getFile;
var setFile=save.savToSina.setFile;
var MAX_WAV_SIZE=381620;

//不能这么快就渲染，得加一个延时的逻辑
//等待上传以及等待某用户上传完成...这大概需要个3秒钟左右吧？
//应该比较合适...3秒钟
var sendFileResponse=function(msg){
	var msg=msg||{};
	var sid=msg.id;
	var deferred = $.Deferred(); 
	var promise = deferred.promise();

	//var msg={method:"getFile",id:Statue.data_sid};
	getFile(sid).then(function(base64){
		//实际的返回工作
		deferred.resolve({file: base64});
		//renderPlayer(user_quote_obj,base64);
	},function(){
		deferred.reject({error: 'fail'});	
	});//end of 没有得到恰当的音频文件
	return promise;		
},
sendSetFileMsg=function(msg){
	//request
	//var msg={method:"setFile",
	//			id:Statue.data_sid,
	//			file:temp_base64};
	var msg=msg||{};
	var sid=msg.id;
	var file=msg.file;	
	var deferred = $.Deferred(); 
	var promise = deferred.promise();
	//在设置的时候就加一层保险，服务端肯定还会加一层保险
	//防止无限制的上传
	if(file.length>MAX_WAV_SIZE){
		file=file.substr(0,MAX_WAV_SIZE);
	}

	setFile(sid,file).then(function(rID){
			deferred.resolve({returnID: rID});
	},function(){
			deferred.reject({error: 'fail'});
	});

	return promise;
}
//它相当于是ROUTER，接受信息，并将任务分配到各个处理机制上去
//content.js所需要的文件
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log( "request:==========================" );

    console.log( request );
    if (request.method == "getFile"){
    	sendFileResponse(request)
    		.then(function(response){
    			sendResponse(response);
    	},function(e){
    			sendResponse(e);
    	});
    }
    if (request.method == "setFile"){
    	sendSetFileMsg(request)
    		.then(function(response){
    			sendResponse(response);
    	},function(e){
    			sendResponse(e);
    	});      
    }      
    if (request.method == "heartBeat"){
    	sendResponse(1);
	}

	return true;     		
});
})();