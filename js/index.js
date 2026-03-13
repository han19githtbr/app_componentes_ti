// ============================================================
//  SISTEMAS COMPUTACIONAIS — index.js
// ============================================================

let DATA_STORE = null;
let currentLang = 'pt';
let simState = {};
let failCount = 0;
let simBlocks = [];
let selectedAttack = 0;
let simRunning = false;

// ============================================================
//  BOOTSTRAP
// ============================================================
async function init() {
  try {
    const res = await fetch('./database/data.json');
    DATA_STORE = await res.json();
    applyLang(currentLang);
    initProtectionView();
  } catch(e) {
    console.error('Failed to load data.json', e);
  }
}

// ============================================================
//  LANGUAGE
// ============================================================
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  applyLang(lang);
  // re-render active views
  const activeSim = document.getElementById('view-sim').classList.contains('active');
  const activeVirus = document.getElementById('view-virus').classList.contains('active');
  const activeProtection = document.getElementById('view-protection').classList.contains('active');
  const activeRelations = document.getElementById('view-relations').classList.contains('active');

  if(activeSim){ document.getElementById('pc-diagram').innerHTML=''; simState={}; failCount=0; initSim(); }
  if(activeVirus){ document.getElementById('virus-grid').innerHTML=''; initVirus(); }
  if(activeProtection){ initProtectionView(); }
  if(activeRelations){ document.getElementById('rel-table').innerHTML=''; initRelations(); }

  const activeGlossary = document.getElementById('view-glossary').classList.contains('active');
  if(activeGlossary){ renderGlossary(document.getElementById('glossary-search-input')?.value || ''); }
}

function applyLang(lang) {
  const t = DATA_STORE.translations[lang];
  if(!t) return;

  document.getElementById('header-tag').textContent = t.headerTag;
  document.getElementById('header-title').textContent = t.headerTitle + ' ';
  document.getElementById('header-title-accent').textContent = t.headerTitleAccent;
  document.getElementById('header-sub').textContent = t.headerSub;

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    const key = tab.dataset.tab;
    if(key && t.tabs[key]) tab.textContent = t.tabs[key];
  });

  // Tree hint
  const hint = document.getElementById('tree-hint');
  if(hint) hint.textContent = t.treeHint;

  // Root node
  const rootLabel = document.getElementById('root-label');
  const rootSub = document.getElementById('root-sub');
  if(rootLabel) rootLabel.textContent = t.rootLabel;
  if(rootSub) rootSub.textContent = t.rootSub;

  // Sim
  const simTitle = document.getElementById('sim-title');
  if(simTitle) simTitle.textContent = t.simTitle;

  // Category labels
  const cats = [
    ['cat-label-hw','hardware'],['cat-label-bios','bios'],
    ['cat-label-os','os'],['cat-label-net','net'],
    ['cat-label-virus','virus'],['cat-label-sw','software']
  ];
  cats.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = t[key] || '';
  });
  const subs = [
    ['cat-sub-hw','hwSub'],['cat-sub-bios','biosSub'],
    ['cat-sub-os','osSub'],['cat-sub-net','netSub'],
    ['cat-sub-virus','virusSub'],['cat-sub-sw','softSub']
  ];
  subs.forEach(([id,key]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = t[key] || '';
  });

  // Virus title
  const vt = document.getElementById('virus-title');
  if(vt) vt.textContent = t.virusTitle;

  // Protection title
  const pt = document.getElementById('prot-main-title');
  if(pt) pt.textContent = t.protectionTitle;
  const ps = document.getElementById('prot-main-sub');
  if(ps) ps.textContent = t.protectionSub;
}

function T(key) {
  const t = DATA_STORE && DATA_STORE.translations[currentLang];
  return t && t[key] !== undefined ? t[key] : key;
}

// ============================================================
//  VIEW SWITCHING
// ============================================================
function showView(name, el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  if(el) el.classList.add('active');

  if(name === 'sim') initSim();
  if(name === 'cache') initCacheView();
  if(name === 'livesim') initLiveSim();
  if(name === 'virus') initVirus();
  if(name === 'protection') initProtectionView();
  if(name === 'relations') initRelations();
  if(name === 'diag') initDiag();
  if(name === 'glossary') initGlossary();
}

// ============================================================
//  DETAIL PANEL
// ============================================================
function openPanel(key) {
  const d = DATA_STORE.components[key];
  if(!d) return;

  const panel = document.getElementById('detail-panel');
  const pt = document.getElementById('panel-type');
  const pti = document.getElementById('panel-title');
  const pd = document.getElementById('panel-desc');
  const ps = document.getElementById('panel-specs');
  const pr = document.getElementById('panel-relations');
  const pi = document.getElementById('panel-impacts');

  pt.textContent = d.type;
  pt.style.cssText = `display:inline-block;font-family:var(--font-mono);font-size:0.6rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:10px;background:${d.color}22;color:${d.color};border:1px solid ${d.color}44;`;
  pti.textContent = d.name;
  pti.style.color = '#fff';
  pd.textContent = d.desc;

  let specsHtml = `<div class="panel-section"><div class="panel-section-title">${T('panelSpecs')}</div><div class="specs-grid">`;
  for(const [k,v] of Object.entries(d.specs||{})){
    specsHtml += `<div class="spec-item"><div class="spec-key">${k}</div><div class="spec-val">${v}</div></div>`;
  }
  specsHtml += `</div></div>`;
  ps.innerHTML = specsHtml;

  if(d.relations && d.relations.length){
    let relHtml = `<div class="panel-section"><div class="panel-section-title">${T('panelRelations')}</div><div class="rel-list">`;
    d.relations.forEach(r => {
      const rd = DATA_STORE.components[r];
      if(rd) relHtml += `<span class="rel-tag" onclick="openPanel('${r}')" style="border-color:${rd.color}44;color:${rd.color}">${rd.name}</span>`;
    });
    relHtml += `</div></div>`;
    pr.innerHTML = relHtml;
  } else { pr.innerHTML = ''; }

  if(d.impacts && d.impacts.length){
    let impHtml = `<div class="panel-section"><div class="panel-section-title" style="color:#ef4444;">${T('panelImpacts')}</div>`;
    d.impacts.forEach(i => {
      impHtml += `<div style="font-size:0.72rem;color:#ff8888;padding:5px 0 5px 10px;border-left:2px solid #ef444440;margin-bottom:4px;">⚠ ${i}</div>`;
    });
    impHtml += `</div>`;
    pi.innerHTML = impHtml;
  } else { pi.innerHTML = ''; }

  panel.classList.add('open');
}

function closePanel() {
  document.getElementById('detail-panel').classList.remove('open');
}

document.addEventListener('click', e => {
  const panel = document.getElementById('detail-panel');
  if(panel && panel.classList.contains('open') && !panel.contains(e.target)){
    if(
      !e.target.closest('.leaf') &&
      !e.target.closest('.cat-node') &&
      !e.target.closest('.root-node') &&
      !e.target.closest('.diag-see-more') &&
      !e.target.closest('.diag-rel-chip') &&
      !e.target.closest('.rel-tag')
    ){
      closePanel();
    }
  }
});

// ============================================================
//  SIMULATION VIEW
// ============================================================
function initSim() {
  if(!DATA_STORE) return;
  const diag = document.getElementById('pc-diagram');
  if(diag.children.length > 0) return;

  simBlocks = DATA_STORE.simBlocks;
  simBlocks.forEach(b => {
    simState[b.id] = 'ok';
    const block = document.createElement('div');
    block.className = 'pc-block ok';
    block.id = 'sim-' + b.id;

    const labelKey = b.id;
    const compData = DATA_STORE.components[labelKey];
    const label = compData ? compData.name : b.id;

    block.innerHTML = `
      <div class="pc-block-header">
        <span class="pc-block-icon">${b.icon}</span>
        <span class="pc-block-name" style="color:${b.color}">${label}</span>
        <span class="pc-status status-ok" id="status-${b.id}">OK</span>
      </div>
      <div class="pc-metrics" id="metrics-${b.id}">
        ${b.metrics.map(m=>`
        <div class="metric">
          <div class="metric-row"><span>${m.name}</span><span id="mval-${b.id}-${m.name}" style="color:${b.color}">${m.val}${m.unit}</span></div>
          <div class="metric-bar"><div class="metric-fill" id="mbar-${b.id}-${m.name}" style="width:${Math.min(m.val,100)}%;background:${b.color}"></div></div>
        </div>`).join('')}
      </div>
      <button class="sim-btn danger" id="btn-${b.id}" onclick="triggerFailure('${b.id}')" style="width:100%;margin-top:10px;text-align:center;">
        ${T('simFail')}
      </button>
    `;
    diag.appendChild(block);
  });

  animateMetrics();
}

function animateMetrics(){
  setInterval(()=>{
    if(!simBlocks) return;
    simBlocks.forEach(b=>{
      if(simState[b.id] === 'ok'){
        b.metrics.forEach(m=>{
          let delta = (Math.random()-0.5)*5;
          let newVal = Math.max(5, Math.min(m.val+delta, m.name==='Uso'||m.name==='CPU'?95:m.val+10));
          const valEl = document.getElementById(`mval-${b.id}-${m.name}`);
          const barEl = document.getElementById(`mbar-${b.id}-${m.name}`);
          if(valEl){
            if(m.unit==='%'||m.unit==='') valEl.textContent = Math.round(newVal)+m.unit;
          }
          if(barEl && m.unit==='%'){
            barEl.style.width = Math.min(newVal,100)+'%';
          }
        });
      }
    });
  }, 1500);
}

function triggerFailure(id) {
  const b = simBlocks.find(x=>x.id===id);
  if(!b) return;

  simState[id] = 'fail';
  failCount++;
  document.getElementById('fail-count').textContent = failCount;

  const block = document.getElementById('sim-'+id);
  block.className = 'pc-block failing';
  const statusEl = document.getElementById('status-'+id);
  statusEl.className = 'pc-status status-fail';
  statusEl.innerHTML = 'FALHA<span class="fail-dot"></span>';

  const btn = document.getElementById('btn-'+id);
  btn.className = 'sim-btn active-fail';
  btn.textContent = T('simFailing');
  btn.disabled = true;

  b.metrics.forEach(m=>{
    const valEl = document.getElementById(`mval-${b.id}-${m.name}`);
    const barEl = document.getElementById(`mbar-${b.id}-${m.name}`);
    if(valEl){
      if(m.name==='Uso'||m.name==='CPU') valEl.textContent = '100%';
      else if(m.name==='Temp') valEl.textContent = '99°C';
      else valEl.textContent = '0'+m.unit;
      valEl.style.color = '#ef4444';
    }
    if(barEl){
      barEl.style.background = '#ef4444';
      barEl.style.width = (m.name==='Uso'||m.name==='CPU'?'100':'0')+'%';
    }
  });

  b.failures.effects.forEach((eff,i)=>{
    setTimeout(()=>{
      const target = document.getElementById('sim-'+eff.target);
      if(target && simState[eff.target] !== 'fail'){
        target.className = 'pc-block '+(eff.status==='fail'?'failing':'warning');
        const ts = document.getElementById('status-'+eff.target);
        if(ts){
          if(eff.status==='fail'){
            ts.className='pc-status status-fail';
            ts.innerHTML='CRÍTICO<span class="fail-dot"></span>';
          } else {
            ts.className='pc-status status-warn';
            ts.textContent='AVISO';
          }
        }
      }
    }, i*400);
  });

  const failName = typeof b.failures.name === 'object' ? b.failures.name[currentLang] : b.failures.name;
  addLog({type:'warn', msg:`>>> FALHA DETECTADA: ${failName} <<<`});

  const logs = b.failures.logs[currentLang] || b.failures.logs['pt'];
  logs.forEach((log,i) => {
    setTimeout(()=>addLog(log), (i+1)*600);
  });

  const _totalDelay = (logs.length + 1) * 600 + 200;
  setTimeout(() => {
    const affectedCount = b.failures.effects.length;
    addLog({type:'error', msg:`Impacto total: ${affectedCount} componentes afetados em cascata`});
  }, _totalDelay);

  // Show repair button after all logs finish
  if (b.repairs) {
    setTimeout(() => {
      const blk = document.getElementById('sim-' + id);
      if (!blk || blk.querySelector('.repair-btn')) return;
      const repBtn = document.createElement('button');
      repBtn.className = 'sim-btn repair-btn';
      repBtn.innerHTML = T('simRepair');
      repBtn.onclick = () => openRepairPanel(id);
      blk.appendChild(repBtn);
      // log hint
      addLog({type:'info', msg:'>>> ' + T('simRepair') + ' disponível para este componente <<<'});
    }, _totalDelay + 600);
  }
}

function addLog(log) {
  const entries = document.getElementById('log-entries');
  const div = document.createElement('div');
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  div.className = `log-entry ${log.type}`;
  div.innerHTML = `<span class="log-ts">[${ts}]</span> ${log.msg}`;
  entries.appendChild(div);
  const logDiv = document.getElementById('impact-log');
  logDiv.scrollTop = logDiv.scrollHeight;
}

function resetSim() {
  simState = {};
  failCount = 0;
  document.getElementById('fail-count').textContent = '0';
  const diag = document.getElementById('pc-diagram');
  diag.innerHTML = '';
  document.getElementById('log-entries').innerHTML = `<div class="log-entry success"><span class="log-ts">[${new Date().toLocaleTimeString()}]</span> ${T('simReset2')}</div>`;
  closeRepairPanel();
  initSim();
}

// ============================================================
//  REPAIR PANEL
// ============================================================
function openRepairPanel(id) {
  const b = simBlocks.find(x => x.id === id);
  if (!b || !b.repairs) return;
  const lang = currentLang;
  const t = DATA_STORE.translations[lang];
  const compData = DATA_STORE.components[id];
  const color = b.color;
  const steps = b.repairs.steps[lang] || b.repairs.steps['pt'];
  const levelLabels = t.repairLevels || {easy:'Fácil', medium:'Moderado', hard:'Avançado'};
  const levelDesc   = t.repairLevelDesc || {easy:'', medium:'', hard:''};
  const levelColors = {easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444'};
  const compName = compData ? (typeof compData.name === 'object' ? compData.name[lang] : compData.name) : id.toUpperCase();

  const panel  = document.getElementById('repair-panel');
  const pTitle = document.getElementById('repair-panel-title');
  const pBody  = document.getElementById('repair-panel-body');

  // Header
  pTitle.innerHTML = [
    '<span style="font-size:1.6rem;margin-right:10px;">' + b.icon + '</span>',
    '<span style="font-family:var(--font-title);font-size:1.1rem;font-weight:700;color:#fff;">' + compName + '</span>',
    '<span style="margin-left:8px;font-family:var(--font-mono);font-size:0.58rem;padding:2px 10px;border-radius:20px;background:' + color + '18;color:' + color + ';border:1px solid ' + color + '44;">' + (compData ? compData.type || '' : '') + '</span>'
  ].join('');

  // Difficulty legend
  let html = '<div class="repair-legend">';
  ['easy','medium','hard'].forEach(function(lvl) {
    html += '<div class="repair-legend-item">';
    html += '<span class="repair-badge repair-badge-' + lvl + '">' + levelLabels[lvl] + '</span>';
    html += '<span class="repair-legend-desc">' + levelDesc[lvl] + '</span>';
    html += '</div>';
  });
  html += '</div>';

  // Steps
  html += '<div class="repair-steps">';
  steps.forEach(function(step, i) {
    const lc = levelColors[step.level] || '#7a99bb';
    html += '<div class="repair-step" style="--step-color:' + lc + ';">';
    html += '<div class="repair-step-header">';
    html += '<div class="repair-step-num">' + String(i + 1).padStart(2, '0') + '</div>';
    html += '<span class="repair-step-icon">' + step.icon + '</span>';
    html += '<div class="repair-step-title">' + step.title + '</div>';
    html += '<span class="repair-badge repair-badge-' + step.level + '">' + levelLabels[step.level] + '</span>';
    html += '</div>';
    html += '<div class="repair-step-desc">' + step.desc + '</div>';
    html += '</div>';
  });
  html += '</div>';

  pBody.innerHTML = html;
  panel.classList.add('open');
  panel.scrollTop = 0;
}

function closeRepairPanel() {
  const panel = document.getElementById('repair-panel');
  if (panel) panel.classList.remove('open');
}

// ============================================================
//  VIRUS VIEW
// ============================================================
function initVirus() {
  if(!DATA_STORE) return;
  const grid = document.getElementById('virus-grid');
  if(grid.children.length > 0) return;
  const lang = currentLang;

  DATA_STORE.viruses.forEach(v => {
    const card = document.createElement('div');
    card.className = 'virus-card';
    card.style.borderColor = v.color+'44';
    const name = typeof v.name === 'object' ? v.name[lang] : v.name;
    const type = typeof v.type === 'object' ? v.type[lang] : v.type;
    const desc = typeof v.desc === 'object' ? v.desc[lang] : v.desc;
    const targets = v.targets[lang] || v.targets['pt'];
    card.innerHTML = `
      <div class="virus-name" style="color:${v.color}">${name}</div>
      <span class="virus-type-tag" style="background:${v.color}15;border-color:${v.color}44;color:${v.color}">${type}</span>
      <div class="virus-desc">${desc}</div>
      <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text3);margin-bottom:6px;">${T('virusExamples')} ${v.examples}</div>
      <div class="virus-targets">
        ${targets.map(t=>`<span class="target-tag">📍 ${t}</span>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================
//  PROTECTION VIEW
// ============================================================
function initProtectionView() {
  if(!DATA_STORE) return;
  const lang = currentLang;
  const t = DATA_STORE.translations[lang];
  const viruses = DATA_STORE.viruses;

  // Build attack list
  const listEl = document.getElementById('attack-list');
  listEl.innerHTML = '';
  viruses.forEach((v, idx) => {
    const name = typeof v.name === 'object' ? v.name[lang] : v.name;
    const type = typeof v.type === 'object' ? v.type[lang] : v.type;
    const item = document.createElement('div');
    item.className = 'attack-item' + (idx === selectedAttack ? ' active' : '');
    item.innerHTML = `
      <div class="attack-dot" style="background:${v.color}"></div>
      <div>
        <div class="attack-item-name">${name}</div>
        <div class="attack-item-type">${type}</div>
      </div>
    `;
    item.onclick = () => selectAttack(idx);
    listEl.appendChild(item);
  });

  renderAttackSim(selectedAttack);
}

function selectAttack(idx) {
  selectedAttack = idx;
  simRunning = false;
  document.querySelectorAll('.attack-item').forEach((el,i)=>{
    el.classList.toggle('active', i === idx);
  });
  renderAttackSim(idx);
}

function renderAttackSim(idx) {
  if(!DATA_STORE) return;
  const lang = currentLang;
  const t = DATA_STORE.translations[lang];
  const v = DATA_STORE.viruses[idx];
  if(!v) return;

  const name = typeof v.name === 'object' ? v.name[lang] : v.name;
  const type = typeof v.type === 'object' ? v.type[lang] : v.type;
  const prot = v.protection;
  const attackSteps = prot.attackSteps[lang] || prot.attackSteps['pt'];
  const defenseSteps = prot.defenseSteps[lang] || prot.defenseSteps['pt'];
  const actions = prot.actions[lang] || prot.actions['pt'];

  const midIdx = Math.floor(attackSteps.length / 2);

  const panel = document.getElementById('prot-sim-panel');
  panel.innerHTML = `
    <div class="prot-sim-header">
      <div class="prot-sim-icon">🦠</div>
      <div>
        <div class="prot-sim-name">${name}</div>
        <span class="prot-sim-type" style="background:${v.color}18;border:1px solid ${v.color}44;color:${v.color}">${type}</span>
      </div>
    </div>

    <button class="prot-start-btn" id="prot-start-btn" onclick="startAttackSim(${idx})">
      ${t.protectionStart}
    </button>
    <div class="sim-progress"><div class="sim-progress-fill" id="sim-progress-fill"></div></div>

    <div class="prot-timeline" id="prot-timeline">
      <div class="prot-phase-title attack-phase">${t.protectionPhases[0]}</div>
      <div class="timeline-steps" id="attack-steps">
        ${attackSteps.slice(0, midIdx).map((s,i)=>`
          <div class="timeline-step attack-step" id="astep-${i}">
            <span class="timeline-step-num">${String(i+1).padStart(2,'0')}</span>${s}
          </div>`).join('')}
      </div>

      <div class="prot-phase-title infect-phase">${t.protectionPhases[1]}</div>
      <div class="timeline-steps" id="infect-steps">
        ${attackSteps.slice(midIdx).map((s,i)=>`
          <div class="timeline-step attack-step" id="istep-${i}">
            <span class="timeline-step-num">${String(midIdx+i+1).padStart(2,'0')}</span>${s}
          </div>`).join('')}
      </div>

      <div class="prot-phase-title defense-phase">${t.protectionPhases[2]}</div>
      <div class="timeline-steps" id="defense-steps">
        ${defenseSteps.map((s,i)=>`
          <div class="timeline-step defense-step" id="dstep-${i}">
            <span class="timeline-step-num">${String(i+1).padStart(2,'0')}</span>${s}
          </div>`).join('')}
      </div>
    </div>

    <div class="prot-bottom">
      <div>
        <div class="prot-section-title">${t.protectionTools}</div>
        <div>${prot.tools.map(tool=>`<span class="tool-tag">🛡️ ${tool}</span>`).join('')}</div>
      </div>
      <div>
        <div class="prot-section-title">${t.protectionActions}</div>
        ${actions.map(a=>`<div class="action-item">${a}</div>`).join('')}
      </div>
    </div>
  `;
}

function startAttackSim(idx) {
  if(simRunning) return;
  simRunning = true;
  const lang = currentLang;
  const v = DATA_STORE.viruses[idx];
  const prot = v.protection;
  const attackSteps = prot.attackSteps[lang] || prot.attackSteps['pt'];
  const defenseSteps = prot.defenseSteps[lang] || prot.defenseSteps['pt'];
  const midIdx = Math.floor(attackSteps.length / 2);

  const btn = document.getElementById('prot-start-btn');
  const progressFill = document.getElementById('sim-progress-fill');
  btn.className = 'prot-start-btn running';
  btn.textContent = T('protectionRunning');

  const totalSteps = attackSteps.length + defenseSteps.length;
  let completedSteps = 0;

  const updateProgress = () => {
    completedSteps++;
    const pct = (completedSteps / totalSteps) * 100;
    progressFill.style.width = pct + '%';
    if(completedSteps >= totalSteps) {
      btn.className = 'prot-start-btn done';
      btn.textContent = '✓ Simulação Completa';
      simRunning = false;
    }
  };

  // Reveal attack steps
  attackSteps.slice(0, midIdx).forEach((_, i) => {
    setTimeout(() => {
      const el = document.getElementById(`astep-${i}`);
      if(el) el.classList.add('revealed');
      updateProgress();
    }, i * 700 + 300);
  });

  // Reveal infect steps
  attackSteps.slice(midIdx).forEach((_, i) => {
    setTimeout(() => {
      const el = document.getElementById(`istep-${i}`);
      if(el) el.classList.add('revealed');
      updateProgress();
    }, (midIdx + i) * 700 + 300);
  });

  // Reveal defense steps (after all attack steps)
  defenseSteps.forEach((_, i) => {
    setTimeout(() => {
      const el = document.getElementById(`dstep-${i}`);
      if(el) el.classList.add('revealed');
      updateProgress();
    }, (attackSteps.length + i) * 700 + 800);
  });
}

// ============================================================
//  RELATIONS VIEW
// ============================================================
function initRelations() {
  if(!DATA_STORE) return;
  const table = document.getElementById('rel-table');
  if(table.children.length > 0) return;

  const lang = currentLang;
  const relData = DATA_STORE.relations;
  const components = relData.components;
  const REL = relData.matrix;

  const TOOLTIPS = DATA_STORE.translations[lang].relLegend;

  let html = '<thead><tr><th style="background:#060a0f;min-width:100px;position:sticky;left:0;z-index:3;"></th>';
  components.forEach(c => {
    const label = typeof c.label === 'object' ? c.label[lang] : c.label;
    const compD = DATA_STORE.components[c.id];
    html += `<th style="font-size:0.58rem;color:${compD?.color||'#7a99bb'};writing-mode:vertical-lr;transform:rotate(180deg);height:90px;padding:8px 4px;">${label}</th>`;
  });
  html += '</tr></thead><tbody>';

  components.forEach(row => {
    const rowLabel = typeof row.label === 'object' ? row.label[lang] : row.label;
    const rowD = DATA_STORE.components[row.id];
    html += `<tr><td class="row-header" style="color:${rowD?.color||'#7a99bb'}">${rowLabel}</td>`;
    components.forEach(col => {
      if(row.id === col.id){
        html += `<td style="background:#0a1020;color:#415a78;font-size:0.8rem;">—</td>`;
      } else {
        const rel = (REL[row.id] && REL[row.id][col.id]) || '⬛';
        html += `<td class="rel-cell" title="${TOOLTIPS[rel]||''}">${rel}</td>`;
      }
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;

  const tooltip = document.getElementById('tooltip');
  table.querySelectorAll('.rel-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      tooltip.textContent = cell.title;
      tooltip.classList.add('visible');
    });
    cell.addEventListener('mousemove', e => {
      tooltip.style.left = (e.clientX+12)+'px';
      tooltip.style.top = (e.clientY-30)+'px';
    });
    cell.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

// ============================================================
//  STARTUP
// ============================================================
document.addEventListener('DOMContentLoaded', init);

// ============================================================
//  DIAGNÓSTICO — MOTOR DE BUSCA LOCAL (sem API externa)
// ============================================================

// Mapa de palavras-chave → componentes relevantes com peso
const DIAG_KEYWORD_MAP = {
  // === CALOR / RESFRIAMENTO ===
  'esquenta':        [['cooler',10],['cpu',8],['gpu',7],['psu',4],['mobo',3]],
  'superaquece':     [['cooler',10],['cpu',9],['gpu',8],['psu',4]],
  'quente':          [['cooler',10],['cpu',8],['gpu',7]],
  'calor':           [['cooler',9],['cpu',7],['gpu',6]],
  'temperatura':     [['cooler',9],['cpu',7],['gpu',6]],
  'thermal':         [['cooler',10],['cpu',8]],
  'throttling':      [['cooler',10],['cpu',9]],
  'desliga sozinho': [['cooler',9],['psu',8],['cpu',6]],
  'desliga':         [['cooler',7],['psu',8],['mobo',5]],
  'pasta':           [['cooler',10],['cpu',6]],
  'fan':             [['cooler',10]],
  'cooler':          [['cooler',10]],
  'ventilador':      [['cooler',10],['gpu',5]],
  'barulho':         [['cooler',7],['storage',6],['psu',5]],
  'ruido':           [['cooler',7],['storage',6]],
  'barulhento':      [['cooler',7],['storage',6]],

  // === CPU / DESEMPENHO ===
  'lento':           [['cpu',8],['ram',8],['storage',7],['processes',6],['so',5]],
  'devagar':         [['cpu',7],['ram',8],['storage',7]],
  'travando':        [['cpu',7],['ram',9],['storage',7],['gpu',6]],
  'trava':           [['cpu',7],['ram',9],['storage',7]],
  'travar':          [['cpu',7],['ram',9],['storage',7]],
  'processador':     [['cpu',10],['mobo',5],['cooler',6]],
  'cpu':             [['cpu',10],['cooler',6]],
  'overclock':       [['overclock',10],['cpu',7],['cooler',8]],
  'desempenho':      [['cpu',7],['ram',6],['gpu',6],['storage',5]],
  'performance':     [['cpu',7],['ram',6],['gpu',6]],
  'lentidão':        [['cpu',7],['ram',8],['storage',7],['processes',6]],

  // === RAM / MEMÓRIA ===
  'memória':         [['ram',10],['processes',5],['vm',4]],
  'ram':             [['ram',10]],
  'memoria':         [['ram',10]],
  'pente':           [['ram',10],['mobo',5]],
  'módulo':          [['ram',9]],
  'bsod':            [['ram',9],['cpu',7],['storage',7],['drivers',8],['so',7]],
  'tela azul':       [['ram',9],['cpu',7],['storage',7],['drivers',8],['so',7]],
  'tela-azul':       [['ram',9],['drivers',8],['so',7]],
  'dump':            [['ram',8],['so',7],['drivers',7]],
  'erro de memória': [['ram',10],['mobo',5]],

  // === GPU / VÍDEO ===
  'gpu':             [['gpu',10],['drivers',7],['pcie',6],['psu',6]],
  'placa de vídeo':  [['gpu',10],['drivers',7],['pcie',6]],
  'video':           [['gpu',8],['drivers',7]],
  'vídeo':           [['gpu',8],['drivers',7]],
  'artefato':        [['gpu',10],['ram',6]],
  'glitch':          [['gpu',9],['drivers',6]],
  'tela preta':      [['gpu',8],['drivers',7],['mobo',5],['bios',4]],
  'monitor':         [['gpu',7],['mobo',5]],
  'resolução':       [['gpu',7],['drivers',6]],
  'fps':             [['gpu',9],['cpu',7],['ram',5]],
  'jogo':            [['gpu',8],['cpu',7],['ram',7],['storage',5]],
  'jogar':           [['gpu',8],['cpu',7],['ram',7]],
  'game':            [['gpu',8],['cpu',7],['ram',7]],
  'crash':           [['gpu',7],['ram',7],['cpu',6],['storage',5],['drivers',7]],
  'crashando':       [['gpu',7],['ram',7],['cpu',6],['drivers',7]],

  // === ARMAZENAMENTO ===
  'disco':           [['storage',10],['filesystem',8]],
  'hd':              [['storage',10],['filesystem',7]],
  'ssd':             [['storage',10],['filesystem',7]],
  'armazenamento':   [['storage',10]],
  'cheio':           [['storage',9],['filesystem',7]],
  'espaço':          [['storage',8],['filesystem',6]],
  'arquivo':         [['filesystem',8],['storage',6]],
  'corrompido':      [['filesystem',10],['storage',8]],
  'corrupção':       [['filesystem',10],['storage',8]],
  'perdeu dados':    [['storage',10],['filesystem',9]],
  'sumiu':           [['storage',8],['filesystem',8]],
  'partição':        [['filesystem',9],['storage',7]],
  'chkdsk':          [['filesystem',10],['storage',8]],
  'smart':           [['storage',10]],
  'barulho disco':   [['storage',10]],

  // === BIOS / BOOT / PLACA-MÃE ===
  'não liga':        [['bios',10],['psu',9],['mobo',8],['post',7]],
  'nao liga':        [['bios',10],['psu',9],['mobo',8]],
  'post':            [['post',10],['bios',8]],
  'boot':            [['boot_seq',10],['bios',8],['so',7]],
  'bios':            [['bios',10],['cmos',7]],
  'uefi':            [['uefi',10],['bios',7]],
  'cmos':            [['cmos',10],['bios',7]],
  'beep':            [['post',10],['bios',7],['ram',6],['cpu',6]],
  'placa-mãe':       [['mobo',10],['bios',6]],
  'placa mae':       [['mobo',10],['bios',6]],
  'reinicia':        [['psu',8],['cooler',7],['bios',6],['so',6],['ram',6]],
  'reiniciar':       [['psu',7],['cooler',7],['bios',6],['so',6]],
  'reinicia sozinho':[['psu',9],['cooler',8],['ram',7]],
  'fonte':           [['psu',10],['mobo',6]],

  // === SISTEMA OPERACIONAL ===
  'windows':         [['windows',10],['so',8],['drivers',6]],
  'linux':           [['linux',10],['so',8],['kernel',6]],
  'macos':           [['macos',10],['so',8]],
  'sistema':         [['so',8],['windows',6],['kernel',5]],
  'atualização':     [['windows',8],['so',7],['drivers',6]],
  'update':          [['windows',8],['so',7]],
  'driver':          [['drivers',10],['gpu',6],['nic',5]],
  'drivers':         [['drivers',10],['gpu',6],['nic',5]],
  'reinstalar':      [['so',9],['windows',8],['apps',6]],
  'formatação':      [['so',10],['filesystem',8],['storage',6]],
  'formatar':        [['so',10],['filesystem',8]],
  'kernel':          [['kernel',10],['so',7]],
  'processo':        [['processes',10],['so',7],['cpu',5]],
  'tarefa':          [['processes',9],['so',6]],

  // === REDE / INTERNET ===
  'internet':        [['nic',9],['wifi',9],['dns',7],['tcpip',7],['dhcp',6]],
  'rede':            [['nic',9],['wifi',8],['tcpip',7],['dhcp',6],['firewall',5]],
  'wifi':            [['wifi',10],['nic',7],['dhcp',6]],
  'wi-fi':           [['wifi',10],['nic',7]],
  'sem internet':    [['nic',9],['wifi',9],['dns',8],['dhcp',7]],
  'conexão':         [['nic',8],['wifi',8],['tcpip',7],['dns',6]],
  'conectar':        [['nic',8],['wifi',8],['dns',6],['dhcp',6]],
  'dns':             [['dns',10],['tcpip',6]],
  'dhcp':            [['dhcp',10],['nic',6]],
  'ip':              [['tcpip',9],['dhcp',8],['nic',6]],
  'ping':            [['tcpip',9],['nic',7],['firewall',5]],
  'firewall':        [['firewall',10],['nic',5]],
  'vpn':             [['vpn',10],['firewall',6],['nic',5]],
  'cabo':            [['nic',8],['mobo',5]],
  'ethernet':        [['nic',9],['tcpip',6]],
  'roteador':        [['wifi',8],['dhcp',7],['nic',6]],

  // === VÍRUS / SEGURANÇA ===
  'vírus':           [['virus_cls',10],['malware',9],['antivirus',8],['filesystem',5]],
  'virus':           [['virus_cls',10],['malware',9],['antivirus',8]],
  'malware':         [['malware',10],['antivirus',8],['firewall',6]],
  'ransomware':      [['ransomware',10],['antivirus',7],['filesystem',7]],
  'trojan':          [['malware',9],['antivirus',7]],
  'infectado':       [['virus_cls',9],['malware',9],['antivirus',8]],
  'hackeado':        [['malware',8],['rootkit',8],['firewall',7]],
  'rootkit':         [['rootkit',10],['malware',7]],
  'spyware':         [['malware',9],['antivirus',7]],
  'antivirus':       [['antivirus',10],['virus_cls',6]],
  'antivírus':       [['antivirus',10],['virus_cls',6]],
  'segurança':       [['antivirus',7],['firewall',7],['criptografia',6]],

  // === APLICATIVOS ===
  'aplicativo':      [['apps',10],['so',5],['drivers',4]],
  'programa':        [['apps',10],['so',5]],
  'software':        [['apps',8],['so',5]],
  'instalação':      [['apps',8],['so',6]],
  'não abre':        [['apps',9],['so',6],['drivers',5]],
  'nao abre':        [['apps',9],['so',6]],
  'erro':            [['apps',7],['so',6],['drivers',6],['filesystem',5]],
  'dll':             [['apps',9],['so',6],['drivers',5]],
  'vcruntime':       [['apps',10]],
};

// Mapa de componentes para simBlock (onde há repair steps)
const COMP_TO_SIMBLOCK = {
  'cpu': 'cpu', 'cooler': 'cpu', 'overclock': 'cpu',
  'ram': 'ram',
  'storage': 'storage', 'filesystem': 'filesystem',
  'gpu': 'gpu', 'pcie': 'gpu',
  'nic': 'net', 'wifi': 'net', 'tcpip': 'net', 'dns': 'net', 'dhcp': 'net', 'firewall': 'net', 'vpn': 'net',
  'so': 'so', 'windows': 'so', 'linux': 'so', 'macos': 'so', 'kernel': 'so', 'drivers': 'so', 'processes': 'so',
  'apps': 'apps',
  'bios': 'bios', 'post': 'bios', 'cmos': 'bios', 'boot_seq': 'bios', 'uefi': 'bios',
  'psu': 'cpu', 'mobo': 'bios',
  'virus_cls': 'filesystem', 'malware': 'filesystem', 'ransomware': 'filesystem',
  'rootkit': 'filesystem', 'antivirus': 'filesystem',
};

// Mapa de ícones de categoria
const COMP_ICONS = {
  'cpu':'⚙️','cooler':'❄️','ram':'💾','gpu':'🎮','storage':'💿','filesystem':'📁',
  'so':'💻','windows':'🪟','linux':'🐧','macos':'🍎','drivers':'🔌','kernel':'⚛️','processes':'⚙️',
  'bios':'🔑','post':'🟢','cmos':'🔋','boot_seq':'🚀','uefi':'🛡️','overclock':'📈',
  'nic':'📡','wifi':'📶','dns':'🔍','dhcp':'📋','tcpip':'📡','firewall':'🔥','vpn':'🔒',
  'psu':'🔌','mobo':'🟫','pcie':'🔗',
  'virus_cls':'🦠','malware':'☠️','ransomware':'🔐','rootkit':'👻','antivirus':'🛡️','criptografia':'🔑',
  'apps':'📱',
};

function initDiag() {
  const ta = document.getElementById('diag-problem-input');
  if (ta && !ta._diagInit) {
    ta._diagInit = true;
    ta.addEventListener('input', () => {
      document.getElementById('diag-char').textContent = ta.value.length;
    });
  }
}

function diagChip(el) {
  const ta = document.getElementById('diag-problem-input');
  ta.value = el.textContent.replace(/^[^\s]+\s/, '');
  document.getElementById('diag-char').textContent = ta.value.length;
  ta.focus();
}

function diagAnalyze() {
  const problem = (document.getElementById('diag-problem-input').value || '').trim().toLowerCase();
  if (problem.length < 5) {
    const ta = document.getElementById('diag-problem-input');
    ta.style.border = '1px solid rgba(239,68,68,0.7)';
    setTimeout(() => ta.style.border = '', 1800);
    return;
  }

  // Show loading briefly for UX
  document.getElementById('diag-loading').classList.remove('hidden');
  document.getElementById('diag-result').classList.add('hidden');
  document.querySelector('.diag-input-wrap').style.opacity = '0.4';

  setTimeout(() => {
    const result = diagSearch(problem);
    document.getElementById('diag-loading').classList.add('hidden');
    document.querySelector('.diag-input-wrap').style.opacity = '1';
    diagRenderResult(result, problem);
    document.getElementById('diag-result').classList.remove('hidden');
    document.getElementById('diag-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 600);
}

function diagSearch(text) {
  if (!DATA_STORE) return null;

  // 1) Score components via keyword matching
  const scores = {};
  const matchedKeywords = [];

  for (const [kw, hits] of Object.entries(DIAG_KEYWORD_MAP)) {
    if (text.includes(kw)) {
      matchedKeywords.push(kw);
      hits.forEach(([comp, weight]) => {
        scores[comp] = (scores[comp] || 0) + weight;
      });
    }
  }

  // 2) Also do word-level fuzzy match against component names/descs
  const words = text.split(/\s+/).filter(w => w.length > 3);
  words.forEach(word => {
    Object.entries(DATA_STORE.components || {}).forEach(([key, comp]) => {
      const name = (comp.name || '').toLowerCase();
      const desc = (comp.desc || '').toLowerCase();
      if (name.includes(word) || desc.includes(word)) {
        scores[key] = (scores[key] || 0) + 3;
      }
    });
  });

  // 3) Rank components
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (ranked.length === 0) {
    return { noMatch: true };
  }

  // 4) Collect unique simBlocks to pull repair steps from
  const simBlockIds = [];
  ranked.forEach(([comp]) => {
    const sb = COMP_TO_SIMBLOCK[comp];
    if (sb && !simBlockIds.includes(sb)) simBlockIds.push(sb);
  });

  // 5) Gather repair steps from the top simBlocks (max 2 blocks, max 4 steps each)
  const allSteps = [];
  const lang = currentLang || 'pt';
  simBlockIds.slice(0, 2).forEach(sbId => {
    const block = (DATA_STORE.simBlocks || []).find(b => b.id === sbId);
    if (!block || !block.repairs) return;
    const steps = (block.repairs.steps[lang] || block.repairs.steps['pt'] || []);
    // Prioritize easy steps first, then medium, then hard
    const sorted = [...steps].sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 };
      return (order[a.level] || 0) - (order[b.level] || 0);
    });
    sorted.slice(0, 4).forEach(s => {
      allSteps.push({ ...s, source: sbId });
    });
  });

  // 6) Also check viruses if relevant
  const virusMatch = [];
  if (scores['virus_cls'] > 0 || scores['malware'] > 0 || scores['ransomware'] > 0 || scores['rootkit'] > 0) {
    const topVirus = findTopVirus(text, lang);
    if (topVirus) virusMatch.push(topVirus);
  }

  // 7) Collect component details for causes section
  const causes = ranked.slice(0, 4).map(([comp, score]) => ({
    comp,
    score,
    data: DATA_STORE.components[comp],
    icon: COMP_ICONS[comp] || '🔧',
  })).filter(c => c.data);

  // 8) Determine severity
  const topScore = ranked[0] ? ranked[0][1] : 0;
  const severity = topScore >= 18 ? 'crítico' : topScore >= 12 ? 'alto' : topScore >= 6 ? 'médio' : 'baixo';

  return { causes, allSteps, virusMatch, severity, matchedKeywords, ranked };
}

function findTopVirus(text, lang) {
  const viruses = DATA_STORE.viruses || [];
  for (const v of viruses) {
    const name = (typeof v.name === 'object' ? v.name['pt'] : v.name).toLowerCase();
    const desc = (typeof v.desc === 'object' ? v.desc['pt'] : v.desc).toLowerCase();
    if (text.includes(name) || desc.split(' ').some(w => w.length > 5 && text.includes(w))) {
      return v;
    }
  }
  // If generic virus keywords matched, return first virus as reference
  if (text.includes('vírus') || text.includes('virus') || text.includes('malware')) {
    return viruses[1] || viruses[0]; // return malware entry
  }
  return null;
}

const SEVERITY_STYLE = {
  'baixo':   { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',   label: '🟢 BAIXO' },
  'médio':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  label: '🟡 MÉDIO' },
  'alto':    { color: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)',  label: '🟠 ALTO' },
  'crítico': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   label: '🔴 CRÍTICO' },
};
const LEVEL_STYLE = {
  easy:   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   label: 'Fácil' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Moderado' },
  hard:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Avançado' },
};

// Store last diagnosis for PDF export
let _diagLastResult = null;
let _diagLastProblem = '';

function diagRenderResult(result, problem) {
  _diagLastResult = result;
  _diagLastProblem = problem;

  const container = document.getElementById('diag-result-inner');

  if (!result || result.noMatch) {
    container.innerHTML = `
      <div class="diag-nomatch">
        <div style="font-size:2rem;margin-bottom:12px;">🤔</div>
        <div class="diag-nomatch-title">Problema não identificado na base de dados</div>
        <div class="diag-nomatch-sub">Tente usar termos mais específicos como: <em>tela azul, superaquece, sem internet, não liga, vírus, lento</em>...</div>
      </div>`;
    return;
  }

  const { causes, allSteps, virusMatch, severity, matchedKeywords } = result;
  const sev = SEVERITY_STYLE[severity] || SEVERITY_STYLE['médio'];
  const lang = currentLang || 'pt';
  let html = '';

  // ── Header ───────────────────────────────────────────────
  const mainCause = causes[0];
  const title = mainCause ? `Diagnóstico: ${mainCause.data.name}` : 'Diagnóstico Concluído';
  html += `
    <div class="diag-result-header" style="background:${sev.bg};border:1px solid ${sev.border};">
      <div class="diag-result-title">${title}</div>
      <div style="margin:6px 0;">
        <span class="diag-sev-badge" style="background:${sev.bg};border:1px solid ${sev.border};color:${sev.color};">${sev.label}</span>
      </div>
      <div class="diag-result-summary">
        ${mainCause ? mainCause.data.desc.split('.')[0] + '.' : ''}
        ${causes.length > 1 ? `Também verifique: ${causes.slice(1,3).map(c=>c.data.name).join(', ')}.` : ''}
      </div>
      ${matchedKeywords.length ? `<div class="diag-keywords">Palavras-chave detectadas: ${matchedKeywords.slice(0,6).map(k=>`<span class="diag-kw">${k}</span>`).join('')}</div>` : ''}
    </div>`;

  // ── Causas prováveis ─────────────────────────────────────
  const maxScore = causes[0] ? causes[0].score : 1;
  html += `<div class="diag-section">
    <div class="diag-section-label">// causas prováveis</div>`;
  causes.forEach((c) => {
    const pct = Math.round((c.score / maxScore) * 100);
    const barColor = pct > 75 ? '#ef4444' : pct > 45 ? '#f59e0b' : '#22c55e';
    const impacts = (c.data.impacts || []).slice(0, 2);
    html += `
      <div class="diag-cause-card" style="border-left:3px solid ${c.data.color || '#00d4ff'}40;">
        <div class="diag-cause-top">
          <span class="diag-cause-icon">${c.icon}</span>
          <div style="flex:1;">
            <div class="diag-cause-name" style="color:${c.data.color || '#fff'}">${c.data.name}</div>
            <div class="diag-cause-type">${c.data.type || ''}</div>
          </div>
          <div class="diag-prob-wrap">
            <div class="diag-prob-num" style="color:${barColor}">${pct}%</div>
            <div class="diag-prob-track"><div class="diag-prob-fill" style="width:${pct}%;background:${barColor}"></div></div>
          </div>
        </div>
        ${impacts.length ? `<div class="diag-impacts">${impacts.map(im=>`<span class="diag-impact-item">⚠ ${im}</span>`).join('')}</div>` : ''}
        <button class="diag-see-more" onclick="event.stopPropagation(); openPanel('${c.comp}')">
          Ver detalhes do componente →
        </button>
      </div>`;
  });
  html += '</div>';

  // ── Passo a passo com checkboxes ─────────────────────────
  if (allSteps.length > 0) {
    html += `<div class="diag-section">
      <div class="diag-section-label">// passo a passo — marque os passos conforme executa</div>`;
    allSteps.forEach((step, i) => {
      const lvl = LEVEL_STYLE[step.level] || LEVEL_STYLE.easy;
      html += `
        <div class="diag-step-card" id="diag-step-${i}" style="animation-delay:${i * 0.06}s">
          <div class="diag-step-header">
            <div class="diag-step-num">${String(i+1).padStart(2,'0')}</div>
            <span class="diag-step-icon">${step.icon || '🔧'}</span>
            <div class="diag-step-title">${step.title}</div>
            <span class="diag-diff-badge" style="background:${lvl.bg};color:${lvl.color};">${lvl.label}</span>
            <div class="diag-step-status-wrap">
              <label class="diag-cb-label diag-cb-solved">
                <input type="checkbox" class="diag-cb" data-step="${i}" data-status="solved" onchange="diagToggleStep(this)">
                <span>✓ Resolvido</span>
              </label>
              <label class="diag-cb-label diag-cb-pending">
                <input type="checkbox" class="diag-cb" data-step="${i}" data-status="pending" onchange="diagToggleStep(this)">
                <span>⏳ Pendente</span>
              </label>
            </div>
          </div>
          <div class="diag-step-desc">${step.desc}</div>
        </div>`;
    });
    html += '</div>';
  }

  // ── Vírus info ───────────────────────────────────────────
  if (virusMatch.length > 0) {
    const v = virusMatch[0];
    const vname = typeof v.name === 'object' ? v.name[lang] : v.name;
    const vdesc = typeof v.desc === 'object' ? v.desc[lang] : v.desc;
    const defSteps = (v.protection && v.protection.defenseSteps && (v.protection.defenseSteps[lang] || v.protection.defenseSteps['pt'])) || [];
    html += `<div class="diag-section">
      <div class="diag-section-label">// ameaça identificada — plano de defesa</div>
      <div class="diag-virus-card" style="border-color:${v.color}44;">
        <div class="diag-virus-name" style="color:${v.color}">${vname}</div>
        <div class="diag-virus-desc">${vdesc}</div>
        ${defSteps.length ? `<div class="diag-section-label" style="margin-top:14px;">passos de defesa</div>
        ${defSteps.map((s,i)=>`<div class="diag-defense-step"><span class="diag-def-num">${String(i+1).padStart(2,'0')}</span>${s}</div>`).join('')}` : ''}
        ${v.protection && v.protection.tools ? `<div class="diag-tools-row">${v.protection.tools.map(tool=>`<span class="diag-tool-tag">🛡️ ${tool}</span>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }

  // ── Componentes relacionados ─────────────────────────────
  const relComps = new Set();
  causes.forEach(c => { (c.data.relations || []).forEach(r => relComps.add(r)); });
  if (relComps.size > 0) {
    html += `<div class="diag-section">
      <div class="diag-section-label">// componentes relacionados — clique para ver detalhes</div>
      <div class="diag-related-row">`;
    [...relComps].slice(0, 8).forEach(cid => {
      const cd = DATA_STORE.components[cid];
      if (cd) {
        html += `<div class="diag-rel-chip" style="background:${cd.color}10;border-color:${cd.color}44;color:${cd.color};" onclick="event.stopPropagation(); openPanel('${cid}')">
          ${COMP_ICONS[cid] || ''} ${cd.name}
        </div>`;
      }
    });
    html += '</div></div>';
  }

  // ── Botão emitir relatório ───────────────────────────────
  html += `
    <div class="diag-pdf-bar">
      <div class="diag-pdf-info">
        <span style="font-size:1.1rem;">📄</span>
        <div>
          <div class="diag-pdf-bar-title">Relatório de Diagnóstico</div>
          <div class="diag-pdf-bar-sub">Marque os passos como Resolvido ou Pendente antes de emitir</div>
        </div>
      </div>
      <button class="diag-pdf-btn" onclick="diagExportPDF()">
        ⬇ Emitir Relatório PDF
      </button>
    </div>`;

  container.innerHTML = html;
}

// Toggle step status — garante exclusividade resolvido/pendente
function diagToggleStep(cb) {
  const card = document.getElementById(`diag-step-${cb.dataset.step}`);
  const other = card.querySelector(`.diag-cb[data-status="${cb.dataset.status === 'solved' ? 'pending' : 'solved'}"]`);
  if (cb.checked && other && other.checked) other.checked = false;
  // Visual feedback on the card
  card.classList.remove('step-solved', 'step-pending');
  const solvedCb  = card.querySelector('.diag-cb[data-status="solved"]');
  const pendingCb = card.querySelector('.diag-cb[data-status="pending"]');
  if (solvedCb && solvedCb.checked)   card.classList.add('step-solved');
  if (pendingCb && pendingCb.checked) card.classList.add('step-pending');
}

// ── PDF Export ────────────────────────────────────────────────
function diagExportPDF() {
  const result = _diagLastResult;
  if (!result || result.noMatch) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const ML = 18, MR = 18, MT = 20;
  let y = MT;

  // ── Palette ──────────────────────────────────────────────
  const COL = {
    dark:    [6,  10, 15],
    surface: [15, 24, 35],
    accent:  [0, 212, 255],
    white:   [255,255,255],
    text:    [200,218,240],
    text2:   [122,153,187],
    border:  [36, 53, 80],
    green:   [34, 197, 94],
    yellow:  [245,158,11],
    red:     [239, 68, 68],
    orange:  [249,115,22],
  };

  const sevColor = {
    'baixo':   COL.green,
    'médio':   COL.yellow,
    'alto':    COL.orange,
    'crítico': COL.red,
  };
  const lvlColor = { easy: COL.green, medium: COL.yellow, hard: COL.red };
  const lvlLabel = { easy: 'Fácil', medium: 'Moderado', hard: 'Avançado' };

  const lang = currentLang || 'pt';
  const { causes, allSteps, virusMatch, severity, matchedKeywords } = result;
  const sev = sevColor[severity] || COL.yellow;
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  const mainCause = causes[0];

  // Helper: check page overflow
  function checkPage(needed = 10) {
    if (y + needed > H - 18) {
      doc.addPage();
      // Page background
      doc.setFillColor(...COL.dark);
      doc.rect(0, 0, W, H, 'F');
      // Top accent line
      doc.setDrawColor(...COL.accent);
      doc.setLineWidth(0.4);
      doc.line(ML, 10, W - MR, 10);
      y = 18;
    }
  }

  function setFont(style, size, color) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...(color || COL.text));
  }

  function wrappedText(text, x, maxW, lineH) {
    const lines = doc.splitTextToSize(String(text), maxW);
    lines.forEach(line => {
      checkPage(lineH + 2);
      doc.text(line, x, y);
      y += lineH;
    });
    return lines.length;
  }

  // ── PAGE 1 BACKGROUND ────────────────────────────────────
  doc.setFillColor(...COL.dark);
  doc.rect(0, 0, W, H, 'F');

  // Grid pattern (subtle)
  doc.setDrawColor(0, 212, 255, 0.04);
  doc.setLineWidth(0.1);
  for (let gx = 0; gx < W; gx += 12) doc.line(gx, 0, gx, H);
  for (let gy = 0; gy < H; gy += 12) doc.line(0, gy, W, gy);

  // Top accent bar
  doc.setFillColor(...COL.accent);
  doc.rect(0, 0, W, 2, 'F');

  // ── LOGO / HEADER ────────────────────────────────────────
  y = 14;
  // Left brand
  setFont('bold', 16, COL.accent);
  doc.text('ARQ_COMP', ML, y);
  setFont('normal', 7, COL.text2);
  doc.text('// Sistemas Computacionais', ML, y + 5);

  // Right: date
  setFont('normal', 7, COL.text2);
  doc.text(dateStr, W - MR, y, { align: 'right' });
  doc.text('Relatório de Diagnóstico', W - MR, y + 5, { align: 'right' });

  y = 26;
  doc.setDrawColor(...COL.border);
  doc.setLineWidth(0.3);
  doc.line(ML, y, W - MR, y);
  y += 8;

  // ── TITLE BLOCK ──────────────────────────────────────────
  // Severity badge box
  doc.setFillColor(...sev);
  doc.roundedRect(ML, y - 4, 32, 7, 1.5, 1.5, 'F');
  setFont('bold', 7, COL.dark);
  doc.text(severity.toUpperCase(), ML + 16, y + 0.5, { align: 'center' });

  y += 8;
  setFont('bold', 14, COL.white);
  doc.text(mainCause ? `Diagnostico: ${mainCause.data.name}` : 'Diagnostico Completo', ML, y);
  y += 7;

  // Problem description box
  doc.setFillColor(...COL.surface);
  doc.setDrawColor(...COL.border);
  doc.setLineWidth(0.3);
  const problemLines = doc.splitTextToSize(_diagLastProblem || '—', W - ML - MR - 8);
  const pbH = problemLines.length * 5 + 10;
  doc.roundedRect(ML, y, W - ML - MR, pbH, 2, 2, 'FD');
  setFont('normal', 7, COL.text2);
  doc.text('Problema relatado:', ML + 4, y + 6);
  setFont('normal', 8, COL.text);
  problemLines.forEach((line, li) => {
    doc.text(line, ML + 4, y + 12 + li * 5);
  });
  y += pbH + 6;

  // Keywords
  if (matchedKeywords && matchedKeywords.length) {
    setFont('normal', 6.5, COL.text2);
    doc.text('Palavras-chave detectadas: ' + matchedKeywords.slice(0,6).join(', '), ML, y);
    y += 8;
  }

  // ── CAUSES ──────────────────────────────────────────────
  checkPage(14);
  // Section header
  doc.setFillColor(...COL.accent);
  doc.rect(ML, y, 2, 5, 'F');
  setFont('bold', 9, COL.accent);
  doc.text('CAUSAS PROVAVEIS', ML + 5, y + 4);
  y += 10;

  const maxScore = causes[0] ? causes[0].score : 1;
  causes.forEach(c => {
    checkPage(22);
    const pct = Math.round((c.score / maxScore) * 100);
    const bColor = pct > 75 ? COL.red : pct > 45 ? COL.yellow : COL.green;

    // Card background
    doc.setFillColor(...COL.surface);
    doc.setDrawColor(...COL.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(ML, y, W - ML - MR, 18, 2, 2, 'FD');

    // Left accent
    doc.setFillColor(...(c.data.color ? hexToRgb(c.data.color) : COL.accent));
    doc.rect(ML, y, 2, 18, 'F');

    setFont('bold', 9, COL.white);
    doc.text(c.data.name, ML + 6, y + 6);
    setFont('normal', 6.5, COL.text2);
    doc.text(c.data.type || '', ML + 6, y + 11);

    // Probability bar
    const barX = W - MR - 45;
    setFont('bold', 8, bColor);
    doc.text(`${pct}%`, barX - 8, y + 7, { align: 'right' });
    doc.setFillColor(...COL.border);
    doc.roundedRect(barX, y + 3, 40, 3, 1, 1, 'F');
    doc.setFillColor(...bColor);
    doc.roundedRect(barX, y + 3, 40 * pct / 100, 3, 1, 1, 'F');

    // Impact
    if (c.data.impacts && c.data.impacts[0]) {
      setFont('normal', 6, [255,150,150]);
      doc.text('! ' + c.data.impacts[0].substring(0, 70), ML + 6, y + 15.5);
    }

    y += 22;
  });

  // ── STEPS ────────────────────────────────────────────────
  if (allSteps.length > 0) {
    checkPage(16);
    y += 2;
    doc.setFillColor(...COL.accent);
    doc.rect(ML, y, 2, 5, 'F');
    setFont('bold', 9, COL.accent);
    doc.text('PASSO A PASSO DA SOLUCAO', ML + 5, y + 4);
    y += 10;

    allSteps.forEach((step, i) => {
      // Read status from checkboxes
      const card = document.getElementById(`diag-step-${i}`);
      const solvedCb  = card && card.querySelector('.diag-cb[data-status="solved"]');
      const pendingCb = card && card.querySelector('.diag-cb[data-status="pending"]');
      const isSolved  = solvedCb  && solvedCb.checked;
      const isPending = pendingCb && pendingCb.checked;

      const descLines = doc.splitTextToSize(step.desc || '', W - ML - MR - 14);
      const cardH = 14 + descLines.length * 4.5;
      checkPage(cardH + 4);

      const lc = lvlColor[step.level] || COL.green;

      // Card bg
      doc.setFillColor(...COL.surface);
      doc.setDrawColor(...COL.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, W - ML - MR, cardH, 2, 2, 'FD');

      // Status stripe on left
      if (isSolved)       { doc.setFillColor(...COL.green);  doc.rect(ML, y, 3, cardH, 'F'); }
      else if (isPending) { doc.setFillColor(...COL.yellow); doc.rect(ML, y, 3, cardH, 'F'); }
      else                { doc.setFillColor(...COL.border); doc.rect(ML, y, 3, cardH, 'F'); }

      // Step number circle
      doc.setFillColor(...lc);
      doc.circle(ML + 10, y + 7, 4, 'F');
      setFont('bold', 7, COL.dark);
      doc.text(String(i + 1).padStart(2, '0'), ML + 10, y + 8.2, { align: 'center' });

      // Title
      setFont('bold', 8.5, COL.white);
      doc.text(step.title, ML + 17, y + 6);

      // Difficulty badge
      const badgeW = 22;
      doc.setFillColor(...lc);
      doc.roundedRect(W - MR - badgeW, y + 3, badgeW, 5.5, 1.5, 1.5, 'F');
      setFont('bold', 6, COL.dark);
      doc.text(lvlLabel[step.level] || 'Facil', W - MR - badgeW / 2, y + 6.7, { align: 'center' });

      // Status label
      if (isSolved) {
        setFont('bold', 7, COL.green);
        doc.text('✓ RESOLVIDO', ML + 17, y + 11.5);
      } else if (isPending) {
        setFont('bold', 7, COL.yellow);
        doc.text('⏳ PENDENTE', ML + 17, y + 11.5);
      } else {
        setFont('normal', 7, COL.text2);
        doc.text('Nao verificado', ML + 17, y + 11.5);
      }

      // Description
      setFont('normal', 7, COL.text2);
      descLines.forEach((line, li) => {
        doc.text(line, ML + 6, y + 14 + li * 4.5);
      });

      y += cardH + 3;
    });
  }

  // ── VIRUS SECTION ────────────────────────────────────────
  if (virusMatch && virusMatch.length > 0) {
    const v = virusMatch[0];
    const vname = typeof v.name === 'object' ? v.name[lang] : v.name;
    const defSteps = (v.protection && v.protection.defenseSteps && (v.protection.defenseSteps[lang] || v.protection.defenseSteps['pt'])) || [];
    checkPage(16);
    y += 2;
    doc.setFillColor(...COL.red);
    doc.rect(ML, y, 2, 5, 'F');
    setFont('bold', 9, COL.red);
    doc.text('AMEACA IDENTIFICADA: ' + vname.toUpperCase(), ML + 5, y + 4);
    y += 10;

    defSteps.forEach((s, i) => {
      const lines = doc.splitTextToSize(`${i+1}. ${s}`, W - ML - MR - 8);
      checkPage(lines.length * 4.5 + 4);
      setFont('normal', 7, COL.text);
      lines.forEach(line => { doc.text(line, ML + 4, y); y += 4.5; });
    });

    if (v.protection && v.protection.tools) {
      checkPage(10);
      y += 2;
      setFont('bold', 7, COL.accent);
      doc.text('Ferramentas: ' + v.protection.tools.join(' · '), ML, y);
      y += 7;
    }
  }

  // ── SUMMARY BOX ─────────────────────────────────────────
  checkPage(36);
  y += 4;
  const solvedSteps  = allSteps.filter((_,i) => { const c = document.getElementById(`diag-step-${i}`); return c && c.querySelector('.diag-cb[data-status="solved"]')?.checked; });
  const pendingSteps = allSteps.filter((_,i) => { const c = document.getElementById(`diag-step-${i}`); return c && c.querySelector('.diag-cb[data-status="pending"]')?.checked; });
  const noneSteps    = allSteps.filter((_,i) => { const c = document.getElementById(`diag-step-${i}`); const s = c && c.querySelector('.diag-cb[data-status="solved"]')?.checked; const p = c && c.querySelector('.diag-cb[data-status="pending"]')?.checked; return !s && !p; });

  doc.setFillColor(...COL.surface);
  doc.setDrawColor(...COL.accent);
  doc.setLineWidth(0.4);
  doc.roundedRect(ML, y, W - ML - MR, 32, 2, 2, 'FD');

  setFont('bold', 9, COL.accent);
  doc.text('RESUMO DO ATENDIMENTO', ML + 5, y + 7);

  const cols = [ML + 5, ML + 60, ML + 115];
  // Resolved
  doc.setFillColor(...COL.green);
  doc.circle(cols[0] + 3, y + 16, 3, 'F');
  setFont('bold', 11, COL.green);
  doc.text(String(solvedSteps.length), cols[0] + 10, y + 17.5);
  setFont('normal', 7, COL.text2);
  doc.text('Passos Resolvidos', cols[0] + 10, y + 22);
  // Pending
  doc.setFillColor(...COL.yellow);
  doc.circle(cols[1] + 3, y + 16, 3, 'F');
  setFont('bold', 11, COL.yellow);
  doc.text(String(pendingSteps.length), cols[1] + 10, y + 17.5);
  setFont('normal', 7, COL.text2);
  doc.text('Passos Pendentes', cols[1] + 10, y + 22);
  // Not checked
  doc.setFillColor(...COL.border);
  doc.circle(cols[2] + 3, y + 16, 3, 'F');
  setFont('bold', 11, COL.text2);
  doc.text(String(noneSteps.length), cols[2] + 10, y + 17.5);
  setFont('normal', 7, COL.text2);
  doc.text('Nao verificados', cols[2] + 10, y + 22);

  y += 38;

  // ── FOOTER on every page ──────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...COL.accent);
    doc.rect(0, H - 2, W, 2, 'F');
    setFont('normal', 6, COL.text2);
    doc.text('ARQ_COMP // Relatorio de Diagnostico Tecnico', ML, H - 6);
    doc.text(`Pagina ${p} de ${totalPages}`, W - MR, H - 6, { align: 'right' });
  }

  // Save
  const fname = `diagnostico_${(mainCause ? mainCause.data.name.replace(/\s+/g,'_') : 'relatorio')}_${now.toISOString().slice(0,10)}.pdf`;
  doc.save(fname);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function diagReset() {
  _diagLastResult = null;
  _diagLastProblem = '';
  document.getElementById('diag-problem-input').value = '';
  document.getElementById('diag-char').textContent = '0';
  document.getElementById('diag-result').classList.add('hidden');
  document.getElementById('diag-result-inner').innerHTML = '';
  document.querySelector('.diag-input-wrap').style.opacity = '1';
  document.querySelector('.diag-input-wrap').scrollIntoView({ behavior: 'smooth' });
}

