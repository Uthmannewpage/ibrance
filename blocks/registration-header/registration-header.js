const optionsHeadings = document.querySelectorAll('.registration-header h3');

optionsHeadings.forEach(heading => {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'ibrance_option';
    radioInput.classList.add('radio-circle');

    heading.parentNode.insertBefore(radioInput, heading);

    radioInput.addEventListener('change', function() {
        if (this.checked) {
            this.style.setProperty('--dot-color', 'purple');
        }
    });
});
