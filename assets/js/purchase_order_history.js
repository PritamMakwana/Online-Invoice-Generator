"use strict";

// display download history
async function loadDownloadHistory() {
    try {
        const downloadHistory = await getAllFromDatabase();
        const tableBody = document.querySelector('#download-history-table tbody');
        tableBody.innerHTML = '';
        let t = window.translations?.invoice_history || {};

        // if (downloadHistory.length === 0) {
        //     const noDataMessage = document.createElement('tr');
        //     const messageCell = document.createElement('td');
        //     messageCell.setAttribute('colspan', 11);
        //     messageCell.textContent =  "" + t.no_history;
        //     messageCell.classList.add('text-center', 'text-muted');
        //     noDataMessage.appendChild(messageCell);
        //     tableBody.appendChild(noDataMessage);
        //     return;
        // }

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

            // const invoicedueDateCell = document.createElement('td');
            // invoicedueDateCell.textContent = entry.invoicedueDate;
            // row.appendChild(invoicedueDateCell);

            // const invoicePaymentMethodCell = document.createElement('td');
            // if (entry.invoicePaymentMethod == "-") {
            //     invoicePaymentMethodCell.innerHTML = `<span class="text-danger">no payment method is selected</span>`;
            // } else {
            //     invoicePaymentMethodCell.textContent = entry.invoicePaymentMethod;
            // }
            // row.appendChild(invoicePaymentMethodCell);

            const invoicePaymentStatusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.textContent = entry.invoicePaymentStatus;
            statusBadge.classList.add('badge', 'bg-success');
            invoicePaymentStatusCell.appendChild(statusBadge);
            statusBadge.setAttribute('data-i18n', 'purchase_history.td_status_created');
            row.appendChild(invoicePaymentStatusCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = entry.total;
            row.appendChild(totalCell);

            // const invoiceAmountPaidCell = document.createElement('td');
            // invoiceAmountPaidCell.textContent = entry.invoiceAmountPaid;
            // row.appendChild(invoiceAmountPaidCell);


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
            downloadOptionButton.setAttribute('data-i18n', 'purchase_history.td_option_download');
            downloadOptionButton.textContent = 'Download';
            downloadOptionButton.addEventListener('click', async () => {
                const decryptedData = await decryptData(
                    new Uint8Array(entry.fileData), entry.key, entry.iv
                );
                await downloadPDF({ ...entry, fileData: decryptedData });
            });
            downloadOption.appendChild(downloadOptionButton);
            dropdownMenu.appendChild(downloadOption);

            // Edit Option
            const editOption = document.createElement('li');
            const editOptionButton = document.createElement('button');
            editOptionButton.classList.add('dropdown-item');
            editOptionButton.setAttribute('data-i18n', 'purchase_history.td_option_edit');
            editOptionButton.textContent = 'Edit';
            editOptionButton.addEventListener('click', () => {
                window.location.href = `/purchase-order-generator.html?id=${entry.id}`;
            });
            editOption.appendChild(editOptionButton);
            dropdownMenu.appendChild(editOption);

            // Delete Option
            const deleteOption = document.createElement('li');
            const deleteOptionButton = document.createElement('button');
            deleteOptionButton.classList.add('dropdown-item');
            deleteOptionButton.setAttribute('data-i18n', 'purchase_history.td_option_delete');
            deleteOptionButton.textContent = 'Delete';
            deleteOptionButton.addEventListener('click', async () => {
                // if (confirm('Are you sure you want to delete this purchase order?')) {
                //     await deleteInvoiceFromDatabase(entry.id);
                //     loadDownloadHistory();
                // }
                const t = window.translations?.invoice_history || {};
                Swal.fire({
                    title: t.swal_delete_title,
                    text: t.swal_delete_text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: t.swal_delete_confirm_btn,
                    cancelButtonText: t.swal_delete_cancel_btn,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteInvoiceFromDatabase(entry.id);
                        loadDownloadHistory();
                        Swal.fire({
                            icon: 'success',
                            title: t.swal_delete_success_title,
                            text: t.swal_delete_success_text,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload();
                        });
                    }
                });
            });
            deleteOption.appendChild(deleteOptionButton);
            dropdownMenu.appendChild(deleteOption);
            dropdownDiv.appendChild(dropdownMenu);

            // Append dropdown div to the action cell
            actionCell.appendChild(dropdownDiv);

            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
        // Initialize DataTable after the table is populated
        if ($.fn.DataTable.isDataTable('#download-history-table')) {
            $('#download-history-table').DataTable().clear().destroy();
        }
        DatatableLanguage('#download-history-table');

    } catch (error) {
        console.error('Error while loading data from IndexedDB:', error);
    }
}
// end display download history

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
// Function to download PDF from history
async function downloadPDF(entry) {
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

    // const { jsPDF } = window.jspdf;
    // const pdf = new jsPDF('p', 'pt', 'a4');

    // const imgProps = pdf.getImageProperties(entry.fileData);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    // const adjustedHeight = pageHeight - 20; // Subtract 20px for white space at bottom

    // const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    // const totalHeight = imgHeight;
    // const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

    // for (let i = 0; i < numberOfPages; i++) {
    //     const yOffset = -(i * adjustedHeight); // Offset for each page
    //     if (i > 0) {
    //         pdf.addPage();
    //     }

    //     // Draw the image
    //     pdf.addImage(entry.fileData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

    //     // Draw white rectangle for 20px bottom space
    //     pdf.setFillColor(255, 255, 255); // Set color to white
    //     pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw the rectangle
    // }

    // // Create filename and save the PDF

    // let filename = entry.invoiceNo + '_' + entry.heading + '.pdf';
    // filename = filename.replace(/\s+/g, '_');
    // pdf.save(filename);
    // // =========================


    // const { jsPDF } = window.jspdf;

    // // Increase scale factor for higher resolution
    // const pdf = new jsPDF({
    //     orientation: 'p',
    //     unit: 'pt',
    //     format: 'a4',
    //     compress: false, // Enable compression for smaller PDF size
    // });

    // pdf.internal.scaleFactor = 5; // Improve resolution

    // const imgProps = pdf.getImageProperties(entry.fileData);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();
    // const adjustedHeight = pageHeight - 20; // Leave 20px space at the bottom

    // // Maintain aspect ratio properly
    // const imgRatio = imgProps.width / imgProps.height;
    // const imgHeight = pdfWidth / imgRatio;
    // const totalHeight = imgHeight;
    // const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

    // for (let i = 0; i < numberOfPages; i++) {
    //     const yOffset = -(i * adjustedHeight);

    //     if (i > 0) {
    //         pdf.addPage();
    //     }

    //     // Use JPEG for better compression and quality
    //     pdf.addImage(entry.fileData, 'JPEG', 0, yOffset, pdfWidth, totalHeight, undefined, 'FAST');

    //     // Add a white rectangle at the bottom
    //     pdf.setFillColor(255, 255, 255);
    //     pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F');
    // }

    // let filename = entry.invoiceNo + '_' + entry.heading + '.pdf';
    // filename = filename.replace(/\s+/g, '_');
    // pdf.save(filename);


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
//end Function to download PDF from history



// Load history when the page is ready
document.addEventListener('DOMContentLoaded', loadDownloadHistory);

// IndexedDB utility setup
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PurchaseOrderDownloadHistoryDB', 2);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('purchaseOrderdownloadHistory')) {
                db.createObjectStore('purchaseOrderdownloadHistory', { keyPath: 'id', autoIncrement: true });
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
        const transaction = db.transaction('purchaseOrderdownloadHistory', 'readonly');
        const store = transaction.objectStore('purchaseOrderdownloadHistory');
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('Error retrieving data from database');
    });
}


// Function to clear all download history
async function clearAllHistory() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction('purchaseOrderdownloadHistory', 'readwrite');
        const store = transaction.objectStore('purchaseOrderdownloadHistory');
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            window.location.href = 'purchase-order-history.html'
        };

        clearRequest.onerror = () => {
            console.error('Error clearing all download purchase order history.');
        };
    } catch (error) {
        console.error('Error while clearing data from IndexedDB:', error);
    }
}

async function deleteInvoiceFromDatabase(id) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction('purchaseOrderdownloadHistory', 'readwrite');
        const store = transaction.objectStore('purchaseOrderdownloadHistory');
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
    // if (confirm('Are you sure you want to clear all download history?')) {
    //     clearAllHistory();
    // }
    const t = window.translations?.invoice_history || {};

    Swal.fire({
        title: t.swal_all_delete_title,
        text: t.swal_all_delete_text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t.swal_all_delete_confirm_btn,
        cancelButtonText: t.swal_delete_cancel_btn,
    }).then((result) => {
        if (result.isConfirmed) {
            clearAllHistory();
            Swal.fire({
                icon: 'success',
                title: t.swal_all_delete_success_title,
                text: t.swal_all_delete_success_text,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        }
    });
});

// Export from data to CSV
async function exportDataToCSV() {
    const db = await openDatabase();
    const transaction = db.transaction(['purchaseOrderdownloadHistory'], 'readonly');
    const objectStore = transaction.objectStore('purchaseOrderdownloadHistory');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const downloads = event.target.result;
        const rows = [];

        rows.push(['No', 'PDF Heading', 'Order No', 'Order By', 'Order To', 'Total', 'Date']);

        for (const download of downloads) {
            try {
                rows.push([
                    download.id,
                    download.heading,
                    download.invoiceNo,
                    download.from_name,
                    download.bill_to_name,
                    download.total,
                    download.invoicePaymentDate,
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
        link.download = "purchase_order_data.csv";
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
    setTimeout(function () {
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
            location.reload();
        });
    }, 3000);
});

// end night mode