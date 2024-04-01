//обробляє клік по пункту меню
//робить всі пункти не активними, а той пункт меню по якому був клік - активним
const menuItems = document.querySelectorAll(".nav-link");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        Array.from(menuItems).map((element) => element.classList.remove("active"));
        item.classList.add("active");
    });
});