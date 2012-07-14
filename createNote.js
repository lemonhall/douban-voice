//http://www.douban.com/note/create?voice=true
(function(){
var debug=2;
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

var url_slice=location.href.slice(0,33);
var ifupdate_url=url_slice==="http://www.douban.com/note/create";
var voice_img = chrome.extension.getURL("images/ico-voice.gif");
var test_wav = chrome.extension.getURL("test.wav");
//这是一个全局变量，用来防止用户多次重复按下录音按钮的一个小东西
var reverse_clock=null;
$("script:last").remove();
var	getFileFromNote=function(){
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
	renderPlayer=function(dom,base64File){
			var src=" src='"+base64File+"' ";
			var audio_tag="<audio autoplay controls "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.html(audio_tag);
	},
	initNote = function (){
		$(".top-nav").hide();
		$("#header").hide();
		$("#footer").hide();
		footer
		var h1=$("h1:first");
			h1.html("保存语音");
			h1.hide();
		var	row_note_title=$(".note-title");
			row_note_title.hide();
		var publish_note=$('#publish_note');
			publish_note.focus();
		var title=$('#note_title');
			title.val("test");
			title.removeAttr('autofocus');
		var content=$('#note_text');
			content.hide();
			content.html("audio_src");
		var row_note_text=$('.note-text');
			row_note_text.hide();
		var row_note_privacy=$('.note-privacy');
			row_note_privacy.hide();
		var cannot_reply=$("#cannot_reply");
			cannot_reply.prop("checked", true);
		var row_note_reply=$(".note-reply");
			row_note_reply.hide();		
		content.after("<span id='voice_player'></span>");

		$('#preview_note').parent().hide();
		$('#cancel_note').hide();
		cancel_note

		var	player=$('#voice_player');
			// getFileFromNote().then(function(xhr){
			// 			var body=xhr.response;
			// 			var note = $(".note:eq(1)", body);
			// 			var audio_src=note.html();
			// 				content.html(audio_src);
			// 			renderPlayer(player,audio_src);
			// 	});		
	},
	router = function (){
		//http://www.douban.com/note/create?voice=true
		if(ifupdate_url&&urlParams['voice']==='true'){
			initNote();
		}	
	}

	router();
 
} )();