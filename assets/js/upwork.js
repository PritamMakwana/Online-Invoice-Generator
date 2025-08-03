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


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calculator-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Reset the results
        document.getElementById('earnings').textContent = '0';
        document.getElementById('upworkFee').textContent = '0';
        document.getElementById('feePercentage').textContent = '0';

        // Get input values
        const invoiceTotal = parseFloat(document.getElementById('invoiceTotal').value);
        const lifetimeBillings = parseFloat(document.getElementById('lifetimeBillings').value);

        // Validate input values
        if (isNaN(invoiceTotal) || isNaN(lifetimeBillings)) {
            Swal.fire('Please enter valid numbers for both fields.');
            return;
        }

        // Calculate the fee percentage based on lifetime billings
        const feePercentage = getFeePercentage(lifetimeBillings);
        const upworkFee = invoiceTotal * (feePercentage / 100);
        const earnings = invoiceTotal - upworkFee;

        // Update the results
        document.getElementById('earnings').textContent = earnings.toFixed(2);
        document.getElementById('upworkFee').textContent = upworkFee.toFixed(2);
        document.getElementById('feePercentage').textContent = feePercentage;
    });

    // Function to calculate fee percentage based on lifetime billings
    function getFeePercentage(lifetimeBillings) {
        if (lifetimeBillings <= 0) {
            return 0;
        } else if (lifetimeBillings <= 500) {
            return 20;
        } else if (lifetimeBillings <= 10000) {
            return 10;
        } else {
            return 5;
        }
    }
});