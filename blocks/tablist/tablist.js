document.addEventListener("DOMContentLoaded", function () {
    // Get the tablist container
    const tablist = document.querySelector('.tablist');
  
    // Get the first div in tablist
    const firstDiv = tablist.querySelector('div > div:first-child');
  
    // Set data-content-id attribute to "content2" for the first div
    firstDiv.setAttribute('data-content-id', 'content2');
  
    // Get all the content blocks
    const contentBlocks = document.querySelectorAll('.content');
  
    // Get all the tab buttons
    const tabButtons = tablist.querySelectorAll('button');
  
    // Add click event listeners to each tab button
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Remove the active class from all content blocks
        contentBlocks.forEach(block => {
          block.classList.remove('active');
        });
  
        // Add the active class to the content block corresponding to the clicked button
        contentBlocks[index].classList.add('active');
      });
    });
  
    // Get the first div in tablist again after adding data-content-id
    const updatedFirstDiv = tablist.querySelector('div > div:first-child');
  
    // Add click event listener to the updated first div
    updatedFirstDiv.addEventListener("click", function () {
      // Remove active class from all tabs
      tabButtons.forEach((button) => button.classList.remove("active"));
  
      // Add active class to the clicked button
      updatedFirstDiv.classList.add("active");
  
      // Hide all content
      contentBlocks.forEach((content) => content.style.display = "none");
  
      // Show the content corresponding to the clicked tab
      const contentId = updatedFirstDiv.dataset.contentId;
      document.getElementById(contentId).style.display = "block";
    });
  });
  