const rCode = Blockly;

rCode.module = {};
rCode.module.require = async function (address) {
    var script = document.createElement('script');
    script.setAttribute('src', address);
    document.head.appendChild(script);
}
rCode.module.deeprequire = function (address) {
    document.write('<script src="' + address + '"></script>\n');
    return rCode.OUTPUT;
}

rCode.module.deeprequire('src/extension/AtFirst.js');
rCode.module.deeprequire('src/UI/AtFirst.js');
rCode.module.deeprequire('src/util/URL.js');

rCode.module.deeprequire('src/core.js');