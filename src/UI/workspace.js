  
  /**
   * Blockly's main workspace.
   * @type {Blockly.WorkspaceSvg}
   */
  rCode.UI.workspace = null;
  Blockly.Themes.DARK_THEME = Blockly.Theme.defineTheme('DARK_THEME', {
    'base': Blockly.Themes.Classic,
    'categoryStyles': {
      'custom_category': {
        'colour': "#5ba5a5"                     // 工具箱颜色标识
      },
    },
    'blockStyles': {
      // 块样式目前由四个字段组成：colourPrimary、colourSecondary、colorTertiary 和 hat。
      'custom_text_blocks': {
        'colourPrimary': "#5ba5a5",             //块的背景色，可以用色调或十六进制值定义
        'colourSecondary': "#5ba5a5",            // 如果块是阴影块，则使用此颜色
        'colourTertiary': "#C5EAFF"              // 块的边框颜色
      }
    },
    'componentStyles': {
      'workspaceBackgroundColour': '#2f323c',   // 工作区背景色
      'toolboxBackgroundColour': '#23262e',     // 工具箱背景色
      'toolboxForegroundColour': '#f5f5f5',     // 工具箱类别文字颜色
      'flyoutBackgroundColour': '#282b34',      // 弹出背景颜色
      'flyoutForegroundColour': '#333',         // 弹出标签文本颜色
      'flyoutOpacity': 1,                       // 弹出不透明度
      'scrollbarColour': '#dcdcdc',             // 滚动条颜色
      'scrollbarOpacity': 0.4,                  // 滚动条不透明度
      'insertionMarkerColour': '#f5f5f5',       // 插入标记颜色（不接受颜色名称）
      'insertionMarkerOpacity': 0.3,            // 插入标记不透明度
      'cursorColour': '#f5f5f5',                // 键盘导航模式下显示的光标颜色
    }
  });
  Blockly.Themes.LIGHT_THEME = Blockly.Theme.defineTheme('LIGHT_THEME', {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
      'workspaceBackgroundColour': '#f9f9f9',   // 工作区背景色
      'toolboxBackgroundColour': '#ffffff',     // 工具箱背景色
      'flyoutBackgroundColour': '#cccccc',      // 弹出背景颜色
    }
  });
  
  /**
   * Extracts a parameter from the URL.
   * If the parameter is absent default_value is returned.
   * @param {string} name The name of the parameter.
   * @param {string} defaultValue Value to return if parameter not found.
   * @return {string} The parameter value or the default value if not found.
   */
  rCode.UI.getStringParamFromUrl = function (name, defaultValue) {
    var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
  };
  
  /**
   * Get the language of this user from the URL.
   * @return {string} User's language.
   */
  rCode.UI.getLang = function () {
    var lang = rCode.UI.getStringParamFromUrl('lang', '');
    if (rCode.UI.LANGUAGE_NAME[lang] === undefined) {
      // Default to English.
      lang = 'en';
    }
    return lang;
  };
  
  /**
   * Is the current language (Code.LANG) an RTL language?
   * @return {boolean} True if RTL, false if LTR.
   */
  rCode.UI.isRtl = function () {
    return rCode.UI.LANGUAGE_RTL.indexOf(rCode.UI.LANG) != -1;
  };
  
  /**
   * Load blocks saved on App Engine Storage or in session/local storage.
   * @param {string} defaultXml Text representation of default blocks.
   */
  rCode.UI.loadBlocks = async function (defaultXml) {
    try {
      var loadOnce = window.sessionStorage.loadOnceBlocks;
    } catch (e) {
      // Firefox sometimes throws a SecurityError when accessing sessionStorage.
      // Restarting Firefox fixes this, so it looks like a bug.
      var loadOnce = null;
    }
    if ('BlocklyStorage' in window && window.location.hash.length > 1) {
      // An href with #key trigers an AJAX call to retrieve saved blocks.
      BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else if (loadOnce) {
      rCode.secLoad = true;
      // Language switching stores the blocks during the reload.
      delete window.sessionStorage.loadOnceBlocks;
      var xml = Blockly.Xml.textToDom(loadOnce);
      if (localStorage.getItem("rC:noExtension") == 'false') {
        rCode.extensionListLoad = JSON.parse(localStorage.getItem("rC:rCode.extensionList"));
        if (rCode.extensionListLoad.length > 0) {
          for (const extension of rCode.extensionListLoad) {
            rCode.Extension.loadExtension(extension);
          }
        }
      }
      Blockly.Xml.domToWorkspace(xml, rCode.UI.workspace);
    } else if (defaultXml) {
      // Load the editor with default starting blocks.
      var xml = Blockly.Xml.textToDom(defaultXml);
      Blockly.Xml.domToWorkspace(xml, rCode.UI.workspace);
    } else if ('BlocklyStorage' in window) {
      // Restore saved blocks in a separate thread so that subsequent
      // initialization is not affected from a failed load.
      window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
    if (rCode.secLoad == false) {//执行网址?=加载
      const BaseString = rCode.getUrlBases(window.location.href);
      let Extensions = JSON.parse(BaseString.extension ? BaseString.extension : '[]');
      let xml = BaseString.xml ? BaseString.xml : undefined;
      let project = BaseString.project ? BaseString.project : undefined;
      if (Extensions.length > 0) {
        {
          for (let i = 0; i < Extensions.length; i++) {
            const item = Extensions[i];
            rCode.Extension.loadExtension(item);
          }
        }
        localStorage.setItem('rC:noExtension', 'false')
        localStorage.setItem('rC:rCode.extensionList', JSON.stringify(rCode.extensionList))
      }
      else {
        localStorage.setItem('rC:noExtension', 'true')
        localStorage.setItem('rC:rCode.extensionList', '')
      }
      if (xml) {
        rCode.UI.workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), rCode.UI.workspace);
      }
      if (project) {//fetch project to XML
        async function getProjectFromUrl(url) {
          return new Promise((resolve, reject) => {
            fetch(url).then(response => response.text()).then(resolve).catch(reject);
          });
        }
        rCode.UI.workspace.clear();
        await getProjectFromUrl(project).then(xml => {
          Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), rCode.UI.workspace);
        })
      }
    }
  };
  
  /**
   * Save the blocks and reload with a different language.
   */
  rCode.UI.changeLanguage = function () {
    // Store the blocks for the duration of the reload.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (window.sessionStorage) {
      var xml = Blockly.Xml.workspaceToDom(rCode.UI.workspace);
      var text = Blockly.Xml.domToText(xml);
      window.sessionStorage.loadOnceBlocks = text;
    }
  
    var languageMenu = document.getElementById('languageMenu');
    var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
      search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
      search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
      search = search.replace(/\?/, '?lang=' + newLang + '&');
    }
  
    window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
  };
  
  /**
   * Changes the output language by clicking the tab matching
   * the selected language in the codeMenu.
   */
  rCode.UI.changeCodingLanguage = function () {
    var codeMenu = document.getElementById('code_menu');
    rCode.UI.tabClick(codeMenu.options[codeMenu.selectedIndex].value);
  }
  
  /**
   * Bind a function to a button's click event.
   * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
   * @param {!Element|string} el Button element or ID thereof.
   * @param {!Function} func Event handler to bind.
   */
  rCode.UI.bindClick = function (el, func) {
    if (typeof el == 'string') {
      el = document.getElementById(el);
    }
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
  };
  
  /**
   * Load the Prettify CSS and JavaScript.
   */
  rCode.UI.importPrettify = function () {
    rCode.module.require('./src/modules/Prettify/prettify.js')
  };
  
  /**
   * Compute the absolute coordinates and dimensions of an HTML element.
   * @param {!Element} element Element to match.
   * @return {!Object} Contains height, width, x, and y properties.
   * @private
   */
  rCode.UI.getBBox_ = function (element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    return {
      height: height,
      width: width,
      x: x,
      y: y
    };
  };
  
  /**
   * User's language (e.g. "en").
   * @type {string}
   */
  rCode.UI.LANG = rCode.UI.getLang();
  
  /**
   * List of tab names.
   * @private
   */
  rCode.UI.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'cpp', 'java', 'xml'];
  
  /**
   * List of tab names with casing, for display in the UI.
   * @private
   */
  rCode.UI.TABS_DISPLAY_ = [
    'Blocks', 'JavaScript', 'PHP', 'Python', 'Dart', 'Lua', 'cpp', 'java', 'XML',
  ];
  
  rCode.UI.selected = 'blocks';
  
  /**
   * Switch the visible pane when a tab is clicked.
   * @param {string} clickedName Name of tab clicked.
   */
  rCode.UI.tabClick = function (clickedName) {
    localStorage.setItem("rC:intmain", 'true')
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').classList.contains('tabon')) {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlText = xmlTextarea.value;
      var xmlDom = null;
      try {
        xmlDom = Blockly.Xml.textToDom(xmlText);
      } catch (e) {
        var q =
          window.confirm(MSG['badXml'].replace('%1', e));
        if (!q) {
          // Leave the user on the XML tab.
          return;
        }
      }
      if (xmlDom) {
        rCode.UI.workspace.clear();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlTextarea.value, "application/xml");
  
        // 获取所有的 <extension> 元素
        const extensionElements = xmlDoc.querySelectorAll("extension");
  
        // 遍历每个 <extension> 元素并加载
        extensionElements.forEach(extensionElement => {
          const extensionId = extensionElement.getAttribute("id");
          if (extensionId) {
            rCode.Extension.loadExtension(extensionId);
          }
        });
        Blockly.Xml.domToWorkspace(xmlDom, rCode.UI.workspace);
      }
    }
  
    if (document.getElementById('tab_blocks').classList.contains('tabon')) {
      rCode.UI.workspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < rCode.UI.TABS_.length; i++) {
      var name = rCode.UI.TABS_[i];
      var tab = document.getElementById('tab_' + name);
      tab.classList.add('taboff');
      tab.classList.remove('tabon');
      document.getElementById('content_' + name).style.visibility = 'hidden';
    }
  
    // Select the active tab.
    rCode.UI.selected = clickedName;
    var selectedTab = document.getElementById('tab_' + clickedName);
    selectedTab.classList.remove('taboff');
    selectedTab.classList.add('tabon');
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility =
      'visible';
    rCode.UI.renderContent();
    // The code menu tab is on if the blocks tab is off.
    var codeMenuTab = document.getElementById('tab_code');
    if (clickedName == 'blocks') {
      rCode.UI.workspace.setVisible(true);
      codeMenuTab.className = 'taboff';
    } else {
      codeMenuTab.className = 'tabon';
    }
    // Sync the menu's value with the clicked tab value if needed.
    var codeMenu = document.getElementById('code_menu');
    for (var i = 0; i < codeMenu.options.length; i++) {
      if (codeMenu.options[i].value == clickedName) {
        codeMenu.selectedIndex = i;
        break;
      }
    }
    Blockly.svgResize(rCode.UI.workspace);
  };
  
  /**
   * Populate the currently selected pane with content generated from the blocks.
   */
  rCode.UI.renderContent = function () {
    var content = document.getElementById('content_' + rCode.UI.selected);
    // Initialize the pane.
    if (content.id == 'content_xml') {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlDom = Blockly.Xml.workspaceToDom(rCode.UI.workspace);
      var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
      // 将XML字符串解析为DOM文档
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  
      // 获取所有的 <extension> 元素
      const extensionElements = xmlDoc.querySelectorAll("extension");
  
      // 从文档中删除每个 <extension> 元素
      extensionElements.forEach(extensionElement => {
        extensionElement.parentNode.removeChild(extensionElement);
      });
  
      for (let i = 0; i < rCode.extensionList.length; i++) {
        const extensionElement = xmlDoc.createElement("extension");
        extensionElement.setAttribute("id", rCode.extensionList[i]);
  
        const rootElement = xmlDoc.documentElement;
        rootElement.appendChild(extensionElement);
      }
      xmlText = new XMLSerializer().serializeToString(xmlDoc);
      xmlTextarea.value = xmlText;
      xmlTextarea.focus();
    } else if (content.id == 'content_javascript') {
      rCode.UI.attemptCodeGeneration(Blockly.JavaScript);
    } else if (content.id == 'content_python') {
      rCode.UI.attemptCodeGeneration(Blockly.Python);
    } else if (content.id == 'content_php') {
      rCode.UI.attemptCodeGeneration(Blockly.PHP);
    } else if (content.id == 'content_dart') {
      rCode.UI.attemptCodeGeneration(Blockly.Dart);
    } else if (content.id == 'content_lua') {
      rCode.UI.attemptCodeGeneration(Blockly.Lua);
    } else if (content.id == 'content_cpp') {
      rCode.UI.attemptCodeGeneration(Blockly.cpp);
    } else if (content.id == 'content_java') {
      rCode.UI.attemptCodeGeneration(Blockly.Java);
    }
    if (typeof PR == 'object') {
      PR.prettyPrint();
    }
  };
  
  /**
   * Attempt to generate the code and display it in the UI, pretty printed.
   * @param generator {!Blockly.Generator} The generator to use.
   */
  rCode.UI.attemptCodeGeneration = function (generator) {
    var content = document.getElementById('content_' + rCode.UI.selected);
    content.textContent = '';
    if (rCode.UI.checkAllGeneratorFunctionsDefined(generator)) {
      var code = generator.workspaceToCode(rCode.UI.workspace);
      content.textContent = code;
      // Remove the 'prettyprinted' class, so that Prettify will recalculate.
      content.className = content.className.replace('prettyprinted', '');
    }
  };
  
  /**
   * Check whether all blocks in use have generator functions.
   * @param generator {!Blockly.Generator} The generator to use.
   */
  rCode.UI.checkAllGeneratorFunctionsDefined = function (generator) {
    var blocks = rCode.UI.workspace.getAllBlocks(false);
    var missingBlockGenerators = [];
    for (var i = 0; i < blocks.length; i++) {
      var blockType = blocks[i].type;
      if (!generator[blockType]) {
        if (missingBlockGenerators.indexOf(blockType) == -1) {
          missingBlockGenerators.push(blockType);
        }
      }
    }
  
    var valid = missingBlockGenerators.length == 0;
    if (!valid) {
      var msg = 'The generator code for the following blocks not specified for ' +
        generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
      Blockly.alert(msg);  // Assuming synchronous. No callback.
    }
    return valid;
  };
  
  /**
   * Initialize Blockly.  Called on page load.
   */
  rCode.UI.init = async function () {
    rCode.UI.initLanguage();
  
    var rtl = rCode.UI.isRtl();
    var container = document.getElementById('content_area');
    var onresize = function (e) {
      var bBox = rCode.UI.getBBox_(container);
      for (var i = 0; i < rCode.UI.TABS_.length; i++) {
        var el = document.getElementById('content_' + rCode.UI.TABS_[i]);
        el.style.top = bBox.y + 'px';
        el.style.left = bBox.x + 'px';
        // Height and width need to be set, read back, then set again to
        // compensate for scrollbars.
        el.style.height = bBox.height + 'px';
        el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
        el.style.width = bBox.width + 'px';
        el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
      }
      // Make the 'Blocks' tab line up with the toolbox.
      if (rCode.UI.workspace && rCode.UI.workspace.getToolbox().width) {
        document.getElementById('tab_blocks').style.minWidth =
          (rCode.UI.workspace.getToolbox().width - 38) + 'px';
        // Account for the 19 pixel margin and on each side.
      }
    };
    window.addEventListener('resize', onresize, false);
  
    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name="%{BKY_CATLOGIC}">`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    for (var messageKey in MSG) {
      if (messageKey.indexOf('cat') == 0) {
        Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
      }
    }
  
    // Construct the toolbox XML, replacing translated variable names.
    var toolboxText = document.getElementById('toolbox').outerHTML;
    toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
      function (m, p1, p2) { return p1 + MSG[p2]; });
    rCode.toolboxXml = Blockly.Xml.textToDom(toolboxText);
  
  
    let currentTheme, theme;
    const storedDarkMode = localStorage.getItem("rC:darkModeEnabled");
    if (storedDarkMode == 'true') {
      currentTheme = "dark";
      themeIcon.src = "theme-dark.svg"; // 切换为深色主题图标
      document.body.classList.add("dark-theme"); // 添加深色主题样式
      theme = Blockly.Themes.DARK_THEME;
    } else {
      currentTheme = "light";
      themeIcon.src = "theme-light.svg"; // 切换为浅色主题图标
      document.body.classList.remove("dark-theme"); // 移除深色主题样式\
      theme = Blockly.Themes.LIGHT_THEME;
    }
    rCode.UI.workspace = Blockly.inject('content_blocks',
      {
        grid:
        {
          spacing: 0,
          length: 0,
          colour: '#ccc',
          snap: true
        },
        maxBlocks: Infinity,
        media: './media/',
        rtl: rtl,
        toolbox: rCode.toolboxXml,
        renderer: 'pxt',
        zoom:
        {
          controls: true,
          wheel: true
        },
        theme: theme
      });
  
    // Add to reserved word list: Local variables in execution environment (runJS)
    // and the infinite loop detection function.
    Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');
  
    await rCode.UI.loadBlocks('');
  
    rCode.UI.tabClick(rCode.UI.selected);
  
    rCode.UI.bindClick('trashButton',
      function () { rCode.UI.discard(); rCode.UI.renderContent(); });
    rCode.UI.bindClick('runButton', rCode.UI.runJS);
    // Disable the link button if page isn't backed by App Engine storage.
    var linkButton = document.getElementById('linkButton');
    if ('BlocklyStorage' in window) {
      BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
      BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
      BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
      BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
      rCode.UI.bindClick(linkButton,
        function () { BlocklyStorage.link(rCode.UI.workspace); });
    } else if (linkButton) {
      linkButton.className = 'disabled';
    }
  
    for (var i = 0; i < rCode.UI.TABS_.length; i++) {
      var name = rCode.UI.TABS_[i];
      rCode.UI.bindClick('tab_' + name,
        function (name_) { return function () { rCode.UI.tabClick(name_); }; }(name));
    }
    rCode.UI.bindClick('tab_code', function (e) {
      if (e.target !== document.getElementById('tab_code')) {
        // Prevent clicks on child codeMenu from triggering a tab click.
        return;
      }
      rCode.UI.changeCodingLanguage();
    });
  
    onresize();
    Blockly.svgResize(rCode.UI.workspace);
  
    // Lazy-load the syntax-highlighting.
    window.setTimeout(rCode.UI.importPrettify, 1);
  };
/**
 * Execute the user's code.
 * Just a quick eval. Catch infinite loops.
 * eval => Function! (0832)
 */
rCode.UI.runJS = function () {
    var code = Blockly.JavaScript.workspaceToCode(rCode.UI.workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      const execute = new Function(code);
      execute();
    } catch (e) {
      alert(MSG['badCode'].replace('%1', e));
    }
  };
  
  /**
   * Discard all blocks from the workspace.
   */
  rCode.UI.discard = function () {
    var count = rCode.UI.workspace.getAllBlocks(false).length;
    if (count < 2 ||
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
      rCode.UI.workspace.clear();
      if (window.location.hash) {
        window.location.hash = '';
      }
    }
  };