"use strict";

// night mode

$(document).ready(function () {
    $('#nightModeToggle').bootstrapToggle();

    if (localStorage.getItem('nightMode') === 'on') {
        $('body').addClass('night-mode');

        const selectedColor = '#17222a';
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        const lightColor = `${selectedColor}21`;
        document.documentElement.style.setProperty('--primary-light-color', lightColor);


        $('#nightModeToggle').prop('checked', true).bootstrapToggle('on');
    }

    $('#nightModeToggle').change(function () {
        if ($(this).is(':checked')) {

            const selectedColor = '#17222a';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);


            $('body').addClass('night-mode');
            localStorage.setItem('nightMode', 'on');
        } else {

            const selectedColor = '#048b9f';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);

            $('body').removeClass('night-mode');
            localStorage.setItem('nightMode', 'off');
        }
    });
});

// end night mode

// ============================== paypal logic
let feeStructures = {
    'US Domestic': {
        'Invoicing, PayPal Checkout, Venmo': { 'percentage': 3.49, 'fixed': 0.49 },
        'Credit and Debit Cards': { 'percentage': 2.99, 'fixed': 0.49 },
        'Goods and Services, Donations': { 'percentage': 2.89, 'fixed': 0.49 },
        'Charity': { 'percentage': 1.99, 'fixed': 0.49 },
        'Micropayment': { 'percentage': 4.99, 'fixed': 0.09 },
        'PayPal Guest Checkout - American Express Payments': { 'percentage': 3.5, 'fixed': 0.00 },
        'QR code - $10.01 and above': { 'percentage': 1.9, 'fixed': 0.10 },
        'QR code - $10 and below': { 'percentage': 2.4, 'fixed': 0.05 }
    },
    'US International': {
        'Invoicing, PayPal Checkout, Venmo': { 'percentage': 4.99, 'fixed': 0.49 },
        'Credit and Debit Cards': { 'percentage': 4.49, 'fixed': 0.49 },
        'Goods and Services, Donations': { 'percentage': 4.39, 'fixed': 0.49 },
        'Charity': { 'percentage': 3.49, 'fixed': 0.49 },
        'Micropayment': { 'percentage': 6.49, 'fixed': 0.09 }
    },
    'Canada Domestic': {
        'Standard': { 'percentage': 2.9, 'fixed': 0.30 },
        'Charitable Organizations': { 'percentage': 1.6, 'fixed': 0.30 },
        'PayPal Payments Pro': { 'percentage': 2.9, 'fixed': 0.30 },
        'Virtual Terminal': { 'percentage': 3.1, 'fixed': 0.30 },
        'Micropayment': { 'percentage': 5.0, 'fixed': 0.05 }
    },
    'Canada From U.S.': {
        'Standard': { 'percentage': 3.7, 'fixed': 0.30 },
        'Charitable Organizations': { 'percentage': 1.6, 'fixed': 0.30 },
        'PayPal Payments Pro': { 'percentage': 3.7, 'fixed': 0.30 },
        'Virtual Terminal': { 'percentage': 3.9, 'fixed': 0.30 },
        'Micropayment': { 'percentage': 5.0, 'fixed': 0.05 }
    },
    'Canada From Outside Canada or U.S.': {
        'Standard': { 'percentage': 3.9, 'fixed': 0.30 },
        'Charitable Organizations': { 'percentage': 2.6, 'fixed': 0.30 },
        'PayPal Payments Pro': { 'percentage': 3.9, 'fixed': 0.30 },
        'Virtual Terminal': { 'percentage': 4.1, 'fixed': 0.30 },
        'Micropayment': { 'percentage': 6.0, 'fixed': 0.05 }
    },
    'Canada American Express': {
        'Standard': { 'percentage': 3.5, 'fixed': 0.00 }
    },
    'India Local': {
        'Standard': { 'percentage': 2.5, 'fixed': 3.00 }
    },
    'India International': {
        'Up to $3000 monthly sales': { 'percentage': 4.4, 'fixed': 3.00 },
        '$3000+ to $10,000 monthly sales': { 'percentage': 3.9, 'fixed': 3.00 },
        '$10,000+ to $100,000 monthly sales': { 'percentage': 3.7, 'fixed': 3.00 },
        '$100,000+ monthly sales': { 'percentage': 3.4, 'fixed': 3.00 }
    },
    'United Kingdom': {
        'Domestic': { 'percentage': 2.9, 'fixed': 0.30 },
        'From Europe I, Northern Europe': { 'percentage': 3.4, 'fixed': 0.30 },
        'From Canada, USA, Europe II, rest of the world': { 'percentage': 4.9, 'fixed': 0.30 },
        'Charity': { 'percentage': 1.4, 'fixed': 0.20 },
        'Micropayment': { 'percentage': 5.0, 'fixed': 0.05 }
    }
};

function populateCountries() {
    let countrySelect = document.getElementById('country');
    Object.keys(feeStructures).forEach(country => {
        let option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

function chooseCountry(event) {
    const country = event.target.value;
    const feeTypes = feeStructures[country] || {};

    const typeDiv = document.getElementById('type');
    typeDiv.innerHTML = '';

    if (feeTypes) {
        const select = document.createElement('select');
        select.classList.add('form-control', 'form-select', 'my-1');
        select.id = 'fee_type';
        select.name = 'fee_type';

        Object.keys(feeTypes).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${key} , Percentage = ${feeTypes[key].percentage}%, Fixed = ${feeTypes[key].fixed}`;
            // statusBadge.setAttribute('data-i18n', 'invoice_history.td_status_paid');
            // option.innerHTML = `${key} ,<span data-i18n="tool_paypal.sec_3_option_percentage">Percentage</span> = ${feeTypes[key].percentage}%,<span data-i18n="tool_paypal.sec_3_option_fixed">Fixed</span> = ${feeTypes[key].fixed}`;
            select.appendChild(option);
        });

        typeDiv.appendChild(select);
    }
}

function SubmitData() {
    const amount = document.getElementById('amount').value;
    const country = document.getElementById('country').value;
    const feeType = document.getElementById('fee_type') ? document.getElementById('fee_type').value : '';
    let t = window.translations?.tool_paypal || {};
    if (!amount) {
        Swal.fire(t.swal_req_amount);
        return;
    }

    if (!country) {
        Swal.fire(t.swal_req_country);
        return;
    }

    if (!feeType) {
        Swal.fire(t.swal_req_fee_type);
        return;
    }

    const feeDetails = feeStructures[country]?.[feeType] || {};
    const fee = feeDetails.percentage ? (amount * feeDetails.percentage / 100) + feeDetails.fixed : 0;

    const totalAmount = amount - fee;
    const youPay = parseFloat(amount) + parseFloat(fee);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
            <div class="card my-4 mx-auto p-4" style="max-width: 500px;">
                <div class="card-header text-start card-header text-white">
                    <h3 class="card-title text-light mt-2 ms-3" data-i18n="tool_paypal.sec_3_results_title">Results</h3>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled ans-list" style="display:flex;flex-direction: column;align-items: flex-start;">
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_fee_type">Fee Type:</span></strong> <span style="color:var(--primary-color);">${feeType}</span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_selected_country">Selected Country:</span></strong> <span style="color:var(--primary-color);">  ${country} </span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_paypal_fee">PayPal Fee:</span></strong> <span style="color:var(--primary-color);">  $${fee.toFixed(2)} </span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_you_will_receive">You Will Receive:</span></strong> <span style="color:var(--primary-color);">  $${totalAmount.toFixed(2)} </span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_you_should_ask_for">You Should Ask For:</span></strong> <span style="color:var(--primary-color);">  $${parseFloat(youPay).toFixed(2)} </span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_original_amount">Original Amount:</span></strong> <span style="color:var(--primary-color);">  $${parseFloat(amount).toFixed(2)} </span></li>
                        <li><strong style="color: #048b9f;"><span data-i18n="tool_paypal.sec_3_results_fee_structure">Fee Structure:</span></strong> <span style="color:var(--primary-color);"> ${feeDetails.percentage}% + $${feeDetails.fixed} <span data-i18n="tool_paypal.sec_3_results_per_transaction">per transaction</span> </span></li>
                    </ul>
                </div>
                <div class="card-footer text-muted">
                    <small><span data-i18n="tool_paypal.sec_3_results_desc">The amounts are calculated based on the PayPal fees of </span> ${feeDetails.percentage}% + $${feeDetails.fixed} <span data-i18n="tool_paypal.sec_3_results_per_transaction">per transaction</span>.</small>
                </div>
            </div>`;
}

window.onload = populateCountries;

// ============================== end paypal logic