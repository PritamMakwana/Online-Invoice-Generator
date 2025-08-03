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
const request = indexedDB.open("ClientDatabase", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("clients", { keyPath: "id", autoIncrement: true });
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

    const nameInput = document.getElementById("bill_to_name");
    const emailInput = document.getElementById("email");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let t = window.translations?.setting_client_details || {};

    nameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");

    if (name === "") {
        nameInput.classList.add("is-invalid");
        return false;
    }

    if (!emailPattern.test(email)) {
        emailInput.classList.add("is-invalid");
        return false;
    }

    return true;
}

// Update saveData function to include validation
// async function saveData() {
//     if (!validateForm()) return;

//     const clientData = {
//         name: document.getElementById("bill_to_name").value,
//         email: document.getElementById("email").value,
//         address: document.getElementById("bill-to-street-input").value,
//         cityState: document.getElementById("bill-to-city-state-input").value,
//         zipCode: document.getElementById("bill-to-zip-code-input").value,
//         phone: document.getElementById("phone").value,
//         mobile: document.getElementById("mobile").value,
//         fax: document.getElementById("fax").value,
//     };

//     const { encryptedData, iv, key } = await encryptData(clientData);
//     const transaction = db.transaction(["clients"], "readwrite");
//     const objectStore = transaction.objectStore("clients");

//     objectStore.add({ encryptedData, iv, key });
//     transaction.oncomplete = () => displayData();

//     2Swal2.fire2({
//         icon: 'success',
//         title: 'Saved!',
//         text: 'Client data has been saved successfully.',
//         timer: 2000,
//         showConfirmButton: false
//     });

//     location.reload();

// }

// Update saveData function to include editing
async function saveData() {
    if (!validateForm()) return;

    const clientId = document.getElementById("client_id").value;

    const clientData = {
        name: document.getElementById("bill_to_name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("bill-to-street-input").value,
        cityState: document.getElementById("bill-to-city-state-input").value,
        zipCode: document.getElementById("bill-to-zip-code-input").value,
        phone: document.getElementById("phone").value,
        mobile: document.getElementById("mobile").value,
        fax: document.getElementById("fax").value,
    };

    const { encryptedData, iv, key } = await encryptData(clientData);
    const transaction = db.transaction(["clients"], "readwrite");
    const objectStore = transaction.objectStore("clients");

    if (clientId) {
        objectStore.put({ id: Number(clientId), encryptedData, iv, key });
    } else {
        objectStore.add({ encryptedData, iv, key });
    }

    let t = window.translations?.setting_client_details || {};
    transaction.oncomplete = () => {
        displayData();
        clearForm();
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
    document.getElementById("client_id").value = '';
    document.getElementById("bill_to_name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("bill-to-street-input").value = '';
    document.getElementById("bill-to-city-state-input").value = '';
    document.getElementById("bill-to-zip-code-input").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("mobile").value = '';
    document.getElementById("fax").value = '';
}

// display table
async function displayData() {
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const clients = event.target.result;
        clients.sort((a, b) => b.id - a.id);

        const tbody = document.querySelector('#client-details-table tbody');
        tbody.innerHTML = '';

        for (const client of clients) {
            const decryptedClient = await decryptData(client.encryptedData, client.iv, client.key);

            const row = tbody.insertRow();
            row.insertCell(0).textContent = client.id;
            row.insertCell(1).textContent = decryptedClient.name;
            row.insertCell(2).textContent = decryptedClient.email;
            row.insertCell(3).textContent = decryptedClient.address;
            row.insertCell(4).textContent = decryptedClient.cityState;
            row.insertCell(5).textContent = decryptedClient.zipCode;
            row.insertCell(6).textContent = decryptedClient.phone;
            row.insertCell(7).textContent = decryptedClient.mobile;
            row.insertCell(8).textContent = decryptedClient.fax;

            const actionsCell = row.insertCell(9);

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.classList.add('btn', 'btn-sm', 'm-1', 'btn-outline-secondary', 'edit-btn');
            editBtn.onclick = () => editRecord(client.id);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.classList.add('btn', 'btn-sm', 'm-1', 'btn-outline-secondary', 'edit-btn');
            deleteBtn.onclick = () => deleteRecord(client.id);
            actionsCell.appendChild(deleteBtn);
        }

        if ($.fn.DataTable.isDataTable('#client-details-table')) {
            $('#client-details-table').DataTable().clear().destroy();
        }
        DatatableLanguage('#client-details-table');
    };
}

// Delete individual record
function deleteRecord(id) {

    let t = window.translations?.setting_client_details || {};
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
            const transaction = db.transaction("clients", "readwrite");
            const objectStore = transaction.objectStore("clients");
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
    let t = window.translations?.setting_client_details || {};
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
            const transaction = db.transaction("clients", "readwrite");
            const objectStore = transaction.objectStore("clients");
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
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.get(id);

    request.onsuccess = async (event) => {
        const client = event.target.result;
        if (client) {
            const decryptedClient = await decryptData(client.encryptedData, client.iv, client.key);

            document.getElementById("client_id").value = id;
            document.getElementById("bill_to_name").value = decryptedClient.name;
            document.getElementById("email").value = decryptedClient.email;
            document.getElementById("bill-to-street-input").value = decryptedClient.address;
            document.getElementById("bill-to-city-state-input").value = decryptedClient.cityState;
            document.getElementById("bill-to-zip-code-input").value = decryptedClient.zipCode;
            document.getElementById("phone").value = decryptedClient.phone;
            document.getElementById("mobile").value = decryptedClient.mobile;
            document.getElementById("fax").value = decryptedClient.fax;
        }
    };
}

// Export client data to CSV
async function exportDataToCSV() {
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const clients = event.target.result;
        const rows = [];

        // Prepare CSV headers
        rows.push(['ID', 'Name', 'Email', 'Address', 'City/State', 'Zip Code', 'Phone', 'Mobile', 'Fax']);

        // Prepare rows with decrypted client data
        for (const client of clients) {
            try {
                const decryptedClient = await decryptData(client.encryptedData, client.iv, client.key);
                rows.push([
                    client.id,
                    decryptedClient.name,
                    decryptedClient.email,
                    decryptedClient.address,
                    decryptedClient.cityState,
                    decryptedClient.zipCode,
                    decryptedClient.phone,
                    decryptedClient.mobile,
                    decryptedClient.fax
                ]);
            } catch (error) {
                console.error("Error decrypting client data:", error);
            }
        }

        // Generate CSV content
        const csvContent = rows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Create download link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "client_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release URL
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
                "ID", "Name", "Email", "Address", "City/State",
                "Zip Code", "Phone", "Mobile", "Fax"
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
                const [id, name, email, address, cityState, zipCode, phone, mobile, fax] = sanitizedRow;
                if (!id) continue;

                const clientData = { id, name, email, address, cityState, zipCode, phone, mobile, fax };
                const { encryptedData, iv, key } = await encryptData(clientData);

                const transaction = db.transaction(['clients'], 'readwrite');
                const objectStore = transaction.objectStore('clients');
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
    const demoCSV = `ID,Name,Email,Address,City/State,Zip Code,Phone,Mobile,Fax
1,John Doe,john@example.com,123 Main St,New York/NY,10001,+1 (123) 456-7890,+1 (234) 567-8901,+1 (345) 678-9012
2,Jane Smith,jane@example.com,456 Elm St,Los Angeles/CA,90001,+1 (456) 123-7890,+1 (567) 234-8901,+1 (678) 345-9012
3,Bob Johnson,bob@example.com,789 Oak St,Chicago/IL,60601,+1 (789) 456-1234,+1 (890) 567-2345,+1 (901) 678-3456
4,Alice Brown,alice@example.com,321 Pine St,Houston/TX,77001,+1 (321) 654-9876,+1 (432) 765-0987,+1 (543) 876-1098`;

    const blob = new Blob([demoCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo_clients.csv';
    a.click();
});