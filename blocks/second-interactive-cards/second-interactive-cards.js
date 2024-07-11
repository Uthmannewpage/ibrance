import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

function createDiseaseButtons(container, diseases, onClickCallback, disableControlsCallback, query = '') {
    container.classList.add('button-list-container'); 
    container.innerHTML = '';
    diseases.forEach((disease) => {
        const button = createButton(disease.Disease, 'disease-button', query);
        button.addEventListener("click", () => {
            onClickCallback(disease.Disease, disease.Medicine.split(', '), button, disease.Description.split(', '));
            disableControlsCallback();
        });
        container.prepend(button);
    });
    container.scrollTop = 0;
}

function createMedicineButtons(container, medicines, descriptions, onClickCallback, disableControlsCallback, query = '') {
    container.classList.add('button-list-container'); 
    container.innerHTML = '';
    medicines.forEach((medicine, index) => {
        const button = createButton(medicine, 'medicine-button', query);
        button.dataset.name = medicine; 
        button.addEventListener("click", () => {
            onClickCallback(medicine, button, descriptions[index]);
            disableControlsCallback();
        });
        container.appendChild(button);
    });
    container.scrollTop = 0;
}

function createButton(text, buttonClass, query = '') {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(buttonClass);
    button.id = text.toLowerCase();

    return button;
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
            return b.toLowerCase().localeCompare(a.toLowerCase());
        } else if (criteria === 'a-z') {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }
        return 0;
    });
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
    deleteButton.textContent = 'Delete';
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

const placeholders = await fetchPlaceholders(getMetadata("locale"));
const { sNo } = placeholders;
export default async function decorate() {
    const leftCard = document.querySelector('.second-interactive-cards > div:nth-child(1)');
    const rightCard = document.querySelector('.second-interactive-cards > div:nth-child(2)');

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
        let selectedMedicine = null;

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
        descriptionTextBox.readOnly = true; 

        descriptionContainer.appendChild(descriptionTextBox);

        if (descriptionTextElement) {
            descriptionTextElement.replaceWith(descriptionContainer);
        }

        function handleDiseaseSelection(disease, medicines, button, descriptions) {
            if (selectedDisease !== disease) {
                if (selectedDisease) {
                    const prevSelectedButton = diseasesContainer.querySelector(`.disease-button[data-name="${selectedDisease}"]`);
                    unmarkButtonAsSelected(prevSelectedButton);
                    deleteSelectedMedicine();
                }

                markButtonAsSelected(button);
                selectedDisease = disease;

                createSelectedItem(selectedDiseasesSection, disease, () => {
                    unmarkButtonAsSelected(button);
                    selectedDisease = null;
                    updateSelectedDiseases();
                    enableDiseaseControls();
                    enableMedicineControls();
                }, true).dataset.name = disease;

                createMedicineButtons(medicinesContainer, medicines, descriptions, (medicine, medicineButton, description) => {
                    handleMedicineSelection(medicine, medicineButton, description);
                }, enableMedicineControls);

                disableDiseaseControls();
            }
        }

        function handleMedicineSelection(medicine, button, description) {
            if (selectedMedicine) {
                const prevSelectedButton = medicinesContainer.querySelector(`.medicine-button[data-name="${selectedMedicine}"]`);
                unmarkButtonAsSelected(prevSelectedButton);

                const selectedMedicineItem = selectedMedicinesSection.querySelector(`.selected-item[data-name="${selectedMedicine}"]`);
                selectedMedicineItem?.remove();
            }

            markButtonAsSelected(button);
            selectedMedicine = medicine;

            createSelectedItem(selectedMedicinesSection, medicine, () => {
                unmarkButtonAsSelected(button);
                selectedMedicine = null;
                updateSelectedDiseases();
                enableMedicineControls();
            }).dataset.name = medicine;

            descriptionTextBox.value = description;
            descriptionTitle.classList.remove('no-result');

            disableDiseaseControls(); // Disable disease controls when a medicine is selected
        }

        function deleteSelectedMedicine() {
            if (selectedMedicine) {
                const selectedMedicineItem = selectedMedicinesSection.querySelector(`.selected-item[data-name="${selectedMedicine}"]`);
                selectedMedicineItem?.remove();

                const selectedMedicineButton = medicinesContainer.querySelector(`.medicine-button[data-name="${selectedMedicine}"]`);
                selectedMedicineButton?.classList.remove('selected');

                selectedMedicine = null;
            }
        }

        function disableDiseaseControls() {
            diseaseSearchInput.disabled = true;
            diseaseSortDropdown.disabled = true;
            Array.from(diseasesContainer.querySelectorAll('.disease-button')).forEach(button => {
                button.disabled = true;
            });
        }

        function enableDiseaseControls() {
            diseaseSearchInput.disabled = false;
            diseaseSortDropdown.disabled = false;
            Array.from(diseasesContainer.querySelectorAll('.disease-button')).forEach(button => {
                button.disabled = false;
            });
        }

        function disableMedicineControls() {
            medicineSearchInput.disabled = true;
            medicineSortDropdown.disabled = true;
        }

        function enableMedicineControls() {
            medicineSearchInput.disabled = false;
            medicineSortDropdown.disabled = false;
        }

        function updateSelectedDiseases() {
            Array.from(selectedDiseasesSection.querySelectorAll('.selected-item[data-type="disease"]')).forEach(diseaseItem => {
                const diseaseName = diseaseItem.dataset.name;
                if (selectedDisease !== diseaseName) {
                    diseaseItem.remove();
                    deleteSelectedMedicine();
                }
            });

            enableMedicineControls();
            enableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));

            if (Array.from(selectedDiseasesSection.querySelectorAll('.selected-item[data-type="disease"]')).length === 0) {
                selectedDisease = null;
                enableDiseaseControls();
            } else {
                if (!selectedDisease && selectedMedicine) {
                    const medicineButton = medicinesContainer.querySelector(`.medicine-button[data-name="${selectedMedicine}"]`);
                    if (medicineButton) {
                        unmarkButtonAsSelected(medicineButton);
                    }
                    selectedMedicine = null;
                }
            }
        }
    }
}
