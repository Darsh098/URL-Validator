self.onmessage = function (e) {
    const url = e.data;

    const pattern = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

    const isValid = !!pattern.test(url);

    self.postMessage(isValid);
};
