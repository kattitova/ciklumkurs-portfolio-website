let options = {
    rootMargin: "300px",
    threshold: 0
};

const callback = (entries, observer) => {
    console.log(entries);
    entries.forEach(item => {
        if (item.isIntersecting) {
            item.target.classList.add("active");
        }
    })
}

let observer = new IntersectionObserver(callback, options);

let elements = document.querySelectorAll(".animation-block");

elements.forEach(item => {
    observer.observe(item);
})