 
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