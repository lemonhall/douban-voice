(function () {

var savTodoubanImgServer = (function(){
//上传至豆瓣，使用了自定义的方式来组建FORM。。。
//
var	__uploadImg=function (arrayBuffer) {
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
	//依靠图像来走上传之路的原型，主要就是个流程
	__uploadToImgServer=function(){
		//混合已知数据
		__hideDataIntoImage().then(function(new_buffer){
			//将混合数据上传到服务器
			__uploadImg(new_buffer).then(function(xhr){
					var img=JSON.parse(xhr.responseText);
					var rawImg=__getRawUrl(img.url);
				});

		});
		//分解出WAV数据，并存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
	},
	//简单替换字符串得到实际的RAW地址
	//EXAMPLE:
	// var rawImg=__getRawUrl("http://img3.douban.com/view/status/small/public/39bf2861338e7cc.jpg");
	// 		console.log(rawImg);
	__getRawUrl=function(smallUrl){
		//TODO:consider img1???
		var img_url=smallUrl;
		var new_url=img_url.replace('http://img3.douban.com/view/status/small/public/','http://img3.douban.com/view/status/raw/public/');
		return new_url;
	},
	//异步得将两种数据柔和在一起，并返回
	//
	//EXAMPLE:
	// __hideDataIntoImage().then(function(new_buffer){
	// 		//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// 		var blob = new Blob([new_buffer], { type: "image/png" });
	// 		var url = window.webkitURL.createObjectURL(blob);
	// 		var h1=$("h1:first");
	// 			__renderImg(h1,url);
	// 		var wav_blob=new Blob([splitWavFromImage(new_buffer)],{type:"audio/wav"});
	// 		var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	// 	});
	__hideDataIntoImage=function(){
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
	//__hideDataIntoImage的测试？或者说是EXAMPLE都可以
	__testDataHided=function(){
		__hideDataIntoImage().then(function(new_buffer){
			//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
			var blob = new Blob([new_buffer], { type: "image/png" });
			var url = window.webkitURL.createObjectURL(blob);
			var h1=$("h1:first");
				__renderImg(h1,url);
			var wav_blob=new Blob([splitWavFromImage(new_buffer)],{type:"audio/wav"});
			var wav_url=window.webkitURL.createObjectURL(wav_blob);
				renderPlayer(h1,wav_url);
		});
	},
	//送入一个文件URL，得到串列，上传至豆瓣的POST接口，得到返回的值
	//然后对返回值进行计算，得到RAW DATA的图像地址
	//调用了getArrayBuffer以及__uploadImg
	__upload_xhr2=function(){
		getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
		.then(function(xhr){
			//arrayBuffer
			__uploadImg(xhr.response).then(function(xhr){
				var img=JSON.parse(xhr.responseText);
				//console.log(img);
				//http://img3.douban.com/view/status/small/public/39bf2861338e7cc.jpg
				//img.url
				var rawImg=__getRawUrl(img.url);
			});
		});
	},	
	//EXAMPLE:
	//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// var blob = new Blob([new_TypedArray.buffer], { type: "image/png" });
	// var url = window.webkitURL.createObjectURL(blob);
	// var h1=$("h1:first");
	// 	__renderImg(h1,url);
	__renderImg=function(dom,base64File){
		var src=" src='"+base64File+"' ";
			var img_tag="<img "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.after(img_tag);

	}
//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	initView:function(){


	},
	//依靠日记来保存数据的原型
	//这应该是向外暴露的公共方法
	uploadToServer:function(){
		//将WAV数据存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
		//redirectTo createNote.js

	}
};
})();

// 将模块注册到WINDOWS对象上去
	if(!window.savTodoubanImgServer)
		window.savTodoubanImgServer = savTodoubanImgServer;	
})();