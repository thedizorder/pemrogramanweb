const STORAGE_KEY = 'schoolAppState_v1';
const ADMIN_SESSION_KEY = 'schoolAdminSession_v1';
const REMEMBERED_LOGIN_KEY = 'schoolRememberedLogin_v1';

const defaultState = {
  users: [
    { name: 'Rina Wijaya', role: 'Admin', email: 'rina@schoolofpeople.com', password: 'admin123', status: 'Aktif', lastActive: '2 menit lalu' },
    { name: 'Ahmad Farisi', role: 'Guru', email: 'ahmad.farisi@schoolofpeople.com', password: 'guru123', status: 'Online', lastActive: '12 menit lalu' },
    { name: 'Nurul Anisa', role: 'Siswa', email: 'nurul.a@schoolofpeople.com', password: 'siswa123', status: 'Review', lastActive: '1 jam lalu' },
    { name: 'Yoga Pratama', role: 'Orang tua', email: 'yoga.pratama@yahoo.com', password: 'ortu123', status: 'Aktif', lastActive: '3 jam lalu' }
  ],
  articles: [
    { id: 'art-1', title: 'Siswa SMA Raih Medali Emas OSN', category: 'Prestasi', author: 'Rina Wijaya', status: 'Published', date: '2024-10-24', excerpt: 'Siswa SMA meraih medali emas dalam ajang Olimpiade Sains Nasional.' },
    { id: 'art-2', title: 'Pelatihan Literasi Digital Guru', category: 'Akademik', author: 'Ahmad Farisi', status: 'Draft', date: '2024-10-22', excerpt: 'Pelatihan literasi digital untuk guru dan staf sekolah.' },
    { id: 'art-3', title: 'Jadwal Pendaftaran PPDB Gelombang 2', category: 'Informasi', author: 'Admin', status: 'Aktif', date: '2024-10-18', excerpt: 'Informasi resmi jadwal PPDB gelombang 2 untuk calon siswa baru.' }
  ],
  settings: {
    email: true,
    twoFactor: true,
    autoPublish: false,
    maintenance: false
  }
};

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : defaultState.users,
      articles: Array.isArray(parsed.articles) ? parsed.articles : defaultState.articles,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    return defaultState;
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session && session.name && session.email ? session : null;
  } catch (error) {
    return null;
  }
}

function setAdminSession(session) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function getUserByCredentials(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();
  const state = getState();

  return state.users.find((user) => {
    const matchEmail = (user.email || '').trim().toLowerCase() === normalizedEmail;
    const matchPassword = String(user.password || '') === normalizedPassword;
    return matchEmail && matchPassword;
  }) || null;
}

function renderTopbarUserChip(session = getAdminSession()) {
  const chip = document.getElementById('topbar-user-chip');
  if (!chip) return;

  const validSession = session && session.name && session.email ? session : null;
  const isLoggedIn = Boolean(validSession);

  chip.classList.toggle('hidden', !isLoggedIn);
  chip.setAttribute('aria-hidden', String(!isLoggedIn));

  if (!isLoggedIn) {
    chip.querySelector('.avatar') && (chip.querySelector('.avatar').textContent = 'AM');
    chip.querySelector('strong') && (chip.querySelector('strong').textContent = 'Admin');
    chip.querySelector('small') && (chip.querySelector('small').textContent = 'Super Admin');
    return;
  }

  const avatar = chip.querySelector('.avatar');
  const userName = chip.querySelector('strong');
  const userRole = chip.querySelector('small');

  if (avatar) {
    const initials = (validSession.name || 'AM').split(' ').slice(0, 2).map((part) => part[0]).join('').substring(0, 2).toUpperCase() || 'AM';
    avatar.textContent = initials;
  }

  if (userName) userName.textContent = validSession.name || 'Admin';
  if (userRole) userRole.textContent = validSession.role || 'Super Admin';
}

function renderSidebarAuthState() {
  const userState = document.getElementById('sidebar-auth-user');
  const loginTrigger = document.getElementById('login-menu-trigger');
  const loginLabel = document.getElementById('login-menu-label');
  if (!userState || !loginTrigger || !loginLabel) return;

  const session = getAdminSession();
  const isLoggedIn = Boolean(session);
  userState.classList.toggle('hidden', !isLoggedIn);
  loginLabel.textContent = isLoggedIn ? (session?.name || 'Admin') : 'Login';

  if (session && userState) {
    const avatar = userState.querySelector('.avatar');
    const userName = userState.querySelector('strong');
    const userRole = userState.querySelector('small');
    if (avatar) avatar.textContent = (session.name || 'AM').split(' ').slice(0, 2).map((part) => part[0]).join('').substring(0, 2).toUpperCase() || 'AM';
    if (userName) userName.textContent = session.name || 'Admin';
    if (userRole) userRole.textContent = session.role || 'Super Admin';
  }

  renderTopbarUserChip(session);
}

function createLoginModal() {
  if (document.getElementById('login-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'login-modal';
  modal.className = 'login-modal-backdrop hidden';
  modal.innerHTML = `
    <div class="login-modal-card" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div class="login-modal-header">
        <h3 id="login-modal-title">Masuk Admin</h3>
        <button type="button" class="login-close" aria-label="Tutup login">✕</button>
      </div>

      <form class="login-modal-form" id="login-modal-form">
        <label class="field">
          <span>Email atau username</span>
          <input id="modal-login-email" type="email" placeholder="admin@schoolofpeople.com" required />
        </label>

        <label class="field">
          <span>Password</span>
          <input id="modal-login-password" type="password" placeholder="••••••••" required />
        </label>

        <div class="login-modal-footer">
          <label class="checkbox-inline">
            <input type="checkbox" checked />
            <span>Ingat saya</span>
          </label>
          <a href="#">Lupa password?</a>
        </div>

        <button class="btn btn-primary full" type="submit">Masuk</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.login-close');
  closeButton.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });

  modal.querySelector('#login-modal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('modal-login-email').value.trim();
    const password = document.getElementById('modal-login-password').value.trim();

    if (!email || !password) {
      showToast('Email dan password wajib diisi.', 'error');
      return;
    }

    const matchedUser = getUserByCredentials(email, password);
    if (!matchedUser) {
      showToast('Email atau password salah. Coba akun lain.', 'error');
      return;
    }

    setAdminSession({
      name: matchedUser.name,
      role: matchedUser.role,
      email: matchedUser.email,
      avatar: matchedUser.name.split(' ').slice(0, 2).map((part) => part[0]).join('').substring(0, 2).toUpperCase() || 'AM'
    });

    modal.classList.add('hidden');
    renderSidebarAuthState();
    showToast(`Login berhasil. Selamat datang, ${matchedUser.name.split(' ')[0]}.`, 'success');
    document.getElementById('modal-login-password').value = '';
  });
}

function handleSidebarLogin() {
  const loginTrigger = document.getElementById('login-menu-trigger');
  if (!loginTrigger) return;

  loginTrigger.addEventListener('click', (event) => {
    const session = getAdminSession();
    if (session) {
      clearAdminSession();
      renderSidebarAuthState();
    }

    event.preventDefault();
    window.location.assign('login.html');
  });
}

function bindSidebarLogout() {
  const logoutButton = document.getElementById('sidebar-logout-btn');
  const adminLogoButton = document.querySelector('.admin-brand-button');

  const performLogout = () => {
    clearAdminSession();
    renderSidebarAuthState();
    showToast('Berhasil logout.', 'success');
    window.location.href = 'login.html';
  };

  if (logoutButton) logoutButton.addEventListener('click', performLogout);
  if (adminLogoButton) adminLogoButton.addEventListener('click', performLogout);
}

function initDashboardIdentity() {
  const session = getAdminSession();
  const pageTitle = document.querySelector('.page-title');
  const greeting = document.querySelector('.topbar-left .eyebrow');
  const brandButton = document.querySelector('.admin-brand-button');

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  const hour = new Date().getHours();
  const greetingText = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : 'Selamat sore';
  const firstName = (session.name || 'Admin').split(' ')[0];

  if (greeting) {
    greeting.textContent = `${greetingText}, ${firstName}`;
  }

  if (pageTitle) {
    pageTitle.textContent = session.role === 'Admin' ? 'Overview Dashboard' : `${session.role} Dashboard`;
  }

  if (brandButton) {
    const brandName = brandButton.querySelector('h2');
    if (brandName) {
      brandName.textContent = `${firstName} Workspace`;
    }
  }
}

function createToastContainer() {
  if (document.querySelector('.toast-container')) return;
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
}

function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function getStatusClass(status) {
  if (status === 'Aktif' || status === 'Published' || status === 'On Track') return 'success';
  if (status === 'Online' || status === 'Siap' || status === 'Tersedia') return 'primary';
  if (status === 'Review' || status === 'Draft' || status === 'Warning') return 'warning';
  return 'primary';
}

function renderUserTable() {
  const tableBody = document.querySelector('#user-table-body');
  const searchInput = document.querySelector('#user-search');

  if (!tableBody) return;

  const activeRole = document.querySelector('.tab-chip.active')?.textContent.trim().toLowerCase() || 'semua';
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const state = getState();

  const filteredUsers = state.users.filter((user) => {
    const matchesRole = activeRole === 'semua' || user.role.toLowerCase() === activeRole;
    const matchesText = !query || `${user.name} ${user.role} ${user.email}`.toLowerCase().includes(query);
    return matchesRole && matchesText;
  });

  tableBody.innerHTML = filteredUsers.map((user) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>${user.email}</td>
      <td><span class="badge ${getStatusClass(user.status)}">${user.status}</span></td>
      <td>${user.lastActive}</td>
    </tr>
  `).join('');

  if (!filteredUsers.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--muted); padding: 20px;">Tidak ada data yang cocok.</td>
      </tr>
    `;
  }
}

function renderContentManager() {
  const section = document.querySelector('[data-section="content"]');
  if (!section || section.querySelector('#content-crud-root')) return;

  const state = getState();
  const root = document.createElement('div');
  root.id = 'content-crud-root';
  root.className = 'content-crud';
  root.innerHTML = `
    <div class="panel-card wide-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Manajemen konten</p>
          <h2>Artikel & Berita</h2>
        </div>
        <button type="button" class="btn btn-primary" id="open-content-form">+ Tambah artikel</button>
      </div>
      <div class="content-crud-grid">
        <div class="panel-card form-panel">
          <h3>Form artikel</h3>
          <form id="content-crud-form" class="crud-form">
            <input type="hidden" id="article-id" />
            <div class="field">
              <label for="article-title">Judul</label>
              <input id="article-title" type="text" placeholder="Masukkan judul artikel" required />
            </div>
            <div class="field">
              <label for="article-category">Kategori</label>
              <select id="article-category">
                <option>Prestasi</option>
                <option>Akademik</option>
                <option>Informasi</option>
                <option>Berita</option>
              </select>
            </div>
            <div class="field">
              <label for="article-author">Penulis</label>
              <input id="article-author" type="text" placeholder="Nama penulis" required />
            </div>
            <div class="field">
              <label for="article-status">Status</label>
              <select id="article-status">
                <option>Published</option>
                <option>Draft</option>
                <option>Aktif</option>
              </select>
            </div>
            <div class="field">
              <label for="article-date">Tanggal</label>
              <input id="article-date" type="date" required />
            </div>
            <div class="field">
              <label for="article-excerpt">Ringkasan</label>
              <textarea id="article-excerpt" rows="4" placeholder="Tulis ringkasan singkat..." required></textarea>
            </div>
            <div class="crud-actions">
              <button type="submit" class="btn btn-primary">Simpan</button>
              <button type="button" class="ghost-btn" id="reset-content-form">Batal</button>
            </div>
          </form>
        </div>
        <div class="panel-card table-panel">
          <h3>Daftar artikel</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="content-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  section.appendChild(root);
  renderContentTable();

  const form = document.getElementById('content-crud-form');
  const trigger = document.getElementById('open-content-form');
  const reset = document.getElementById('reset-content-form');

  trigger?.addEventListener('click', () => {
    form.reset();
    document.getElementById('article-id').value = '';
    document.getElementById('article-status').value = 'Published';
  });

  reset?.addEventListener('click', () => {
    form.reset();
    document.getElementById('article-id').value = '';
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextState = getState();
    const articleId = document.getElementById('article-id').value;
    const payload = {
      id: articleId || `art-${Date.now()}`,
      title: document.getElementById('article-title').value.trim(),
      category: document.getElementById('article-category').value,
      author: document.getElementById('article-author').value.trim(),
      status: document.getElementById('article-status').value,
      date: document.getElementById('article-date').value || new Date().toISOString().slice(0, 10),
      excerpt: document.getElementById('article-excerpt').value.trim()
    };

    if (!payload.title || !payload.author || !payload.excerpt) {
      showToast('Judul, penulis, dan ringkasan wajib diisi.', 'error');
      return;
    }

    const articleIndex = nextState.articles.findIndex((item) => item.id === payload.id);
    if (articleIndex >= 0) {
      nextState.articles[articleIndex] = payload;
    } else {
      nextState.articles.unshift(payload);
    }

    saveState(nextState);
    renderContentTable();
    form.reset();
    document.getElementById('article-id').value = '';
    showToast(articleIndex >= 0 ? 'Artikel berhasil diperbarui.' : 'Artikel baru berhasil ditambahkan.', 'success');
  });
}

function renderContentTable() {
  const tableBody = document.querySelector('#content-table-body');
  if (!tableBody) return;

  const state = getState();
  tableBody.innerHTML = state.articles.map((article) => `
    <tr>
      <td>${article.title}</td>
      <td>${article.category}</td>
      <td>${article.author}</td>
      <td><span class="badge ${getStatusClass(article.status)}">${article.status}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" class="ghost-btn small-btn" data-edit-article="${article.id}">Edit</button>
          <button type="button" class="ghost-btn small-btn danger" data-delete-article="${article.id}">Hapus</button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-edit-article]').forEach((button) => {
    button.addEventListener('click', () => {
      const article = getState().articles.find((item) => item.id === button.dataset.editArticle);
      if (!article) return;
      document.getElementById('article-id').value = article.id;
      document.getElementById('article-title').value = article.title;
      document.getElementById('article-category').value = article.category;
      document.getElementById('article-author').value = article.author;
      document.getElementById('article-status').value = article.status;
      document.getElementById('article-date').value = article.date;
      document.getElementById('article-excerpt').value = article.excerpt;
      document.getElementById('article-title').focus();
    });
  });

  document.querySelectorAll('[data-delete-article]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteArticle;
      const nextState = getState();
      const filtered = nextState.articles.filter((item) => item.id !== id);
      if (!filtered.length && nextState.articles.length === 0) {
        saveState({ ...nextState, articles: [] });
      } else {
        saveState({ ...nextState, articles: filtered });
      }
      renderContentTable();
      showToast('Artikel berhasil dihapus.', 'success');
    });
  });
}

function createUserModal() {
  if (document.querySelector('#user-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'user-modal';
  modal.className = 'app-modal hidden';
  modal.innerHTML = `
    <div class="app-modal-backdrop"></div>
    <div class="app-modal-card">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Akses & keamanan</p>
          <h3>Tambah pengguna baru</h3>
        </div>
        <button type="button" class="close-modal" aria-label="Tutup">✕</button>
      </div>
      <form id="user-form" class="modal-form">
        <div class="field">
          <label for="modal-name">Nama lengkap</label>
          <input id="modal-name" type="text" required />
        </div>
        <div class="field">
          <label for="modal-role">Role</label>
          <select id="modal-role">
            <option>Admin</option>
            <option>Guru</option>
            <option>Siswa</option>
            <option>Orang tua</option>
          </select>
        </div>
        <div class="field">
          <label for="modal-email">Email</label>
          <input id="modal-email" type="email" required />
        </div>
        <div class="field">
          <label for="modal-status">Status</label>
          <select id="modal-status">
            <option>Aktif</option>
            <option>Online</option>
            <option>Review</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="ghost-btn close-modal">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan pengguna</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
  modal.querySelector('.app-modal-backdrop').addEventListener('click', () => modal.classList.add('hidden'));

  const form = modal.querySelector('#user-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const state = getState();
    const newUser = {
      name: document.querySelector('#modal-name').value.trim(),
      role: document.querySelector('#modal-role').value,
      email: document.querySelector('#modal-email').value.trim(),
      status: document.querySelector('#modal-status').value,
      lastActive: 'baru saja'
    };

    if (!newUser.name || !newUser.email) {
      showToast('Nama dan email wajib diisi.', 'error');
      return;
    }

    state.users.unshift(newUser);
    saveState(state);
    renderUserTable();
    modal.classList.add('hidden');
    form.reset();
    showToast('Pengguna baru berhasil ditambahkan.', 'success');
  });
}

function bindUserModal() {
  const trigger = document.querySelector('#open-user-modal');
  if (!trigger) return;
  trigger.addEventListener('click', () => {
    const modal = document.querySelector('#user-modal');
    if (modal) modal.classList.remove('hidden');
  });
}

function renderSettings() {
  const state = getState();
  document.querySelectorAll('[data-setting-toggle]').forEach((toggle) => {
    const key = toggle.dataset.settingToggle;
    toggle.checked = Boolean(state.settings[key]);
    toggle.onchange = () => {
      const nextState = getState();
      nextState.settings[key] = toggle.checked;
      saveState(nextState);
      showToast('Preferensi sistem diperbarui.', 'success');
    };
  });
}

function bindGlobalAppFeatures() {
  const yearNode = document.querySelector('[data-current-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const sidebarItems = document.querySelectorAll('.nav-item');
  const panelSections = document.querySelectorAll('.panel-section');
  const pageTitle = document.querySelector('.page-title');
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');

  const setActiveSection = (targetName, newLabel) => {
    sidebarItems.forEach((nav) => {
      const isActive = nav.dataset.target === targetName;
      nav.classList.toggle('active', isActive);
      nav.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    panelSections.forEach((section) => {
      const isVisible = section.dataset.section === targetName;
      section.classList.toggle('hidden', !isVisible);
    });

    if (pageTitle && newLabel) pageTitle.textContent = newLabel;
  };

  if (sidebarItems.length && panelSections.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (item.dataset.target) {
          setActiveSection(item.dataset.target, item.dataset.label || item.textContent.trim());
        }
      });
    });
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const dashboardApp = document.querySelector('.dashboard-app');
      if (!dashboardApp) return;
      dashboardApp.classList.toggle('sidebar-collapsed');
    });
  }
}

function initArticlePreview() {
  const articleForm = document.querySelector('.article-form');
  if (!articleForm) return;

  const titleInput = articleForm.querySelector('#article-title');
  const categoryInput = articleForm.querySelector('#category');
  const dateInput = articleForm.querySelector('#date');
  const excerptInput = articleForm.querySelector('#excerpt');
  const contentInput = articleForm.querySelector('#content');
  const previewTitle = document.querySelector('.preview-card h3');
  const previewText = document.querySelector('.preview-card p');
  const previewMeta = document.querySelector('.meta-date');
  const statusBadge = document.querySelector('.status-badge');
  const tagBox = document.querySelector('.tag-box');

  const renderPreview = () => {
    const title = titleInput?.value || 'Judul artikel';
    const category = categoryInput?.value || 'Prestasi';
    const rawDate = dateInput?.value || '2024-10-24';
    const excerpt = excerptInput?.value || 'Ringkasan belum diisi';
    const content = contentInput?.value || '';

    if (previewTitle) previewTitle.textContent = title;
    if (previewText) previewText.textContent = excerpt || (content.length > 140 ? `${content.slice(0, 140)}...` : content);

    try {
      const formatted = new Date(`${rawDate}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (previewMeta) previewMeta.textContent = formatted;
    } catch (error) {
      if (previewMeta) previewMeta.textContent = 'Tanggal belum diatur';
    }

    if (statusBadge) {
      statusBadge.textContent = category;
      statusBadge.className = 'status-badge primary';
    }

    if (tagBox) {
      const keywords = [category.toLowerCase(), ...title.split(' ').filter((word) => word.length > 4).slice(0, 3)];
      tagBox.innerHTML = keywords.map((item) => `<span>#${item.replace(/[^a-z0-9]/gi, '').toLowerCase()}</span>`).join('');
    }
  };

  articleForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', renderPreview);
    field.addEventListener('change', renderPreview);
  });
  renderPreview();
}

function initFormActions() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Data berhasil disimpan.', 'success');

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        setTimeout(() => {
          submitButton.disabled = false;
        }, 1200);
      }
    });
  });

  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.toast || 'Aksi berhasil diproses.', 'success'));
  });

  document.querySelectorAll('.btn-primary, .ghost-btn').forEach((button) => {
    if (button.closest('form')) return;
    button.addEventListener('click', () => {
      const label = button.textContent.trim();
      if (!label || label === 'Pratinjau') return;
      showToast(`${label} diproses.`, 'success');
    });
  });
}

function getRememberedLogin() {
  try {
    return localStorage.getItem(REMEMBERED_LOGIN_KEY) || '';
  } catch (error) {
    return '';
  }
}

function setRememberedLogin(email, shouldRemember) {
  try {
    if (shouldRemember && email) {
      localStorage.setItem(REMEMBERED_LOGIN_KEY, email);
      return;
    }
    localStorage.removeItem(REMEMBERED_LOGIN_KEY);
  } catch (error) {
    // no-op for privacy-restricted browsers
  }
}

function initLoginActions() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const rememberInput = document.getElementById('remember-login');

  const rememberedEmail = getRememberedLogin();
  if (emailInput) {
    emailInput.value = rememberedEmail || emailInput.value || 'rina@schoolofpeople.com';
  }

  if (passwordInput && !passwordInput.value.trim()) {
    passwordInput.value = 'admin123';
  }

  if (rememberInput) {
    rememberInput.checked = Boolean(rememberedEmail);
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const shouldRemember = Boolean(rememberInput?.checked);

    if (!email || !password) {
      showToast('Email dan password wajib diisi.', 'error');
      return;
    }

    const matchedUser = getUserByCredentials(email, password);
    if (!matchedUser) {
      showToast('Email atau password salah. Coba akun yang tersedia.', 'error');
      return;
    }

    setRememberedLogin(email, shouldRemember);

    setAdminSession({
      name: matchedUser.name,
      role: matchedUser.role,
      email: matchedUser.email,
      avatar: matchedUser.name.split(' ').slice(0, 2).map((part) => part[0]).join('').substring(0, 2).toUpperCase() || 'AM'
    });

    showToast('Login berhasil. Mengalihkan dashboard...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });
}

function initLoginMascots() {
  const loginShell = document.querySelector('.login-shell');
  if (!loginShell) return;

  const mascots = loginShell.querySelectorAll('.cartoon');
  if (!mascots.length) return;

  const updateMascotLook = (event) => {
    const shellRect = loginShell.getBoundingClientRect();
    const pointerX = event.clientX;
    const pointerY = event.clientY;

    mascots.forEach((mascot) => {
      const mascotRect = mascot.getBoundingClientRect();
      const mascotCenterX = mascotRect.left + mascotRect.width / 2;
      const mascotCenterY = mascotRect.top + mascotRect.height / 2;
      const deltaX = ((pointerX - mascotCenterX) / 90) * 6;
      const deltaY = ((pointerY - mascotCenterY) / 90) * 6;
      const clampedX = Math.max(-10, Math.min(10, deltaX));
      const clampedY = Math.max(-8, Math.min(8, deltaY));

      mascot.style.setProperty('--look-x', `${clampedX}px`);
      mascot.style.setProperty('--look-y', `${clampedY}px`);
    });
  };

  loginShell.addEventListener('pointermove', updateMascotLook);
  loginShell.addEventListener('pointerleave', () => {
    mascots.forEach((mascot) => {
      mascot.style.setProperty('--look-x', '0px');
      mascot.style.setProperty('--look-y', '0px');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const currentSession = getAdminSession();
  if (!currentSession) {
    clearAdminSession();
  }

  createToastContainer();

  if (document.body.classList.contains('dashboard-page')) {
    initDashboardIdentity();
  }

  if (document.getElementById('login-menu-trigger')) {
    createLoginModal();
  }

  renderSidebarAuthState();
  bindSidebarLogout();
  handleSidebarLogin();
  bindGlobalAppFeatures();
  renderUserTable();
  renderContentManager();
  createUserModal();
  bindUserModal();
  renderSettings();
  initUserFilters();
  initArticlePreview();
  initFormActions();
  initLoginActions();
  initLoginMascots();
});

function initUserFilters() {
  const tabButtons = document.querySelectorAll('.tab-chip');
  const searchInput = document.querySelector('#user-search');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((tab) => tab.classList.toggle('active', tab === button));
      renderUserTable();
    });
  });

  if (searchInput) searchInput.addEventListener('input', renderUserTable);
}
