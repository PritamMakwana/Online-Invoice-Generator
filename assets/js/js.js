"use strict";

// // Color chanage 
// default color code is #048b9f
//  // #ff5733
let colorAllWeb = "#048b9f";


function getcolorlWebColor() {
    return colorAllWeb;
}

document.documentElement.style.setProperty('--primary-change-color', colorAllWeb);
document.documentElement.style.setProperty('--primary-change-light-color', colorAllWeb + 21);

function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}
let targetColor = hexToRgb('#048b9f');
let elements = document.querySelectorAll('*');

elements.forEach(function (element) {
    let currentColor = window.getComputedStyle(element).color;
    if (currentColor === targetColor) {
        element.style.color = colorAllWeb;
    }
    let style = window.getComputedStyle(element);
    if (localStorage.getItem('nightMode') === 'on') {
        let selectedColorDark = '#17222a';
        element.style.setProperty('--primary-color', selectedColorDark);
    } else {
        element.style.setProperty('--primary-color', getcolorlWebColor());
    }
    element.style.setProperty('--primary-light-color', colorAllWeb + 21);
    element.style.setProperty('--primary-fix-color', colorAllWeb);
    element.style.setProperty('--primary-input-bg', colorAllWeb + '0f');
});

// location redirect if / url
if (window.location.pathname.endsWith('/')) {
    window.location.replace('/index.html');
}
// end location redirect if / url

// header footer add
function loadHTML(containerId, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = data;
            } else {
                console.error(`Element with id '${containerId}' not found.`);
            }
        })
        .catch(error => console.error('Error loading file:', error));
}
loadHTML('header', 'header.html');
loadHTML('footer', 'footer.html');
// header footer add
// google Translate in menu bar=========================================================

// add google Translate 
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'af,sq,ar,hy,az,eu,be,bn,bs,ca,hr,cs,da,nl,en,eo,et,tl,fi,fr,ga,gl,ka,de,el,gu,ht,ha,he,hi,hu,is,id,it,ja,jw,kn,km,ko,ku,ky,la,lv,lt,lb,mk,mg,ml,ms,mt,mi,mr,my,ne,no,or,pa,pl,pt,ma,ro,ru,sr,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,vi,cy,xh,yi,zu',
        autoDisplay: false,
    }, 'google_translate_element');
}

//end google Translate 

// css add for google Translate 
const style = document.createElement('style');
style.innerHTML = `

/* Google Translate powered by remove */
.goog-logo-link {
    display:none !important;
  }
.goog-te-gadget {
    color: transparent !important;
}
/* end Google Translate powered by remove */

/* Google Translate fully hight set related your menu */
#google_translate_element { 
    height: 43px !important;
    overflow: hidden !important; 
    } 
/*end Google Translate fully hight set related your menu */


/* Google Translate select option in give desing */
.goog-te-gadget .goog-te-combo {
  display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out; 
   } 
/*end Google Translate select option in give desing */


/* Hide the floating Google Translate widget */
.goog-logo-link {
    display: none !important;
}
/*end Hide the floating Google Translate widget */

/* Hide Google Translate top in goole menu */
.VIpgJd-ZVi9od-ORHb-OEVmcd{
  display: none !important;
}
/* end Hide Google Translate top in goole menu */

/* Hide Google Translate top in goole menu in space problem solve */
.goog-te-banner-frame.skiptranslate {
    display: none !important;
} 
body {
    top: 0px !important; 
}
/* Hide Google Translate top in goole menu in space problem solve */

/* Hide Google Translate contant right click or hover show pop up this remove */
#goog-gt-tt{display: none !important; top: 0px !important; }
/*end  Hide Google Translate contant right click or hover show pop up this remove */

/* Hide Google Translate loading icon remove */
.VIpgJd-ZVi9od-aZ2wEe-wOHMyf-ti6hGc {
    display: none;
}
// /*end  Hide Google Translate loading icon remove */
// // ===================

// `;



document.head.appendChild(style);
// end css add for google Translate

//end google Translate in menu bar ==============================================================================




// // ==========================
// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({
//         pageLanguage: 'en',
//         includedLanguages: 'en,fr,es,de,it,zh-CN,ja,ko',
//         layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
//         autoDisplay: false,
//     }, 'google_translate_element');
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const languageModal = document.getElementById('languageModal');
//     if (languageModal) {
//         languageModal.addEventListener('shown.bs.modal', function () {
//             if (!window.googleTranslateInitialized) {
//                 const script = document.createElement('script');
//                 script.type = 'text/javascript';
//                 script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//                 document.head.appendChild(script);

//                 window.googleTranslateInitialized = true;
//             }
//         });
//     } else {
//         console.error("Modal element not found");
//     }
// });

// function setLanguage(language) {
//     const checkTranslateInterval = setInterval(() => {
//         try {
//             var select = document.querySelector('.goog-te-combo');
//             if (select) {
//                 select.value = language;
//                 select.dispatchEvent(new Event('change'));
//                 clearInterval(checkTranslateInterval);
//             }
//         } catch (error) {
//             console.error('Error with Google Translate element:', error);
//         }
//     }, 100);
// }
// ==========================

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
// bottom to top button
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }
    });

    $('#backToTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });
});
// end bottom to top button

// JavaScript to dynamically apply the active class to the corresponding navigation link.
document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        if (currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
});
// End JavaScript to dynamically apply the active class to the corresponding navigation link.\


document.addEventListener('DOMContentLoaded', function () {
    // Create a function to inject head elements
    function injectHeadElements() {
        const head = document.head || document.getElementsByTagName('head')[0];

        // Meta Charset (usually already exists, but we'll ensure it)
        // let metaCharset = document.querySelector('meta[charset]');
        // if (!metaCharset) {
        //     metaCharset = document.createElement('meta');
        //     metaCharset.setAttribute('charset', 'UTF-8');
        //     head.appendChild(metaCharset);
        // }

        // Viewport Meta
        // let metaViewport = document.querySelector('meta[name="viewport"]');
        // if (!metaViewport) {
        //     metaViewport = document.createElement('meta');
        //     metaViewport.name = 'viewport';
        //     metaViewport.content = 'width=device-width, initial-scale=1';
        //     head.appendChild(metaViewport);
        // }

        // Favicon (change the href to your actual favicon path)
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.href = '/assets/image/favicon.ico'; // Update this path
            favicon.type = 'image/x-icon';
            head.appendChild(favicon);
        }

        // Fonts
        // const fonts = [
        //     {
        //         href: '/assets/cdn/Font/poppins.css',
        //         rel: 'stylesheet'
        //     },
        //     {
        //         href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
        //         rel: 'stylesheet'
        //     },
        //     {
        //         href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
        //         rel: 'stylesheet'
        //     }
        // ];

        // fonts.forEach(font => {
        //     let link = document.createElement('link');
        //     link.href = font.href;
        //     link.rel = font.rel;
        //     head.appendChild(link);
        // });

        // CSS Files
        // const stylesheets = [
        //     { href: 'assets/css/bootstrap.min.css' },
        //     { href: 'assets/css/style.css' },
        //     { href: '/assets/cdn/bootstrap-toggle/css/bootstrap-toggle.min.css' }
        // ];

        // stylesheets.forEach(sheet => {
        //     let link = document.createElement('link');
        //     link.href = sheet.href;
        //     link.rel = 'stylesheet';
        //     head.appendChild(link);
        // });

        // SEO Meta Tags (example - customize as needed)
        // const seoTags = [
        //     { name: 'description', content: 'Free Online Invoice Generator - Create professional invoices in minutes' },
        //     { name: 'keywords', content: 'invoice, generator, online invoice, free invoice' },
        //     { property: 'og:title', content: 'Online Invoice Generator' },
        //     { property: 'og:description', content: 'Create professional invoices for free' },
        //     { property: 'og:type', content: 'website' },
        //     { name: 'twitter:card', content: 'summary_large_image' }
        // ];

        // seoTags.forEach(tag => {
        //     let meta = document.createElement('meta');
        //     if (tag.name) meta.name = tag.name;
        //     if (tag.property) meta.setAttribute('property', tag.property);
        //     meta.content = tag.content;
        //     head.appendChild(meta);
        // });
    }

    // Call the function
    injectHeadElements();
});

// Close heading section and store state in localStorage
function closeHeading() {
    document.getElementById('heading-section').style.display = 'none';
    localStorage.setItem('headingClosed', 'true');
}

function headerNote() {
    if (localStorage.getItem('headingClosed') === 'true') {
        document.getElementById('heading-section').style.display = 'none';
    }
}
// Close heading section and store state in localStorage


// pass img-fluid in every img tag, except those with "no-use-fluid" class
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach(function (img) {
        if (!img.classList.contains("no-use-fluid")) {
            img.classList.add("img-fluid");
        }
    });
});
// end pass img-fluid in every img tag


// <script>alert('XSS')</script> Cross-Site Scripting (XSS) safe 
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/script/gi, '');
    });
});
// <script>alert('XSS')</script> Cross-Site Scripting (XSS) safe 

// Font Poppins
// Step 1: Load Poppins font from Google Fonts
const loadFont = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// Step 2: Apply Poppins to all elements and adjust typography
const applyTypography = () => {
    const style = document.createElement('style');
    style.innerHTML = `
   html,body,span,p,h1,h2,h3,h4,h5,h6,button,a {
    font-family: 'Poppins', sans-serif !important;
   }`;
    document.head.appendChild(style);
};

// Execute both functions on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadFont();
        applyTypography();
    }, 3000);
});
// end Font Poppins


// clarity
(function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", "sb1ehaygre");
// end clarity