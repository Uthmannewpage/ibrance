
var button = document.createElement('button');
button.id = 'sidebarToggle';
button.setAttribute('aria-label', 'Toggle Sidebar'); 
button.style.backgroundColor = 'transparent';
button.style.width = '50px';
button.style.height = '50px';
button.style.position = 'fixed';
button.style.top = '100px';
button.style.right = '0';

var lineTop = document.createElement('div');
lineTop.style.backgroundColor = '#430098'; 
lineTop.style.width = '30px';
lineTop.style.height = '5px';
lineTop.style.position = 'absolute';
lineTop.style.top = '10px'; 
lineTop.style.left = '10px'; 
button.appendChild(lineTop);

var lineMiddle = document.createElement('div');
lineMiddle.style.backgroundColor = '#430098'; 
lineMiddle.style.width = '30px';
lineMiddle.style.height = '5px';
lineMiddle.style.position = 'absolute';
lineMiddle.style.top = '20px'; 
lineMiddle.style.left = '10px'; 
button.appendChild(lineMiddle);

var lineBottom = document.createElement('div');
lineBottom.style.backgroundColor = '#430098'; 
lineBottom.style.width = '30px';
lineBottom.style.height = '5px';
lineBottom.style.position = 'absolute';
lineBottom.style.top = '30px'; 
lineBottom.style.left = '10px'; 
button.appendChild(lineBottom); 

document.body.appendChild(button);

document.getElementById('sidebarToggle').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('active');
});

// Function to handle sidebar state based on window size
function handleResize() {
  if (window.innerWidth > 600) {
    // Desktop: Ensure sidebar is open
    document.querySelector('.sidebar').classList.add('active');
  } else {
    // Mobile: Ensure sidebar is closed initially
    document.querySelector('.sidebar').classList.remove('active');
  }
}

// Handle resize on page load
handleResize();

// Handle resize on window resize
window.addEventListener('resize', handleResize);


const h1Element = document.getElementById("for-newly-diagnosed");
const h2Elements = [
  document.getElementById("for-newly-diagnosed-1"),
  document.getElementById("for-newly-diagnosed-2"),
  document.getElementById("types-of-studies")
];

h2Elements.forEach(h2 => {
  h2.style.display = "none";
});

const toggleText = document.createElement("span");
toggleText.textContent = "For Newly Diagnosed";
toggleText.style.marginBottom = "10px";
toggleText.style.cursor = "pointer";

h1Element.innerHTML = '';
h1Element.appendChild(toggleText);

toggleText.addEventListener("click", function () {
  h2Elements.forEach(h2 => {
    if (h2.style.display === "none") {
      h2.style.display = "block";
    } else {
      h2.style.display = "none";
    }
  });
  h1Element.classList.toggle('active');
});

const h1ElementAboutIbrance = document.getElementById("about-ibrance");
const h2ElementsAboutIbrance = [
  document.getElementById("about-ibrance-1"),
  document.getElementById("starting-and-taking-ibrance"),
  document.getElementById("ibrance-tablets")
];

h2ElementsAboutIbrance.forEach(h2 => {
  h2.style.display = "none";
});

const toggleTextAboutIbrance = document.createElement("span");
toggleTextAboutIbrance.textContent = "About IBRANCE";
toggleTextAboutIbrance.style.marginBottom = "10px";
toggleTextAboutIbrance.style.cursor = "pointer";

h1ElementAboutIbrance.innerHTML = '';
h1ElementAboutIbrance.appendChild(toggleTextAboutIbrance);

toggleTextAboutIbrance.addEventListener("click", function () {
  h2ElementsAboutIbrance.forEach(h2 => {
    if (h2.style.display === "none") {
      h2.style.display = "block";
    } else {
      h2.style.display = "none";
    }
  });
  h1ElementAboutIbrance.classList.toggle('active');
});

const h1ElementRealStories = document.getElementById("real-stories");
const h2ElementsRealStories = [
  document.getElementById("real-stories-1"),
  document.getElementById("share-your-story")
];

h2ElementsRealStories.forEach(h2 => {
  h2.style.display = "none";
});

const toggleTextRealStories = document.createElement("span");
toggleTextRealStories.textContent = "Real Stories";
toggleTextRealStories.style.marginBottom = "10px";
toggleTextRealStories.style.cursor = "pointer";

h1ElementRealStories.innerHTML = '';
h1ElementRealStories.appendChild(toggleTextRealStories);

toggleTextRealStories.addEventListener("click", function () {
  h2ElementsRealStories.forEach(h2 => {
    if (h2.style.display === "none") {
      h2.style.display = "block";
    } else {
      h2.style.display = "none";
    }
  });
  h1ElementRealStories.classList.toggle('active');
});



var signUpButton = document.createElement("button");


signUpButton.textContent = "Sign up";

signUpButton.style.width = "100%";
signUpButton.style.backgroundColor = "white";
signUpButton.style.border = "4px solid #430098";
signUpButton.style.color = "#430098";
signUpButton.style.cursor = "pointer";
signUpButton.style.textAlign = "center"; 
signUpButton.style.borderRadius = "20px";

signUpButton.addEventListener("click", function() {
  window.location.href = "http://localhost:3000/registration";
});


signUpButton.addEventListener("mouseover", function() {
  signUpButton.style.backgroundColor = "#430098";
  signUpButton.style.color = "white";
});


signUpButton.addEventListener("mouseout", function() {
  signUpButton.style.backgroundColor = "white";
  signUpButton.style.color = "#430098";
});

var signUpHeader = document.getElementById("sign-up");
signUpHeader.textContent = ""; 
signUpHeader.parentNode.replaceChild(signUpButton, signUpHeader);



// Load Font Awesome dynamically
var faScript = document.createElement("script");
faScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js";
document.head.appendChild(faScript);

function createSocialButton(iconClass, color, url, label) {
  var button = document.createElement("button");
  var icon = document.createElement("i");
  icon.classList.add("fab", iconClass);
  button.appendChild(icon);
  

  button.setAttribute("aria-label", label);

  button.style.width = "50px";
  button.style.height = "50px";
  button.style.backgroundColor = "white";
  button.style.border = "2px solid " + color;
  button.style.color = color;
  button.style.cursor = "pointer";
  button.style.textAlign = "center";
  button.style.borderRadius = "50%";
  button.style.padding = "0"; 
  button.style.margin = "0"; 

  button.addEventListener("click", function() {
    window.location.href = url;
  });

  button.addEventListener("mouseover", function() {
    button.style.backgroundColor = color;
    button.style.color = "white";
  });

  button.addEventListener("mouseout", function() {
    button.style.backgroundColor = "white";
    button.style.color = color;
  });

  return button;
}

var tdElements = document.querySelectorAll('td');

tdElements.forEach(function(td) {
  var text = td.textContent.trim().toLowerCase();
  var button = document.createElement("button"); // Define button here
  var ariaLabel; 
  
  switch(text) {
    case "facebook":
      button.setAttribute('aria-label', 'Facebook');
      ariaLabel = "Visit Pfizer Ibrance Facebook page";
      button = createSocialButton("fa-facebook-f", "#430098", "https://www.facebook.com/PfizerIbrance/", ariaLabel);
      break;
    case "instagram":
      button.setAttribute('aria-label', 'Instagram');
      ariaLabel = "Visit Ibrance Palbociclib Instagram page";
      button = createSocialButton("fa-instagram", "#C13584", "https://www.instagram.com/ibrance_palbociclib/", ariaLabel);
      break;
    case "twitter":
      button.setAttribute('aria-label', 'Twitter');
      ariaLabel = "Visit Pfizer Ibrance Twitter page";
      button = createSocialButton("fa-twitter", "#1DA1F2", "https://twitter.com/PfizerIbrance", ariaLabel);
      break;
    default:
      return;
  }
  

  td.innerHTML = "";
  td.appendChild(button);
});



function createPopup(title, content) {
  // Create overlay
  var overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9998"; 
  
  // Create popup
  var popup = document.createElement("div");
  popup.classList.add("popup");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.padding = "20px";
  popup.style.backgroundColor = "#ffffff";
  popup.style.borderRadius = "10px";
  popup.style.zIndex = "9999";
  
 
  var popupTitle = document.createElement("h2");
  popupTitle.textContent = title;
  popupTitle.style.color = "#430098";
  popupTitle.style.textAlign = "left";
  popupTitle.style.marginBottom = "10px";
  
  // Close Button
  var closeButton = document.createElement("span");
  closeButton.textContent = "x";
  closeButton.style.color = "#333333";
  closeButton.style.cursor = "pointer";
  closeButton.style.position = "absolute";
  closeButton.style.top = "20px";
  closeButton.style.right = "20px";
  closeButton.style.fontSize = "30px";
 
  closeButton.addEventListener("click", function() {
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  });

  // Content
  var popupContent = document.createElement("div");
  popupContent.innerHTML = content; 
  popupContent.style.textAlign = "left"; 

  // Style links inside popup content
  var popupLinks = popupContent.querySelectorAll("a");
  for (var i = 0; i < popupLinks.length; i++) {
    popupLinks[i].style.color = "green"; 
  }

  // Append elements
  popup.appendChild(popupTitle);
  popup.appendChild(closeButton);
  popup.appendChild(popupContent);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}


document.getElementById("full-prescribing-information").addEventListener("click", function() {
  var title = ("Full Prescribing Information"); 
  var contentDiv = document.querySelector(".sidebar > div:nth-child(16)"); 
  
  // Get the HTML content as a string
  var contentHTML = contentDiv.innerHTML;
  
  createPopup(title, contentHTML); 
});


document.getElementById("patient-information").addEventListener("click", function() {
  var title = ("Full Prescribing Information"); 
  var contentDiv = document.querySelector(".sidebar > div:nth-child(18)"); 
  
  // Get the HTML content as a string
  var contentHTML = contentDiv.innerHTML;
  
  createPopup(title, contentHTML);
});


document.getElementById("use").addEventListener("click", function() {
  var title = ("Indications"); 
  var contentDiv = document.querySelector(".sidebar > div:nth-child(20)"); 
  
  // Get the HTML content as a string
  var contentHTML = contentDiv.innerHTML;
  
  createPopup(title, contentHTML);
});

document.getElementById("important-safety-information").addEventListener("click", function() {
  createPopup("Important Safety Information", "Welcome, you have clicked Important Safety Information.");
});

document.getElementById("healthcare-professionals").addEventListener("click", function() {
  createPopup("Healthcare Professionals", "Welcome, you have clicked Healthcare Professionals.");
});

document.getElementById("español").addEventListener("click", function() {
  createPopup("Español", "Welcome, you have clicked Español.");
});


var aTags = document.querySelectorAll('.sidebar a');

aTags.forEach(function(aTag) {

  var imageUrl = aTag.getAttribute('href');

  // Extract the image URL from the larger URL
  var matches = imageUrl.match(/(https?:\/\/.*?\.(?:jpeg|jpg|gif|png))/i);
  if (matches && matches.length > 0) {
    imageUrl = matches[0];
  }

  if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
    var img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = "300px";
  

    aTag.parentNode.replaceChild(img, aTag);
  }
});
