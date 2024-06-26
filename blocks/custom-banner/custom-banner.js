
var aTags = document.querySelectorAll('.custom-banner a');

// Iterate over each <a> tag
aTags.forEach(function(aTag) {
  // Get the URL from the href attribute of the <a> tag
  var imageUrl = aTag.getAttribute('href');

  // Create an image element
  var img = document.createElement('img');

  // Set the src attribute of the image to the URL
  img.src = imageUrl;

  // Replace the <a> tag with the image
  aTag.parentNode.replaceChild(img, aTag);
});
