// 扩展解析
var blockDefinition = {
    type: 'custom_block',
    message0: 'My Custom Block',
    nextStatement: null,
    previousStatement: null,
    colour: 230
};

// 注册块定义到 Blockly
Blockly.Blocks['custom_block'] = {
    init: function () {
        this.jsonInit(blockDefinition);
    }
}

// 添加自定义工具箱树项目
var customCategoryXml = '<category name="Custom Blocks" colour="120">';
var customBlockXml = '<block type="custom_block"></block>';
toolboxXml.innerHTML += customCategoryXml + customBlockXml + '</category>';

// 更新工作区的工具箱
Code.workspace.updateToolbox(toolboxXml);