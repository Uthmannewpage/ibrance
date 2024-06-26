// Get reference to the section
const scrollingSection = document.querySelector('.scrolling-section');

// Function to expand the section
function expandSection() {
  scrollingSection.dataset.state = 'expanded';
}

// Function to collapse the section
function collapseSection() {
  scrollingSection.dataset.state = 'collapsed';
}

// Create Expand button
const expandButton = document.createElement('button');
expandButton.textContent = 'Expand Section';
expandButton.addEventListener('click', expandSection);
expandButton.classList.add('toggle-button'); // Apply CSS class to style the button

// Create Collapse button
const collapseButton = document.createElement('button');
collapseButton.textContent = 'Collapse Section';
collapseButton.addEventListener('click', collapseSection);
collapseButton.classList.add('toggle-button'); // Apply CSS class to style the button

// Get references to the elements by ID and replace them
const findOutMoreElement = document.getElementById('find-out-more');
const collapseElement = document.getElementById('collapse');

findOutMoreElement.replaceWith(expandButton);
collapseElement.replaceWith(collapseButton);

// Initially set the section to collapsed
collapseSection();
