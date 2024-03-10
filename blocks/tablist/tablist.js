// Define the function to create buttons
function createButtons() {
    // Create buttons
    const commerciallyInsuredButton = document.createElement('button');
    commerciallyInsuredButton.textContent = 'Commercially Insured';
    commerciallyInsuredButton.onclick = function() {
      alert('Commercially Insured Button Clicked!');
    };
  
    const medicareOrGovernmentInsuredButton = document.createElement('button');
    medicareOrGovernmentInsuredButton.textContent = 'Medicare Or Government Insured';
    medicareOrGovernmentInsuredButton.onclick = function() {
      alert('Medicare Or Government Insured Button Clicked!');
    };
  
    const uninsuredButton = document.createElement('button');
    uninsuredButton.textContent = 'Uninsured';
    uninsuredButton.onclick = function() {
      alert('Uninsured Button Clicked!');
    };
  
    // Append buttons to their respective divs
    document.getElementById('commercially-insured').appendChild(commerciallyInsuredButton);
    document.getElementById('medicare-or-government-insured').appendChild(medicareOrGovernmentInsuredButton);
    document.getElementById('uninsured').appendChild(uninsuredButton);
  }
  
  // Call the function to create buttons when the window has loaded
  window.onload = createButtons;

// Add event listeners to tablist buttons
document.querySelectorAll('.tablist > div > div').forEach((button, index) => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.tablist > div > div').forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to clicked button
        button.classList.add('active');
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
        // Show the content section corresponding to the clicked button
        document.getElementById(`content${index + 1}`).style.display = 'block';
    });
});
