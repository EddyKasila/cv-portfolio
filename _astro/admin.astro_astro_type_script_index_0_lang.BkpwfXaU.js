const A="portfolioos_auth";class N{modules=[];activeModule=null;sidebarEl;contentEl;register(t){this.modules.push(t)}boot(){this.checkAuth()&&(this.sidebarEl=document.getElementById("sidebarNav"),this.contentEl=document.getElementById("adminContent"),this.renderSidebar(),this.navigateTo("dashboard"))}checkAuth(){const t=localStorage.getItem(A);if(!t)return this.redirectToLogin(),!1;try{const{expiry:n}=JSON.parse(t);return Date.now()<n?!0:(localStorage.removeItem(A),this.redirectToLogin(),!1)}catch{return this.redirectToLogin(),!1}}redirectToLogin(){const t=document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/",n=t.endsWith("/")?t:t+"/";window.location.href=`${n}login/`}renderSidebar(){this.sidebarEl.innerHTML=`
      <div class="sidebar-group">
        ${this.modules.map(t=>`
          <button class="sidebar-item${t.enabled?"":" disabled"}" data-module="${t.id}" ${t.enabled?"":"disabled"}>
            <i class="fa-solid ${t.icon}"></i>
            <span>${t.label}</span>
            ${t.enabled?"":'<span class="badge">Soon</span>'}
          </button>
        `).join("")}
      </div>
    `,this.sidebarEl.querySelectorAll(".sidebar-item:not(.disabled)").forEach(t=>{t.addEventListener("click",()=>this.navigateTo(t.getAttribute("data-module")))}),document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem(A),this.redirectToLogin()})}navigateTo(t){const n=this.modules.find(s=>s.id===t);if(!n||!n.enabled||!n.render)return;this.activeModule=t,this.sidebarEl.querySelectorAll(".sidebar-item").forEach(s=>s.classList.remove("active"));const l=this.sidebarEl.querySelector(`[data-module="${t}"]`);l&&l.classList.add("active"),this.contentEl.innerHTML="",n.render(this.contentEl)}}const y=new N;function O(){return document.querySelector('meta[name="base-url"]')?.getAttribute("content")||"/"}async function b(a){const n=`${O().replace(/\/+$/,"")}/${a.replace(/^\/+/,"")}`,l=await fetch(n);if(!l.ok)throw new Error(`Failed to fetch ${n}: ${l.status}`);return l.json()}function x(a,t){const n=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),l=URL.createObjectURL(n),s=document.createElement("a");s.href=l,s.download=t,s.click(),URL.revokeObjectURL(l)}function c(a,t="success"){const n=document.getElementById("toast");n.className=`toast toast-${t}`;const l=t==="success"?"fa-check-circle":"fa-exclamation-circle";n.innerHTML=`<i class="fa-solid ${l}"></i> ${a}`,requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>n.classList.remove("show"),3e3)}function _(a,t,n){const l=document.getElementById("modalOverlay"),s=document.getElementById("modalContent");s.innerHTML=`
    <div class="modal-header">
      <h3>${a}</h3>
      <button class="modal-close" id="modalCloseBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">${t}</div>
    ${n?`<div class="modal-footer">${n}</div>`:""}
  `,l.classList.add("open"),document.getElementById("modalCloseBtn")?.addEventListener("click",g),l.addEventListener("click",d=>{d.target===l&&g()})}function g(){document.getElementById("modalOverlay").classList.remove("open")}function T(a){const t=document.createElement("div");t.className="form-group";const n=document.createElement("label");if(n.htmlFor=a.id,n.textContent=a.label,a.required){const s=document.createElement("span");s.style.color="var(--danger)",s.textContent=" *",n.appendChild(s)}t.appendChild(n);let l;if(a.multiline?(l=document.createElement("textarea"),l.rows=a.rows||4):(l=document.createElement("input"),l.type=a.type||"text"),l.id=a.id,l.name=a.id,l.value=a.value||"",a.placeholder&&(l.placeholder=a.placeholder),a.required&&(l.required=!0),l.className="form-input",t.appendChild(l),a.helpText){const s=document.createElement("div");s.style.cssText="font-size:0.75rem;color:var(--text-muted);margin-top:4px;",s.textContent=a.helpText,t.appendChild(s)}return t}function R(a){a.innerHTML=`
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
  `,Promise.all([b("data/profile.json"),b("data/experience.json"),b("data/projects.json"),b("data/education.json")]).then(([t,n,l,s])=>{document.getElementById("statProfile").textContent=t.name||"—",document.getElementById("statExperience").textContent=`${n.length} entries`,document.getElementById("statProjects").textContent=`${l.length} projects`,document.getElementById("statEducation").textContent=`${s.length} entries`})}function U(a){let t=null;a.innerHTML=`
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
          <button class="btn btn-ghost btn-sm" id="publishBtn" disabled><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body">
        <form id="profileForm"></form>
      </div>
    </div>
  `;const n=document.getElementById("profileForm"),l=document.getElementById("previewBtn"),s=document.getElementById("exportBtn"),d=document.getElementById("publishBtn");b("data/profile.json").then(i=>{t={...i},[{id:"name",label:"Full Name",value:i.name,required:!0},{id:"title",label:"Professional Title",value:i.title,required:!0},{id:"tagline",label:"Tagline",value:i.tagline},{id:"email",label:"Email",value:i.email,type:"email",required:!0},{id:"phone",label:"Phone",value:i.phone},{id:"location",label:"Location",value:i.location},{id:"address",label:"Full Address",value:i.address},{id:"photo",label:"Photo Path",value:i.photo,helpText:"Relative path from public/, e.g. /assets/img/profile.jpg"},{id:"resumeUrl",label:"Resume Download URL",value:i.resumeUrl,helpText:"Relative path to PDF in public/"},{id:"summary",label:"Professional Summary",value:i.summary,multiline:!0,rows:6}].forEach(f=>n.appendChild(T(f)));const m=document.createElement("div");m.style.cssText="margin-top:20px;border-top:1px solid var(--border-light);padding-top:16px;";const u=document.createElement("label");u.style.cssText="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;",u.textContent="SOCIAL LINKS",m.appendChild(u),i.social.forEach((f,h)=>{const L=document.createElement("div");L.style.cssText="display:flex;align-items:center;gap:8px;margin-bottom:8px;",L.innerHTML=`
        <span style="width:24px;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="${f.icon}"></i></span>
        <span style="width:60px;font-size:0.8rem;color:var(--text-secondary);">${f.label}</span>
        <input type="text" class="form-input" id="social_${h}_url" value="${f.url}" style="flex:1;" />
      `,m.appendChild(L)}),n.appendChild(m);const p=document.createElement("div");p.style.cssText="margin-top:16px;border-top:1px solid var(--border-light);padding-top:16px;",p.innerHTML='<label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:block;">INTERESTS / ABOUT</label>',n.appendChild(p),n.appendChild(T({id:"interests_p1",label:"Interest Paragraph 1",value:i.interests.p1,multiline:!0,rows:3})),n.appendChild(T({id:"interests_p2",label:"Interest Paragraph 2",value:i.interests.p2,multiline:!0,rows:3})),l.disabled=!1,s.disabled=!1,d.disabled=!1});function e(){if(!t)return null;const i=m=>document.getElementById(m)?.value||"",o=t.social.map((m,u)=>({...m,url:document.getElementById(`social_${u}_url`)?.value||m.url}));return{...t,name:i("name"),title:i("title"),tagline:i("tagline"),email:i("email"),phone:i("phone"),location:i("location"),address:i("address"),photo:i("photo"),resumeUrl:i("resumeUrl"),summary:i("summary"),social:o,interests:{p1:i("interests_p1"),p2:i("interests_p2")}}}l.addEventListener("click",()=>{const i=e();if(!i)return;const o=`
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
    `;_("Profile Preview",o)}),s.addEventListener("click",()=>{const i=e();i&&(x(i,"profile.json"),c("profile.json exported — commit it to your repo to update the live site"))}),d.addEventListener("click",()=>{const i=e();i&&$("public/data/profile.json",JSON.stringify(i,null,2))})}function B(a,t){return`<div class="page-header"><h2>${a}</h2><p>${t}</p></div>`}function E(a,t){return`<h3><i class="fa-solid ${a}" style="margin-right:8px;color:var(--primary);"></i> ${t}</h3>`}function S(a){return`
    <div style="display:flex;gap:6px;">
      <button class="btn btn-primary btn-sm" id="addBtn"><i class="fa-solid fa-plus"></i> ${a}</button>
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
    </div>`}function k(a,t){document.getElementById("exportBtn")?.addEventListener("click",a),document.getElementById("publishBtn")?.addEventListener("click",()=>{t?t():c("Publish not configured for this module","error")})}function j(a,t="Edit"){return a.length===0?'<div class="empty-state"><i class="fa-solid fa-inbox"></i><h3>No entries yet</h3><p>Add your first entry to get started</p></div>':a.map((n,l)=>`
    <div class="item-card" style="margin-bottom:8px;">
      <div class="item-card-left">
        <div class="item-card-title">${n.title}</div>
        <div class="item-card-sub">${n.sub}</div>
        ${n.meta?`<div class="item-card-meta">${n.meta}</div>`:""}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-secondary btn-sm edit-btn" data-index="${l}"><i class="fa-solid fa-pen"></i> ${t}</button>
        <button class="btn btn-danger btn-sm delete-btn" data-index="${l}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `).join("")}function F(a){let t=[];a.innerHTML=`
    ${B("Experience","Manage your work history entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-briefcase","Experience")}
        ${S("Add Entry")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/experience.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.role,sub:`${e.company} · ${e.period}`,meta:`${e.tasks.length} tasks · ${e.location}`}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{const i=parseInt(e.getAttribute("data-index"));t.splice(i,1),l(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>{d(-1)}),k(()=>{x(t,"experience.json"),c("experience.json exported")},()=>$("public/data/experience.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{role:"",company:"",period:"",type:"full-time",location:"",tasks:[""]}:{...t[e]},m=`
      <div class="form-group"><label>Role *</label><input class="form-input" id="f_role" value="${r(o.role)}" /></div>
      <div class="form-group"><label>Company *</label><input class="form-input" id="f_company" value="${r(o.company)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(o.period)}" placeholder="e.g. March 2022 - October 2024" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="full-time"${o.type==="full-time"?" selected":""}>Full-time</option>
          <option value="part-time"${o.type==="part-time"?" selected":""}>Part-time</option>
          <option value="contract"${o.type==="contract"?" selected":""}>Contract</option>
        </select>
      </div>
      <div class="form-group"><label>Location</label><input class="form-input" id="f_location" value="${r(o.location)}" /></div>
      <div class="form-group"><label>Tasks (one per line)</label><textarea class="form-input" id="f_tasks" rows="5">${r(o.tasks.join(`
`))}</textarea></div>
    `;_(i?"Add Experience Entry":"Edit Experience Entry",m,`
      <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
      <button class="btn btn-primary" id="modalSaveBtn">${i?"Add":"Save"}</button>
    `),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const p=document.getElementById("f_role").value.trim();if(!p){c("Role is required","error");return}const f=document.getElementById("f_tasks").value.split(`
`).map(L=>L.trim()).filter(Boolean),h={role:p,company:document.getElementById("f_company").value.trim(),period:document.getElementById("f_period").value.trim(),type:document.getElementById("f_type").value,location:document.getElementById("f_location").value.trim(),tasks:f};i?t.push(h):t[e]=h,l(),g(),c(i?"Entry added":"Entry saved")})}}function D(a){let t=[];a.innerHTML=`
    ${B("Projects","Manage your portfolio projects")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-diagram-project","Projects")}
        ${S("Add Project")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/projects.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.name,sub:`${e.role} · ${e.period}`,meta:`${e.highlights.length} highlights · ${e.status}`}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),l(),c("Project removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),k(()=>{x(t,"projects.json"),c("projects.json exported")},()=>$("public/data/projects.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{name:"",role:"",period:"",tag:"",image:"",url:"",summary:"",highlights:[""],status:"completed"}:{...t[e]},m=`
      <div class="form-group"><label>Project Name *</label><input class="form-input" id="f_name" value="${r(o.name)}" /></div>
      <div class="form-group"><label>Role</label><input class="form-input" id="f_role" value="${r(o.role)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(o.period)}" /></div>
      <div class="form-group"><label>Tag</label><input class="form-input" id="f_tag" value="${r(o.tag)}" /></div>
      <div class="form-group"><label>Image Path</label><input class="form-input" id="f_image" value="${r(o.image)}" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${r(o.url)}" /></div>
      <div class="form-group"><label>Summary</label><textarea class="form-input" id="f_summary" rows="4">${r(o.summary)}</textarea></div>
      <div class="form-group"><label>Highlights (one per line)</label><textarea class="form-input" id="f_highlights" rows="4">${r(o.highlights.join(`
`))}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-input" id="f_status">
          <option value="completed"${o.status==="completed"?" selected":""}>Completed</option>
          <option value="in-progress"${o.status==="in-progress"?" selected":""}>In Progress</option>
          <option value="planned"${o.status==="planned"?" selected":""}>Planned</option>
        </select>
      </div>
    `;_(i?"Add Project":"Edit Project",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim();if(!u){c("Project name is required","error");return}const p={name:u,role:v("f_role"),period:v("f_period"),tag:v("f_tag"),image:v("f_image"),url:v("f_url"),summary:I("f_summary"),highlights:I("f_highlights").split(`
`).map(f=>f.trim()).filter(Boolean),status:document.getElementById("f_status").value};i?t.push(p):t[e]=p,l(),g(),c(i?"Project added":"Project saved")})}}function G(a){let t=[];a.innerHTML=`
    ${B("Education","Manage your education and certifications entries")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-graduation-cap","Education")}
        ${S("Add Entry")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/education.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.degree,sub:`${e.institution} · ${e.field}`,meta:e.period}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),l(),c("Entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),k(()=>{x(t,"education.json"),c("education.json exported")},()=>$("public/data/education.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{institution:"",degree:"",field:"",period:"",type:"degree"}:{...t[e]},m=`
      <div class="form-group"><label>Institution *</label><input class="form-input" id="f_institution" value="${r(o.institution)}" /></div>
      <div class="form-group"><label>Degree *</label><input class="form-input" id="f_degree" value="${r(o.degree)}" /></div>
      <div class="form-group"><label>Field of Study</label><input class="form-input" id="f_field" value="${r(o.field)}" /></div>
      <div class="form-group"><label>Period</label><input class="form-input" id="f_period" value="${r(o.period)}" placeholder="e.g. 2012 - 2017" /></div>
      <div class="form-group"><label>Type</label>
        <select class="form-input" id="f_type">
          <option value="degree"${o.type==="degree"?" selected":""}>Degree</option>
          <option value="certification"${o.type==="certification"?" selected":""}>Certification</option>
          <option value="diploma"${o.type==="diploma"?" selected":""}>Diploma</option>
        </select>
      </div>
    `;_(i?"Add Education Entry":"Edit Education Entry",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_institution").value.trim(),p=document.getElementById("f_degree").value.trim();if(!u||!p){c("Institution and degree are required","error");return}const f={institution:u,degree:p,field:v("f_field"),period:v("f_period"),type:document.getElementById("f_type").value};i?t.push(f):t[e]=f,l(),g(),c(i?"Entry added":"Entry saved")})}}function z(a){let t={programming:[],professional:[]};a.innerHTML=`
    ${B("Skills","Manage your technical and professional skills")}
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${E("fa-code","Programming Skills")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="addProgBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>
      <div class="content-card-body" id="progList"></div>
    </div>
    <div class="content-card" style="margin-bottom:16px;">
      <div class="content-card-header">
        ${E("fa-briefcase","Professional Skills")}
      </div>
      <div class="content-card-body" id="profContainer"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
      <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
    </div>
  `;const n=document.getElementById("progList"),l=document.getElementById("profContainer");b("data/skills.json").then(e=>{t=e,s()});function s(){n.innerHTML=t.programming.length===0?'<div class="empty-state"><i class="fa-solid fa-code"></i><h3>No programming skills</h3><p>Add your first skill</p></div>':t.programming.map((e,i)=>`
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
      `).join(""),n.querySelectorAll(".edit-prog").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".del-prog").forEach(e=>e.addEventListener("click",()=>{t.programming.splice(parseInt(e.getAttribute("data-index")),1),s(),c("Skill removed")})),l.innerHTML=`
      <textarea class="form-input" id="profSkills" rows="6">${t.professional.join(`
`)}</textarea>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">One skill per line</div>
    `}document.getElementById("addProgBtn").addEventListener("click",()=>d(-1)),k(()=>{const e=document.getElementById("profSkills").value.split(`
`).map(o=>o.trim()).filter(Boolean),i={...t,professional:e};x(i,"skills.json"),c("skills.json exported")},()=>{const e=document.getElementById("profSkills").value.split(`
`).map(o=>o.trim()).filter(Boolean),i={...t,professional:e};$("public/data/skills.json",JSON.stringify(i,null,2))});function d(e){const i=e<0,o=i?{name:"",icon:"fa-solid fa-code",category:"frontend"}:{...t.programming[e]},m=`
      <div class="form-group"><label>Skill Name *</label><input class="form-input" id="f_name" value="${r(o.name)}" /></div>
      <div class="form-group"><label>Icon class</label><input class="form-input" id="f_icon" value="${r(o.icon)}" placeholder="e.g. fab fa-html5" /></div>
      <div class="form-group"><label>Category</label>
        <select class="form-input" id="f_category">
          <option value="frontend"${o.category==="frontend"?" selected":""}>Frontend</option>
          <option value="backend"${o.category==="backend"?" selected":""}>Backend</option>
          <option value="tools"${o.category==="tools"?" selected":""}>Tools</option>
        </select>
      </div>
    `;_(i?"Add Programming Skill":"Edit Programming Skill",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim();if(!u){c("Skill name is required","error");return}const p={name:u,icon:v("f_icon"),category:document.getElementById("f_category").value};i?t.programming.push(p):t.programming[e]=p,s(),g(),c(i?"Skill added":"Skill saved")})}}function J(a){let t=[];a.innerHTML=`
    ${B("Certifications","Manage your certifications and credentials")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-certificate","Certifications")}
        ${S("Add Certification")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/certifications.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.name,sub:e.issuer,meta:e.date}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),l(),c("Certification removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),k(()=>{x(t,"certifications.json"),c("certifications.json exported")},()=>$("public/data/certifications.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{name:"",issuer:"",date:"",url:"",description:""}:{...t[e]},m=`
      <div class="form-group"><label>Certification Name *</label><input class="form-input" id="f_name" value="${r(o.name)}" /></div>
      <div class="form-group"><label>Issuer *</label><input class="form-input" id="f_issuer" value="${r(o.issuer)}" /></div>
      <div class="form-group"><label>Date</label><input class="form-input" id="f_date" value="${r(o.date)}" placeholder="e.g. 2016 or Ongoing" /></div>
      <div class="form-group"><label>URL</label><input class="form-input" id="f_url" value="${r(o.url)}" /></div>
      <div class="form-group"><label>Description</label><textarea class="form-input" id="f_description" rows="3">${r(o.description)}</textarea></div>
    `;_(i?"Add Certification":"Edit Certification",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_name").value.trim(),p=document.getElementById("f_issuer").value.trim();if(!u||!p){c("Name and issuer are required","error");return}const f={name:u,issuer:p,date:v("f_date"),url:v("f_url"),description:I("f_description")};i?t.push(f):t[e]=f,l(),g(),c(i?"Certification added":"Certification saved")})}}function K(a){let t={};a.innerHTML=`
    ${B("Settings","Configure your site-wide settings")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-gear","Site Settings")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;const n=document.getElementById("formContainer");b("data/settings.json").then(s=>{t=s;const d=H();n.innerHTML=`
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
    `,document.getElementById("saveGhTokenBtn").addEventListener("click",()=>{const e=document.getElementById("f_ghToken").value.trim();e&&(Q(e),c("GitHub token saved locally"))})});function l(){return{...t,siteTitle:v("f_siteTitle"),siteDescription:I("f_siteDescription"),siteUrl:v("f_siteUrl"),copyright:v("f_copyright"),showContactForm:document.getElementById("f_showContactForm").checked,emailNotifications:document.getElementById("f_emailNotifications").checked}}k(()=>{x(l(),"settings.json"),c("settings.json exported")},()=>$("public/data/settings.json",JSON.stringify(l(),null,2)))}function w(a){let t={};a.innerHTML=`
    ${B("Contact","Configure your contact form settings")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-envelope","Contact Settings")}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" id="exportBtn"><i class="fa-solid fa-download"></i> Export</button>
          <button class="btn btn-ghost btn-sm" id="publishBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Publish</button>
        </div>
      </div>
      <div class="content-card-body" id="formContainer"></div>
    </div>
  `;const n=document.getElementById("formContainer");b("data/contact.json").then(s=>{t=s;let d=`
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
    `,n.innerHTML=d,n.querySelectorAll(".remove-field").forEach(e=>e.addEventListener("click",()=>{const i=e.getAttribute("data-key");delete t.fields[i],b("data/contact.json").then(o=>{t=o,l(),w(a)})})),document.getElementById("addFieldBtn").addEventListener("click",()=>{const e=prompt("Field key (e.g. phone, company):");e&&(t.fields[e]={label:e.charAt(0).toUpperCase()+e.slice(1),required:!1},w(a))})});function l(){t.formspreeId=v("f_formspreeId"),t.recipientEmail=v("f_recipientEmail"),t.successMessage=I("f_successMessage"),Object.keys(t.fields).forEach(s=>{const d=document.getElementById(`f_field_${s}_label`),e=document.getElementById(`f_field_${s}_required`);d&&(t.fields[s].label=d.value),e&&(t.fields[s].required=e.checked)})}k(()=>{l(),x(t,"contact.json"),c("contact.json exported")},()=>{l(),$("public/data/contact.json",JSON.stringify(t,null,2))})}function Y(a){let t=[];a.innerHTML=`
    ${B("SEO","Manage meta titles and descriptions per page")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-magnifying-glass","SEO Entries")}
        ${S("Add Entry")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/seo.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.page,sub:e.title,meta:e.description}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),l(),c("SEO entry removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),k(()=>{x(t,"seo.json"),c("seo.json exported")},()=>$("public/data/seo.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{page:"",title:"",description:"",ogImage:""}:{...t[e]},m=`
      <div class="form-group"><label>Page *</label>
        <select class="form-input" id="f_page">
          ${["home","resume","projects","contact","about"].map(u=>`<option value="${u}"${o.page===u?" selected":""}>${u.charAt(0).toUpperCase()+u.slice(1)}</option>`).join("")}
        </select>
      </div>
      <div class="form-group"><label>Meta Title *</label><input class="form-input" id="f_title" value="${r(o.title)}" /></div>
      <div class="form-group"><label>Meta Description</label><textarea class="form-input" id="f_description" rows="3">${r(o.description)}</textarea></div>
      <div class="form-group"><label>OG Image URL</label><input class="form-input" id="f_ogImage" value="${r(o.ogImage||"")}" placeholder="Relative or absolute URL" /></div>
    `;_(i?"Add SEO Entry":"Edit SEO Entry",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_title").value.trim();if(!u){c("Meta title is required","error");return}const p={page:document.getElementById("f_page").value,title:u,description:I("f_description"),ogImage:v("f_ogImage")};i?t.push(p):t[e]=p,l(),g(),c(i?"SEO entry added":"SEO entry saved")})}}function W(a){let t=[];a.innerHTML=`
    ${B("Articles","Manage your articles and blog posts")}
    <div class="content-card">
      <div class="content-card-header">
        ${E("fa-newspaper","Articles")}
        ${S("Add Article")}
      </div>
      <div class="content-card-body" id="listContainer"></div>
    </div>
  `;const n=document.getElementById("listContainer");b("data/articles.json").then(e=>{t=e,l()});function l(){n.innerHTML=j(t.map(e=>({title:e.title,sub:e.slug?`/${e.slug}`:"—",meta:`${e.published||"Draft"} · ${(e.tags||[]).join(", ")}`}))),s()}function s(){n.querySelectorAll(".edit-btn").forEach(e=>e.addEventListener("click",()=>d(parseInt(e.getAttribute("data-index"))))),n.querySelectorAll(".delete-btn").forEach(e=>e.addEventListener("click",()=>{t.splice(parseInt(e.getAttribute("data-index")),1),l(),c("Article removed")}))}document.getElementById("addBtn").addEventListener("click",()=>d(-1)),k(()=>{x(t,"articles.json"),c("articles.json exported")},()=>$("public/data/articles.json",JSON.stringify(t,null,2)));function d(e){const i=e<0,o=i?{title:"",slug:"",excerpt:"",content:"",published:"",tags:[]}:{...t[e]},m=`
      <div class="form-group"><label>Title *</label><input class="form-input" id="f_title" value="${r(o.title)}" /></div>
      <div class="form-group"><label>Slug</label><input class="form-input" id="f_slug" value="${r(o.slug)}" placeholder="e.g. my-article-slug" /></div>
      <div class="form-group"><label>Published Date</label><input class="form-input" id="f_published" value="${r(o.published||"")}" type="date" /></div>
      <div class="form-group"><label>Tags (comma-separated)</label><input class="form-input" id="f_tags" value="${r((o.tags||[]).join(", "))}" placeholder="e.g. project, career, tech" /></div>
      <div class="form-group"><label>Excerpt</label><textarea class="form-input" id="f_excerpt" rows="3">${r(o.excerpt)}</textarea></div>
      <div class="form-group"><label>Content (Markdown)</label><textarea class="form-input" id="f_content" rows="10">${r(o.content)}</textarea></div>
    `;_(i?"Add Article":"Edit Article",m,C(i)),document.getElementById("modalCancelBtn").addEventListener("click",g),document.getElementById("modalSaveBtn").addEventListener("click",()=>{const u=document.getElementById("f_title").value.trim();if(!u){c("Title is required","error");return}const p=document.getElementById("f_tags").value,f={title:u,slug:v("f_slug"),excerpt:I("f_excerpt"),content:I("f_content"),published:v("f_published"),tags:p.split(",").map(h=>h.trim()).filter(Boolean)};i?t.push(f):t[e]=f,l(),g(),c(i?"Article added":"Article saved")})}}const M="portfolioos_gh_token";function H(){return localStorage.getItem(M)||""}function Q(a){localStorage.setItem(M,a)}async function $(a,t,n){const l=H();if(!l){c("GitHub token not configured — set one in Settings","error");return}const s="EddyKasila",d="cv-portfolio",e="master",i=`https://api.github.com/repos/${s}/${d}/contents/${a}`,o=btoa(unescape(encodeURIComponent(t))),m=`Update ${a} from PortfolioOS admin`;try{let u;try{const h=await fetch(`${i}?ref=${e}`,{headers:{Authorization:`token ${l}`,Accept:"application/vnd.github.v3+json"}});h.ok&&(u=(await h.json()).sha)}catch{}const p={message:m,content:o,branch:e};u&&(p.sha=u);const f=await fetch(i,{method:"PUT",headers:{Authorization:`token ${l}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify(p)});if(!f.ok){const h=await f.json().catch(()=>({}));throw new Error(h.message||`GitHub API returned ${f.status}`)}c(`Saved to GitHub: ${a}`)}catch(u){c(`GitHub save failed: ${u.message}`,"error")}}function r(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function v(a){return document.getElementById(a)?.value?.trim()||""}function I(a){return document.getElementById(a)?.value?.trim()||""}function C(a){return`
    <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
    <button class="btn btn-primary" id="modalSaveBtn">${a?"Add":"Save"}</button>
  `}y.register({id:"dashboard",label:"Dashboard",icon:"fa-gauge-high",enabled:!0,render:R});y.register({id:"profile",label:"Profile",icon:"fa-user",enabled:!0,render:U});y.register({id:"experience",label:"Experience",icon:"fa-briefcase",enabled:!0,render:F});y.register({id:"projects",label:"Projects",icon:"fa-diagram-project",enabled:!0,render:D});y.register({id:"education",label:"Education",icon:"fa-graduation-cap",enabled:!0,render:G});y.register({id:"skills",label:"Skills",icon:"fa-code",enabled:!0,render:z});y.register({id:"certifications",label:"Certifications",icon:"fa-certificate",enabled:!0,render:J});y.register({id:"settings",label:"Settings",icon:"fa-gear",enabled:!0,render:K});y.register({id:"articles",label:"Articles",icon:"fa-newspaper",enabled:!0,render:W});y.register({id:"contact",label:"Contact",icon:"fa-envelope",enabled:!0,render:w});y.register({id:"seo",label:"SEO",icon:"fa-magnifying-glass",enabled:!0,render:Y});y.boot();const q=document.getElementById("sidebar"),P=document.getElementById("sidebarOverlay");document.getElementById("mobileNavToggle").addEventListener("click",()=>{q.classList.toggle("open"),P.classList.toggle("open")});P.addEventListener("click",()=>{q.classList.remove("open"),P.classList.remove("open")});
