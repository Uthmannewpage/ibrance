import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata("locale"));
const { sNo } = placeholders;

function createDiseaseButtons(container, diseases, onClickCallback, disableControlsCallback, query = '') {
    container.innerHTML = '';
    diseases.forEach((disease) => {
        const button = document.createElement("button");
        button.textContent = disease.Disease;
        button.classList.add("disease-button");
        button.id = disease.Disease.toLowerCase();
        button.addEventListener("click", () => {
            onClickCallback(disease.Disease, disease.Medicine.split(', '), button, disease.Description.split(', '));
            disableControlsCallback();
        });

        // Highlight search results in red
        if (query && disease.Disease.toLowerCase().includes(query.toLowerCase())) {
            button.classList.add('search-result');
        }

        // Append button to the beginning of the container
        container.prepend(button);
    });
    container.scrollTop = 0;
}

function createMedicineButtons(container, medicines, descriptions, onClickCallback, disableControlsCallback, query = '') {
    container.innerHTML = '';
    medicines.forEach((medicine, index) => {
        const button = document.createElement("button");
        button.textContent = medicine;
        button.classList.add("disease-button");

        // Highlight search results in red
        if (query && medicine.toLowerCase().includes(query.toLowerCase())) {
            button.classList.add('search-result');
        }

        button.addEventListener("click", () => {
            onClickCallback(medicine, button, descriptions[index]);
            disableControlsCallback();
        });
        container.appendChild(button);
    });
    container.scrollTop = 0;
}

function createSearchInput(container, placeholderText, onInputCallback) {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = placeholderText;
    searchInput.classList.add('search-input');
    searchInput.addEventListener('input', onInputCallback);
    container.appendChild(searchInput);
    return searchInput;
}

function createSortDropdown(container, onChangeCallback) {
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');

    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Order in: ';
    sortLabel.classList.add('sort-label');
    sortContainer.appendChild(sortLabel);

    const sortDropdownContainer = document.createElement('div');
    sortDropdownContainer.classList.add('sort-dropdown-container');

    const sortDropdown = document.createElement('select');
    sortDropdown.classList.add('sort-dropdown');

    const sortOptions = [
        { value: 'a-z', text: 'A-Z' },
        { value: 'z-a', text: 'Z-A' },
    ];

    sortOptions.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = option.text;
        sortDropdown.appendChild(optElement);
    });

    sortDropdown.addEventListener('change', onChangeCallback);
    sortDropdownContainer.appendChild(sortDropdown);
    sortContainer.appendChild(sortDropdownContainer);
    container.appendChild(sortContainer);
    return sortDropdown;
}

function sortItems(items, criteria) {
    return items.slice().sort((a, b) => {
        if (criteria === 'z-a') {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        } else if (criteria === 'a-z') {
            return b.toLowerCase().localeCompare(a.toLowerCase());
        }
        return 0;
    });
}

function createSelectedItemsSection(container, sectionId) {
    let selectedItemsSection = container.querySelector(`#${sectionId}`);
    if (!selectedItemsSection) {
        selectedItemsSection = document.createElement('div');
        selectedItemsSection.classList.add('selected-items-section');
        selectedItemsSection.id = sectionId;
        container.appendChild(selectedItemsSection);
    }
    return selectedItemsSection;
}

function createSelectedItem(container, itemName, onDeleteCallback, isDisease = false) {
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    selectedItem.dataset.name = itemName;
    selectedItem.dataset.type = isDisease ? 'disease' : 'medicine';

    const itemNameSpan = document.createElement('span');
    itemNameSpan.textContent = itemName;
    selectedItem.appendChild(itemNameSpan);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener("click", () => {
        onDeleteCallback(itemName);
        selectedItem.remove();
    });
    selectedItem.appendChild(deleteButton);

    container.appendChild(selectedItem);

    return selectedItem;
}

function disableButtons(buttons) {
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function enableButtons(buttons) {
    buttons.forEach(button => {
        button.disabled = false;
    });
}

function markButtonAsSelected(button) {
    button.style.fontWeight = 'bold';
}

function unmarkButtonAsSelected(button) {
    button.style.fontWeight = 'normal';
}

function getAllMedicines(diseases) {
    const allMedicines = new Set();
    diseases.forEach(disease => {
        disease.Medicine.split(', ').forEach(medicine => {
            allMedicines.add(medicine);
        });
    });
    return Array.from(allMedicines);
}

export default async function decorate() {
    const leftCard = document.querySelector('.interactive-cards > div:nth-child(1)');
    const rightCard = document.querySelector('.interactive-cards > div:nth-child(2)');

    const leftJsonLink = leftCard.querySelector('a[href$=".json"]');
    const rightJsonLink = rightCard.querySelector('a[href$=".json"]');

    leftJsonLink?.remove();
    rightJsonLink?.remove();

    if (leftJsonLink) {
        const jsonData = await (await fetch(leftJsonLink.href)).json();
        const diseases = jsonData.data;

        const diseasesPlaceholder = leftCard.querySelector('#diseases');
        diseasesPlaceholder?.remove();
        const diseasesContainer = document.createElement('div');
        diseasesContainer.id = 'diseases';

        let selectedDisease = null;
        const selectedMedicines = {};

        const diseaseSearchInput = createSearchInput(leftCard, 'Search diseases...', (event) => {
            const query = event.target.value.toLowerCase();
            const filteredDiseases = diseases.filter(disease => disease.Disease.toLowerCase().includes(query));
            createDiseaseButtons(diseasesContainer, filteredDiseases, handleDiseaseSelection, disableDiseaseControls);
        });

        function createSelectedItemsSection(parent, sectionClass) {
            const section = document.createElement('div');
            section.classList.add(sectionClass, 'selected-items-section');
            parent.appendChild(section);
            return section;
        }

        const diseaseSortDropdown = createSortDropdown(leftCard, (event) => {
            const sortedDiseases = sortItems(diseases.map(d => d.Disease), event.target.value);
            const sortedDiseaseObjects = sortedDiseases.map(name => diseases.find(d => d.Disease === name));
            createDiseaseButtons(diseasesContainer, sortedDiseaseObjects, handleDiseaseSelection, disableDiseaseControls);
        });

        leftCard.appendChild(diseasesContainer);

        const medicinesPlaceholder = rightCard.querySelector('#medicines');
        medicinesPlaceholder?.remove();
        const medicinesContainer = document.createElement('div');
        medicinesContainer.id = 'medicines';

        const allMedicines = getAllMedicines(diseases);

        // Collect all descriptions
        const allDescriptions = [];
        diseases.forEach(disease => {
            const medicines = disease.Medicine.split(',').map(med => med.trim());
            const descriptions = disease.Description.split(',').map(desc => desc.trim());

            if (descriptions.length > 0) {
                for (let i = 0; i < medicines.length; i++) {
                    const description = descriptions[i] || 'No description available';

                    allDescriptions.push(description);
                }
            } else {
                // Handle cases where no descriptions are available
                medicines.forEach(med => {
                    console.log(`Medicine: ${med}, Description: No description available`);
                    allDescriptions.push('No description available');
                });
            }
        });

        createMedicineButtons(medicinesContainer, allMedicines, allDescriptions, handleMedicineSelection, enableMedicineControls);

        const medicineSearchInput = createSearchInput(rightCard, 'Search medicines...', (event) => {
            const query = event.target.value.toLowerCase();
            const filteredMedicines = allMedicines.filter(medicine => medicine.toLowerCase().includes(query));
            createMedicineButtons(medicinesContainer, filteredMedicines, allDescriptions, handleMedicineSelection, enableMedicineControls);
        });

        const medicineSortDropdown = createSortDropdown(rightCard, (event) => {
            const sortedMedicines = sortItems(allMedicines, event.target.value);
            createMedicineButtons(medicinesContainer, sortedMedicines, allDescriptions, handleMedicineSelection, enableMedicineControls);
        });

        rightCard.appendChild(medicinesContainer);

        const selectedDiseasesSection = createSelectedItemsSection(leftCard, 'selected-diseases');
        const selectedMedicinesSection = createSelectedItemsSection(rightCard, 'selected-medicines');

        createDiseaseButtons(diseasesContainer, diseases, handleDiseaseSelection, disableDiseaseControls);
        createMedicineButtons(medicinesContainer, allMedicines, allDescriptions, handleMedicineSelection, enableMedicineControls);

        // Replace the h5 element with a text box
        const descriptionTextElement = document.querySelector('#description-text');
        const descriptionContainer = document.createElement('div');
        descriptionContainer.id = 'description-container';

        const descriptionTitle = document.createElement('div');
        descriptionTitle.id = 'description-title';
        descriptionContainer.appendChild(descriptionTitle);

        const descriptionTextBox = document.createElement('textarea');
        descriptionTextBox.id = 'description-text';
        descriptionTextBox.rows = 56;
        descriptionTextBox.cols = 50;
        descriptionTextBox.placeholder = 'Description will appear here...';
        descriptionTextBox.readOnly = true; // Make the text box read-only

        descriptionContainer.appendChild(descriptionTextBox);

        if (descriptionTextElement) {
            descriptionTextElement.replaceWith(descriptionContainer);
        }

        const selectedMedicinesSet = new Set();

        function handleDiseaseSelection(disease, medicines, button, descriptions) {
            if (selectedDisease !== disease) {
                if (selectedDisease) {
                    const prevSelectedButton = diseasesContainer.querySelector(`.disease-button[data-name="${selectedDisease}"]`);
                    unmarkButtonAsSelected(prevSelectedButton);
                    selectedDisease = null;
                    selectedMedicines[selectedDisease] = [];
                    updateSelectedDiseases();
                    enableDiseaseControls();
                    enableMedicineControls(); // Enable medicine controls when a disease is unselected
                }

                markButtonAsSelected(button);
                selectedDisease = disease;
                selectedMedicines[disease] = [];

                createSelectedItem(selectedDiseasesSection, disease, () => {
                    unmarkButtonAsSelected(button);
                    selectedDisease = null;
                    selectedMedicines[disease] = [];
                    updateSelectedDiseases();
                    enableDiseaseControls();
                    enableMedicineControls(); // Enable medicine controls when a disease is unselected
                }, true).dataset.name = disease;

                // Check if a medicine is already selected before allowing to choose another
                if (selectedMedicinesSet.size === 0) {
                    createMedicineButtons(medicinesContainer, medicines, descriptions, (medicine, medicineButton, description) => {
                        if (!selectedMedicinesSet.has(medicine)) {
                            markButtonAsSelected(medicineButton);
                            selectedMedicinesSet.add(medicine);
                            selectedMedicines[disease].push(medicine);
                            createSelectedItem(selectedMedicinesSection, medicine, () => {
                                unmarkButtonAsSelected(medicineButton);
                                selectedMedicinesSet.delete(medicine);
                                selectedMedicines[disease].splice(selectedMedicines[disease].indexOf(medicine), 1);
                                updateSelectedDiseases();
                                enableMedicineControls();
                            }).dataset.name = medicine;
                            disableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
                        }
                        descriptionTextBox.value = description; // Display the description in the text box
                        descriptionTitle.classList.remove('no-result'); // Remove shadow when there is a result
                    }, disableMedicineControls);
                }
                disableDiseaseControls();
            } else {
                // If the same disease is selected again, do nothing
            }
        }

        function handleMedicineSelection(medicine, button, description) {
            if (!selectedDisease || !selectedMedicines[selectedDisease].includes(medicine)) {
                if (!selectedMedicinesSet.has(medicine)) {
                    markButtonAsSelected(button);
                    selectedMedicinesSet.add(medicine);
                    createSelectedItem(selectedMedicinesSection, medicine, () => {
                        unmarkButtonAsSelected(button);
                        selectedMedicinesSet.delete(medicine);
                        enableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
                        Object.keys(selectedMedicines).forEach(disease => {
                            selectedMedicines[disease] = selectedMedicines[disease].filter(med => med !== medicine);
                        });
                        updateSelectedDiseases();
                        enableMedicineControls();
                        enableMedicineButton(medicine); // Enable the corresponding medicine button
                    }).dataset.name = medicine;
                    disableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
                    disableMedicineControls();
                }
                descriptionTextBox.value = description; // Display the description in the text box
                descriptionTitle.classList.remove('no-result'); // Remove shadow when there is a result
            } else {
                // If the same medicine is selected again, do nothing
            }
        }
        
        function enableMedicineButton(medicineName) {
            const button = medicinesContainer.querySelector(`.disease-button[data-name="${medicineName}"]`);
            if (button) {
                button.disabled = false;
            }
        }

        function disableDiseaseControls() {
            diseaseSearchInput.disabled = true;
            diseaseSortDropdown.disabled = true;
        }

        function enableDiseaseControls() {
            diseaseSearchInput.disabled = false;
            diseaseSortDropdown.disabled = false;
        }

        function disableMedicineControls() {
            medicineSearchInput.disabled = true;
            medicineSortDropdown.disabled = true;
        }

        function enableMedicineControls() {
            medicineSearchInput.disabled = false;
            medicineSortDropdown.disabled = false;
        }

        async function updateSelectedDiseases() {
            // Remove deselected diseases
            Array.from(selectedDiseasesSection.querySelectorAll('.selected-item[data-type="disease"]')).forEach(diseaseItem => {
                const diseaseName = diseaseItem.dataset.name;
                if (selectedDisease !== diseaseName) {
                    diseaseItem.remove();
                }
            });
        
            // Clear selected medicines section
            while (selectedMedicinesSection.firstChild) {
                selectedMedicinesSection.firstChild.remove();
            }
        
            // Update selected medicines for each disease
            Object.keys(selectedMedicines).forEach(disease => {
                selectedMedicines[disease] = selectedMedicines[disease].filter(medicine => {
                    const medicineButton = medicinesContainer.querySelector(`.disease-button[data-name="${medicine}"]`);
                    return !!medicineButton; 
                });
        
                if (disease !== selectedDisease) {
                    selectedMedicines[disease].forEach(medicine => {
                        const medicineButton = medicinesContainer.querySelector(`.disease-button[data-name="${medicine}"]`);
                        if (medicineButton) {
                            unmarkButtonAsSelected(medicineButton);
                        }
                    });
                }
            });
        
            // If a disease is selected, populate selected medicines section
            if (selectedDisease && selectedMedicines[selectedDisease]) {
                selectedMedicines[selectedDisease].forEach(medicine => {
                    const medicineButton = medicinesContainer.querySelector(`.disease-button[data-name="${medicine}"]`);
                    if (medicineButton) {
                        const selectedItem = createSelectedItem(selectedMedicinesSection, medicine, () => {
                            const index = selectedMedicines[selectedDisease].indexOf(medicine);
                            if (index !== -1) {
                                selectedMedicines[selectedDisease].splice(index, 1);
                                updateSelectedDiseases();
                                enableMedicineControls();
                                enableMedicineButton(medicine);
                            }
                        });
                        selectedItem.dataset.name = medicine;
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete-button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', () => {
                            const index = selectedMedicines[selectedDisease].indexOf(medicine);
                            if (index !== -1) {
                                selectedMedicines[selectedDisease].splice(index, 1);
                                selectedItem.remove();
                                updateSelectedDiseases();
                                enableMedicineControls();
                                enableMedicineButton(medicine);
                            }
                        });
                        selectedItem.appendChild(deleteButton);
                    }
                });
            }
        
            // Enable controls and buttons
            enableMedicineControls();
            enableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
        
            // If no diseases are selected, reset state
            if (Array.from(selectedDiseasesSection.querySelectorAll('.selected-item[data-type="disease"]')).length === 0) {
                selectedDisease = null;
                selectedMedicines[selectedDisease] = [];
                enableDiseaseControls();
                enableMedicineControls();
                enableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
            }
        }
        
        
    }
}
