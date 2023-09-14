var a = function () {
    // 设置本地化消息
    setformatMessage({
        'zh-hans': {
            'name': '控制台',
            'log': '输出 %1',
            'warn': '警告 %1',
            'error': '错误 %1',
            'clear': '清除控制台'
        },
        'default': {
            'name': 'Console',
            'log': 'Log %1',
            'warn': 'Warn %1',
            'error': 'Error %1',
            'clear': 'Clear Console'
        }
    }, 'Console');

    // 定义“输出”块
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
    };

    // 定义“警告”块
    rCode.Blocks['console_warn'] = {
        init: function () {
            this.jsonInit({
                "type": "console_warn",
                "message0": formatMessage({ id: 'warn' }),
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
    };

    // 定义“错误”块
    rCode.Blocks['console_error'] = {
        init: function () {
            this.jsonInit({
                "type": "console_error",
                "message0": formatMessage({ id: 'error' }),
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
    };

    // 定义“清除控制台”块
    rCode.Blocks['console_clear'] = {
        init: function () {
            this.jsonInit({
                "type": "console_clear",
                "message0": formatMessage({ id: 'clear' }),
                "previousStatement": null,
                "nextStatement": null,
                "colour": 230
            });
        }
    };

    // JavaScript 生成函数
    rCode.JavaScript['console_log'] = function (block) {
        var inputValue = rCode.JavaScript.valueToCode(block, 'MESSAGE', rCode.JavaScript.ORDER_ATOMIC);
        var code = 'console.log(' + inputValue + ');\n';
        return code;
    };

    rCode.JavaScript['console_warn'] = function (block) {
        var inputValue = rCode.JavaScript.valueToCode(block, 'MESSAGE', rCode.JavaScript.ORDER_ATOMIC);
        var code = 'console.warn(' + inputValue + ');\n';
        return code;
    };

    rCode.JavaScript['console_error'] = function (block) {
        var inputValue = rCode.JavaScript.valueToCode(block, 'MESSAGE', rCode.JavaScript.ORDER_ATOMIC);
        var code = 'console.error(' + inputValue + ');\n';
        return code;
    };

    rCode.JavaScript['console_clear'] = function (block) {
        var code = 'console.clear();\n';
        return code;
    };

    // 在 rCode.BlockInfo 中添加块和类别
    rCode.BlockInfo +=
        `<category name="${formatMessage({ id: 'name' })}" colour="120">
      <block type="console_log">
        <value name="MESSAGE">
          <shadow type="text">
            <field name="TEXT">Hello, World!</field>
          </shadow>
        </value>
      </block>
      <block type="console_warn">
        <value name="MESSAGE">
          <shadow type="text">
            <field name="TEXT">Warning Message</field>
          </shadow>
        </value>
      </block>
      <block type="console_error">
        <value name="MESSAGE">
          <shadow type="text">
            <field name="TEXT">Error Message</field>
          </shadow>
        </value>
      </block>
      <block type="console_clear"></block>
    </category>`;
}

rCode.OUTPUT = a;