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
    const res = await fetch('database/data.json');
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
  if(name === 'virus') initVirus();
  if(name === 'protection') initProtectionView();
  if(name === 'relations') initRelations();
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
    if(!e.target.closest('.leaf') && !e.target.closest('.cat-node') && !e.target.closest('.root-node')){
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
