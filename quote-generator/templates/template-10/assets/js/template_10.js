"use strict";
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
    document.getElementById("from_address_input").value = from_address_input;
    document.getElementById("from_address_input").style.marginLeft = "10px";

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
    document.getElementById("bill-to-address-input").value = bill_to_address_input;
    document.getElementById("bill-to-address-input").style.marginLeft = "10px";

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
        image.style.width = '350px';
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
