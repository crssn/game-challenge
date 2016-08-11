function randomCoords(min, max, multiple) {
    return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
}

function randInt() {
    return 10 * (Math.floor((Math.random() * 100) + 1));
}

function logToConsole(el, msg) {
    el.value = msg + '\n' + el.value;
    console.log(msg);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}