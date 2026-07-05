const b="portfolioos_auth";class E{modules=[];activeModule=null;sidebarEl;contentEl;register(e){this.modules.push(e)}boot(){this.checkAuth()&&(this.sidebarEl=document.getElementById("adminSidebar"),this.contentEl=document.getElementById("adminContent"),this.renderSidebar(),this.navigateTo("dashboard"))}checkAuth(){const e=localStorage.getItem(b);if(!e)return this.redirectToLogin(),!1;try{const{expiry:i}=JSON.parse(e);return Date.now()<i?!0:(localStorage.removeItem(b),this.redirectToLogin(),!1)}catch{return this.redirectToLogin(),!1}}redirectToLogin(){const e=document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/",i=e.endsWith("/")?e:e+"/";window.location.href=`${i}login/`}renderSidebar(){this.sidebarEl.innerHTML=`
      <div class="sidebar-header">
        <div class="sidebar-logo">PortfolioOS</div>
        <div class="sidebar-subtitle">Admin Panel</div>
      </div>
      <nav class="sidebar-nav">
        ${this.modules.map(e=>`
          <button class="sidebar-link${e.enabled?"":" disabled"}" data-module="${e.id}" ${e.enabled?"":"disabled"}>
            <i class="fa-solid ${e.icon}"></i>
            <span>${e.label}</span>
            ${e.enabled?"":'<small class="badge">Soon</small>'}
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-link" id="logoutBtn">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    `,this.sidebarEl.querySelectorAll(".sidebar-link:not(.disabled)").forEach(e=>{e.addEventListener("click",()=>this.navigateTo(e.getAttribute("data-module")))}),document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem(b),this.redirectToLogin()})}navigateTo(e){const i=this.modules.find(s=>s.id===e);if(!i||!i.enabled)return;this.activeModule=e,this.sidebarEl.querySelectorAll(".sidebar-link").forEach(s=>s.classList.remove("active"));const a=this.sidebarEl.querySelector(`[data-module="${e}"]`);a&&a.classList.add("active"),this.contentEl.innerHTML="",i.render(this.contentEl)}}const n=new E;function y(){return document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/"}async function u(l){const i=`${y().replace(/\/+$/,"")}/${l.replace(/^\/+/,"")}`,a=await fetch(i);if(!a.ok)throw new Error(`Failed to fetch ${i}: ${a.status}`);return a.json()}function w(l,e){const i=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),a=URL.createObjectURL(i),s=document.createElement("a");s.href=a,s.download=e,s.click(),URL.revokeObjectURL(a)}function $(l,e="success"){const i=document.querySelector(".admin-toast");i&&i.remove();const a=document.createElement("div");a.className=`admin-toast ${e}`,a.textContent=l,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}function h(l){const e=document.createElement("div");e.className="form-group";const i=document.createElement("label");if(i.htmlFor=l.id,i.textContent=l.label,l.required){const s=document.createElement("span");s.className="required-marker",s.textContent=" *",i.appendChild(s)}e.appendChild(i);let a;if(l.multiline?(a=document.createElement("textarea"),a.rows=l.rows||4):(a=document.createElement("input"),a.type=l.type||"text"),a.id=l.id,a.name=l.id,a.value=l.value||"",l.placeholder&&(a.placeholder=l.placeholder),l.required&&(a.required=!0),a.className="form-input",e.appendChild(a),l.helpText){const s=document.createElement("div");s.className="form-help",s.textContent=l.helpText,e.appendChild(s)}return e}function L(l){l.innerHTML=`
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
  `,Promise.all([u("data/profile.json"),u("data/experience.json"),u("data/projects.json"),u("data/education.json")]).then(([e,i,a,s])=>{document.getElementById("statProfile").textContent=e.name||"—",document.getElementById("statExperience").textContent=`${i.length} entries`,document.getElementById("statProjects").textContent=`${a.length} projects`,document.getElementById("statEducation").textContent=`${s.length} entries`})}function B(l){let e=null;l.innerHTML=`
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
  `;const i=document.getElementById("profileForm"),a=document.getElementById("previewBtn"),s=document.getElementById("exportBtn"),g=document.getElementById("githubBtn"),p=document.getElementById("previewArea");u("data/profile.json").then(t=>{e={...t},[{id:"name",label:"Full Name",value:t.name,required:!0},{id:"title",label:"Professional Title",value:t.title,required:!0},{id:"tagline",label:"Tagline",value:t.tagline},{id:"email",label:"Email",value:t.email,type:"email",required:!0},{id:"phone",label:"Phone",value:t.phone},{id:"location",label:"Location",value:t.location},{id:"address",label:"Full Address",value:t.address},{id:"photo",label:"Photo Path",value:t.photo,helpText:"Relative path from public/, e.g. /assets/img/profile.jpg"},{id:"resumeUrl",label:"Resume Download URL",value:t.resumeUrl,helpText:"Relative path to PDF in public/"},{id:"summary",label:"Professional Summary",value:t.summary,multiline:!0,rows:6}].forEach(r=>i.appendChild(h(r)));const d=document.createElement("div");d.className="form-section",d.innerHTML="<h3>Social Links</h3>",i.appendChild(d),t.social.forEach((r,m)=>{const v=document.createElement("div");v.className="social-card",v.innerHTML=`
        <div class="social-card-header">
          <i class="${r.icon}"></i>
          <span>${r.label}</span>
        </div>
        <input type="text" class="form-input" id="social_${m}_url" value="${r.url}" placeholder="${r.label} URL" />
        <input type="hidden" id="social_${m}_platform" value="${r.platform}" />
        <input type="hidden" id="social_${m}_label" value="${r.label}" />
        <input type="hidden" id="social_${m}_icon" value="${r.icon}" />
      `,i.appendChild(v)});const c=document.createElement("div");c.className="form-section",c.innerHTML="<h3>Interests / About</h3>",i.appendChild(c),i.appendChild(h({id:"interests_p1",label:"Interest Paragraph 1",value:t.interests.p1,multiline:!0,rows:3})),i.appendChild(h({id:"interests_p2",label:"Interest Paragraph 2",value:t.interests.p2,multiline:!0,rows:3})),a.disabled=!1,s.disabled=!1});function f(){if(!e)return null;const t=d=>document.getElementById(d)?.value||"",o=e.social.map((d,c)=>({...d,url:document.getElementById(`social_${c}_url`)?.value||d.url}));return{...e,name:t("name"),title:t("title"),tagline:t("tagline"),email:t("email"),phone:t("phone"),location:t("location"),address:t("address"),photo:t("photo"),resumeUrl:t("resumeUrl"),summary:t("summary"),social:o,interests:{p1:t("interests_p1"),p2:t("interests_p2")}}}a.addEventListener("click",()=>{const t=f();t&&(p.style.display="block",p.innerHTML=`
      <h4>Profile Preview</h4>
      <div class="preview-card">
        <div class="preview-field"><strong>Name:</strong> ${t.name}</div>
        <div class="preview-field"><strong>Title:</strong> ${t.title}</div>
        <div class="preview-field"><strong>Tagline:</strong> ${t.tagline}</div>
        <div class="preview-field"><strong>Email:</strong> ${t.email}</div>
        <div class="preview-field"><strong>Phone:</strong> ${t.phone}</div>
        <div class="preview-field"><strong>Location:</strong> ${t.location}</div>
        <div class="preview-field"><strong>Summary:</strong> ${t.summary}</div>
        <div class="preview-field"><strong>Social:</strong> ${t.social.map(o=>`<a href="${o.url}" target="_blank">${o.label}</a>`).join(", ")}</div>
      </div>
    `,p.scrollIntoView({behavior:"smooth"}))}),s.addEventListener("click",()=>{const t=f();t&&(w(t,"profile.json"),$("profile.json downloaded — commit it to update your live site"))}),g.addEventListener("click",()=>{window.open("https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/profile.json","_blank")})}n.register({id:"dashboard",label:"Dashboard",icon:"fa-gauge-high",enabled:!0,render:L});n.register({id:"profile",label:"Profile",icon:"fa-user",enabled:!0,render:B});n.register({id:"experience",label:"Experience",icon:"fa-briefcase",enabled:!1,render:()=>{}});n.register({id:"projects",label:"Projects",icon:"fa-diagram-project",enabled:!1,render:()=>{}});n.register({id:"education",label:"Education",icon:"fa-graduation-cap",enabled:!1,render:()=>{}});n.register({id:"skills",label:"Skills",icon:"fa-code",enabled:!1,render:()=>{}});n.register({id:"certifications",label:"Certifications",icon:"fa-certificate",enabled:!1,render:()=>{}});n.register({id:"articles",label:"Articles",icon:"fa-newspaper",enabled:!1,render:()=>{}});n.register({id:"contact",label:"Contact",icon:"fa-envelope",enabled:!1,render:()=>{}});n.register({id:"seo",label:"SEO",icon:"fa-magnifying-glass",enabled:!1,render:()=>{}});n.register({id:"settings",label:"Settings",icon:"fa-gear",enabled:!1,render:()=>{}});n.boot();document.getElementById("sidebarToggle")?.addEventListener("click",()=>{document.getElementById("adminSidebar")?.classList.toggle("open")});
