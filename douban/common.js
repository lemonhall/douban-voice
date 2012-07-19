//这两个应该作为全局变量
var voice_img = chrome.extension.getURL("images/ico-voice.gif");
var test_wav = chrome.extension.getURL("test.wav");
var raphaelicons = chrome.extension.getURL("raphaelicons-webfont.svg");
var replace_player_holder="བློ";

var save={};
var VoiceCache={};


//用FileReader将任何BLOB对象转换成BASE64编码
//loadBlobToBase64(xhr.response).then(function(base64){});
var	loadBlobToBase64=function(blob){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		var reader = new FileReader();
		reader.onload = function() {
			  deferred.resolve(reader.result);
        }
       	reader.readAsDataURL(blob);
       	return promise;
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
	}