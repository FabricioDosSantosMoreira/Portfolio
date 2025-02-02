document.addEventListener("DOMContentLoaded", function () {
    // Activate a small line under the current page header item name
    // I know this is kinda messy, but works for now.
    const menuItems = document.querySelectorAll(".header__menu__item");

    let currentPage = window.location.pathname.split('/')[length - 1];
    if (currentPage === undefined) {
        currentPage = '.';
    }

    menuItems.forEach(item => {
        let itemPath = item.getAttribute("href").split('/');
        let itemLength = itemPath.length;

        if (itemPath[itemLength - 2] === currentPage) {
            item.classList.add("active");
        }
    });
});
