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


function calculateGST() {
    const amount = parseFloat($('#amount').val()) || 0;
    const gstPercentage = parseFloat($('#gst-percentage').val()) || 0;
    const taxType = $('#tax-type').val();

    let actualAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (taxType === 'Inclusive') {
        actualAmount = amount / (1 + gstPercentage / 100);
        gstAmount = amount - actualAmount;
        totalAmount = amount;
    } else if (taxType === 'Exclusive') {
        actualAmount = amount;
        gstAmount = amount * gstPercentage / 100;
        totalAmount = amount + gstAmount;
    }

    $('#actual-amount').text(actualAmount.toFixed(2));
    $('#gst-amount').text(gstAmount.toFixed(2));
    $('#total-amount').text(totalAmount.toFixed(2));
}