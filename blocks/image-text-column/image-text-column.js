
var aTags = document.querySelectorAll('.image-text-column a');

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

// Create a new button element
// Create a new button element
var helpButton = document.createElement("button");

// Add the "button" class to the button element
helpButton.classList.add("button");

// Set button text
helpButton.textContent = "Get Support";

// Add event listener for button click
helpButton.addEventListener("click", function() {
  // Redirect to a specific URL when the button is clicked
  window.location.href = "https://www.example.com/get-help";
});

// Find the parent element of the h4 with id "get-help"
var getHelpHeader = document.getElementById("get-help");
var parentDiv = getHelpHeader.parentNode;

// Replace the h4 element with the new button
parentDiv.replaceChild(helpButton, getHelpHeader);


// Add alt attribute to the image element inside the link
document.addEventListener("DOMContentLoaded", function() {
  const imageLink = document.querySelector('.image-text-column a[href$=".png"], .image-text-column a[href$=".jpg"], .image-text-column a[href$=".jpeg"], .image-text-column a[href$=".gif"], .image-text-column a[href$=".svg"]');
  if (imageLink) {
      const imageElement = imageLink.querySelector('img');
      if (imageElement && !imageElement.hasAttribute('alt')) {
          imageElement.setAttribute('alt', 'percentige image');
      }
  }
});
