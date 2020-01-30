function ajaxGet(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            callback(response);
        }
    };
    request.open("GET", url);
    request.send();
}