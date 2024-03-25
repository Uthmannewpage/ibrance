const h1Elements = document.querySelectorAll('.reg-support-cards h1');

function toggleCheckbox() {
    this.classList.toggle('checked');
}

h1Elements.forEach(h1 => {
    h1.addEventListener('click', toggleCheckbox);
});
