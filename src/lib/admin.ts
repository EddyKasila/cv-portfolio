import type { Profile } from '@/types';

const STORAGE_KEY = 'portfolioos_auth';

export interface AdminModule {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  render: (container: HTMLElement) => void;
  destroy?: () => void;
}

class AdminApp {
  private modules: AdminModule[] = [];
  private activeModule: string | null = null;
  private sidebarEl!: HTMLElement;
  private contentEl!: HTMLElement;

  register(module: AdminModule): void {
    this.modules.push(module);
  }

  boot(): void {
    if (!this.checkAuth()) return;
    this.sidebarEl = document.getElementById('adminSidebar')!;
    this.contentEl = document.getElementById('adminContent')!;
    this.renderSidebar();
    this.navigateTo('dashboard');
  }

  private checkAuth(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) { this.redirectToLogin(); return false; }
    try {
      const { expiry } = JSON.parse(stored);
      if (Date.now() < expiry) return true;
      localStorage.removeItem(STORAGE_KEY);
      this.redirectToLogin();
      return false;
    } catch {
      this.redirectToLogin();
      return false;
    }
  }

  private redirectToLogin(): void {
    const base = document.querySelector('meta[name="base-url"]')?.getAttribute('content') || '/';
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    window.location.href = `${normalizedBase}login/`;
  }

  private renderSidebar(): void {
    this.sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">PortfolioOS</div>
        <div class="sidebar-subtitle">Admin Panel</div>
      </div>
      <nav class="sidebar-nav">
        ${this.modules.map(m => `
          <button class="sidebar-link${m.enabled ? '' : ' disabled'}" data-module="${m.id}" ${m.enabled ? '' : 'disabled'}>
            <i class="fa-solid ${m.icon}"></i>
            <span>${m.label}</span>
            ${!m.enabled ? '<small class="badge">Soon</small>' : ''}
          </button>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-link" id="logoutBtn">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    `;

    this.sidebarEl.querySelectorAll('.sidebar-link:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => this.navigateTo(btn.getAttribute('data-module')!));
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      this.redirectToLogin();
    });
  }

  navigateTo(moduleId: string): void {
    const mod = this.modules.find(m => m.id === moduleId);
    if (!mod || !mod.enabled) return;

    this.activeModule = moduleId;
    this.sidebarEl.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    const activeBtn = this.sidebarEl.querySelector(`[data-module="${moduleId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    this.contentEl.innerHTML = '';
    mod.render(this.contentEl);
  }
}

export const adminApp = new AdminApp();

function getBaseUrl(): string {
  const meta = document.querySelector('meta[name="base-url"]');
  return meta?.getAttribute('content') || '/';
}

async function fetchJson<T>(path: string): Promise<T> {
  const base = getBaseUrl();
  const url = `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function exportJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function createFieldGroup(config: {
  id: string;
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  multiline?: boolean;
  rows?: number;
}): HTMLElement {
  const group = document.createElement('div');
  group.className = 'form-group';
  const label = document.createElement('label');
  label.htmlFor = config.id;
  label.textContent = config.label;
  if (config.required) {
    const req = document.createElement('span');
    req.className = 'required-marker';
    req.textContent = ' *';
    label.appendChild(req);
  }
  group.appendChild(label);

  let input: HTMLInputElement | HTMLTextAreaElement;
  if (config.multiline) {
    input = document.createElement('textarea');
    (input as HTMLTextAreaElement).rows = config.rows || 4;
  } else {
    input = document.createElement('input');
    (input as HTMLInputElement).type = config.type || 'text';
  }
  input.id = config.id;
  input.name = config.id;
  input.value = config.value || '';
  if (config.placeholder) input.placeholder = config.placeholder;
  if (config.required) input.required = true;
  input.className = 'form-input';
  group.appendChild(input);

  if (config.helpText) {
    const help = document.createElement('div');
    help.className = 'form-help';
    help.textContent = config.helpText;
    group.appendChild(help);
  }
  return group;
}

export function renderDashboard(container: HTMLElement): void {
  container.innerHTML = `
    <div class="module-header">
      <h2>Dashboard</h2>
      <p class="module-description">Overview of your PortfolioOS</p>
    </div>
    <div class="dashboard-grid">
      <div class="stat-card">
        <i class="fa-solid fa-user"></i>
        <div>
          <div class="stat-value" id="statProfile">—</div>
          <div class="stat-label">Profile</div>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-briefcase"></i>
        <div>
          <div class="stat-value" id="statExperience">—</div>
          <div class="stat-label">Experience</div>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-diagram-project"></i>
        <div>
          <div class="stat-value" id="statProjects">—</div>
          <div class="stat-label">Projects</div>
        </div>
      </div>
      <div class="stat-card">
        <i class="fa-solid fa-graduation-cap"></i>
        <div>
          <div class="stat-value" id="statEducation">—</div>
          <div class="stat-label">Education</div>
        </div>
      </div>
    </div>
  `;
  Promise.all([
    fetchJson<any>('data/profile.json'),
    fetchJson<any[]>('data/experience.json'),
    fetchJson<any[]>('data/projects.json'),
    fetchJson<any[]>('data/education.json'),
  ]).then(([profile, experience, projects, education]) => {
    document.getElementById('statProfile')!.textContent = profile.name || '—';
    document.getElementById('statExperience')!.textContent = `${experience.length} entries`;
    document.getElementById('statProjects')!.textContent = `${projects.length} projects`;
    document.getElementById('statEducation')!.textContent = `${education.length} entries`;
  });
}

export function renderProfileEditor(container: HTMLElement): void {
  let currentData: Profile | null = null;

  container.innerHTML = `
    <div class="module-header">
      <h2>Profile</h2>
      <p class="module-description">Edit your professional profile. Changes are saved in memory — use Export to download the updated JSON.</p>
    </div>
    <form id="profileForm" class="module-form"></form>
    <div class="form-actions">
      <button type="button" class="btn btn-preview" id="previewBtn" disabled>
        <i class="fa-solid fa-eye"></i> Preview
      </button>
      <button type="button" class="btn btn-export" id="exportBtn" disabled>
        <i class="fa-solid fa-download"></i> Export JSON
      </button>
      <button type="button" class="btn btn-github" id="githubBtn">
        <i class="fa-brands fa-github"></i> Open on GitHub
      </button>
    </div>
    <div id="previewArea" class="preview-area" style="display:none"></div>
  `;

  const form = document.getElementById('profileForm')!;
  const previewBtn = document.getElementById('previewBtn') as HTMLButtonElement;
  const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
  const githubBtn = document.getElementById('githubBtn')!;
  const previewArea = document.getElementById('previewArea')!;

  fetchJson<Profile>('data/profile.json').then(profile => {
    currentData = { ...profile };
    const fields = [
      { id: 'name', label: 'Full Name', value: profile.name, required: true },
      { id: 'title', label: 'Professional Title', value: profile.title, required: true },
      { id: 'tagline', label: 'Tagline', value: profile.tagline },
      { id: 'email', label: 'Email', value: profile.email, type: 'email', required: true },
      { id: 'phone', label: 'Phone', value: profile.phone },
      { id: 'location', label: 'Location', value: profile.location },
      { id: 'address', label: 'Full Address', value: profile.address },
      { id: 'photo', label: 'Photo Path', value: profile.photo, helpText: 'Relative path from public/, e.g. /assets/img/profile.jpg' },
      { id: 'resumeUrl', label: 'Resume Download URL', value: profile.resumeUrl, helpText: 'Relative path to PDF in public/' },
      { id: 'summary', label: 'Professional Summary', value: profile.summary, multiline: true, rows: 6 },
    ];

    fields.forEach(f => form.appendChild(createFieldGroup(f)));

    const socialSection = document.createElement('div');
    socialSection.className = 'form-section';
    socialSection.innerHTML = '<h3>Social Links</h3>';
    form.appendChild(socialSection);

    profile.social.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'social-card';
      card.innerHTML = `
        <div class="social-card-header">
          <i class="${s.icon}"></i>
          <span>${s.label}</span>
        </div>
        <input type="text" class="form-input" id="social_${i}_url" value="${s.url}" placeholder="${s.label} URL" />
        <input type="hidden" id="social_${i}_platform" value="${s.platform}" />
        <input type="hidden" id="social_${i}_label" value="${s.label}" />
        <input type="hidden" id="social_${i}_icon" value="${s.icon}" />
      `;
      form.appendChild(card);
    });

    const interestsSection = document.createElement('div');
    interestsSection.className = 'form-section';
    interestsSection.innerHTML = '<h3>Interests / About</h3>';
    form.appendChild(interestsSection);

    form.appendChild(createFieldGroup({
      id: 'interests_p1', label: 'Interest Paragraph 1', value: profile.interests.p1, multiline: true, rows: 3
    }));
    form.appendChild(createFieldGroup({
      id: 'interests_p2', label: 'Interest Paragraph 2', value: profile.interests.p2, multiline: true, rows: 3
    }));

    previewBtn.disabled = false;
    exportBtn.disabled = false;
  });

  function collectFormData(): Profile | null {
    if (!currentData) return null;
    const get = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
    const social = currentData.social.map((s, i) => ({
      ...s,
      url: (document.getElementById(`social_${i}_url`) as HTMLInputElement)?.value || s.url,
    }));
    return {
      ...currentData,
      name: get('name'),
      title: get('title'),
      tagline: get('tagline'),
      email: get('email'),
      phone: get('phone'),
      location: get('location'),
      address: get('address'),
      photo: get('photo'),
      resumeUrl: get('resumeUrl'),
      summary: get('summary'),
      social,
      interests: {
        p1: get('interests_p1'),
        p2: get('interests_p2'),
      },
    };
  }

  previewBtn.addEventListener('click', () => {
    const data = collectFormData();
    if (!data) return;
    previewArea.style.display = 'block';
    previewArea.innerHTML = `
      <h4>Profile Preview</h4>
      <div class="preview-card">
        <div class="preview-field"><strong>Name:</strong> ${data.name}</div>
        <div class="preview-field"><strong>Title:</strong> ${data.title}</div>
        <div class="preview-field"><strong>Tagline:</strong> ${data.tagline}</div>
        <div class="preview-field"><strong>Email:</strong> ${data.email}</div>
        <div class="preview-field"><strong>Phone:</strong> ${data.phone}</div>
        <div class="preview-field"><strong>Location:</strong> ${data.location}</div>
        <div class="preview-field"><strong>Summary:</strong> ${data.summary}</div>
        <div class="preview-field"><strong>Social:</strong> ${data.social.map(s => `<a href="${s.url}" target="_blank">${s.label}</a>`).join(', ')}</div>
      </div>
    `;
    previewArea.scrollIntoView({ behavior: 'smooth' });
  });

  exportBtn.addEventListener('click', () => {
    const data = collectFormData();
    if (!data) return;
    exportJson(data, 'profile.json');
    showToast('profile.json downloaded — commit it to update your live site');
  });

  githubBtn.addEventListener('click', () => {
    window.open('https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/profile.json', '_blank');
  });
}
