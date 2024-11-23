document.addEventListener("DOMContentLoaded", function () {
    const images = ['./assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg'];
    let currentImageIndex = 0;
    ssasfasd

    const imgSlider = document.querySelector('.img-slider');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');

    function updateImage() {
        gsap.fromTo(imgSlider, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5 });

        imgSlider.src = images[currentImageIndex];

        dots.forEach((dot, index) => {
            if (index === currentImageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function showNextImage() {
        gsap.fromTo(imgSlider, { opacity: 1, x: 0 }, { opacity: 0, x: 50, duration: 0.5, onComplete: showNextImageComplete });
    }

    function showNextImageComplete() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    }

    function showPrevImage() {
        gsap.fromTo(imgSlider, { opacity: 1, x: 0 }, { opacity: 0, x: -50, duration: 0.5, onComplete: showPrevImageComplete });
    }

    function showPrevImageComplete() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentImageIndex = index;
            updateImage();
        });
    });

    prevArrow.addEventListener('click', showPrevImage);
    nextArrow.addEventListener('click', showNextImage);

    // Automatischer Bildwechsel alle 5 Sekunden
    const autoChangeInterval = setInterval(showNextImage, 7000);

    // Initial update
    updateImage();


    //Live-Demo

    const button = document.querySelector(".btn");
    const jfSelect = document.querySelector(".jf-selected");
    const aiSelect = document.querySelector(".align-selected");
    let runAnimation = false;

    button.addEventListener("click", () => {
        let newJustifyContent = jfSelect.innerText;
        let newAlignItems = aiSelect.innerText;
        console.log("Justify-content: " + newJustifyContent);
        console.log("align-items: " + newAlignItems);

        const tl = gsap.timeline({
            onComplete: function () {
                // Hier kommt deine onComplete-Funktion hin
                console.log("Animation abgeschlossen!");
                runAnimation = false;
                button.disabled = false;
            }
        });

        if (!runAnimation) {
            runAnimation = true;
            button.disabled = true;
            tl.to('.ergbenis', { justifyContent: newJustifyContent, alignItems: newAlignItems, duration: 1, ease: 'power2.inOut' })
                .from('.box', { x: '-=100', opacity: 0, stagger: 0.2, duration: 1, ease: 'power2.inOut' }, '-=1');
        }
    });
});


const dropdowns = document.querySelectorAll(".dropdown");

let itsActive = false;

dropdowns.forEach(dropdown => {
    let select = dropdown.querySelector(".selected");
    let menu = dropdown.querySelector(".menu");
    let options = dropdown.querySelectorAll(".menu li");
    let text = dropdown.querySelector(".choice");

    select.addEventListener("click", () => {
        if (!itsActive) {
            menu.classList.toggle("menu-open");
            itsActive = true;
        }
    });

    options.forEach(option => {
        option.addEventListener("click", function (e) {
            let choice = e.target.innerText;
            text.innerText = choice;
            select.innerText = choice;
            menu.classList.toggle("menu-open");
            itsActive = false;
        });
    });

});


// Animationen

//ScrollTriggers
gsap.to(".interessierte", {
    x: 380,
    autoAlpha: 1,
    duration: 1,
    scrollTrigger: {
        trigger: ".flexbox-container .text",
        start: "top ",
        toggleActions: "restart none none none",
        scrub: true,
    }
})

gsap.to(".einsteiger", {
    x: -380,
    autoAlpha: 1,
    opacity: 1,
    scrollTrigger: {
        trigger: ".zielgruppe h2",
        start: "top 10%",
        end: "top -380px",
        toggleActions: "restart none none none",
        scrub: true,
    },

})

gsap.to(".studenten", {
    x: 380,
    autoAlpha: 1,
    opacity: 1,
    scrollTrigger: {
        trigger: ".interessierte",
        start: "top 10%",
        end: "top -280px",
        toggleActions: "restart none none none",
        scrub: true,
    }
})

//----------Headlines

gsap.to(".interessierte-headline", {
    autoAlpha: 1,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".flexbox-container .text",
        start: "top 60%",
        toggleActions: "restart none none reset",
    }
})

gsap.to(".einsteiger-headline", {
    autoAlpha: 1,
    duration: 2,
    scrollTrigger: {
        trigger: ".zielgruppe h2",
        start: "top 40%",
        end: "top -380px",
        toggleActions: "restart none none reset",

    }
})

gsap.to(".studenten-headline", {

    autoAlpha: 1,
    duration: 2,
    scrollTrigger: {
        trigger: ".interessierte",
        start: "top 15%",
        end: "top -280px",
        toggleActions: "restart none none reset",

    }
})

gsap.to(".bullet", {
    x: 600,
    duration: 2,
    repeat: -1,
    delay: 3,
    repeatDelay: 1,
});

var tl = gsap.timeline()

tl.from(".start h1", {
    opacity: 0,
    y: -150,
    duration: 2,
    ease: "back",
    stagger: 0.15,
})

gsap.from(".ssGame", {
    opacity: 0,
    duration: 3,
    //y: -150, 
    ease: "back",
    stagger: 0.15,
    scrollTrigger: {
        trigger: ".aboutflex",
        toggleActions: "restart restart none none",
    }
});

const icons = document.querySelectorAll('.iconHam');
const navMenu = document.querySelector(".nav-menu");
const navItem = document.querySelectorAll(".nav-item");
var iconI = document.querySelector(".iconPartI");
var iconII = document.querySelector(".iconPartII");
var iconIII = document.querySelector(".iconPartIII");

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        navMenu.classList.toggle("active");
        iconI.classList.toggle("active");
        iconII.classList.toggle("active");
        iconIII.classList.toggle("active");
    });
});

navItem.forEach(n => n.addEventListener("click", () => {
    navMenu.classList.remove("active");
    iconI.classList.remove("active");
    iconII.classList.remove("active");
    iconIII.classList.remove("active");
}));

let textSelect = document.querySelector(".accordion li");

document.querySelectorAll('.accordion-open').forEach(function (item) {
    item.addEventListener('click', function () {
        this.classList.toggle('show');
        var panel = this.querySelector('.panel');
        let openSymbolOne = this.querySelector('.line-top');
        let openSymbolTwo = this.querySelector('.line-bottom');
        openSymbolOne.classList.toggle('show');
        openSymbolTwo.classList.toggle('show');
        panel.classList.toggle('show');
    });
});

let helpWindow = document.querySelector(".q-logo")
let demoContainer = document.querySelector(".demoHelp");

helpWindow.addEventListener('click', function () {
    if (!demoContainer.classList.contains('show')) {
        demoContainer.classList.toggle('show');
        setTimeout(() => {
            demoContainer.classList.toggle('show');
        }, 5 * 1000);
    }
    else {
        setTimeout(() => {
        }, 0 * 1000);
    }
})
