/**
 * @fileoverview AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 * @author Fabricio dos Santos Moreira <dev.fabriciodossantosmoreira@gmail.com>
 * @version 1.0.0
*/

// Global Variables
let colorInfo;  // { 'languageName': { 'color', 'url' } }
let repoInfo;   // [ {'name', 'description', 'url', 'openGraphImageUrl', 'stargazers': { 'totalCount' }, 'forks': { 'totalCount' }, 'watchers': { 'totalCount' }, 'languages': { 'edges': [ {'node': {'name'}, 'size'} ] } } ]


document.addEventListener('DOMContentLoaded', async function () {
    colorInfo = await fetchDataOrFallbackData(
        '../../data/github_color_data.json',
        '../../data/backup/github_color_data.json'
    );
    repoInfo = await fetchDataOrFallbackData(
        '../../data/repo_data.json',
        '../../data/backup/repo_data.json'
    );

    let currentPage = window.location.pathname.split('/')[2];
    if (currentPage === 'projects') {
        const tag = document.getElementById('gallery');
        buildRepoInfoAndRender(tag);
    }

    }
);


async function fetchDataOrFallbackData(path, fallbackPath) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to Load '${path}'`);
        return await response.json();

    } catch (error) {
        console.warn(`${error.message}. Trying to Load Fallback Data...`);
        
        // Fallback path must always contain a valid data file
        const fallbackResponse = await fetch(fallbackPath);
        return await fallbackResponse.json();
    }
}


async function buildRepoInfoAndRender(tag) {
 
    for (let info of repoInfo) {

        // Basically means that the repository doesn't have a custom social preview image, so set the default image
        if (info.openGraphImageUrl.includes('https://opengraph.githubassets.com/')) {
            info.openGraphImageUrl = '../../assets/utils/img/github-logo.png';
        }

        info.mostUsedLanguageName = getMostUsedLanguageName(info.languages);
        info.mostUsedLanguageColor = getLanguageColor(info.mostUsedLanguageName);

        renderRepositoryInfo(tag, info);
    }
};


function renderRepositoryInfo(tag, repositoryInfo) {

    // Build a Container Div
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('gallery__container__projects__container');


    // Build the Language Colors Div with Styles
    const colorsDiv = buildColorDiv(repositoryInfo.languages);


    // Build the Card Div with Styles
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    
    const statsDiv = buildRepoExtraInfoDiv(
        repositoryInfo.stargazers.totalCount, 
        repositoryInfo.forks.totalCount, 
        repositoryInfo.watchers.totalCount,
        repositoryInfo.mostUsedLanguageName,
        repositoryInfo.mostUsedLanguageColor,
    );

    let homepageUrlTag = document.createElement('a');
    homepageUrlTag.style.width = "0";

    if (repositoryInfo.homepageUrl != "") {
        homepageUrlTag.classList.add('card__title__container__homepage');

        homepageUrlTag.href = repositoryInfo.homepageUrl;
        homepageUrlTag.target = "_blank";
        homepageUrlTag.style.width = "12.5%";

        homepageUrlTag.innerHTML = `
            <img class="card--icons" src="../../assets/utils/icons/external_link_2.png" alt="HomePage Link Icon">
        `;
    }


    cardDiv.innerHTML = `
        <img class="card__image" src="${repositoryInfo.openGraphImageUrl}" alt="Repository Preview Image"></img>
        ${colorsDiv.outerHTML}

        <div class="card__title__container">
            <a class="card__title__container__info" href="${repositoryInfo.url}" target="_blank">
                <img src="../../assets/utils/icons/external_link_1.png" alt="GitHub Link Icon">
                <span>${formatRepoName(repositoryInfo.name)}</span>
            </a>
            ${homepageUrlTag.outerHTML}
        </div>

        <div class="card__description">
            <p>${repositoryInfo.description || "Sem descrição"}</p>
        </div>
       
        <a href="${repositoryInfo.url}"></a>
        ${statsDiv.outerHTML}
    `;


    // Build the Left and Right Borders Div with Styles
    const [leftBorderDiv, rightBorderDiv] = buildBorderDiv(repositoryInfo.languages);



    // Append all the Divs to the Container Div
    containerDiv.appendChild(leftBorderDiv);
    containerDiv.appendChild(rightBorderDiv);
    containerDiv.appendChild(cardDiv);
    
    // Append the Container Div to the Tag
    tag.appendChild(containerDiv);
}


function buildBorderDiv(languages) { 
    let LanguagesNameAndPercentage = getUsedLanguagesNameAndPercentage(languages);

    // Build the Left and Right Borders Div with Styles Based on the Languages Used
    const leftBorderDiv = document.createElement('div');
    const rightBorderDiv = document.createElement('div');

    leftBorderDiv.classList.add('gallery__container__projects__container__bottom__left__border');
    rightBorderDiv.classList.add('gallery__container__projects__container__top__right__border');
    
    var colorsList = [];
    for (let languageName in LanguagesNameAndPercentage) {
        let languageColor = getLanguageColor(languageName);
        
        colorsList.push(languageColor);
    }

    leftBorderDiv.style.borderImageSource = `
        conic-gradient(from var(--angle), transparent 50%, ${colorsList.join(', ')})
    `;
    rightBorderDiv.style.borderImageSource = `
        conic-gradient(from var(--angle), transparent 50%, ${colorsList.join(', ')})
    `;
    
    return [leftBorderDiv, rightBorderDiv];
}


function buildRepoExtraInfoDiv(stargazers, forksCount, watchers, languageName, languageColor) {

    // Build the Stats Div with Styles
    const statsDiv = document.createElement('div');
    statsDiv.classList.add('gallery__container__projects__card__info');

    statsDiv.innerHTML = `
        <div class="gallery__container__projects__card__info__language">
            <span class="colored-dot" style="background-color: ${languageColor}"></span>
            <span class="gallery__container__projects__card__info__language__span">${languageName}</span>
        </div>

        <div class="gallery__container__projects__card__info__stats">
        <div class="gallery__container__projects__card__info__stats__item item--star">
            <img class="gallery__container__projects__card__info__stats__item__icon" src="../../assets/utils//icons/star.png" alt="Stars Icon">
            <span class="gallery__container__projects__card__info__stats__item__span">${stargazers}</span>
        </div>
        <div class="gallery__container__projects__card__info__stats__item item--eye">
            <img class="gallery__container__projects__card__info__stats__item__icon" src="../../assets/utils//icons/eye.png" alt="Watchers Icon">
            <span class="gallery__container__projects__card__info__stats__item__span">${watchers}</span>
        </div>
        <div class="gallery__container__projects__card__info__stats__item item--fork">
            <img class="gallery__container__projects__card__info__stats__item__icon" src="../../assets/utils//icons/fork.png" alt="Forks Icon">
            <span class="gallery__container__projects__card__info__stats__item__span">${forksCount}</span>
        </div>
        </div>
    `;

    return statsDiv;
}

function buildColorDiv(languages) {
    let LanguagesNameAndPercentage = getUsedLanguagesNameAndPercentage(languages);

    // Build the Language Colors Div with Styles
    const colorDiv = document.createElement('div');
    colorDiv.classList.add('gallery__container__projects__card__colored__div');

    for (let languageName in LanguagesNameAndPercentage) {
        let languageColor = getLanguageColor(languageName);

        const segment = document.createElement('div');
        segment.style.width = `${LanguagesNameAndPercentage[languageName]}%`;
        segment.style.backgroundColor = languageColor;

        colorDiv.appendChild(segment);
    }

    return colorDiv;
}


function getLanguageColor(languageName) {

    // Fix: Set a default color when 'languageName' is 'Undefined'
    if (languageName === 'Undefined') {
        return '#4D4D4D'
    }

    return colorInfo[languageName]['color'];
}


function getMostUsedLanguageName(languages) {
    let mostUsedLanguageName = '';

    let size = 0;
    for (let index in languages['edges']) {
        if (languages['edges'][index]['size'] > size) {
            size = languages['edges'][index]['size'];
            mostUsedLanguageName = languages['edges'][index]['node']['name'];     
        }
    }

    // Fix: When a repository doesn't have a language. So we set to 'Undefined'
    if (mostUsedLanguageName == '') {
        mostUsedLanguageName = 'Undefined'
    }


    return mostUsedLanguageName;
}


function getUsedLanguagesNameAndPercentage(languages) {
    let totalSize = 0;

    // Sum all the sizes in 'languages'
    for (let index in languages['edges']) {
        totalSize += languages['edges'][index]['size'];
    }

    // Fix: When a repository doesn't have a language. So we set to 'Undefined'
    if (totalSize == 0) {
        return { 'Undefined': 100 };
    }

    let languagesArray = [];
    for (let index in languages['edges']) {
        let languageName = languages['edges'][index]['node']['name'];
        let languageSize = languages['edges'][index]['size'];

        let percentage = (languageSize / totalSize) * 100;
        languagesArray.push({ name: languageName, percentage: parseFloat(percentage.toFixed(2)) });
    }

    // Sort by percentage in descending order
    languagesArray.sort((a, b) => b.percentage - a.percentage);

    // Convert back to an object
    let LanguagesNameAndPercentage = {};
    languagesArray.forEach(lang => {
        LanguagesNameAndPercentage[lang.name] = lang.percentage;
    });

    return LanguagesNameAndPercentage;
}


function formatRepoName(string) {
    let splittedString = string.split('-');
    let newString = '';

    for (let i = 0; i < splittedString.length; i++) {
        splittedString[i] = splittedString[i][0].toUpperCase() + splittedString[i].slice(1);

        newString += splittedString[i];
        if (i < splittedString.length - 1) {
            newString += ' ';
        }
    }

    return newString;
};
