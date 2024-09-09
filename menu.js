//обробляє клік по пункту меню
//робить всі пункти не активними, а той пункт меню по якому був клік - активним
const menuItems = document.querySelectorAll(".nav-link");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        Array.from(menuItems).map((element) => element.classList.remove("active"));
        item.classList.add("active");
    });
});

const menu = document.querySelector(".navigation");
const menuButton = document.querySelector(".nav-icon");

document.addEventListener("click", (e) => {
    const checkElement = e.target;
    if (checkElement === menuButton || checkElement.parentNode === menuButton) {
        menu.classList.toggle("active");
    } else {
        menu.classList.remove("active");
    }
});


// menuButton.addEventListener("click", () => {
//     menu.classList.toggle("active");
// });