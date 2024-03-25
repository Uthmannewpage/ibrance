// JavaScript code to preload the image
document.addEventListener("DOMContentLoaded", function() {
  var imageUrl = "./media_1e95305f37e1651c1a2eed78c7eeb5d417232d7ce.png?width=2000&format=webply&optimize=medium";
  var link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = imageUrl;
  document.head.appendChild(link);
});
