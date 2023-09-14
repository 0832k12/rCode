setformatMessage({
    'zh-hans': {
        'name': '适配器',
        'inline': '内联 %1',
    },
    'default': {
        'name': 'Adapter',
        'inline': 'Inline %1',
    }
});

rCode.Blocks['inline'] = {
    init: function () {
        this.jsonInit({
            "type": "inline",
            "message0": formatMessage({ id: 'inline' }),
            "args0": [
                {
                    "type": "input_statement",
                    "check": 'normal',
                    "name": "SUBSTACK"
                }
            ],
            "colour": 230,
            "output": null,
            "outputShape": Blockly.OUTPUT_SHAPE_SQUARE,
        });
    }
}

Blockly.JavaScript['inline'] = function (block) {
    var statements_substack = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
    // 去除换行符和";"字符
    statements_substack = statements_substack.replace(/(;|\n)/g, '');

    // 判断最后一个字符是否为";"，若是则去除最后一个字符
    if (statements_substack.charAt(statements_substack.length - 1) === ';') {
        statements_substack = statements_substack.slice(0, -1);
    }

    // 编译块的子块
    var code = statements_substack
    return code;

    return `//${rCode.currentLang == 'zh-hans'?'内联块仅供参考':'Inline Block just for reference'}`;
};

rCode.BlockInfo +=
    `<category name="${formatMessage({ id: 'name' })}" colour="230">
      <block type="inline"></block>
    </category>`;