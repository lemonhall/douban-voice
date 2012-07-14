// Define the FormData object for the Web worker:
importScripts('xhr2-FormData.js')

// Note: In a Web worker, the global object is called "self" instead of "window"
self.onmessage = function(event) {
    var resourceUrl = event.data;   // From the background page
    var xhr = new XMLHttpRequest();
    xhr.open('GET', resourceUrl, true);

    // Response type arraybuffer - XMLHttpRequest 2
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if (xhr.status == 200) {
            nextStep(xhr.response);
        }
    };
    xhr.send();
};
function nextStep(arrayBuffer) {
    var xhr = new XMLHttpRequest();
    // Using FormData polyfill for Web workers!
    var fd = new FormData();
    fd.append('server-method', 'upload');

    // The native FormData.append method ONLY takes Blobs, Files or strings
    // The FormData for Web workers polyfill can also deal with array buffers
    fd.append('file', arrayBuffer);

    xhr.open('POST', 'http://www.douban.com/j/upload', true);

    // Transmit the form to the server
    xhr.send(fd);
};