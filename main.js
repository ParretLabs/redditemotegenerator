window.onerror = function(error, url, line) {
  errors += `
    ${error} on line ${line}
`;
  console.log( `
    ${error} on line ${line}
`);
};

var canvas = document.getElementById("canvasEmotes");

var ctx = canvas.getContext("2d");

var emoteSources = {};

var emoteCSS = "";

var emotes = [];

var errors = "\n";

$("#uploadEmote").click(function(e){
	$("#uploadEmoteInput").click();
	e.preventDefault();
});

$("#bugReport").click(function(){
  window.open("https://www.reddit.com/message/compose?to=-Electron-&subject=Reddit+Emote+Generator+Bug%20&message=Hello+-Electron-,\n\n"
              + "%0A%0AWhat+I+was+doing+was%3A%0A%0A...%0A%0AAnd then this happened%3A%0A"
              + encodeURIComponent(errors));
});

$("#uploadEmoteInput").on("change", function(e){
	readFiles(e.target.files, function(evt, file){
		var result = evt.target.result;
    var id = Math.random().toString(36).substr(2, 9);
    console.log(id);
		$("#uploadedEmotes tbody").append(`
			<tr class="emoteEntry">
				<td><img src="${result}" class="imgEntry" /></td>
				<td><b>[](#<input type="text" class="nameEntry" value="${file.name.split(".")[0]}" />)</b></td>
        <td><button class="removeEmoteBtn" data-id="${id}">&times;</button></td>
			</tr>
		`);
    $(`.removeEmoteBtn[data-id='${id}']`).click(function(){
      console.log(emoteSources[keyOf(result, emoteSources)]);
      $(this).parent().parent().remove();
      delete emoteSources[keyOf(result, emoteSources)];
    });
	});
});

$("#uploadEmotepresetInput").on("change", function(e){
	readFiles(e.target.files, function(evt, file){
		var result = evt.target.result;
    emotes = JSON.parse(result);
    console.log(emotes);
    for(var i = 0;i < emotes.length;i++){
      var id = Math.random().toString(36).substr(2, 9);
      $("#uploadedEmotes tbody").append(`
        <tr class="emoteEntry">
          <td><img src="${emotes[i].img}" class="imgEntry" /></td>
          <td><b>[](#<input type="text" class="nameEntry" value="${emotes[i].name}" />)</b></td>
          <td><button class="removeEmoteBtn" data-id="${id}">&times;</button></td>
        </tr>
      `);
      $(`.removeEmoteBtn[data-id='${id}']`).click(function(){
        $(this).parent().parent().remove();
        delete emoteSources[keyOf(emotes[i].img, emoteSources)];
      });
    }
	}, true);
});

$("#getCSS").click(function(e){
  buildSpritesheet();
  makeCSS();
  $("#cssCode").html(emoteCSS.replace(/ /g, "&nbsp;").replace(/(\r\n|\r|\n)/g, "<br>"));
  $("#cssCode").slideToggle();
  e.preventDefault();
});

$("#downloadEmotes").click(function(e){
  buildSpritesheet(function(img){
    $("#emoteSheet").attr("src", img);
    $("#emoteSheet").slideToggle();
    //download(img, "customredditemote.png", "image/png");
  });
  e.preventDefault();
});

$("#uploadEmotepreset").click(function(e){
  $("#uploadEmotepresetInput").click();
  e.preventDefault();
});

$("#downloadEmotepreset").click(function(e){
  download(JSON.stringify(emotes), "emotepreset.json", "application/json");
  e.preventDefault();
});

function buildSpritesheet(callback){
  var emoteNames = Object.keys(emoteSources);
  var emoteImages = Object.values(emoteSources);
  emotes = [];
  for(var i = 0; i < emoteNames.length;i++){
    emotes.push({
      name: emoteNames[i],
      img: emoteImages[i],
      x: i * 32,
      y: 0
    });
  }
  
  $("#downloadEmotepreset").prop("disabled", false);
  
  canvas.width = emotes[emotes.length-1].x + 32;
  canvas.height = emotes[emotes.length-1].y + 32;
  
  function downloadImage(){
    if(callback) callback(canvas.toDataURL());
    console.log(canvas.toDataURL());
  }
  
  for(var i = 0; i < emotes.length;i++){
    var emoteImage = new Image();
    emoteImage.onload = (function(emoteData, index) {
      return function() {
        console.log(emoteData);
        ctx.drawImage(this, emoteData.x, emoteData.y, 32, 32);
        if(index === emotes.length-1) downloadImage();
      }
    })(emotes[i], i);
    emoteImage.src = emotes[i].img;
  }
}

function makeCSS(){
  emoteCSS = "";
  emoteCSS += "/* Reddit Emotes */";
  for(var i = 0; i < emotes.length;i++){
    emoteCSS += `\n\n.md [href$="${emotes[i].name}"]:before {
    background: url(%%customredditemote%%) -${emotes[i].x}px -${emotes[i].y}px;
    display: inline-block;
    height: 16px;
    width: 16px;
    background-size: 16px 16px;
    position: absolute;
    content: "";
    cursor: text;
}`;
  }
  emoteCSS += "\n/* Reddit Emotes END */";
}

setInterval(function(){
  $(".nameEntry").each(function(){
    if($(this).find(".nameEntry").val() !== "") $(this).css("width", `${($(this).val().length * 10) + 20}px`);
  });
  emoteSources = {};
  $(".emoteEntry").each(function(idx){
    if($(this).find(".nameEntry").val() !== "") emoteSources[String($(this).find(".nameEntry").val())] = $(this).find(".imgEntry").attr("src");
  });
}, 100);

function keyOf(val, array){
  for(var key in array) {
    if(array[key] == val){
      return key;
    }
  }
  return false;
}