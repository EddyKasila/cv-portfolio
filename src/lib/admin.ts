import type { Profile } from '@/types';

const STORAGE_KEY = 'portfolioos_auth';

export interface AdminModule {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  render?: (container: HTMLElement) => void;
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
    this.sidebarEl = document.getElementById('sidebarNav')!;
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
      <div class="sidebar-group">
        ${this.modules.map(m => `
          <button class="sidebar-item${m.enabled ? '' : ' disabled'}" data-module="${m.id}" ${m.enabled ? '' : 'disabled'}>
            <i class="fa-solid ${m.icon}"></i>
            <span>${m.label}</span>
            ${!m.enabled ? '<span class="badge">Soon</span>' : ''}
          </button>
        `).join('')}
      </div>
    `;

    this.sidebarEl.querySelectorAll('.sidebar-item:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => this.navigateTo(btn.getAttribute('data-module')!));
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      this.redirectToLogin();
    });
  }

  navigateTo(moduleId: string): void {
    const mod = this.modules.find(m => m.id === moduleId);
    if (!mod || !mod.enabled || !mod.render) return;

    this.activeModule = moduleId;
    this.sidebarEl.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
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
  const el = document.getElementById('toast')!;
  el.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  el.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => el.classList.remove('show'), 3000);
}

function openModal(title: string, body: string, footer?: string): void {
  const overlay = document.getElementById('modalOverlay')!;
  const content = document.getElementById('modalContent')!;
  content.innerHTML = `
    <div class="modal-header">
      <h3>${title}</h3>
      <button class="modal-close" id="modalCloseBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">${body}</div>
    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
  `;
  overlay.classList.add('open');
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

function closeModal(): void {
  document.getElementById('modalOverlay')!.classList.remove('open');
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
    req.style.color = 'var(--danger)';
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
    help.style.cssText = 'font-size:0.75rem;color:var(--text-muted);margin-top:4px;';
    help.textContent = config.helpText;
    group.appendChild(help);
  }
  return group;
}

/* ── Dashboard ── */

export function renderDashboard(container: HTMLElement): void {
  container.innerHTML = `
    <div class="page-header">
      <h2>Dashboard</h2>
      <p>Overview of your PortfolioOS content</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card animate-in">
        <div class="stat-icon" style="background:#eff6ff;color:#2563eb;"><i class="fa-solid fa-user"></i></div>
        <div class="stat-value" id="statProfile">—</div>
        <div class="stat-label">Profile</div>
        <div class="stat-desc">Your identity & social links</div>
      </div>
      <div class="stat-card animate-in" style="animation-delay:0.05s">
        <div class="stat-icon" style="background:#f0fdf4;color:#059669;"><i class="fa-solid fa-briefcase"></i></div>
        <div class="stat-value" id="statExperience">—</div>
        <div class="stat-label">Experience</div>
        <div class="stat-desc">Work history entries</div>
      </div>
      <div class="stat-card animate-in" style="animation-delay:0.1s">
        <div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fa-solid fa-diagram-project"></i></div>
        <div class="stat-value" id="statProjects">—</div>
        <div class="stat-label">Projects</div>
        <div class="stat-desc">Portfolio projects</div>
      </div>
      <div class="stat-card animate-in" style="animation-delay:0.15s">
        <div class="stat-icon" style="background:#faf5ff;color:#9333ea;"><i class="fa-solid fa-graduation-cap"></i></div>
        <div class="stat-value" id="statEducation">—</div>
        <div class="stat-label">Education</div>
        <div class="stat-desc">Degrees & certifications</div>
      </div>
    </div>
    <div class="content-card">
      <div class="content-card-header">
        <h3><i class="fa-solid fa-clock-rotate-left" style="margin-right:8px;color:var(--text-muted);"></i> Recent Activity</h3>
      </div>
      <div class="content-card-body">
        <div style="text-align:center;padding:32px 0;color:var(--text-muted);font-size:0.9rem;">
          <i class="fa-solid fa-circle-info" style="margin-right:6px;"></i>
          Content activity tracking coming soon
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

/* ── Profile Editor ── */

export function renderProfile(container: HTMLElement): void {
  let currentData: Profile | null = null;

  container.innerHTML = `
    <div class="page-header">
      <h2>Profile</h2>
      <p>Edit your professional profile — changes are preview-only until you export</p>
    </div>
    <div class="content-card">
      <div class="content-card-header">
        <h3><i class="fa-solid fa-pen-to-square" style="margin-right:8px;color:var(--primary);"></i> Edit Profile</h3>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-secondary btn-sm" id="previewBtn" disabled><i class="fa-solid fa-eye"></i> Preview</button>
          <button class="btn btn-primary btn-sm" id="exportBtn" disabled><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
        </div>
      </div>
      <div class="content-card-body">
        <form id="profileForm"></form>
      </div>
    </div>
  `;

  const form = document.getElementById('profileForm')!;
  const previewBtn = document.getElementById('previewBtn') as HTMLButtonElement;
  const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
  const githubBtn = document.getElementById('githubBtn')!;

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

    /* social links */
    const socialGroup = document.createElement('div');
    socialGroup.style.cssText = 'margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;';
    const socialLabel = document.createElement('label');
    socialLabel.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;';
    socialLabel.textContent = 'SOCIAL LINKS';
    socialGroup.appendChild(socialLabel);

    profile.social.forEach((s, i) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
      row.innerHTML = `
        <span style="width:24px;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="${s.icon}"></i></span>
        <span style="width:60px;font-size:0.8rem;color:var(--text-secondary);">${s.label}</span>
        <input type="text" class="form-input" id="social_${i}_url" value="${s.url}" style="flex:1;" />
      `;
      socialGroup.appendChild(row);
    });
    form.appendChild(socialGroup);

    /* interests */
    const interestGroup = document.createElement('div');
    interestGroup.style.cssText = 'margin-top:16px;border-top:1px solid var(--border-light);padding-top:16px;';
    interestGroup.innerHTML = '<label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">INTERESTS / ABOUT</label>';
    form.appendChild(interestGroup);

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
    const body = `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><strong>Name:</strong> ${data.name}</div>
        <div><strong>Title:</strong> ${data.title}</div>
        <div><strong>Tagline:</strong> ${data.tagline}</div>
        <div><strong>Email:</strong> ${data.email}</div>
        <div><strong>Phone:</strong> ${data.phone}</div>
        <div><strong>Location:</strong> ${data.location}</div>
        <div><strong>Summary:</strong> ${data.summary}</div>
        <div><strong>Social:</strong> ${data.social.map(s => `<a href="${s.url}" target="_blank" style="color:var(--primary);">${s.label}</a>`).join(', ')}</div>
      </div>
    `;
    openModal('Profile Preview', body);
  });

  exportBtn.addEventListener('click', () => {
    const data = collectFormData();
    if (!data) return;
    exportJson(data, 'profile.json');
    showToast('profile.json exported — commit it to your repo to update the live site');
  });

  githubBtn.addEventListener('click', () => {
    window.open('https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/profile.json', '_blank');
  });
}
