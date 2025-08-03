"use strict";

// $(document).ready(function () {
//     $.get("http://ip-api.com/json/", function (data) {
//         // if (document.getElementById("currency").value == 0) {
//         let countryCode = data.countryCode;
//         let countrycurrency = null;
//         switch (countryCode) {
//             case 'US': countrycurrency = '$'; break;
//             case 'EU': countrycurrency = '€'; break;
//             case 'JP': countrycurrency = '¥'; break;
//             case 'GB': countrycurrency = '£'; break;
//             case 'AU': countrycurrency = 'A$'; break;
//             case 'CA': countrycurrency = 'C$'; break;
//             case 'CH': countrycurrency = 'CHF'; break;
//             case 'CN': countrycurrency = 'CNY'; break;
//             case 'KR': countrycurrency = '₩'; break;
//             case 'IN': countrycurrency = '₹'; break;
//             default: countrycurrency = '$';
//         }
//         $("#currency").val(countrycurrency);
//         $("#currency").trigger('change');
//         // }
//     }, "json");
// });

let currencyDb;
const requestCurrency = indexedDB.open("currencyDatabase", 2);

requestCurrency.onupgradeneeded = (event) => {
    currencyDb = event.target.result;

    if (!currencyDb.objectStoreNames.contains("currencyDefault")) {
        currencyDb.createObjectStore("currencyDefault", { keyPath: "id", autoIncrement: true });
    } else {
        console.log("Object store 'currencyDefault' already exists.");
    }
};

requestCurrency.onsuccess = (event) => {
    currencyDb = event.target.result;
    displayDataCurrency();
};

requestCurrency.onerror = (event) => {
    const error = event.target.error || "Unknown error";
    console.error("Error opening IndexedDB:", error);
};

async function decryptDataCurrency(encryptedData, iv, key) {
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData);
}

async function displayDataCurrency() {
    const transaction = currencyDb.transaction("currencyDefault", "readonly");
    const objectStore = transaction.objectStore("currencyDefault");
    const requestCurrency = objectStore.getAll();
    requestCurrency.onsuccess = async (event) => {
        const currencies = event.target.result;
        for (const c of currencies) {
            const decryptedData = await decryptDataCurrency(c.encryptedData, c.iv, c.key);
            if (decryptedData.currency != null) {
                document.getElementById("currency").value = decryptedData.currency;
                currencySymbol = document.getElementById('currency').value;
            }
        }
    };
    requestCurrency.onerror = (event) => {
        console.error("Error retrieving data:", event.target.errorCode);
    };
}

var currency = document.getElementById('currency').value;
var template = document.getElementById('template').value;
var currencySymbol = currency;
var oldCurrencySymbol = null;
function updateCurrency() {
    currency = document.getElementById('currency').value;
    currencySymbol = currency;

    if (oldCurrencySymbol == null) {
        sessionStorage.setItem('oldCurrencySymbolSession', currencySymbol);
        oldCurrencySymbol = sessionStorage.getItem('oldCurrencySymbolSession');
    } else {
        const elements = document.body.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.childNodes.length > 0) {
                for (let j = 0; j < element.childNodes.length; j++) {
                    const node = element.childNodes[j];
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.nodeValue = node.nodeValue.replace(oldCurrencySymbol, currencySymbol);
                    }
                }
            }
        }
        sessionStorage.setItem('oldCurrencySymbolSession', currencySymbol);
        oldCurrencySymbol = sessionStorage.getItem('oldCurrencySymbolSession');
    }
    setTimeout(() => { changecurrencySymbol(); }, 3000);

    if (template == 'hours' || template == 'quantity') {
        calculateTotalAmount();
    }
    if (template == 'amounts-only') {
        calculateTotalOnlyAmount();
    }
}

function updateTemplate() {
    template = document.getElementById('template').value;
    const tableFiled = document.getElementById('table-filed');
    var tableContent = ``;
    if (template == "quantity") {
        tableContent = `
        <thead>
            <tr>
                <th data-i18n="invoice.table_item_description" style="width: 50%">Item/Service</th>
                <th style="width: 10%" data-i18n="invoice.table_quantity">Quantity</th>
                <th style="width: 15%"><span data-i18n="invoice.table_rate">Rate</span> <span class="rate-apply"><br>(<span data-i18n="invoice.table_rate_apply">Apply to All</span> <input type="checkbox" id="applyRate" onchange="applyRateToAll(this)"> )</span></th>
                <th data-i18n="invoice.table_amount" style="width: 15%">Amount</th>
                <th data-i18n="invoice.table_action" class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control" data-i18n-placeholder="invoice.placeholder_description_item"  placeholder="Description of item/service..."></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td><input class="form-control rate" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td class="amount"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        </tbody>`;
    }
    if (template == "hours") {
        tableContent = `
        <thead>
            <tr>
                <th data-i18n="invoice.table_item_description" style="width: 50%">Item/Service</th>
                <th style="width: 10%" data-i18n="invoice.table_hours">Hours</th>
                <th style="width: 15%"><span data-i18n="invoice.table_rate">Rate</span> <span class="rate-apply"><br>(<span data-i18n="invoice.table_rate_apply">Apply to All</span>  <input type="checkbox" id="applyRate" onchange="applyRateToAll(this)"> )</th>
                <th data-i18n="invoice.table_amount" style="width: 15%">Amount</th>
                <th data-i18n="invoice.table_action" class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td><input class="form-control rate" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td class="amount"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        </tbody>`;

        // const rows = Array.from({ length: 90 }, (_, i) => `
        //       <tr>
        //             <td><input type="text" class="form-control" placeholder="Description of item/service..." value="product ${i + 1}" ></td>
        //             <td><input class="form-control" type="number" value="${i + 1}" oninput="calculateAmount(this)"></td>
        //             <td><input class="form-control rate" type="number" value="${(i + 1) * 10}" oninput="calculateAmount(this)"></td>
        //             <td class="amount"></td>
        //             <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
        //       </tr>
        //  `).join('');

        // tableContent = `
        //       <thead>
        //             <tr>
        //                  <th style="width: 50%">Item/Service</th>
        //                  <th style="width: 10%">Hours</th>
        //                  <th style="width: 10%">Rate <span class="rate-apply">(Apply to All <input type="checkbox" id="applyRate" onchange="applyRateToAll(this)"> )</th>
        //                  <th style="width: 20%">Amount</th>
        //                  <th class="hide-t" style="width: 10%">Actions</th>
        //             </tr>
        //       </thead>
        //       <tbody id="invoice-items">
        //             ${rows}
        //       </tbody>`;

    }
    if (template == "amounts-only") {
        tableContent = `
        <thead>
            <tr>
                <th data-i18n="invoice.table_item_description" style="width: 60%">Item/Service</th>
                <th data-i18n="invoice.table_amount" style="width: 30%">Amount</th>
                <th data-i18n="invoice.table_action" class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
                <td><input type="number" class="amount" value="0" oninput="calculateTotalOnlyAmount()"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        </tbody>`;
    }
    tableFiled.innerHTML = tableContent;
    changecurrencySymbol();
    updateText(flattenTranslations(window.translations));

    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach(input => {
        // Remove the up/down arrows for all number inputs
        input.style.webkitAppearance = 'none';
        input.style.mozAppearance = 'textfield';
        input.style.appearance = 'none';

        // Allow only numeric input (0-9)
        input.addEventListener('keydown', function (event) {
            // Allow backspace, delete, tab, arrow keys, and numbers
            if (
                (event.key >= '0' && event.key <= '9') || // numeric keys
                event.key === 'Backspace' ||  // backspace
                event.key === 'Delete' ||    // delete
                event.key === 'ArrowLeft' || // left arrow
                event.key === 'ArrowRight'   // right arrow
            ) {
                return; // Allow the event
            } else {
                event.preventDefault(); // Disable other keys
            }
        });
    });


    tableInputLimits();
}

document.addEventListener('DOMContentLoaded', updateTemplate);
document.addEventListener('DOMContentLoaded', updateCurrency);

function applyRateToAll(checkbox) {
    const rate = document.querySelector('.rate').value;
    const rateInputs = document.querySelectorAll('#invoice-items .rate');

    if (checkbox.checked) {
        rateInputs.forEach((input, index) => {
            if (index !== 0) {
                input.value = rate;
                calculateAmount(input);
            }
        });
    }
}


function togglePercentagMoneySym(id) {
    const Symbol = document.getElementById(id);
    if (Symbol.innerText == currencySymbol) {
        Symbol.innerText = '%';
    } else {
        Symbol.innerText = currencySymbol;
    }
    calculateInvoice();
}

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

function changecurrencySymbol() {
    document.querySelector('.amount').textContent = currencySymbol + '00.00';
    document.querySelector('#subtotal').textContent = currencySymbol + '00.00';
    document.querySelector('#total').textContent = currencySymbol + '00.00';
    document.querySelector('#balance-due').textContent = currencySymbol + '00.00';

    document.querySelectorAll('.sy').forEach((element) => {
        element.textContent = currencySymbol;
    });
    document.querySelectorAll('.sya').forEach((element) => {
        element.textContent = currencySymbol;
    });
}


//upload logo
document.getElementById('logoInput').addEventListener('change', function (event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const logoImage = document.getElementById('logoImage');
            logoImage.src = e.target.result;
            logoImage.style.display = 'block';
            document.querySelector('.invoice-logo  span').style.display = 'none';
            document.getElementById('logoInput').style.display = 'none';
            document.getElementById('removeLogo').style.display = 'block';

            const invoiceLogo = document.querySelector('.invoice-logo');
            invoiceLogo.style.padding = '0';
            invoiceLogo.style.borderRadius = '0';
            invoiceLogo.style.border = 'none';
            invoiceLogo.style.backgroundColor = 'transparent';

        }
        reader.readAsDataURL(input.files[0]);
    }
});

document.getElementById('removeLogo').addEventListener('click', function () {

    const invoiceLogo = document.querySelector('.invoice-logo');
    invoiceLogo.style.padding = '30px 30px';
    invoiceLogo.style.borderRadius = '10px';
    invoiceLogo.style.border = '1px solid var(--input-border-color)';
    invoiceLogo.style.backgroundColor = 'var(--input-bg-color)';

    document.getElementById('logoImage').style.display = 'none';
    document.querySelector('.invoice-logo  span').style.display = 'block';
    document.getElementById('logoInput').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('logoInput').value = '';
});
//end upload logo


// item table update in row amount
function calculateAmount(element) {
    const row = element.parentElement.parentElement;
    const quantity = row.querySelectorAll('input[type="number"]')[0].value;
    const rate = row.querySelectorAll('input[type="number"]')[1].value;
    const amount = row.querySelector('.amount');
    const total = quantity * rate;
    amount.textContent = currencySymbol + total.toFixed(2);
    calculateTotalAmount();
}


//add item line
function addLineItem() {
    const table = document.getElementById('invoice-items');
    const newRow = document.createElement('tr');
    const rate = document.querySelector('.rate')?.value || 0;
    const applyRateChecked = document.getElementById('applyRate')?.checked;

    if (template == 'hours' || template == 'quantity') {
        newRow.innerHTML = `
    <td><input type="text" class="form-control" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
    <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
    <td><input class="form-control rate" type="number" value="${applyRateChecked ? rate : 0}" oninput="calculateAmount(this)">
        </td>
    <td class="amount">${currencySymbol}00.00</td>
    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
    `;
    }
    if (template == 'amounts-only') {
        newRow.innerHTML = `
    <td><input type="text" class="form-control" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
    <td><input type="number" class="amount" value="0" oninput="calculateTotalOnlyAmount()"></td>
    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
    `;
    }
    table.appendChild(newRow);
    tableInputLimits();
    inputNumberValidation();
    updateText(flattenTranslations(window.translations));
}

//remove item line
function removeLineItem(button) {
    const row = button.parentElement.parentElement;
    row.remove();


    if (template == 'hours' || template == 'quantity') {
        calculateTotalAmount();
    }
    if (template == 'amounts-only') {
        calculateTotalOnlyAmount();
    }
}

if (template == 'hours' || template == 'quantity') {
    document.addEventListener('DOMContentLoaded', calculateTotalAmount);
}
if (template == 'amounts-only') {
    document.addEventListener('DOMContentLoaded', calculateTotalOnlyAmount);
}


//item subtotal count
function calculateTotalAmount() {
    const amounts = document.querySelectorAll('.amount');
    let totalAmount = 0;
    amounts.forEach(amount => {
        totalAmount += parseFloat(amount.textContent.replace(currencySymbol, ''));
    });
    document.getElementById('subtotal').textContent = currencySymbol + totalAmount.toFixed(2);
    calculateInvoice();
}
function calculateTotalOnlyAmount() {
    const amounts = document.querySelectorAll('.amount');
    var totalAmount = 0;
    amounts.forEach(amount => {
        totalAmount += parseFloat(amount.value)
    });

    document.getElementById('subtotal').textContent = currencySymbol + totalAmount;
    calculateInvoice();
}
// total calculate
function calculateInvoice() {
    let subtotalText = document.getElementById('subtotal').textContent;
    let amountValue = parseFloat(subtotalText.replace(currencySymbol, ""));
    const subtotal = amountValue;
    const discountInput = document.getElementById('discount');
    const taxInput = document.getElementById('tax');
    const shippingInput = document.getElementById('shipping');
    const amountPaidInput = document.getElementById('amount-paid');
    const totalSpan = document.getElementById('total');
    const balanceDueSpan = document.getElementById('balance-due');

    const discountSymbol = document.getElementById('discountSymbol');
    let discount = null;
    if (discountSymbol.innerText == '%') {
        discount = (subtotal * (discountInput.value / 100));
    } else {
        discount = parseFloat(discountInput.value);
    }

    const taxSymbol = document.getElementById('taxSymbol');
    let tax = null;
    if (taxSymbol.innerText == '%') {
        tax = (subtotal * (taxInput.value / 100));
    } else {
        tax = parseFloat(taxInput.value);
    }

    const shippingSymbol = document.getElementById('shippingSymbol');
    let shipping = null;
    if (shippingSymbol.innerText == '%') {
        shipping = (subtotal * (shippingInput.value / 100));
    } else {
        shipping = parseFloat(shippingInput.value);
    }

    const amountPaid = parseFloat(amountPaidInput.value);

    const total = subtotal - discount + tax + shipping;
    const balanceDue = total - amountPaid;

    totalSpan.textContent = currencySymbol + total.toFixed(2);
    balanceDueSpan.textContent = currencySymbol + balanceDue.toFixed(2);

}
//end calculate
//this function use enter filed in text this store in p tag
function updateContent(inputSelector, outputSelector) {
    document.querySelectorAll(inputSelector).forEach(function (element) {
        element.addEventListener('input', function () {
            document.querySelector(outputSelector).textContent = this.value;
        });
    });
}
updateContent('.note-write', '.note-show');
updateContent('.term-write', '.term-show');
updateContent('.invoice-heading', '.invoice-title');
//this use enter filed in text this store in p tag.this p tag hide on invoice
document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
    element.classList.add('hidden');
});

// this print time is hide(show on user download or pdf time)
function hideEmptyFields() {

    inputHideBankDetails();
    inputHideUPIQrCode();
    inputHideAuthorized();

    document.getElementById('invoice').classList.add('hide-borders');

    document.getElementById('invoice-size').classList.add('col-md-12');
    document.getElementById('invoice-size').classList.remove('col-md-9');

    //this function use enter filed in text this store in p tag is hide
    document.getElementById('invoice').classList.remove('card');

    // Add custom width class to the invoice
    document.getElementById('invoice').classList.add('invoice-custom-width');

    document.querySelectorAll('.invoice-heading,.note-write,.term-write,#custom-date-group').forEach(function (element) {
        element.classList.add('hidden');
    });

    //this use enter filed in text this store in p tag.this p tag show in pdf on invoice
    document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
        element.classList.remove('hidden');
    });

    const inputs = document.querySelectorAll('#invoice input, #invoice textarea,#invoice select');
    const inputparent = document.querySelectorAll('.parent-hide');
    const hideTElements = document.querySelectorAll('.hide-t');

    inputs.forEach(input => {
        if (!input.value) {
            input.parentElement.style.display = 'none';
        }
    });
    inputparent.forEach(input => {
        if (!input.value) {
            input.parentElement.parentElement.style.display = 'none';
        }
    });
    hideTElements.forEach(element => {
        element.style.display = 'none';
    });

}

// this print after show (input filed)
function showHiddenFields() {

    inputShowBankDetails();
    inputShowUPIQrCode();
    inputShowAuthorized();

    document.getElementById('invoice-size').classList.add('col-md-9');
    document.getElementById('invoice-size').classList.remove('col-md-12');

    document.getElementById('invoice').classList.remove('hide-borders');
    document.getElementById('invoice').classList.add('card');

    // Add custom width class to the invoice
    document.getElementById('invoice').classList.remove('invoice-custom-width');

    document.querySelectorAll('.invoice-heading,.note-write,.term-write,#custom-date-group').forEach(function (element) {
        element.classList.remove('hidden');
    });
    document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
        element.classList.add('hidden');
    });

    const inputs = document.querySelectorAll('#invoice input, #invoice textarea,#invoice select');
    const inputparent = document.querySelectorAll('.parent-hide');
    const hideTElements = document.querySelectorAll('.hide-t');

    inputs.forEach(input => {
        input.parentElement.style.display = '';
    });
    inputparent.forEach(input => {
        if (!input.value) {
            input.parentElement.parentElement.style.display = '';
        }
    });
    hideTElements.forEach(element => {
        element.style.display = '';
    });
}

//require this filed
function validateFields() {
    const items = document.querySelectorAll('#invoice-items tr');
    const from = document.getElementById('from_name');
    const billTo = document.getElementById('bill_to_name');
    const invoiceHeading = document.getElementById('invoice-heading');
    let isValid = true, errorMessage = '';

    const showError = (field, message) => {
        field.classList.add('error');
        errorMessage += `<div class="alert alert-danger alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        isValid = false;
    };

    const clearError = (field) => {
        if (field.value.trim() !== '') {
            field.classList.remove('error');
        }
    };

    // Attach input listeners to dynamically clear errors
    const attachListeners = (field) => {
        field.addEventListener('input', () => clearError(field));
    };

    items.forEach(item => {
        const [descriptionField, quantityField, rateField] = item.querySelectorAll('td input');
        let t = window.translations?.document_alert || {};
        if (descriptionField) {
            if (!descriptionField.value.trim()) showError(descriptionField, t.invoice_alert_description);
            attachListeners(descriptionField);
        }

        if (['hours', 'quantity'].includes(template)) {
            if (quantityField) {
                if (!quantityField.value.trim()) showError(quantityField, `${template === 'hours' ? t.invoice_alert_hours : t.invoice_alert_quantity} ` + t.invoice_alert_is_required);
                attachListeners(quantityField);
            }

            if (rateField) {
                if (!rateField.value.trim()) showError(rateField, t.invoice_alert_rate);
                attachListeners(rateField);
            }
        }

        if (template === 'amounts-only') {
            if (quantityField) {
                if (!quantityField.value.trim()) showError(quantityField, t.invoice_alert_amount);
                attachListeners(quantityField);
            }
        }
    });
    let t = window.translations?.document_alert || {};
    // Validate static fields and attach listeners
    if (!invoiceHeading.value.trim()) showError(invoiceHeading, t.invoice_alert_heading);
    attachListeners(invoiceHeading);

    if (!from.value.trim()) showError(from, t.invoice_alert_business_name);
    attachListeners(from);

    if (!billTo.value.trim()) showError(billTo, t.invoice_alert_client_name);
    attachListeners(billTo);

    document.getElementById('ErrorMessage').innerHTML = errorMessage;

    return isValid;
}

// IndexedDB utility setup
// function openDatabase() {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open('DownloadHistoryDB', 1);

//         request.onupgradeneeded = (event) => {
//             const db = event.target.result;
//             if (!db.objectStoreNames.contains('downloadHistory')) {
//                 db.createObjectStore('downloadHistory', { keyPath: 'id', autoIncrement: true });
//             }
//         };

//         request.onsuccess = (event) => {
//             resolve(event.target.result);
//         };

//         request.onerror = (event) => {
//             reject('Error opening database:', event.target.errorCode);
//         };
//     });
// }

// // Generate encryption key
// async function generateKey() {
//     return await crypto.subtle.generateKey(
//         {
//             name: "AES-GCM",
//             length: 256,
//         },
//         true,
//         ["encrypt", "decrypt"]
//     );
// }

// // Encrypt data with AES-GCM
// async function encryptData(data) {
//     const encoder = new TextEncoder();
//     const encodedData = encoder.encode(data);
//     const key = await generateKey();
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
//     const encryptedData = await crypto.subtle.encrypt(
//         {
//             name: "AES-GCM",
//             iv: iv,
//         },
//         key,
//         encodedData
//     );

//     return {
//         encryptedData: new Uint8Array(encryptedData),
//         key: await crypto.subtle.exportKey("jwk", key),
//         iv: Array.from(iv),
//     };
// }


// async function addToDatabase(entry) {
//     const { encryptedData, key, iv } = await encryptData(entry.fileData);
//     entry.fileData = encryptedData;
//     entry.key = key;
//     entry.iv = iv;

//     return new Promise(async (resolve, reject) => {
//         const db = await openDatabase();
//         const transaction = db.transaction('downloadHistory', 'readwrite');
//         const store = transaction.objectStore('downloadHistory');

//         const request = store.add(entry);

//         request.onsuccess = () => resolve();
//         request.onerror = () => reject('Error adding data to database');
//     });
// }


// function getAllFromDatabase() {
//     return new Promise(async (resolve, reject) => {
//         const db = await openDatabase();
//         const transaction = db.transaction('downloadHistory', 'readonly');
//         const store = transaction.objectStore('downloadHistory');
//         const request = store.getAll();

//         request.onsuccess = (event) => resolve(event.target.result);
//         request.onerror = () => reject('Error retrieving data from database');
//     });
// }

// function removeOldestEntry() {
//     return new Promise(async (resolve, reject) => {
//         const db = await openDatabase();
//         const transaction = db.transaction('downloadHistory', 'readwrite');
//         const store = transaction.objectStore('downloadHistory');
//         const request = store.openCursor();

//         request.onsuccess = (event) => {
//             const cursor = event.target.result;
//             if (cursor) {
//                 cursor.delete();
//                 resolve();
//             }
//         };

//         request.onerror = () => reject('Error deleting data from database');
//     });
// }

// Handle the template selection
// document.getElementById('submitButton').addEventListener('click', submitButton);

// ======================= default set temaplte
let defaultTemplate = 1;
let templateDb;
const templateRequest = indexedDB.open("templateDatabase", 3);

templateRequest.onupgradeneeded = (event) => {
    templateDb = event.target.result;
    if (!templateDb.objectStoreNames.contains("templateDefault")) {
        // console.log("Creating object store: templateDefault");
        templateDb.createObjectStore("templateDefault", { keyPath: "id", autoIncrement: true });
    } else {
        // console.log("Object store 'templateDefault' already exists.");
    }
};

templateRequest.onsuccess = (event) => {
    templateDb = event.target.result;
    displayData();
};

templateRequest.onerror = (event) => {
    const error = event.target.error || "Unknown error";
    // console.error("Error opening IndexedDB:", error);
};

async function encryptData(data) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
    return { encryptedData, iv, key };
}

async function decryptData(encryptedData, iv, key) {
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData);
}

async function displayData() {
    if (!templateDb) {
        console.error("Database is not initialized.");
        return;
    }

    // Check for object store existence
    if (!templateDb.objectStoreNames.contains("templateDefault")) {
        console.error("Object store 'templateDefault' not found.");
        return;
    }

    const transaction = templateDb.transaction("templateDefault", "readonly");
    const objectStore = transaction.objectStore("templateDefault");
    const templateRequest = objectStore.getAll();

    templateRequest.onsuccess = async (event) => {
        const templates = event.target.result;
        for (const t of templates) {
            try {
                const decryptedData = await decryptData(t.encryptedData, t.iv, t.key);
                defaultTemplate = decryptedData.template;
                const style = document.createElement('style');
                style.innerHTML = `
                   .template-label {
                    border: 2px solid transparent;
                    }
                   .template-label-show-`+ decryptedData.template + `{
                    border: 2px solid var(--primary-change-color);
                   }`;
                document.head.appendChild(style);

            } catch (error) {
                console.error("Error decrypting data:", error);
            }
        }
    };

    templateRequest.onerror = (event) => {
        console.error("Error retrieving data:", event.target.errorCode);
    };
}
// ===================================== end  default template
// choose template
document.addEventListener('click', function (e) {
    if (e.target.closest('#closetemplateModal')) {
        document.getElementById('templateModal').style.display = 'none';
    }
    if (e.target.closest('#btnclosetemplateModal')) {
        document.getElementById('templateModal').style.display = 'none';
    }
    if (e.target.closest('#submitTemplateBtn')) {
        submitTemplateBtn();
    }
    if (e.target.closest('#chooseTemplatebtn')) {
        document.getElementById('templateModal').style.display = 'block';
        templateHightlight(defaultTemplate);
    }
});

function templateHightlight(tNo) {
    const templateLabels = document.querySelectorAll('.template-label');
    templateLabels.forEach(templateLabel => {
        templateLabel.style.border = '2px solid transparent';
    });
    const templateLabelShow = document.querySelector('.template-label-show-' + tNo);
    templateLabelShow.style.border = '2px solid var(--primary-change-color)';
}

function submitTemplateBtn() {
    const selectedTemplate = document.querySelector('input[name="template"]:checked');
    if (selectedTemplate) {
        const selectedValue = selectedTemplate.value;

        document.getElementById('templateModal').style.display = 'none';

        if (!validateFields()) {
            return;
        }

        hideEmptyFields();

        templateChoose();

        document.getElementById('LoadSpinner').style.display = 'block';
        document.body.style.background = '#eee';
        document.body.style.cursor = 'not-allowed';

        setTimeout(function () {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                window.location.href = "templates/template_" + selectedValue + "/template_" + selectedValue + ".html?id=" + id;
            } else {
                window.location.href = "templates/template_" + selectedValue + "/template_" + selectedValue + ".html";
            }
        }, 5000);


    } else {
        let t = window.translations?.setting_default_currency_template || {};
        Swal.fire(t.swal_template_error_title);
    }
};


// pdf download button 
document.getElementById('downloadInvoice').addEventListener('click', downloadPDF);

async function downloadPDF() {

    if (!validateFields()) {
        return;
    }

    hideEmptyFields();

    templateChoose();

    document.getElementById('LoadSpinner').style.display = 'block';
    document.body.style.background = '#eee';
    document.body.style.cursor = 'not-allowed';

    setTimeout(function () {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            window.location.href = "templates/template_" + defaultTemplate + "/template_" + defaultTemplate + ".html?id=" + id;
        } else {
            window.location.href = "templates/template_" + defaultTemplate + "/template_" + defaultTemplate + ".html";
        }
    }, 5000);

    showHiddenFields();
}

// function compressImage(base64Image, quality = 0.5) {
//     return new Promise((resolve) => {
//         const img = new Image();
//         img.src = base64Image;
//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');

//             canvas.width = img.width;
//             canvas.height = img.height;

//             ctx.drawImage(img, 0, 0);

//             const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
//             resolve(compressedBase64);
//         };
//     });
// }





// document.getElementById('sendEmailButton').addEventListener('click', function () {
//     document.getElementById('emailModal').style.display = 'block';
// });

// document.getElementById('closeemailModal').addEventListener('click', function () {
//     document.getElementById('emailModal').style.display = 'none';
// });
// document.getElementById('btncloseemailModal').addEventListener('click', function () {
//     document.getElementById('emailModal').style.display = 'none';
// });




// document.getElementById('emailForm').addEventListener('submit', function (event) {
//     document.getElementById('emailModal').style.display = 'none';

//     event.preventDefault();

//     const senderEmailField = document.getElementById('senderEmail');
//     const senderEmail = senderEmailField.value;
//     const existingAlertsenderEmail = senderEmailField.nextElementSibling;
//     if (existingAlertsenderEmail) {
//         existingAlertsenderEmail.remove();
//         senderEmailField.style.border = '1px solid #eeeeee';
//     }

//     const recipientEmailField = document.getElementById('recipientEmail');
//     const recipientEmail = recipientEmailField.value;
//     const existingAlertrecipientEmail = recipientEmailField.nextElementSibling;
//     if (existingAlertrecipientEmail) {
//         existingAlertrecipientEmail.remove();
//         recipientEmailField.style.border = '1px solid #eeeeee';
//     }

//     const subjectEmailField = document.getElementById('subjectEmail');
//     const subjectEmail = subjectEmailField.value;
//     const existingAlertsubjectEmail = subjectEmailField.nextElementSibling;
//     if (existingAlertsubjectEmail) {
//         existingAlertsubjectEmail.remove();
//         subjectEmailField.style.border = '1px solid #eeeeee';
//     }

//     const emailMessageField = document.getElementById('emailMessage');
//     const emailMessage = emailMessageField.value;

//     if (!senderEmail || !recipientEmail || !subjectEmail) {
//         document.getElementById('emailModal').style.display = 'block';


//         if (!senderEmail) {
//             const existingAlert = senderEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Sender Email To field is required.';
//             senderEmailField.parentNode.insertBefore(alertDiv, senderEmailField.nextSibling);
//             senderEmailField.style.border = '2px solid red';
//         }

//         if (!recipientEmail) {
//             const existingAlert = recipientEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Recipient Email To field is required.';
//             recipientEmailField.parentNode.insertBefore(alertDiv, recipientEmailField.nextSibling);
//             recipientEmailField.style.border = '2px solid red';
//         }
//         if (!subjectEmail) {
//             const existingAlert = subjectEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Subject Message To field is required.';
//             subjectEmailField.parentNode.insertBefore(alertDiv, subjectEmailField.nextSibling);
//             subjectEmailField.style.border = '2px solid red';
//         }
//         return;
//     }



//     // Validate fields and create the PDF
//     if (!validateFields()) {
//         document.getElementById('loadingSpinner').style.display = 'none';
//         document.getElementById('submitButton').disabled = false;
//         document.body.style.background = '';
//         document.body.style.cursor = '';
//         return;
//     }
//     // Show the spinner
//     document.getElementById('loadingSpinner').style.display = 'block';
//     document.getElementById('submitButton').disabled = true;
//     document.body.style.background = '#eee';
//     document.body.style.cursor = 'not-allowed';
//     hideEmptyFields();
//     const invoice = document.getElementById('invoice');
//     html2canvas(invoice).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');

//         const { jsPDF } = window.jspdf;
//         const pdf = new jsPDF('p', 'pt', 'a4');
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         const pdfBlob = pdf.output('blob');
//         // console.log('PDF Blob:', pdfBlob);


//         const formData = new FormData();
//         formData.append('senderEmail', senderEmail);
//         formData.append('recipientEmail', recipientEmail);
//         formData.append('subject', subjectEmail);
//         formData.append('emailMessage', emailMessage);
//         formData.append('invoicePdf', pdfBlob, 'invoice.pdf');


//         // formData.forEach((value, key) => {
//         //     console.log(key + ": " + value);
//         // });
//         // for (const [key, value] of formData.entries()) {
//         //     console.log(key, value);
//         // }

//         $.ajaxSetup({
//             headers: {
//                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//             }
//         });
//         var url = "{{ route('send.invoice.email') }}";
//         $.ajax({
//             type: "POST",
//             url: url,
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function (response) {
//                 $('#successModal').modal('show');
//                 document.getElementById('emailModal').style.display = 'none';

//                 document.getElementById("successMessageEmail").innerText = response.message;
//                 document.getElementById("senderEmailMess").innerText = "Sender :- " + response.senderEmail;
//                 document.getElementById("recipientEmailMess").innerText = "Receiver :- " + response.recipientEmail;
//                 document.getElementById("subjectMess").innerText = "Subject :- " + response.subject;
//                 if (response.emailMessage != null) {
//                     document.getElementById("emailMessageMess").innerText = "email Message :-" + response.emailMessage;
//                 }

//                 // Hide spinner
//                 document.getElementById('loadingSpinner').style.display = 'none';
//                 document.getElementById('submitButton').disabled = false;
//                 document.body.style.background = '';
//                 document.body.style.cursor = '';
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 console.log('Error:', jqXHR.responseText);
//                 console.log('Status:', textStatus);
//                 console.log('Error Thrown:', errorThrown);

//                 // Hide spinner
//                 document.getElementById('loadingSpinner').style.display = 'none';
//                 document.getElementById('submitButton').disabled = false;
//                 document.body.style.background = '';
//                 document.body.style.cursor = '';


//                 // Optionally, show an error message or handle the error
//                 alert('There was an error sending the email. Please try again.');
//             }
//         });
//     });
//     showHiddenFields();
// });



// Form submission event
// document.getElementById('email-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const fromEmail = document.getElementById('from-email').value;
//     const toEmail = document.getElementById('to-email').value;
//     const pdfFile = document.getElementById('pdf-file').files[0];

//     const reader = new FileReader();
//     reader.onload = function(e) {
//         const base64PDF = e.target.result.split(',')[1];  // Get base64 data without the prefix

//         const templateParams = {
//             from_email: fromEmail,
//             to_email: toEmail,
//             attachment: base64PDF,  // PDF in base64 format
//             file_name: pdfFile.name,
//         };

//         // Send the email via EmailJS
//         emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
//             .then(function(response) {
//                 alert("Email sent successfully!");
//             }, function(error) {
//                 console.error("Failed to send email:", error);
//             });
//     };
//     reader.readAsDataURL(pdfFile);  // Read the PDF file as Base64
// });



// bank details input hide
function inputHideBankDetails() {
    const bankInput = document.getElementById('bank-input');
    bankInput.classList.add('hidden');

    const accountNameInput = document.getElementById('accountName');
    const accountNumberInput = document.getElementById('accountNumber');
    const ifscInput = document.getElementById('ifsc');
    const accountTypeInput = document.getElementById('accountType');
    const bankInputData = document.getElementById('bank');

    var bankDetailsDiv = document.querySelector('.bank-details');

    bankDetailsDiv.innerHTML = "";

    if (accountNameInput.value || accountNumberInput.value || ifscInput.value || accountTypeInput.value || bankInputData.value) {
        const bankShow = document.getElementById('bank-show');
        bankShow.classList.remove('hidden');
        bankDetailsDiv.innerHTML += `<h6 class="bank-details-title">Bank Details</h6>`;
    }
    if (accountNameInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Name: </strong>${accountNameInput.value}</p>`;
    }
    if (accountNumberInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Number: </strong>${accountNumberInput.value}</p>`;
    }
    if (ifscInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>IFSC: </strong>${ifscInput.value}</p>`;
    }
    if (accountTypeInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Type: </strong>${accountTypeInput.value}</p>`;
    }
    if (bankInputData.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Bank: </strong>${bankInputData.value}</p>`;
    }
}
//bank details input show
function inputShowBankDetails() {
    const bankInput = document.getElementById('bank-input');
    const bankShow = document.getElementById('bank-show');

    bankShow.classList.add('hidden');
    bankInput.classList.remove('hidden');
}
//bank details end

// upi qr code
function inputShowUPIQrCode() {
    const upiInput = document.getElementById('upi-input');
    const upiShow = document.getElementById('upi-show');
    upiShow.classList.add('hidden');
    upiInput.classList.remove('hidden');
}
function inputHideUPIQrCode() {
    const upiShow = document.getElementById('upi-show');
    const upiInput = document.getElementById('upi-input');
    upiInput.classList.add('hidden');
    var upiId = document.getElementById("upi-id").value;
    if (upiId) {
        upiShow.classList.remove('hidden');
        var upiString = `upi://pay?pa=${upiId}`;
        document.getElementById("upi-qrcode").innerHTML = "";
        var qrcode = new QRCode(document.getElementById("upi-qrcode"), {
            text: upiString,
            width: 250,
            height: 250
        });
        document.getElementById("upi-id-show").innerHTML = `<p><strong>${upiId}</strong></p>`;
    }
}
// upi qr code end

//================================================================== Upload Authorized Signator
document.getElementById('signatoryInput').addEventListener('change', function (event) {
    const input = event.target;
    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {
            const signatoryImage = document.getElementById('signatoryImage');
            signatoryImage.src = e.target.result;
            signatoryImage.style.display = 'block';

            const authorizedSignatory = document.querySelector('.authorized-signatory');
            authorizedSignatory.style.padding = '0';
            authorizedSignatory.style.borderRadius = '0';
            authorizedSignatory.style.border = 'none';
            authorizedSignatory.style.backgroundColor = 'transparent';

            document.querySelector('.authorized-signatory span').style.display = 'none';
            document.getElementById('signatoryInput').style.display = 'none';
            document.getElementById('removeSignatory').style.display = 'block';

        }
        reader.readAsDataURL(input.files[0]);
    }
});


document.getElementById('removeSignatory').addEventListener('click', function () {

    const authorizedSignatory = document.querySelector('.authorized-signatory');
    authorizedSignatory.style.padding = '10px';
    authorizedSignatory.style.borderRadius = '10px';
    authorizedSignatory.style.border = '1px solid var(--input-border-color)';
    authorizedSignatory.style.backgroundColor = 'var(--input-bg-color)';

    document.getElementById('signatoryImage').style.display = 'none';
    document.querySelector('.authorized-signatory span').style.display = 'block';
    document.getElementById('signatoryInput').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('signatoryInput').value = '';
});

function inputShowAuthorized() {
    document.getElementById('Authorized-Text').style.display = "block";
}
function inputHideAuthorized() {
    if (!document.getElementById('signatoryInput').value) {
        document.getElementById('Authorized-Text').style.display = "none";
    }
}


$(document).ready(function () {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const signatoryImage = document.getElementById('signatoryImage');
    const signatoryInput = document.getElementById('signatoryInput');
    let isDrawing = false;

    // Start drawing on canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(event) {
        isDrawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;
        ctx.moveTo(x, y);
    }

    function draw(event) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Clear canvas
    $('#clearCanvas').on('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save signature and upload as an image
    $('#saveSignature').on('click', function () {
        const dataURL = canvas.toDataURL('image/png');
        $('#signatoryImage').attr('src', dataURL).show();
        $('#removeSignatory').show();

        document.querySelector('.authorized-signatory span').style.display = 'none';
        document.getElementById('signatoryInput').style.display = 'none';
        document.getElementById('removeSignatory').style.display = 'block';

        const authorizedSignatory = document.querySelector('.authorized-signatory');
        authorizedSignatory.style.padding = '0';
        authorizedSignatory.style.borderRadius = '0';
        authorizedSignatory.style.border = 'none';
        authorizedSignatory.style.backgroundColor = 'transparent';

        // Simulate a file upload to the input field
        const blob = dataURItoBlob(dataURL);
        const file = new File([blob], "signature.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        signatoryInput.files = dataTransfer.files;
    });

    // Remove signature
    $('#removeSignatory').on('click', function () {
        $('#signatoryImage').hide().attr('src', '');
        $('#removeSignatory').hide();
        $('#signatoryInput').val('');
        const authorizedSignatory = document.querySelector('.authorized-signatory');
        authorizedSignatory.style.padding = '10px';
        authorizedSignatory.style.borderRadius = '10px';
        authorizedSignatory.style.border = '1px solid var(--input-border-color)';
        authorizedSignatory.style.backgroundColor = 'var(--input-bg-color)';

        document.getElementById('signatoryImage').style.display = 'none';
        document.querySelector('.authorized-signatory span').style.display = 'block';
        document.getElementById('signatoryInput').style.display = 'block';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Convert Data URL to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
});

//=============================================================== End upload Authorized Signatory


