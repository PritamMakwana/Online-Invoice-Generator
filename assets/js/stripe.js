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


document.getElementById('invoiceAmount').addEventListener('input', function () {
    const invoiceAmount = parseFloat(this.value) || 0;
    const stripeFee = (invoiceAmount * 0.029) + 0.30;
    const youWillReceive = invoiceAmount - stripeFee;
    const youShouldAskFor = invoiceAmount + stripeFee;

    document.getElementById('stripeFee').innerText = `$${stripeFee.toFixed(2)}`;
    document.getElementById('youWillReceive').innerText = `$${youWillReceive.toFixed(2)}`;
    document.getElementById('youShouldAskFor').innerText = `$${youShouldAskFor.toFixed(2)}`;
});