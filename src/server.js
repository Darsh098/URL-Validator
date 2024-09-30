const mockServer = {
    checkURL: function (url) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!url) {
                    resolve({ status: 404, message: "Invalid URL or URL not found." });
                } else if (url.endsWith('/')) {
                    resolve({ status: 200, message: "It's a folder!" });
                } else if (url.match(/\.\w+$/)) {
                    resolve({ status: 200, message: "It's a file!" });
                } else {
                    resolve({ status: 404, message: "Resource does not exist (404)" });
                }
            }, 1000);
        });
    }
};
