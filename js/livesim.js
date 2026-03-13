// ============================================================
//  CACHE SIMULATOR
// ============================================================
let csimHits = 0, csimMisses = 0;
const csimL1 = [], csimL2 = [], csimL3 = [];
const csimL1Max = 8, csimL2Max = 12, csimL3Max = 16;
let csimForceMissNext = false;

const csimAddresses = [
  '0x0041A3','0x00FF12','0x0200CC','0x0041A3','0x00FF12','0x0041A3',
  '0x03B7D1','0x0041A3','0x0501AA','0x0041A3','0x00FF12','0x06CC10',
  '0x03B7D1','0x0041A3','0x07EE90','0x08D450','0x0041A3','0x00FF12',
  '0x09B120','0x0041A3','0x0200CC','0x03B7D1','0x0A44F0','0x00FF12',
];
let csimAddrIdx = 0;

function initCacheView() {
  csimHits = 0; csimMisses = 0; csimAddrIdx = 0;
  csimL1.length = 0; csimL2.length = 0; csimL3.length = 0;
  csimForceMissNext = false;
  renderCacheLines();
  updateCacheStats();
  const log = document.getElementById('csim-log');
  if(log) log.innerHTML = '<div class="csim-log-entry csim-info">// simulador pronto — clique em "Simular Busca de Dado"</div>';
}

function renderCacheLines() {
  const render = (id, arr, max) => {
    const el = document.getElementById(id);
    if(!el) return;
    let html = '';
    for(let i = 0; i < max; i++) {
      if(arr[i]) {
        html += `<div class="csim-line csim-line-full" id="cline-${id}-${i}" title="${arr[i]}">${arr[i]}</div>`;
      } else {
        html += `<div class="csim-line csim-line-empty">—</div>`;
      }
    }
    el.innerHTML = html;
  };
  render('csim-l1-lines', csimL1, csimL1Max);
  render('csim-l2-lines', csimL2, csimL2Max);
  render('csim-l3-lines', csimL3, csimL3Max);

  // RAM blocks
  const ram = document.getElementById('csim-ram-blocks');
  if(ram) {
    let rhtml = '';
    for(let i = 0; i < 32; i++) rhtml += `<div class="csim-ram-block" id="cramb-${i}"></div>`;
    ram.innerHTML = rhtml;
  }
}

function updateCacheStats() {
  document.getElementById('csim-hits').textContent = csimHits;
  document.getElementById('csim-misses').textContent = csimMisses;
  const total = csimHits + csimMisses;
  document.getElementById('csim-rate').textContent = total > 0 ? Math.round((csimHits/total)*100)+'%' : '—';
}

function csimLog(msg, type='info') {
  const log = document.getElementById('csim-log');
  if(!log) return;
  const div = document.createElement('div');
  div.className = 'csim-log-entry csim-' + type;
  div.textContent = '> ' + msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function highlightComp(id, cls) {
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 800);
}

function highlightLine(lineId) {
  const el = document.getElementById(lineId);
  if(!el) return;
  el.classList.add('csim-line-hit');
  setTimeout(() => el.classList.remove('csim-line-hit'), 1200);
}

async function cacheSimStep() {
  const addr = csimAddresses[csimAddrIdx % csimAddresses.length];
  csimAddrIdx++;

  const reqEl = document.getElementById('csim-req');
  if(reqEl) reqEl.textContent = 'req: ' + addr;
  highlightComp('csim-cpu','csim-active');

  csimLog(`CPU solicita endereço ${addr}`, 'info');

  await delay(300);

  if(!csimForceMissNext && csimL1.includes(addr)) {
    // L1 HIT
    csimHits++;
    const idx = csimL1.indexOf(addr);
    highlightComp('csim-l1','csim-hit');
    highlightLine(`cline-csim-l1-lines-${idx}`);
    csimLog(`✅ L1 HIT — dados encontrados em ${addr} (latência ~1ns)`, 'hit');
  } else if(!csimForceMissNext && csimL2.includes(addr)) {
    // L2 HIT
    csimMisses++;
    highlightComp('csim-l1','csim-miss');
    await delay(300);
    highlightComp('csim-l2','csim-hit');
    const idx = csimL2.indexOf(addr);
    highlightLine(`cline-csim-l2-lines-${idx}`);
    csimLog(`⚠ L1 MISS → L2 HIT — dados em ${addr} (latência ~4ns)`, 'miss');
    // Promote to L1
    promoteToCache(csimL1, addr, csimL1Max);
    renderCacheLines();
    csimLog(`📥 ${addr} promovido para L1`, 'info');
    csimHits++;
  } else if(!csimForceMissNext && csimL3.includes(addr)) {
    // L3 HIT
    csimMisses++;
    highlightComp('csim-l1','csim-miss');
    await delay(200);
    highlightComp('csim-l2','csim-miss');
    await delay(200);
    highlightComp('csim-l3','csim-hit');
    const idx = csimL3.indexOf(addr);
    highlightLine(`cline-csim-l3-lines-${idx}`);
    csimLog(`⚠ L1/L2 MISS → L3 HIT — dados em ${addr} (latência ~20ns)`, 'miss');
    promoteToCache(csimL2, addr, csimL2Max);
    promoteToCache(csimL1, addr, csimL1Max);
    renderCacheLines();
    csimLog(`📥 ${addr} carregado em L2 e L1`, 'info');
    csimHits++;
  } else {
    // FULL MISS — vai para RAM
    csimMisses++;
    csimForceMissNext = false;
    highlightComp('csim-l1','csim-miss');
    await delay(200);
    highlightComp('csim-l2','csim-miss');
    await delay(200);
    highlightComp('csim-l3','csim-miss');
    await delay(300);
    // Flash RAM block
    const rIdx = Math.floor(Math.random()*32);
    const rb = document.getElementById(`cramb-${rIdx}`);
    if(rb){ rb.classList.add('cramb-hit'); setTimeout(()=>rb.classList.remove('cramb-hit'),1000); }
    highlightComp('csim-ram','csim-ram-active');
    csimLog(`❌ CACHE MISS TOTAL → RAM — buscando ${addr} (latência ~100ns!)`, 'error');
    await delay(600);
    promoteToCache(csimL3, addr, csimL3Max);
    promoteToCache(csimL2, addr, csimL2Max);
    promoteToCache(csimL1, addr, csimL1Max);
    renderCacheLines();
    csimLog(`📥 ${addr} carregado em L3, L2 e L1 (cache populada)`, 'info');
  }

  updateCacheStats();
}

function promoteToCache(arr, addr, max) {
  if(!arr.includes(addr)) {
    arr.unshift(addr);
    if(arr.length > max) arr.pop();
  }
}

function cacheSimForceMiss() {
  csimForceMissNext = true;
  csimLog('💥 Forçando cache miss no próximo acesso...', 'warn');
  cacheSimStep();
}

function cacheSimReset() {
  initCacheView();
  renderCacheLines();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
//  LIVE SIMULATOR
// ============================================================
let lsimRunning = false;
let lsimInterval = null;
let lsimSpeed = 1000;
let lsimFailedComps = {};
let lsimTick = 0;

const LSIM_CONNECTIONS = [
  { from:'lsim-cpu', to:'lsim-cache', color:'#ff6b35', label:'data bus' },
  { from:'lsim-cpu', to:'lsim-mobo', color:'#00d4ff', label:'FSB/IMC' },
  { from:'lsim-cache', to:'lsim-ram', color:'#22c55e', label:'mem ctrl' },
  { from:'lsim-mobo', to:'lsim-ram', color:'#22c55e', label:'DDR channel' },
  { from:'lsim-mobo', to:'lsim-gpu', color:'#a855f7', label:'PCIe x16' },
  { from:'lsim-mobo', to:'lsim-storage', color:'#f59e0b', label:'NVMe/SATA' },
  { from:'lsim-mobo', to:'lsim-nic', color:'#06b6d4', label:'PCIe x1' },
  { from:'lsim-psu', to:'lsim-mobo', color:'#fbbf24', label:'ATX power' },
  { from:'lsim-psu', to:'lsim-gpu', color:'#fbbf24', label:'PCIe power' },
  { from:'lsim-cpu', to:'lsim-ram', color:'#22c55e', label:'direct' },
];

const LSIM_FAIL_DATA = {
  cpu: {
    name: 'CPU', icon: '⚙️',
    impacts: [
      { target:'cache', desc:'Cache L1/L2 inacessível — integrada à CPU' },
      { target:'ram', desc:'RAM não pode ser acessada — controller na CPU' },
      { target:'gpu', desc:'GPU sem instruções para processar' },
      { target:'storage', desc:'Dados do disco não podem ser processados' },
    ],
    consequence: '💀 SISTEMA PARA COMPLETAMENTE. Sem CPU não há processamento — nenhum componente consegue executar tarefas. O computador se torna um tijolo.'
  },
  cache: {
    name: 'Cache', icon: '⚡',
    impacts: [
      { target:'cpu', desc:'CPU precisa buscar tudo direto na RAM (+100× latência)' },
      { target:'ram', desc:'RAM sobrecarregada com 100% das requisições' },
    ],
    consequence: '🐢 DESEMPENHO CAIR DRASTICAMENTE. O sistema continua funcionando, mas fica até 200× mais lento. Programas travam, UI congela, operações simples demoram segundos.'
  },
  ram: {
    name: 'RAM', icon: '💾',
    impacts: [
      { target:'cpu', desc:'CPU sem memória de trabalho — processos falham' },
      { target:'storage', desc:'Swap no disco sobrecarregado (1000× mais lento)' },
      { target:'gpu', desc:'VRAM não pode ser complementada pela RAM' },
    ],
    consequence: '🔵 TELA AZUL (BSOD) ou Kernel Panic. O sistema operacional não consegue alocar memória — processos críticos falham e o OS entra em pânico.'
  },
  mobo: {
    name: 'Placa-Mãe', icon: '🟫',
    impacts: [
      { target:'cpu', desc:'CPU perde comunicação com periféricos' },
      { target:'ram', desc:'Canais DDR desconectados' },
      { target:'gpu', desc:'PCIe desativado — GPU inoperante' },
      { target:'storage', desc:'NVMe/SATA offline — disco inacessível' },
      { target:'nic', desc:'Rede completamente offline' },
    ],
    consequence: '💀 FALHA CATASTRÓFICA. A placa-mãe é o barramento central — sem ela, nenhum componente se comunica. O sistema não liga nem faz POST.'
  },
  gpu: {
    name: 'GPU', icon: '🎮',
    impacts: [
      { target:'mobo', desc:'Sinal de erro no slot PCIe x16' },
    ],
    consequence: '🖥️ SEM SAÍDA DE VÍDEO. O sistema continua funcionando (pode usar gráfico integrado se disponível), mas sem GPU dedicada não há aceleração 3D, jogos ou workloads gráficos.'
  },
  storage: {
    name: 'Armazenamento', icon: '💿',
    impacts: [
      { target:'cpu', desc:'I/O travado — processos aguardam disco' },
      { target:'ram', desc:'Swap indisponível — RAM esgotada mais rápido' },
    ],
    consequence: '🔇 SISTEMA NÃO CARREGA. Sem o disco onde o OS está instalado, o computador não faz boot. Dados inacessíveis. Se for o disco de swap, o sistema crashea sob carga.'
  },
  psu: {
    name: 'Fonte (PSU)', icon: '🔌',
    impacts: [
      { target:'cpu', desc:'CPU sem energia — desliga imediatamente' },
      { target:'mobo', desc:'Placa-mãe sem energia — tudo offline' },
      { target:'ram', desc:'RAM perde dados voláteis instantaneamente' },
      { target:'gpu', desc:'GPU desligada imediatamente' },
      { target:'storage', desc:'Disco pode sofrer danos por desligamento abrupto' },
    ],
    consequence: '🔴 DESLIGAMENTO IMEDIATO E ABRUPTO. Sem energia nada funciona. Risco de corrupção de dados no disco por escrita incompleta. É a falha mais abrangente possível.'
  },
  nic: {
    name: 'Placa de Rede', icon: '📡',
    impacts: [
      { target:'mobo', desc:'Interface de rede offline no chipset' },
    ],
    consequence: '📶 SEM CONECTIVIDADE. O sistema funciona normalmente em todos os outros aspectos, mas sem acesso a internet, rede local ou transferência de dados em rede.'
  },
};

const LSIM_MESSAGES = [
  { from:'cpu', to:'cache', msg:'CPU → Cache L1: busca instrução 0x%ADDR%', type:'info' },
  { from:'cache', to:'cpu', msg:'Cache L1 → CPU: dado entregue em 1ns ✅', type:'success' },
  { from:'cpu', to:'ram', msg:'CPU → RAM: requisição de dados (cache miss)', type:'warn' },
  { from:'ram', to:'cpu', msg:'RAM → CPU: dados entregues (+100ns)', type:'info' },
  { from:'cpu', to:'mobo', msg:'CPU → Chipset: sinal de I/O request', type:'info' },
  { from:'mobo', to:'storage', msg:'Chipset → NVMe: leitura de bloco 0x%ADDR%', type:'info' },
  { from:'storage', to:'mobo', msg:'NVMe → Chipset: dados @ 3.5GB/s ✅', type:'success' },
  { from:'mobo', to:'gpu', msg:'PCIe x16: frame data → GPU VRAM', type:'info' },
  { from:'gpu', to:'mobo', msg:'GPU → PCIe: frame renderizado ✅', type:'success' },
  { from:'psu', to:'mobo', msg:'PSU → Mobo: +12V @ 8.2A estável ✅', type:'success' },
  { from:'mobo', to:'nic', msg:'Chipset → NIC: pacote TCP enviado', type:'info' },
  { from:'nic', to:'mobo', msg:'NIC → Chipset: ACK recebido ✅', type:'success' },
  { from:'cpu', to:'cache', msg:'CPU → Cache L2: prefetch 0x%ADDR%', type:'info' },
  { from:'cache', to:'ram', msg:'Cache L3 miss → RAM: buscando página', type:'warn' },
  { from:'ram', to:'cache', msg:'RAM → Cache L3: página carregada', type:'info' },
];

function initLiveSim() {
  lsimFailedComps = {};
  lsimRunning = false;
  lsimTick = 0;
  // Reset all component states
  Object.keys(LSIM_FAIL_DATA).forEach(id => {
    const el = document.getElementById('lsim-' + id);
    if(el) { el.className = el.className.replace(/lsim-comp-fail|lsim-comp-warn|lsim-comp-affected/g,'').trim(); }
    const dot = document.getElementById('ldot-' + id);
    if(dot) { dot.className = 'lsim-status-dot'; }
  });
  const btn = document.getElementById('lsim-start-btn');
  if(btn) btn.textContent = '▶ Iniciar';
  drawConnections();
  document.getElementById('lsim-log-entries').innerHTML = '<div class="lsim-log-line lsim-log-info">// aguardando início da simulação...</div>';
  document.getElementById('lsim-fail-desc').textContent = 'Clique em qualquer componente no diagrama para simular sua falha e ver o impacto em cascata no sistema.';
}

function drawConnections() {
  const svg = document.getElementById('lsim-svg');
  if(!svg) return;
  svg.innerHTML = '';
  const canvas = document.getElementById('livesim-canvas');
  if(!canvas) return;
  const cr = canvas.getBoundingClientRect();

  LSIM_CONNECTIONS.forEach((conn, i) => {
    const fromEl = document.getElementById(conn.from);
    const toEl = document.getElementById(conn.to);
    if(!fromEl || !toEl) return;
    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();

    const x1 = fr.left - cr.left + fr.width/2;
    const y1 = fr.top - cr.top + fr.height/2;
    const x2 = tr.left - cr.left + tr.width/2;
    const y2 = tr.top - cr.top + tr.height/2;

    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', conn.color + '55');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-dasharray', '4 3');
    line.id = 'lconn-' + i;
    svg.appendChild(line);

    // Label
    const mx = (x1+x2)/2, my = (y1+y2)/2;
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', mx); text.setAttribute('y', my - 4);
    text.setAttribute('fill', conn.color + '88');
    text.setAttribute('font-size', '8');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Share Tech Mono, monospace');
    text.textContent = conn.label;
    svg.appendChild(text);
  });
}

function livesimToggle() {
  if(lsimRunning) {
    lsimRunning = false;
    clearInterval(lsimInterval);
    document.getElementById('lsim-start-btn').textContent = '▶ Iniciar';
  } else {
    lsimRunning = true;
    document.getElementById('lsim-start-btn').textContent = '⏸ Pausar';
    lsimInterval = setInterval(livesimTick, lsimSpeed);
    livesimTick();
  }
}

function livesimSetSpeed(val) {
  lsimSpeed = parseInt(val);
  if(lsimRunning) {
    clearInterval(lsimInterval);
    lsimInterval = setInterval(livesimTick, lsimSpeed);
  }
}

function livesimTick() {
  lsimTick++;
  // Update metrics
  updateLsimMetrics();

  // Pick a random message for active components
  const available = LSIM_MESSAGES.filter(m => !lsimFailedComps[m.from] && !lsimFailedComps[m.to]);
  if(available.length === 0) return;
  const msg = available[Math.floor(Math.random()*available.length)];
  const addr = '0x' + Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase().padStart(4,'0');
  const txt = msg.msg.replace('%ADDR%', addr);

  // Animate packet on connection
  const conn = LSIM_CONNECTIONS.find(c =>
    c.from === 'lsim-'+msg.from && c.to === 'lsim-'+msg.to ||
    c.from === 'lsim-'+msg.to && c.to === 'lsim-'+msg.from
  );
  if(conn) animatePacket(conn, msg.type);

  // Flash components
  flashComp('lsim-'+msg.from, msg.type);
  setTimeout(() => flashComp('lsim-'+msg.to, msg.type), 200);

  // Log
  addLsimLog(txt, msg.type);
}

function updateLsimMetrics() {
  const metrics = {
    cpu: `Uso: ${rand(20,85)}%`,
    cache: `Hit: ${rand(88,98)}%`,
    ram: `Uso: ${rand(35,65)}%`,
    mobo: `PCIe · DMI`,
    gpu: `Uso: ${rand(40,95)}%`,
    storage: `Leitura: ${(rand(20,40)/10).toFixed(1)} GB/s`,
    psu: `Carga: ${rand(40,75)}%`,
    nic: `↑↓ ${rand(100,900)} Mbps`,
  };
  Object.entries(metrics).forEach(([id, val]) => {
    if(lsimFailedComps[id]) return;
    const el = document.getElementById('lmet-' + id);
    if(el) el.textContent = val;
  });
}

function rand(min, max) { return Math.floor(Math.random()*(max-min+1)+min); }

function flashComp(id, type) {
  const el = document.getElementById(id);
  if(!el || lsimFailedComps[id.replace('lsim-','')]) return;
  const cls = type === 'success' ? 'lsim-flash-success' : type === 'warn' ? 'lsim-flash-warn' : 'lsim-flash-info';
  el.classList.add(cls);
  setTimeout(()=>el.classList.remove(cls), 400);
}

function animatePacket(conn, type) {
  const canvas = document.getElementById('livesim-canvas');
  const svg = document.getElementById('lsim-svg');
  if(!canvas || !svg) return;
  const cr = canvas.getBoundingClientRect();
  const fromEl = document.getElementById(conn.from);
  const toEl = document.getElementById(conn.to);
  if(!fromEl || !toEl) return;
  const fr = fromEl.getBoundingClientRect();
  const tr = toEl.getBoundingClientRect();

  const pkt = document.createElement('div');
  pkt.className = 'lsim-packet lsim-pkt-' + (type === 'success' ? 'ok' : type === 'warn' ? 'warn' : 'info');
  pkt.style.left = (fr.left - cr.left + fr.width/2 - 4) + 'px';
  pkt.style.top = (fr.top - cr.top + fr.height/2 - 4) + 'px';

  const container = document.getElementById('lsim-packets');
  if(!container) return;
  container.appendChild(pkt);

  const dx = (tr.left - cr.left + tr.width/2) - (fr.left - cr.left + fr.width/2);
  const dy = (tr.top - cr.top + tr.height/2) - (fr.top - cr.top + fr.height/2);

  pkt.animate([
    { transform: 'translate(0,0) scale(1)', opacity:1 },
    { transform: `translate(${dx}px,${dy}px) scale(0.5)`, opacity:0 }
  ], { duration: 1400, easing:'ease-in' }).onfinish = () => pkt.remove();
}

function addLsimLog(msg, type='info') {
  const log = document.getElementById('lsim-log-entries');
  if(!log) return;
  const div = document.createElement('div');
  div.className = 'lsim-log-line lsim-log-' + type;
  const ts = new Date().toLocaleTimeString('pt-BR', {hour12:false});
  div.textContent = `[${ts}] ${msg}`;
  log.appendChild(div);
  // Keep max 80 entries
  while(log.children.length > 80) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}

function livesimFailComp(id) {
  if(lsimFailedComps[id]) return; // already failed
  lsimFailedComps[id] = true;

  const el = document.getElementById('lsim-' + id);
  const dot = document.getElementById('ldot-' + id);
  const met = document.getElementById('lmet-' + id);
  if(el) el.classList.add('lsim-comp-fail');
  if(dot) dot.classList.add('lsim-dot-fail');
  if(met) { met.textContent = '⚠ FALHA'; met.style.color='#ef4444'; }

  const data = LSIM_FAIL_DATA[id];
  if(!data) return;

  // Flash alert
  const alertEl = document.createElement('div');
  alertEl.className = 'lsim-alert';
  alertEl.innerHTML = `<strong>${data.icon} FALHA: ${data.name}</strong><br>${data.consequence}`;
  document.getElementById('livesim-canvas').appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 5000);

  addLsimLog(`⚠⚠ FALHA DETECTADA: ${data.name} — componente offline`, 'error');

  // Cascade effects with delays
  data.impacts.forEach((imp, i) => {
    setTimeout(() => {
      if(!lsimFailedComps[imp.target]) {
        const tEl = document.getElementById('lsim-' + imp.target);
        const tDot = document.getElementById('ldot-' + imp.target);
        if(tEl) tEl.classList.add('lsim-comp-affected');
        if(tDot) tDot.classList.add('lsim-dot-warn');
        addLsimLog(`↳ Impacto cascata → ${imp.target.toUpperCase()}: ${imp.desc}`, 'warn');
      }
    }, (i+1) * 600);
  });

  // Update fail panel
  const failDesc = document.getElementById('lsim-fail-desc');
  if(failDesc) {
    let html = `<div class="lsim-fail-comp-header">${data.icon} <strong>${data.name}</strong> falhou</div>`;
    html += `<div class="lsim-fail-consequence">${data.consequence}</div>`;
    html += `<div class="lsim-fail-impacts-title">Impactos em cascata:</div>`;
    data.impacts.forEach(imp => {
      html += `<div class="lsim-fail-impact-item">⚡ <strong>${imp.target.toUpperCase()}</strong>: ${imp.desc}</div>`;
    });
    failDesc.innerHTML = html;
  }

  // Grey out connections involving this component
  setTimeout(() => dimConnections(id), 200);
}

function dimConnections(id) {
  const svg = document.getElementById('lsim-svg');
  if(!svg) return;
  LSIM_CONNECTIONS.forEach((conn, i) => {
    if(conn.from === 'lsim-'+id || conn.to === 'lsim-'+id) {
      const line = document.getElementById('lconn-'+i);
      if(line) { line.setAttribute('stroke','#ef444433'); line.setAttribute('stroke-dasharray','2 6'); }
    }
  });
}

function livesimReset() {
  clearInterval(lsimInterval);
  lsimRunning = false;
  lsimFailedComps = {};
  lsimTick = 0;
  // Remove all state classes
  Object.keys(LSIM_FAIL_DATA).forEach(id => {
    const el = document.getElementById('lsim-' + id);
    if(el) el.classList.remove('lsim-comp-fail','lsim-comp-warn','lsim-comp-affected');
    const dot = document.getElementById('ldot-' + id);
    if(dot) dot.className = 'lsim-status-dot';
    const met = document.getElementById('lmet-' + id);
    if(met) met.style.color = '';
  });
  const btn = document.getElementById('lsim-start-btn');
  if(btn) btn.textContent = '▶ Iniciar';
  document.getElementById('lsim-log-entries').innerHTML = '<div class="lsim-log-line lsim-log-info">// sistema resetado — pronto para simulação</div>';
  document.getElementById('lsim-fail-desc').textContent = 'Clique em qualquer componente no diagrama para simular sua falha e ver o impacto em cascata no sistema.';
  // Remove packets
  const pkts = document.getElementById('lsim-packets');
  if(pkts) pkts.innerHTML = '';
  // Redraw connections
  setTimeout(drawConnections, 100);
}

// Redraw connections on resize
window.addEventListener('resize', () => {
  if(document.getElementById('view-livesim').classList.contains('active')) {
    drawConnections();
  }
});
