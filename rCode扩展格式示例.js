setformatMessage({
    'zh-hans': {
        'name': '控制台',
        'log': '输出 %1'
    },
    'default': {
        'name': 'Console',
        'log': 'Log %1'
    }
});
rCode.Blocks['console_log'] = {
    init: function () {
        this.jsonInit({
            "type": "console_log",
            "message0": formatMessage({ id: 'log' }),
            "args0": [
                {
                    "type": "input_value",
                    "name": "MESSAGE",
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}
rCode.JavaScript['console_log'] = function (block) {
    var inputValue = rCode.JavaScript.valueToCode(block, 'MESSAGE', rCode.JavaScript.ORDER_ATOMIC);
    var code = 'console.log(' + inputValue + ');\n';
    return code;
};
BlockInfo +=
    `<category name="${formatMessage({ id: 'name' })}" colour="120">
      <block type="console_log">
        <value name="MESSAGE">
          <shadow type="text">
            <field name="TEXT">0832!</field>
          </shadow>
        </value>
      </block>
    </category>`;