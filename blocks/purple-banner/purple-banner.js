const banner = document.querySelector('.purple-banner');


banner.addEventListener('click', function() {
  const section = document.querySelector('.purple-banner-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
});
