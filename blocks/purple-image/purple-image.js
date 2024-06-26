
var aTags = document.querySelectorAll('.purple-image a');

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

var helpButton = document.createElement("button");

// Add the "button" class to the button element
helpButton.classList.add("button");

// Set button text
helpButton.textContent = "Hear their stories";

// Add event listener for button click
helpButton.addEventListener("click", function() {
  // Redirect to a specific URL when the button is clicked
  window.location.href = "https://www.ibrance.com/mbc-stories/";
});

// Find the parent element of the h4 with id "get-help"
var getHelpHeader = document.getElementById("hear-their-stories");
var parentDiv = getHelpHeader.parentNode;

// Replace the h4 element with the new button
parentDiv.replaceChild(helpButton, getHelpHeader);
