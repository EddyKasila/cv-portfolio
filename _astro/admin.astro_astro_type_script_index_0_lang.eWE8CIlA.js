const S="portfolioos_auth";class P{modules=[];activeModule=null;sidebarEl;contentEl;register(e){this.modules.push(e)}boot(){this.checkAuth()&&(this.sidebarEl=document.getElementById("sidebarNav"),this.contentEl=document.getElementById("adminContent"),this.renderSidebar(),this.navigateTo("dashboard"))}checkAuth(){const e=localStorage.getItem(S);if(!e)return this.redirectToLogin(),!1;try{const{expiry:n}=JSON.parse(e);return Date.now()<n?!0:(localStorage.removeItem(S),this.redirectToLogin(),!1)}catch{return this.redirectToLogin(),!1}}redirectToLogin(){const e=document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/",n=e.endsWith("/")?e:e+"/";window.location.href=`${n}login/`}renderSidebar(){this.sidebarEl.innerHTML=`
      <div class="sidebar-group">
        ${this.modules.map(e=>`
          <button class="sidebar-item${e.enabled?"":" disabled"}" data-module="${e.id}" ${e.enabled?"":"disabled"}>
            <i class="fa-solid ${e.icon}"></i>
            <span>${e.label}</span>
            ${e.enabled?"":'<span class="badge">Soon</span>'}
          </button>
        `).join("")}
      </div>
    `,this.sidebarEl.querySelectorAll(".sidebar-item:not(.disabled)").forEach(e=>{e.addEventListener("click",()=>this.navigateTo(e.getAttribute("data-module")))}),document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem(S),this.redirectToLogin()})}navigateTo(e){const n=this.modules.find(s=>s.id===e);if(!n||!n.enabled||!n.render)return;this.activeModule=e,this.sidebarEl.querySelectorAll(".sidebar-item").forEach(s=>s.classList.remove("active"));const a=this.sidebarEl.querySelector(`[data-module="${e}"]`);a&&a.classList.add("active"),this.contentEl.innerHTML="",n.render(this.contentEl)}}const b=new P;function M(){return document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/"}async function y(o){const n=`${M().replace(/\/+$/,"")}/${o.replace(/^\/+/,"")}`,a=await fetch(n);if(!a.ok)throw new Error(`Failed to fetch ${n}: ${a.status}`);return a.json()}function E(o,e){const n=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),a=URL.createObjectURL(n),s=document.createElement("a");s.href=a,s.download=e,s.click(),URL.revokeObjectURL(a)}function c(o,e="success"){const n=document.getElementById("toast");n.className=`toast toast-${e}`;const a=e==="success"?"fa-check-circle":"fa-exclamation-circle";n.innerHTML=`<i class="fa-solid ${a}"></i> ${o}`,requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>n.classList.remove("show"),3e3)}function x(o,e,n){const a=document.getElementById("modalOverlay"),s=document.getElementById("modalContent");s.innerHTML=`
    <div class="modal-header">
      <h3>${o}</h3>
      <button class="modal-close" id="modalCloseBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">${e}</div>
    ${n?`<div class="modal-footer">${n}</div>`:""}
  `,a.classList.add("open"),document.getElementById("modalCloseBtn")?.addEventListener("click",g),a.addEventListener("click",u=>{u.target===a&&g()})}function g(){document.getElementById("modalOverlay").classList.remove("open")}function T(o){const e=document.createElement("div");e.className="form-group";const n=document.createElement("label");if(n.htmlFor=o.id,n.textContent=o.label,o.required){const s=document.createElement("span");s.style.color="var(--danger)",s.textContent=" *",n.appendChild(s)}e.appendChild(n);let a;if(o.multiline?(a=document.createElement("textarea"),a.rows=o.rows||4):(a=document.createElement("input"),a.type=o.type||"text"),a.id=o.id,a.name=o.id,a.value=o.value||"",o.placeholder&&(a.placeholder=o.placeholder),o.required&&(a.required=!0),a.className="form-input",e.appendChild(a),o.helpText){const s=document.createElement("div");s.style.cssText="font-size:0.75rem;color:var(--text-muted);margin-top:4px;",s.textContent=o.helpText,e.appendChild(s)}return e}function H(o){o.innerHTML=`
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
  `,Promise.all([y("data/profile.json"),y("data/experience.json"),y("data/projects.json"),y("data/education.json")]).then(([e,n,a,s])=>{document.getElementById("statProfile").textContent=e.name||"—",document.getElementById("statExperience").textContent=`${n.length} entries`,document.getElementById("statProjects").textContent=`${a.length} projects`,document.getElementById("statEducation").textContent=`${s.length} entries`})}function q(o){let e=null;o.innerHTML=`
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
  `;const n=document.getElementById("profileForm"),a=document.getElementById("previewBtn"),s=document.getElementById("exportBtn"),u=document.getElementById("githubBtn");y("data/profile.json").then(i=>{e={...i},[{id:"name",label:"Full Name",value:i.name,required:!0},{id:"title",label:"Professional Title",value:i.title,required:!0},{id:"tagline",label:"Tagline",value:i.tagline},{id:"email",label:"Email",value:i.email,type:"email",required:!0},{id:"phone",label:"Phone",value:i.phone},{id:"location",label:"Location",value:i.location},{id:"address",label:"Full Address",value:i.address},{id:"photo",label:"Photo Path",value:i.photo,helpText:"Relative path from public/, e.g. /assets/img/profile.jpg"},{id:"resumeUrl",label:"Resume Download URL",value:i.resumeUrl,helpText:"Relative path to PDF in public/"},{id:"summary",label:"Professional Summary",value:i.summary,multiline:!0,rows:6}].forEach(f=>n.appendChild(T(f)));const r=document.createElement("div");r.style.cssText="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;";const m=document.createElement("label");m.style.cssText="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;",m.textContent="SOCIAL LINKS",r.appendChild(m),i.social.forEach((f,L)=>{const k=document.createElement("div");k.style.cssText="display:flex;align-items:center;gap:8px;margin-bottom:8px;",k.innerHTML=`
        <span style="width:24px;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="${f.icon}"></i></span>
        <span style="width:60px;font-size:0.8rem;color:var(--text-secondary);">${f.label}</span>
        <input type="text" class="form-input" id="social_${L}_url" value="${f.url}" style="flex:1;" />
      `,r.appendChild(k)}),n.appendChild(r);const p=document.createElement("div");p.style.cssText="margin-top:16px;border-top:1px solid var(--border-light);padding-top:16px;",p.innerHTML='<label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">INTERESTS / ABOUT</label>',n.appendChild(p),n.appendChild(T({id:"interests_p1",label:"Interest Paragraph 1",value:i.interests.p1,multiline:!0,rows:3})),n.appendChild(T({id:"interests_p2",label:"Interest Paragraph 2",value:i.interests.p2,multiline:!0,rows:3})),a.disabled=!1,s.disabled=!1});function t(){if(!e)return null;const i=r=>document.getElementById(r)?.value||"",l=e.social.map((r,m)=>({...r,url:document.getElementById(`social_${m}_url`)?.value||r.url}));return{...e,name:i("name"),title:i("title"),tagline:i("tagline"),email:i("email"),phone:i("phone"),location:i("location"),address:i("address"),photo:i("photo"),resumeUrl:i("resumeUrl"),summary:i("summary"),social:l,interests:{p1:i("interests_p1"),p2:i("interests_p2")}}}a.addEventListener("click",()=>{const i=t();if(!i)return;const l=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div><strong>Name:</strong> ${i.name}</div>
        <div><strong>Title:</strong> ${i.title}</div>
        <div><strong>Tagline:</strong> ${i.tagline}</div>
        <div><strong>Email:</strong> ${i.email}</div>
        <div><strong>Phone:</strong> ${i.phone}</div>
        <div><strong>Location:</strong> ${i.location}</div>
        <div><strong>Summary:</strong> ${i.summary}</div>
        <div><strong>Social:</strong> ${i.social.map(r=>`<a href="${r.url}" target="_blank" style="color:var(--primary);">${r.label}</a>`).join(", ")}</div>
      </div>
    `;x("Profile Preview",l)}),s.addEventListener("click",()=>{const i=t();i&&(E(i,"profile.json"),c("profile.json exported — commit it to your repo to update the live site"))}),u.addEventListener("click",()=>{window.open("https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/profile.json","_blank")})}function $(o,e){return`<div class="page-header"><h2>${o}</h2><p>${e}</p></div>`}function h(o,e){return`<h3><i class="fa-solid ${o}" style="margin-right:8px;color:var(--primary);"></i> ${e}</h3>`}function _(o){return`
    <div style="display:flex;gap:6px;">
      <button class="btn btn-primary btn-sm" id="addBtn"><i class="fa-solid fa-plus"></i> ${o}</button>
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
    </div>`}function B(o,e){document.getElementById("exportBtn")?.addEventListener("click",o),document.getElementById("githubBtn")?.addEventListener("click",()=>window.open(e,"_blank"))}function j(o,e="Edit"){return o.length===0?'<div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No entries yet</h3><p>Add your first entry to get started</p></div>':o.map((n,a)=>`
    <div class="item-card" style="margin-bottom:8px;">
      <div class="item-card-left">
        <div class="item-card-title">${n.title}</div>
        <div class="item-card-sub">${n.sub}</div>
        ${n.meta?`<div class="item-card-meta">${n.meta}</div>`:""}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-secondary btn-sm edit-btn" data-index="${a}"><i class="fa-solid fa-pen"></i> ${e}</button>
        <button class="btn btn-danger btn-sm delete-btn" data-index="${a}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `).join("")}function N(o){let e=[];o.innerHTML=`
    ${$("Experience","Manage your work history entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${h("fa-briefcase","Experience")}
        ${_("Add Entry")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");y("data/experience.json").then(t=>{e=t,a()});function a(){n.innerHTML=j(e.map(t=>({title:t.role,sub:`${t.company} · ${t.period}`,meta:`${t.tasks.length} tasks · ${t.location}`}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(t=>t.addEventListener("click",()=>u(parseInt(t.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(t=>t.addEventListener("click",()=>{const i=parseInt(t.getAttribute("data-index"));e.splice(i,1),a(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>{u(-1)}),B(()=>{E(e,"experience.json"),c("experience.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/experience.json");function u(t){const i=t<0,l=i?{role:"",company:"",period:"",type:"full-time",location:"",tasks:[""]}:{...e[t]},r=`
      <div class="form-group"><label>Role *</label><input class="form-input" id="f_role" value="${d(l.role)}" /></div>
      <div class="form-group"><label>Company *</label><input class="form-input" id="f_company" value="${d(l.company)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${d(l.period)}" placeholder="e.g. March 2022 - October 2024" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="full-time"${l.type==="full-time"?" selected":""}>Full-time</option>
          <option value="part-time"${l.type==="part-time"?" selected":""}>Part-time</option>
          <option value="contract"${l.type==="contract"?" selected":""}>Contract</option>
        </select>
      </div>
      <div class="form-group"><label>Location</label><input class="form-input" id="f_location" value="${d(l.location)}" /></div>
      <div class="form-group"><label>Tasks (one per line)</label><textarea class="form-input" id="f_tasks" rows="5">${d(l.tasks.join(`
`))}</textarea></div>
    `;x(i?"Add Experience Entry":"Edit Experience Entry",r,`
      <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
      <button class="btn btn-primary" id="modalSaveBtn">${i?"Add":"Save"}</button>
    `),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const p=document.getElementById("f_role").value.trim();if(!p){c("Role is required","error");return}const f=document.getElementById("f_tasks").value.split(`
`).map(k=>k.trim()).filter(Boolean),L={role:p,company:document.getElementById("f_company").value.trim(),period:document.getElementById("f_period").value.trim(),type:document.getElementById("f_type").value,location:document.getElementById("f_location").value.trim(),tasks:f};i?e.push(L):e[t]=L,a(),g(),c(i?"Entry added":"Entry saved")})}}function D(o){let e=[];o.innerHTML=`
    ${$("Projects","Manage your portfolio projects")}
    <div class="content-card">
      <div class="content-card-header">
        ${h("fa-diagram-project","Projects")}
        ${_("Add Project")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");y("data/projects.json").then(t=>{e=t,a()});function a(){n.innerHTML=j(e.map(t=>({title:t.name,sub:`${t.role} · ${t.period}`,meta:`${t.highlights.length} highlights · ${t.status}`}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(t=>t.addEventListener("click",()=>u(parseInt(t.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(t=>t.addEventListener("click",()=>{e.splice(parseInt(t.getAttribute("data-index")),1),a(),c("Project removed")}))}document.getElementById("addBtn").addEventListener("click",()=>u(-1)),B(()=>{E(e,"projects.json"),c("projects.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/projects.json");function u(t){const i=t<0,l=i?{name:"",role:"",period:"",tag:"",image:"",url:"",summary:"",highlights:[""],status:"completed"}:{...e[t]},r=`
      <div class="form-group"><label>Project Name *</label><input class="form-input" id="f_name" value="${d(l.name)}" /></div>
      <div class="form-group"><label>Role</label><input class="form-input" id="f_role" value="${d(l.role)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${d(l.period)}" /></div>
      <div class="form-group"><label>Tag</label><input class="form-input" id="f_tag" value="${d(l.tag)}" /></div>
      <div class="form-group"><label>Image Path</label><input class="form-input" id="f_image" value="${d(l.image)}" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${d(l.url)}" /></div>
      <div class="form-group"><label>Summary</label><textarea class="form-input" id="f_summary" rows="4">${d(l.summary)}</textarea></div>
      <div class="form-group"><label>Highlights (one per line)</label><textarea class="form-input" id="f_highlights" rows="4">${d(l.highlights.join(`
`))}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-input" id="f_status">
          <option value="completed"${l.status==="completed"?" selected":""}>Completed</option>
          <option value="in-progress"${l.status==="in-progress"?" selected":""}>In Progress</option>
          <option value="planned"${l.status==="planned"?" selected":""}>Planned</option>
        </select>
      </div>
    `;x(i?"Add Project":"Edit Project",r,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const m=document.getElementById("f_name").value.trim();if(!m){c("Project name is required","error");return}const p={name:m,role:v("f_role"),period:v("f_period"),tag:v("f_tag"),image:v("f_image"),url:v("f_url"),summary:I("f_summary"),highlights:I("f_highlights").split(`
`).map(f=>f.trim()).filter(Boolean),status:document.getElementById("f_status").value};i?e.push(p):e[t]=p,a(),g(),c(i?"Project added":"Project saved")})}}function F(o){let e=[];o.innerHTML=`
    ${$("Education","Manage your education and certifications entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${h("fa-graduation-cap","Education")}
        ${_("Add Entry")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");y("data/education.json").then(t=>{e=t,a()});function a(){n.innerHTML=j(e.map(t=>({title:t.degree,sub:`${t.institution} · ${t.field}`,meta:t.period}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(t=>t.addEventListener("click",()=>u(parseInt(t.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(t=>t.addEventListener("click",()=>{e.splice(parseInt(t.getAttribute("data-index")),1),a(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>u(-1)),B(()=>{E(e,"education.json"),c("education.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/education.json");function u(t){const i=t<0,l=i?{institution:"",degree:"",field:"",period:"",type:"degree"}:{...e[t]},r=`
      <div class="form-group"><label>Institution *</label><input class="form-input" id="f_institution" value="${d(l.institution)}" /></div>
      <div class="form-group"><label>Degree *</label><input class="form-input" id="f_degree" value="${d(l.degree)}" /></div>
      <div class="form-group"><label>Field of Study</label><input class="form-input" id="f_field" value="${d(l.field)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${d(l.period)}" placeholder="e.g. 2012 - 2017" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="degree"${l.type==="degree"?" selected":""}>Degree</option>
          <option value="certification"${l.type==="certification"?" selected":""}>Certification</option>
          <option value="diploma"${l.type==="diploma"?" selected":""}>Diploma</option>
        </select>
      </div>
    `;x(i?"Add Education Entry":"Edit Education Entry",r,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const m=document.getElementById("f_institution").value.trim(),p=document.getElementById("f_degree").value.trim();if(!m||!p){c("Institution and degree are required","error");return}const f={institution:m,degree:p,field:v("f_field"),period:v("f_period"),type:document.getElementById("f_type").value};i?e.push(f):e[t]=f,a(),g(),c(i?"Entry added":"Entry saved")})}}function U(o){let e={programming:[],professional:[]};o.innerHTML=`
    ${$("Skills","Manage your technical and professional skills")}
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${h("fa-code","Programming Skills")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="addProgBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>
      <div class="content-card-body" id="progList"></div>
    </div>
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${h("fa-briefcase","Professional Skills")}
      </div>
      <div class="content-card-body" id="profContainer"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
    </div>
  `;const n=document.getElementById("progList"),a=document.getElementById("profContainer");y("data/skills.json").then(t=>{e=t,s()});function s(){n.innerHTML=e.programming.length===0?'<div class="empty-state"><i class="fa-solid fa-code"></i><h3>No programming skills</h3><p>Add your first skill</p></div>':e.programming.map((t,i)=>`
        <div class="item-card" style="margin-bottom:6px;">
          <div class="item-card-left">
            <div class="item-card-title"><i class="${t.icon}" style="margin-right:6px;color:var(--primary);"></i>${t.name}</div>
            <div class="item-card-sub">${t.category}</div>
          </div>
          <div class="item-card-actions">
            <button class="btn btn-secondary btn-sm edit-prog" data-index="${i}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger btn-sm del-prog" data-index="${i}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `).join(""),n.querySelectorAll(".edit-prog").forEach(t=>t.addEventListener("click",()=>u(parseInt(t.getAttribute("data-index"))))),n.querySelectorAll(".del-prog").forEach(t=>t.addEventListener("click",()=>{e.programming.splice(parseInt(t.getAttribute("data-index")),1),s(),c("Skill removed")})),a.innerHTML=`
      <textarea class="form-input" id="profSkills" rows="6">${e.professional.join(`
`)}</textarea>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">One skill per line</div>
    `}document.getElementById("addProgBtn").addEventListener("click",()=>u(-1)),B(()=>{const t=document.getElementById("profSkills").value.split(`
`).map(l=>l.trim()).filter(Boolean),i={...e,professional:t};E(i,"skills.json"),c("skills.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/skills.json");function u(t){const i=t<0,l=i?{name:"",icon:"fa-solid fa-code",category:"frontend"}:{...e.programming[t]},r=`
      <div class="form-group"><label>Skill Name *</label><input class="form-input" id="f_name" value="${d(l.name)}" /></div>
      <div class="form-group"><label>Icon class</label><input class="form-input" id="f_icon" value="${d(l.icon)}" placeholder="e.g. fab fa-html5" /></div>
      <div class="form-group"><label>Category</label>
        <select class="form-input" id="f_category">
          <option value="frontend"${l.category==="frontend"?" selected":""}>Frontend</option>
          <option value="backend"${l.category==="backend"?" selected":""}>Backend</option>
          <option value="tools"${l.category==="tools"?" selected":""}>Tools</option>
        </select>
      </div>
    `;x(i?"Add Programming Skill":"Edit Programming Skill",r,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const m=document.getElementById("f_name").value.trim();if(!m){c("Skill name is required","error");return}const p={name:m,icon:v("f_icon"),category:document.getElementById("f_category").value};i?e.programming.push(p):e.programming[t]=p,s(),g(),c(i?"Skill added":"Skill saved")})}}function R(o){let e=[];o.innerHTML=`
    ${$("Certifications","Manage your certifications and credentials")}
    <div class="content-card">
      <div class="content-card-header">
        ${h("fa-certificate","Certifications")}
        ${_("Add Certification")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");y("data/certifications.json").then(t=>{e=t,a()});function a(){n.innerHTML=j(e.map(t=>({title:t.name,sub:t.issuer,meta:t.date}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(t=>t.addEventListener("click",()=>u(parseInt(t.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(t=>t.addEventListener("click",()=>{e.splice(parseInt(t.getAttribute("data-index")),1),a(),c("Certification removed")}))}document.getElementById("addBtn").addEventListener("click",()=>u(-1)),B(()=>{E(e,"certifications.json"),c("certifications.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/certifications.json");function u(t){const i=t<0,l=i?{name:"",issuer:"",date:"",url:"",description:""}:{...e[t]},r=`
      <div class="form-group"><label>Certification Name *</label><input class="form-input" id="f_name" value="${d(l.name)}" /></div>
      <div class="form-group"><label>Issuer *</label><input class="form-input" id="f_issuer" value="${d(l.issuer)}" /></div>
      <div class="form-group"><label>Date</label><input class="form-input" id="f_date" value="${d(l.date)}" placeholder="e.g. 2016 or Ongoing" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${d(l.url)}" /></div>
      <div class="form-group"><label>Description</label><textarea class="form-input" id="f_description" rows="3">${d(l.description)}</textarea></div>
    `;x(i?"Add Certification":"Edit Certification",r,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const m=document.getElementById("f_name").value.trim(),p=document.getElementById("f_issuer").value.trim();if(!m||!p){c("Name and issuer are required","error");return}const f={name:m,issuer:p,date:v("f_date"),url:v("f_url"),description:I("f_description")};i?e.push(f):e[t]=f,a(),g(),c(i?"Certification added":"Certification saved")})}}function O(o){let e={};o.innerHTML=`
    ${$("Settings","Configure your site-wide settings")}
    <div class="content-card">
      <div class="content-card-header">
        ${h("fa-gear","Site Settings")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="githubBtn"><i class="fa-brands fa-github"></i> GitHub</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;const n=document.getElementById("formContainer");y("data/settings.json").then(a=>{e=a,n.innerHTML=`
      <div class="form-group"><label>Site Title</label><input class="form-input" id="f_siteTitle" value="${d(a.siteTitle)}" /></div>
      <div class="form-group"><label>Site Description</label><textarea class="form-input" id="f_siteDescription" rows="2">${d(a.siteDescription)}</textarea></div>
      <div class="form-group"><label>Site URL</label><input class="form-input" id="f_siteUrl" value="${d(a.siteUrl)}" /></div>
      <div class="form-group"><label>Copyright</label><input class="form-input" id="f_copyright" value="${d(a.copyright)}" /></div>
      <div style="display:flex;gap:16px;margin-top:12px;">
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_showContactForm" ${a.showContactForm?"checked":""} />
          Show contact form
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;">
          <input type="checkbox" id="f_emailNotifications" ${a.emailNotifications?"checked":""} />
          Email notifications
        </label>
      </div>
    `}),B(()=>{const a={...e,siteTitle:v("f_siteTitle"),siteDescription:I("f_siteDescription"),siteUrl:v("f_siteUrl"),copyright:v("f_copyright"),showContactForm:document.getElementById("f_showContactForm").checked,emailNotifications:document.getElementById("f_emailNotifications").checked};E(a,"settings.json"),c("settings.json exported")},"https://github.com/EddyKasila/cv-portfolio/blob/master/public/data/settings.json")}function d(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function v(o){return document.getElementById(o)?.value?.trim()||""}function I(o){return document.getElementById(o)?.value?.trim()||""}function C(o){return`
    <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
    <button class="btn btn-primary" id="modalSaveBtn">${o?"Add":"Save"}</button>
  `}b.register({id:"dashboard",label:"Dashboard",icon:"fa-gauge-high",enabled:!0,render:H});b.register({id:"profile",label:"Profile",icon:"fa-user",enabled:!0,render:q});b.register({id:"experience",label:"Experience",icon:"fa-briefcase",enabled:!0,render:N});b.register({id:"projects",label:"Projects",icon:"fa-diagram-project",enabled:!0,render:D});b.register({id:"education",label:"Education",icon:"fa-graduation-cap",enabled:!0,render:F});b.register({id:"skills",label:"Skills",icon:"fa-code",enabled:!0,render:U});b.register({id:"certifications",label:"Certifications",icon:"fa-certificate",enabled:!0,render:R});b.register({id:"settings",label:"Settings",icon:"fa-gear",enabled:!0,render:O});b.register({id:"articles",label:"Articles",icon:"fa-newspaper",enabled:!1});b.register({id:"contact",label:"Contact",icon:"fa-envelope",enabled:!1});b.register({id:"seo",label:"SEO",icon:"fa-magnifying-glass",enabled:!1});b.boot();const A=document.getElementById("sidebar"),w=document.getElementById("sidebarOverlay");document.getElementById("mobileNavToggle").addEventListener("click",()=>{A.classList.toggle("open"),w.classList.toggle("open")});w.addEventListener("click",()=>{A.classList.remove("open"),w.classList.remove("open")});
