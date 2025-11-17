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

// Gallery functionality for project details
class ProjectGallery {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.interval = null;
        this.init();
    }
    
    init() {
        this.createGalleryModal();
        this.addEventListeners();
    }
    
    createGalleryModal() {
        const modalHTML = `
            <div id="project-gallery-modal" class="project-gallery-modal">
                <div class="gallery-container">
                    <button class="gallery-close-btn" id="gallery-close">
                        <i class='bx bx-x'></i>
                    </button>
                    <div class="project-gallery">
                        <div class="gallery-slides" id="gallery-slides"></div>
                        <div class="gallery-nav">
                            <button class="gallery-prev" id="gallery-prev">
                                <i class='bx bx-chevron-left'></i>
                            </button>
                            <button class="gallery-next" id="gallery-next">
                                <i class='bx bx-chevron-right'></i>
                            </button>
                        </div>
                        <div class="gallery-dots" id="gallery-dots"></div>
                    </div>
                    <div class="project-info">
                        <h3 id="project-title">Título do Projeto</h3>
                        <p id="project-description">Descrição do projeto</p>
                        <div class="project-specs">
                            <div class="spec-item">
                                <i class='bx bx-calendar'></i>
                                <span>Duração: <strong id="project-duration">12 meses</strong></span>
                            </div>
                            <div class="spec-item">
                                <i class='bx bx-building'></i>
                                <span>Área: <strong id="project-area">2.500m²</strong></span>
                            </div>
                            <div class="spec-item">
                                <i class='bx bx-group'></i>
                                <span>Equipe: <strong id="project-team">50 profissionais</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    addEventListeners() {
        document.getElementById('gallery-close').addEventListener('click', () => this.closeGallery());
        document.getElementById('gallery-prev').addEventListener('click', () => this.prevSlide());
        document.getElementById('gallery-next').addEventListener('click', () => this.nextSlide());
        
        document.getElementById('project-gallery-modal').addEventListener('click', (e) => {
            if (e.target.id === 'project-gallery-modal') this.closeGallery();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('project-gallery-modal').classList.contains('active')) {
                this.closeGallery();
            }
        });
    }
    
    openGallery(projectData) {
        this.currentSlide = 0;
        this.slides = projectData.images;
        this.loadGallery();
        this.updateProjectInfo(projectData);
        document.getElementById('project-gallery-modal').classList.add('active');
        this.startAutoSlide();
    }
    
    closeGallery() {
        document.getElementById('project-gallery-modal').classList.remove('active');
        this.stopAutoSlide();
    }
    
    loadGallery() {
        const slidesContainer = document.getElementById('gallery-slides');
        const dotsContainer = document.getElementById('gallery-dots');
        
        slidesContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        this.slides.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${image}')`;
            slidesContainer.appendChild(slide);
            
            const dot = document.createElement('button');
            dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    updateProjectInfo(projectData) {
        document.getElementById('project-title').textContent = projectData.title;
        document.getElementById('project-description').textContent = projectData.description;
        document.getElementById('project-duration').textContent = projectData.duration;
        document.getElementById('project-area').textContent = projectData.area;
        document.getElementById('project-team').textContent = projectData.team;
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
    }
    
    updateSlides() {
        const slides = document.querySelectorAll('.gallery-slide');
        const dots = document.querySelectorAll('.gallery-dot');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Dados dos projetos com as imagens
const projectsData = {
    'condominios': {
        title: 'Condomínio Vista Serrana',
        description: 'Residencial de alto padrão com vista panorâmica e infraestrutura completa. Localizado em área privilegiada, oferece lazer completo e segurança 24 horas.',
        duration: '18 meses',
        area: '15.000m²',
        team: '120 profissionais',
        images: [
            'imagens/condominios.jpg',
            'imagens/condominio01.jpeg',
            'imagens/condominio02.jpeg',
            'imagens/condominios03.jpeg'
        ]
    },
    'torres': {
        title: 'Edifício Corporate Center',
        description: 'Torre comercial de 16 andares com tecnologia de ponta e design arrojado. Espaços modernos e eficientes para empresas de alto padrão.',
        duration: '24 meses',
        area: '25.000m²',
        team: '200 profissionais',
        images: [
            'imagens/torres.jpg',
            'imagens/salatorre01.jpeg',
            'imagens/salatorre02.jpeg',
            'imagens/salatorre03.jpeg'
        ]
    },
    'shopping': {
        title: 'Reforma Shopping Norte',
        description: 'Modernização completa do shopping, incluindo fachada e áreas comuns. Projeto focado em acessibilidade e experiência do consumidor.',
        duration: '8 meses',
        area: '40.000m²',
        team: '150 profissionais',
        images: [
            'imagens/shopping.jpg',
            'imagens/dentroshoping01.jpeg',
            'imagens/dentroshoping02.jpeg',
            'imagens/dentroshoping03.jpeg'
        ]
    },
    'boate': {
        title: 'LCI MANSION',
        description: 'Uma sofisticada casa noturna que combina elegância e diversão em um ambiente moderno, luxuoso e prazeroso. Acústica perfeita e iluminação de última geração.',
        duration: '6 meses',
        area: '1.200m²',
        team: '80 profissionais',
        images: [
            'imagens/boate.png',
            'imagens/dentroboate01.jpeg',
            'imagens/dentroboate02.jpeg',
            'imagens/dentroboate03.png'
        ]
    }
};

// Função para detectar qual projeto foi clicado
function getProjectKey(projectTitle) {
    if (projectTitle.includes('Condomínio')) return 'condominios';
    if (projectTitle.includes('Edifício')) return 'torres';
    if (projectTitle.includes('Shopping')) return 'shopping';
    if (projectTitle.includes('LCI MANSION')) return 'boate';
    return '';
}

// Menu Mobile e inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carousel de projetos
    new ProjectsCarousel();
    
    // Inicializar galeria de detalhes
    const gallery = new ProjectGallery();
    
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
      
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

    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }

    // Botões de serviço - Scroll para contato + popup
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const service = this.closest('.service-card').getAttribute('data-service');
            const serviceName = this.closest('.service-card').querySelector('h3').textContent;
            
            // Scroll suave para a seção de contato
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Mostrar popup de confirmação
                showServicePopup(serviceName);
            }
        });
    });

    // Botões de projeto - Galeria de detalhes
    document.querySelectorAll('.project-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            
            const projectKey = getProjectKey(projectTitle);
            
            if (projectsData[projectKey]) {
                gallery.openGallery(projectsData[projectKey]);
            }
        });
    });
});

// Função para mostrar popup de serviço
function showServicePopup(serviceName) {
    // Criar elemento do popup
    const popup = document.createElement('div');
    popup.className = 'service-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class='bx bx-check-circle'></i>
            <span>Serviço solicitado: <strong>${serviceName}</strong>. Em breve entraremos em contato!</span>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(popup);
    
    // Mostrar popup com animação
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    
    // Remover popup após 5 segundos
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }, 5000);
}