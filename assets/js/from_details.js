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
const request = indexedDB.open("FromDatabase", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("froms", { keyPath: "id", autoIncrement: true });
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
    
    const nameInput = document.getElementById("from_to_name");
    const emailInput = document.getElementById("email");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let t = window.translations?.setting_client_details || {};
    
    // Reset any previous error styles
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

//     const fromtData = {
//         name: document.getElementById("from_to_name").value,
//         email: document.getElementById("email").value,
//         address: document.getElementById("from-to-street-input").value,
//         cityState: document.getElementById("from-to-city-state-input").value,
//         zipCode: document.getElementById("from-to-zip-code-input").value,
//         phone: document.getElementById("phone").value,
//         business_number: document.getElementById("business_number").value,
//         from_website: document.getElementById("from_website").value,
//         from_business_owner_name: document.getElementById("from_business_owner_name").value,
//     };

//     const { encryptedData, iv, key } = await encryptData(fromtData);
//     const transaction = db.transaction(["froms"], "readwrite");
//     const objectStore = transaction.objectStore("froms");

//     objectStore.add({ encryptedData, iv, key });
//     // transaction.oncomplete = () => displayData();

//     // location.reload();
//     // transaction.oncomplete = () => {
//     //     displayData();
//     //     clearForm();
//     //     Swal.fire({
//     //         icon: 'success',
//     //         title: 'Saved!',
//     //         text: 'From data has been saved successfully.',
//     //         timer: 2000,
//     //         showConfirmButton: false
//     //     }).then(() => {
//     //         location.reload();
//     //     });
//     // };

// }

// Update saveData function to include editing
async function saveData() {
    if (!validateForm()) return;

    const fromId = document.getElementById("from_id").value;

    const fromData = {
        name: document.getElementById("from_to_name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("from-to-street-input").value,
        cityState: document.getElementById("from-to-city-state-input").value,
        zipCode: document.getElementById("from-to-zip-code-input").value,
        phone: document.getElementById("phone").value,
        business_number: document.getElementById("business_number").value,
        from_website: document.getElementById("from_website").value,
        from_business_owner_name: document.getElementById("from_business_owner_name").value,
    };

    const { encryptedData, iv, key } = await encryptData(fromData);
    const transaction = db.transaction(["froms"], "readwrite");
    const objectStore = transaction.objectStore("froms");

    if (fromId) {
        objectStore.put({ id: Number(fromId), encryptedData, iv, key });
    } else {
        objectStore.add({ encryptedData, iv, key });
    }
    let t = window.translations?.setting_from_details || {};
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
    document.getElementById("from_to_name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("from-to-street-input").value = '';
    document.getElementById("from-to-city-state-input").value = '';
    document.getElementById("from-to-zip-code-input").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("business_number").value = '';
    document.getElementById("from_website").value = '';
    document.getElementById("from_business_owner_name").value = '';
}

// display table
async function displayData() {
    const transaction = db.transaction(['froms'], 'readonly');
    const objectStore = transaction.objectStore('froms');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const froms = event.target.result;
        froms.sort((a, b) => b.id - a.id);

        const tbody = document.querySelector('#from-details-table tbody');
        tbody.innerHTML = '';

        for (const from of froms) {
            const decryptedFrom = await decryptData(from.encryptedData, from.iv, from.key);

            const row = tbody.insertRow();
            row.insertCell(0).textContent = from.id;
            row.insertCell(1).textContent = decryptedFrom.name;
            row.insertCell(2).textContent = decryptedFrom.email;
            row.insertCell(3).textContent = decryptedFrom.address;
            row.insertCell(4).textContent = decryptedFrom.cityState;
            row.insertCell(5).textContent = decryptedFrom.zipCode;
            row.insertCell(6).textContent = decryptedFrom.phone;
            row.insertCell(7).textContent = decryptedFrom.business_number;
            row.insertCell(8).textContent = decryptedFrom.from_website;
            row.insertCell(9).textContent = decryptedFrom.from_business_owner_name;

            const actionsCell = row.insertCell(10);

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.classList.add('btn', 'btn-sm', 'm-1', 'btn-outline-secondary', 'edit-btn');
            editBtn.onclick = () => editRecord(from.id);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.classList.add('btn', 'btn-sm', 'm-1', 'btn-outline-secondary', 'edit-btn');
            deleteBtn.onclick = () => deleteRecord(from.id);
            actionsCell.appendChild(deleteBtn);
        }
        if ($.fn.DataTable.isDataTable('#from-details-table')) {
            $('#from-details-table').DataTable().clear().destroy();
        }
        DatatableLanguage('#from-details-table');
    };
}

// Delete individual record
function deleteRecord(id) {
    let t = window.translations?.setting_from_details || {};
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

            const transaction = db.transaction("froms", "readwrite");
            const objectStore = transaction.objectStore("froms");
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
    let t = window.translations?.setting_from_details || {};
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

            const transaction = db.transaction("froms", "readwrite");
            const objectStore = transaction.objectStore("froms");
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
    const transaction = db.transaction(['froms'], 'readonly');
    const objectStore = transaction.objectStore('froms');
    const request = objectStore.get(id);

    request.onsuccess = async (event) => {
        const from = event.target.result;
        if (from) {
            const decryptedFrom = await decryptData(from.encryptedData, from.iv, from.key);

            document.getElementById("from_id").value = id;
            document.getElementById("from_to_name").value = decryptedFrom.name;
            document.getElementById("email").value = decryptedFrom.email;
            document.getElementById("from-to-street-input").value = decryptedFrom.address;
            document.getElementById("from-to-city-state-input").value = decryptedFrom.cityState;
            document.getElementById("from-to-zip-code-input").value = decryptedFrom.zipCode;
            document.getElementById("phone").value = decryptedFrom.phone;
            document.getElementById("business_number").value = decryptedFrom.business_number;
            document.getElementById("from_website").value = decryptedFrom.from_website;
            document.getElementById("from_business_owner_name").value = decryptedFrom.from_business_owner_name;

        }
    };
}

// Export from data to CSV
async function exportDataToCSV() {
    const transaction = db.transaction(['froms'], 'readonly');
    const objectStore = transaction.objectStore('froms');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const froms = event.target.result;
        const rows = [];

        rows.push(['ID', 'Name', 'Email', 'Address', 'City/State', 'Zip Code', 'Phone', 'Mobile', 'Business number', 'Website', 'Business Owner Name']);

        for (const from of froms) {
            try {
                const decryptedFrom = await decryptData(from.encryptedData, from.iv, from.key);
                rows.push([
                    from.id,
                    decryptedFrom.name,
                    decryptedFrom.email,
                    decryptedFrom.address,
                    decryptedFrom.cityState,
                    decryptedFrom.zipCode,
                    decryptedFrom.phone,
                    decryptedFrom.business_number,
                    decryptedFrom.from_website,
                    decryptedFrom.from_business_owner_name,
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
        link.download = "from_data.csv";
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
                "ID", "Name", "Email", "Address", "City/State", "Zip Code", "Phone", "Business number", "Website", "Business Owner Name"
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
                const [id, name, email, address, cityState, zipCode, phone, business_number, from_website, from_business_owner_name] = sanitizedRow;
                if (!id) continue;

                const fromData = { id, name, email, address, cityState, zipCode, phone, business_number, from_website, from_business_owner_name };
                const { encryptedData, iv, key } = await encryptData(fromData);

                const transaction = db.transaction(['froms'], 'readwrite');
                const objectStore = transaction.objectStore('froms');
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
    const demoCSV = `ID,Name,Email,Address,City/State,Zip Code,Phone,Business number,Website,Business Owner Name
    1,John Doe,john@example.com,123 Main St,New York/NY,10001,+1 (234) 567-8901,BN123,johnswebsite.com,John Doe Sr.
    2,Jane Smith,jane@example.com,456 Elm St,Los Angeles/CA,90001,+1 (567) 234-8901,BN456,janesmith.com,Jane Smith Sr.
    3,Bob Johnson,bob@example.com,789 Oak St,Chicago/IL,60601,+1 (890) 567-2345,BN789,bobjohnson.com,Bob Johnson Sr.
    4,Alice Brown,alice@example.com,321 Pine St,Houston/TX,77001,+1 (432) 765-0987,BN321,alicebrown.com,Alice Brown Sr.`;

    const blob = new Blob([demoCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo_froms.csv';
    a.click();
});
