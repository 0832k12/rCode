setformatMessage({
    'zh-hans': {
        'name': 'PROS',
        'include': '#include',
        'using_namespace': 'using namespace pros;',
        'motor_forward': '马达前进 %1',
        'motor_backward': '马达后退 %1',
        'pneumatic_push': '气缸推出',
        'pneumatic_pull': '气缸收回',
        'declare_motor': '声明马达 %1 端口为 %2',
        'declare_pneumatic': '声明气缸 %1 端口为 %2'
    },
    'default': {
        'name': 'PROS',
        'include': '#include',
        'using_namespace': 'using namespace pros;',
        'motor_forward': 'Motor Forward %1',
        'motor_backward': 'Motor Backward %1',
        'pneumatic_push': 'Pneumatic Push',
        'pneumatic_pull': 'Pneumatic Pull',
        'declare_motor': 'Declare Motor %1 at Port %2',
        'declare_pneumatic': 'Declare Pneumatic %1 at Port %2'
    }
});

rCode.Blocks['include'] = {
    init: function () {
        this.jsonInit({
            "type": "include",
            "message0": formatMessage({ id: 'include' }) + ' %1',
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

rCode.Blocks['motor_forward'] = {
    init: function () {
        this.jsonInit({
            "type": "motor_forward",
            "message0": formatMessage({ id: 'motor_forward' }, ["100"]),
            "args0": [
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

rCode.Blocks['motor_backward'] = {
    init: function () {
        this.jsonInit({
            "type": "motor_backward",
            "message0": formatMessage({ id: 'motor_backward' }, ["100"]),
            "args0": [
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
                    "name": "MOTOR_PORT",
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
                    "name": "PNEUMATIC_PORT",
                    "text": "A"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230
        });
    }
}


rCode.cpp['include'] = function (block) {
    var header = block.getFieldValue('HEADER');
    var code = `#include <${header}>\n`;
    localStorage.setItem("rC:intmain",'false');
    return code;
}

rCode.cpp['using_namespace'] = function (block) {
    var code = 'using namespace pros;\n';
    localStorage.setItem("rC:intmain",'false');
    return code;
}

rCode.cpp['motor_forward'] = function (block) {
    var speed = parseFloat(block.getFieldValue('SPEED'));
    var code = `motor.move(MOTOR_PORT, ${speed});\n`;
    return code;
}

rCode.cpp['motor_backward'] = function (block) {
    var speed = parseFloat(block.getFieldValue('SPEED'));
    var code = `motor.move(MOTOR_PORT, -${speed});\n`;
    return code;
}

rCode.cpp['pneumatic_push'] = function (block) {
    var code = `pneumatic.push(PNEUMATIC_PORT);\n`;
    return code;
}

rCode.cpp['pneumatic_pull'] = function (block) {
    var code = `pneumatic.pull(PNEUMATIC_PORT);\n`;
    return code;
}

rCode.cpp['declare_motor'] = function (block) {
    var motorName = block.getFieldValue('MOTOR_NAME');
    var motorPort = block.getFieldValue('MOTOR_PORT');
    var code = `Motor ${motorName}(${motorPort});\n`;
    return code;
}

rCode.cpp['declare_pneumatic'] = function (block) {
    var pneumaticName = block.getFieldValue('PNEUMATIC_NAME');
    var pneumaticPort = block.getFieldValue('PNEUMATIC_PORT');
    var code = `Pneumatic ${pneumaticName}(${pneumaticPort});\n`;
    return code;
}

BlockInfo +=
    `<category name="${formatMessage({ id: 'name' })}" colour="230">
      <block type="include">
        <field name="HEADER">main.h</field>
      </block>
      <block type="using_namespace"></block>
      <block type="declare_motor">
        <field name="MOTOR_NAME">motor1</field>
        <field name="MOTOR_PORT">1</field>
      </block>
      <block type="declare_pneumatic">
        <field name="PNEUMATIC_NAME">pneumatic1</field>
        <field name="PNEUMATIC_PORT">A</field>
      </block>
      <block type="motor_forward">
        <field name="SPEED">100</field>
      </block>
      <block type="motor_backward">
        <field name="SPEED">100</field>
      </block>
      <block type="pneumatic_push"></block>
      <block type="pneumatic_pull"></block>
    </category>`;
