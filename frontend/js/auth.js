(() => {
    // ============================
    // Elementos do DOM
    // ============================
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
  
    // ============================
    // Helpers de UI / Mensagens
    // ============================
    function showMessage(text, type = 'info') {
      if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        return;
      }
  
      // Fallback visual se messageDiv não existir
      const tmp = document.createElement('div');
      tmp.textContent = text;
      tmp.className = `message ${type}`;
      tmp.style.position = 'fixed';
      tmp.style.right = '20px';
      tmp.style.top = '20px';
      tmp.style.background = '#222';
      tmp.style.color = '#fff';
      tmp.style.padding = '10px 15px';
      tmp.style.borderRadius = '8px';
      tmp.style.zIndex = 9999;
      document.body.appendChild(tmp);
      setTimeout(() => tmp.remove(), 3500);
    }
  
    function clearMessage() {
      if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }
    }
  
    function showLoginForm() {
      if (loginForm && registerForm) {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        const t = document.getElementById('auth-title');
        if (t) t.textContent = 'Login';
        clearMessage();
      }
    }
  
    function showRegisterForm() {
      if (loginForm && registerForm) {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        const t = document.getElementById('auth-title');
        if (t) t.textContent = 'Cadastro';
        clearMessage();
      }
    }
  
    // ============================
    // Ações do modal
    // ============================
    if (loginBtn && authModal) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('active');
        showLoginForm();
      });
    }
  
    if (closeAuth && authModal) {
      closeAuth.addEventListener('click', () => authModal.classList.remove('active'));
    }
  
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
      });
    }
  
    if (backToSite) backToSite.addEventListener('click', () => authModal?.classList.remove('active'));
    if (backToSiteRegister) backToSiteRegister.addEventListener('click', () => authModal?.classList.remove('active'));
    if (showRegister) showRegister.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
    if (showLogin) showLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
  
    // Fecha modal com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal?.classList.contains('active')) authModal.classList.remove('active');
    });
  
    // ============================
    // Configuração da API
    // ============================
    const API_BASE = 'http://localhost:3001'; // backend rodando localmente
  
    async function postJSON(url, body) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Resposta inválida do servidor: ${text.slice(0, 150)}`);
      }
  
      return { ok: res.ok, status: res.status, data };
    }
  
    // ============================
    // Cadastro
    // ============================
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const name = (document.getElementById('register-name')?.value || '').trim();
        const email = (document.getElementById('register-email')?.value || '').trim();
        const password = (document.getElementById('register-password')?.value || '').trim();
        const confirmPassword = (document.getElementById('register-confirm')?.value || '').trim();
  
        if (name.length < 2) return showMessage('Nome deve ter pelo menos 2 caracteres', 'error');
        if (password.length < 6) return showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
        if (password !== confirmPassword) return showMessage('As senhas não coincidem', 'error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Insira um e-mail válido', 'error');
  
        showMessage('Cadastrando...', 'info');
  
        try {
          const { ok, status, data } = await postJSON(`${API_BASE}/api/users`, { name, email, password });
          if (ok) {
            showMessage('Cadastro realizado com sucesso!', 'success');
            setTimeout(() => {
              registerForm.reset();
              showLoginForm();
              clearMessage();
            }, 1000);
          } else {
            showMessage(data.message || `Erro no cadastro (${status})`, 'error');
          }
        } catch (err) {
          console.error('Erro no cadastro:', err);
            showMessage('Erro inesperado ao cadastrar. Tente novamente.', 'error');
          showMessage('Erro ao conectar com o servidor. Tente novamente.', 'error');
        }
      });
    }
  
    // ============================
    // Login
    // ============================
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const email = ((document.getElementById('login-email') || document.getElementById('email'))?.value || '').trim();
        const password = ((document.getElementById('login-password') || document.getElementById('password'))?.value || '').trim();
  
        if (!email || !password) return showMessage('Preencha todos os campos', 'error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('E-mail inválido', 'error');
  
        showMessage('Entrando...', 'info');
  
        try {
          const payload = { email, password };
          const { ok, status, data } = await postJSON(`${API_BASE}/api/auth/login`, payload);
  
          if (ok) {
            showMessage('Login realizado com sucesso!', 'success');
  
            if (data?.token) {
    localStorage.setItem('token', data.token);
    // redirect to main page after login success
    window.location.href = 'index.html';
}
  
            setTimeout(() => {
              authModal?.classList.remove('active');
              clearMessage();
              const authEl = document.getElementById('auth') || document.getElementById('auth-modal');
                if (authEl) authEl.style.display = 'none';
                const servicesEl = document.getElementById('servicesSection') || document.getElementById('services');
                if (servicesEl) { servicesEl.style.display = 'block'; if (typeof loadServices === 'function') loadServices(); }
            }, 1000);
          } else if (status === 401) {
            showMessage('Credenciais inválidas. Verifique e tente novamente.', 'error');
          } else if (status === 400) {
            showMessage('Erro na requisição. Verifique os dados informados.', 'error');
          } else {
            showMessage(data.message || `Erro ao fazer login (${status})`, 'error');
          }
        } catch (err) {
          console.error('Erro no login:', err);
            showMessage('Erro de conexão com o servidor. Verifique se o backend está rodando.', 'error');
          showMessage('Erro de conexão com o servidor. Verifique se o backend está rodando.', 'error');
        }
      });
    }
  })();
  