// ── State ──────────────────────────────────────────────────────────────
let experiences = [];
let projects = [];
let educations = [];
let aiSuggestions = null;

// ── Init ───────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  addExp(); addProj(); addEdu();
  updatePreview();
  updateSkillChips();
});

// ── Tab switching ──────────────────────────────────────────────────────
function showTab(tab) {
  ['build','ai','preview'].forEach(t => {
    document.getElementById('page-' + t).style.display = t === tab ? 'block' : 'none';
    const btn = document.getElementById('tab-' + t);
    if(btn) btn.classList.toggle('active', t === tab);
  });
  if(tab === 'preview') buildPreview();
}

// ── Dynamic arrays ─────────────────────────────────────────────────────
function addExp() {
  const id = Date.now();
  experiences.push({id});
  renderExp();
}
function removeExp(id) {
  if(experiences.length === 1) { toast('Need at least one entry','info'); return; }
  experiences = experiences.filter(e => e.id !== id);
  renderExp();
}
function renderExp() {
  const c = document.getElementById('exp-container');
  c.innerHTML = '';
  experiences.forEach((exp, i) => {
    c.insertAdjacentHTML('beforeend', `
    <div class="entry-block" id="exp-${exp.id}">
      <div class="entry-header">
        <span class="entry-num">Experience #${i+1}</span>
        <button class="btn btn-danger" onclick="removeExp(${exp.id})">✕ Remove</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Organization / Company</label><input id="ec-${exp.id}" placeholder="CrowdStrike / CISA / NSA" oninput="updatePreview()"/></div>
        <div class="field"><label>Role / Title</label><input id="er-${exp.id}" placeholder="Senior Threat Hunter" oninput="updatePreview()"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Start Date</label><input id="es-${exp.id}" placeholder="Jan 2022" oninput="updatePreview()"/></div>
        <div class="field"><label>End Date</label><input id="ee-${exp.id}" placeholder="Present" oninput="updatePreview()"/></div>
      </div>
      <div class="field"><label>Achievements (start each line with •)</label>
        <textarea id="ed-${exp.id}" rows="4" placeholder="• Reduced mean-time-to-detect (MTTD) by 35% via SIEM rule optimization&#10;• Led red team exercises simulating APT groups targeting critical infrastructure&#10;• Developed custom YARA rules detecting 12 novel malware strains" oninput="updatePreview()"></textarea>
      </div>
    </div>`);
  });
}
function getExpData() {
  return experiences.map(e => ({
    company: (document.getElementById('ec-'+e.id)||{}).value||'',
    role: (document.getElementById('er-'+e.id)||{}).value||'',
    startDate: (document.getElementById('es-'+e.id)||{}).value||'',
    endDate: (document.getElementById('ee-'+e.id)||{}).value||'',
    description: (document.getElementById('ed-'+e.id)||{}).value||''
  })).filter(e => e.company || e.role);
}

function addProj() {
  const id = Date.now();
  projects.push({id});
  renderProj();
}
function removeProj(id) {
  if(projects.length === 1) { toast('Need at least one entry','info'); return; }
  projects = projects.filter(p => p.id !== id);
  renderProj();
}
function renderProj() {
  const c = document.getElementById('proj-container');
  c.innerHTML = '';
  projects.forEach((proj, i) => {
    c.insertAdjacentHTML('beforeend', `
    <div class="entry-block" id="proj-${proj.id}">
      <div class="entry-header">
        <span class="entry-num">Project #${i+1}</span>
        <button class="btn btn-danger" onclick="removeProj(${proj.id})">✕ Remove</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Project / CTF Name</label><input id="pn-${proj.id}" placeholder="Home SOC Lab / HackTheBox Pro" oninput="updatePreview()"/></div>
        <div class="field"><label>Tools & Tech Stack</label><input id="pt-${proj.id}" placeholder="Elastic SIEM, Zeek, Suricata, Python" oninput="updatePreview()"/></div>
      </div>
      <div class="field"><label>Description & Impact</label>
        <textarea id="pd-${proj.id}" rows="3" placeholder="Built a fully functional home SOC using Elastic Stack to monitor 50+ endpoints. Detected simulated attacks using custom detection rules, reducing alert noise by 70%." oninput="updatePreview()"></textarea>
      </div>
      <div class="field"><label>GitHub / Link / CVE / Badge URL</label>
        <input id="pl-${proj.id}" placeholder="github.com/you/soc-lab" oninput="updatePreview()"/>
      </div>
    </div>`);
  });
}
function getProjData() {
  return projects.map(p => ({
    name: (document.getElementById('pn-'+p.id)||{}).value||'',
    techStack: (document.getElementById('pt-'+p.id)||{}).value||'',
    description: (document.getElementById('pd-'+p.id)||{}).value||'',
    link: (document.getElementById('pl-'+p.id)||{}).value||''
  })).filter(p => p.name || p.description);
}

function addEdu() {
  const id = Date.now();
  educations.push({id});
  renderEdu();
}
function removeEdu(id) {
  if(educations.length === 1) { toast('Need at least one entry','info'); return; }
  educations = educations.filter(e => e.id !== id);
  renderEdu();
}
function renderEdu() {
  const c = document.getElementById('edu-container');
  c.innerHTML = '';
  educations.forEach((edu, i) => {
    c.insertAdjacentHTML('beforeend', `
    <div class="entry-block" id="edu-${edu.id}">
      <div class="entry-header">
        <span class="entry-num">Education #${i+1}</span>
        <button class="btn btn-danger" onclick="removeEdu(${edu.id})">✕ Remove</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Institution</label><input id="ei-${edu.id}" placeholder="Carnegie Mellon / SANS / WGU" oninput="updatePreview()"/></div>
        <div class="field"><label>Degree</label><input id="edeg-${edu.id}" placeholder="M.S. / B.S. / AAS" oninput="updatePreview()"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Field of Study</label><input id="ef-${edu.id}" placeholder="Cybersecurity / Information Assurance" oninput="updatePreview()"/></div>
        <div class="field"><label>GPA / Honors</label><input id="eg-${edu.id}" placeholder="3.9 / Magna Cum Laude" oninput="updatePreview()"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Start Year</label><input id="eys-${edu.id}" placeholder="2020" oninput="updatePreview()"/></div>
        <div class="field"><label>End Year</label><input id="eye-${edu.id}" placeholder="2022" oninput="updatePreview()"/></div>
      </div>
    </div>`);
  });
}
function getEduData() {
  return educations.map(e => ({
    institution: (document.getElementById('ei-'+e.id)||{}).value||'',
    degree: (document.getElementById('edeg-'+e.id)||{}).value||'',
    field: (document.getElementById('ef-'+e.id)||{}).value||'',
    gpa: (document.getElementById('eg-'+e.id)||{}).value||'',
    startDate: (document.getElementById('eys-'+e.id)||{}).value||'',
    endDate: (document.getElementById('eye-'+e.id)||{}).value||''
  })).filter(e => e.institution || e.degree);
}

// ── Skills chips ───────────────────────────────────────────────────────
function updateSkillChips() {
  const val = document.getElementById('f-skills').value;
  const chips = document.getElementById('skill-chips');
  const skills = val.split(',').map(s=>s.trim()).filter(Boolean);
  chips.innerHTML = skills.slice(0,12).map(s => `<span class="skill-chip">${escHtml(s)}</span>`).join('');
  if(skills.length > 12) chips.insertAdjacentHTML('beforeend',`<span class="skill-chip">+${skills.length-12} more</span>`);
  updatePreview();
}

// ── Save / Load ────────────────────────────────────────────────────────
function getFormData() {
  return {
    fullName: v('f-name'), title: v('f-title'), email: v('f-email'),
    phone: v('f-phone'), location: v('f-location'), clearance: v('f-clearance'),
    linkedIn: v('f-linkedin'), github: v('f-github'),
    summary: v('f-summary'), skills: v('f-skills'), certifications: v('f-certs'),
    experience: getExpData(), projects: getProjData(), education: getEduData()
  };
}
function v(id){ const el=document.getElementById(id); return el?(el.value||'').trim():''; }
function sv(id,val){ const el=document.getElementById(id); if(el)el.value=val||''; }

function saveLocally() {
  const data = getFormData();
  if(!data.fullName||!data.email){ toast('Name and email are required','error'); return; }
  localStorage.setItem('cyberresume_v2', JSON.stringify(data));
  toast('Resume saved locally ✓','success');
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('cyberresume_v2');
    if(!raw) return;
    const d = JSON.parse(raw);
    sv('f-name',d.fullName); sv('f-title',d.title); sv('f-email',d.email);
    sv('f-phone',d.phone); sv('f-location',d.location); sv('f-clearance',d.clearance);
    sv('f-linkedin',d.linkedIn); sv('f-github',d.github);
    sv('f-summary',d.summary); sv('f-skills',d.skills); sv('f-certs',d.certifications);
    toast('Previous resume loaded','info');
  } catch(e){}
}

// ── Preview render ─────────────────────────────────────────────────────
function updatePreview() {}  // lightweight, full render only on tab switch
function buildPreview() {
  const d = getFormData();
  const el = document.getElementById('resume-preview');
  let html = `<div class="rs-header">
    <h1 class="rs-name">${escHtml(d.fullName||'Your Name')}</h1>
    ${d.title ? `<div class="rs-tagline">${escHtml(d.title)}</div>` : ''}
    <div class="rs-contacts">
      ${d.email ? `<span>✉ ${escHtml(d.email)}</span>` : ''}
      ${d.phone ? `<span>📞 ${escHtml(d.phone)}</span>` : ''}
      ${d.location ? `<span>📍 ${escHtml(d.location)}</span>` : ''}
      ${d.clearance ? `<span>🔐 Clearance: ${escHtml(d.clearance)}</span>` : ''}
    </div>
    <div class="rs-links">
      ${d.linkedIn ? `<a href="${escHtml(d.linkedIn)}" target="_blank">LinkedIn</a>` : ''}
      ${d.github ? `<a href="${escHtml(d.github)}" target="_blank">GitHub/Portfolio</a>` : ''}
    </div>
  </div>`;

  if(d.summary) html += `<div class="rs-section"><h2 class="rs-section-title">Summary</h2><p class="rs-summary">${escHtml(d.summary)}</p></div>`;

  if(d.experience.length) {
    html += `<div class="rs-section"><h2 class="rs-section-title">Experience</h2>`;
    d.experience.forEach(e => {
      html += `<div class="rs-entry"><div class="rs-entry-header"><div><span class="rs-entry-role">${escHtml(e.role)}</span><span class="rs-entry-company"> — ${escHtml(e.company)}</span></div><span class="rs-entry-date">${escHtml(e.startDate)} – ${escHtml(e.endDate)}</span></div>`;
      if(e.description) html += `<div class="rs-desc">${e.description.split('\n').map(l=>`<p class="${l.startsWith('•')?'rs-bullet':''}">${escHtml(l)}</p>`).join('')}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  if(d.projects.length) {
    html += `<div class="rs-section"><h2 class="rs-section-title">Security Projects & CTFs</h2>`;
    d.projects.forEach(p => {
      html += `<div class="rs-entry"><div class="rs-entry-header"><span class="rs-entry-role">${escHtml(p.name)}</span>${p.link?`<a class="rs-proj-link" href="${escHtml(p.link)}" target="_blank">Link ↗</a>`:''}</div>`;
      if(p.techStack) html += `<p class="rs-tech">Tech: ${escHtml(p.techStack)}</p>`;
      if(p.description) html += `<p class="rs-desc-text">${escHtml(p.description)}</p>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  if(d.education.length) {
    html += `<div class="rs-section"><h2 class="rs-section-title">Education</h2>`;
    d.education.forEach(e => {
      html += `<div class="rs-entry"><div class="rs-entry-header"><div><span class="rs-entry-role">${escHtml(e.degree)}${e.field?' in '+escHtml(e.field):''}</span><span class="rs-entry-company"> — ${escHtml(e.institution)}</span></div><div style="text-align:right"><span class="rs-entry-date">${escHtml(e.startDate)} – ${escHtml(e.endDate)}</span>${e.gpa?`<span class="rs-gpa"> | ${escHtml(e.gpa)}</span>`:''}</div></div></div>`;
    });
    html += `</div>`;
  }

  if(d.skills) {
    const chips = d.skills.split(',').map(s=>s.trim()).filter(Boolean);
    html += `<div class="rs-section"><h2 class="rs-section-title">Technical Skills</h2><div class="rs-skills">${chips.map(s=>`<span class="rs-skill-tag">${escHtml(s)}</span>`).join('')}</div></div>`;
  }

  if(d.certifications) {
    const certs = d.certifications.split(',').map(s=>s.trim()).filter(Boolean);
    html += `<div class="rs-section rs-certifications"><h2 class="rs-section-title">Certifications</h2><div>${certs.map(c=>`<div class="cert-item">${escHtml(c)}</div>`).join('')}</div></div>`;
  }

  el.innerHTML = html;
}

// ── AI Analysis ────────────────────────────────────────────────────────
async function runAI() {
  const d = getFormData();
  if(!d.fullName||!d.email){ toast('Please fill in name and email first','error'); showTab('build'); return; }

  showTab('ai');
  setAILoading(true);

  const resumeText = buildResumeText(d);
  const prompt = `You are an expert cybersecurity hiring manager and resume coach with 15+ years of experience at top firms like CrowdStrike, Palo Alto Networks, and the NSA. Analyze this cybersecurity resume and respond ONLY with valid JSON — no markdown, no extra text, just the raw JSON object.

{
  "overallScore": <1-100>,
  "overallFeedback": "<2-3 sentences of overall assessment focusing on cybersecurity job market fit>",
  "sections": {
    "summary":    { "score": <1-10>, "issues": ["..."], "suggestions": ["..."] },
    "experience": { "score": <1-10>, "issues": ["..."], "suggestions": ["..."] },
    "skills":     { "score": <1-10>, "issues": ["..."], "suggestions": ["..."] },
    "education":  { "score": <1-10>, "issues": ["..."], "suggestions": ["..."] },
    "projects":   { "score": <1-10>, "issues": ["..."], "suggestions": ["..."] }
  },
  "keywordsMissing": ["<cybersecurity ATS keywords missing from this resume>"],
  "topPriorities": ["<most important action #1>", "<action #2>", "<action #3>"]
}

Focus specifically on cybersecurity industry standards: MITRE ATT&CK coverage, certifications (CISSP, OSCP, CEH, GCIH etc), quantified metrics, ATS optimization for security roles, clearance mentions, technical depth, and threat-specific terminology.

RESUME:
${resumeText}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await resp.json();
    const raw = data.content?.map(b=>b.text||'').join('') || '';
    const clean = raw.replace(/```json|```/g,'').trim();
    const suggestions = JSON.parse(clean);
    aiSuggestions = suggestions;
    renderAI(suggestions);
    toast('AI analysis complete ✓','success');
    const badge = document.getElementById('score-badge');
    badge.textContent = suggestions.overallScore;
    badge.style.display = 'inline';
  } catch(err) {
    toast('AI request failed: ' + (err.message||'check console'),'error');
    setAILoading(false);
    showEmpty();
  }
}

function buildResumeText(r) {
  let t = `NAME: ${r.fullName}\nTITLE: ${r.title||'N/A'}\nEMAIL: ${r.email}\n`;
  if(r.phone) t += `PHONE: ${r.phone}\n`;
  if(r.location) t += `LOCATION: ${r.location}\n`;
  if(r.clearance) t += `CLEARANCE: ${r.clearance}\n`;
  if(r.summary) t += `\nSUMMARY:\n${r.summary}\n`;
  if(r.experience?.length){ t+=`\nEXPERIENCE:\n`; r.experience.forEach(e=>{ t+=`- ${e.role} at ${e.company} (${e.startDate}–${e.endDate})\n`; if(e.description)t+=`  ${e.description}\n`; }); }
  if(r.education?.length){ t+=`\nEDUCATION:\n`; r.education.forEach(e=>{ t+=`- ${e.degree} in ${e.field} from ${e.institution}\n`; }); }
  if(r.projects?.length){ t+=`\nPROJECTS:\n`; r.projects.forEach(p=>{ t+=`- ${p.name}: ${p.description} | Tech: ${p.techStack}\n`; }); }
  if(r.skills) t+=`\nSKILLS: ${r.skills}\n`;
  if(r.certifications) t+=`\nCERTIFICATIONS: ${r.certifications}\n`;
  return t;
}

function setAILoading(on) {
  if(!on) return;
  const msgs = ['Parsing resume structure...','Analyzing threat intelligence keywords...','Checking ATS cybersecurity patterns...','Generating improvement vectors...'];
  let i = 0;
  document.getElementById('ai-content').innerHTML = `
    <div class="ai-loading-wrap card">
      <div class="spinner-lg"></div>
      <div class="glitch">ANALYZING...</div>
      <div class="progress-bar"><div class="progress-fill"></div></div>
      <div class="ai-status-msg" id="ai-msg">${msgs[0]}</div>
    </div>`;
  const iv = setInterval(()=>{ i=(i+1)%msgs.length; const m=document.getElementById('ai-msg'); if(m)m.textContent=msgs[i]; else clearInterval(iv); }, 1800);
}
function showEmpty() {
  document.getElementById('ai-content').innerHTML = `
    <div class="empty-state card">
      <div class="es-icon">⚠️</div>
      <h3>Analysis failed</h3>
      <p>An error occurred. Please check your internet connection and try again.</p>
      <button class="btn btn-ai" style="margin-top:8px" onclick="runAI()">🔄 Retry</button>
    </div>`;
}

function renderAI(s) {
  const scoreColor = s.overallScore>=75?'#10b981':s.overallScore>=50?'#f59e0b':'#ef4444';
  const r=44, circ=2*Math.PI*r, pct=s.overallScore/100;

  const sectionMeta = {
    summary:    {label:'Summary',    icon:'📋'},
    experience: {label:'Experience', icon:'⚔️'},
    skills:     {label:'Skills',     icon:'🔐'},
    education:  {label:'Education',  icon:'🎓'},
    projects:   {label:'Projects',   icon:'🛡️'}
  };

  let sectionsHtml = '<div class="ai-grid">';
  Object.entries(sectionMeta).forEach(([key, meta]) => {
    const sec = s.sections?.[key];
    if(!sec) return;
    const sc = sec.score>=8?'#10b981':sec.score>=5?'#f59e0b':'#ef4444';
    sectionsHtml += `
      <div class="card ai-sec-card">
        <div class="ai-sec-header">
          <span class="ai-sec-icon">${meta.icon}</span>
          <span class="ai-sec-name">${meta.label}</span>
          <span class="mini-score" style="color:${sc};border-color:${sc}">${sec.score}/10</span>
        </div>
        ${sec.issues?.length ? `<div class="block-label">⚠ Issues</div><ul class="issue-list">${sec.issues.map(i=>`<li>${escHtml(i)}</li>`).join('')}</ul>` : ''}
        ${sec.suggestions?.length ? `<div class="block-label">→ Suggestions</div><ul class="suggestion-list">${sec.suggestions.map(i=>`<li>${escHtml(i)}</li>`).join('')}</ul>` : ''}
      </div>`;
  });
  sectionsHtml += '</div>';

  document.getElementById('ai-content').innerHTML = `
    <div class="card fade-up" style="margin-bottom:14px">
      <div class="score-wrap">
        <svg class="score-ring-svg" width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="${r}" fill="none" stroke="#1e2d45" stroke-width="8"/>
          <circle cx="55" cy="55" r="${r}" fill="none" stroke="${scoreColor}" stroke-width="8"
            stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-pct)}"
            stroke-linecap="round" transform="rotate(-90 55 55)"
            style="transition:stroke-dashoffset 1s ease"/>
          <text x="55" y="50" text-anchor="middle" fill="${scoreColor}" font-size="22" font-weight="800" font-family="Rajdhani">${s.overallScore}</text>
          <text x="55" y="68" text-anchor="middle" fill="#64748b" font-size="11" font-family="Exo 2">/ 100</text>
        </svg>
        <div class="overall-feedback">
          <h2>Overall Score</h2>
          <p>${escHtml(s.overallFeedback||'')}</p>
        </div>
      </div>
    </div>

    ${s.topPriorities?.length ? `
    <div class="card priorities-card fade-up" style="margin-bottom:14px">
      <div class="section-title"><span class="icon">🎯</span> Top Priorities</div>
      <ul class="priority-list">
        ${s.topPriorities.map((p,i)=>`<li><span class="priority-num">${i+1}</span>${escHtml(p)}</li>`).join('')}
      </ul>
    </div>` : ''}

    ${sectionsHtml}

    ${s.keywordsMissing?.length ? `
    <div class="card kw-section fade-up" style="margin-top:14px">
      <div class="section-title"><span class="icon">🔍</span> Missing Cybersecurity Keywords</div>
      <p style="font-size:13px;color:var(--text2)">Add these to improve ATS scoring for cybersecurity roles:</p>
      <div class="keyword-tags">${s.keywordsMissing.map(k=>`<span class="kw-tag">${escHtml(k)}</span>`).join('')}</div>
    </div>` : ''}
  `;
}

// ── Utils ──────────────────────────────────────────────────────────────
function escHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

function toast(msg, type='info') {
  const area = document.getElementById('toast-area');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = {success:'✓',error:'✕',info:'ℹ'};
  el.innerHTML = `<span>${icons[type]||'ℹ'}</span><span>${msg}</span>`;
  area.appendChild(el);
  setTimeout(()=>{ el.style.animation='fadeOut .3s ease forwards'; setTimeout(()=>el.remove(),320); }, 3200);
}
