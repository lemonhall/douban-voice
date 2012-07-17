(function () {	
var savToSina = (function(){
	//依靠自己的服务器来保存数据的原型
var	__uploadToSinaServer=function(base64){
		__setFile(base64).then(function(){
				__UploadToIsay().then(function(){

				},function(){

				});
		},function(){

		});
	},
	__setSina=function(id,base64){
		var id="1234567"||id;
		var base64="base64"||base64;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var xhr = new XMLHttpRequest();

		var fd = new FormData();
			fd.append("method","SET");
			fd.append("id",id);		
			fd.append("base64",base64);

		xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            var data=JSON.parse(xhr.response);
				//如果正确直接返回数据
				if(data.err_msg===""){
					deferred.resolve(data.id);
				}
				if(data.err_msg==="key设置失败"){
					deferred.reject(xhr,"key设置失败");
				}	
	        }
	    };

		xhr.open('POST', 'http://1.lemonvoice.sinaapp.com/', true);

	    xhr.send(fd);

	    return promise;

	},
	__getSina=function(id){
		var id="1234567"||id;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var xhr = new XMLHttpRequest();

		var fd = new FormData();
			fd.append("method","GET");
			fd.append("id",id);		
			//fd.append("base64","base64");

		xhr.onerror = function(e) {
				deferred.reject(xhr,e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
		        var data=JSON.parse(xhr.response);
				//如果正确直接返回数据
				if(data.err_msg===""){
					deferred.resolve(data.base64);
				}
				if(data.err_msg==="无此键值"){
					deferred.reject(xhr,"无此键值");
				}	            
	        }
	    };

		xhr.open('POST', 'http://1.lemonvoice.sinaapp.com/', true);

	    xhr.send(fd);

	    return promise;

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

	},
	__setFile=function(id,base64){
		var id=id||"voice_test_id";
		var cacheExist=localStorage.hasOwnProperty(id);
		var base64=base64||"base64";

		var deferred = $.Deferred(); 
		var promise = deferred.promise();
			if(cacheExist){
				//DoNothing....
				//这里有待解决，应该可以使用MD5或其他方式来防止重复提交
				deferred.resolve();
			}else{
				__setSina(id,base64).then(function(){
					__saveToCache(id,base64).then(function(){
						deferred.resolve();
					},function(){
						deferred.reject();
					});
				},function(){
						deferred.reject();
				});
			}
		return promise;
	},
	__getFromCache=function(id){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var file=null;

			file=localStorage[id];
			deferred.resolve(file);

			//deferred.reject();


		return promise;
	},
	__saveToCache=function(id,base64){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var id=id||"voice_test_id";
		var base64=base64||"base64";

			localStorage[id]=base64;
			deferred.resolve(base64);
			//deferred.reject();

		return promise;
	},
	//传入id，得到文件
	__getFile=function(id){
		var id=id||"voice_test_id";
		var cacheExist=localStorage.hasOwnProperty(id);
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
			if(cacheExist){
				__getFromCache(id).then(function(base64){
					deferred.resolve(base64);
				},function(){
					deferred.reject();
				});
			//=====================================
			}else{
				__getSina(id).then(function(base64){
					__saveToCache(id,base64).then(function(base64){
						deferred.resolve(base64);
					},function(){
						deferred.reject();
					});
				},function(){					
					deferred.reject();
				});
				
			}
		return promise;
	},
	__getLastID=function(user){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		//得到所有的ACTIONS，然后过滤掉那些没有转播的，就得到了自己的我说
		//然后从自己的我说中取有特殊标记的第一个，如果没有...恭喜你，取消上传
		var user_url_out="http://www.douban.com/people/"+user+"/";
		var temp="http://www.douban.com/people/47044744/";
		var user_url=$("div.bd p.text a[href=\""+user_url_out+"\"]:first");
		//.attr("data-sid");
		var data_sid=user_url.parent().parent().parent().parent().attr("data-sid");
				//如果得到了SID，搞定，返回
				if(data_sid){
						deferred.resolve(data_sid);
				}
				else{
						var e="Not found!";
						deferred.reject(e);
				}
		return promise;
	}

//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	//EXAMPLE:
	// var getFile=save.savToSina.getFile;
	// getFile("1234567").then(function(base64){
	// 		console.log(base64);
	// });
	getFile:function(id){
		return __getFile(id);
	},
	//通用的公共接口
	uploadToServer:function(user){
		
		__getLastID(user).then(function(sid){
			console.log(sid);
			__setFile(sid).then(function(){
				//970402646 

			},function(){
				console.log("save faild..");
			});
		},function(e){
			console.log(e);
		});
			
	}
};//END of 公共接口
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savToSina)
		save.savToSina = savToSina;

})();