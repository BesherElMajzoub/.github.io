const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach((section) => {
  section.classList.add('fade-in');
  observer.observe(section);
});

const sliderTrack = document.getElementById('sliderTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentIndex = 0;
let autoPlayTimer;

const slides = sliderTrack ? Array.from(sliderTrack.children) : [];

const createDots = () => {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `انتقال إلى الشريحة ${index + 1}`);
    dot.addEventListener('click', () => moveToSlide(index));
    dotsContainer.appendChild(dot);
  });
};

const updateDots = () => {
  if (!dotsContainer) return;
  Array.from(dotsContainer.children).forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
};

const moveToSlide = (index) => {
  if (!sliderTrack) return;
  currentIndex = (index + slides.length) % slides.length;
  sliderTrack.style.transform = `translateX(${currentIndex * -100}%)`;
  updateDots();
  resetAutoplay();
};

const nextSlide = () => moveToSlide(currentIndex + 1);
const prevSlide = () => moveToSlide(currentIndex - 1);

const resetAutoplay = () => {
  if (!autoPlayTimer) return;
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(nextSlide, 3500);
};

if (slides.length) {
  createDots();
  updateDots();
  autoPlayTimer = setInterval(nextSlide, 3500);
}

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

let startX = 0;
let isDragging = false;

if (sliderTrack) {
  sliderTrack.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    isDragging = true;
  });

  sliderTrack.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const deltaX = event.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 60) {
      deltaX > 0 ? prevSlide() : nextSlide();
      isDragging = false;
    }
  });

  sliderTrack.addEventListener('touchend', () => {
    isDragging = false;
  });
}
