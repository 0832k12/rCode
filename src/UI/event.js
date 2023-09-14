
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
        rCode.Extension.loadExtension(extensionId);
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
      const handle = await showSaveFilePicker({
        suggestedName: rCode.currentLang == 'zh-hans' ? '项目' : 'Project',
        types: [{
          description: rCode.currentLang == 'zh-hans' ? 'rCode 项目' : 'rCode Project',
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
          rCode.UI.workspace.clear();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(fileContent, "application/xml");
  
          // 获取所有的 <extension> 元素
          const extensionElements = xmlDoc.querySelectorAll("extension");
  
          // 遍历每个 <extension> 元素并加载
          extensionElements.forEach(async extensionElement => {
            const extensionId = extensionElement.getAttribute("id");
            if (extensionId) {
              await rCode.Extension.loadExtension(extensionId);
            }
          });
          Blockly.Xml.domToWorkspace(xmlDom, rCode.UI.workspace);
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