const STORAGE_KEY = 'schoolAppState_v1';

const defaultState = {
  users: [
    { name: 'Rina Wijaya', role: 'Admin', email: 'rina@schoolofpeople.com', status: 'Aktif', lastActive: '2 menit lalu' },
    { name: 'Ahmad Farisi', role: 'Guru', email: 'ahmad.farisi@schoolofpeople.com', status: 'Online', lastActive: '12 menit lalu' },
    { name: 'Nurul Anisa', role: 'Siswa', email: 'nurul.a@schoolofpeople.com', status: 'Review', lastActive: '1 jam lalu' },
    { name: 'Yoga Pratama', role: 'Orang tua', email: 'yoga.pratama@yahoo.com', status: 'Aktif', lastActive: '3 jam lalu' }
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
    return raw ? { ...defaultState, ...JSON.parse(raw), settings: { ...defaultState.settings, ...(JSON.parse(raw)?.settings || {}) } } : defaultState;
  } catch (error) {
    return defaultState;
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
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

  if (sidebarItems.length && panelSections.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener('click', () => {
        const target = item.dataset.target;
        sidebarItems.forEach((nav) => nav.classList.toggle('active', nav === item));
        panelSections.forEach((section) => {
          const isVisible = section.dataset.section === target;
          section.classList.toggle('hidden', !isVisible);
        });
        if (pageTitle && item.dataset.label) pageTitle.textContent = item.dataset.label;
      });
    });
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isHidden = sidebar.style.display === 'none';
      sidebar.style.display = isHidden ? 'flex' : 'none';
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

function initLoginActions() {
  const loginButton = document.querySelector('.auth-form .btn-primary');
  if (!loginButton) return;

  loginButton.addEventListener('click', () => {
    showToast('Login berhasil. Mengalihkan dashboard...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createToastContainer();
  bindGlobalAppFeatures();
  renderUserTable();
  createUserModal();
  bindUserModal();
  renderSettings();
  initUserFilters();
  initArticlePreview();
  initFormActions();
  initLoginActions();
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
