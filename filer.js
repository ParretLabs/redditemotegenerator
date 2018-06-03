function readFiles(evtFiles, callback, isText) {
	var files = evtFiles; // FileList object

	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {
		// Only process image files.
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				callback(e, theFile);
			};
		})(f);
		// Read in the image file as a data URL.
		if(!isText){
      reader.readAsDataURL(f);
    } else {
      reader.readAsText(f);
    }
	}
}