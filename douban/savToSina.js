(function () {	
var savToSina = (function(){
	//依靠自己的服务器来保存数据的原型
var	__uploadToSinaServer=function(){
		//将WAV数据存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
		//xhr2到新浪的特定服务上，POST一段BASE64过的数据即可
		//关键是缓存以及，防止重复提交的逻辑要写好
	},
	__UploadToIsay=function(comments){
		var comments='test'||comments;
		var xhr = new XMLHttpRequest();
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");		
		var fd = new FormData();

			fd.append("ck",ck);
			fd.append("comment","test");

		xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

		xhr.open('POST', 'http://www.douban.com/update/', true);
	    xhr.send(fd);

	    return promise;

	}

//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	initView:function(){
		

	},
	//通用的公共接口
	uploadToServer:function(){
			__uploadToSinaServer();
	}
};//END of 公共接口
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savToSina)
		save.savToSina = savToSina;

})();