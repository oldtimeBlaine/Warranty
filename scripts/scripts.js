const recipientCheckboxes = document.querySelectorAll('input[name="recipient"]');
const sizeCheckboxes = document.querySelectorAll('input[name="sizeOption"]');
const replacementCheckboxes = document.querySelectorAll('input[name="replacementStatus"]');
const customerNameField = document.getElementById('customerNameField');
const brandSelect = document.getElementById('brand');
const poNumberField = document.getElementById('poNumberField');
const requestedBySelect = document.getElementById('requestedBy');
const sizeSMLField = document.getElementById('sizeSMLField');
const sizeNumbersField = document.getElementById('sizeNumbersField');
const sizeSMLSelect = document.getElementById('sizeSML');
const otherBrandField = document.getElementById('otherBrandField');
const datePurchased = document.getElementById('datePurchased');
const dateReturnedField = document.getElementById('dateReturnedField');
const partNumberField = document.getElementById('partNumber');
const serialNumberField = document.getElementById('serialNumberField');
const fileDropZone = document.getElementById('fileDropZone');
const fileSelect = document.getElementById('fileSelect');
const fileInput = document.getElementById('uploadFiles');
const fileList = document.getElementById('fileList');

// Checkbox behave like radio
function makeCheckboxesLikeRadios(checkboxes) {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                // Uncheck others
                checkboxes.forEach(c => {
                    if (c !== this) c.checked = false;
                });
            }
        });
    });
}

makeCheckboxesLikeRadios(recipientCheckboxes);
makeCheckboxesLikeRadios(sizeCheckboxes);
makeCheckboxesLikeRadios(replacementCheckboxes);

// Function to manage required attributes based on visibility
function updateRequiredFields(element) {
    if (element.classList.contains('hidden')) {
        Array.from(element.querySelectorAll('input, select, textarea')).forEach(field => {
            if (!['receiptNumber', 'color', 'sizeOptionSML', 'sizeOptionNumbers'].includes(field.id)) {
                field.removeAttribute('required');
            }
        });
    } else {
        Array.from(element.querySelectorAll('input, select, textarea')).forEach(field => {
            if (!['receiptNumber', 'color', 'sizeOptionSML', 'sizeOptionNumbers'].includes(field.id) &&
                !field.name.includes('recipient')) { // Exclude switches
                field.setAttribute('required', '');
            }
        });
    }
}

// Update required fields for all initially hidden elements
document.querySelectorAll('.hidden').forEach(e => updateRequiredFields(e));

// Manage required fields dynamically for visibility toggles
recipientCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (document.getElementById('customer').checked) {
            customerNameField.classList.remove('hidden');
        } else {
            customerNameField.classList.add('hidden');
        }
        updateRequiredFields(customerNameField);
    });
});

sizeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.id === 'sizeOptionSML') {
            sizeSMLField.classList.remove('hidden');
            sizeNumbersField.classList.add('hidden');
        } else if (this.id === 'sizeOptionNumbers') {
            sizeSMLField.classList.add('hidden');
            sizeNumbersField.classList.remove('hidden');
        } else {
            sizeSMLField.classList.add('hidden');
            sizeNumbersField.classList.add('hidden');
        }
        updateRequiredFields(sizeSMLField);
        updateRequiredFields(sizeNumbersField);
    });
});

// Update required fields dynamically for brand selection
brandSelect.addEventListener('change', () => {
    if (brandSelect.value === 'KLIM') {
        poNumberField.classList.remove('hidden');
        otherBrandField.classList.add('hidden');
        dateReturnedField.classList.add('hidden');
        serialNumberField.classList.add('hidden');
    } else if (brandSelect.value === 'Other') {
        poNumberField.classList.add('hidden');
        otherBrandField.classList.remove('hidden');
        dateReturnedField.classList.add('hidden');
        serialNumberField.classList.add('hidden');
    } else if (brandSelect.value === 'ALPINESTARS' || brandSelect.value === 'LEATT') {
        poNumberField.classList.add('hidden');
        otherBrandField.classList.add('hidden');
        dateReturnedField.classList.remove('hidden');
        serialNumberField.classList.add('hidden');
    } else if (brandSelect.value === 'AKRAPOVIC') {
        poNumberField.classList.add('hidden');
        otherBrandField.classList.add('hidden');
        dateReturnedField.classList.add('hidden');
        serialNumberField.classList.remove('hidden');
    } else {
        poNumberField.classList.add('hidden');
        otherBrandField.classList.add('hidden');
        dateReturnedField.classList.add('hidden');
        serialNumberField.classList.add('hidden');
    }

    // Ensure required attributes are updated
    updateRequiredFields(poNumberField);
    updateRequiredFields(otherBrandField);
    updateRequiredFields(dateReturnedField);
    updateRequiredFields(serialNumberField);
});

// Array of sales team
const requestedByArray = ["Blaine", "Sergio", "Peter", "Emile", "Georgio", "Tim", "Tina", "Mohammed", "Khalid", "Wissam", "Joe"];
requestedByArray.sort().forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    requestedBySelect.appendChild(option);
});

// Array of brands
const brandArray = ["AKRAPOVIC", "ALPINESTARS", "ARROW", "BAJA DESIGNS", "DAYTONA", "JOHN DOE", "KLIM", "KNOX", "LEATT", "QUAD LOCK", "RUKKA", "SP CONNECT", "WRS", "WUNDERLICH", "OTHER"];
brandArray.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
});

// Sizes SML
const sizeArray = ["3XS", "2XS", "XS", "Small", "Medium", "Large", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
sizeArray.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSMLSelect.appendChild(option);
});

// File upload handling
let totalSize = 0;
const maxFiles = 5;
const maxSize = 100 * 1024 * 1024; // 100MB in bytes

fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('dragover');
});

fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('dragover');
});

fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileSelect.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    let remainingSpace = maxSize - totalSize;
    let filesToAdd = [];

    for (let file of files) {
        if (filesToAdd.length >= maxFiles) {
            alert('Maximum of 5 files can be uploaded.');
            break;
        }
        if (totalSize + file.size > maxSize) {
            alert('Total file size exceeds the limit of 100MB. Remaining space: ' + (remainingSpace / (1024 * 1024)).toFixed(2) + ' MB');
            break;
        }
        totalSize += file.size;
        filesToAdd.push(file);
        remainingSpace -= file.size;
    }

    filesToAdd.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', () => removeFile(file, listItem));
        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
    });

    // Update input with new files for form submission
    const dataTransfer = new DataTransfer();
    Array.from(fileInput.files).concat(filesToAdd).forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
}

function removeFile(fileToRemove, listItem) {
    // Remove from total size calculation
    totalSize -= fileToRemove.size;

    // Remove from file input
    const dataTransfer = new DataTransfer();
    Array.from(fileInput.files).forEach(file => {
        if (file.name !== fileToRemove.name || file.size !== fileToRemove.size) {
            dataTransfer.items.add(file);
        }
    });
    fileInput.files = dataTransfer.files;

    // Remove the list item from the DOM
    fileList.removeChild(listItem);
}

let scrollPosition;

fileSelect.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default behavior
    scrollPosition = window.scrollY; // Save current scroll position
    fileInput.click(); // Trigger file input click
});

fileInput.addEventListener('click', () => {
    // This ensures the scroll position is saved even if the user clicks directly on the file input
    scrollPosition = window.scrollY;
});

// When the file dialog is closed, restore the scroll position
document.addEventListener('focus', function (e) {
    if (e.target === fileInput && scrollPosition !== undefined) {
        window.scrollTo(0, scrollPosition);
        scrollPosition = undefined; // Reset scrollPosition
    }
}, true);

document.getElementById('dynamicForm').addEventListener('submit', async function (e) {
    console.log('Form submission started');
    e.preventDefault();
    const submitButton = document.querySelector('button[type="submit"]');
    const loadingSpinner = document.querySelector('.loading-spinner');

    // Show loading spinner and disable submit button
    submitButton.classList.add('submit-loading');
    loadingSpinner.style.display = 'block';

    const formData = new FormData(this);

    // Convert files to base64
    const files = formData.getAll('uploadFiles');
    const base64Files = await Promise.all(files.map(async file => {
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
        return base64String;
    }));

    // Add base64 strings to formData
    base64Files.forEach(base64 => formData.append('uploadFiles', base64));

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Form submitted successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        })
        .finally(() => {
            // Hide loading spinner and re-enable submit button
            submitButton.classList.remove('submit-loading');
            loadingSpinner.style.display = 'none';
        });
});
