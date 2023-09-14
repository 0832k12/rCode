rCode.Extension.loadExtension = async function (id) {
    if (!rCode.extensionList.includes(id)) {
        if (id == 'custom')/*加载自定义扩展*/ {
            const extension = await rCode.Extension.showExtensionModel();
            if (extension) {
                const extensionType = extension.indexOf('https://') == 1 || extension.indexOf('http://') == 1;
                switch (extensionType) {
                    case false:
                        rCode.Extension.loadExtensionString(extension);
                        break;
                    case true:
                        rCode.Extension.loadExtensionURL(extension);
                        break;
                }
            }
        }
        else {
            if (id.indexOf('https://') == 1 || id.indexOf('http://') == 1) {
                rCode.Extension.loadExtensionURL(id);
            }
            else if (rCode.BuiltinList.includes(id)) {
                rCode.Extension.loadExtensionID(id);
            }
            else {
                rCode.Extension.loadExtensionString(id);
            }
        }
        if (id != 'custom') {
            rCode.extensionList.push(id);
        }
    }
    localStorage.setItem("rC:rCode.extensionList", JSON.stringify(rCode.extensionList));
    localStorage.setItem('rC:noExtension', 'false')
}

rCode.Extension.fetchExtension = async function (url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch extension from ${url}`);
        }

        const extensionCode = await response.text();
        return extensionCode;
    } catch (error) {
        console.error('Error fetching extension:', error);
        throw error;
    }
}

rCode.Extension.loadExtensionURL = async function (url) {
    try {
        const extensionCode = await rCode.Extension.fetchExtension(url);

        // Using Function constructor to execute the fetched extension code
        let messageMappings;
        function formatMessage({ id }) {
            const langMappings = messageMappings[rCode.currentLang] || {};
            const defaultMappings = messageMappings['default'] || {};

            if (langMappings.hasOwnProperty(id)) {
                return langMappings[id];
            } else if (defaultMappings.hasOwnProperty(id)) {
                return defaultMappings[id];
            } else {
                return id; // 返回原始消息
            }
        }

        function setformatMessage(mappings) {
            messageMappings = mappings;
        }
        rCode.BlockInfo = rCode.toolboxXml.innerHTML;
        eval(extensionCode);
        rCode.toolboxXml.innerHTML = rCode.BlockInfo;
        rCode.UI.workspace.updateToolbox(rCode.toolboxXml);
        rCode.extensionList.push(url);
    } catch (error) {
        console.error('Error loading extension:', error);
    }
}


rCode.Extension.loadExtensionString = function (string) {
    let messageMappings;
    function formatMessage({ id }) {
        const langMappings = messageMappings[rCode.currentLang] || {};
        const defaultMappings = messageMappings['default'] || {};

        if (langMappings.hasOwnProperty(id)) {
            return langMappings[id];
        } else if (defaultMappings.hasOwnProperty(id)) {
            return defaultMappings[id];
        } else {
            return id; // 返回原始消息
        }
    }

    function setformatMessage(mappings) {
        messageMappings = mappings;
    }
    rCode.BlockInfo = rCode.toolboxXml.innerHTML;
    eval(string);
    rCode.toolboxXml.innerHTML = rCode.BlockInfo;
    rCode.UI.workspace.updateToolbox(rCode.toolboxXml);
    rCode.extensionList.push(string);
}

rCode.Extension.loadExtensionID = function (id) {
    const extension = id;
    rCode.BlockInfo = rCode.toolboxXml.innerHTML;
    let messageMappings;
    function formatMessage({ id }) {
      const langMappings = messageMappings[rCode.currentLang] || {};
      const defaultMappings = messageMappings['default'] || {};
  
      if (langMappings.hasOwnProperty(id)) {
        return langMappings[id];
      } else if (defaultMappings.hasOwnProperty(id)) {
        return defaultMappings[id];
      } else {
        return id; // 返回原始消息
      }
    }
  
    function setformatMessage(mappings) {
      messageMappings = mappings;
    }
  
    const Console_Extension = function () {
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
    const Div_Extension = function () {
      // 设置本地化消息
      setformatMessage({
        'zh-hans': {
          'name': 'Div元素',
          'create_div': '创建DIV元素',
          'set_text': '设置 %1 的文本为 %2',
          'set_color': '设置 %1 的颜色为 %2',
          'set_style': '设置 %1 的样式属性 %2 为 %3',
          'remove_div': '移除 %1 元素'
        },
        'default': {
          'name': 'Div',
          'create_div': 'Create DIV Element',
          'set_text': 'Set Text of %1 to %2',
          'set_color': 'Set Color of %1 to %2',
          'set_style': 'Set Style Property %2 of %1 to %3',
          'remove_div': 'Remove %1 Element'
        }
      });
      // 定义“创建DIV元素”块
      rCode.Blocks['create_div'] = {
        init: function () {
          this.jsonInit({
            "type": "create_div",
            "message0": formatMessage({ id: 'create_div' }),
            "output": "Element",
            "colour": 160
          });
        }
      };
      // 定义“设置文本”块
      rCode.Blocks['set_text'] = {
        init: function () {
          this.jsonInit({
            "type": "set_text",
            "message0": formatMessage({ id: 'set_text' }),
            "args0": [
              {
                "type": "field_variable",
                "name": "DIV_VARIABLE",
                "variable": "i"
              },
              {
                "type": "input_value",
                "name": "TEXT",
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
          });
        }
      };
  
      // 定义“设置颜色”块
      rCode.Blocks['set_color'] = {
        init: function () {
          this.jsonInit({
            "type": "set_color",
            "message0": formatMessage({ id: 'set_color' }),
            "args0": [
              {
                "type": "field_variable",
                "name": "DIV_VARIABLE",
                "variable": "i"
              },
              {
                "type": "input_value",
                "name": "COLOR",
                "check": "Colour"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
          });
        }
      };
      // 定义“设置样式”块
      rCode.Blocks['set_style'] = {
        init: function () {
          this.jsonInit({
            "type": "set_style",
            "message0": formatMessage({ id: 'set_style' }),
            "args0": [
              {
                "type": "field_variable",
                "name": "DIV_VARIABLE",
                "variable": "i"
              },
              {
                "type": "field_dropdown",
                "name": "STYLE_PROPERTY",
                "options": [
                  ["background-color", "background-color"],
                  ["color", "color"],
                  ["font-size", "font-size"],
                  ["font-family", "font-family"],
                  ["border", "border"],
                  ["margin", "margin"],
                  ["padding", "padding"],
                  ["text-align", "text-align"],
                  ["width", "width"],
                  ["height", "height"],
                  ["border-radius", "border-radius"],
                ]
              },
              {
                "type": "input_value",
                "name": "STYLE_VALUE",
                "check": "String"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
          });
        }
      };
      // 定义“移除DIV元素”块
      rCode.Blocks['remove_div'] = {
        init: function () {
          this.jsonInit({
            "type": "remove_div",
            "message0": formatMessage({ id: 'remove_div' }),
            "args0": [
              {
                "type": "field_variable",
                "name": "DIV_VARIABLE",
                "variable": "i"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160
          });
        }
      };
      // JavaScript 生成函数
      rCode.JavaScript['create_div'] = function (block) {
        var code = 'document.createElement("div")';
        return [code, rCode.JavaScript.ORDER_ATOMIC];
      };
      rCode.JavaScript['set_text'] = function (block) {
        var divVariable = rCode.JavaScript.nameDB_.getName(block.getFieldValue('DIV_VARIABLE'), rCode.Variables.NAME_TYPE);
        var textValue = rCode.JavaScript.valueToCode(block, 'TEXT', rCode.JavaScript.ORDER_ATOMIC);
        var code = divVariable + '.innerText = ' + textValue + ';\n';
        return code;
      };
  
      rCode.JavaScript['set_color'] = function (block) {
        var divVariable = rCode.JavaScript.nameDB_.getName(block.getFieldValue('DIV_VARIABLE'), rCode.Variables.NAME_TYPE);
        var colorValue = block.getFieldValue('COLOR');
        var code = divVariable + '.style.color = "' + colorValue + '";\n';
        return code;
      };
      // JavaScript 生成函数
      rCode.JavaScript['set_style'] = function (block) {
        var divVariable = rCode.JavaScript.variableDB_.getName(block.getFieldValue('DIV_VARIABLE'), rCode.Variables.NAME_TYPE);
        var styleProperty = rCode.JavaScript.valueToCode(block, 'STYLE_PROPERTY', rCode.JavaScript.ORDER_ATOMIC);
        var styleValue = rCode.JavaScript.valueToCode(block, 'STYLE_VALUE', rCode.JavaScript.ORDER_ATOMIC);
        var code = divVariable + '.style[' + styleProperty + '] = ' + styleValue + ';\n';
        return code;
      };
  
      rCode.JavaScript['remove_div'] = function (block) {
        var divVariable = rCode.JavaScript.nameDB_.getName(block.getFieldValue('DIV_VARIABLE'), rCode.Variables.NAME_TYPE);
        var code = divVariable + '.remove();\n';
        return code;
      };
      rCode.BlockInfo +=
        `<category name="${formatMessage({ id: 'name' })}" colour="120">
  <block type="create_div"></block>
  <block type="set_text">
  <value name="TEXT">
    <shadow type="text">
      <field name="TEXT">Hello, World!</field>
    </shadow>
  </value>
  </block>
  <block type="set_color">
  <value name="COLOR">
    <shadow type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </shadow>
  </value>
  </block>
  <block type="set_style">
  <value name="STYLE_PROPERTY">
    <shadow type="field_dropdown">
      <field name="STYLE_PROPERTY">background-color</field>
    </shadow>
  </value>
  <value name="STYLE_VALUE">
    <shadow type="text">
      <field name="TEXT">#ffffff</field>
    </shadow>
  </value>
  </block>
  <block type="remove_div"></block>
  </category>`;
    }
    const Debug_Extension = function () {
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
      rCode.BlockInfo +=
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
    }
    const PROS_Extension = function () {
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
          'get_analog': '在主控 %1 中， 摇杆XY %2',
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
          'get_analog': 'In Controller %1, Analog %2',
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
            "message0": formatMessage({ id: 'check_button_pressed' }),
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
            "output": 'Boolean',
            "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL,
            "colour": 100
          });
        }
      };
  
      rCode.Blocks['get_analog'] = {
        init: function () {
          this.jsonInit({
            "type": "get_analog",
            "message0": formatMessage({ id: 'get_analog' }),
            "args0": [
              {
                "type": "field_input",
                "name": "CONTROLLER_NAME",
                "text": "controller1"
              },
              {
                "type": "field_dropdown",
                "name": "ANALOG",
                "options": [
                  ['Right X', 'ANALOG_RIGHT_X'],
                  ['Right Y', 'ANALOG_RIGHT_Y'],
                  ['Left X', 'ANALOG_LEFT_X'],
                  ['Left Y', 'ANALOG_LEFT_Y'],
                ]
              }
            ],
            "output": null,
            "colour": 100
          });
        }
      };
  
      rCode.cpp['include'] = function (block) {
        var header = block.getFieldValue('HEADER');
        var code = `#include <${header}>\n`;
        localStorage.setItem("rC:intmain", 'false');
        return code;
      }
  
      rCode.cpp['using_namespace'] = function () {
        var code = 'using namespace pros;\n';
        localStorage.setItem("rC:intmain", 'false');
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
        return [code, rCode.cpp.ORDER_ATOMIC];
      };
  
      // 实现检测按钮按下的 C++ 代码生成逻辑
      rCode.cpp['check_button_pressed'] = function (block) {
        var controllerName = block.getFieldValue('CONTROLLER_NAME');
        var button = block.getFieldValue('BUTTON');
        var code = `${controllerName}.get_digital(${button})`;
        return [code, rCode.cpp.ORDER_ATOMIC];
      };
  
      // 实现检测按钮按下的 C++ 代码生成逻辑
      rCode.cpp['get_analog'] = function (block) {
        var controllerName = block.getFieldValue('CONTROLLER_NAME');
        var analog = block.getFieldValue('ANALOG');
        var code = `${controllerName}.get_analog(${analog})`;
        return [code, rCode.cpp.ORDER_ATOMIC];
      };
  
      rCode.BlockInfo +=
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
        <block type="get_analog">
        <field name="CONTROLLER_NAME">master</field>
        <field name="ANALOG">ANALOG_RIGHT_X</field>
    </block>
        </category>`;
    }
    if (extension == 'Console') {
      Console_Extension();
    }
    else if (extension == 'Div') {
      Div_Extension();
    }
    else if (extension == 'Debug') {
      Debug_Extension();
    }
    else if (extension == 'PROS') {
      PROS_Extension();
    }
    rCode.toolboxXml.innerHTML = rCode.BlockInfo;
    rCode.UI.workspace.updateToolbox(rCode.toolboxXml);
  }