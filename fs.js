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

window.requestFileSystem(window.TEMPORARY, 1024*1024 , onInitFs, errorHandler);

    var blob=blob;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    var fs = null;

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
        consol.log("Error: "+msg);
      }
function initFS() {
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
  fs = filesystem;

fs.root.getFile('test.mp3', {create: true}, function(fileEntry) {

// Create a FileWriter object for our FileEntry (log.txt).
fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
        console.log("Save succed:"+fileEntry.toURL())
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
      fileWriter.write(blob);

    }, errorHandler);//End of CreateWriter
  }, errorHandler);//End of fs.root.getFile

          }, errorHandler);//End of requestFileSystem;
        }
      // Initiate filesystem on page load.
      if (window.requestFileSystem) {
        initFS();
      }​