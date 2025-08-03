"use strict";

// night mode
$(document).ready(function () {
    setTimeout(function () {
        $('#nightModeToggle').bootstrapToggle();

        if (localStorage.getItem('nightMode') === 'on') {
            $('body').addClass('night-mode');

            const selectedColor = '#17222a';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);
            const wColor = "#ffffff"
            document.documentElement.style.setProperty('--w-color', wColor);

            const black = "#ffffff"
            document.documentElement.style.setProperty('--black', black);
            const cardColor = "#000000"
            document.documentElement.style.setProperty('--card-color', cardColor);
            const tableRowColor = "#ffffff"
            document.documentElement.style.setProperty('--table-row-color', tableRowColor);

            $('#nightModeToggle').prop('checked', true).bootstrapToggle('on');
        }

        $('#nightModeToggle').change(function () {
            if ($(this).is(':checked')) {

                const selectedColor = '#17222a';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wColor = "#ffffff"
                document.documentElement.style.setProperty('--w-color', wColor);

                const black = "#ffffff"
                document.documentElement.style.setProperty('--black', black);
                const cardColor = "#000000"
                document.documentElement.style.setProperty('--card-color', cardColor);
                const tableRowColor = "#ffffff"
                document.documentElement.style.setProperty('--table-row-color', tableRowColor);

                $('body').addClass('night-mode');
                localStorage.setItem('nightMode', 'on');
            } else {

                const selectedColor = '#048b9f';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wColor = "#ffffff"
                document.documentElement.style.setProperty('--w-color', wColor);

                const black = "#000000"
                document.documentElement.style.setProperty('--black', black);
                const cardColor = "white"
                document.documentElement.style.setProperty('--card-color', cardColor);
                const tableRowColor = "black"
                document.documentElement.style.setProperty('--table-row-color', tableRowColor);

                $('body').removeClass('night-mode');
                localStorage.setItem('nightMode', 'off');
            }
            location.reload();
        });
    }, 3000);
});
// end night mode

// Initialize IndexedDB
let db;
const request = indexedDB.open("ProductDatabase", 2);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    displayData();
};

// Encrypt data using Web Crypto API
async function encryptData(data) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
    return { encryptedData, iv, key };
}

// Decrypt data
async function decryptData(encryptedData, iv, key) {
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData);
}

// Validate form fields
function validateForm() {
    const skuInput = document.getElementById("sku");
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");

    const sku = skuInput.value.trim();
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();

    skuInput.classList.remove("is-invalid");
    nameInput.classList.remove("is-invalid");
    priceInput.classList.remove("is-invalid");

    let t = window.translations?.setting_import_product || {};
    if (sku === "") {
        skuInput.classList.add("is-invalid");
        return false;
    }

    if (name === "") {
        nameInput.classList.add("is-invalid");
        return false;
    }

    if (price === "") {
        priceInput.classList.add("is-invalid");
        return false;
    }


    return true;
}

// Update saveData function to include editing
async function saveData() {
    if (!validateForm()) return;

    const productId = document.getElementById("product_id").value;

    const productstData = {
        sku: document.getElementById("sku").value,
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
    };

    const { encryptedData, iv, key } = await encryptData(productstData);
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");

    if (productId) {
        objectStore.put({ id: Number(productId), encryptedData, iv, key });
    } else {
        objectStore.add({ encryptedData, iv, key });
    }

    transaction.oncomplete = () => {
        displayData();
        clearForm();
        let t = window.translations?.setting_import_product || {};
        Swal.fire({
            icon: 'success',
            title: t.swal_add_title,
            text: t.swal_add_text,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            location.reload();
        });
    };

}

// Clear the form fields
function clearForm() {
    document.getElementById("sku").value = '';
    document.getElementById("name").value = '';
    document.getElementById("price").value = '';
}

// display table
async function displayData() {
    const transaction = db.transaction(['products'], 'readonly');
    const objectStore = transaction.objectStore('products');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const products = event.target.result;
        products.sort((a, b) => b.id - a.id);

        const tbody = document.querySelector('#products-details-table tbody');
        tbody.innerHTML = '';

        for (const product of products) {
            const decryptedProduct = await decryptData(product.encryptedData, product.iv, product.key);

            const row = tbody.insertRow();
            row.insertCell(0).textContent = product.id;
            row.insertCell(1).textContent = decryptedProduct.sku;
            row.insertCell(2).textContent = decryptedProduct.name;
            row.insertCell(3).textContent = decryptedProduct.price;

            const actionsCell = row.insertCell(4);

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.classList.add('btn', 'btn-sm', 'me-2', 'btn-outline-secondary', 'edit-btn');
            editBtn.onclick = () => editRecord(product.id);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'edit-btn');
            deleteBtn.onclick = () => deleteRecord(product.id);
            actionsCell.appendChild(deleteBtn);
        }
        if ($.fn.DataTable.isDataTable('#products-details-table')) {
            $('#products-details-table').DataTable().clear().destroy();
        }
        DatatableLanguage('#products-details-table');
    };
}

// Delete individual record
function deleteRecord(id) {
    let t = window.translations?.setting_import_product || {};
    Swal.fire({
        title: t.swal_delete_title,
        text: t.swal_delete_text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t.swal_delete_confirm_btn,
        cancelButtonText: t.swal_delete_cancel_btn,
    }).then((result) => {
        if (result.isConfirmed) {

            const transaction = db.transaction("products", "readwrite");
            const objectStore = transaction.objectStore("products");
            objectStore.delete(id);

            transaction.oncomplete = () => {
                displayData();
                Swal.fire({
                    icon: 'success',
                    title: t.swal_delete_success_title,
                    text: t.swal_delete_success_text,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            };
        }
    });
}

// Clear all data from IndexedDB
function clearAllData() {
    let t = window.translations?.setting_import_product || {};
    Swal.fire({
        title: t.swal_all_delete_title,
        text: t.swal_all_delete_text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t.swal_all_delete_confirm_btn,
        cancelButtonText: t.swal_all_delete_cancel_btn,
    }).then((result) => {
        if (result.isConfirmed) {

            const transaction = db.transaction("products", "readwrite");
            const objectStore = transaction.objectStore("products");
            objectStore.clear();

            transaction.oncomplete = () => {
                displayData();
                Swal.fire({
                    icon: 'success',
                    title: t.swal_all_delete_success_title,
                    text: t.swal_all_delete_success_text,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            };
        }
    });
}

// Edit record
async function editRecord(id) {
    const transaction = db.transaction(['products'], 'readonly');
    const objectStore = transaction.objectStore('products');
    const request = objectStore.get(id);

    request.onsuccess = async (event) => {
        const product = event.target.result;
        if (product) {
            const decryptedProduct = await decryptData(product.encryptedData, product.iv, product.key);

            document.getElementById("product_id").value = id;
            document.getElementById("sku").value = decryptedProduct.sku;
            document.getElementById("name").value = decryptedProduct.name;
            document.getElementById("price").value = decryptedProduct.price;

        }
    };
}

// Export from data to CSV
async function exportDataToCSV() {
    const transaction = db.transaction(['products'], 'readonly');
    const objectStore = transaction.objectStore('products');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const products = event.target.result;
        const rows = [];

        rows.push(['ID', 'SKU', 'Name', 'Price']);

        for (const product of products) {
            try {
                const decryptedProduct = await decryptData(product.encryptedData, product.iv, product.key);
                rows.push([
                    product.id,
                    decryptedProduct.sku,
                    decryptedProduct.name,
                    decryptedProduct.price,
                ]);
            } catch (error) {
                console.error("Error decrypting from data:", error);
            }
        }

        const csvContent = rows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "products_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    request.onerror = () => {
        console.error("Failed to retrieve data from IndexedDB.");
    };
}

// Import CSV data into IndexedDB
document.getElementById('importDataBtn').addEventListener('click', function () {
    const file = document.getElementById('importFile').files[0];

    if (!file) return;
    let t = window.translations?.setting_client_details || {};
    if (!file.name.toLowerCase().endsWith('.csv')) {
        let t = window.translations?.setting_client_details || {};
        Swal.fire({
            icon: 'error',
            title: t.swal_invalid_file_title || 'Invalid File',
            text: t.swal_invalid_file_text || 'Please upload a valid CSV file.',
            confirmButtonText: 'OK'
        });
        return;
    }


    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const csvData = e.target.result;
            const rows = csvData.split('\n').map(row => row.split(','));

            // Expected headers
            const expectedHeaders = [
                "ID", "SKU", "Name", "Price"
            ];

            const actualHeaders = rows[0].map(h => h.replace(/"/g, '').trim().toLowerCase());
            const expectedLower = expectedHeaders.map(h => h.toLowerCase());

            // Validate column count and exact header match
            if (actualHeaders.length !== expectedHeaders.length || !expectedLower.every((h, i) => h === actualHeaders[i])) {
                let t = window.translations?.setting_client_details || {};
                Swal.fire({
                    icon: 'error',
                    title: t.swal_invalid_columns_title || 'Invalid CSV Format',
                    text: t.swal_invalid_columns_text + expectedHeaders.join(', ') || 'The CSV must include exactly these headers: ' + expectedHeaders.join(', '),
                    confirmButtonText: t.swal_invalid_columns_ok_btn || 'OK'
                });
                return;
            }

            rows.shift();

            for (const row of rows) {
                const sanitizedRow = row.map(value => value.replace(/"/g, '').trim());
                const [id, sku, name, price] = sanitizedRow;
                if (!id) continue;

                const ProductData = { id, sku, name, price };
                const { encryptedData, iv, key } = await encryptData(ProductData);

                const transaction = db.transaction(['products'], 'readwrite');
                const objectStore = transaction.objectStore('products');
                objectStore.add({ encryptedData, iv, key });
            }

            displayData();
            $('#importModal').modal('hide');

            let t = window.translations?.setting_client_details || {};
            Swal.fire({
                icon: 'success',
                title: t.swal_imported_title || 'Imported!',
                text: t.swal_imported_text || 'Data have been imported successfully.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                location.reload(); // optional: reload to refresh UI
            });



        };
        reader.readAsText(file);
    }
});

// Demo CSV download link
document.getElementById('demoLink').addEventListener('click', function () {
    const demoCSV = `ID,SKU,Name,Price
    1,Product1,Apple 10,10400
    2,Product2,Apple 11,10100
    3,Product3,Apple 12,10200
    4,Product4,Apple 13,10300`;

    const blob = new Blob([demoCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo_products.csv';
    a.click();
});
