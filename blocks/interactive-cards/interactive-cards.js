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
            onClickCallback(disease.Disease, disease.Medicine.split(', '), button);
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


function createMedicineButtons(container, medicines, onClickCallback, disableControlsCallback, query = '') {
    container.innerHTML = '';
    medicines.forEach((medicine) => {
        const button = document.createElement("button");
        button.textContent = medicine;
        button.classList.add("disease-button");

        // Highlight search results in red
        if (query && medicine.toLowerCase().includes(query.toLowerCase())) {
            button.classList.add('search-result');
        }

        button.addEventListener("click", () => {
            onClickCallback(medicine, button);
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

        createMedicineButtons(medicinesContainer, allMedicines, handleMedicineSelection, enableMedicineControls);

        const medicineSearchInput = createSearchInput(rightCard, 'Search medicines...', (event) => {
            const query = event.target.value.toLowerCase();
            const filteredMedicines = allMedicines.filter(medicine => medicine.toLowerCase().includes(query));
            createMedicineButtons(medicinesContainer, filteredMedicines, handleMedicineSelection, enableMedicineControls);
        });

        const medicineSortDropdown = createSortDropdown(rightCard, (event) => {
            const sortedMedicines = sortItems(allMedicines, event.target.value);
            createMedicineButtons(medicinesContainer, sortedMedicines, handleMedicineSelection, enableMedicineControls);
        });

        rightCard.appendChild(medicinesContainer);

        const selectedDiseasesSection = createSelectedItemsSection(leftCard, 'selected-diseases');
        const selectedMedicinesSection = createSelectedItemsSection(rightCard, 'selected-medicines');

        createDiseaseButtons(diseasesContainer, diseases, handleDiseaseSelection, disableDiseaseControls);
        createMedicineButtons(medicinesContainer, allMedicines, handleMedicineSelection, enableMedicineControls);

        function handleDiseaseSelection(disease, medicines, button) {
            if (selectedDisease !== disease) {
                if (selectedDisease) {
                    const prevSelectedButton = diseasesContainer.querySelector(`.disease-button[data-name="${selectedDisease}"]`);
                    unmarkButtonAsSelected(prevSelectedButton);
                    selectedDisease = null;
                    selectedMedicines[selectedDisease] = [];
                    updateSelectedDiseases();
                    enableDiseaseControls();
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
                }, true).dataset.name = disease;

                createMedicineButtons(medicinesContainer, medicines, (medicine, medicineButton) => {
                    if (!selectedMedicines[disease].includes(medicine)) {
                        markButtonAsSelected(medicineButton);
                        selectedMedicines[disease].push(medicine);
                        createSelectedItem(selectedMedicinesSection, medicine, () => {
                            unmarkButtonAsSelected(medicineButton);
                            selectedMedicines[disease].splice(selectedMedicines[disease].indexOf(medicine), 1);
                            updateSelectedDiseases();
                            enableMedicineControls();
                        }).dataset.name = medicine;
                        disableButtons(Array.from(medicinesContainer.querySelectorAll('.disease-button')));
                    }
                }, disableMedicineControls);
                disableDiseaseControls();
            } else {
                // If the same disease is selected again, do nothing
            }
        }

        function handleMedicineSelection(medicine, button) {
            if (!selectedDisease || !selectedMedicines[selectedDisease].includes(medicine)) {
                markButtonAsSelected(button);
                createSelectedItem(selectedMedicinesSection, medicine, () => {
                    unmarkButtonAsSelected(button);
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
        }

        function enableMedicineButton(medicineName) {
            const button = medicinesContainer.querySelector(`.medicine-button[data-name="${medicineName}"]`);
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

        function updateSelectedDiseases() {
            const allSelectedDiseases = Array.from(selectedDiseasesSection.querySelectorAll('.selected-item[data-type="disease"]'));
            allSelectedDiseases.forEach(diseaseItem => {
                const diseaseName = diseaseItem.dataset.name;
                if (selectedDisease !== diseaseName) {
                    diseaseItem.remove();
                }
            });

            const allSelectedMedicines = Array.from(selectedMedicinesSection.querySelectorAll('.selected-item[data-type="medicine"]'));
            allSelectedMedicines.forEach(medicineItem => {
                const medicineName = medicineItem.dataset.name;
                let shouldRemove = true;

                for (const disease in selectedMedicines) {
                    if (selectedMedicines[disease].includes(medicineName)) {
                        shouldRemove = false;
                        break;
                    }
                }

                if (shouldRemove) {
                    medicineItem.remove();
                    enableMedicineButton(medicineName); // Enable the corresponding medicine button
                }
            });
        }
    }
}
