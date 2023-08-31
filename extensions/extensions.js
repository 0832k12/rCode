const language = getLanguageFromUrl(); // 从网址获取语言环境
const translations = getTranslationsForLanguage(language); // 根据语言环境获取翻译文本

const extensions = [
    { id: 'custom', name: translations.customName, description: translations.customDescription, image: "./extensions/custom/custom.svg" },
    { id: 'Console', name: translations.ConsoleName, description: translations.ConsoleDescription, author: translations.ConsoleAuthor, image: "./extensions/Console/Console.svg", programmingLanguages: ['JavaScript'] },
    { id: 'Div', name: translations.DivName, description: translations.DivDescription, author: translations.DivAuthor, image: "./extensions/Div/Div.svg", programmingLanguages: ['JavaScript'] },
    { id: 'Debug', name: translations.DebugName, description: translations.DebugDescription, author: translations.DebugAuthor, image: "./extensions/Debug/Debug.svg", programmingLanguages: ['JavaScript'] },
    { id: 'PROS', name: translations.PROSName, description: translations.PROSDescription, author: translations.PROSAuthor, image: "./extensions/PROS/PROS.svg", programmingLanguages: ['C++'] },
    // 添加更多展示项的数据...
];

const extensionListElement = document.getElementById('extensionList');

extensions.forEach(extension => {
    const extensionItem = document.createElement('div');
    extensionItem.classList.add('extension-item');
    extensionItem.setAttribute('id', extension.id);

    const imageElement = document.createElement('img');
    imageElement.src = extension.image;
    imageElement.alt = extension.name;

    const nameElement = document.createElement('h2');
    nameElement.textContent = extension.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = extension.description;

    const languageBarElement = document.createElement('div');
    languageBarElement.classList.add('language-bar');

    if (extension.programmingLanguages) {
        for (let j = 0; j < extension.programmingLanguages.length; j++) {
            const language = extension.programmingLanguages[j];
            languageBarElement.classList.add(language);
        }
        
    languageBarElement.textContent = `${translations.languageSupport}: ${extension.programmingLanguages.join(', ')}`;
    // 添加编程语言栏元素到扩展项
    extensionItem.appendChild(languageBarElement);
    }

    const authorElement = document.createElement('p');
    if (extension.author)
        authorElement.textContent = `${translations.authorLabel}: ${extension.author}`;

    extensionItem.appendChild(imageElement);
    extensionItem.appendChild(nameElement);
    extensionItem.appendChild(descriptionElement);
    extensionItem.appendChild(authorElement);
    extensionListElement.appendChild(extensionItem);
});

function getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en'; // 默认语言为英文
}

function getTranslationsForLanguage(language) {
    // 在此处编写不同语言环境下的翻译文本
    if (language === 'zh-hans') {
        return {
            customName: '自定义扩展',
            customDescription: '从URL上传扩展',
            customAuthor: '0832',
            ConsoleName: '控制台',
            ConsoleDescription: '控制台控制！',
            ConsoleAuthor: '0832',
            DivName: 'Div元素',
            DivDescription: '控制Div元素！',
            DivAuthor: '0832',
            DebugName: '调试执行',
            DebugDescription: '在代码中执行代码。',
            DebugAuthor: '0832',
            PROSName: 'PROS',
            PROSDescription: '用于VEX机器人编程的扩展。',
            PROSAuthor: '0832',
            authorLabel: '作者',
            languageSupport: '编译支持'
        };
    } else {
        return {
            customName: 'custom',
            customDescription: 'Load extension from URL',
            customAuthor: '0832',
            ConsoleName: 'Console',
            ConsoleDescription: 'Console controls!',
            ConsoleAuthor: '0832',
            DivName: 'Div',
            DivDescription: 'Control Divs!',
            DivAuthor: '0832',
            DebugName: 'Debug Execution',
            DebugDescription: 'Coding in code.',
            DebugAuthor: '0832',
            PROSName: 'PROS',
            PROSDescription: 'Extension for VEX coding.',
            PROSAuthor: '0832',
            authorLabel: 'Author',
            languageSupport: 'Compile support'
        };
    }
}