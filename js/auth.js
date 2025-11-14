const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const closeAuth = document.getElementById('close-auth');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageDiv = document.getElementById('message');
const backToSite = document.getElementById('back-to-site');
const backToSiteRegister = document.getElementById('back-to-site-register');

// Abrir modal de autenticação
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.add('active');
    showLoginForm();
});

// Fechar modal
closeAuth.addEventListener('click', () => {
    authModal.classList.remove('active');
});

// Fechar modal clicando fora
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

// Botões Voltar
backToSite.addEventListener('click', () => {
    authModal.classList.remove('active');
});

backToSiteRegister.addEventListener('click', () => {
    authModal.classList.remove('active');
});

// Alternar entre Login e Cadastro
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

function showLoginForm() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    document.getElementById('auth-title').textContent = 'Login';
    clearMessage();
}

function showRegisterForm() {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    document.getElementById('auth-title').textContent = 'Cadastro';
    clearMessage();
}


function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}


function clearMessage() {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    
    if (name.length < 2) {
        showMessage('Nome deve ter pelo menos 2 caracteres', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem', 'error');
        return;
    }
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, insira um e-mail válido', 'error');
        return;
    }
    
    
    showMessage('Cadastro realizado com sucesso!', 'success');
    
    
    setTimeout(() => {
        registerForm.reset();
        clearMessage();
        
        showLoginForm();
    }, 2000);
});

// Validação do formulário de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, insira um e-mail válido', 'error');
        return;
    }
    
    
    showMessage('Login realizado com sucesso!', 'success');
    
    
    setTimeout(() => {
        authModal.classList.remove('active');
        showMessage('Bem-vindo de volta!', 'success');
        
    }, 1500);
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        authModal.classList.remove('active');
    }
});