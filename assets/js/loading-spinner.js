"use strict";

// page loadding model
loadHTML('modals', 'modals.html');

function waitForLoaderAndHide() {
    const spinner = document.getElementById('LoadSpinnerAll');
    if (spinner) {
        spinner.style.setProperty('display', 'none', 'important');
        document.body.style.cursor = '';
        headerNote();
    } else {
        waitForLoaderAndHide();
    }
}

setTimeout(() => {
    document.getElementById('LoadSpinnerAll')?.style.setProperty('display', 'flex', 'important');
    document.body.style.cursor = 'not-allowed';
    waitForLoaderAndHide();
}, 3500);
// page loadding model



