// display download history
async function loadDownloadHistory() {
    try {
        const downloadHistory = await getAllFromDatabase();
        const tableBody = document.querySelector('#download-history-table tbody');
        tableBody.innerHTML = '';

        if (downloadHistory.length === 0) {
            const noDataMessage = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.setAttribute('colspan', 12);
            messageCell.textContent = 'No download history available.';
            messageCell.classList.add('text-center', 'text-muted');
            noDataMessage.appendChild(messageCell);
            tableBody.appendChild(noDataMessage);
            return;
        }

        downloadHistory.sort((a, b) => {
            const aId = a.id;
            const bId = b.id;
            return bId - aId;
        });

        var a = 0;
        downloadHistory.forEach(entry => {

            a++;

            const row = document.createElement('tr');

            const noCell = document.createElement('td');
            noCell.textContent = a;
            row.appendChild(noCell);

            const headingCell = document.createElement('td');
            headingCell.textContent = entry.heading;
            row.appendChild(headingCell);

            const invoiceNoCell = document.createElement('td');
            invoiceNoCell.textContent = entry.invoiceNo;
            row.appendChild(invoiceNoCell);

            const fromToCell = document.createElement('td');
            fromToCell.textContent = entry.from_name;
            row.appendChild(fromToCell);

            const billToCell = document.createElement('td');
            billToCell.textContent = entry.bill_to_name;
            row.appendChild(billToCell);

            const invoicePaymentDateCell = document.createElement('td');
            invoicePaymentDateCell.textContent = entry.invoicePaymentDate;
            row.appendChild(invoicePaymentDateCell);

            const invoicedueDateCell = document.createElement('td');
            invoicedueDateCell.textContent = entry.invoicedueDate;
            row.appendChild(invoicedueDateCell);

            const invoicePaymentMethodCell = document.createElement('td');
            if (entry.invoicePaymentMethod == "-") {
                invoicePaymentMethodCell.innerHTML = `<span class="text-danger">no payment method is selected</span>`;
            } else {
                invoicePaymentMethodCell.textContent = entry.invoicePaymentMethod;
            }
            row.appendChild(invoicePaymentMethodCell);

            const invoicePaymentStatusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.textContent = entry.invoicePaymentStatus;
            if (entry.invoicePaymentStatus.toLowerCase() === 'paid') {
                statusBadge.classList.add('badge', 'bg-success');
            } else {
                statusBadge.classList.add('badge', 'bg-danger');
            }
            invoicePaymentStatusCell.appendChild(statusBadge);
            row.appendChild(invoicePaymentStatusCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = entry.total;
            row.appendChild(totalCell);

            const invoiceAmountPaidCell = document.createElement('td');
            invoiceAmountPaidCell.textContent = entry.invoiceAmountPaid;
            row.appendChild(invoiceAmountPaidCell);


            // Action Cell with Three Dots and Dropdown Menu
            const actionCell = document.createElement('td');

            // Dropdown Button
            const dropdownDiv = document.createElement('div');
            dropdownDiv.classList.add('dropdown');

            const dropdownButton = document.createElement('button');
            dropdownButton.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'dropdown-toggle', 'delete-invoice');
            dropdownButton.setAttribute('type', 'button');
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.textContent = '';

            dropdownDiv.appendChild(dropdownButton);

            // Dropdown Menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.classList.add('dropdown-menu', 'dropdown-menu-up');

            //Download Option
            const downloadOption = document.createElement('li');
            const downloadOptionButton = document.createElement('button');
            downloadOptionButton.classList.add('dropdown-item');
            downloadOptionButton.textContent = 'Download';
            downloadOptionButton.addEventListener('click', async () => {
                const decryptedData = await decryptData(
                    new Uint8Array(entry.fileData), entry.key, entry.iv
                );
                await  downloadPDF({ ...entry, fileData: decryptedData });
            });
            downloadOption.appendChild(downloadOptionButton);
            dropdownMenu.appendChild(downloadOption);

            // Edit Option
            const editOption = document.createElement('li');
            const editOptionButton = document.createElement('button');
            editOptionButton.classList.add('dropdown-item');
            editOptionButton.textContent = 'Edit';
            editOptionButton.addEventListener('click', () => {
                window.location.href = `/invoice.html?id=${entry.id}`;
            });
            editOption.appendChild(editOptionButton);
            dropdownMenu.appendChild(editOption);

            // Delete Option
            const deleteOption = document.createElement('li');
            const deleteOptionButton = document.createElement('button');
            deleteOptionButton.classList.add('dropdown-item');
            deleteOptionButton.textContent = 'Delete';
            deleteOptionButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this invoice?')) {
                    await deleteInvoiceFromDatabase(entry.id);
                    loadDownloadHistory();
                }
            });
            deleteOption.appendChild(deleteOptionButton);
            dropdownMenu.appendChild(deleteOption);
            dropdownDiv.appendChild(dropdownMenu);

            // Payment Option
            const paymentOption = document.createElement('li');
            const paymentBtn = document.createElement('button');
            paymentBtn.classList.add('dropdown-item');
            paymentBtn.textContent = 'Payment';
            paymentBtn.addEventListener('click', () => {
                document.getElementById('id').value = entry.id;
                document.getElementById('paymentInvoiceNo').value = entry.invoiceNo;
                document.getElementById('paymentBillTo').value = entry.bill_to_name;
                document.getElementById('paymentTotal').value = entry.total;
                document.getElementById('paymentAmountPaid').value = entry.invoiceAmountPaid;
                document.getElementById('paymentDate').value = entry.invoicePaymentDate || '';
                document.getElementById('paymentMethod').value = entry.invoicePaymentMethod || '';
                const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
                paymentModal.show();
            });
            paymentOption.appendChild(paymentBtn);
            dropdownMenu.appendChild(paymentOption);

            // Append dropdown div to the action cell
            actionCell.appendChild(dropdownDiv);

            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
        // Initialize DataTable after the table is populated
        $('#download-history-table').DataTable();

    } catch (error) {
        console.error('Error while loading data from IndexedDB:', error);
    }
}
// end display download history

//================update payment 
document.getElementById('savePaymentDetails').addEventListener('click', async () => {
    const id = document.getElementById('id').value.trim();
    const paymentDate = document.getElementById('paymentDate').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value.trim();
    const paymentAmountPaid = document.getElementById('paymentAmountPaid').value.trim();
    let invoicePaymentStatus;

    loadingSpinner();

    if (!paymentDate || !paymentMethod) {
        alert('Please fill in all required fields.');
        loadingSpinnerStop();
        return;
    }
    try {
        // Open the database
        const db = await openDatabase();
        const transaction = db.transaction(["downloadHistory"], 'readwrite');
        const store = transaction.objectStore("downloadHistory");

        // Open a cursor to find the specific record
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                const record = cursor.value;
                // Check if the current record matches the given ID
                if (record.id == id) {
                    // console.log("Matching record found:", record);
                    if (paymentMethod == "-") {
                        invoicePaymentStatus = "Overdue";
                    } else {
                        invoicePaymentStatus = "Paid";
                    }
                    // Update the necessary fields
                    record.invoicePaymentDate = paymentDate;
                    record.invoicePaymentMethod = paymentMethod;
                    record.invoicePaymentStatus = invoicePaymentStatus;
                    record.invoiceAmountPaid = paymentAmountPaid;

                    // Save the updated record
                    const updateRequest = cursor.update(record);

                    updateRequest.onsuccess = () => {
                        // console.log("Record updated successfully:", record);
                        // alert("Payment details updated successfully!");
                        loadDownloadHistory(); // Reload the data after update
                        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                        paymentModal.hide();
                        loadingSpinnerStop();
                    };

                    updateRequest.onerror = (event) => {
                        console.error("Error updating record:", event.target.error);
                        loadingSpinnerStop();
                    };
                }

                // Continue to the next record
                cursor.continue();
            } else {
                // console.log("No more records.");
                loadingSpinnerStop();
            }
        };

        cursorRequest.onerror = (event) => {
            console.error('Error fetching records:', event.target.error);
            loadingSpinnerStop();
        };
    } catch (error) {
        console.error("Unexpected error:", error);

    }
});
function loadingSpinner() {
    document.getElementById('LoadSpinner').style.display = 'block';
    document.body.style.background = '#eee';
    document.body.style.cursor = 'not-allowed';
}
function loadingSpinnerStop() {
    setTimeout(function () {
        document.getElementById('LoadSpinner').style.display = 'none';
        document.body.style.background = '';
        document.body.style.cursor = '';
    }, 2000);
}

//=============== end update payment


// Decrypt data with AES-GCM
async function decryptData(encryptedData, key, iv) {
    const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        {
            name: "AES-GCM",
        },
        true,
        ["decrypt"]
    );

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(iv),
        },
        importedKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

async function encryptData(data) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
    return { encryptedData, iv, key };
}

// Function to download PDF from history
// async function downloadPDF(entry) {
    // const { jsPDF } = window.jspdf;
    // const pdf = new jsPDF('p', 'pt', 'a4');

    // const imgProps = pdf.getImageProperties(entry.fileData);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // const pageHeight = pdf.internal.pageSize.height;
    // const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
    // const numberOfPages = Math.ceil(totalHeight / pageHeight);

    // // Add the image to the PDF across multiple pages
    // for (let i = 0; i < numberOfPages; i++) {
    //     const yOffset = i * pageHeight;
    //     if (i > 0) {
    //         pdf.addPage();
    //     }
    //     pdf.addImage(entry.fileData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
    // }

//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF('p', 'pt', 'a4');

//     const imgProps = pdf.getImageProperties(entry.fileData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const adjustedHeight = pageHeight - 20; // Subtract 20px for white space at bottom

//     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     const totalHeight = imgHeight;
//     const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

//     for (let i = 0; i < numberOfPages; i++) {
//         const yOffset = -(i * adjustedHeight); // Offset for each page
//         if (i > 0) {
//             pdf.addPage();
//         }

//         // Draw the image
//         pdf.addImage(entry.fileData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

//         // Draw white rectangle for 20px bottom space
//         pdf.setFillColor(255, 255, 255); // Set color to white
//         pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw the rectangle
//     }

//     // Create filename and save the PDF

//     let filename = entry.invoiceNo + '_' + entry.heading + '.pdf';
//     filename = filename.replace(/\s+/g, '_');
//     pdf.save(filename);
// }
//end Function to download PDF from history


// PDF Download Function
async function downloadPDF(entry) {
    try {
        // Convert data URL to Blob if needed
        let blob;
        if (typeof entry.fileData === 'string' && entry.fileData.startsWith('data:')) {
            const response = await fetch(entry.fileData);
            blob = await response.blob();
        } else if (entry.fileData instanceof Blob) {
            blob = entry.fileData;
        } else {
            throw new Error('Unsupported file data format');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${entry.invoiceNo}_${entry.heading}.pdf`
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_\-.]/g, '');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}

// Load history when the page is ready
document.addEventListener('DOMContentLoaded', loadDownloadHistory);


// IndexedDB utility setup
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DownloadHistoryDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('downloadHistory')) {
                db.createObjectStore('downloadHistory', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error opening database:', event.target.errorCode);
        };
    });
}


function getAllFromDatabase() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readonly');
        const store = transaction.objectStore('downloadHistory');
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('Error retrieving data from database');
    });
}


// Function to clear all download history
async function clearAllHistory() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            window.location.href = 'history.html'
        };

        clearRequest.onerror = () => {
            console.error('Error clearing all download history.');
        };
    } catch (error) {
        console.error('Error while clearing data from IndexedDB:', error);
    }
}

async function deleteInvoiceFromDatabase(id) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
            console.log(`Invoice with ID ${id} deleted successfully.`);
        };

        deleteRequest.onerror = () => {
            console.error(`Error deleting invoice with ID ${id}.`);
        };
    } catch (error) {
        console.error('Error while deleting data from IndexedDB:', error);
    }
}

// "Clear All History" button
document.getElementById('clear-history-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all download history?')) {
        clearAllHistory();
    }
});


// Export from data to CSV
async function exportDataToCSV() {
    const db = await openDatabase();
    const transaction = db.transaction(['downloadHistory'], 'readonly');
    const objectStore = transaction.objectStore('downloadHistory');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const downloads = event.target.result;
        const rows = [];

        rows.push(['No', 'PDF Heading', 'Invoic No', 'From To', 'Bill To', 'Payment Date', 'Due Date', 'Payment Method', 'Status', 'Total', 'Amount Paid']);

        for (const download of downloads) {
            try {
                rows.push([
                    download.id,
                    download.heading,
                    download.invoiceNo,
                    download.from_name,
                    download.bill_to_name,
                    download.invoicePaymentDate,
                    download.invoicedueDate,
                    download.invoicePaymentMethod,
                    download.invoicePaymentStatus,
                    download.total,
                    download.invoiceAmountPaid,
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
        link.download = "invoice_history_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    request.onerror = () => {
        console.error("Failed to retrieve data from IndexedDB.");
    };
}



// night mode

$(document).ready(function () {
    $('#nightModeToggle').bootstrapToggle();

    if (localStorage.getItem('nightMode') === 'on') {
        $('body').addClass('night-mode');

        const selectedColor = '#17222a';
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        const lightColor = `${selectedColor}21`;
        document.documentElement.style.setProperty('--primary-light-color', lightColor);
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
            const tableRowColor = "#ffffff"
            document.documentElement.style.setProperty('--table-row-color', tableRowColor);



            $('body').addClass('night-mode');
            localStorage.setItem('nightMode', 'on');
        } else {

            const selectedColor = '#048b9f';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);
            const tableRowColor = "black"
            document.documentElement.style.setProperty('--table-row-color', tableRowColor);



            $('body').removeClass('night-mode');
            localStorage.setItem('nightMode', 'off');
        }
    });
});

// end night mode


