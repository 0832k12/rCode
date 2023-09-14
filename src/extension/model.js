
rCode.Extension.showExtensionModel = async function () {
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