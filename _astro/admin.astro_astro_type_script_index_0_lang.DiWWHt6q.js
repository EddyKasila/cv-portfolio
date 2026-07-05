const b="portfolioos_auth";class L{modules=[];activeModule=null;sidebarEl;contentEl;register(e){this.modules.push(e)}boot(){this.checkAuth()&&(this.sidebarEl=document.getElementById("sidebarNav"),this.contentEl=document.getElementById("adminContent"),this.renderSidebar(),this.navigateTo("dashboard"))}checkAuth(){const e=localStorage.getItem(b);if(!e)return this.redirectToLogin(),!1;try{const{expiry:a}=JSON.parse(e);return Date.now()<a?!0:(localStorage.removeItem(b),this.redirectToLogin(),!1)}catch{return this.redirectToLogin(),!1}}redirectToLogin(){const e=document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/",a=e.endsWith("/")?e:e+"/";window.location.href=`${a}login/`}renderSidebar(){this.sidebarEl.innerHTML=`
      <div class="sidebar-group">
        ${this.modules.map(e=>`
          <button class="sidebar-item${e.enabled?"":" disabled"}" data-module="${e.id}" ${e.enabled?"":"disabled"}>
            <i class="fa-solid ${e.icon}"></i>
            <span>${e.label}</span>
            ${e.enabled?"":'<span class="badge">Soon</span>'}
          </button>
        `).join("")}
      </div>
    `,this.sidebarEl.querySelectorAll(".sidebar-item:not(.disabled)").forEach(e=>{e.addEventListener("click",()=>this.navigateTo(e.getAttribute("data-module")))}),document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem(b),this.redirectToLogin()})}navigateTo(e){const a=this.modules.find(l=>l.id===e);if(!a||!a.enabled||!a.render)return;this.activeModule=e,this.sidebarEl.querySelectorAll(".sidebar-item").forEach(l=>l.classList.remove("active"));const i=this.sidebarEl.querySelector(`[data-module="${e}"]`);i&&i.classList.add("active"),this.contentEl.innerHTML="",a.render(this.contentEl)}}const o=new L;function B(){return document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/"}async function c(s){const a=`${B().replace(/\/+$/,"")}/${s.replace(/^\/+/,"")}`,i=await fetch(a);if(!i.ok)throw new Error(`Failed to fetch ${a}: ${i.status}`);return i.json()}function $(s,e){const a=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),i=URL.createObjectURL(a),l=document.createElement("a");l.href=i,l.download=e,l.click(),URL.revokeObjectURL(i)}function T(s,e="success"){const a=document.getElementById("toast");a.className=`toast toast-${e}`;const i=e==="success"?"fa-check-circle":"fa-exclamation-circle";a.innerHTML=`<i class="fa-solid ${i}"></i> ${s}`,requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>a.classList.remove("show"),3e3)}function w(s,e,a){const i=document.getElementById("modalOverlay"),l=document.getElementById("modalContent");l.innerHTML=`
    <div class="modal-header">
      <h3>${s}</h3>
      <button class="modal-close" id="modalCloseBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">${e}</div>
    
  `,i.classList.add("open"),document.getElementById("modalCloseBtn")?.addEventListener("click",y),i.addEventListener("click",m=>{m.target===i&&y()})}function y(){document.getElementById("modalOverlay").classList.remove("open")}function g(s){const e=document.createElement("div");e.className="form-group";const a=document.createElement("label");if(a.htmlFor=s.id,a.textContent=s.label,s.required){const l=document.createElement("span");l.style.color="var(--danger)",l.textContent=" *",a.appendChild(l)}e.appendChild(a);let i;if(s.multiline?(i=document.createElement("textarea"),i.rows=s.rows||4):(i=document.createElement("input"),i.type=s.type||"text"),i.id=s.id,i.name=s.id,i.value=s.value||"",s.placeholder&&(i.placeholder=s.placeholder),s.required&&(i.required=!0),i.className="form-input",e.appendChild(i),s.helpText){const l=document.createElement("div");l.style.cssText="font-size:0.75rem;color:var(--text-muted);margin-top:4px;",l.textContent=s.helpText,e.appendChild(l)}return e}function k(s){s.innerHTML=`
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
  `,Promise.all([c("data/profile.json"),c("data/experience.json"),c("data/projects.json"),c("data/education.json")]).then(([e,a,i,l])=>{document.getElementById("statProfile").textContent=e.name||"—",document.getElementById("statExperience").textContent=`${a.length} entries`,document.getElementById("statProjects").textContent=`${i.length} projects`,document.getElementById("statEducation").textContent=`${l.length} entries`})}function C(s){let e=null;s.innerHTML=`
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
  `;const a=document.getElementById("profileForm"),i=document.getElementById("previewBtn"),l=document.getElementById("exportBtn"),m=document.getElementById("githubBtn");c("data/profile.json").then(t=>{e={...t},[{id:"name",label:"Full Name",value:t.name,required:!0},{id:"title",label:"Professional Title",value:t.title,required:!0},{id:"tagline",label:"Tagline",value:t.tagline},{id:"email",label:"Email",value:t.email,type:"email",required:!0},{id:"phone",label:"Phone",value:t.phone},{id:"location",label:"Location",value:t.location},{id:"address",label:"Full Address",value:t.address},{id:"photo",label:"Photo Path",value:t.photo,helpText:"Relative path from public/, e.g. /assets/img/profile.jpg"},{id:"resumeUrl",label:"Resume Download URL",value:t.resumeUrl,helpText:"Relative path to PDF in public/"},{id:"summary",label:"Professional Summary",value:t.summary,multiline:!0,rows:6}].forEach(d=>a.appendChild(g(d)));const n=document.createElement("div");n.style.cssText="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;";const r=document.createElement("label");r.style.cssText="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;",r.textContent="SOCIAL LINKS",n.appendChild(r),t.social.forEach((d,x)=>{const v=document.createElement("div");v.style.cssText="display:flex;align-items:center;gap:8px;margin-bottom:8px;",v.innerHTML=`
        <span style="width:24px;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="${d.icon}"></i></span>
        <span style="width:60px;font-size:0.8rem;color:var(--text-secondary);">${d.label}</span>
        <input type="text" class="form-input" id="social_${x}_url" value="${d.url}" style="flex:1;" />
      `,n.appendChild(v)}),a.appendChild(n);const p=document.createElement("div");p.style.cssText="margin-top:16px;border-top:1px solid var(--border-light);padding-top:16px;",p.innerHTML='<label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">INTERESTS / ABOUT</label>',a.appendChild(p),a.appendChild(g({id:"interests_p1",label:"Interest Paragraph 1",value:t.interests.p1,multiline:!0,rows:3})),a.appendChild(g({id:"interests_p2",label:"Interest Paragraph 2",value:t.interests.p2,multiline:!0,rows:3})),i.disabled=!1,l.disabled=!1});function h(){if(!e)return null;const t=n=>document.getElementById(n)?.value||"",u=e.social.map((n,r)=>({...n,url:document.getElementById(`social_${r}_url`)?.value||n.url}));return{...e,name:t("name"),title:t("title"),tagline:t("tagline"),email:t("email"),phone:t("phone"),location:t("location"),address:t("address"),photo:t("photo"),resumeUrl:t("resumeUrl"),summary:t("summary"),social:u,interests:{p1:t("interests_p1"),p2:t("interests_p2")}}}i.addEventListener("click",()=>{const t=h();if(!t)return;const u=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><strong>Name:</strong> ${t.name}</div>
        <div><strong>Title:</strong> ${t.title}</div>
        <div><strong>Tagline:</strong> ${t.tagline}</div>
        <div><strong>Email:</strong> ${t.email}</div>
        <div><strong>Phone:</strong> ${t.phone}</div>
        <div><strong>Location:</strong> ${t.location}</div>
        <div><strong>Summary:</strong> ${t.summary}</div>
        <div><strong>Social:</strong> ${t.social.map(n=>`<a href="${n.url}" target="_blank" style="color:var(--primary);">${n.label}</a>`).join(", ")}</div>
      </div>
    `;w("Profile Preview",u)}),l.addEventListener("click",()=>{const t=h();t&&($(t,"profile.json"),T("profile.json exported — commit it to your repo to update the live site"))}),m.addEventListener("click",()=>{window.open("https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/profile.json","_blank")})}o.register({id:"dashboard",label:"Dashboard",icon:"fa-gauge-high",enabled:!0,render:k});o.register({id:"profile",label:"Profile",icon:"fa-user",enabled:!0,render:C});o.register({id:"experience",label:"Experience",icon:"fa-briefcase",enabled:!1});o.register({id:"projects",label:"Projects",icon:"fa-diagram-project",enabled:!1});o.register({id:"education",label:"Education",icon:"fa-graduation-cap",enabled:!1});o.register({id:"skills",label:"Skills",icon:"fa-code",enabled:!1});o.register({id:"certifications",label:"Certifications",icon:"fa-certificate",enabled:!1});o.register({id:"articles",label:"Articles",icon:"fa-newspaper",enabled:!1});o.register({id:"contact",label:"Contact",icon:"fa-envelope",enabled:!1});o.register({id:"seo",label:"SEO",icon:"fa-magnifying-glass",enabled:!1});o.register({id:"settings",label:"Settings",icon:"fa-gear",enabled:!1});o.boot();const E=document.getElementById("sidebar"),f=document.getElementById("sidebarOverlay");document.getElementById("mobileNavToggle").addEventListener("click",()=>{E.classList.toggle("open"),f.classList.toggle("open")});f.addEventListener("click",()=>{E.classList.remove("open"),f.classList.remove("open")});
