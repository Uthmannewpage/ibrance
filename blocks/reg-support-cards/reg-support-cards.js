// Get all h1 elements within .reg-support-cards
const h1Elements = document.querySelectorAll('.reg-support-cards h1');

// Function to toggle checkbox state
function toggleCheckbox() {
    this.classList.toggle('checked');
}

// Add event listener to each h1 element
h1Elements.forEach(h1 => {
    h1.addEventListener('click', toggleCheckbox);
});
