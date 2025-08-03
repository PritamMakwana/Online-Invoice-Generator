"use strict";
$(document).ready(function () {
    setTimeout(function () {
        $('#nightModeToggle').bootstrapToggle();

        if (localStorage.getItem('nightMode') === 'on') {
            $('body').addClass('night-mode');

            const selectedColor = '#17222a';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);
            const wWhite = "#ffffff"
            document.documentElement.style.setProperty('--w-white', wWhite);
            const dark = "#ffffff";
            document.documentElement.style.setProperty('--dark', dark);
            const black = "#ffffff";
            document.documentElement.style.setProperty('--black', black);

            const sec_3_h2 = "#ffffff";
            document.documentElement.style.setProperty('--sec-3-h2', sec_3_h2);
            const sec_3_p = "#ffffff";
            document.documentElement.style.setProperty('--sec-3-p', sec_3_p);
            const sec_5_h2 = "#ffffff";
            document.documentElement.style.setProperty('--sec-5-h2', sec_5_h2);
            const sec_5_p = "#ffffff";
            document.documentElement.style.setProperty('--sec-5-p', sec_5_p);

            $('#nightModeToggle').prop('checked', true).bootstrapToggle('on');
        }

        $('#nightModeToggle').change(function () {
            if ($(this).is(':checked')) {

                const selectedColor = '#17222a';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wWhite = "#ffffff";
                document.documentElement.style.setProperty('--w-white', wWhite);
                const dark = "#ffffff";
                document.documentElement.style.setProperty('--dark', dark);
                const black = "#ffffff";
                document.documentElement.style.setProperty('--black', black);

                const sec_3_h2 = "#ffffff";
                document.documentElement.style.setProperty('--sec-3-h2', sec_3_h2);
                const sec_3_p = "#ffffff";
                document.documentElement.style.setProperty('--sec-3-p', sec_3_p);
                const sec_5_h2 = "#ffffff";
                document.documentElement.style.setProperty('--sec-5-h2', sec_5_h2);
                const sec_5_p = "#ffffff";
                document.documentElement.style.setProperty('--sec-5-p', sec_5_p);

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

                const sec_3_h2 = "#1c1934";
                document.documentElement.style.setProperty('--sec-3-h2', sec_3_h2);
                const sec_3_p = "#5e5d6d";
                document.documentElement.style.setProperty('--sec-3-p', sec_3_p);
                const sec_5_h2 = "#1c1934";
                document.documentElement.style.setProperty('--sec-5-h2', sec_5_h2);
                const sec_5_p = "#4e4e4e";
                document.documentElement.style.setProperty('--sec-5-p', sec_5_p);


                $('body').removeClass('night-mode');
                localStorage.setItem('nightMode', 'off');
            }
            location.reload();
        });
    }, 3000);
});


// text break class add this page
document.addEventListener("DOMContentLoaded", function () {
    const tags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    tags.forEach(tag => {
        document.querySelectorAll(tag).forEach(el => {
            el.classList.add('text-break');
        });
    });
});
// end text break class add this page