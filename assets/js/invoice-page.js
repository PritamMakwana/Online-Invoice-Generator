"use strict";

// night mode
$(document).ready(function () {
    setTimeout(function () {
        $('#nightModeToggle').bootstrapToggle();

        if (localStorage.getItem('nightMode') === 'on') {
            $('body').addClass('night-mode');

            const selectedColor = '#17222a';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);
            const wWhite = "#ffffff"
            document.documentElement.style.setProperty('--w-white', wWhite);
            const dark = "#ffffff";
            document.documentElement.style.setProperty('--dark', dark);
            const black = "#ffffff";
            document.documentElement.style.setProperty('--black', black);

            $('#nightModeToggle').prop('checked', true).bootstrapToggle('on');
        }

        $('#nightModeToggle').change(function () {
            if ($(this).is(':checked')) {

                const selectedColor = '#17222a';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wWhite = "#ffffff";
                document.documentElement.style.setProperty('--w-white', wWhite);
                const dark = "#ffffff";
                document.documentElement.style.setProperty('--dark', dark);
                const black = "#ffffff";
                document.documentElement.style.setProperty('--black', black);

                $('body').addClass('night-mode');
                localStorage.setItem('nightMode', 'on');
            } else {

                const selectedColor = getcolorlWebColor();
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wWhite = "#ffffff";
                document.documentElement.style.setProperty('--w-white', wWhite);
                const dark = "#17222a";
                document.documentElement.style.setProperty('--dark', dark);
                const black = "#000000";
                document.documentElement.style.setProperty('--black', black);


                $('body').removeClass('night-mode');
                localStorage.setItem('nightMode', 'off');
            }
            location.reload();
        });
    }, 3000);
});
// night mode end

// color changes
$(document).ready(function () {
    $('#primaryColorPicker').on('input', function () {
        const newColor = $(this).val();
        document.documentElement.style.setProperty('--primary-change-color', newColor);
        const lightColor = `${newColor}21`;
        document.documentElement.style.setProperty('--primary-change-light-color', lightColor);
        $('.card-border').css('border-color', newColor);
    });
});

$(document).ready(function () {
    $('.color-swatch').on('click', function () {
        $('.color-swatch').removeClass('active');
        $(this).addClass('active');
        const selectedColor = $(this).data('color');
        document.documentElement.style.setProperty('--primary-change-color', selectedColor);
        const lightColor = `${selectedColor}21`;
        document.documentElement.style.setProperty('--primary-change-light-color', lightColor);
        $('.card-border').css('border-color', selectedColor);
    });
});
// end color changes

// Client details ===========================================
let db;
const request = indexedDB.open("ClientDatabase", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("clients", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    displayDataClient();
};

async function displayDataClient() {
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const clients = event.target.result;
        clients.sort((a, b) => b.id - a.id);

        const clientSelect = document.getElementById("clientSelect");
        const clientSelectDiv = document.getElementById("clientSelectDiv");
        clientSelect.innerHTML = '<option value="">-- Select Client --</option>';

        if (clients.length > 0) {
            for (const client of clients) {
                const decryptedClient = await decryptClientData(client.encryptedData, client.iv, client.key);
                const option = document.createElement("option");
                option.value = client.id;
                option.textContent = decryptedClient.name;
                clientSelect.appendChild(option);
            }
            clientSelectDiv.style.display = 'block';
        } else {
            clientSelectDiv.style.display = 'none';
        }
    };
}
// Decrypt data
async function decryptClientData(encryptedData, iv, key) {
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData);
}

// Populate form fields with the selected client's details
async function populateClientDetails(clientId) {
    if (!clientId) {
        clearFormBillTo();
        return;
    }

    const billToCityStateInput = document.getElementById('bill-to-city-state-input');
    const billToZipCodeInput = document.getElementById('bill-to-zip-code-input');
    billToCityStateInput.style.display = 'block';
    billToZipCodeInput.style.display = 'block';


    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.get(Number(clientId));

    request.onsuccess = async (event) => {
        const client = event.target.result;
        if (client) {
            const decryptedClient = await decryptClientData(client.encryptedData, client.iv, client.key);

            document.getElementById("bill_to_name").value = decryptedClient.name;
            document.getElementById("bill-to-email").value = decryptedClient.email;
            document.getElementById("bill-to-street-input").value = decryptedClient.address;
            document.getElementById("bill-to-city-state-input").value = decryptedClient.cityState;
            document.getElementById("bill-to-zip-code-input").value = decryptedClient.zipCode;
            document.getElementById("bill-to-phone").value = decryptedClient.phone;
            document.getElementById("bill-to-mobile").value = decryptedClient.mobile;
            document.getElementById("bill-to-fax").value = decryptedClient.fax;
        }
    };

}

// Clear the form fields
function clearFormBillTo() {
    const fields = [
        "bill_to_name",
        "bill-to-email",
        "bill-to-street-input",
        "bill-to-city-state-input",
        "bill-to-zip-code-input",
        "bill-to-phone",
        "bill-to-mobile",
        "bill-to-fax"
    ];

    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
}
// Client details End ====================================================

// From details ===========================================
let from_db;
const fromRequest = indexedDB.open("FromDatabase", 1);

fromRequest.onupgradeneeded = (event) => {
    from_db = event.target.result;
    const objectStore = from_db.createObjectStore("froms", { keyPath: "id", autoIncrement: true });
};

fromRequest.onsuccess = (event) => {
    from_db = event.target.result;
    displayDataFrom();
};

async function displayDataFrom() {
    const transaction = from_db.transaction(['froms'], 'readonly');
    const objectStore = transaction.objectStore('froms');
    const fromRequest = objectStore.getAll();

    fromRequest.onsuccess = async (event) => {
        const froms = event.target.result;
        froms.sort((a, b) => b.id - a.id);

        const fromsSelect = document.getElementById("fromsSelect");
        let fromsSelectDiv = document.getElementById("fromsSelectDiv");
        fromsSelect.innerHTML = '<option value="">-- Select From --</option>';

        if (froms.length > 0) {
            for (const from of froms) {
                const decryptedFrom = await decryptFromData(from.encryptedData, from.iv, from.key);
                const option = document.createElement("option");
                option.value = from.id;
                option.textContent = decryptedFrom.name;
                fromsSelect.appendChild(option);
            }
            fromsSelectDiv.style.display = 'block';
        } else {
            fromsSelectDiv.style.display = 'none';
        }
    };
}
// Decrypt data
async function decryptFromData(encryptedData, iv, key) {
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData);
}

// Populate form fields with the selected From's details
async function populateFromsDetails(fromId) {
    if (!fromId) {
        clearFormBillTo();
        return;
    }

    const fromStreetInput = document.getElementById('from-street-input');
    const fromZipCodeInput = document.getElementById('from-zip-code-input');
    fromStreetInput.style.display = 'block';
    fromZipCodeInput.style.display = 'block';

    const transaction = from_db.transaction(['froms'], 'readonly');
    const objectStore = transaction.objectStore('froms');
    const fromRequest = objectStore.get(Number(fromId));

    fromRequest.onsuccess = async (event) => {
        const from = event.target.result;
        if (from) {
            const decryptedFrom = await decryptFromData(from.encryptedData, from.iv, from.key);

            document.getElementById("from_name").value = decryptedFrom.name;
            document.getElementById("from_email").value = decryptedFrom.email;
            document.getElementById("from-street-input").value = decryptedFrom.address;
            document.getElementById("from-city-state-input").value = decryptedFrom.cityState;
            document.getElementById("from-zip-code-input").value = decryptedFrom.zipCode;
            document.getElementById("from_phone").value = decryptedFrom.phone;
            document.getElementById("from_business_number").value = decryptedFrom.business_number;
            document.getElementById("from_website").value = decryptedFrom.from_website;
            document.getElementById("from_business_owner_name").value = decryptedFrom.from_business_owner_name;

        }
    };

}

// Clear the form fields
function clearFormBillTo() {
    const fields = [
        "from_name",
        "from_email",
        "from-street-input",
        "from-city-state-input",
        "from-zip-code-input",
        "from_phone",
        "from_business_number",
        "from_website",
        "from_business_owner_name",
    ];

    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
}
// From details End ====================================================


function templateChoose() {
    sessionStorage.clear();

    // === Save Invoice Histroy
    const saveInvoice = document.getElementById('save-invoice-toggle').checked;
    sessionStorage.setItem("saveInvoice", saveInvoice);
    // === End Save Invoice Histroy

    // === Choose Color 
    const rootElement = document.documentElement;
    const primaryChangeColor = getComputedStyle(rootElement).getPropertyValue('--primary-change-color').trim();
    sessionStorage.setItem("temp_color", primaryChangeColor);
    // === End Choose Color 

    // === Choose Color 
    const currency = document.getElementById('currency').value;
    sessionStorage.setItem("currency", currency);
    // === End Choose Color 

    //--------invoice heading
    let invoice_heading = document.getElementById('invoice-heading').value;
    if (sessionStorage.getItem("invoice-heading")) {
        sessionStorage.removeItem("invoice-heading");
    }
    sessionStorage.setItem("invoice-heading", invoice_heading);
    //--------end invoice heading

    //-------- logo input
    let fileInputlogo = document.getElementById("logoInput");
    const filelogo = fileInputlogo.files[0];
    if (filelogo) {
        console.log('1');
        const reader = new FileReader();
        reader.onload = function (e) {
            if (sessionStorage.getItem("logo")) {
                sessionStorage.removeItem("logo");
            }
            sessionStorage.setItem("logo", e.target.result);
        };
        reader.readAsDataURL(filelogo);
    } else {
        const logoImage = document.getElementById('logoImage');
        const logoSrc = logoImage.src;
        if (sessionStorage.getItem("logo")) {
            sessionStorage.removeItem("logo");
        }
        sessionStorage.setItem("logo", logoSrc);
    }
    //-------- end logo input

    //----------From
    let from_lable_address = document.getElementById('from_lable_address').textContent;
    if (sessionStorage.getItem("from_lable_address")) {
        sessionStorage.removeItem("from_lable_address");
    }
    sessionStorage.setItem("from_lable_address", from_lable_address);

    let from_street_input = document.getElementById('from-street-input').value;
    let from_city_state_input = document.getElementById('from-city-state-input').value;
    let from_zip_code_input = document.getElementById('from-zip-code-input').value;

    if (sessionStorage.getItem("from_street_input")) {
        sessionStorage.removeItem("from_street_input");
    }
    sessionStorage.setItem("from_street_input", from_street_input);

    if (sessionStorage.getItem("from_city_state_input")) {
        sessionStorage.removeItem("from_city_state_input");
    }
    sessionStorage.setItem("from_city_state_input", from_city_state_input);

    if (sessionStorage.getItem("from_zip_code_input")) {
        sessionStorage.removeItem("from_zip_code_input");
    }
    sessionStorage.setItem("from_zip_code_input", from_zip_code_input);

    let fromAddress = "";
    if (from_street_input != "") {
        fromAddress += from_street_input;
    }
    if (from_city_state_input != "") {
        fromAddress += ',' + from_city_state_input;
    }
    if (from_zip_code_input != "") {
        fromAddress += ',' + from_zip_code_input;
    }
    if (sessionStorage.getItem("from_address_input")) {
        sessionStorage.removeItem("from_address_input");
    }
    sessionStorage.setItem("from_address_input", fromAddress);

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
        const value = element[field.type] || '';
        sessionStorage.setItem(field.id, value);
    });
    //----------end From

    // -----------Bill To
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
        const value = element[field.type] || '';
        sessionStorage.setItem(field.id, value);
    });

    let bill_to_lable_address = document.getElementById('bill_to_lable_address').textContent;
    if (sessionStorage.getItem("bill_to_lable_address")) {
        sessionStorage.removeItem("bill_to_lable_address");
    }
    sessionStorage.setItem("bill_to_lable_address", bill_to_lable_address);

    let bill_to_street_input = document.getElementById('bill-to-street-input').value;
    let bill_to_city_state_input = document.getElementById('bill-to-city-state-input').value;
    let bill_to_zip_code_input = document.getElementById('bill-to-zip-code-input').value;

    if (sessionStorage.getItem("bill_to_street_input")) {
        sessionStorage.removeItem("bill_to_street_input");
    }
    sessionStorage.setItem("bill_to_street_input", bill_to_street_input);

    if (sessionStorage.getItem("bill_to_city_state_input")) {
        sessionStorage.removeItem("bill_to_city_state_input");
    }
    sessionStorage.setItem("bill_to_city_state_input", bill_to_city_state_input);

    if (sessionStorage.getItem("bill_to_zip_code_input")) {
        sessionStorage.removeItem("bill_to_zip_code_input");
    }
    sessionStorage.setItem("bill_to_zip_code_input", bill_to_zip_code_input);

    let billToAddress = "";
    if (bill_to_street_input != "") {
        billToAddress += bill_to_street_input;
    }
    if (bill_to_city_state_input != "") {
        billToAddress += ',' + bill_to_city_state_input;
    }
    if (bill_to_zip_code_input != "") {
        billToAddress += ',' + bill_to_zip_code_input;
    }
    if (sessionStorage.getItem("bill_to_address_input")) {
        sessionStorage.removeItem("bill_to_address_input");
    }
    sessionStorage.setItem("bill_to_address_input", billToAddress);
    // -----------End Bill To

    // --------Terms
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
        const value = element[field.type] || '';
        sessionStorage.setItem(field.id, value);
    });
    let termsSelect = document.getElementById('terms').value;
    if (sessionStorage.getItem("termsSelect")) {
        sessionStorage.removeItem("termsSelect");
    }
    sessionStorage.setItem('termsSelect', termsSelect);

    // table ===================
    if (sessionStorage.getItem("tableImage")) {
        sessionStorage.removeItem("tableImage");
    }
    var tableImage = null;
    html2canvas(document.getElementById('table-image')).then(function (canvas) {
        tableImage = canvas.toDataURL('image/png');
        sessionStorage.setItem('tableImage', tableImage);
    }).catch(function (error) {
        console.error("Error during image conversion: ", error);
    });
    // end table ===================


    // Table row and template save ===================
    const tableRows = document.querySelectorAll('#invoice-items tr');
    const template = document.getElementById('template').value;
    const rowData = [];

    tableRows.forEach(row => {
        const rowObject = {};
        if (template === 'quantity' || template === 'hours') {
            rowObject.description = row.querySelector('td:nth-child(1) input')?.value || '';
            rowObject.value1 = parseFloat(row.querySelector('td:nth-child(2) input')?.value) || 0;
            rowObject.value2 = parseFloat(row.querySelector('td:nth-child(3) input')?.value) || 0;
            rowObject.amount = parseFloat(row.querySelector('td:nth-child(4)')?.textContent.replace(currency, '').trim()) || 0;
        } else if (template === 'amounts-only') {
            rowObject.description = row.querySelector('td:nth-child(1) input')?.value || '';
            rowObject.amount = parseFloat(row.querySelector('td:nth-child(2) input')?.value) || 0;
        }
        rowObject.template = template; // Include the template type in each row object
        rowData.push(rowObject);
    });

    sessionStorage.setItem('tableAllRow', JSON.stringify(rowData));

    if (sessionStorage.getItem('templateSelect')) {
        sessionStorage.removeItem('templateSelect');
    }
    sessionStorage.setItem('templateSelect', template);

    // end table row and template save ===================

    // ============Notes and Terms============
    let notes_lable_description = document.getElementById('notes_lable_description').textContent;
    sessionStorage.setItem('notes_lable_description', notes_lable_description);

    let notes = document.querySelector('#notes').value;
    sessionStorage.setItem('notes', notes);

    let terms_lable_description = document.getElementById('terms_lable_description').textContent;
    sessionStorage.setItem('terms_lable_description', terms_lable_description);

    let terms = document.querySelector('.terms-note').value;
    sessionStorage.setItem('terms', terms);

    // ============Total============

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
        const label = document.getElementById(labelId)?.textContent;
        const value = document.querySelector(valueSelector)?.value || document.querySelector(valueSelector)?.textContent;
        const symbol = symbolSelector ? document.querySelector(symbolSelector)?.textContent : '';

        sessionStorage.setItem(labelId, label);
        sessionStorage.setItem(valueSelector, symbol + " " + value);

    });


    const discount = document.getElementById('discount').value;
    if (sessionStorage.getItem('discount')) {
        sessionStorage.removeItem('discount');
    }
    sessionStorage.setItem('discount', discount);
    const tax = document.getElementById('tax').value;
    if (sessionStorage.getItem('tax')) {
        sessionStorage.removeItem('tax');
    }
    sessionStorage.setItem('tax', tax);
    const shipping = document.getElementById('shipping').value;
    if (sessionStorage.getItem('shipping')) {
        sessionStorage.removeItem('shipping');
    }
    sessionStorage.setItem('shipping', shipping);
    const amount_paid = document.getElementById('amount-paid').value;
    if (sessionStorage.getItem('amount_paid')) {
        sessionStorage.removeItem('amount_paid');
    }
    sessionStorage.setItem('amount_paid', amount_paid);


    const total = document.getElementById('total').textContent;
    if (sessionStorage.getItem('total')) {
        sessionStorage.removeItem('total');
    }
    sessionStorage.setItem('total', total);

    const balanceDue = document.getElementById('balance-due').textContent;
    if (sessionStorage.getItem('balanceDue')) {
        sessionStorage.removeItem('balanceDue');
    }
    sessionStorage.setItem('balanceDue', balanceDue);


    // symbol
    const discountSymbol = document.getElementById('discountSymbol').textContent;
    if (sessionStorage.getItem('discountSymbol')) {
        sessionStorage.removeItem('discountSymbol');
    }
    sessionStorage.setItem('discountSymbol', discountSymbol);

    const taxSymbol = document.getElementById('taxSymbol').textContent;
    if (sessionStorage.getItem('taxSymbol')) {
        sessionStorage.removeItem('taxSymbol');
    }
    sessionStorage.setItem('taxSymbol', taxSymbol);

    const shippingSymbol = document.getElementById('shippingSymbol').textContent;
    if (sessionStorage.getItem('shippingSymbol')) {
        sessionStorage.removeItem('shippingSymbol');
    }
    sessionStorage.setItem('shippingSymbol', shippingSymbol);

    // total text

    // end total

    // ============Bank Details============

    // === Bank Details

    const toggleBankSwitch = document.getElementById("save-bank-toggle");

    if (toggleBankSwitch.checked == true) {
        const fields = [
            { labelId: 'bank_details_lable_title', inputId: null, key: 'bank_details_lable_title' },
            { labelId: 'bank_details_lable_account_name', inputId: 'accountName', key: 'bank_details_lable_account_name' },
            { labelId: 'bank_details_lable_account_number', inputId: 'accountNumber', key: 'bank_details_lable_account_number' },
            { labelId: 'bank_details_lable_ifsc', inputId: 'ifsc', key: 'bank_details_lable_ifsc' },
            { labelId: 'bank_details_account_type', inputId: 'accountType', key: 'bank_details_account_type' },
            { labelId: 'bank_details_bank_name', inputId: 'bank', key: 'bank_details_bank_name' },
        ];

        fields.forEach(({ labelId, inputId, key }) => {
            const labelElement = document.getElementById(labelId);
            if (labelElement) {
                sessionStorage.setItem(key, labelElement.textContent);
            }
            if (inputId) {
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    sessionStorage.setItem(inputId, inputElement.value);
                }
            }
        });
    }
    // End Bank Details ===================

    // UPI
    const toggleUpiSwitch = document.getElementById("save-upi-toggle");
    if (toggleUpiSwitch.checked == true) {
        let upiId = document.querySelector('#upi-id').value;
        if (upiId.length > 1) {
            if (sessionStorage.getItem('upiImage')) {
                sessionStorage.removeItem('upiImage');
            }
            var upiQr = "";
            html2canvas(document.getElementById('upi-show')).then(function (canvas) {
                upiQr = canvas.toDataURL('image/png');
                sessionStorage.setItem('upiImage', upiQr);
                sessionStorage.setItem('upiId', upiId);
            }).catch(function (error) {
                console.error('Error capturing UPI image:', error);
            });
        }
    }
    // === Authorized Signatory
    const toggleSignatureSwitch = document.getElementById("save-signature-toggle");
    if (toggleSignatureSwitch.checked == true) {
        let authorized_text = document.getElementById('Authorized-Text').textContent;
        sessionStorage.setItem('authorized_text', authorized_text);

        let signatoryInput = document.getElementById("signatoryInput");
        const signatorylogo = signatoryInput.files[0];
        if (signatorylogo) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (sessionStorage.getItem("signatory")) {
                    sessionStorage.removeItem("signatory");
                }
                sessionStorage.setItem("signatory", e.target.result);
            };
            reader.readAsDataURL(signatorylogo);
        } else {
            const signatoryImage = document.getElementById('signatoryImage');
            const signatoryImageSrc = signatoryImage.src;
            if (sessionStorage.getItem("signatory")) {
                sessionStorage.removeItem("signatory");
            }
            sessionStorage.setItem("signatory", signatoryImageSrc);
        }
    }
    // === end Authorized Signatory
}
