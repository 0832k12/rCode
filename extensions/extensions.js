const language = getLanguageFromUrl(); // 从网址获取语言环境
const translations = getTranslationsForLanguage(language); // 根据语言环境获取翻译文本

const extensions = [
    { id: 'custom',name: translations.customName, description: translations.customDescription, image: "./extensions/custom/custom.svg"},
    { id: 'Console',name: translations.ConsoleName, description: translations.ConsoleDescription, author: translations.ConsoleAuthor, image: "./extensions/Console/Console.svg" },
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

    const authorElement = document.createElement('p');
    if(extension.author)
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
            ConsoleName: 'Console',
            ConsoleDescription: '控制台控制！',
            ConsoleAuthor: '0832',
            authorLabel: '作者'
        };
    } else {
        return {
            customName: 'custom',
            customDescription: 'Load extension from URL',
            customAuthor: '0832',
            ConsoleName: 'Console',
            ConsoleDescription: 'Console controls!',
            ConsoleAuthor: '0832',
            authorLabel: 'Author'
        };
    }
}