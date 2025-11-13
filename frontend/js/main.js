// Carousel functionality
class ProjectsCarousel {
    constructor() {
        this.carousel = document.getElementById('projects-carousel');
        this.track = document.getElementById('carousel-track');
        this.slides = Array.from(this.track.children);
        this.prevButton = document.getElementById('carousel-prev');
        this.nextButton = document.getElementById('carousel-next');
        this.dotsContainer = document.getElementById('carousel-dots');
        
        this.currentIndex = 0;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.addEventListeners();
        this.updateCarousel();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    addEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        
        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        this.track.addEventListener('touchstart', this.dragStart.bind(this));
        
        this.track.addEventListener('mousemove', this.drag.bind(this));
        this.track.addEventListener('touchmove', this.drag.bind(this));
        
        this.track.addEventListener('mouseup', this.dragEnd.bind(this));
        this.track.addEventListener('touchend', this.dragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.dragEnd.bind(this));
        
        this.track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
    
    dragStart(e) {
        if (e.type === 'touchstart') {
            this.startPos = e.touches[0].clientX;
        } else {
            this.startPos = e.clientX;
            e.preventDefault();
        }
        
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.track.style.transition = 'none';
        
        this.animationID = requestAnimationFrame(this.animation.bind(this));
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }
        
        const currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        this.currentTranslate = currentTranslate;
    }
    
    dragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        cancelAnimationFrame(this.animationID);
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        if (movedBy < -100 && this.currentIndex < this.slides.length - 1) {
            this.nextSlide();
        } else if (movedBy > 100 && this.currentIndex > 0) {
            this.prevSlide();
        } else {
            this.updateCarousel();
        }
    }
    
    animation() {
        this.setSliderPosition();
        if (this.isDragging) {
            requestAnimationFrame(this.animation.bind(this));
        }
    }
    
    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    nextSlide() {
        if (this.currentIndex >= this.slides.length - 1) return;
        this.currentIndex++;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.currentIndex <= 0) return;
        this.currentIndex--;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        this.currentTranslate = -this.currentIndex * this.track.offsetWidth;
        this.prevTranslate = this.currentTranslate;
        this.track.style.transition = 'transform 0.5s ease-in-out';
        this.setSliderPosition();
        
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        this.prevButton.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextButton.style.opacity = this.currentIndex === this.slides.length - 1 ? '0.5' : '1';
    }
}

// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    new ProjectsCarousel();
    
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Smooth scroll para links internos (corrigido)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
      
          // Evita erro se o href for apenas "#"
          if (href === '#') return;
      
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

    // contatos
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }

    // Botões de serviço
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.closest('.service-card').getAttribute('data-service');
            alert(`Serviço solicitado: ${service}. Em breve entraremos em contato!`);
        });
    });

    // Botões de projeto
    document.querySelectorAll('.project-btn').forEach(button => {
        button.addEventListener('click', function() {
            const project = this.closest('.project-card').querySelector('h3').textContent;
            alert(`Detalhes do projeto: ${project}. Em breve mais informações!`);
        });
    });
});
