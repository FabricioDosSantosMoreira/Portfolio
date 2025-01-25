/**
 * @fileoverview This script fetches and displays information about specific GitHub repositories.
 * @author Fabricio dos Santos Moreira <dev.fabriciodossantosmoreira@gmail.com>
 * @version 1.0.0
*/


const OWNER = 'FabricioDosSantosMoreira';
const ACCEPTED_REPOSITORIES = [
    'react-web-calculator', 
    'DIO.me', 
    'TicTacToe', 
    'SENAI-projeto-django', 
    'XPe-Python-Bootcamp',
    'PyQT5-Basic-Examples',
    'PlanetsVsGalaxiesClassifier',
    'LeetCode-Solutions',
];

async function fetchRepositoryInfo(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(
                `[fetchRepositoryInfo] - - - > Unknown Error! 
                \tStatus: ${response.status} 
                \tResponse: ${response}`
            );
            return null;
        }
        return await response.json();

    } catch (error) {
        console.log(`
            [fetchRepositoryInfo] - - - > Unknown Error!
            \tMessage: ${error.message}`
        );
        return null;
    }
}


async function fetchAndValidateRepositorySocialPreview(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(
                `[fetchAndValidateRepositorySocialPreview] - - - > Unknown Error! 
                \tStatus: ${response.status} 
                \tResponse: ${response}`
            );
            return false;
        }
        return true;
    } catch (error) {
        console.log(
            `[fetchAndValidateRepositorySocialPreview] - - - > Unknown Error! 
            \tMessage: ${error.message}`
        );
        return false;
    }
}


function renderRepositoryInfo(repositoryInfo, socialPreviewURL, tag) {
    const item = document.createElement('div');
    item.classList.add('card');

    console.log(repositoryInfo);
    item.innerHTML = `
        <a class="" href="${repositoryInfo.url}"></a>
        <img class="card-img" src="${socialPreviewURL}" alt="Repository Preview Image"></img>
        <h3 class="card-title">${formatString(repositoryInfo.name)}</h3>
        <p class="card-description">${repositoryInfo.description || "Sem descrição"}</p>
    `;

    tag.appendChild(item);
}


async function buildCardInfo(repositoryName, tag) {
    let repositoryURL = `https://api.github.com/repos/${OWNER}/${repositoryName}`;
    let socialPreviewURL = `https://raw.githubusercontent.com/${OWNER}/${repositoryName}/main/img/app.png`;

    var repositoryInfo = await fetchRepositoryInfo(repositoryURL);

    if (repositoryInfo !== null) {
        let repositoryName = repositoryInfo.name;
        let repositoryDescription = repositoryInfo.description;
        let repositoryHomepage = repositoryInfo.homepage;

        let socialPreviewExists = await fetchAndValidateRepositorySocialPreview(socialPreviewURL);
        if (!socialPreviewExists) {
            socialPreviewURL = './assets/img/github-logo.png';
        }

        renderRepositoryInfo(repositoryInfo, socialPreviewURL, tag);
    }
}


function formatString(string) {
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
}


document.addEventListener('DOMContentLoaded', function () {
    const repositoryCardList = document.getElementById('repositoryCardList');

    for (let repository of ACCEPTED_REPOSITORIES) {
        buildCardInfo(repository, repositoryCardList);
    }
});
