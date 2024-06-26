import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

// Fetch placeholders from AEM
const placeholders = await fetchPlaceholders(getMetadata("locale"));

// Destructure placeholders
const { sNo } = placeholders;

// Function to create table header
async function createTableHeader(table) {
    let tr = document.createElement("tr");
    let sno = document.createElement("th");
    sno.appendChild(document.createTextNode(sNo));
    let diseaseHeader = document.createElement("th");
    diseaseHeader.appendChild(document.createTextNode("Disease"));
    let medicineHeader = document.createElement("th");
    medicineHeader.appendChild(document.createTextNode("Medicine"));
    tr.append(sno);
    tr.append(diseaseHeader);
    tr.append(medicineHeader);
    table.append(tr);
}

// Function to create table row
async function createTableRow(table, row, i) {
    let tr = document.createElement("tr");
    let sno = document.createElement("td");
    sno.appendChild(document.createTextNode(i));
    let disease = document.createElement("td");
    disease.appendChild(document.createTextNode(row.Disease));
    let medicine = document.createElement("td");
    medicine.appendChild(document.createTextNode(row.Medicine));
    tr.append(sno);
    tr.append(disease);
    tr.append(medicine);
    table.append(tr);
}

// Function to create table
async function createTable(jsonURL) {
    // Fetch data from JSON URL
    const resp = await fetch(jsonURL);
    const json = await resp.json();
    
    // Create table element
    const table = document.createElement('table');
    createTableHeader(table);
    
    // Iterate over data and create table rows
    json.data.forEach((row, i) => {
        createTableRow(table, row, (i + 1));
    });
    
    return table;
}

// Export default function
export default async function decorate(block) {
    const jsonLink = block.querySelector('a[href$=".json"]');
    const parentDiv = document.createElement('div');
    parentDiv.classList.add('medicines-block');

    if (jsonLink) {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('medicines-block');

        parentDiv.append(await createTable(jsonLink.href));
        block.replaceWith(parentDiv);
    }
}
