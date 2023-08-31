setformatMessage({
    'zh-hans': {
        'name': 'PROS',
        'include': '加载依赖 %1',
        'using_namespace': '使用 pros 命名空间',
        'set_controller': '设置主控器 %1',
        'motor_move': '马达 %1 转速 %2',
        'pneumatic_push': '气缸 %1 弹出 ',
        'pneumatic_pull': '气缸 %1 收回',
        'get_motor_property': '获取电机 %1 的 %2',
        'motor_property_options': [
            ['位置', 'get_position'],
            ['动力', 'get_power'],
            ['温度', 'get_temperature']
        ],
        'check_button_pressed': '在主控 %1 中，按下按钮 %2？',
        'declare_motor': '设置马达 %1 端口为 %2',
        'declare_pneumatic': '设置气缸 %1 端口为 %2'
    },
    'default': {
        'name': 'PROS',
        'include': '#include %1',
        'using_namespace': 'using namespace pros',
        'set_controller': 'Set Controller %1',
        'motor_move': '%1 Motor Speed %2',
        'pneumatic_push': 'Pneumatic Push at %1',
        'pneumatic_pull': 'Pneumatic Pull at %1',
        'get_motor_property': 'Get %2 of Motor %1',
        'motor_property_options': [
            ['Position', 'get_position'],
            ['Power', 'get_power'],
            ['Temperature', 'get_temperature']
        ],
        'check_button_pressed': 'In Controller %1, Pressed Button %2?',
        'declare_motor': 'Declare Motor %1 at Port %2',
        'declare_pneumatic': 'Declare Pneumatic %1 at Port %2'
    }
});

rCode.Blocks['include'] = {
    init: function () {
        this.jsonInit({
            "type": "include",
            "message0": formatMessage({ id: 'include' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "HEADER",
                    "text": "main.h"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}

rCode.Blocks['using_namespace'] = {
    init: function () {
        this.jsonInit({
            "type": "using_namespace",
            "message0": formatMessage({ id: 'using_namespace' }),
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}

rCode.Blocks['motor_move'] = {
    init: function () {
        this.jsonInit({
            "type": "motor_move",
            "message0": formatMessage({ id: 'motor_move' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "motor1"
                },
                {
                    "type": "field_number",
                    "name": "SPEED",
                    "value": 100
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
        });
    }
}

rCode.Blocks['pneumatic_push'] = {
    init: function () {
        this.jsonInit({
            "type": "pneumatic_push",
            "message0": formatMessage({ id: 'pneumatic_push' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "pneumatic1"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
        });
    }
}

rCode.Blocks['pneumatic_pull'] = {
    init: function () {
        this.jsonInit({
            "type": "pneumatic_pull",
            "message0": formatMessage({ id: 'pneumatic_pull' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "pneumatic1"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
        });
    }
}


  
rCode.Blocks['declare_motor'] = {
    init: function () {
        this.jsonInit({
            "type": "declare_motor",
            "message0": formatMessage({ id: 'declare_motor' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "MOTOR_NAME",
                    "text": "motor1"
                },
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "1"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}


rCode.Blocks['declare_pneumatic'] = {
    init: function () {
        this.jsonInit({
            "type": "declare_pneumatic",
            "message0": formatMessage({ id: 'declare_pneumatic' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "PNEUMATIC_NAME",
                    "text": "pneumatic1"
                },
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "A"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}
// 定义设置主控器的Blockly块
rCode.Blocks['set_controller'] = {
    init: function () {
        this.jsonInit({
            "type": "set_controller",
            "message0": formatMessage({ id: 'set_controller' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "CONTROLLER_NAME",
                    "text": "controller1"
                },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
};

// 定义获取电机属性的 Blockly 块
rCode.Blocks['get_motor_property'] = {
    init: function () {
        this.jsonInit({
            "type": "get_motor_property",
            "message0": formatMessage({ id: 'get_motor_property' }),
            "args0": [
                {
                    "type": "field_input",
                    "name": "MOTOR_NAME",
                    "text": "motor1"
                },
                {
                    "type": "field_dropdown",
                    "name": "PROPERTY",
                    "options": formatMessage({ id: 'motor_property_options' })
                }
            ],
            "output": null,
            "colour": 100
        });
    }
};

// 定义在主控制器中按下按钮的 Blockly 块
rCode.Blocks['check_button_pressed'] = {
    init: function () {
        this.jsonInit({
            "type": "check_button_pressed",
            "message0": "在主控 %1 中，按下按钮 %2？",
            "args0": [
                {
                    "type": "field_input",
                    "name": "CONTROLLER_NAME",
                    "text": "controller1"
                },
                {
                    "type": "field_dropdown",
                    "name": "BUTTON",
                    "options": [
                        ['L1', 'DIGITAL_L1'],
                        ['L2', 'DIGITAL_L2'],
                        ['R1', 'DIGITAL_R1'],
                        ['R2', 'DIGITAL_R2'],
                        ['A', 'DIGITAL_A'],
                        ['B', 'DIGITAL_B'],
                        ['X', 'DIGITAL_X'],
                        ['Y', 'DIGITAL_Y'],
                        ['LEFT', 'DIGITAL_LEFT'],
                        ['RIGHT', 'DIGITAL_RIGHT'],
                        ['UP', 'DIGITAL_UP'],
                        ['DOWN', 'DIGITAL_DOWN']
                    ]
                }
            ],
            "output": "Boolean",
            "outputShape": rCode.OUTPUT_SHAPE_HEXAGONAL,
            "colour": 100
        });
    }
};

rCode.cpp['include'] = function (block) {
    var header = block.getFieldValue('HEADER');
    var code = `#include <${header}>\n`;
    localStorage.setItem("rC:intmain",'false');
    return code;
}

rCode.cpp['using_namespace'] = function () {
    var code = 'using namespace pros;\n';
    localStorage.setItem("rC:intmain",'false');
    return code;
}

rCode.cpp['motor_move'] = function (block) {
    var name = block.getFieldValue('NAME');
    var speed = parseFloat(block.getFieldValue('SPEED'));
    var code = `${name} = ${speed};\n`;
    return code;
}

rCode.cpp['pneumatic_push'] = function (block) {
    var name = block.getFieldValue('NAME');
    var code = `${name} = 1;\n`;
    return code;
}

rCode.cpp['pneumatic_pull'] = function (block) {
    var name = block.getFieldValue('NAME');
    var code = `${name} = 0;\n`;
    return code;
}

rCode.cpp['declare_motor'] = function (block) {
    var motorName = block.getFieldValue('MOTOR_NAME');
    var motorPort = block.getFieldValue('NAME');
    var code = `Motor ${motorName}(${motorPort});\n`;
    return code;
}

rCode.cpp['declare_pneumatic'] = function (block) {
    var pneumaticName = block.getFieldValue('PNEUMATIC_NAME');
    var pneumaticPort = block.getFieldValue('NAME');
    var code = `ADIDigitalOut ${pneumaticName}(${pneumaticPort});\n`;
    return code;
}

// 实现设置主控器的C++代码生成逻辑
rCode.cpp['set_controller'] = function (block) {
    var controllerName = block.getFieldValue('CONTROLLER_NAME');
    var code = `Controller ${controllerName}(E_CONTROLLER_MASTER);\n`;
    return code;
};

// 实现获取电机属性的 C++ 代码生成逻辑
rCode.cpp['get_motor_property'] = function (block) {
    var motorName = block.getFieldValue('MOTOR_NAME');
    var property = block.getFieldValue('PROPERTY');
    var code = `${motorName}.${property}()`;
    return [code, rCode.ORDER_ATOMIC];
};

// 实现检测按钮按下的 C++ 代码生成逻辑
rCode.cpp['check_button_pressed'] = function (block) {
    var controllerName = block.getFieldValue('CONTROLLER_NAME');
    var button = block.getFieldValue('BUTTON');
    var code = `${controllerName}.get_digital(${button})`;
    return [code, rCode.ORDER_ATOMIC];
};

BlockInfo +=
    `<category name="${formatMessage({ id: 'name' })}" colour="230">
      <block type="include">
        <field name="HEADER">main.h</field>
      </block>
      <block type="using_namespace"></block>
      <block type="set_controller">
          <field name="CONTROLLER_NAME">master</field>
        </block>
      <block type="declare_motor">
        <field name="MOTOR_NAME">motor1</field>
        <field name="NAME">1</field>
      </block>
      <block type="declare_pneumatic">
        <field name="PNEUMATIC_NAME">pneumatic1</field>
        <field name="NAME">A</field>
      </block>
      <block type="motor_move">
        <field name="SPEED">100</field>
      </block>
      <block type="pneumatic_push"></block>
      <block type="pneumatic_pull"></block>
      <block type="get_motor_property">
        <field name="MOTOR_NAME">motor1</field>
          <field name="PROPERTY">get_position</field>
        </block>
        <block type="check_button_pressed">
        <field name="CONTROLLER_NAME">master</field>
        <field name="BUTTON">DIGITAL_L1</field>
    </block>
    </category>`;