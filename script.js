const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

const starSpeed = 0.05;
const speedMult = 0.25;

const colours = [
    "#2c1838",
    "#162646",
    "#1c6b6b",
    "#1f883f"
];

let particleColours = [...colours];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        xDrift: Math.random() * 4 - 2,
        driftSpeed: Math.random() * 0.1,
        depth: Math.random()
    }));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
        const size = 1.5 + star.depth * 2;
        const speed = starSpeed + star.depth * 2;

        star.y += speed * speedMult;
        star.x += star.xDrift * star.driftSpeed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
            star.depth = Math.random();
        }

        ctx.globalAlpha = 0.2 + star.depth * 0.8;

        const colourIndex = Math.floor(star.depth * particleColours.length);
        ctx.fillStyle = particleColours[
            Math.min(colourIndex, particleColours.length - 1)
        ];

        ctx.fillRect(star.x, star.y, size, size);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

const slides = document.querySelectorAll(".slide");
const nextButton = document.getElementById("next");

let current = 0;
let animating = false;

function updateSlideStyle(slide) {
    if (slide.dataset.bg) {
        document.body.style.background = slide.dataset.bg;
    }

    if (slide.dataset.particles) {
        particleColours = slide.dataset.particles.split(",").map(c => c.trim());
    }
}

nextButton.addEventListener("click", () => {
    if (animating || slides.length < 2) return;

    animating = true;

    const previous = slides[current];
    const nextIndex = (current + 1) % slides.length;
    const next = slides[nextIndex];

    next.classList.add("entering");
    next.offsetHeight;

    next.classList.add("active");
    previous.classList.remove("active");
    previous.classList.add("leaving");

    current = nextIndex;
    updateSlideStyle(next);

    setTimeout(() => {
        previous.classList.remove("active", "leaving");
        previous.classList.add("entering");
        next.classList.remove("entering");
        animating = false;
    }, 600);
});

window.addEventListener("resize", resize);

resize();

updateSlideStyle(slides[current]);

animate();