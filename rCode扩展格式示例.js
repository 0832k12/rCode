setformatMessage({
    'zh-hans': {
        'name': '调试执行',
        'function_create': '创建函数 %1',
        'function_do': '执行函数 %1'
    },
    'default': {
        'name': 'Debug Execution',
        'function_create': 'Create Function %1',
        'function_do': 'Do Function %1'
    }
});

// Blockly Block Definition for 'function_create'
rCode.Blocks['function_create'] = {
    init: function () {
        this.jsonInit({
            "type": "function_create",
            "message0": formatMessage({ id: 'function_create' }),
            "args0": [
                {
                    "type": "input_value",
                    "name": "FUNCTION_BODY",
                }
            ],
            "output": "function",
            "colour": '#ff6680'
        });
    }
};

// Blockly Block JavaScript Generator for 'function_create'
rCode.JavaScript['function_create'] = function (block) {
    var functionBody = rCode.JavaScript.valueToCode(block, 'FUNCTION_BODY', rCode.JavaScript.ORDER_ATOMIC);
    var code = 'new Function(' + functionBody + ')';
    return [code, rCode.JavaScript.ORDER_ATOMIC];
};

// Blockly Block Definition for 'function_do'
rCode.Blocks['function_do'] = {
    init: function () {
        this.jsonInit({
            "type": "function_do",
            "message0": formatMessage({ id: 'function_do' }),
            "output": "String",
            "args0": [
                {
                    "type": "input_value",
                    "name": "FUNCTION",
                }
            ],
            "colour": '#ff6680'
        });
    }
};

// Blockly Block JavaScript Generator for 'function_do'
rCode.JavaScript['function_do'] = function (block) {
    var functionBody = rCode.JavaScript.valueToCode(block, 'FUNCTION', rCode.JavaScript.ORDER_ATOMIC);
    var code = functionBody + '()';
    return [code, rCode.JavaScript.ORDER_ATOMIC];
};
// Block Category Definition
BlockInfo +=
    `<category name="${formatMessage({ id: 'name' })}" colour="#ff6680">
        <block type="function_create">
            <value name="FUNCTION_BODY">
                <shadow type="text">
                    <field name="TEXT">return 1+1</field>
                </shadow>
            </value>
        </block>
        <block type="function_do">
            <value name="FUNCTION">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
             </value>
        </block>
    </category>`;