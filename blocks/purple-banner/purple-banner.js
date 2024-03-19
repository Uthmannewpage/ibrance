// Get the banner element
const banner = document.querySelector('.purple-banner');

// Function to scroll to the section when banner is clicked
banner.addEventListener('click', function() {
  const section = document.querySelector('.purple-banner-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
});
