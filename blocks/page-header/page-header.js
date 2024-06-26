// Load the background image asynchronously
function loadBackgroundImage() {
    const backgroundImageUrl = 'https://www.ibrance.com/media_1b3aca32d83204684e9b814d5eb240a514672778b.jpeg?width=2000&format=webply&optimize=medium';
    const preloadImage = new Image();
    preloadImage.src = backgroundImageUrl;
    preloadImage.onload = function() {
        const pageHeader = document.querySelector('.page-header');

        pageHeader.style.opacity = 1; // Show the element after the image is loaded
        pageHeader.style.transition = 'background-image 0.3s ease-in-out'; // Apply transition after image is loaded
    };
}

// Call the function to load the background image
loadBackgroundImage();
