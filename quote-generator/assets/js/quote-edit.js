"use strict";

// Open the database
function openDatabaseEdit() {
    return new Promise((resolve, reject) => {
        const requestEdit = indexedDB.open('QuoteDownloadHistoryDB', 2);

        requestEdit.onupgradeneeded = (event) => {
            const dbEdit = event.target.result;
            if (!dbEdit.objectStoreNames.contains('quoteDownloadHistory')) {
                dbEdit.createObjectStore('quoteDownloadHistory', { keyPath: 'id', autoIncrement: true });
            }
        };

        requestEdit.onsuccess = (event) => {
            resolve(event.target.result);
        };

        requestEdit.onerror = (event) => {
            reject('Error opening database:', event.target.errorCode);
        };
    });
}

// Decrypt data with AES-GCM
async function decryptDataEdit(encryptedData, key, iv) {
    const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        {
            name: "AES-GCM",
        },
        true,
        ["decrypt"]
    );

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(iv),
        },
        importedKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

// Load invoice by ID from the URL
async function loadInvoice() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const fromCityStateInput = document.getElementById('from-city-state-input');
            const fromZipCodeInput = document.getElementById('from-zip-code-input');
            fromCityStateInput.style.display = 'block';
            fromZipCodeInput.style.display = 'block';
            const billToCityStateInput = document.getElementById('bill-to-city-state-input');
            const billToZipCodeInput = document.getElementById('bill-to-zip-code-input');
            billToCityStateInput.style.display = 'block';
            billToZipCodeInput.style.display = 'block';

            const dbEdit = await openDatabaseEdit();
            const transaction = dbEdit.transaction(['quoteDownloadHistory'], 'readonly');
            const store = transaction.objectStore('quoteDownloadHistory');
            const requestEdit = store.get(Number(id));

            requestEdit.onsuccess = async (event) => {
                const entry = event.target.result;

                if (entry) {
                    document.getElementById('LoadSpinner').style.display = 'block';
                    document.body.style.background = '#eee';
                    document.body.style.cursor = 'not-allowed';

                    // Populate the fields
                    // console.log('Entry:', entry);

                    // left side in settings
                    document.getElementById('template').value = entry.template;
                    document.getElementById('currency').value = entry.currency || '$';

                    const newColor = entry.temp_color || '#048b9f';
                    const colorPicker = $('#primaryColorPicker');
                    colorPicker.val(newColor);
                    const selectedColor = newColor;
                    document.documentElement.style.setProperty('--primary-change-color', selectedColor);
                    const lightColor = `${selectedColor}21`;
                    document.documentElement.style.setProperty('--primary-change-light-color', lightColor);
                    $('.card-border').css('border-color', selectedColor);

                    updateCurrency();
                    updateTemplate();
                    //End left side in settings 


                    setTimeout(async () => {

                        // Invoice heading
                        document.getElementById('invoice-heading').value = entry.heading || '';
                        // End Invoice heading

                        // logo
                        const savedLogo = entry.logo || '';
                        if (savedLogo) {
                            const logoImage = document.getElementById('logoImage');
                            logoImage.src = savedLogo;
                            logoImage.style.display = 'block';
                            document.querySelector('.invoice-logo  span').style.display = 'none';
                            document.getElementById('logoInput').style.display = 'none';
                            document.getElementById('removeLogo').style.display = 'block';

                            const invoiceLogo = document.querySelector('.invoice-logo');
                            invoiceLogo.style.padding = '0';
                            invoiceLogo.style.borderRadius = '0';
                            invoiceLogo.style.border = 'none';
                            invoiceLogo.style.backgroundColor = 'transparent';
                        }
                        // end logo

                        // From Details
                        document.getElementById('from_name').value = entry.from_name || '';
                        document.getElementById('from_email').value = entry.from_email || '';
                        document.getElementById('from-street-input').value = entry.from_street_input || '';
                        document.getElementById('from-city-state-input').value = entry.from_city_state_input || '';
                        document.getElementById('from-zip-code-input').value = entry.from_zip_code_input || '';
                        document.getElementById('from_phone').value = entry.from_phone || '';
                        document.getElementById('from_business_number').value = entry.from_business_number || '';
                        document.getElementById('from_website').value = entry.from_website || '';
                        document.getElementById('from_business_owner_name').value = entry.from_business_owner_name || '';
                        // End From Details

                        // Client Details
                        document.getElementById('bill_to_name').value = entry.bill_to_name || '';
                        document.getElementById('bill-to-email').value = entry.bill_to_email || '';
                        document.getElementById('bill-to-street-input').value = entry.bill_to_street_input || '';
                        document.getElementById('bill-to-city-state-input').value = entry.bill_to_city_state_input || '';
                        document.getElementById('bill-to-zip-code-input').value = entry.bill_to_zip_code_input || '';
                        document.getElementById('bill-to-phone').value = entry.bill_to_mobile || '';
                        document.getElementById('bill-to-mobile').value = entry.bill_to_phone || '';
                        document.getElementById('bill-to-fax').value = entry.bill_to_fax || '';
                        // End Client Details

                        // Terms
                        document.getElementById('terms_number').value = entry.terms_number || '';
                        document.getElementById('terms_date').value = entry.terms_date || '';
                        document.getElementById('dueDate').value = entry.dueDate || '';
                        // End Terms

                        // table
                        // Retrieve the data from sessionStorage
                        const savedData = JSON.parse(entry.table || '[]');

                        // Clear existing rows in the table
                        const tableBody = document.getElementById('invoice-items');
                        tableBody.innerHTML = '';

                        // Populate the table rows
                        savedData.forEach(row => {
                            const newRow = document.createElement('tr');
                            if (entry.template === 'quantity' || entry.template === 'hours') {
                                newRow.innerHTML = `
                                    <td><input type="text" class="form-control" value="${row.description || ''}" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
                                    <td><input class="form-control" type="number" value="${row.value1 || 0}" oninput="calculateAmount(this)"></td>
                                    <td><input class="form-control" type="number" value="${row.value2 || 0}" oninput="calculateAmount(this)"></td>
                                    <td class="amount">${entry.currency}${row.amount.toFixed(2) || '0.00'}</td>
                                    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
                                `;
                            } else if (entry.template === 'amounts-only') {
                                newRow.innerHTML = `
                                    <td><input type="text" class="form-control" value="${row.description || ''}" data-i18n-placeholder="invoice.placeholder_description_item" placeholder="Description of item/service..."></td>
                                    <td><input type="number" class="amount" value="${row.amount || 0}" oninput="calculateTotalOnlyAmount()"></td>
                                    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)"><i class="fa-regular fa-trash-can"></i></button></td>
                                `;
                            }
                            tableBody.appendChild(newRow);

                            tableInputLimits();

                            inputNumberValidation();
                            updateText(flattenTranslations(window.translations));
                        });
                        if (entry.template == 'hours' || entry.template == 'quantity') {
                            calculateTotalAmount();
                        }
                        if (entry.template == 'amounts-only') {
                            calculateTotalOnlyAmount();
                        }
                        // end table

                        // total in discount,tax,shipping,amount-paid
                        document.getElementById('discount').value = entry.discount || '';
                        document.getElementById('tax').value = entry.tax || '';
                        document.getElementById('shipping').value = entry.shipping || '';
                        // document.getElementById('amount-paid').value = entry.amount_paid || '';
                        document.getElementById('total').textContent = entry.total || '';

                        // symbol
                        document.getElementById('discountSymbol').innerHTML = entry.discountSymbol || entry.currency;
                        document.getElementById('taxSymbol').innerHTML = entry.taxSymbol || entry.currency;
                        document.getElementById('shippingSymbol').innerHTML = entry.shippingSymbol || entry.currency;

                        // end total in discount,tax,shipping,amount-paid

                        // notes and terms
                        document.getElementById('notes').value = entry.notes || '';
                        document.querySelector('.terms-note').value = entry.terms || '';
                        // end notes and terms

                        // Bank Details
                        document.getElementById('accountName').value = entry.bank_accountName || '';
                        document.getElementById('accountNumber').value = entry.bank_accountNumber || '';
                        document.getElementById('ifsc').value = entry.bank_ifsc || '';

                        document.getElementById('accountTypeSelect').value = entry.bank_accountType || '';
                        const accountType = document.getElementById('accountType');
                        if (entry.bank_accountType == "" || entry.bank_accountType == "Saving" || entry.bank_accountType == "Current") {
                            document.getElementById('accountTypeSelect').value = entry.bank_accountType || '';
                        } else {
                            accountType.classList.remove('d-none');
                            accountType.type = 'text';
                            accountType.value = entry.bank_accountType;
                            document.getElementById('accountTypeSelect').value = "other";
                        }

                        document.getElementById('bank').value = entry.bank_name || '';
                        // End Bank Details

                        // Upi Details
                        document.getElementById('upi-id').value = entry.upiId || '';
                        // End Upi Details

                        // Signatory
                        const signatory = entry.signatory || '';
                        if (signatory) {
                            $('#signatoryImage').attr('src', signatory).show();
                            $('#removeSignatory').show();

                            document.querySelector('.authorized-signatory span').style.display = 'none';
                            document.getElementById('signatoryInput').style.display = 'none';
                            document.getElementById('removeSignatory').style.display = 'block';

                            const authorizedSignatory = document.querySelector('.authorized-signatory');
                            authorizedSignatory.style.padding = '0';
                            authorizedSignatory.style.borderRadius = '0';
                            authorizedSignatory.style.border = 'none';
                            authorizedSignatory.style.backgroundColor = 'transparent';
                        }
                        //End Signatory

                        document.getElementById('LoadSpinner').style.display = 'none';
                        document.body.style.background = '';
                        document.body.style.cursor = '';

                    }, 5000);

                    // console.log('Decrypted Data:', decryptedFileData);
                } else {
                    console.error('Invoice not found in the database.');
                }
            };

            requestEdit.onerror = () => {
                console.error('Error fetching invoice from database.');
            };
        } catch (error) {
            console.error('Error loading invoice:', error);
        }
    }

}
document.addEventListener('DOMContentLoaded', loadInvoice);
//End Load invoice by ID from the URL

