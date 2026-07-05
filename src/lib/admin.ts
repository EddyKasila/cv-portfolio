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

/* ── Shared helpers for list-type modules ── */

function modPageHeader(title: string, desc: string): string {
  return `<div class="page-header"><h2>${title}</h2><p>${desc}</p></div>`;
}

function modCardHeader(icon: string, label: string): string {
  return `<h3><i class="fa-solid ${icon}" style="margin-right:8px;color:var(--primary);"></i> ${label}</h3>`;
}

function modHeaderActions(addLabel: string): string {
  return `
    <div style="display:flex;gap:6px;">
      <button class="btn btn-primary btn-sm" id="addBtn"><i class="fa-solid fa-plus"></i> ${addLabel}</button>
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
    </div>`;
}

function bindModuleActions(exportFn: () => void, githubUrl: string): void {
  document.getElementById('exportBtn')?.addEventListener('click', exportFn);
  document.getElementById('githubBtn')?.addEventListener('click', () => window.open(githubUrl, '_blank'));
}

function renderItemList(items: Array<{ title: string; sub: string; meta?: string }>, editLabel = 'Edit'): string {
  if (items.length === 0) {
    return `<div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No entries yet</h3><p>Add your first entry to get started</p></div>`;
  }
  return items.map((item, i) => `
    <div class="item-card" style="margin-bottom:8px;">
      <div class="item-card-left">
        <div class="item-card-title">${item.title}</div>
        <div class="item-card-sub">${item.sub}</div>
        ${item.meta ? `<div class="item-card-meta">${item.meta}</div>` : ''}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-secondary btn-sm edit-btn" data-index="${i}"><i class="fa-solid fa-pen"></i> ${editLabel}</button>
        <button class="btn btn-danger btn-sm delete-btn" data-index="${i}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `).join('');
}

/* ── Experience ── */

export function renderExperience(container: HTMLElement): void {
  let data: any[] = [];

  container.innerHTML = `
    ${modPageHeader('Experience', 'Manage your work history entries')}
    <div class="content-card">
      <div class="content-card-header">
        ${modCardHeader('fa-briefcase', 'Experience')}
        ${modHeaderActions('Add Entry')}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;

  const listEl = document.getElementById('listContainer')!;

  fetchJson<any[]>('data/experience.json').then(d => {
    data = d;
    renderList();
  });

  function renderList(): void {
    listEl.innerHTML = renderItemList(data.map(e => ({
      title: e.role,
      sub: `${e.company} · ${e.period}`,
      meta: `${e.tasks.length} tasks · ${e.location}`,
    })));
    bindModalEvents();
  }

  function bindModalEvents(): void {
    listEl.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openEditModal(parseInt(btn.getAttribute('data-index')!)))
    );
    listEl.querySelectorAll('.delete-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index')!);
        data.splice(i, 1);
        renderList();
        showToast('Entry removed');
      })
    );
  }

  document.getElementById('addBtn')!.addEventListener('click', () => {
    openEditModal(-1);
  });

  bindModuleActions(() => {
    exportJson(data, 'experience.json');
    showToast('experience.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/experience.json');

  function openEditModal(index: number): void {
    const isNew = index < 0;
    const item = isNew ? { role: '', company: '', period: '', type: 'full-time', location: '', tasks: [''] } : { ...data[index] };

    const fieldsHtml = `
      <div class="form-group"><label>Role *</label><input class="form-input" id="f_role" value="${esc(item.role)}" /></div>
      <div class="form-group"><label>Company *</label><input class="form-input" id="f_company" value="${esc(item.company)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${esc(item.period)}" placeholder="e.g. March 2022 - October 2024" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="full-time"${item.type === 'full-time' ? ' selected' : ''}>Full-time</option>
          <option value="part-time"${item.type === 'part-time' ? ' selected' : ''}>Part-time</option>
          <option value="contract"${item.type === 'contract' ? ' selected' : ''}>Contract</option>
        </select>
      </div>
      <div class="form-group"><label>Location</label><input class="form-input" id="f_location" value="${esc(item.location)}" /></div>
      <div class="form-group"><label>Tasks (one per line)</label><textarea class="form-input" id="f_tasks" rows="5">${esc(item.tasks.join('\n'))}</textarea></div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
      <button class="btn btn-primary" id="modalSaveBtn">${isNew ? 'Add' : 'Save'}</button>
    `;

    openModal(isNew ? 'Add Experience Entry' : 'Edit Experience Entry', fieldsHtml, footerHtml);

    document.getElementById('modalCancelBtn')!.addEventListener('click', closeModal);
    document.getElementById('modalSaveBtn')!.addEventListener('click', () => {
      const role = (document.getElementById('f_role') as HTMLInputElement).value.trim();
      if (!role) { showToast('Role is required', 'error'); return; }
      const tasks = (document.getElementById('f_tasks') as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean);
      const updated = {
        role,
        company: (document.getElementById('f_company') as HTMLInputElement).value.trim(),
        period: (document.getElementById('f_period') as HTMLInputElement).value.trim(),
        type: (document.getElementById('f_type') as HTMLSelectElement).value,
        location: (document.getElementById('f_location') as HTMLInputElement).value.trim(),
        tasks,
      };
      if (isNew) {
        data.push(updated);
      } else {
        data[index] = updated;
      }
      renderList();
      closeModal();
      showToast(isNew ? 'Entry added' : 'Entry saved');
    });
  }
}

/* ── Projects ── */

export function renderProjects(container: HTMLElement): void {
  let data: any[] = [];

  container.innerHTML = `
    ${modPageHeader('Projects', 'Manage your portfolio projects')}
    <div class="content-card">
      <div class="content-card-header">
        ${modCardHeader('fa-diagram-project', 'Projects')}
        ${modHeaderActions('Add Project')}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;

  const listEl = document.getElementById('listContainer')!;

  fetchJson<any[]>('data/projects.json').then(d => {
    data = d;
    renderList();
  });

  function renderList(): void {
    listEl.innerHTML = renderItemList(data.map(p => ({
      title: p.name,
      sub: `${p.role} · ${p.period}`,
      meta: `${p.highlights.length} highlights · ${p.status}`,
    })));
    bindEvents();
  }

  function bindEvents(): void {
    listEl.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openEditModal(parseInt(btn.getAttribute('data-index')!)))
    );
    listEl.querySelectorAll('.delete-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        data.splice(parseInt(btn.getAttribute('data-index')!), 1);
        renderList();
        showToast('Project removed');
      })
    );
  }

  document.getElementById('addBtn')!.addEventListener('click', () => openEditModal(-1));

  bindModuleActions(() => {
    exportJson(data, 'projects.json');
    showToast('projects.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/projects.json');

  function openEditModal(index: number): void {
    const isNew = index < 0;
    const item = isNew ? { name: '', role: '', period: '', tag: '', image: '', url: '', summary: '', highlights: [''], status: 'completed' } : { ...data[index] };

    const fieldsHtml = `
      <div class="form-group"><label>Project Name *</label><input class="form-input" id="f_name" value="${esc(item.name)}" /></div>
      <div class="form-group"><label>Role</label><input class="form-input" id="f_role" value="${esc(item.role)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${esc(item.period)}" /></div>
      <div class="form-group"><label>Tag</label><input class="form-input" id="f_tag" value="${esc(item.tag)}" /></div>
      <div class="form-group"><label>Image Path</label><input class="form-input" id="f_image" value="${esc(item.image)}" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${esc(item.url)}" /></div>
      <div class="form-group"><label>Summary</label><textarea class="form-input" id="f_summary" rows="4">${esc(item.summary)}</textarea></div>
      <div class="form-group"><label>Highlights (one per line)</label><textarea class="form-input" id="f_highlights" rows="4">${esc(item.highlights.join('\n'))}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-input" id="f_status">
          <option value="completed"${item.status === 'completed' ? ' selected' : ''}>Completed</option>
          <option value="in-progress"${item.status === 'in-progress' ? ' selected' : ''}>In Progress</option>
          <option value="planned"${item.status === 'planned' ? ' selected' : ''}>Planned</option>
        </select>
      </div>
    `;

    openModal(isNew ? 'Add Project' : 'Edit Project', fieldsHtml, modalFooter(isNew));
    document.getElementById('modalCancelBtn')!.addEventListener('click', closeModal);
    document.getElementById('modalSaveBtn')!.addEventListener('click', () => {
      const name = (document.getElementById('f_name') as HTMLInputElement).value.trim();
      if (!name) { showToast('Project name is required', 'error'); return; }
      const updated = {
        name,
        role: g('f_role'),
        period: g('f_period'),
        tag: g('f_tag'),
        image: g('f_image'),
        url: g('f_url'),
        summary: ga('f_summary'),
        highlights: ga('f_highlights').split('\n').map(s => s.trim()).filter(Boolean),
        status: (document.getElementById('f_status') as HTMLSelectElement).value,
      };
      if (isNew) { data.push(updated); } else { data[index] = updated; }
      renderList();
      closeModal();
      showToast(isNew ? 'Project added' : 'Project saved');
    });
  }
}

/* ── Education ── */

export function renderEducation(container: HTMLElement): void {
  let data: any[] = [];

  container.innerHTML = `
    ${modPageHeader('Education', 'Manage your education and certifications entries')}
    <div class="content-card">
      <div class="content-card-header">
        ${modCardHeader('fa-graduation-cap', 'Education')}
        ${modHeaderActions('Add Entry')}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;

  const listEl = document.getElementById('listContainer')!;

  fetchJson<any[]>('data/education.json').then(d => {
    data = d;
    renderList();
  });

  function renderList(): void {
    listEl.innerHTML = renderItemList(data.map(e => ({
      title: e.degree,
      sub: `${e.institution} · ${e.field}`,
      meta: e.period,
    })));
    bindEvents();
  }

  function bindEvents(): void {
    listEl.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openEditModal(parseInt(btn.getAttribute('data-index')!)))
    );
    listEl.querySelectorAll('.delete-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        data.splice(parseInt(btn.getAttribute('data-index')!), 1);
        renderList();
        showToast('Entry removed');
      })
    );
  }

  document.getElementById('addBtn')!.addEventListener('click', () => openEditModal(-1));

  bindModuleActions(() => {
    exportJson(data, 'education.json');
    showToast('education.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/education.json');

  function openEditModal(index: number): void {
    const isNew = index < 0;
    const item = isNew ? { institution: '', degree: '', field: '', period: '', type: 'degree' } : { ...data[index] };

    const fieldsHtml = `
      <div class="form-group"><label>Institution *</label><input class="form-input" id="f_institution" value="${esc(item.institution)}" /></div>
      <div class="form-group"><label>Degree *</label><input class="form-input" id="f_degree" value="${esc(item.degree)}" /></div>
      <div class="form-group"><label>Field of Study</label><input class="form-input" id="f_field" value="${esc(item.field)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${esc(item.period)}" placeholder="e.g. 2012 - 2017" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="degree"${item.type === 'degree' ? ' selected' : ''}>Degree</option>
          <option value="certification"${item.type === 'certification' ? ' selected' : ''}>Certification</option>
          <option value="diploma"${item.type === 'diploma' ? ' selected' : ''}>Diploma</option>
        </select>
      </div>
    `;

    openModal(isNew ? 'Add Education Entry' : 'Edit Education Entry', fieldsHtml, modalFooter(isNew));
    document.getElementById('modalCancelBtn')!.addEventListener('click', closeModal);
    document.getElementById('modalSaveBtn')!.addEventListener('click', () => {
      const institution = (document.getElementById('f_institution') as HTMLInputElement).value.trim();
      const degree = (document.getElementById('f_degree') as HTMLInputElement).value.trim();
      if (!institution || !degree) { showToast('Institution and degree are required', 'error'); return; }
      const updated = { institution, degree, field: g('f_field'), period: g('f_period'), type: (document.getElementById('f_type') as HTMLSelectElement).value };
      if (isNew) { data.push(updated); } else { data[index] = updated; }
      renderList();
      closeModal();
      showToast(isNew ? 'Entry added' : 'Entry saved');
    });
  }
}

/* ── Skills ── */

export function renderSkills(container: HTMLElement): void {
  let data: { programming: any[]; professional: string[] } = { programming: [], professional: [] };

  container.innerHTML = `
    ${modPageHeader('Skills', 'Manage your technical and professional skills')}
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${modCardHeader('fa-code', 'Programming Skills')}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="addProgBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>
      <div class="content-card-body" id="progList"></div>
    </div>
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${modCardHeader('fa-briefcase', 'Professional Skills')}
      </div>
      <div class="content-card-body" id="profContainer"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
    </div>
  `;

  const progList = document.getElementById('progList')!;
  const profContainer = document.getElementById('profContainer')!;

  fetchJson<{ programming: any[]; professional: string[] }>('data/skills.json').then(d => {
    data = d;
    renderAll();
  });

  function renderAll(): void {
    progList.innerHTML = data.programming.length === 0
      ? `<div class="empty-state"><i class="fa-solid fa-code"></i><h3>No programming skills</h3><p>Add your first skill</p></div>`
      : data.programming.map((s, i) => `
        <div class="item-card" style="margin-bottom:6px;">
          <div class="item-card-left">
            <div class="item-card-title"><i class="${s.icon}" style="margin-right:6px;color:var(--primary);"></i>${s.name}</div>
            <div class="item-card-sub">${s.category}</div>
          </div>
          <div class="item-card-actions">
            <button class="btn btn-secondary btn-sm edit-prog" data-index="${i}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger btn-sm del-prog" data-index="${i}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `).join('');

    progList.querySelectorAll('.edit-prog').forEach(btn =>
      btn.addEventListener('click', () => openProgModal(parseInt(btn.getAttribute('data-index')!)))
    );
    progList.querySelectorAll('.del-prog').forEach(btn =>
      btn.addEventListener('click', () => {
        data.programming.splice(parseInt(btn.getAttribute('data-index')!), 1);
        renderAll();
        showToast('Skill removed');
      })
    );

    profContainer.innerHTML = `
      <textarea class="form-input" id="profSkills" rows="6">${data.professional.join('\n')}</textarea>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">One skill per line</div>
    `;
  }

  document.getElementById('addProgBtn')!.addEventListener('click', () => openProgModal(-1));

  bindModuleActions(() => {
    const profSkills = (document.getElementById('profSkills') as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean);
    const out = { ...data, professional: profSkills };
    exportJson(out, 'skills.json');
    showToast('skills.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/skills.json');

  function openProgModal(index: number): void {
    const isNew = index < 0;
    const item = isNew ? { name: '', icon: 'fa-solid fa-code', category: 'frontend' } : { ...data.programming[index] };

    const fieldsHtml = `
      <div class="form-group"><label>Skill Name *</label><input class="form-input" id="f_name" value="${esc(item.name)}" /></div>
      <div class="form-group"><label>Icon class</label><input class="form-input" id="f_icon" value="${esc(item.icon)}" placeholder="e.g. fab fa-html5" /></div>
      <div class="form-group"><label>Category</label>
        <select class="form-input" id="f_category">
          <option value="frontend"${item.category === 'frontend' ? ' selected' : ''}>Frontend</option>
          <option value="backend"${item.category === 'backend' ? ' selected' : ''}>Backend</option>
          <option value="tools"${item.category === 'tools' ? ' selected' : ''}>Tools</option>
        </select>
      </div>
    `;

    openModal(isNew ? 'Add Programming Skill' : 'Edit Programming Skill', fieldsHtml, modalFooter(isNew));
    document.getElementById('modalCancelBtn')!.addEventListener('click', closeModal);
    document.getElementById('modalSaveBtn')!.addEventListener('click', () => {
      const name = (document.getElementById('f_name') as HTMLInputElement).value.trim();
      if (!name) { showToast('Skill name is required', 'error'); return; }
      const updated = { name, icon: g('f_icon'), category: (document.getElementById('f_category') as HTMLSelectElement).value };
      if (isNew) { data.programming.push(updated); } else { data.programming[index] = updated; }
      renderAll();
      closeModal();
      showToast(isNew ? 'Skill added' : 'Skill saved');
    });
  }
}

/* ── Certifications ── */

export function renderCertifications(container: HTMLElement): void {
  let data: any[] = [];

  container.innerHTML = `
    ${modPageHeader('Certifications', 'Manage your certifications and credentials')}
    <div class="content-card">
      <div class="content-card-header">
        ${modCardHeader('fa-certificate', 'Certifications')}
        ${modHeaderActions('Add Certification')}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;

  const listEl = document.getElementById('listContainer')!;

  fetchJson<any[]>('data/certifications.json').then(d => {
    data = d;
    renderList();
  });

  function renderList(): void {
    listEl.innerHTML = renderItemList(data.map(c => ({
      title: c.name,
      sub: c.issuer,
      meta: c.date,
    })));
    bindEvents();
  }

  function bindEvents(): void {
    listEl.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openEditModal(parseInt(btn.getAttribute('data-index')!)))
    );
    listEl.querySelectorAll('.delete-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        data.splice(parseInt(btn.getAttribute('data-index')!), 1);
        renderList();
        showToast('Certification removed');
      })
    );
  }

  document.getElementById('addBtn')!.addEventListener('click', () => openEditModal(-1));

  bindModuleActions(() => {
    exportJson(data, 'certifications.json');
    showToast('certifications.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/certifications.json');

  function openEditModal(index: number): void {
    const isNew = index < 0;
    const item = isNew ? { name: '', issuer: '', date: '', url: '', description: '' } : { ...data[index] };

    const fieldsHtml = `
      <div class="form-group"><label>Certification Name *</label><input class="form-input" id="f_name" value="${esc(item.name)}" /></div>
      <div class="form-group"><label>Issuer *</label><input class="form-input" id="f_issuer" value="${esc(item.issuer)}" /></div>
      <div class="form-group"><label>Date</label><input class="form-input" id="f_date" value="${esc(item.date)}" placeholder="e.g. 2016 or Ongoing" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${esc(item.url)}" /></div>
      <div class="form-group"><label>Description</label><textarea class="form-input" id="f_description" rows="3">${esc(item.description)}</textarea></div>
    `;

    openModal(isNew ? 'Add Certification' : 'Edit Certification', fieldsHtml, modalFooter(isNew));
    document.getElementById('modalCancelBtn')!.addEventListener('click', closeModal);
    document.getElementById('modalSaveBtn')!.addEventListener('click', () => {
      const name = (document.getElementById('f_name') as HTMLInputElement).value.trim();
      const issuer = (document.getElementById('f_issuer') as HTMLInputElement).value.trim();
      if (!name || !issuer) { showToast('Name and issuer are required', 'error'); return; }
      const updated = { name, issuer, date: g('f_date'), url: g('f_url'), description: ga('f_description') };
      if (isNew) { data.push(updated); } else { data[index] = updated; }
      renderList();
      closeModal();
      showToast(isNew ? 'Certification added' : 'Certification saved');
    });
  }
}

/* ── Settings ── */

export function renderSettings(container: HTMLElement): void {
  let data: any = {};

  container.innerHTML = `
    ${modPageHeader('Settings', 'Configure your site-wide settings')}
    <div class="content-card">
      <div class="content-card-header">
        ${modCardHeader('fa-gear', 'Site Settings')}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;

  const formEl = document.getElementById('formContainer')!;

  fetchJson<any>('data/settings.json').then(d => {
    data = d;
    formEl.innerHTML = `
      <div class="form-group"><label>Site Title</label><input class="form-input" id="f_siteTitle" value="${esc(d.siteTitle)}" /></div>
      <div class="form-group"><label>Site Description</label><textarea class="form-input" id="f_siteDescription" rows="2">${esc(d.siteDescription)}</textarea></div>
      <div class="form-group"><label>Site URL</label><input class="form-input" id="f_siteUrl" value="${esc(d.siteUrl)}" /></div>
      <div class="form-group"><label>Copyright</label><input class="form-input" id="f_copyright" value="${esc(d.copyright)}" /></div>
      <div style="display:flex;gap:16px;margin-top:12px;">
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_showContactForm" ${d.showContactForm ? 'checked' : ''} />
          Show contact form
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_emailNotifications" ${d.emailNotifications ? 'checked' : ''} />
          Email notifications
        </label>
      </div>
    `;
  });

  bindModuleActions(() => {
    const out = {
      ...data,
      siteTitle: g('f_siteTitle'),
      siteDescription: ga('f_siteDescription'),
      siteUrl: g('f_siteUrl'),
      copyright: g('f_copyright'),
      showContactForm: (document.getElementById('f_showContactForm') as HTMLInputElement).checked,
      emailNotifications: (document.getElementById('f_emailNotifications') as HTMLInputElement).checked,
    };
    exportJson(out, 'settings.json');
    showToast('settings.json exported');
  }, 'https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/settings.json');
}

/* ── Small helpers ── */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function g(id: string): string {
  return (document.getElementById(id) as HTMLInputElement)?.value?.trim() || '';
}

function ga(id: string): string {
  return (document.getElementById(id) as HTMLTextAreaElement)?.value?.trim() || '';
}

function modalFooter(isNew: boolean): string {
  return `
    <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
    <button class="btn btn-primary" id="modalSaveBtn">${isNew ? 'Add' : 'Save'}</button>
  `;
}


