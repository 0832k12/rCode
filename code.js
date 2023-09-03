/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};
var toolboxXml, BlockInfo;
var secLoad = false;
const position = window.location.href;
var currentLang = position.slice(((position.indexOf('?lang=') + 1 + 6) - 1), position.length);
const rCode = Blockly;
let extensionList = [];
let BuiltinList = ['Console', 'Div', 'Debug', 'PROS'];
localStorage.setItem("rC:intmain", 'true')

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'be-tarask': 'Taraškievica',
  'br': 'Brezhoneg',
  'ca': 'Català',
  'cs': 'Česky',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'et': 'Eesti',
  'fa': 'فارسی',
  'fr': 'Français',
  'he': 'עברית',
  'hrx': 'Hunsrik',
  'hu': 'Magyar',
  'ia': 'Interlingua',
  'is': 'Íslenska',
  'it': 'Italiano',
  'ja': '日本語',
  'kab': 'Kabyle',
  'ko': '한국어',
  'mk': 'Македонски',
  'ms': 'Bahasa Melayu',
  'nb': 'Norsk Bokmål',
  'nl': 'Nederlands, Vlaams',
  'oc': 'Lenga d\'òc',
  'pl': 'Polski',
  'pms': 'Piemontèis',
  'pt-br': 'Português Brasileiro',
  'ro': 'Română',
  'ru': 'Русский',
  'sc': 'Sardu',
  'sk': 'Slovenčina',
  'sr': 'Српски',
  'sv': 'Svenska',
  'ta': 'தமிழ்',
  'th': 'ภาษาไทย',
  'tlh': 'tlhIngan Hol',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh-hans': '简体中文',
  'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;
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
Code.getStringParamFromUrl = function (name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function () {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function () {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function (defaultXml) {
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
    secLoad = true;
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    if (localStorage.getItem("rC:noExtension") == 'false') {
      const extensionListLoad = JSON.parse(localStorage.getItem("rC:extensionList"));
      if (extensionListLoad.length > 0) {
        for (const extension of extensionListLoad) {
          loadExtension(extension);
        }
      }
    }
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
  if (secLoad == false) {
    localStorage.setItem('rC:noExtension', 'true')
    localStorage.setItem('rC:extensionList', '')
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function () {
  // Store the blocks for the duration of the reload.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
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
Code.changeCodingLanguage = function () {
  var codeMenu = document.getElementById('code_menu');
  Code.tabClick(codeMenu.options[codeMenu.selectedIndex].value);
}

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function (el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function () {
  var script = document.createElement('script');
  script.setAttribute('src', './prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function (element) {
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
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'cpp', 'java', 'xml'];

/**
 * List of tab names with casing, for display in the UI.
 * @private
 */
Code.TABS_DISPLAY_ = [
  'Blocks', 'JavaScript', 'PHP', 'Python', 'Dart', 'Lua', 'cpp', 'java', 'XML',
];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
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
      Code.workspace.clear();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlTextarea.value, "application/xml");

      // 获取所有的 <extension> 元素
      const extensionElements = xmlDoc.querySelectorAll("extension");

      // 遍历每个 <extension> 元素并加载
      extensionElements.forEach(extensionElement => {
        const extensionId = extensionElement.getAttribute("id");
        if (extensionId) {
          loadExtension(extensionId);
        }
      });
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }

  if (document.getElementById('tab_blocks').classList.contains('tabon')) {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    var tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  var selectedTab = document.getElementById('tab_' + clickedName);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  Code.renderContent();
  // The code menu tab is on if the blocks tab is off.
  var codeMenuTab = document.getElementById('tab_code');
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
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
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function () {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
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

    for (let i = 0; i < extensionList.length; i++) {
      const extensionElement = xmlDoc.createElement("extension");
      extensionElement.setAttribute("id", extensionList[i]);

      const rootElement = xmlDoc.documentElement;
      rootElement.appendChild(extensionElement);
    }
    xmlText = new XMLSerializer().serializeToString(xmlDoc);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    Code.attemptCodeGeneration(Blockly.JavaScript);
  } else if (content.id == 'content_python') {
    Code.attemptCodeGeneration(Blockly.Python);
  } else if (content.id == 'content_php') {
    Code.attemptCodeGeneration(Blockly.PHP);
  } else if (content.id == 'content_dart') {
    Code.attemptCodeGeneration(Blockly.Dart);
  } else if (content.id == 'content_lua') {
    Code.attemptCodeGeneration(Blockly.Lua);
  } else if (content.id == 'content_cpp') {
    Code.attemptCodeGeneration(Blockly.cpp);
  } else if (content.id == 'content_java') {
    Code.attemptCodeGeneration(Blockly.Java);
  }
  if (typeof PR == 'object') {
    PR.prettyPrint();
  }
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.attemptCodeGeneration = function (generator) {
  var content = document.getElementById('content_' + Code.selected);
  content.textContent = '';
  if (Code.checkAllGeneratorFunctionsDefined(generator)) {
    var code = generator.workspaceToCode(Code.workspace);
    content.textContent = code;
    // Remove the 'prettyprinted' class, so that Prettify will recalculate.
    content.className = content.className.replace('prettyprinted', '');
  }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function (generator) {
  var blocks = Code.workspace.getAllBlocks(false);
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
Code.init = function () {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var onresize = function (e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
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
    if (Code.workspace && Code.workspace.getToolbox().width) {
      document.getElementById('tab_blocks').style.minWidth =
        (Code.workspace.getToolbox().width - 38) + 'px';
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
  toolboxXml = Blockly.Xml.textToDom(toolboxText);


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
  Code.workspace = Blockly.inject('content_blocks',
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
      toolbox: toolboxXml,
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

  Code.loadBlocks('');

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
    function () { Code.discard(); Code.renderContent(); });
  Code.bindClick('runButton', Code.runJS);
  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
      function () { BlocklyStorage.link(Code.workspace); });
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
      function (name_) { return function () { Code.tabClick(name_); }; }(name));
  }
  Code.bindClick('tab_code', function (e) {
    if (e.target !== document.getElementById('tab_code')) {
      // Prevent clicks on child codeMenu from triggering a tab click.
      return;
    }
    Code.changeCodingLanguage();
  });

  onresize();
  Blockly.svgResize(Code.workspace);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function () {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function (a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Populate the coding language selection menu.
  var codeMenu = document.getElementById('code_menu');
  codeMenu.options.length = 0;
  for (var i = 1; i < Code.TABS_.length; i++) {
    codeMenu.options.add(new Option(Code.TABS_DISPLAY_[i], Code.TABS_[i]));
  }
  codeMenu.addEventListener('change', Code.changeCodingLanguage);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];
};

/**
 * Execute the user's code.
 * Just a quick eval. Catch infinite loops.
 * eval => Function! (0832)
 */
Code.runJS = function () {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function () {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
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
Code.discard = function () {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count < 2 ||
    window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="./msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);

document.addEventListener("DOMContentLoaded", function () {
  const themeToggleButton = document.getElementById("themeToggleButton");
  const themeIcon = document.getElementById("themeIcon");
  let currentTheme;
  if (localStorage.getItem("rC:darkModeEnabled") == 'true') {
    currentTheme = 'dark';
  } else {
    currentTheme = 'light';
  }
  themeToggleButton.addEventListener("click", function () {
    // 切换主题
    if (currentTheme === "light") {
      currentTheme = "dark";
      themeIcon.src = "theme-dark.svg"; // 切换为深色主题图标
      document.body.classList.add("dark-theme"); // 添加深色主题样式
      Blockly.getMainWorkspace().setTheme(Blockly.Themes.DARK_THEME);
      localStorage.setItem("rC:darkModeEnabled", true);
    } else {
      currentTheme = "light";
      themeIcon.src = "theme-light.svg"; // 切换为浅色主题图标
      document.body.classList.remove("dark-theme"); // 移除深色主题样式\
      Blockly.getMainWorkspace().setTheme(Blockly.Themes.LIGHT_THEME);
      localStorage.setItem("rC:darkModeEnabled", false);
    }
  });

  // 获取按钮和扩展页面元素
  const extensionButton = document.getElementById("extensionButton");
  const extensionPage = document.getElementById('extensionPage');
  const returnButton = document.getElementById("returnButton");

  // 添加按钮点击事件处理
  extensionButton.addEventListener('click', () => {
    extensionPage.style.display = 'block';
  });


  returnButton.addEventListener("click", function () {
    extensionPage.style.display = "none";
  });
  // 获取所有扩展展示栏元素
  const extensionItems = document.querySelectorAll('.extension-item');

  // 为每个扩展展示栏元素添加点击事件处理程序
  extensionItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const extensionId = item.getAttribute('id');
      extensionPage.style.display = "none";
      loadExtension(extensionId);
    });
  });
  var fileDropdown = document.getElementById("fileDropdown");
  var fileDropdownContent = document.getElementById("fileDropdownContent");
  // 点击文件按钮时显示或隐藏下拉框内容
  fileDropdown.addEventListener("click", function () {
    fileDropdownContent.classList.toggle("show");
  });

  // 点击页面其他地方时隐藏下拉框内容
  window.addEventListener("click", function (event) {
    if (!event.target.matches(".dropbtn")) {
      if (fileDropdownContent.classList.contains("show")) {
        fileDropdownContent.classList.remove("show");
      }
    }
  });

  // 处理保存文件和加载文件的点击事件
  var saveFileButton = document.getElementById("saveFile");
  var loadFileButton = document.getElementById("loadFile");

  saveFileButton.addEventListener("click", async function () {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
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

    for (let i = 0; i < extensionList.length; i++) {
      const extensionElement = xmlDoc.createElement("extension");
      extensionElement.setAttribute("id", extensionList[i]);

      const rootElement = xmlDoc.documentElement;
      rootElement.appendChild(extensionElement);
    }
    xmlText = new XMLSerializer().serializeToString(xmlDoc);
    const handle = await showSaveFilePicker({
      suggestedName: currentLang == 'zh-hans' ? '项目' : 'Project',
      types: [{
        description: currentLang == 'zh-hans' ? 'rCode 项目' : 'rCode Project',
        accept: { 'text/plain': ['.rx4', '.xml'] },
      }],
    });

    const blob = new Blob([xmlText]);

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
  });

  const fileInput = document.getElementById('fileInput');
  loadFileButton.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (fileContentEvent) => {
        const fileContent = fileContentEvent.target.result;
        var xmlDom = Blockly.Xml.textToDom(fileContent);
        Code.workspace.clear();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(fileContent, "application/xml");

        // 获取所有的 <extension> 元素
        const extensionElements = xmlDoc.querySelectorAll("extension");

        // 遍历每个 <extension> 元素并加载
        extensionElements.forEach(async extensionElement => {
          const extensionId = extensionElement.getAttribute("id");
          if (extensionId) {
            await loadExtension(extensionId);
          }
        });
        Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
      };

      reader.readAsText(selectedFile);
    }
  });
  // 获取关于页面和按钮
  const aboutPage = document.getElementById('aboutPage');
  const aboutButton = document.getElementById('aboutButton');
  const closeAboutButton = document.getElementById('closeAboutButton');

  // 显示关于页面
  aboutButton.addEventListener('click', () => {
    aboutPage.style.display = 'block';
  });

  // 隐藏关于页面
  closeAboutButton.addEventListener('click', () => {
    aboutPage.style.display = 'none';
  });
});


async function loadExtension(id) {
  if (!extensionList.includes(id)) {
    if (id == 'custom')/*加载自定义扩展*/ {
      const extension = await showExtensionModel();
      if (extension) {
        const extensionType = extension.indexOf('https://') == 1 || extension.indexOf('http://') == 1;
        switch (extensionType) {
          case false:
            loadExtensionString(extension);
            break;
          case true:
            loadExtensionURL(extension);
            break;
        }
      }
    }
    else {
      if (id.indexOf('https://') == 1 || id.indexOf('http://') == 1) {
        loadExtensionURL(id);
      }
      else if (BuiltinList.includes(id)) {
        loadExtensionID(id);
      }
      else {
        loadExtensionString(id);
      }
    }
    if (id != 'custom') {
      extensionList.push(id);
    }
  }
  localStorage.setItem("rC:extensionList", JSON.stringify(extensionList));
  localStorage.setItem('rC:noExtension', 'false')
}

async function showExtensionModel() {
  return new Promise((resolve) => {
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1001';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.addEventListener('click', () => {
      // 移除选择框的元素
      document.body.removeChild(overlay);
      document.body.removeChild(selectBox);
      resolve(false);
    });
    const isDarkModeEnabled = document.body.classList.contains("dark-theme");
    // 创建选择框容器
    const selectBox = document.createElement('div');
    selectBox.style.padding = '20px';
    selectBox.style.position = 'fixed';
    selectBox.style.top = '50%';
    selectBox.style.left = '50%';
    selectBox.style.transform = 'translate(-50%, -50%)';
    if (isDarkModeEnabled)
      selectBox.style.backgroundColor = '#23262e';
    else
      selectBox.style.backgroundColor = 'white';
    selectBox.style.zIndex = '1002';
    selectBox.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
    selectBox.style.borderRadius = '8px';
    selectBox.style.width = '400px'; // 设置固定宽度
    selectBox.style.height = '300px'; // 设置固定高度

    // 创建标签页切换按钮样式
    var tabButtonStyle;
    if (isDarkModeEnabled)
      tabButtonStyle = `
    display: inline-block;
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    outline: none;
    border-radius: 8px 8px 0 0;
  `; else
      tabButtonStyle = `
    display: inline-block;
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: #555;
    cursor: pointer;
    font-size: 16px;
    outline: none;
    border-radius: 8px 8px 0 0;
  `;

    // 创建标签页切换按钮
    const fileUploadTab = document.createElement('button');
    fileUploadTab.textContent = '从文件上传';
    fileUploadTab.style.cssText = `${tabButtonStyle} position: absolute; top: 10px; left: 25%; transform: translateX(-50%);`;

    const urlUploadTab = document.createElement('button');
    urlUploadTab.textContent = '从网址上传';
    urlUploadTab.style.cssText = `${tabButtonStyle} position: absolute; top: 10px; right: 25%; transform: translateX(50%);`;

    // 创建文件上传部分
    const fileUploadSection = document.createElement('div');
    fileUploadSection.style.display = 'none';
    fileUploadSection.style.position = 'absolute';
    fileUploadSection.style.top = '50%';
    fileUploadSection.style.left = '22%'; // 向左偏移 27%
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none'; // 隐藏默认的文件输入框
    const dragDropBox = document.createElement('div');
    dragDropBox.style.border = '2px dashed #007bff'; // 设置边框样式和颜色
    dragDropBox.style.padding = '20px';
    dragDropBox.style.textAlign = 'center';
    dragDropBox.style.width = '100%';
    dragDropBox.style.height = '100%';
    dragDropBox.style.display = 'flex';
    dragDropBox.style.justifyContent = 'center';
    dragDropBox.style.alignItems = 'center';
    dragDropBox.style.cursor = 'pointer';
    dragDropBox.style.color = '#007bff'; // 设置字体颜色为蓝色
    dragDropBox.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'; // 设置背景颜色
    dragDropBox.textContent = '点击或拖拽文件到这里'; // 更新文本提示
    fileUploadSection.appendChild(fileInput);
    fileUploadSection.appendChild(dragDropBox);


    // 创建网址上传部分
    const urlUploadSection = document.createElement('div');
    urlUploadSection.style.position = 'absolute';
    urlUploadSection.style.bottom = '20px';
    urlUploadSection.style.top = '35%'; // 向左偏移 27%
    urlUploadSection.style.left = '11%'; // 向左偏移 27%
    urlUploadSection.style.padding = '20px';
    urlUploadSection.style.borderRadius = '8px';
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = '请输入网址';
    urlInput.style.marginBottom = '10px';
    urlInput.style.padding = '8px';
    urlInput.style.border = '1px solid #ccc'; // 设置边框样式
    urlInput.style.borderRadius = '4px';
    urlInput.style.width = '100%';
    const uploadUrlButton = document.createElement('button');
    uploadUrlButton.textContent = '上传网址';
    uploadUrlButton.style.backgroundColor = '#007bff'; // 设置按钮背景颜色
    uploadUrlButton.style.color = 'white'; // 设置按钮字体颜色
    uploadUrlButton.style.border = 'none';
    uploadUrlButton.style.padding = '10px 20px';
    uploadUrlButton.style.borderRadius = '4px';
    urlUploadSection.appendChild(urlInput);
    urlUploadSection.appendChild(uploadUrlButton);

    // 将元素添加到选择框中
    selectBox.appendChild(fileUploadTab);
    selectBox.appendChild(urlUploadTab);
    selectBox.appendChild(fileUploadSection);
    selectBox.appendChild(urlUploadSection);

    // 绑定标签页切换事件
    fileUploadTab.addEventListener('click', () => {
      fileUploadSection.style.display = 'block';
      urlUploadSection.style.display = 'none';
    });
    urlUploadTab.addEventListener('click', () => {
      fileUploadSection.style.display = 'none';
      urlUploadSection.style.display = 'block';
    });

    // 绑定文件拖拽事件
    dragDropBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragDropBox.style.backgroundColor = '#f7f7f7';
    });

    dragDropBox.addEventListener('click', () => {
      fileInput.click(); // 触发文件选择对话框
    });

    dragDropBox.addEventListener('dragleave', () => {
      dragDropBox.style.backgroundColor = 'transparent';
    });

    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      let fileContent = '';
      reader.onload = (event) => {
        fileContent = event.target.result;
        document.body.removeChild(overlay);
        document.body.removeChild(selectBox);
        resolve(fileContent);
      };
      reader.readAsText(selectedFile);
    });

    dragDropBox.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      let fileContent = '';
      reader.onload = (event) => {
        fileContent = event.target.result;
        document.body.removeChild(overlay);
        document.body.removeChild(selectBox);
        resolve(fileContent);
      };

      reader.readAsText(file);
    });

    // 绑定上传按钮事件
    uploadUrlButton.addEventListener('click', () => {
      // 处理网址上传逻辑
      const url = urlInput.value;
      document.body.removeChild(overlay);
      document.body.removeChild(selectBox);
      resolve(url);
    });

    // 将覆盖层和选择框添加到文档中
    document.body.appendChild(overlay);
    document.body.appendChild(selectBox);
  });
}

async function fetchExtension(url) {
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
async function loadExtensionURL(url) {
  try {
    const extensionCode = await fetchExtension(url);

    // Using Function constructor to execute the fetched extension code
    let messageMappings;
    function formatMessage({ id }) {
      const langMappings = messageMappings[currentLang] || {};
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
    BlockInfo = toolboxXml.innerHTML;
    eval(extensionCode);
    toolboxXml.innerHTML = BlockInfo;
    Code.workspace.updateToolbox(toolboxXml);
    extensionList.push(url);
  } catch (error) {
    console.error('Error loading extension:', error);
  }
}

function loadExtensionString(string) {
  let messageMappings;
  function formatMessage({ id }) {
    const langMappings = messageMappings[currentLang] || {};
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
  BlockInfo = toolboxXml.innerHTML;
  eval(string);
  toolboxXml.innerHTML = BlockInfo;
  Code.workspace.updateToolbox(toolboxXml);
  extensionList.push(string);
}

function loadExtensionID(id) {
  const extension = id;
  BlockInfo = toolboxXml.innerHTML;
  let messageMappings;
  function formatMessage({ id }) {
    const langMappings = messageMappings[currentLang] || {};
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

    // 在 BlockInfo 中添加块和类别
    BlockInfo +=
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
    BlockInfo +=
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
  toolboxXml.innerHTML = BlockInfo;
  Code.workspace.updateToolbox(toolboxXml);
}