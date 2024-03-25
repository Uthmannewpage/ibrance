function createButtons() {
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

  document.getElementById('commercially-insured').appendChild(commerciallyInsuredButton);
  document.getElementById('medicare-or-government-insured').appendChild(medicareOrGovernmentInsuredButton);
  document.getElementById('uninsured').appendChild(uninsuredButton);
}

window.onload = createButtons;

document.querySelectorAll('.tablist > div > div').forEach((button, index) => {
  button.addEventListener('click', () => {
      document.querySelectorAll('.tablist > div > div').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
      document.getElementById(`content${index + 1}`).style.display = 'block';
  });
});
