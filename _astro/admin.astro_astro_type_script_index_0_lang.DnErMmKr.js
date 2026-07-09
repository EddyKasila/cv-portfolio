const P="portfolioos_auth",N="portfolioos_activity";class F{modules=[];activeModule=null;sidebarEl;contentEl;register(t){this.modules.push(t)}boot(){this.checkAuth()&&(this.sidebarEl=document.getElementById("sidebarNav"),this.contentEl=document.getElementById("adminContent"),this.renderSidebar(),this.navigateTo("dashboard"))}checkAuth(){const t=localStorage.getItem(P);if(!t)return this.redirectToLogin(),!1;try{const{expiry:a}=JSON.parse(t);return Date.now()<a?!0:(localStorage.removeItem(P),this.redirectToLogin(),!1)}catch{return this.redirectToLogin(),!1}}redirectToLogin(){const t=document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/",a=t.endsWith("/")?t:t+"/";window.location.href=`${a}login/`}renderSidebar(){this.sidebarEl.innerHTML=`
      <div class="sidebar-group">
        ${this.modules.map(t=>`
          <button class="sidebar-item${t.enabled?"":" disabled"}" data-module="${t.id}" ${t.enabled?"":"disabled"}>
            <i class="fa-solid ${t.icon}"></i>
            <span>${t.label}</span>
            ${t.enabled?"":'<span class="badge">Soon</span>'}
          </button>
        `).join("")}
      </div>
    `,this.sidebarEl.querySelectorAll(".sidebar-item:not(.disabled)").forEach(t=>{t.addEventListener("click",()=>this.navigateTo(t.getAttribute("data-module")))}),document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem(P),this.redirectToLogin()})}navigateTo(t){const a=this.modules.find(s=>s.id===t);if(!a||!a.enabled||!a.render)return;this.activeModule=t,this.sidebarEl.querySelectorAll(".sidebar-item").forEach(s=>s.classList.remove("active"));const o=this.sidebarEl.querySelector(`[data-module="${t}"]`);o&&o.classList.add("active"),this.contentEl.innerHTML="",a.render(this.contentEl),t!=="dashboard"&&y("view",t,`Viewed ${a.label}`)}}const h=new F;function J(){return document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/"}async function b(n){const a=`${J().replace(/\/+$/,"")}/${n.replace(/^\/+/,"")}`,o=await fetch(a);if(!o.ok)throw new Error(`Failed to fetch ${a}: ${o.status}`);return o.json()}function k(n,t){const a=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),o=URL.createObjectURL(a),s=document.createElement("a");s.href=o,s.download=t,s.click(),URL.revokeObjectURL(o)}function c(n,t="success"){const a=document.getElementById("toast");a.className=`toast toast-${t}`;const o=t==="success"?"fa-check-circle":"fa-exclamation-circle";a.innerHTML=`<i class="fa-solid ${o}"></i> ${n}`,requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>a.classList.remove("show"),3500)}function I(n,t,a){const o=document.getElementById("modalOverlay"),s=document.getElementById("modalContent");s.innerHTML=`
    <div class="modal-header">
      <h3>${n}</h3>
      <button class="modal-close" id="modalCloseBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">${t}</div>
    ${a?`<div class="modal-footer">${a}</div>`:""}
  `,o.classList.add("open"),document.getElementById("modalCloseBtn")?.addEventListener("click",g),o.addEventListener("click",d=>{d.target===o&&g()})}function g(){document.getElementById("modalOverlay").classList.remove("open")}function M(n){const t=document.createElement("div");t.className="form-group";const a=document.createElement("label");if(a.htmlFor=n.id,a.textContent=n.label,n.required){const s=document.createElement("span");s.style.color="var(--danger)",s.textContent=" *",a.appendChild(s)}t.appendChild(a);let o;if(n.multiline?(o=document.createElement("textarea"),o.rows=n.rows||4):(o=document.createElement("input"),o.type=n.type||"text"),o.id=n.id,o.name=n.id,o.value=n.value||"",n.placeholder&&(o.placeholder=n.placeholder),n.required&&(o.required=!0),o.className="form-input",t.appendChild(o),n.helpText){const s=document.createElement("div");s.style.cssText="font-size:0.75rem;color:var(--text-muted);margin-top:4px;",s.textContent=n.helpText,t.appendChild(s)}return t}function q(){try{return JSON.parse(localStorage.getItem(N)||"[]")}catch{return[]}}function y(n,t,a){const o=q(),s=U(t);o.unshift({type:n,module:t,desc:a||`${n} ${s}`,time:Date.now()}),o.length>50&&(o.length=50),localStorage.setItem(N,JSON.stringify(o))}function U(n){return{dashboard:"Dashboard",profile:"Profile",experience:"Experience",projects:"Projects",education:"Education",skills:"Skills",certifications:"Certifications",settings:"Settings",contact:"Contact",seo:"SEO",articles:"Articles"}[n]||n}function z(n){if(n.length===0)return'<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><h3>No activity yet</h3><p>Your actions will appear here</p></div>';const t=a=>{const o=Date.now()-a,s=Math.floor(o/6e4);if(s<1)return"Just now";if(s<60)return`${s}m ago`;const d=Math.floor(s/60);return d<24?`${d}h ago`:`${Math.floor(d/24)}d ago`};return`<ul class="activity-list">${n.map(a=>`
    <li class="activity-item">
      <div class="activity-dot ${a.type}"></div>
      <div class="activity-content">
        <div class="activity-title">${r(a.desc)}</div>
        <div class="activity-desc">${U(a.module)}</div>
        <div class="activity-time">${t(a.time)}</div>
      </div>
    </li>
  `).join("")}</ul>`}function V(n){n.innerHTML=`
    <div class="page-header">
      <h2>Dashboard</h2>
      <p>Overview of your PortfolioOS content</p>
    </div>

    <div class="dash-section">
      <div class="dash-section-header">
        <i class="fa-solid fa-chart-simple"></i> Content Overview
      </div>
      <div class="stats-grid">
        <div class="stat-card animate-in">
          <div class="stat-icon" style="background:#eef2ff;color:#6366f1;"><i class="fa-solid fa-user"></i></div>
          <div class="stat-info">
            <div class="stat-label">Profile</div>
            <div class="stat-value" id="statProfile">—</div>
          </div>
          <div class="stat-desc">Your identity & social links</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay:0.05s">
          <div class="stat-icon" style="background:#ecfdf5;color:#10b981;"><i class="fa-solid fa-briefcase"></i></div>
          <div class="stat-info">
            <div class="stat-label">Experience</div>
            <div class="stat-value" id="statExperience">—</div>
          </div>
          <div class="stat-desc">Work history entries</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay:0.1s">
          <div class="stat-icon" style="background:#fef2f2;color:#ef4444;"><i class="fa-solid fa-diagram-project"></i></div>
          <div class="stat-info">
            <div class="stat-label">Projects</div>
            <div class="stat-value" id="statProjects">—</div>
          </div>
          <div class="stat-desc">Portfolio projects</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay:0.15s">
          <div class="stat-icon" style="background:#faf5ff;color:#a855f7;"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="stat-info">
            <div class="stat-label">Education</div>
            <div class="stat-value" id="statEducation">—</div>
          </div>
          <div class="stat-desc">Degrees & certifications</div>
        </div>
      </div>
    </div>

    <div class="dash-section">
      <div class="dash-section-header">
        <i class="fa-solid fa-clock-rotate-left"></i> Recent Activity
      </div>
      <div class="dash-card">
        <div id="activityContainer">
          ${z(q())}
        </div>
      </div>
    </div>
  `,Promise.all([b("data/profile.json"),b("data/experience.json"),b("data/projects.json"),b("data/education.json")]).then(([t,a,o,s])=>{document.getElementById("statProfile").textContent=t.name||"—",document.getElementById("statExperience").textContent=`${a.length} entries`,document.getElementById("statProjects").textContent=`${o.length} projects`,document.getElementById("statEducation").textContent=`${s.length} entries`})}function K(n){let t=null;n.innerHTML=`
    <div class="page-header">
      <h2>Profile</h2>
      <p>Edit your professional profile — changes are preview-only until you export</p>
    </div>
    <div class="content-card">
      <div class="content-card-header">
        <h3><i class="fa-solid fa-pen-to-square" style="margin-right:8px;color:var(--primary);"></i> Edit Profile</h3>
        <div style="display:flex;gap:6px;">
          <a href="${C("profile.json")}" target="_blank" class="btn btn-ghost btn-sm" title="View on GitHub"><i class="fa-brands fa-github"></i></a>
          <button class="btn btn-secondary btn-sm" id="previewBtn" disabled><i class="fa-solid fa-eye"></i> Preview</button>
          <button class="btn btn-primary btn-sm" id="exportBtn" disabled><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="publishBtn" disabled><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body">
        <form id="profileForm"></form>
      </div>
    </div>
  `;const a=document.getElementById("profileForm"),o=document.getElementById("previewBtn"),s=document.getElementById("exportBtn"),d=document.getElementById("publishBtn");b("data/profile.json").then(i=>{t={...i},[{id:"name",label:"Full Name",value:i.name,required:!0},{id:"title",label:"Professional Title",value:i.title,required:!0},{id:"tagline",label:"Tagline",value:i.tagline},{id:"email",label:"Email",value:i.email,type:"email",required:!0},{id:"phone",label:"Phone",value:i.phone},{id:"location",label:"Location",value:i.location},{id:"address",label:"Full Address",value:i.address},{id:"photo",label:"Photo Path",value:i.photo,helpText:"Relative path from public/, e.g. /assets/img/profile.jpg"},{id:"resumeUrl",label:"Resume Download URL",value:i.resumeUrl,helpText:"Relative path to PDF in public/"},{id:"summary",label:"Professional Summary",value:i.summary,multiline:!0,rows:6}].forEach(f=>a.appendChild(M(f)));const m=document.createElement("div");m.style.cssText="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;";const u=document.createElement("label");u.style.cssText="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;",u.textContent="SOCIAL LINKS",m.appendChild(u),i.social.forEach((f,E)=>{const $=document.createElement("div");$.style.cssText="display:flex;align-items:center;gap:8px;margin-bottom:8px;",$.innerHTML=`
        <span style="width:24px;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="${f.icon}"></i></span>
        <span style="width:60px;font-size:0.8rem;color:var(--text-secondary);">${f.label}</span>
        <input type="text" class="form-input" id="social_${E}_url" value="${f.url}" style="flex:1;" />
      `,m.appendChild($)}),a.appendChild(m);const p=document.createElement("div");p.style.cssText="margin-top:16px;border-top:1px solid var(--border-light);padding-top:16px;",p.innerHTML='<label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">INTERESTS / ABOUT</label>',a.appendChild(p),a.appendChild(M({id:"interests_p1",label:"Interest Paragraph 1",value:i.interests.p1,multiline:!0,rows:3})),a.appendChild(M({id:"interests_p2",label:"Interest Paragraph 2",value:i.interests.p2,multiline:!0,rows:3})),o.disabled=!1,s.disabled=!1,d.disabled=!1});function e(){if(!t)return null;const i=m=>document.getElementById(m)?.value||"",l=t.social.map((m,u)=>({...m,url:document.getElementById(`social_${u}_url`)?.value||m.url}));return{...t,name:i("name"),title:i("title"),tagline:i("tagline"),email:i("email"),phone:i("phone"),location:i("location"),address:i("address"),photo:i("photo"),resumeUrl:i("resumeUrl"),summary:i("summary"),social:l,interests:{p1:i("interests_p1"),p2:i("interests_p2")}}}o.addEventListener("click",()=>{const i=e();if(!i)return;const l=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><strong>Name:</strong> ${i.name}</div>
        <div><strong>Title:</strong> ${i.title}</div>
        <div><strong>Tagline:</strong> ${i.tagline}</div>
        <div><strong>Email:</strong> ${i.email}</div>
        <div><strong>Phone:</strong> ${i.phone}</div>
        <div><strong>Location:</strong> ${i.location}</div>
        <div><strong>Summary:</strong> ${i.summary}</div>
        <div><strong>Social:</strong> ${i.social.map(m=>`<a href="${m.url}" target="_blank" style="color:var(--primary);">${m.label}</a>`).join(", ")}</div>
      </div>
    `;I("Profile Preview",l)}),s.addEventListener("click",()=>{const i=e();i&&(k(i,"profile.json"),y("export","profile","Exported profile.json"),c("profile.json exported — commit it to your repo to update the live site"))}),d.addEventListener("click",()=>{const i=e();i&&T("profile",()=>B("public/data/profile.json",JSON.stringify(i,null,2),"Update profile from PortfolioOS"))})}function S(n,t){return`<div class="page-header"><h2>${n}</h2><p>${t}</p></div>`}function x(n,t){return`<h3><i class="fa-solid ${n}" style="margin-right:8px;color:var(--primary);"></i> ${t}</h3>`}function C(n){return`https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/${n}`}function L(n,t){return`
    <div style="display:flex;gap:6px;">
      ${t?`<a href="${C(t)}" target="_blank" class="btn btn-ghost btn-sm" title="View on GitHub"><i class="fa-brands fa-github"></i></a>`:""}
      <button class="btn btn-primary btn-sm" id="addBtn"><i class="fa-solid fa-plus"></i> ${n}</button>
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
    </div>`}function j(n,t,a){document.getElementById("exportBtn")?.addEventListener("click",()=>{t(),y("export",n,`Exported ${n}.json`)}),document.getElementById("publishBtn")?.addEventListener("click",()=>{a?T(n,a):c("Publish not configured for this module","error")})}function T(n,t){I("Confirm Publish",`<p style="color:var(--text-secondary);line-height:1.6;">This will commit your changes directly to the <strong>master</strong> branch on GitHub. A new deploy will be triggered automatically.</p>
     <p style="margin-top:12px;font-size:0.85rem;color:var(--text-muted);">Make sure you have configured your GitHub token in <strong>Settings → GitHub Integration</strong>.</p>`,`<button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
     <button class="btn btn-primary" id="confirmPublishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish Now</button>`),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("confirmPublishBtn").addEventListener("click",()=>{g(),t()})}function A(n,t="Edit"){return n.length===0?'<div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No entries yet</h3><p>Add your first entry to get started</p></div>':n.map((a,o)=>`
    <div class="item-card" style="margin-bottom:8px;">
      <div class="item-card-left">
        <div class="item-card-title">${a.title}</div>
        <div class="item-card-sub">${a.sub}</div>
        ${a.meta?`<div class="item-card-meta">${a.meta}</div>`:""}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-secondary btn-sm edit-btn" data-index="${o}"><i class="fa-solid fa-pen"></i> ${t}</button>
        <button class="btn btn-danger btn-sm delete-btn" data-index="${o}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `).join("")}function Y(n){let t=[];n.innerHTML=`
    ${S("Experience","Manage your work history entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-briefcase","Experience")}
        ${L("Add Entry","experience.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/experience.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.role,sub:`${e.company} · ${e.period}`,meta:`${e.tasks.length} tasks · ${e.location}`}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{const i=parseInt(e.getAttribute("data-index"));t.splice(i,1),o(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>{d(-1)}),j("experience",()=>{k(t,"experience.json"),c("experience.json exported")},()=>B("public/data/experience.json",JSON.stringify(t,null,2),"Update experience from PortfolioOS"));function d(e){const i=e<0,l=i?{role:"",company:"",period:"",type:"full-time",location:"",tasks:[""]}:{...t[e]},m=`
      <div class="form-group"><label>Role *</label><input class="form-input" id="f_role" value="${r(l.role)}" /></div>
      <div class="form-group"><label>Company *</label><input class="form-input" id="f_company" value="${r(l.company)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(l.period)}" placeholder="e.g. March 2022 - October 2024" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="full-time"${l.type==="full-time"?" selected":""}>Full-time</option>
          <option value="part-time"${l.type==="part-time"?" selected":""}>Part-time</option>
          <option value="contract"${l.type==="contract"?" selected":""}>Contract</option>
        </select>
      </div>
      <div class="form-group"><label>Location</label><input class="form-input" id="f_location" value="${r(l.location)}" /></div>
      <div class="form-group"><label>Tasks (one per line)</label><textarea class="form-input" id="f_tasks" rows="5">${r(l.tasks.join(`
`))}</textarea></div>
    `;I(i?"Add Experience Entry":"Edit Experience Entry",m,`
      <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
      <button class="btn btn-primary" id="modalSaveBtn">${i?"Add":"Save"}</button>
    `),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const p=document.getElementById("f_role").value.trim();if(!p){c("Role is required","error");return}const f=document.getElementById("f_tasks").value.split(`
`).map($=>$.trim()).filter(Boolean),E={role:p,company:document.getElementById("f_company").value.trim(),period:document.getElementById("f_period").value.trim(),type:document.getElementById("f_type").value,location:document.getElementById("f_location").value.trim(),tasks:f};i?t.push(E):t[e]=E,o(),g(),y("edit","experience",i?`Added "${E.role}"`:`Edited "${E.role}"`),c(i?"Entry added":"Entry saved")})}}function W(n){let t=[];n.innerHTML=`
    ${S("Projects","Manage your portfolio projects")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-diagram-project","Projects")}
        ${L("Add Project","projects.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/projects.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.name,sub:`${e.role} · ${e.period}`,meta:`${e.highlights.length} highlights · ${e.status}`}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),o(),c("Project removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),j("projects",()=>{k(t,"projects.json"),c("projects.json exported")},()=>B("public/data/projects.json",JSON.stringify(t,null,2),"Update projects from PortfolioOS"));function d(e){const i=e<0,l=i?{name:"",role:"",period:"",tag:"",image:"",url:"",summary:"",highlights:[""],status:"completed"}:{...t[e]},m=`
      <div class="form-group"><label>Project Name *</label><input class="form-input" id="f_name" value="${r(l.name)}" /></div>
      <div class="form-group"><label>Role</label><input class="form-input" id="f_role" value="${r(l.role)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(l.period)}" /></div>
      <div class="form-group"><label>Tag</label><input class="form-input" id="f_tag" value="${r(l.tag)}" /></div>
      <div class="form-group"><label>Image Path</label><input class="form-input" id="f_image" value="${r(l.image)}" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${r(l.url)}" /></div>
      <div class="form-group"><label>Summary</label><textarea class="form-input" id="f_summary" rows="4">${r(l.summary)}</textarea></div>
      <div class="form-group"><label>Highlights (one per line)</label><textarea class="form-input" id="f_highlights" rows="4">${r(l.highlights.join(`
`))}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-input" id="f_status">
          <option value="completed"${l.status==="completed"?" selected":""}>Completed</option>
          <option value="in-progress"${l.status==="in-progress"?" selected":""}>In Progress</option>
          <option value="planned"${l.status==="planned"?" selected":""}>Planned</option>
        </select>
      </div>
    `;I(i?"Add Project":"Edit Project",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim();if(!u){c("Project name is required","error");return}const p={name:u,role:v("f_role"),period:v("f_period"),tag:v("f_tag"),image:v("f_image"),url:v("f_url"),summary:_("f_summary"),highlights:_("f_highlights").split(`
`).map(f=>f.trim()).filter(Boolean),status:document.getElementById("f_status").value};i?t.push(p):t[e]=p,o(),g(),y("edit","projects",i?`Added "${p.name}"`:`Edited "${p.name}"`),c(i?"Project added":"Project saved")})}}function Q(n){let t=[];n.innerHTML=`
    ${S("Education","Manage your education and certifications entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-graduation-cap","Education")}
        ${L("Add Entry","education.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/education.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.degree,sub:`${e.institution} · ${e.field}`,meta:e.period}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),o(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),j("education",()=>{k(t,"education.json"),c("education.json exported")},()=>B("public/data/education.json",JSON.stringify(t,null,2),"Update education from PortfolioOS"));function d(e){const i=e<0,l=i?{institution:"",degree:"",field:"",period:"",type:"degree"}:{...t[e]},m=`
      <div class="form-group"><label>Institution *</label><input class="form-input" id="f_institution" value="${r(l.institution)}" /></div>
      <div class="form-group"><label>Degree *</label><input class="form-input" id="f_degree" value="${r(l.degree)}" /></div>
      <div class="form-group"><label>Field of Study</label><input class="form-input" id="f_field" value="${r(l.field)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(l.period)}" placeholder="e.g. 2012 - 2017" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="degree"${l.type==="degree"?" selected":""}>Degree</option>
          <option value="certification"${l.type==="certification"?" selected":""}>Certification</option>
          <option value="diploma"${l.type==="diploma"?" selected":""}>Diploma</option>
        </select>
      </div>
    `;I(i?"Add Education Entry":"Edit Education Entry",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_institution").value.trim(),p=document.getElementById("f_degree").value.trim();if(!u||!p){c("Institution and degree are required","error");return}const f={institution:u,degree:p,field:v("f_field"),period:v("f_period"),type:document.getElementById("f_type").value};i?t.push(f):t[e]=f,o(),g(),y("edit","education",i?`Added "${f.degree}"`:`Edited "${f.degree}"`),c(i?"Entry added":"Entry saved")})}}function X(n){let t={programming:[],professional:[]};n.innerHTML=`
    ${S("Skills","Manage your technical and professional skills")}
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${x("fa-code","Programming Skills")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="addProgBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>
      <div class="content-card-body" id="progList"></div>
    </div>
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${x("fa-briefcase","Professional Skills")}
      </div>
      <div class="content-card-body" id="profContainer"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <a href="${C("skills.json")}" target="_blank" class="btn btn-ghost btn-sm" title="View on GitHub"><i class="fa-brands fa-github"></i></a>
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
    </div>
  `;const a=document.getElementById("progList"),o=document.getElementById("profContainer");b("data/skills.json").then(e=>{t=e,s()});function s(){a.innerHTML=t.programming.length===0?'<div class="empty-state"><i class="fa-solid fa-code"></i><h3>No programming skills</h3><p>Add your first skill</p></div>':t.programming.map((e,i)=>`
        <div class="item-card" style="margin-bottom:6px;">
          <div class="item-card-left">
            <div class="item-card-title"><i class="${e.icon}" style="margin-right:6px;color:var(--primary);"></i>${e.name}</div>
            <div class="item-card-sub">${e.category}</div>
          </div>
          <div class="item-card-actions">
            <button class="btn btn-secondary btn-sm edit-prog" data-index="${i}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger btn-sm del-prog" data-index="${i}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `).join(""),a.querySelectorAll(".edit-prog").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".del-prog").forEach(e=>e.addEventListener("click",()=>{t.programming.splice(parseInt(e.getAttribute("data-index")),1),s(),c("Skill removed")})),o.innerHTML=`
      <textarea class="form-input" id="profSkills" rows="6">${t.professional.join(`
`)}</textarea>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">One skill per line</div>
    `}document.getElementById("addProgBtn").addEventListener("click",()=>d(-1)),document.getElementById("exportBtn").addEventListener("click",()=>{const e=document.getElementById("profSkills").value.split(`
`).map(l=>l.trim()).filter(Boolean),i={...t,professional:e};k(i,"skills.json"),y("export","skills","Exported skills.json"),c("skills.json exported")}),document.getElementById("publishBtn").addEventListener("click",()=>{const e=document.getElementById("profSkills").value.split(`
`).map(l=>l.trim()).filter(Boolean),i={...t,professional:e};T("skills",()=>B("public/data/skills.json",JSON.stringify(i,null,2),"Update skills from PortfolioOS"))});function d(e){const i=e<0,l=i?{name:"",icon:"fa-solid fa-code",category:"frontend"}:{...t.programming[e]},m=`
      <div class="form-group"><label>Skill Name *</label><input class="form-input" id="f_name" value="${r(l.name)}" /></div>
      <div class="form-group"><label>Icon class</label><input class="form-input" id="f_icon" value="${r(l.icon)}" placeholder="e.g. fab fa-html5" /></div>
      <div class="form-group"><label>Category</label>
        <select class="form-input" id="f_category">
          <option value="frontend"${l.category==="frontend"?" selected":""}>Frontend</option>
          <option value="backend"${l.category==="backend"?" selected":""}>Backend</option>
          <option value="tools"${l.category==="tools"?" selected":""}>Tools</option>
        </select>
      </div>
    `;I(i?"Add Programming Skill":"Edit Programming Skill",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim();if(!u){c("Skill name is required","error");return}const p={name:u,icon:v("f_icon"),category:document.getElementById("f_category").value};i?t.programming.push(p):t.programming[e]=p,s(),g(),y("edit","skills",i?`Added skill "${p.name}"`:`Edited skill "${p.name}"`),c(i?"Skill added":"Skill saved")})}}function Z(n){let t=[];n.innerHTML=`
    ${S("Certifications","Manage your certifications and credentials")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-certificate","Certifications")}
        ${L("Add Certification","certifications.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/certifications.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.name,sub:e.issuer,meta:e.date}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),o(),c("Certification removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),j("certifications",()=>{k(t,"certifications.json"),c("certifications.json exported")},()=>B("public/data/certifications.json",JSON.stringify(t,null,2),"Update certifications from PortfolioOS"));function d(e){const i=e<0,l=i?{name:"",issuer:"",date:"",url:"",description:""}:{...t[e]},m=`
      <div class="form-group"><label>Certification Name *</label><input class="form-input" id="f_name" value="${r(l.name)}" /></div>
      <div class="form-group"><label>Issuer *</label><input class="form-input" id="f_issuer" value="${r(l.issuer)}" /></div>
      <div class="form-group"><label>Date</label><input class="form-input" id="f_date" value="${r(l.date)}" placeholder="e.g. 2016 or Ongoing" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${r(l.url)}" /></div>
      <div class="form-group"><label>Description</label><textarea class="form-input" id="f_description" rows="3">${r(l.description)}</textarea></div>
    `;I(i?"Add Certification":"Edit Certification",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim(),p=document.getElementById("f_issuer").value.trim();if(!u||!p){c("Name and issuer are required","error");return}const f={name:u,issuer:p,date:v("f_date"),url:v("f_url"),description:_("f_description")};i?t.push(f):t[e]=f,o(),g(),y("edit","certifications",i?`Added "${f.name}"`:`Edited "${f.name}"`),c(i?"Certification added":"Certification saved")})}}function ee(n){let t={};n.innerHTML=`
    ${S("Settings","Configure your site-wide settings")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-gear","Site Settings")}
        <div style="display:flex;gap:6px;">
          <a href="${C("settings.json")}" target="_blank" class="btn btn-ghost btn-sm" title="View on GitHub"><i class="fa-brands fa-github"></i></a>
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;const a=document.getElementById("formContainer");b("data/settings.json").then(s=>{t=s;const d=D();a.innerHTML=`
      <div class="form-group"><label>Site Title</label><input class="form-input" id="f_siteTitle" value="${r(s.siteTitle)}" /></div>
      <div class="form-group"><label>Site Description</label><textarea class="form-input" id="f_siteDescription" rows="2">${r(s.siteDescription)}</textarea></div>
      <div class="form-group"><label>Site URL</label><input class="form-input" id="f_siteUrl" value="${r(s.siteUrl)}" /></div>
      <div class="form-group"><label>Copyright</label><input class="form-input" id="f_copyright" value="${r(s.copyright)}" /></div>
      <div style="display:flex;gap:16px;margin-top:12px;">
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_showContactForm" ${s.showContactForm?"checked":""} />
          Show contact form
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_emailNotifications" ${s.emailNotifications?"checked":""} />
          Email notifications
        </label>
      </div>
      <div style="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;">
        <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">GITHUB INTEGRATION</label>
        <div class="form-group">
          <label>Personal Access Token</label>
          <input class="form-input" id="f_ghToken" type="password" value="${r(d)}" placeholder="ghp_..." />
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">
            Stored locally in browser — never saved to JSON.
            <a href="https://github.com/settings/tokens" target="_blank" style="color:var(--primary);">Create a token</a> with <code>repo</code> scope.
          </div>
        </div>
        <button class="btn btn-primary btn-sm" id="saveGhTokenBtn"><i class="fa-solid fa-floppy-disk"></i> Save Token</button>
      </div>
    `,document.getElementById("saveGhTokenBtn").addEventListener("click",()=>{const e=document.getElementById("f_ghToken").value.trim();e&&(ne(e),c("GitHub token saved locally"))})});function o(){return{...t,siteTitle:v("f_siteTitle"),siteDescription:_("f_siteDescription"),siteUrl:v("f_siteUrl"),copyright:v("f_copyright"),showContactForm:document.getElementById("f_showContactForm").checked,emailNotifications:document.getElementById("f_emailNotifications").checked}}document.getElementById("exportBtn").addEventListener("click",()=>{k(o(),"settings.json"),y("export","settings","Exported settings.json"),c("settings.json exported")}),document.getElementById("publishBtn").addEventListener("click",()=>{T("settings",()=>B("public/data/settings.json",JSON.stringify(o(),null,2),"Update settings from PortfolioOS"))})}function O(n){let t={};n.innerHTML=`
    ${S("Contact","Configure your contact form settings")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-envelope","Contact Settings")}
        <div style="display:flex;gap:6px;">
          <a href="${C("contact.json")}" target="_blank" class="btn btn-ghost btn-sm" title="View on GitHub"><i class="fa-brands fa-github"></i></a>
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;const a=document.getElementById("formContainer");b("data/contact.json").then(s=>{t=s;let d=`
      <div class="form-group"><label>Formspree Form ID</label><input class="form-input" id="f_formspreeId" value="${r(s.formspreeId)}" placeholder="e.g. xvzjvbdg" /></div>
      <div class="form-group"><label>Recipient Email</label><input class="form-input" id="f_recipientEmail" value="${r(s.recipientEmail)}" type="email" /></div>
      <div class="form-group"><label>Success Message</label><textarea class="form-input" id="f_successMessage" rows="2">${r(s.successMessage)}</textarea></div>
      <div style="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;">
        <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">FORM FIELDS</label>
    `;Object.entries(s.fields).forEach(([e,i])=>{d+=`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <input type="text" class="form-input" id="f_field_${e}_label" value="${r(i.label)}" style="flex:1;" placeholder="Label" />
          <label style="display:flex;align-items:center;gap:4px;font-size:0.8rem;white-space:nowrap;cursor:pointer;">
            <input type="checkbox" id="f_field_${e}_required" ${i.required?"checked":""} /> Required
          </label>
          <button class="btn btn-danger btn-sm remove-field" data-key="${e}"><i class="fa-solid fa-xmark"></i></button>
        </div>`}),d+=`
        <button class="btn btn-secondary btn-sm" id="addFieldBtn"><i class="fa-solid fa-plus"></i> Add Field</button>
      </div>
    `,a.innerHTML=d,a.querySelectorAll(".remove-field").forEach(e=>e.addEventListener("click",()=>{const i=e.getAttribute("data-key");delete t.fields[i],b("data/contact.json").then(l=>{t=l,o(),O(n)})})),document.getElementById("addFieldBtn").addEventListener("click",()=>{const e=prompt("Field key (e.g. phone, company):");e&&(t.fields[e]={label:e.charAt(0).toUpperCase()+e.slice(1),required:!1},O(n))})});function o(){t.formspreeId=v("f_formspreeId"),t.recipientEmail=v("f_recipientEmail"),t.successMessage=_("f_successMessage"),Object.keys(t.fields).forEach(s=>{const d=document.getElementById(`f_field_${s}_label`),e=document.getElementById(`f_field_${s}_required`);d&&(t.fields[s].label=d.value),e&&(t.fields[s].required=e.checked)})}document.getElementById("exportBtn").addEventListener("click",()=>{o(),k(t,"contact.json"),y("export","contact","Exported contact.json"),c("contact.json exported")}),document.getElementById("publishBtn").addEventListener("click",()=>{o(),T("contact",()=>B("public/data/contact.json",JSON.stringify(t,null,2),"Update contact from PortfolioOS"))})}function te(n){let t=[];n.innerHTML=`
    ${S("SEO","Manage meta titles and descriptions per page")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-magnifying-glass","SEO Entries")}
        ${L("Add Entry","seo.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/seo.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.page,sub:e.title,meta:e.description}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),o(),c("SEO entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),j("seo",()=>{k(t,"seo.json"),c("seo.json exported")},()=>B("public/data/seo.json",JSON.stringify(t,null,2),"Update SEO from PortfolioOS"));function d(e){const i=e<0,l=i?{page:"",title:"",description:"",ogImage:""}:{...t[e]},m=`
      <div class="form-group"><label>Page *</label>
        <select class="form-input" id="f_page">
          ${["home","resume","projects","contact","about"].map(u=>`<option value="${u}"${l.page===u?" selected":""}>${u.charAt(0).toUpperCase()+u.slice(1)}</option>`).join("")}
        </select>
      </div>
      <div class="form-group"><label>Meta Title *</label><input class="form-input" id="f_title" value="${r(l.title)}" /></div>
      <div class="form-group"><label>Meta Description</label><textarea class="form-input" id="f_description" rows="3">${r(l.description)}</textarea></div>
      <div class="form-group"><label>OG Image URL</label><input class="form-input" id="f_ogImage" value="${r(l.ogImage||"")}" placeholder="Relative or absolute URL" /></div>
    `;I(i?"Add SEO Entry":"Edit SEO Entry",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_title").value.trim();if(!u){c("Meta title is required","error");return}const p={page:document.getElementById("f_page").value,title:u,description:_("f_description"),ogImage:v("f_ogImage")};i?t.push(p):t[e]=p,o(),g(),y("edit","seo",i?`Added SEO for "${p.page}"`:`Edited SEO for "${p.page}"`),c(i?"SEO entry added":"SEO entry saved")})}}function ie(n){let t=[];n.innerHTML=`
    ${S("Articles","Manage your articles and blog posts")}
    <div class="content-card">
      <div class="content-card-header">
        ${x("fa-newspaper","Articles")}
        ${L("Add Article","articles.json")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const a=document.getElementById("listContainer");b("data/articles.json").then(e=>{t=e,o()});function o(){a.innerHTML=A(t.map(e=>({title:e.title,sub:e.slug?`/${e.slug}`:"—",meta:`${e.published||"Draft"} · ${(e.tags||[]).join(", ")}`}))),s()}function s(){a.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),a.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),o(),c("Article removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),j("articles",()=>{k(t,"articles.json"),c("articles.json exported")},()=>B("public/data/articles.json",JSON.stringify(t,null,2),"Update articles from PortfolioOS"));function d(e){const i=e<0,l=i?{title:"",slug:"",excerpt:"",content:"",published:"",tags:[]}:{...t[e]},m=`
      <div class="form-group"><label>Title *</label><input class="form-input" id="f_title" value="${r(l.title)}" /></div>
      <div class="form-group"><label>Slug</label><input class="form-input" id="f_slug" value="${r(l.slug)}" placeholder="e.g. my-article-slug" /></div>
      <div class="form-group"><label>Published Date</label><input class="form-input" id="f_published" value="${r(l.published||"")}" type="date" /></div>
      <div class="form-group"><label>Tags (comma-separated)</label><input class="form-input" id="f_tags" value="${r((l.tags||[]).join(", "))}" placeholder="e.g. project, career, tech" /></div>
      <div class="form-group"><label>Excerpt</label><textarea class="form-input" id="f_excerpt" rows="3">${r(l.excerpt)}</textarea></div>
      <div class="form-group"><label>Content (Markdown)</label><textarea class="form-input" id="f_content" rows="10">${r(l.content)}</textarea></div>
    `;I(i?"Add Article":"Edit Article",m,w(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_title").value.trim();if(!u){c("Title is required","error");return}const p=document.getElementById("f_tags").value,f={title:u,slug:v("f_slug"),excerpt:_("f_excerpt"),content:_("f_content"),published:v("f_published"),tags:p.split(",").map(E=>E.trim()).filter(Boolean)};i?t.push(f):t[e]=f,o(),g(),y("edit","articles",i?`Added article "${f.title}"`:`Edited article "${f.title}"`),c(i?"Article added":"Article saved")})}}const G="portfolioos_gh_token";function D(){return localStorage.getItem(G)||""}function ne(n){localStorage.setItem(G,n)}async function B(n,t,a){const o=D();if(!o){c("GitHub token not configured — set one in Settings","error");return}const s="EddyKasila",d="cv-portfolio",e="master",i=`https://api.github.com/repos/${s}/${d}/contents/${n}`,l=btoa(unescape(encodeURIComponent(t))),m=a||`Update ${n} from PortfolioOS admin`;c("Saving to GitHub...","success");try{let u;try{const $=await fetch(`${i}?ref=${e}`,{headers:{Authorization:`token ${o}`,Accept:"application/vnd.github.v3+json"}});$.ok&&(u=(await $.json()).sha)}catch{}const p={message:m,content:l,branch:e};u&&(p.sha=u);const f=await fetch(i,{method:"PUT",headers:{Authorization:`token ${o}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify(p)});if(!f.ok){const $=await f.json().catch(()=>({}));throw new Error($.message||`GitHub API returned ${f.status}`)}const E=n.replace("public/data/","").replace(".json","");y("publish",E,`Published ${n} to GitHub`),c(`Published to GitHub: ${n}`)}catch(u){c(`GitHub publish failed: ${u.message}`,"error")}}function r(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function v(n){return document.getElementById(n)?.value?.trim()||""}function _(n){return document.getElementById(n)?.value?.trim()||""}function w(n){return`
    <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
    <button class="btn btn-primary" id="modalSaveBtn">${n?"Add":"Save"}</button>
  `}h.register({id:"dashboard",label:"Dashboard",icon:"fa-gauge-high",enabled:!0,render:V});h.register({id:"profile",label:"Profile",icon:"fa-user",enabled:!0,render:K});h.register({id:"experience",label:"Experience",icon:"fa-briefcase",enabled:!0,render:Y});h.register({id:"projects",label:"Projects",icon:"fa-diagram-project",enabled:!0,render:W});h.register({id:"education",label:"Education",icon:"fa-graduation-cap",enabled:!0,render:Q});h.register({id:"skills",label:"Skills",icon:"fa-code",enabled:!0,render:X});h.register({id:"certifications",label:"Certifications",icon:"fa-certificate",enabled:!0,render:Z});h.register({id:"settings",label:"Settings",icon:"fa-gear",enabled:!0,render:ee});h.register({id:"articles",label:"Articles",icon:"fa-newspaper",enabled:!0,render:ie});h.register({id:"contact",label:"Contact",icon:"fa-envelope",enabled:!0,render:O});h.register({id:"seo",label:"SEO",icon:"fa-magnifying-glass",enabled:!0,render:te});h.boot();const R=document.getElementById("sidebar"),H=document.getElementById("sidebarOverlay");document.getElementById("mobileNavToggle").addEventListener("click",()=>{R.classList.toggle("open"),H.classList.toggle("open")});H.addEventListener("click",()=>{R.classList.remove("open"),H.classList.remove("open")});
