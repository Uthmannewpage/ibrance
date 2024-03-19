// Select all the h3 elements containing the options
const optionsHeadings = document.querySelectorAll('.registration-header h3');

// Loop through each h3 element and add a radio button to the left
optionsHeadings.forEach(heading => {
    // Create a radio input element
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'ibrance_option'; // Set the same name for all radio buttons to allow selection of only one
    radioInput.classList.add('radio-circle');

    // Insert the radio input before the current heading content
    heading.parentNode.insertBefore(radioInput, heading);

    // Add event listener to each radio button
    radioInput.addEventListener('change', function() {
        if (this.checked) {
            // Set the dot color to purple when the radio button is checked
            this.style.setProperty('--dot-color', 'purple');
        }
    });
});
