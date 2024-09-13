const urlInput = document.getElementById('url-input');
const feedback = document.getElementById('feedback');

// Initialized the Web Worker
const worker = new Worker('urlValidator.js');

// Throttling function
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// Mock server check
const mockServerCheck = throttle(() => {
    console.log('Mock server check for:', urlInput.value);
    setTimeout(() => {
        if (urlInput.value.endsWith('/')) {
            feedback.textContent = 'Folder exists';
            feedback.style.color = '#009e8c';
        } else {
            feedback.textContent = 'File exists';
            feedback.style.color = '#009e8c';
        }
    }, 1000);
}, 1000);

// Handle the worker's response (URL validation result)
worker.onmessage = function (e) {
    const isValid = e.data;

    if (isValid) {
        feedback.textContent = 'Valid URL';
        feedback.style.color = '#009e8c';
        mockServerCheck();
    } else {
        feedback.textContent = 'Invalid URL';
        feedback.style.color = 'red';
    }
};

// Listens for input changes and sends URL to the Web Worker
urlInput.addEventListener('input', () => {
    const url = urlInput.value;
    worker.postMessage(url); // Sends URL to the Web Worker for validation
});
