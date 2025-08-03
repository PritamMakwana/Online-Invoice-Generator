"use strict";

// night mode
$(document).ready(function () {
    setTimeout(function () {
        $('#nightModeToggle').bootstrapToggle();

        if (localStorage.getItem('nightMode') === 'on') {
            $('body').addClass('night-mode');

            const selectedColor = '#17222a';
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            const lightColor = `${selectedColor}21`;
            document.documentElement.style.setProperty('--primary-light-color', lightColor);
            const wColor = "#ffffff"
            document.documentElement.style.setProperty('--w-color', wColor);

            const black = "#ffffff"
            document.documentElement.style.setProperty('--black', black);
            const cardColor = "#000000"
            document.documentElement.style.setProperty('--card-color', cardColor);

            $('#nightModeToggle').prop('checked', true).bootstrapToggle('on');
        }

        $('#nightModeToggle').change(function () {
            if ($(this).is(':checked')) {

                const selectedColor = '#17222a';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wColor = "#ffffff"
                document.documentElement.style.setProperty('--w-color', wColor);

                const black = "#ffffff"
                document.documentElement.style.setProperty('--black', black);
                const cardColor = "#000000"
                document.documentElement.style.setProperty('--card-color', cardColor);

                $('body').addClass('night-mode');
                localStorage.setItem('nightMode', 'on');
            } else {

                const selectedColor = '#048b9f';
                document.documentElement.style.setProperty('--primary-color', selectedColor);
                const lightColor = `${selectedColor}21`;
                document.documentElement.style.setProperty('--primary-light-color', lightColor);
                const wColor = "#ffffff"
                document.documentElement.style.setProperty('--w-color', wColor);

                const black = "#000000"
                document.documentElement.style.setProperty('--black', black);
                const cardColor = "white"
                document.documentElement.style.setProperty('--card-color', cardColor);

                $('body').removeClass('night-mode');
                localStorage.setItem('nightMode', 'off');
            }
            location.reload();
        });
    }, 3000);
});
// end night mode

// choose template border
function templateHightlight(tNo) {
    const templateLabels = document.querySelectorAll('.template-label');
    templateLabels.forEach(templateLabel => {
        templateLabel.style.border = '2px solid transparent';
    });
    const templateLabelShow = document.querySelector('.template-label-show-' + tNo);
    templateLabelShow.style.border = '2px solid var(--primary-color)';
}



// ===================================== choose default teamplate
let defaultTemplate = 1;
let templateDb;
const templateRequest = indexedDB.open("templateDatabase", 3);
templateHightlight(defaultTemplate)

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

    // Log available object stores
    // console.log("Available object stores:", templateDb.objectStoreNames);
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
                const templateLabels = document.querySelectorAll('.template-label');
                templateLabels.forEach(templateLabel => {
                    templateLabel.style.border = '2px solid transparent';
                });
                const templateLabelShow = document.querySelector('.template-label-show-' + decryptedData.template);
                templateLabelShow.style.border = '2px solid var(--primary-color)';
            } catch (error) {
                console.error("Error decrypting data:", error);
            }
        }
    };

    templateRequest.onerror = (event) => {
        console.error("Error retrieving data:", event.target.errorCode);
    };
}

// Submit template
document.getElementById("templateForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!templateDb) {
        console.error("Database is not initialized.");
        return;
    }

    // Check for object store existence
    if (!templateDb.objectStoreNames.contains("templateDefault")) {
        console.error("Object store 'templateDefault' not found. Cannot save data.");
        return;
    }

    const selectedTemplate = document.querySelector('input[name="template"]:checked');
    if (selectedTemplate) {
        const template = selectedTemplate.value;
        const data = { template };

        try {
            const { encryptedData, iv, key } = await encryptData(data);
            const transaction = templateDb.transaction("templateDefault", "readwrite");
            const objectStore = transaction.objectStore("templateDefault");

            // Clear the object store before adding new data
            objectStore.clear().onsuccess = () => {
                objectStore.add({ encryptedData, iv, key });
                let t = window.translations?.setting_default_currency_template || {};
                Swal.fire({
                    icon: 'success',
                    title: t.swal_template_save_title,
                    text: t.swal_template_save_text,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });

            };
        } catch (error) {
            console.error("Error encrypting or saving data:", error);
        }
    } else {
        let t = window.translations?.setting_default_currency_template || {};
        Swal.fire({
            icon: 'error',
            title: t.swal_template_error_title,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            location.reload();
        });

    }
});
function templateHightlight(tNo) {
    const templateLabels = document.querySelectorAll('.template-label');
    templateLabels.forEach(templateLabel => {
        templateLabel.style.border = '2px solid transparent';
    });
    const templateLabelShow = document.querySelector('.template-label-show-' + tNo);
    templateLabelShow.style.border = '2px solid var(--primary-color)';
}


// ===================================== end choose default currency