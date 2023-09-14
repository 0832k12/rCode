rCode.secLoad = false;
localStorage.setItem("rC:intmain", 'true');
rCode.currentLang = rCode.getUrlBases(window.location.href).lang;
// Load the Code demo's language strings.
document.write('<script src="msg/' + rCode.UI.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="./msg/js/' + rCode.UI.LANG + '.js"></script>\n');

window.addEventListener('load', rCode.UI.init);
