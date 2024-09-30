let latestUrl = ''; // To keep track of the latest URL being typed

// Used Throttling As Given In Task Description
// Throttle function to limit the number of calls to the mock server
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

// If Want to Use Debouncing : In My Opinion Better Approach In This Case
// function throttle(fn, delay) {
//     let timeoutId;
//     return function (...args) {
//         if (timeoutId) clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => fn(...args), delay);
//     };
// }

// URL format validation
function isValidURL(url) {
    const urlPattern = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return urlPattern.test(url);
}

document.getElementById('url-input').addEventListener('input', function () {
    const inputUrl = document.getElementById('url-input').value;
    const feedback = document.getElementById('feedback');
    const loader = document.getElementById('loader');

    feedback.textContent = '';
    loader.style.display = 'none';

    latestUrl = inputUrl; // Setting the latest URL to the current input

    // URL format check
    if (inputUrl && !isValidURL(inputUrl)) {
        feedback.textContent = 'Invalid URL format';
        feedback.style.color = 'red';
        return; // Don't proceed with the existence check if format is invalid
    }

    // Only trigger the existence check if the URL format is valid
    if (inputUrl) {
        loader.style.display = 'block';
        throttleCheckURL(inputUrl);
    }
});

// Throttled check for URL existence
const throttleCheckURL = throttle((url) => {
    // Logging the URL being sent to the mock server
    console.log('Mock server check for:', url);

    mockServer.checkURL(url)
        .then(response => {
            const feedback = document.getElementById('feedback');
            const loader = document.getElementById('loader');

            loader.style.display = 'none';

            if (url === latestUrl) {
                if (response.status === 200) {
                    feedback.textContent = response.message;
                    feedback.style.color = '#009e8c';
                } else {
                    feedback.textContent = response.message;
                    feedback.style.color = 'red';
                }
            } else {
                // Right Now Just For The Logging Purpose
                console.log('Response ignored as the input has changed.');
            }
        })
        .catch(error => {
            const feedback = document.getElementById('feedback');
            feedback.textContent = 'Error: ' + error;
            feedback.style.color = 'red';
            loader.style.display = 'none';
        });
}, 1000); // Throttle delay set to 1000ms
