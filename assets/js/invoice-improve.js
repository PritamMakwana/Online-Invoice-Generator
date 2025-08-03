"use strict";

// Address From
const fromStreetInput = document.getElementById('from-street-input');
const fromCityStateInput = document.getElementById('from-city-state-input');
const fromZipCodeInput = document.getElementById('from-zip-code-input');

function checkFromAddressFields() {
    if (fromStreetInput.value.trim() !== '') {
        fromCityStateInput.style.display = 'block';
        fromZipCodeInput.style.display = 'block';
    } else {
        fromCityStateInput.style.display = 'none';
        fromZipCodeInput.style.display = 'none';
    }
}
fromStreetInput.addEventListener('input', checkFromAddressFields);
// End Address From

// Address Bill To
const billToStreetInput = document.getElementById('bill-to-street-input');
const billToCityStateInput = document.getElementById('bill-to-city-state-input');
const billToZipCodeInput = document.getElementById('bill-to-zip-code-input');

function checkBillToAddressFields() {
    if (billToStreetInput.value.trim() !== '') {
        billToCityStateInput.style.display = 'block';
        billToZipCodeInput.style.display = 'block';
    } else {
        billToCityStateInput.style.display = 'none';
        billToZipCodeInput.style.display = 'none';
    }
}
billToStreetInput.addEventListener('input', checkBillToAddressFields);
// End Address 

// today date seleted
document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});
//End today date seleted
// due date
function updateDueDate() {
    const terms = document.getElementById('terms').value;
    const dueDateField = document.getElementById('dueDate');
    const customDateGroup = document.getElementById('custom-date-group');
    const customDateInput = document.getElementById('customDate');

    let dueDate = '';

    if (terms === 'none') {
        dueDate = 'No due date';
        customDateGroup.style.display = 'none';
    } else if (terms === 'custom') {
        customDateGroup.style.display = 'block';
        dueDate = customDateInput.value || 'Select a date';
    } else {
        customDateGroup.style.display = 'none';
        const today = new Date();
        today.setDate(today.getDate() + parseInt(terms));
        dueDate = today.toISOString().split('T')[0];
    }

    dueDateField.value = dueDate;
}
// end due date

// subtotal in empty set 0
function handleEmpty(input) {
    if (input.value === '') {
        input.value = 0;
    }
}
//end subtotal in empty set 0


// this give all text box only 100 characters
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        if (this.value.length > 100) {
            this.value = this.value.substring(0, 100);
        }
    });
});
// end  this give all text box only 100 characters

// table in all filed are 50 characters
document.addEventListener('DOMContentLoaded', function () {
    tableInputLimits();
});
// end table in all filed are 50 characters

//  Number input validation
function inputNumberValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        // Remove the up/down arrows for all number inputs
        input.style.webkitAppearance = 'none';
        input.style.mozAppearance = 'textfield';
        input.style.appearance = 'none';
        input.addEventListener('keydown', function (event) {
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

}
document.addEventListener('DOMContentLoaded', inputNumberValidation);
//  Number input validation


// account type select
function handleAccountTypeChange() {
    const accountTypeSelect = document.getElementById('accountTypeSelect').value;
    const accountType = document.getElementById('accountType');

    if (accountTypeSelect == 'other') {
        accountType.classList.remove('d-none');
        accountType.type = 'text';
        accountType.value = "";
    } else {
        accountType.classList.add('d-none');
        accountType.type = 'hidden';
        accountType.value = accountTypeSelect;
    }
}
// end account type select


// table input limit
function tableInputLimits() {
    const maxLength = 50;
    const table1 = document.getElementById('invoice-items');

    const tooltip = document.createElement('div');
    tooltip.classList.add('custom-tooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '2px 6px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);

    table1.addEventListener('input', function (e) {
        if (e.target.tagName === 'INPUT') {
            const input = e.target;
            if (input.value.length > maxLength) {
                input.value = input.value.substring(0, maxLength);
            }
            const remaining = maxLength - input.value.length;
            tooltip.textContent = `${remaining} characters remaining`;
        }
    });

    table1.addEventListener('focusin', function (e) {
        if (e.target.tagName === 'INPUT') {
            tooltip.style.display = 'block';
        }
    });

    table1.addEventListener('focusout', function (e) {
        if (e.target.tagName === 'INPUT') {
            tooltip.style.display = 'none';
        }
    });

    table1.addEventListener('mousemove', function (e) {
        if (e.target.tagName === 'INPUT') {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY - 30}px`;
        }
    });
}
// end table input limit

// bank upi signature toggle
document.addEventListener("DOMContentLoaded", function () {
    const toggleBankSwitch = document.getElementById("save-bank-toggle");
    const toggleUpiSwitch = document.getElementById("save-upi-toggle");
    const toggleSignatureSwitch = document.getElementById("save-signature-toggle");

    const bankInputSection = document.getElementById("bank-input");
    const upiInputSection = document.getElementById("upi-input");
    const authorizedSignatorySection = document.getElementById("authorized-signatory");

    function toggleBankUPISignatory() {
        bankInputSection.classList.toggle("d-none", !toggleBankSwitch.checked);
        upiInputSection.classList.toggle("d-none", !toggleUpiSwitch.checked);
        authorizedSignatorySection.classList.toggle("d-none", !toggleSignatureSwitch.checked);
    }

    toggleBankSwitch.addEventListener("change", toggleBankUPISignatory);
    toggleUpiSwitch.addEventListener("change", toggleBankUPISignatory);
    toggleSignatureSwitch.addEventListener("change", toggleBankUPISignatory);

    toggleBankUPISignatory();
});
// end bank upi signature toggle

// google translate multi-language Due date text showing as two date
const termsLableDueDateTwo = document.getElementById('terms_lable_due_date');
if (termsLableDueDateTwo.textContent == 'Two Dates') {
    termsLableDueDateTwo.textContent = 'Due Date';
}
// end google translate multi-language Due date text showing as two date