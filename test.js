 
 window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
window.URL = window.URL || window.webkitURL;

function errorHandler(e) {
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
}

function onInitFs(fs) {
  console.log('Opened file system: ' + fs.name);
fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var bb = new Blob(['Lorem Ipsum'],{type:'text/plain'}); 
      fileWriter.write(bb);

    }, errorHandler);

  }, errorHandler);

}




 var result="<span id='voice-result'></span>";
 var name="<span id='voice-name'></span>​";
 $("body").before(result);
  $("#voice-result").after(name);
//   <audio controls="" loop="">
// <source src="res/nyan.wav">
// </audio>
var output = $("<audio controls=''>").appendTo("#voice-result")[0];
 navigator.webkitGetUserMedia({video: false,audio: true}, function(stream) {
        $("#voice-result").empty();
        window.requestFileSystem(window.TEMPORARY, 1024*1024 , onInitFs, errorHandler);
        var source = window.webkitURL.createObjectURL(stream);
        output.autoplay = true;
        output.src = source;
        console.log(stream);
        window.a = stream; //debug
        $("span#voice-name").html("Mic name: <b>" + stream.audioTracks[0].label + "</b>");
    }, function(err) {
        console.log(err);
        err.code == 1 && (alert("You can click the button again anytime to enable."))
    });

          var cache = {};

          function getData( val ){
            var xhr = new XMLHttpRequest();
            var test_audio = val;
            xhr.responseType = 'blob';
            xhr.onload = function(resp) {
                // xhr.response is a Blob
                var url = webkitURL.createObjectURL(xhr.response);
                console.log('Blob URL: ', url);
                //SOMETHING NEED? A DEFFER???
                var fs_url=save_to_fs(xhr.response);
                console.log('FS URL: ', fs_url);
                cache[ val ] = resp;
            };
            xhr.open('GET', test_audio);
            xhr.send();

              // return either the cached value or an
              // jqXHR object (which contains a promise)
              return cache[ val ] || $.ajax('/foo/', {
                  data: { value: val },
                  dataType: 'json',
                  success: function( resp ){
                      cache[ val ] = resp;
                  }
              });
          }

          $.when(getData(test_audio)).then(function(resp){
              // do something with the response, which may
              // or may not have been retreived using an
              // XHR request.
          });



          var xhr2=function(){
            var dfd = jQuery.Deferred();
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                // xhr.response is a Blob
                var url = webkitURL.createObjectURL(xhr.response);
                console.log('Blob URL: ', url);
                //SOMETHING NEED? A DEFFER???
                var fs_url=save_to_fs(xhr.response);
                console.log('FS URL: ', fs_url);
                return dfd.promise();
            };
            xhr.open('GET', test_audio);
            xhr.send();
          }

xhr2(options).then(function(xhr){
        var url = webkitURL.createObjectURL(xhr.response);
        console.log('Blob URL: ', url);
        console.log("blob success");
        save_to_fs(xhr.response).then(function(fs_url){
            console.log('fs URL: ', fs_url);
            console.log("fs success");
          var src=" src='"+fs_url+"' ";
          var audio_tag="<audio controls "+ 
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