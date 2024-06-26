document.addEventListener("DOMContentLoaded", function() {
    const imageColumns = document.querySelectorAll('.image-image-column');
    imageColumns.forEach(function(imageColumn) {
        const images = imageColumn.querySelectorAll('img');
        images.forEach(function(image) {
            image.style.cursor = 'pointer'; // Add pointer cursor
            image.addEventListener('click', function() {
                // Redirect to the specified URL
                window.location.href = "https://www.pfizeroncologytogether.com/";
            });
        });
    });
});
