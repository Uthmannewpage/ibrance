const formContainer = document.querySelector('.reg-form');
formContainer.innerHTML = '';
const sections = [
  { title: 'Personal', fields: ['First Name', 'Last Name', 'Email', 'Confirm Email'] },
  { title: 'Contact', fields: ['Address', 'City', 'State', 'Zip-code'] }
];

sections.forEach(section => {
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = section.title;
  formContainer.appendChild(sectionTitle);

  section.fields.forEach(inputText => {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const label = document.createElement('label');
    label.textContent = inputText + ': ';
    div.appendChild(label);

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('purple-input');

    switch (inputText) {
      case 'First Name':
        input.setAttribute('placeholder', 'John');
        break;
      case 'Last Name':
        input.setAttribute('placeholder', 'Smith');
        break;
      case 'Email':
        input.setAttribute('placeholder', 'example@example.com');
        break;
      case 'Confirm Email':
        input.setAttribute('placeholder', 'example@example.com');
        break;
      case 'Address':
        input.setAttribute('placeholder', '123 Main St');
        break;
      case 'City':
        input.setAttribute('placeholder', 'Anytown');
        break;
      case 'State':
        input.setAttribute('placeholder', 'State');
        break;
      case 'Zip-code':
        input.setAttribute('placeholder', '12345');
        break;
      default:
        input.setAttribute('placeholder', '');
    }

    div.appendChild(input);
    formContainer.appendChild(div);
  });
});

const submitButton = document.createElement('button');
submitButton.textContent = 'Submit';
formContainer.appendChild(submitButton);

submitButton.addEventListener('click', function() {
  const formData = {};
  document.querySelectorAll('.reg-form input').forEach(input => {
    formData[input.previousSibling.textContent.slice(0, -2)] = input.value;
  });

  fetch('https://admin.hlx.page/form/Uthmannewpage/ibrance/main/registration.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: formData })
  })
  .then(response => {
    if (response.ok) {
      alert('Form submitted successfully!');
      document.querySelectorAll('.reg-form input').forEach(input => {
        input.value = '';
      });
    } else {
      response.text().then(errorMessage => {
        console.error('Error:', errorMessage);
        alert('Failed to submit form. Error message: ' + errorMessage);
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to submit form. Error: ' + error);
  });
});
