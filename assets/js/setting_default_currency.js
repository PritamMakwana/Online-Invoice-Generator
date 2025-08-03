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

// ===================================== choose default currency
let currencyDb;
const request = indexedDB.open("currencyDatabase", 2);

request.onupgradeneeded = (event) => {
    currencyDb = event.target.result;

    if (!currencyDb.objectStoreNames.contains("currencyDefault")) {
        currencyDb.createObjectStore("currencyDefault", { keyPath: "id", autoIncrement: true });
    } else {
        console.log("Object store 'currencyDefault' already exists.");
    }
};


request.onsuccess = (event) => {
    currencyDb = event.target.result;
    displayData();
};

request.onerror = (event) => {
    const error = event.target.error || "Unknown error";
    console.error("Error opening IndexedDB:", error);
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

async function updateCurrency() {
    if (!currencyDb) {
        console.error("Database is not initialized.");
        return;
    }

    const currency = document.getElementById("currency").value;

    const data = { currency };
    const { encryptedData, iv, key } = await encryptData(data);

    const transaction = currencyDb.transaction("currencyDefault", "readwrite");
    const objectStore = transaction.objectStore("currencyDefault");

    objectStore.clear();

    objectStore.add({ encryptedData, iv, key });
    // transaction.oncomplete = () => displayData();
    let t = window.translations?.setting_default_currency_template || {};
    transaction.oncomplete = () => {
        displayData();
        Swal.fire({
            icon: 'success',
            title: t.swal_curreny_save_title,
            text: t.swal_curreny_save_text,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            location.reload();
        });
    };

}

async function displayData() {
    if (!currencyDb) {
        console.error("Database is not initialized.");
        return;
    }

    const transaction = currencyDb.transaction("currencyDefault", "readonly");
    const objectStore = transaction.objectStore("currencyDefault");
    const request = objectStore.getAll();

    request.onsuccess = async (event) => {
        const currencies = event.target.result;
        for (const c of currencies) {
            const decryptedData = await decryptData(c.encryptedData, c.iv, c.key);
            document.getElementById("currency").value = decryptedData.currency;
        }
    };

    request.onerror = (event) => {
        console.error("Error retrieving data:", event.target.errorCode);
    };
}



// ===================================== end choose default currency