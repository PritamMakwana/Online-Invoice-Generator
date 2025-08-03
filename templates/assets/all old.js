
// =================================================================================== Download 

// end all filed convert to p tag
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {

    if (input.type === 'hidden') {
        return;
    }

    const p = document.createElement('p');

    p.textContent = input.value;

    if (input.id) p.id = input.id;
    if (input.className) p.className = input.className;

    let classes = input.className.split(' ').filter(className => className !== 'form-control' && className !== 'form-control-plaintext');
    p.className = classes.join(' ');

    input.replaceWith(p);
});
// end all filed convert to p tag

// back page
document.getElementById('backToPage').addEventListener('click', backToPage);

function backToPage() {
    setTimeout(function () {
        window.location.href = "/invoice.html";
    }, 1000);
}
// downloadPDF();
// download pdf
document.getElementById('downloadInvoice').addEventListener('click', downloadPDF);

// async function downloadPDF() {

//     // edit at time old record delete
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get('id');
//     if (id) {
//         try {
//             const dbEdit = await openDatabase();
//             const transaction = dbEdit.transaction(['downloadHistory'], 'readwrite');
//             const store = transaction.objectStore('downloadHistory');
//             store.delete(Number(id));
//         } catch (error) {
//             console.error('Error deleting record:', error);
//         }
//     }
//     // end edit at time old record delete

//     const invoicetotalId = document.querySelector('#total');
//     const invoiceTotal = invoicetotalId.textContent;

//     const invoiceNo = document.getElementById('terms_number').textContent;
//     const invoicePaymentDate = document.getElementById('terms_date').textContent;
//     const invoicedueDate = document.getElementById('dueDate').textContent;
//     const invoiceAmountPaid = document.getElementById('amount-paid').textContent;
//     let invoicePaymentMethod = 'Cash Payment';
//     let invoicePaymentStatus = 'Paid';


//     if (invoicedueDate != "No due date") {
//         const paymentDate = new Date(invoicePaymentDate);
//         const dueDate = new Date(invoicedueDate);
//         if (paymentDate.toISOString().split('T')[0] === dueDate.toISOString().split('T')[0]) {
//             invoicePaymentMethod = 'Cash Payment';
//             invoicePaymentStatus = 'Paid';
//         } else {
//             invoicePaymentMethod = '-';
//             invoicePaymentStatus = 'Overdue';
//         }
//     } else {
//         invoicePaymentMethod = '-';
//         invoicePaymentStatus = 'Overdue';
//     }

//     const invoice = document.getElementById('invoice');
//     const originalWidth = invoice.style.width;
//     invoice.style.width = '1920px';

//     document.getElementById('LoadSpinner').style.display = 'block';
//     document.body.style.background = '#ffffff';
//     document.body.style.cursor = 'not-allowed';


//     // setTimeout(async () => {
//     //     const canvas = await html2canvas(invoice, {
//     //         scale: 2, // Double the scale to improve quality
//     //         useCORS: true // Enable CORS if there are external resources
//     //     });
//     //     const imgData = canvas.toDataURL('image/png');

//     //     // Compress the image data to reduce size
//     //     const compressedImgData = await compressImage(imgData, 1.0); // 0.5 for 50% quality

//     //     // const { jsPDF } = window.jspdf;
//     //     // const pdf = new jsPDF('p', 'pt', 'a4');
//     //     // const imgProps = pdf.getImageProperties(compressedImgData);
//     //     // const pdfWidth = pdf.internal.pageSize.getWidth();
//     //     // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     //     // const pdfFileName = 'invoice.pdf';

//     //     // const pageHeight = pdf.internal.pageSize.height;

//     //     // const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
//     //     // const numberOfPages = Math.ceil(totalHeight / pageHeight);

//     //     // for (let i = 0; i < numberOfPages; i++) {
//     //     //     const yOffset = i * pageHeight;
//     //     //     if (i > 0) {
//     //     //         pdf.addPage();
//     //     //     }

//     //     //     pdf.addImage(compressedImgData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
//     //     // }

//     //     const { jsPDF } = window.jspdf;
//     //     const pdf = new jsPDF('p', 'pt', 'a4');
//     //     const imgProps = pdf.getImageProperties(compressedImgData);
//     //     const pdfWidth = pdf.internal.pageSize.getWidth();
//     //     const pageHeight = pdf.internal.pageSize.getHeight();

//     //     const adjustedHeight = pageHeight - 20; // Subtract 20px for bottom space
//     //     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     //     const totalHeight = imgHeight;
//     //     const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

//     //     for (let i = 0; i < numberOfPages; i++) {
//     //         const yOffset = -(i * adjustedHeight); // Correct vertical offset for each page
//     //         if (i > 0) {
//     //             pdf.addPage();
//     //         }

//     //         // Draw the image
//     //         pdf.addImage(compressedImgData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

//     //         // Draw white rectangle at the bottom for 20px space
//     //         pdf.setFillColor(255, 255, 255); // Set color to white
//     //         pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw filled rectangle
//     //     }

//     //     const pdfFileName = 'invoice.pdf';
//     //     let filename = sessionStorage.getItem("terms_number") + '_' + document.querySelector('.invoice-title').textContent + '.pdf';
//     //     filename = filename.replace(/\s+/g, '_');
//     //     pdf.save(filename);

//     setTimeout(async () => {
//         const canvas = await html2canvas(invoice, {
//             scale: 2, // Double the scale to improve quality
//             useCORS: true // Enable CORS if there are external resources
//         });
//         const imgData = canvas.toDataURL('image/png');

//         // Compress the image data to reduce size
//         const compressedImgData = await compressImage(imgData, 1.0); // 0.5 for 50% quality
//         const { jsPDF } = window.jspdf;
//         const pdf = new jsPDF('p', 'pt', 'a4');
//         const imgProps = pdf.getImageProperties(compressedImgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         const adjustedHeight = pageHeight - 20; // Subtract 20px for bottom space
//         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         const totalHeight = imgHeight;
//         const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

//         for (let i = 0; i < numberOfPages; i++) {
//             const yOffset = -(i * adjustedHeight); // Correct vertical offset for each page
//             if (i > 0) {
//                 pdf.addPage();
//             }

//             // Draw the image
//             pdf.addImage(compressedImgData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

//             // Draw white rectangle at the bottom for 20px space
//             pdf.setFillColor(255, 255, 255); // Set color to white
//             pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw filled rectangle
//         }

//         const pdfFileName = 'invoice.pdf';
//         let filename = sessionStorage.getItem("terms_number") + '_' + document.querySelector('.invoice-title').textContent + '.pdf';
//         filename = filename.replace(/\s+/g, '_');
//         pdf.save(filename);

//         // setTimeout(async () => {
//         //     const invoice = document.getElementById('invoice');

//         //     const options = {
//         //         margin: 0,
//         //         filename: (sessionStorage.getItem("terms_number") + '_' +
//         //             document.querySelector('.invoice-title').textContent + '.pdf').replace(/\s+/g, '_'),
//         //         image: { type: 'jpeg', quality: 1 },
//         //         html2canvas: { scale: 2, useCORS: true },
//         //         jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
//         //         pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Ensures proper page breaks
//         //     };

//         //     html2pdf().from(invoice).set(options).save();

//         //     const pdfFileName = 'invoice.pdf';

//         // Restore original width
//         invoice.style.width = originalWidth;

//         const saveInvoice = sessionStorage.getItem("saveInvoice");
//         if (saveInvoice == 'true') {
//             try {
//                 // left side in settings
//                 const currency = sessionStorage.getItem("currency");
//                 const temp_color = sessionStorage.getItem("temp_color");
//                 // end left side in settings

//                 // Invoice heading
//                 const invoiceTitle = document.querySelector('.invoice-title');
//                 const invoiceHeading = invoiceTitle.textContent;
//                 // End Invoice heading

//                 // logo
//                 const logo = sessionStorage.getItem("logo");
//                 // end logo

//                 // From Details
//                 const from_name = document.getElementById('from_name').textContent;
//                 const from_email = document.getElementById('from_email').textContent;
//                 const from_street_input = sessionStorage.getItem("from_street_input");
//                 const from_city_state_input = sessionStorage.getItem("from_city_state_input");
//                 const from_zip_code_input = sessionStorage.getItem("from_zip_code_input");
//                 const from_phone = document.getElementById('from_phone').textContent;
//                 const from_business_number = document.getElementById('from_business_number').textContent;
//                 const from_website = document.getElementById('from_website').textContent;
//                 const from_business_owner_name = document.getElementById('from_business_owner_name').textContent;
//                 // End From Details

//                 // Client Details
//                 const bill_to_name = document.getElementById('bill_to_name').textContent;
//                 const bill_to_email = document.getElementById('bill-to-email').textContent;
//                 const bill_to_street_input = sessionStorage.getItem("bill_to_street_input");
//                 const bill_to_city_state_input = sessionStorage.getItem("bill_to_city_state_input");
//                 const bill_to_zip_code_input = sessionStorage.getItem("bill_to_zip_code_input");
//                 const bill_to_mobile = document.getElementById('bill-to-mobile').textContent;
//                 const bill_to_phone = document.getElementById('bill-to-phone').textContent;
//                 const bill_to_fax = document.getElementById('bill-to-fax').textContent;
//                 // End Client Details

//                 // Terms
//                 const terms_number = sessionStorage.getItem("terms_number");
//                 const terms_date = sessionStorage.getItem("terms_date");
//                 const termsSelect = sessionStorage.getItem("termsSelect");
//                 const dueDate = sessionStorage.getItem("dueDate");
//                 // End Terms

//                 // table and template select
//                 const table = sessionStorage.getItem("tableAllRow");
//                 const template = sessionStorage.getItem("templateSelect");
//                 // end table and template select

//                 // total in discount,tax,shipping,amount-paid
//                 const discount = sessionStorage.getItem("discount");
//                 const tax = sessionStorage.getItem("tax");
//                 const shipping = sessionStorage.getItem("shipping");
//                 const amount_paid = sessionStorage.getItem("amount_paid");
//                 const total = sessionStorage.getItem("total");
//                 const balanceDue = sessionStorage.getItem("balanceDue");

//                 // Symbol
//                 const discountSymbol = sessionStorage.getItem("discountSymbol");
//                 const taxSymbol = sessionStorage.getItem("taxSymbol");
//                 const shippingSymbol = sessionStorage.getItem("shippingSymbol");
//                 // End total in discount,tax,shipping,amount-paid

//                 // Notes and Terms
//                 const notes = sessionStorage.getItem("notes");
//                 const terms = sessionStorage.getItem("terms");
//                 // End Notes and Terms

//                 // Bank Details
//                 const bank_accountName = sessionStorage.getItem("accountName");
//                 const bank_accountNumber = sessionStorage.getItem("accountNumber");
//                 const bank_ifsc = sessionStorage.getItem("ifsc");
//                 const bank_accountType = sessionStorage.getItem("accountType");
//                 const bank_name = sessionStorage.getItem("bank");
//                 // End Bank Details

//                 // Upi Details
//                 const upiId = sessionStorage.getItem("upiId");
//                 // End Upi Details

//                 // Signatory
//                 const signatory = sessionStorage.getItem("signatory");
//                 // End Signatory

//                 const downloadEntry = {

//                     // left side in settings
//                     currency: currency,
//                     temp_color: temp_color,
//                     // end left side in settings

//                     // Invoice Heading
//                     heading: invoiceHeading,

//                     // Logo
//                     logo: logo,
//                     // End Logo

//                     // from details
//                     from_name: from_name,
//                     from_email: from_email,
//                     from_street_input: from_street_input,
//                     from_city_state_input: from_city_state_input,
//                     from_zip_code_input: from_zip_code_input,
//                     from_phone: from_phone,
//                     from_business_number: from_business_number,
//                     from_website: from_website,
//                     from_business_owner_name: from_business_owner_name,
//                     // end from details

//                     // client details
//                     bill_to_name: bill_to_name,
//                     bill_to_email: bill_to_email,
//                     bill_to_street_input: bill_to_street_input,
//                     bill_to_city_state_input: bill_to_city_state_input,
//                     bill_to_zip_code_input: bill_to_zip_code_input,
//                     bill_to_mobile: bill_to_mobile,
//                     bill_to_phone: bill_to_phone,
//                     bill_to_fax: bill_to_fax,
//                     // end client details

//                     // terms
//                     terms_number: terms_number,
//                     terms_date: terms_date,
//                     termsSelect: termsSelect,
//                     dueDate: dueDate,
//                     // end terms

//                     // table and template select
//                     table: table,
//                     template: template,
//                     // end table and template select

//                     // total in discount,tax,shipping,amount-paid
//                     discount: discount,
//                     tax: tax,
//                     shipping: shipping,
//                     amount_paid: amount_paid,
//                     total: total,
//                     balanceDue: balanceDue,
//                     // Symbol
//                     discountSymbol: discountSymbol,
//                     taxSymbol: taxSymbol,
//                     shippingSymbol: shippingSymbol,

//                     // End total in discount,tax,shipping,amount-paid

//                     // notes and terms
//                     notes: notes,
//                     terms: terms,
//                     // end notes and terms

//                     // Bank Details
//                     bank_accountName: bank_accountName,
//                     bank_accountNumber: bank_accountNumber,
//                     bank_ifsc: bank_ifsc,
//                     bank_accountType: bank_accountType,
//                     bank_name: bank_name,
//                     // End Bank Details

//                     // Upi Details
//                     upiId: upiId,
//                     // End Upi Details

//                     // Signatory
//                     signatory: signatory,
//                     // End Signatory

//                     fileName: pdfFileName,
//                     invoiceNo: invoiceNo,
//                     invoicePaymentDate: invoicePaymentDate,
//                     invoicedueDate: invoicedueDate,
//                     invoicePaymentMethod: invoicePaymentMethod,
//                     invoicePaymentStatus: invoicePaymentStatus,
//                     total: invoiceTotal,
//                     invoiceAmountPaid: invoiceAmountPaid,
//                     fileData: compressedImgData
//                 };
//                 await addToDatabase(downloadEntry);
//             } catch (error) {
//                 console.error('Error while storing data in IndexedDB:', error);
//             }
//             setTimeout(function () {
//                 window.location.href = "/history.html";
//             }, 1000);
//         }
//     }, 3000);
// }
// ----------------------------------------------------------------------old



async function downloadPDF() {

    // edit at time old record delete
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        try {
            const dbEdit = await openDatabase();
            const transaction = dbEdit.transaction(['downloadHistory'], 'readwrite');
            const store = transaction.objectStore('downloadHistory');
            store.delete(Number(id));
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }
    // end edit at time old record delete

    const invoicetotalId = document.querySelector('#total');
    const invoiceTotal = invoicetotalId.textContent;

    const invoiceNo = document.getElementById('terms_number').textContent;
    const invoicePaymentDate = document.getElementById('terms_date').textContent;
    const invoicedueDate = document.getElementById('dueDate').textContent;
    const invoiceAmountPaid = document.getElementById('amount-paid').textContent;
    let invoicePaymentMethod = 'Cash Payment';
    let invoicePaymentStatus = 'Paid';


    if (invoicedueDate != "No due date") {
        const paymentDate = new Date(invoicePaymentDate);
        const dueDate = new Date(invoicedueDate);
        if (paymentDate.toISOString().split('T')[0] === dueDate.toISOString().split('T')[0]) {
            invoicePaymentMethod = 'Cash Payment';
            invoicePaymentStatus = 'Paid';
        } else {
            invoicePaymentMethod = '-';
            invoicePaymentStatus = 'Overdue';
        }
    } else {
        invoicePaymentMethod = '-';
        invoicePaymentStatus = 'Overdue';
    }

    const invoice = document.getElementById('invoice');
    const originalWidth = invoice.style.width;
    invoice.style.width = '1920px';

    document.getElementById('LoadSpinner').style.display = 'block';
    document.body.style.background = '#ffffff';
    document.body.style.cursor = 'not-allowed';


    // setTimeout(async () => {
    //     const canvas = await html2canvas(invoice, {
    //         scale: 2, // Double the scale to improve quality
    //         useCORS: true // Enable CORS if there are external resources
    //     });
    //     const imgData = canvas.toDataURL('image/png');

    //     // Compress the image data to reduce size
    //     const compressedImgData = await compressImage(imgData, 1.0); // 0.5 for 50% quality

    //     // const { jsPDF } = window.jspdf;
    //     // const pdf = new jsPDF('p', 'pt', 'a4');
    //     // const imgProps = pdf.getImageProperties(compressedImgData);
    //     // const pdfWidth = pdf.internal.pageSize.getWidth();
    //     // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    //     // const pdfFileName = 'invoice.pdf';

    //     // const pageHeight = pdf.internal.pageSize.height;

    //     // const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
    //     // const numberOfPages = Math.ceil(totalHeight / pageHeight);

    //     // for (let i = 0; i < numberOfPages; i++) {
    //     //     const yOffset = i * pageHeight;
    //     //     if (i > 0) {
    //     //         pdf.addPage();
    //     //     }

    //     //     pdf.addImage(compressedImgData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
    //     // }

    //     const { jsPDF } = window.jspdf;
    //     const pdf = new jsPDF('p', 'pt', 'a4');
    //     const imgProps = pdf.getImageProperties(compressedImgData);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pageHeight = pdf.internal.pageSize.getHeight();

    //     const adjustedHeight = pageHeight - 20; // Subtract 20px for bottom space
    //     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //     const totalHeight = imgHeight;
    //     const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

    //     for (let i = 0; i < numberOfPages; i++) {
    //         const yOffset = -(i * adjustedHeight); // Correct vertical offset for each page
    //         if (i > 0) {
    //             pdf.addPage();
    //         }

    //         // Draw the image
    //         pdf.addImage(compressedImgData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

    //         // Draw white rectangle at the bottom for 20px space
    //         pdf.setFillColor(255, 255, 255); // Set color to white
    //         pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw filled rectangle
    //     }

    //     const pdfFileName = 'invoice.pdf';
    //     let filename = sessionStorage.getItem("terms_number") + '_' + document.querySelector('.invoice-title').textContent + '.pdf';
    //     filename = filename.replace(/\s+/g, '_');
    //     pdf.save(filename);

    // setTimeout(async () => {
    //     const canvas = await html2canvas(invoice, {
    //         scale: 2, // Double the scale to improve quality
    //         useCORS: true // Enable CORS if there are external resources
    //     });
    //     const imgData = canvas.toDataURL('image/png');

    //     // Compress the image data to reduce size
    //     const compressedImgData = await compressImage(imgData, 1.0); // 0.5 for 50% quality
    //     const { jsPDF } = window.jspdf;
    //     const pdf = new jsPDF('p', 'pt', 'a4');
    //     const imgProps = pdf.getImageProperties(compressedImgData);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pageHeight = pdf.internal.pageSize.getHeight();

    //     const adjustedHeight = pageHeight - 20; // Subtract 20px for bottom space
    //     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //     const totalHeight = imgHeight;
    //     const numberOfPages = Math.ceil(totalHeight / adjustedHeight);

    //     for (let i = 0; i < numberOfPages; i++) {
    //         const yOffset = -(i * adjustedHeight); // Correct vertical offset for each page
    //         if (i > 0) {
    //             pdf.addPage();
    //         }

    //         // Draw the image
    //         pdf.addImage(compressedImgData, 'PNG', 0, yOffset, pdfWidth, totalHeight);

    //         // Draw white rectangle at the bottom for 20px space
    //         pdf.setFillColor(255, 255, 255); // Set color to white
    //         pdf.rect(0, pageHeight - 20, pdfWidth, 20, 'F'); // Draw filled rectangle
    //     }

    //     const pdfFileName = 'invoice.pdf';
    //     let filename = sessionStorage.getItem("terms_number") + '_' + document.querySelector('.invoice-title').textContent + '.pdf';
    //     filename = filename.replace(/\s+/g, '_');
    //     pdf.save(filename);

    // setTimeout(async () => {
    //     const options = {
    //         margin: [0, 0, 0, 0],
    //         filename: (sessionStorage.getItem("terms_number") + '_' +
    //             document.querySelector('.invoice-title').textContent + '.pdf').replace(/\s+/g, '_'),
    //         image: { type: 'jpeg', quality: 1 },
    //         html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: null },
    //         jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    //         // jsPDF: { unit: 'pt', format: [595.28, 841.89], orientation: 'portrait' },
    //         pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Ensures proper page breaks
    //     };

    //     html2pdf().from(invoice)
    //         .set(options)
    //         .toPdf()
    //         .get('pdf')
    //         .then(pdf => {
    //             pdf.addPage(); // Ensure new page
    //         })
    //         .save();

    // -------------------- final
    setTimeout(async () => {

        const style = document.createElement('style');
        style.innerHTML = `
            *{
                margin: 0 !important;
                // padding: 0 !important;
                box-sizing: border-box !important;
            }
            table {
                margin-left: 3% !important;
            }
        `;
        document.head.appendChild(style);

        const options = {
            margin: [1, 1, 1, 1], // Small margin to prevent clipping
            filename: (sessionStorage.getItem("terms_number") + '_' +
                document.querySelector('.invoice-title').textContent + '.pdf').replace(/\s+/g, '_'),
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true, // Enable for debugging
                backgroundColor: null,
                scrollX: 0,    // Ensure no horizontal scroll
                scrollY: 0     // Ensure no vertical scroll
            },
            jsPDF: {
                unit: 'pt',
                format: [595.28, 841.89], // Exact A4 dimensions
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Temporary debug - inspect the element
        // console.log(invoice.outerHTML);

        html2pdf().from(invoice)
            .set(options)
            .toPdf()
            .get('pdf')
            .then(pdf => {
                pdf.addPage();
            })
            .save()
            .catch(err => console.error('PDF generation error:', err));

        const pdfData = await html2pdf().from(invoice).set(options).output('datauristring');

        const pdfFileName = 'invoice.pdf';

        // Restore original width
        invoice.style.width = originalWidth;

        const saveInvoice = sessionStorage.getItem("saveInvoice");
        if (saveInvoice == 'true') {
            try {
                // left side in settings
                const currency = sessionStorage.getItem("currency");
                const temp_color = sessionStorage.getItem("temp_color");
                // end left side in settings

                // Invoice heading
                const invoiceTitle = document.querySelector('.invoice-title');
                const invoiceHeading = invoiceTitle.textContent;
                // End Invoice heading

                // logo
                const logo = sessionStorage.getItem("logo");
                // end logo

                // From Details
                const from_name = document.getElementById('from_name').textContent;
                const from_email = document.getElementById('from_email').textContent;
                const from_street_input = sessionStorage.getItem("from_street_input");
                const from_city_state_input = sessionStorage.getItem("from_city_state_input");
                const from_zip_code_input = sessionStorage.getItem("from_zip_code_input");
                const from_phone = document.getElementById('from_phone').textContent;
                const from_business_number = document.getElementById('from_business_number').textContent;
                const from_website = document.getElementById('from_website').textContent;
                const from_business_owner_name = document.getElementById('from_business_owner_name').textContent;
                // End From Details

                // Client Details
                const bill_to_name = document.getElementById('bill_to_name').textContent;
                const bill_to_email = document.getElementById('bill-to-email').textContent;
                const bill_to_street_input = sessionStorage.getItem("bill_to_street_input");
                const bill_to_city_state_input = sessionStorage.getItem("bill_to_city_state_input");
                const bill_to_zip_code_input = sessionStorage.getItem("bill_to_zip_code_input");
                const bill_to_mobile = document.getElementById('bill-to-mobile').textContent;
                const bill_to_phone = document.getElementById('bill-to-phone').textContent;
                const bill_to_fax = document.getElementById('bill-to-fax').textContent;
                // End Client Details

                // Terms
                const terms_number = sessionStorage.getItem("terms_number");
                const terms_date = sessionStorage.getItem("terms_date");
                const termsSelect = sessionStorage.getItem("termsSelect");
                const dueDate = sessionStorage.getItem("dueDate");
                // End Terms

                // table and template select
                const table = sessionStorage.getItem("tableAllRow");
                const template = sessionStorage.getItem("templateSelect");
                // end table and template select

                // total in discount,tax,shipping,amount-paid
                const discount = sessionStorage.getItem("discount");
                const tax = sessionStorage.getItem("tax");
                const shipping = sessionStorage.getItem("shipping");
                const amount_paid = sessionStorage.getItem("amount_paid");
                const total = sessionStorage.getItem("total");
                const balanceDue = sessionStorage.getItem("balanceDue");

                // Symbol
                const discountSymbol = sessionStorage.getItem("discountSymbol");
                const taxSymbol = sessionStorage.getItem("taxSymbol");
                const shippingSymbol = sessionStorage.getItem("shippingSymbol");
                // End total in discount,tax,shipping,amount-paid

                // Notes and Terms
                const notes = sessionStorage.getItem("notes");
                const terms = sessionStorage.getItem("terms");
                // End Notes and Terms

                // Bank Details
                const bank_accountName = sessionStorage.getItem("accountName");
                const bank_accountNumber = sessionStorage.getItem("accountNumber");
                const bank_ifsc = sessionStorage.getItem("ifsc");
                const bank_accountType = sessionStorage.getItem("accountType");
                const bank_name = sessionStorage.getItem("bank");
                // End Bank Details

                // Upi Details
                const upiId = sessionStorage.getItem("upiId");
                // End Upi Details

                // Signatory
                const signatory = sessionStorage.getItem("signatory");
                // End Signatory

                const downloadEntry = {

                    // left side in settings
                    currency: currency,
                    temp_color: temp_color,
                    // end left side in settings

                    // Invoice Heading
                    heading: invoiceHeading,

                    // Logo
                    logo: logo,
                    // End Logo

                    // from details
                    from_name: from_name,
                    from_email: from_email,
                    from_street_input: from_street_input,
                    from_city_state_input: from_city_state_input,
                    from_zip_code_input: from_zip_code_input,
                    from_phone: from_phone,
                    from_business_number: from_business_number,
                    from_website: from_website,
                    from_business_owner_name: from_business_owner_name,
                    // end from details

                    // client details
                    bill_to_name: bill_to_name,
                    bill_to_email: bill_to_email,
                    bill_to_street_input: bill_to_street_input,
                    bill_to_city_state_input: bill_to_city_state_input,
                    bill_to_zip_code_input: bill_to_zip_code_input,
                    bill_to_mobile: bill_to_mobile,
                    bill_to_phone: bill_to_phone,
                    bill_to_fax: bill_to_fax,
                    // end client details

                    // terms
                    terms_number: terms_number,
                    terms_date: terms_date,
                    termsSelect: termsSelect,
                    dueDate: dueDate,
                    // end terms

                    // table and template select
                    table: table,
                    template: template,
                    // end table and template select

                    // total in discount,tax,shipping,amount-paid
                    discount: discount,
                    tax: tax,
                    shipping: shipping,
                    amount_paid: amount_paid,
                    total: total,
                    balanceDue: balanceDue,
                    // Symbol
                    discountSymbol: discountSymbol,
                    taxSymbol: taxSymbol,
                    shippingSymbol: shippingSymbol,

                    // End total in discount,tax,shipping,amount-paid

                    // notes and terms
                    notes: notes,
                    terms: terms,
                    // end notes and terms

                    // Bank Details
                    bank_accountName: bank_accountName,
                    bank_accountNumber: bank_accountNumber,
                    bank_ifsc: bank_ifsc,
                    bank_accountType: bank_accountType,
                    bank_name: bank_name,
                    // End Bank Details

                    // Upi Details
                    upiId: upiId,
                    // End Upi Details

                    // Signatory
                    signatory: signatory,
                    // End Signatory

                    fileName: pdfFileName,
                    invoiceNo: invoiceNo,
                    invoicePaymentDate: invoicePaymentDate,
                    invoicedueDate: invoicedueDate,
                    invoicePaymentMethod: invoicePaymentMethod,
                    invoicePaymentStatus: invoicePaymentStatus,
                    total: invoiceTotal,
                    invoiceAmountPaid: invoiceAmountPaid,
                    fileData: pdfData
                };
                await addToDatabase(downloadEntry);
            } catch (error) {
                console.error('Error while storing data in IndexedDB:', error);
            }
            setTimeout(function () {
                window.location.href = "/history.html";
            }, 1000);
        }
    }, 3000);
}
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DownloadHistoryDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('downloadHistory')) {
                db.createObjectStore('downloadHistory', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error opening database:', event.target.errorCode);
        };
    });
}

// Generate encryption key
async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt data with AES-GCM
async function encryptData(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    return {
        encryptedData: new Uint8Array(encryptedData),
        key: await crypto.subtle.exportKey("jwk", key),
        iv: Array.from(iv),
    };
}


async function addToDatabase(entry) {
    const { encryptedData, key, iv } = await encryptData(entry.fileData);
    entry.fileData = encryptedData;
    entry.key = key;
    entry.iv = iv;

    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');

        const request = store.add(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject('Error adding data to database');
    });
}

function getAllFromDatabase() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readonly');
        const store = transaction.objectStore('downloadHistory');
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('Error retrieving data from database');
    });
}

function removeOldestEntry() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                resolve();
            }
        };

        request.onerror = () => reject('Error deleting data from database');
    });
}

function compressImage(base64Image, quality = 0.5) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
    });
}

// =================================================================================== End Download 



// bank details is long line than column set
const bank_accountName = sessionStorage.getItem("accountName") !== null ? sessionStorage.getItem("accountName") : "0";
const bank_accountNumber = sessionStorage.getItem("accountNumber") !== null ? sessionStorage.getItem("accountNumber") : "0";
const bank_ifsc = sessionStorage.getItem("ifsc") !== null ? sessionStorage.getItem("ifsc") : "0";
const bank_name = sessionStorage.getItem("bank") !== null ? sessionStorage.getItem("bank") : "0";

const values = [bank_accountName, bank_accountNumber, bank_ifsc, bank_name];

const count = values.filter(value => value.length > 10).length;

if (count >= 1) {
    const style = document.createElement('style');
    style.innerHTML = `
    .bank-details p {
        flex-direction: column !important;
    }
    `;
    document.head.appendChild(style);
}
// end  bank details is long line than column set



// === table
const tableContainer = document.getElementById('table-container');
const table = document.createElement('table');
table.setAttribute('id', 'table-filed');
const tableAllRow = JSON.parse(sessionStorage.getItem('tableAllRow') || '[]');
const currency = sessionStorage.getItem("currency") || "$";
const template = tableAllRow.length > 0 ? tableAllRow[0].template : "quantity";
let tableContent = "";
if (template === "quantity" || template === "hours") {
    const quantityLabel = template === "quantity" ? "Quantity" : "Hours";
    tableContent = `
    <thead>
        <tr>
            <th style="width: 50%">Item/Service</th>
            <th style="width: 10%">${quantityLabel}</th>
            <th style="width: 10%">Rate</th>
            <th style="width: 20%">Amount</th>
        </tr>
    </thead>
    <tbody id="invoice-items">
        ${tableAllRow.map(item => `
            <tr>
                <td>
                ${item.description}
                </td>
                <td>
                ${item.value1}
                </td>
                <td>
                ${currency}${item.value2}
                </td>
                <td class="amount">${currency}${item.amount}</td>
            </tr>
        `).join('')}
    </tbody>`;
} else if (template === "amounts-only") {
    tableContent = `
    <thead>
        <tr>
            <th style="width: 60%">Item/Service</th>
            <th style="width: 30%">Amount</th>
        </tr>
    </thead>
    <tbody id="invoice-items">
        ${tableAllRow.map(item => `
            <tr>
                <td>
                ${item.description}
                </td>
                <td>
                ${currency}${item.amount}
                </td>
            </tr>
        `).join('')}
    </tbody>`;
}
table.innerHTML = tableContent;
tableContainer.appendChild(table);

// === end table