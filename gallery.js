const galleryImages = document.querySelectorAll(".gallery-image");
[...galleryImages].forEach(img => {
    img.addEventListener("mouseover", () => {
        [...galleryImages].map(el => el.classList.remove("active"));
        img.classList.add("active");
    });
    // img.addEventListener("mouseleave", () => {
    //     img.classList.remove("active");
    // });
});

// const galleryWrapper = document.querySelector(".gallery-wrapper");
// galleryWrapper.addEventListener("mouseleave", () => {
//     document.querySelector(".gallery-image").classList.add("active");
// });