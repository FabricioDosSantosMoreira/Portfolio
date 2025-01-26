/**
 * @fileoverview This script fetches and displays information about specific GitHub repositories.
 * @author Fabricio dos Santos Moreira <dev.fabriciodossantosmoreira@gmail.com>
 * @version 1.0.0
*/

async function fetchRepositoryData() {
    const response = await fetch('./data.json')
        .then((response) => response.json());

    console.log(response);

    return response;
}


function renderRepositoryInfo(repositoryInfo, socialPreviewURL, tag) {
    const item = document.createElement('div');
    item.classList.add('card');

    item.innerHTML = `
        <a class="" href="${repositoryInfo.url}"></a>
        <img class="card-img" src="${socialPreviewURL}" alt="Repository Preview Image"></img>
        <h3 class="card-title">${formatString(repositoryInfo.name)}</h3>
        <p class="card-description">${repositoryInfo.description || "Sem descrição"}</p>
    `;

    tag.appendChild(item);
}


async function buildCardInfo(tag) {
    const infos = await fetchRepositoryData();

    for (let info of infos) {
        console.log(info);

        // Basically means that the repository doesn't have a real social preview image 
        if (info.openGraphImageUrl.includes("https://opengraph.githubassets.com/")) {
            info.openGraphImageUrl = "./assets/img/github-logo.png"
        }

        let socialPreviewURL = info.openGraphImageUrl;
            
        renderRepositoryInfo(info, socialPreviewURL, tag);
    }

};


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
};


document.addEventListener('DOMContentLoaded', function () {
    const tag = document.getElementById('repositoryCardList');

    buildCardInfo(tag);
});
