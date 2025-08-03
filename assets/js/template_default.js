// =================================================================================== template design code
// === color change
$(document).ready(function () {
    const tempColor = sessionStorage.getItem("temp_color");
    if (tempColor) {
        document.documentElement.style.setProperty('--primary-temp-change-color', tempColor);
        const tempLightColor = `${tempColor}21`;
        document.documentElement.style.setProperty('--primary-temp-change-light-color', tempLightColor);
        $('.card-border').css('border-color', tempColor);
    }
});
// === end color change

// ====heading
const invoice_heading = sessionStorage.getItem("invoice-heading");
if (invoice_heading) {
    document.getElementById("invoice-heading").textContent = invoice_heading;
} else {
    document.getElementById("invoice-heading").style.display = 'none';
}
// ==== end heading

// === uploadLogo
const uploadLogo = sessionStorage.getItem("logo");
if (uploadLogo) {
    document.getElementById("logo").src = uploadLogo;
    document.getElementById("logo").style.width = '150px';
    document.getElementById("logo").style.height = '150px';
} else {
    document.getElementById("logo").style.display = 'none';
}
// === end uploadLogo

// === From 
const Fromfields = [
    { id: 'from_lable_title', type: 'textContent' },
    { id: 'from_lable_name', type: 'textContent' },
    { id: 'from_name', type: 'value' },
    { id: 'from_lable_email', type: 'textContent' },
    { id: 'from_email', type: 'value' },
    { id: 'from_lable_phone', type: 'textContent' },
    { id: 'from_phone', type: 'value' },
    { id: 'from_lable_business_number', type: 'textContent' },
    { id: 'from_business_number', type: 'value' },
    { id: 'from_lable_website', type: 'textContent' },
    { id: 'from_website', type: 'value' },
    { id: 'from_lable_business_owner_name', type: 'textContent' },
    { id: 'from_business_owner_name', type: 'value' }
];

Fromfields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element) return;

    const storedValue = sessionStorage.getItem(field.id);

    if (storedValue !== null) {
        if (field.type === 'value') {
            element.value = storedValue;
            if (element.value == "") {
                element.parentElement.parentElement.style.display = 'none';
            }
        } else {
            element.textContent = storedValue;
        }
    }
});

const from_lable_address = sessionStorage.getItem("from_lable_address");
const from_address_input = sessionStorage.getItem("from_address_input");
if (from_address_input != "") {
    document.getElementById("from_lable_address").textContent = from_lable_address;
    document.getElementById("from_lable_address").style.alignItems = "flex-start";
    document.getElementById("from_address_input").textContent = from_address_input;
} else {
    document.getElementById("from_address_input").parentElement.parentElement.style.display = 'none';
}
// === End From 

// ===billFields
const billFields = [
    { id: 'bill_to_lable_title', type: 'textContent' },
    { id: 'bill_to_lable_name', type: 'textContent' },
    { id: 'bill_to_name', type: 'value' },
    { id: 'bill_to_lable_email', type: 'textContent' },
    { id: 'bill-to-email', type: 'value' },
    { id: 'bill_to_lable_phone', type: 'textContent' },
    { id: 'bill-to-phone', type: 'value' },
    { id: 'bill_to_lable_mobile', type: 'textContent' },
    { id: 'bill-to-mobile', type: 'value' },
    { id: 'bill_to_lable_fax', type: 'textContent' },
    { id: 'bill-to-fax', type: 'value' }
];
billFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element) return;

    const storedValue = sessionStorage.getItem(field.id);

    if (storedValue !== null) {
        if (field.type === 'value') {
            element.value = storedValue;
            if (element.value == "") {
                element.parentElement.parentElement.style.display = 'none';
            }
        } else {
            element.textContent = storedValue;
        }
    }
});

const bill_to_lable_address = sessionStorage.getItem("bill_to_lable_address");
const bill_to_address_input = sessionStorage.getItem("bill_to_address_input");
if (bill_to_address_input != "") {
    document.getElementById("bill_to_lable_address").textContent = bill_to_lable_address;
    document.getElementById("bill_to_lable_address").style.alignItems = "flex-start";
    document.getElementById("bill-to-address-input").textContent = bill_to_address_input;
} else {
    document.getElementById("bill-to-address-input").parentElement.parentElement.style.display = 'none';
}
// ===billFields

// === terms Fields
const termsFields = [
    { id: 'terms_lable_number', type: 'textContent' },
    { id: 'terms_number', type: 'value' },
    { id: 'terms_lable_date', type: 'textContent' },
    { id: 'terms_date', type: 'value' },
    { id: 'terms_lable_terms_days', type: 'textContent' },
    { id: 'terms', type: 'value' },
    { id: 'terms_lable_due_date', type: 'textContent' },
    { id: 'dueDate', type: 'value' }
];
termsFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element) return;

    const storedValue = sessionStorage.getItem(field.id);

    if (storedValue !== null) {
        if (field.type === 'value') {
            element.value = storedValue;
            if (element.value == "") {
                element.parentElement.parentElement.style.display = 'none';
            }
        } else {
            element.textContent = storedValue;
        }
    }
});
// === End terms Fields

// === table
var tableImg = sessionStorage.getItem('tableImage');
if (tableImg) {
    var image = new Image();
    image.src = tableImg;
    image.style.width = '1200px';
    image.style.height = 'auto';
    document.getElementById('table-container').appendChild(image);
}
// === end table

// ===Notes and Terms

const notesLableDescription = sessionStorage.getItem('notes_lable_description');
if (notesLableDescription != "") {
    const element = document.getElementById('notes_lable_description');
    element.textContent = notesLableDescription;
}
const notes = sessionStorage.getItem('notes');
if (notes != "") {
    const element = document.getElementById('notes');
    element.textContent = notes;
} else {
    const element = document.getElementById('notes');
    element.parentElement.parentElement.style.display = 'none';
}
const termsLableDescription = sessionStorage.getItem('terms_lable_description');
if (termsLableDescription != "") {
    const element = document.getElementById('terms_lable_description');
    element.textContent = termsLableDescription;
}
const terms = sessionStorage.getItem('terms');
if (terms != "") {
    const element = document.getElementById('terms_p');
    element.textContent = terms;
} else {
    const element = document.getElementById('terms_p');
    element.parentElement.parentElement.style.display = 'none';
}

// ===End Notes and Terms

// === Sub Total 

const subtotalFields = [
    ['subtotal_lable_subtotal', '#subtotal'],
    ['subtotal_lable_discount', '#discount', '#discountSymbol'],
    ['subtotal_lable_tax', '#tax', '#taxSymbol'],
    ['subtotal_lable_shipping', '#shipping', '#shippingSymbol'],
    ['subtotal_lable_total', '#total'],
    ['subtotal_lable_amount_paid', '#amount-paid', '.sya'],
    ['subtotal_lable_balance_due', '#balance-due']
];
subtotalFields.forEach(([labelId, valueSelector, symbolSelector]) => {


    const label = sessionStorage.getItem(labelId);
    if (label) {
        const labelElement = document.getElementById(labelId);
        if (labelElement) {
            labelElement.textContent = label;
        }
    }

    const storedValue = sessionStorage.getItem(valueSelector);

    if (storedValue) {
        const valueElement = document.querySelector(valueSelector);
        if (valueElement) {
            if (valueElement.tagName === 'INPUT') {
                valueElement.value = storedValue;
            } else {
                valueElement.textContent = storedValue;
            }
        }
    }
});
// === End Sub Total

// ===Bank Details
const bankShow = document.querySelector('#bank-show');
const bankDetailsContainer = document.querySelector('#bank-details');
const fields = [
    { label: 'bank_details_lable_account_name', value: 'accountName' },
    { label: 'bank_details_lable_account_number', value: 'accountNumber' },
    { label: 'bank_details_lable_ifsc', value: 'ifsc' },
    { label: 'bank_details_account_type', value: 'accountType' },
    { label: 'bank_details_bank_name', value: 'bank' }
];

let bankData = '';
if (fields.some(field => sessionStorage.getItem(field.value))) {
    bankShow.style.display = 'block';
    bankData += `<h6 class="bank-details-title">${sessionStorage.getItem('bank_details_lable_title')}</h6>`;
    fields.forEach(({ label, value }) => {
        const fieldValue = sessionStorage.getItem(value);
        if (fieldValue) {
            bankData += `<p><strong>${sessionStorage.getItem(label)}: </strong>${fieldValue}</p>`;
        }
    });
    bankDetailsContainer.innerHTML = bankData;
} else {
    bankShow.style.display = 'none';
}
// ===End Bank Details 

// === upi 
const upiShow = document.querySelector('#upi-show');
if (sessionStorage.getItem('upiId')) {
    upiShow.style.display = 'block';
    var upiImage = sessionStorage.getItem('upiImage');
    if (upiImage) {
        var image = new Image();
        image.src = upiImage;
        image.style.width = '450px';
        image.style.height = 'auto';
        document.getElementById('upi-show').appendChild(image);
    }
} else {
    upiShow.style.display = 'none';
}
// === end upi

// === Authorized Signatory
const signatoryLogo = sessionStorage.getItem("signatory");
let authorizedDiv = document.querySelector('#authorized-div');
if (signatoryLogo) {
    authorizedDiv.style.display = 'block';
    document.getElementById("signatory").src = signatoryLogo;
    document.getElementById("signatory").style.width = '150px';
    document.getElementById("signatory").style.height = '150px';
    let authorizedText = document.querySelector('#Authorized-Text');
    authorizedText.textContent = sessionStorage.getItem("authorized_text");
} else {
    authorizedDiv.style.display = 'none';
    document.getElementById("signatory").style.display = 'none';
}
// === End Authorized Signatory

// =================================================================================== End template design code

// =================================================================================== Download 

// back page
document.getElementById('backToPage').addEventListener('click', backToPage);

function backToPage() {
    setTimeout(function () {
        window.location.href = "invoice.html";
    }, 1000);
}

// download pdf
document.getElementById('downloadInvoice').addEventListener('click', downloadPDF);

async function downloadPDF() {

    const invoiceTitle = document.querySelector('.invoice-title');
    const invoiceHeading = invoiceTitle.textContent;
    const inputFromTo = document.getElementById('from_name').value;
    const inputBillTo = document.getElementById('bill_to_name').value;
    const invoicetotalId = document.querySelector('#total');
    const invoiceTotal = invoicetotalId.textContent;

    const invoice = document.getElementById('invoice');

    const canvas = await html2canvas(invoice, {
        scale: 2, // Double the scale to improve quality
        useCORS: true // Enable CORS if there are external resources
    });
    const imgData = canvas.toDataURL('image/png');

    // Compress the image data to reduce size
    const compressedImgData = await compressImage(imgData, 0.5); // 0.5 for 50% quality

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(compressedImgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const pdfFileName = 'invoice.pdf';

    const pageHeight = pdf.internal.pageSize.height;

    const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
    const numberOfPages = Math.ceil(totalHeight / pageHeight);

    for (let i = 0; i < numberOfPages; i++) {
        const yOffset = i * pageHeight;
        if (i > 0) {
            pdf.addPage();
        }

        pdf.addImage(compressedImgData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
    }

    pdf.save('invoice.pdf');
    const saveInvoice = sessionStorage.getItem("saveInvoice");
    if (saveInvoice == 'true') {
        try {
            const downloadEntry = {
                heading: invoiceHeading,
                fromTo: inputFromTo,
                billTo: inputBillTo,
                fileName: pdfFileName,
                total: invoiceTotal,
                date: getcurrentDateTime(),
                fileData: compressedImgData
            };
            await addToDatabase(downloadEntry);
        } catch (error) {
            console.error('Error while storing data in IndexedDB:', error);
        }
        document.getElementById('LoadSpinner').style.display = 'block';
        document.body.style.background = '#eee';
        document.body.style.cursor = 'not-allowed';
        setTimeout(function () {
            window.location.href = "history.html";
        }, 1000);
    }

}
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

// Generate encryption key
async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt data with AES-GCM
async function encryptData(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    return {
        encryptedData: new Uint8Array(encryptedData),
        key: await crypto.subtle.exportKey("jwk", key),
        iv: Array.from(iv),
    };
}


async function addToDatabase(entry) {
    const { encryptedData, key, iv } = await encryptData(entry.fileData);
    entry.fileData = encryptedData;
    entry.key = key;
    entry.iv = iv;

    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');

        const request = store.add(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject('Error adding data to database');
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

function removeOldestEntry() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                resolve();
            }
        };

        request.onerror = () => reject('Error deleting data from database');
    });
}

function compressImage(base64Image, quality = 0.5) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
    });
}
// get current time
function getcurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}
//end get current time
// =================================================================================== End Download 
