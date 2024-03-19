// Select the container div
const formContainer = document.querySelector('.reg-form');

// Clear existing content inside the form container
formContainer.innerHTML = '';

// Define sections and their fields
const sections = [
  { title: 'Personal', fields: ['First Name', 'Last Name', 'Email', 'Confirm Email'] },
  { title: 'Contact', fields: ['Address', 'City', 'State', 'Zip-code'] }
];

// Iterate through sections
sections.forEach(section => {
  // Create section title
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = section.title;
  formContainer.appendChild(sectionTitle);

  // Create fields for the section
  section.fields.forEach(inputText => {
    const div = document.createElement('div');
    div.classList.add('form-group'); // Add a class for styling

    // Create label element
    const label = document.createElement('label');
    label.textContent = inputText + ': '; // Set label text
    div.appendChild(label); // Append label before input

    // Create input element
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('purple-input'); // Add class to input for styling

    // Set placeholder examples based on inputText
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
        input.setAttribute('placeholder', ''); // Default empty placeholder
    }

    div.appendChild(input);
    formContainer.appendChild(div);
  });
});

// Create and append submit button
const submitButton = document.createElement('button');
submitButton.textContent = 'Submit';
formContainer.appendChild(submitButton);

// Event listener for submit button
submitButton.addEventListener('click', function() {
  const formData = {};
  // Gather input values
  document.querySelectorAll('.reg-form input').forEach(input => {
    formData[input.previousSibling.textContent.slice(0, -2)] = input.value;
  });

  // Send data as JSON to the specified URL
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
      // Optionally clear form fields after successful submission
      document.querySelectorAll('.reg-form input').forEach(input => {
        input.value = '';
      });
    } else {
      // Display error message with request payload
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
