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
const position = window.location.href;
var currentLang = position.slice(((position.indexOf('?lang=') + 1 + 6) - 1), position.length);
const rCode = Blockly;
let messageMappings = {};
let extensionList = [];
let BuiltinList = ['Console'];

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
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    const extensionListLoad = JSON.parse(localStorage.getItem("extensionList"));
    if (extensionListLoad.length > 0) {
      for (const extension of extensionListLoad) {
        loadExtension(extension);
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
Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'xml'];

/**
 * List of tab names with casing, for display in the UI.
 * @private
 */
Code.TABS_DISPLAY_ = [
  'Blocks', 'JavaScript', 'PHP', 'Python', 'Dart', 'Lua', 'XML',
];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
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
  const storedDarkMode = localStorage.getItem("darkModeEnabled");
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
  document.getElementById('title').textContent = MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
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
  if (localStorage.getItem("darkModeEnabled") == 'true') {
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
      localStorage.setItem("darkModeEnabled", true);
    } else {
      currentTheme = "light";
      themeIcon.src = "theme-light.svg"; // 切换为浅色主题图标
      document.body.classList.remove("dark-theme"); // 移除深色主题样式\
      Blockly.getMainWorkspace().setTheme(Blockly.Themes.LIGHT_THEME);
      localStorage.setItem("darkModeEnabled", false);
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
});


async function loadExtension(id) {
  if (!extensionList.includes(id)) {
    if (id == 'custom')/*加载自定义扩展*/ {
      const extension = await showExtensionModel();
      console.log('Loading Custom Extension:' + extension)
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
  localStorage.setItem("extensionList", JSON.stringify(extensionList))
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
    const executeExtension = new Function(extensionCode);
    BlockInfo = toolboxXml.innerHTML;
    executeExtension();
    toolboxXml.innerHTML = BlockInfo;
    Code.workspace.updateToolbox(toolboxXml);
    extensionList.push(url);
  } catch (error) {
    console.error('Error loading extension:', error);
  }
}

function loadExtensionString(string) {
  const executeExtension = new Function(string);
  BlockInfo = toolboxXml.innerHTML;
  executeExtension();
  toolboxXml.innerHTML = BlockInfo;
  Code.workspace.updateToolbox(toolboxXml);
  extensionList.push(string);
}

function loadExtensionID(id) {
  const extension = id;
  BlockInfo = toolboxXml.innerHTML;
  if (extension == 'Console')
    Console_Extension();
  toolboxXml.innerHTML = BlockInfo;
  Code.workspace.updateToolbox(toolboxXml);
}

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
}