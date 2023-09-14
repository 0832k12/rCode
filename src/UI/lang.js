/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
rCode.UI.LANGUAGE_NAME = {
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
  rCode.UI.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];
/**
 * Initialize the page language.
 */
rCode.UI.initLanguage = function () {
    // Set the HTML's language and direction.
    var rtl = rCode.UI.isRtl();
    document.dir = rtl ? 'rtl' : 'ltr';
    document.head.parentElement.setAttribute('lang', rCode.UI.LANG);
  
    // Sort languages alphabetically.
    var languages = [];
    for (var lang in rCode.UI.LANGUAGE_NAME) {
      languages.push([rCode.UI.LANGUAGE_NAME[lang], lang]);
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
      if (lang == rCode.UI.LANG) {
        option.selected = true;
      }
      languageMenu.options.add(option);
    }
    languageMenu.addEventListener('change', rCode.UI.changeLanguage, true);
  
    // Populate the coding language selection menu.
    var codeMenu = document.getElementById('code_menu');
    codeMenu.options.length = 0;
    for (var i = 1; i < rCode.UI.TABS_.length; i++) {
      codeMenu.options.add(new Option(rCode.UI.TABS_DISPLAY_[i], rCode.UI.TABS_[i]));
    }
    codeMenu.addEventListener('change', rCode.UI.changeCodingLanguage);
  
    // Inject language strings.
    document.title += ' ' + MSG['title'];
    document.getElementById('tab_blocks').textContent = MSG['blocks'];
  
    document.getElementById('linkButton').title = MSG['linkTooltip'];
    document.getElementById('runButton').title = MSG['runTooltip'];
    document.getElementById('trashButton').title = MSG['trashTooltip'];
  };