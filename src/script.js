const urlInput = document.getElementById('url-input');
const feedback = document.getElementById('feedback');
const loader = document.getElementById('loader');

let currentCheckId = 0; // Track the current check ID

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
const mockServerCheck = (url) => {
    console.log('Mock server check for:', url);
    feedback.textContent = '';
    loader.style.display = 'block';
    const checkId = ++currentCheckId; // Increment and store the current check ID

    // Simulate server response
    setTimeout(() => {

        // If the check ID doesn't match, ignore the result
        if (checkId !== currentCheckId)
            return;

        loader.style.display = 'none';

        const randomNonExistent = Math.random() < 0.3; // 30% chance that resource doesn't exist

        if (randomNonExistent) {
            feedback.textContent = 'Resource does not exist (404)';
            feedback.style.color = 'red';
        } else if (url.endsWith('/')) {
            feedback.textContent = 'Folder exists';
            feedback.style.color = '#009e8c';
        } else {
            feedback.textContent = 'File exists';
            feedback.style.color = '#009e8c';
        }
    }, 1000);
};

const validateUrl = (url) => {
    const pattern = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return pattern.test(url);
};

urlInput.addEventListener('input', () => {
    const url = urlInput.value;

    if (url === '') {
        feedback.textContent = '';
        loader.style.display = 'none';
        currentCheckId++; // Increment ID to prevent future valid checks from overriding
        return;
    }

    if (validateUrl(url)) {
        feedback.textContent = 'Valid URL';
        feedback.style.color = '#009e8c';
        mockServerCheck(url);
    } else {
        feedback.textContent = 'Invalid URL';
        feedback.style.color = 'red';
        loader.style.display = 'none'; // Hide loader immediately
        currentCheckId++; // Increment ID to prevent future valid checks from overriding
    }
});
