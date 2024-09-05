const contactForm = document.querySelector(".contact-form");
const contactButton = contactForm.querySelector("button");
const resultMessage = document.querySelector(".message");

const toggleClass = () => {
    resultMessage.classList.toggle("hidden");
    contactForm.classList.toggle("hidden");
};

(function() {
    emailjs.init({
      publicKey: "10aIANVX1fyEbSGEa",
    });
})();

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    }
    emailjs.send('service_dnjl8le', 'template_mascf4l', formData)
        .then(() => {
            console.log('SUCCESS!');
        }, (error) => {
            console.log('FAILED...', error);
        });

    toggleClass();
});

const returnButton = document.querySelector(".form-return-button");
returnButton.addEventListener("click", () => {
    toggleClass();
    contactForm.reset();
});
