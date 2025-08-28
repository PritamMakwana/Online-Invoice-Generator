"use strict";

const dbName = 'MultiLangDB';
const storeName = 'translations';
let dbMultiLang;
let datatableLanguage = 'english';

function initDB() {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => console.error("IndexedDB failed");

    request.onsuccess = (event) => {
        dbMultiLang = event.target.result;
        loadStoredLanguage(); // Load selected language key
    };

    request.onupgradeneeded = (event) => {
        dbMultiLang = event.target.result;
        dbMultiLang.createObjectStore(storeName, { keyPath: 'lang' });
    };
}

function saveSelectedLang(lang) {
    const tx = dbMultiLang.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put({ lang: 'selectedLang', data: lang });
}

function getSelectedLang() {
    return new Promise((resolve) => {
        const tx = dbMultiLang.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get('selectedLang');
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => resolve(null);
    });
}

function loadLanguage(lang) {
    // const script = document.createElement('script');
    // script.src = `/assets/lang/${lang}.js`; // Always load fresh file
    // script.onload = () => {
    //     updateText(window[lang]);
    // };
    // document.body.appendChild(script);

    // saveSelectedLang(lang); // Save selected language key

    const sections = ['home', 'layout', 'invoice', 'purchase', 'quote', 'document_alert', 'invoice_history', 'quote_history', 'purchase_history', 'setting_client_details', 'setting_from_details', 'setting_import_product', 'setting_default_currency_template', 'help']; // or auto-detect from page
    let loaded = 0;
    window.translations = {};

    // sections.forEach(section => {
    //     const script = document.createElement('script');
    //     if (['invoice', 'purchase', 'quote', 'document_alert'].includes(section)) {
    //         script.src = `/assets/lang/${lang}/documents/${section}.js`;
    //         script.onload = () => {
    //             loaded++;
    //             if (loaded === sections.length) {
    //                 updateText(flattenTranslations(window.translations));
    //             }
    //         };
    //     } else if (['invoice_history', 'quote_history', 'purchase_history'].includes(section)) {
    //         script.src = `/assets/lang/${lang}/documents/${section}.js`;
    //         script.onload = () => {
    //             loaded++;
    //             if (loaded === sections.length) {
    //                 setTimeout(() => updateText(flattenTranslations(window.translations)), 1000);
    //             }
    //         };
    //     } else if (['setting_client_details', 'setting_from_details', 'setting_import_product', 'setting_default_currency_template'].includes(section)) {
    //         script.src = `/assets/lang/${lang}/settings/${section}.js`;
    //         script.onload = () => {
    //             loaded++;
    //             if (loaded === sections.length) {
    //                 setTimeout(() => updateText(flattenTranslations(window.translations)), 1000);
    //             }
    //         };
    //     }
    //     else {
    //         script.src = `/assets/lang/${lang}/${section}.js`;
    //         script.onload = () => {
    //             loaded++;
    //             if (loaded === sections.length) {
    //                 updateText(flattenTranslations(window.translations));
    //             }
    //         };
    //     }

    //     document.body.appendChild(script);
    // });

    sections.forEach(section => {
        const script = document.createElement('script');
        if (['invoice', 'purchase', 'quote', 'document_alert'].includes(section)) {
            script.src = `assets/lang/${lang}/documents/${section}.js`;
            script.onload = () => {
                loaded++;
                if (loaded === sections.length) {
                    updateText(flattenTranslations(window.translations));
                }
            };
        } else if (['invoice_history', 'quote_history', 'purchase_history'].includes(section)) {
            script.src = `assets/lang/${lang}/documents/${section}.js`;
            script.onload = () => {
                loaded++;
                if (loaded === sections.length) {
                    setTimeout(() => updateText(flattenTranslations(window.translations)), 1000);
                }
            };
        } else if (['setting_client_details', 'setting_from_details', 'setting_import_product', 'setting_default_currency_template'].includes(section)) {
            script.src = `assets/lang/${lang}/settings/${section}.js`;
            script.onload = () => {
                loaded++;
                if (loaded === sections.length) {
                    setTimeout(() => updateText(flattenTranslations(window.translations)), 1000);
                }
            };
        }
        else {
            script.src = `assets/lang/${lang}/${section}.js`;
            script.onload = () => {
                loaded++;
                if (loaded === sections.length) {
                    updateText(flattenTranslations(window.translations));
                }
            };
        }

        document.body.appendChild(script);
    });

    saveSelectedLang(lang);

}

function flattenTranslations(obj, prefix = '', res = {}) {
    for (const key in obj) {
        const val = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === 'object') {
            flattenTranslations(val, fullKey, res);
        } else {
            res[fullKey] = val;
        }
    }
    return res;
}

function updateText(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });

    // Value
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (translations[key]) {
            el.value = translations[key];
        }
    });

    // Elements using innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });
}

async function loadStoredLanguage() {

    const lang = await getSelectedLang() || 'english';
    datatableLanguage = lang;
    const languageSelect = document.getElementById('languageSelect');
    setTimeout(() => {
        if (languageSelect) {
            languageSelect.value = lang;
            loadLanguage(lang);
        }
    }, 1000);
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function () {
    initDB();

    // Set up event listener for language change
    document.body.addEventListener('change', (e) => {
        setTimeout(() => {
            if (e.target && e.target.id === 'languageSelect') {
                loadLanguage(e.target.value);
                // window.location.reload(); // Reload the page to apply the new language
            }
        }, 1000);
    });
});

// async function loadStoredLanguage() {
//     const lang = await getSelectedLang() || 'english';
//     document.getElementById('languageSelect').value = lang;
//     loadLanguage(lang);
// }

// document.body.addEventListener('change', function (e) {
//     if (e.target && e.target.id === 'languageSelect') {
//         loadLanguage(e.target.value);
//     }
// });

// initDB();


// // arabic
// // chinese
// // english
// // hindi
// // spanish

//-------------------------------------------------------- datatable using multi language apply
function DatatableLanguage(tableId) {
    setTimeout(() => {
        if (datatableLanguage == "arabic") {
            $(tableId).DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "لا توجد بيانات متاحة في الجدول",
                    "info": "عرض _START_ إلى _END_ من أصل _TOTAL_ مدخل",
                    "infoEmpty": "عرض 0 إلى 0 من أصل 0 مدخل",
                    "infoFiltered": "(تمت التصفية من إجمالي _MAX_ مدخل)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "عرض _MENU_ مدخل",
                    "loadingRecords": "جارٍ التحميل...",
                    "processing": "جارٍ المعالجة...",
                    "search": "بحث:",
                    "zeroRecords": "لم يتم العثور على سجلات مطابقة",
                    "paginate": {
                        "first": "الأول",
                        "last": "الأخير",
                        "next": "التالي",
                        "previous": "السابق"
                    }
                },
            });
        }
        else if (datatableLanguage == "chinese") {
            $(tableId).DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "表中没有可用数据",
                    "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "infoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "infoFiltered": "(从 _MAX_ 项结果中过滤)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "显示 _MENU_ 项结果",
                    "loadingRecords": "加载中...",
                    "processing": "处理中...",
                    "search": "搜索:",
                    "zeroRecords": "没有匹配结果",
                    "paginate": {
                        "first": "首页",
                        "last": "末页",
                        "next": "下一页",
                        "previous": "上一页"
                    }
                },
            });
        }
        else if (datatableLanguage == "hindi") {
            $(tableId).DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "तालिका में कोई डेटा उपलब्ध नहीं है",
                    "info": "_TOTAL_ प्रविष्टियों में से _START_ से _END_ दिखा रहा है",
                    "infoEmpty": "0 से 0 की 0 प्रविष्टियाँ दिखा रहा है",
                    "infoFiltered": "(_MAX_ कुल प्रविष्टियों से फ़िल्टर किया गया)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "_MENU_ प्रविष्टियाँ दिखाएँ",
                    "loadingRecords": "लोड हो रहा है...",
                    "processing": "प्रक्रिया हो रही है...",
                    "search": "खोजें:",
                    "zeroRecords": "कोई मेल खाते रिकॉर्ड नहीं मिले",
                    "paginate": {
                        "first": "पहला",
                        "last": "अंतिम",
                        "next": "अगला",
                        "previous": "पिछला"
                    }
                },
            });
        }
        else if (datatableLanguage == "spanish") {
            $(tableId).DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "No hay datos disponibles en la tabla",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                    "infoFiltered": "(filtrado de _MAX_ entradas totales)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ entradas",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "No se encontraron registros coincidentes",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                },
            });
        }
        else {
            $(tableId).DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "No data available in table",
                    "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                    "infoEmpty": "Showing 0 to 0 of 0 entries",
                    "infoFiltered": "(filtered from _MAX_ total entries)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Show _MENU_ entries",
                    "loadingRecords": "Loading...",
                    "processing": "Processing...",
                    "search": "Search:",
                    "zeroRecords": "No matching records found",
                    "paginate": {
                        "first": "First",
                        "last": "Last",
                        "next": "Next",
                        "previous": "Previous"
                    }
                },
            });
        }
    }, 3000);
}
//---------------------------------------------------------- end datatable using multi language apply