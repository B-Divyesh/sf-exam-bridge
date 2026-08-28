import './styles.css';
import { confidenceOrder, createPlan, isPlan, parseSyllabus, planToCsv, sequenceTopics, type Confidence, type Plan, type Topic } from './planner';

const STORAGE_KEY = 'exam-bridge:plan:v1';
const THEME_KEY = 'exam-bridge:theme';
const LICENSE_KEY = 'sb_license:exam-bridge';
const LICENSE_CACHE_KEY = 'exam-bridge:license-verdict';
const billingBase = location.hostname === 'exam-bridge.sociobot.in' ? 'https://api.sociobot.in' : 'https://pilot-api.sociobot.in';
const checkoutUrl = `${billingBase}/api/v1/products/exam-bridge/checkout`;

const templates = [
  { name: 'Engineering foundations', note: 'A reusable starter map—not an official syllabus.', topics: ['Engineering mathematics', 'Signals and systems', 'Electric circuits', 'Control systems', 'General aptitude'] },
  { name: 'Computer science foundations', note: 'A reusable starter map—not an official syllabus.', topics: ['Discrete mathematics', 'Programming and data structures', 'Algorithms', 'Computer organization', 'Operating systems', 'Database systems', 'Computer networks'] },
  { name: 'Quantitative foundations', note: 'A reusable starter map—not an official syllabus.', topics: ['Arithmetic and ratios', 'Algebra', 'Geometry', 'Data interpretation', 'Probability', 'Logical reasoning'] },
];

let plan: Plan | null = loadPlan();
let paidUnlocked = cachedLicenseIsValid();
let saveMessage = plan ? 'Plan restored from this device.' : 'Nothing saved yet.';
let licenseNotice = localStorage.getItem(LICENSE_KEY) && !paidUnlocked ? 'A saved license is not currently verified. The free planner remains available.' : '';

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
}

function safeExternalUrl(value: string): string {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function loadPlan(): Plan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPlan(parsed) ? parsed : null;
  } catch { return null; }
}

function savePlan(message = 'Saved on this device.'): void {
  if (!plan) return;
  plan.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    saveMessage = message;
  } catch {
    saveMessage = 'Could not save. Your browser storage may be full; export a backup now.';
  }
}

function cachedLicenseIsValid(): boolean {
  try {
    const cached = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || '{}') as { valid?: boolean };
    return Boolean(localStorage.getItem(LICENSE_KEY) && cached.valid);
  } catch { return false; }
}

function progressStats(): { ready: number; practised: number; total: number } {
  const topics = plan?.topics ?? [];
  return {
    total: topics.length,
    ready: topics.filter(topic => topic.confidence === 'ready').length,
    practised: topics.filter(topic => topic.practice.some(ref => ref.done)).length,
  };
}

function confidenceLabel(value: Confidence): string {
  return ({ new: 'New to me', shaky: 'Shaky', practising: 'Practising', ready: 'Ready' })[value];
}

function appHeader(): string {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="Exam Bridge home"><span class="brand-mark" aria-hidden="true"><i></i></span><span>Exam Bridge</span></a>
    <nav aria-label="Primary"><a href="#how">How it works</a><a href="#templates">Templates</a><button class="icon-button" id="theme-toggle" type="button" aria-label="Switch color theme"><span aria-hidden="true">◐</span></button></nav>
  </header>`;
}

function hero(): string {
  return `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow"><span>01</span> Your syllabus, made navigable</p>
      <h1 id="hero-title">Find the shortest path from <em>topic</em> to practice.</h1>
      <p class="lede">Turn a pasted syllabus into a confidence-aware route. Refresh the right prerequisites, then connect each topic to question IDs and links you already own.</p>
      <div class="hero-actions"><a class="button primary" href="#planner">Build my route</a><span>Private by default · saved only here</span></div>
    </div>
    <figure class="hero-figure"><img src="/assets/learning-topology.webp" width="1200" height="800" alt="Abstract paper map with circular topic nodes connected by a coral route and teal prerequisite paths" fetchpriority="high" decoding="async"><figcaption><span class="circle-key"></span> concept <span class="square-key"></span> practice checkpoint</figcaption></figure>
  </section>`;
}

function setupForm(): string {
  return `<section class="setup" aria-labelledby="setup-title">
    <div class="section-index"><span>1</span><div><p class="eyebrow">Capture</p><h2 id="setup-title">Start with the official outline</h2><p>Paste headings only—one per line. Exam Bridge never uploads this text.</p></div></div>
    <form id="setup-form" novalidate>
      <div class="field-row"><label>Plan name <input id="exam-name" name="examName" autocomplete="off" maxlength="80" placeholder="e.g. GATE ECE 2027"></label><label>Official source URL <span class="optional">Optional</span><input id="source-url" name="sourceUrl" type="url" inputmode="url" placeholder="https://…"></label></div>
      <label>Syllabus topics <span class="field-hint">One topic per line; bullets and numbering are fine.</span><textarea id="syllabus" name="syllabus" rows="9" required aria-describedby="syllabus-error" placeholder="Engineering mathematics&#10;Signals and systems&#10;Electronic devices&#10;Control systems"></textarea></label>
      <p class="form-error" id="syllabus-error" role="alert"></p>
      <div class="form-footer"><span>2–80 topics · duplicates are removed</span><button class="button primary" type="submit">Map my syllabus <span aria-hidden="true">→</span></button></div>
    </form>
  </section>`;
}

function topicCard(topic: Topic, routeIndex: number): string {
  const selected = new Set(topic.prerequisites);
  const customs = topic.prerequisites.filter(item => !topic.suggested.includes(item));
  return `<article class="topic" id="topic-${escapeHtml(topic.id)}" data-topic-id="${escapeHtml(topic.id)}">
    <div class="route-node" aria-hidden="true"><span>${routeIndex + 1}</span></div>
    <div class="topic-body"><div class="topic-head"><div><p class="topic-kicker">Route segment ${routeIndex + 1}</p><h3>${escapeHtml(topic.title)}</h3></div>
      <label class="confidence">Confidence<select data-action="confidence" aria-label="Confidence for ${escapeHtml(topic.title)}">${confidenceOrder.map(level => `<option value="${level}" ${topic.confidence === level ? 'selected' : ''}>${confidenceLabel(level)}</option>`).join('')}</select></label></div>
      <div class="topic-grid"><fieldset><legend>Refresh before this topic</legend>
        ${topic.suggested.length ? `<p class="assist">Suggested from the topic wording. Check only what applies.</p><div class="check-list">${topic.suggested.map(item => `<label><input type="checkbox" data-action="prerequisite" value="${escapeHtml(item)}" ${selected.has(item) ? 'checked' : ''}><span>${escapeHtml(item)}</span></label>`).join('')}</div>` : '<p class="assist">No automatic match. Add the foundation you need below.</p>'}
        ${customs.length ? `<ul class="custom-list">${customs.map(item => `<li>${escapeHtml(item)}<button type="button" data-action="remove-prerequisite" data-value="${escapeHtml(item)}" aria-label="Remove prerequisite ${escapeHtml(item)}">×</button></li>`).join('')}</ul>` : ''}
        <form class="inline-form" data-action="add-prerequisite"><label class="sr-only" for="pre-${topic.id}">Custom prerequisite for ${escapeHtml(topic.title)}</label><input id="pre-${topic.id}" name="prerequisite" maxlength="80" placeholder="Add your own prerequisite"><button type="submit">Add</button></form>
      </fieldset>
      <div class="practice-block"><h4>Practice bridge</h4><p class="assist">Add a question ID, page, or link—never the copyrighted question text.</p>
        ${topic.practice.length ? `<ul class="practice-list">${topic.practice.map(ref => `<li data-ref-id="${escapeHtml(ref.id)}"><label><input type="checkbox" data-action="practice-done" ${ref.done ? 'checked' : ''}><span class="sr-only">Mark ${escapeHtml(ref.label)} complete</span></label><div>${safeExternalUrl(ref.url) ? `<a href="${escapeHtml(safeExternalUrl(ref.url))}" target="_blank" rel="noreferrer">${escapeHtml(ref.label)}</a>` : `<span>${escapeHtml(ref.label)}</span>`}<small>${ref.done ? 'Attempted' : 'Not attempted'}</small></div><button type="button" data-action="remove-practice" aria-label="Remove ${escapeHtml(ref.label)}">×</button></li>`).join('')}</ul>` : '<p class="empty-inline">No practice reference yet.</p>'}
        <form class="practice-form" data-action="add-practice"><label>Question ID or note<input name="label" maxlength="100" required placeholder="e.g. 2023 · Q14"></label><label>Link <span class="optional">Optional</span><input name="url" type="url" inputmode="url" placeholder="https://…"></label><button type="submit">Attach</button><p class="mini-error" role="alert"></p></form>
      </div></div></div>
  </article>`;
}

function workspace(): string {
  if (!plan) return setupForm();
  const ordered = sequenceTopics(plan.topics);
  const stats = progressStats();
  const source = safeExternalUrl(plan.sourceUrl);
  return `<section class="workspace" aria-labelledby="workspace-title">
    <div class="workspace-top"><div><p class="eyebrow"><span>2</span> Assess and connect</p><h2 id="workspace-title">${escapeHtml(plan.examName)}</h2><p>${source ? `<a href="${escapeHtml(source)}" target="_blank" rel="noreferrer">Open attributed syllabus source ↗</a>` : 'Personal outline · no source link added'}</p></div>
      <div class="save-state" role="status" aria-live="polite"><span aria-hidden="true">●</span> ${escapeHtml(saveMessage)}</div></div>
    <section class="route-overview" aria-labelledby="route-title"><div><p class="eyebrow"><span>3</span> Follow the route</p><h2 id="route-title">Your next pass</h2><p>Lowest-confidence topics come first. Reassess after practice and the route reorders itself.</p></div>
      <dl><div><dt>Topics</dt><dd>${stats.total}</dd></div><div><dt>Ready</dt><dd>${stats.ready}</dd></div><div><dt>Practised</dt><dd>${stats.practised}</dd></div></dl></section>
    <div class="toolbar" aria-label="Plan actions"><button type="button" data-global-action="add-topic">Add topic</button><button type="button" data-global-action="export-csv">Export CSV</button><button type="button" data-global-action="export-json">Back up JSON</button><label class="file-button">Restore JSON<input id="import-json" type="file" accept="application/json,.json"></label><button class="danger-link" type="button" data-global-action="reset">Start over</button></div>
    <div class="route-list">${ordered.map(topicCard).join('')}</div>
  </section>`;
}

function templatesSection(): string {
  return `<section class="templates" id="templates" aria-labelledby="templates-title"><div class="section-index"><span>+</span><div><p class="eyebrow">Reusable starting points</p><h2 id="templates-title">Begin from a foundation map</h2><p>The free planner and all exports stay unlimited. A one-time ₹499 unlock adds reusable, editable starter templates for permitted exam domains.</p></div></div>
    <div class="template-list">${templates.map((template, index) => `<article><div><span class="template-shape" aria-hidden="true"></span><h3>${template.name}</h3><p>${template.note}</p><small>${template.topics.length} editable topics</small></div><button type="button" data-template="${index}" ${paidUnlocked ? '' : 'aria-describedby="paid-note"'}>${paidUnlocked ? 'Use template' : 'Preview locked'}</button></article>`).join('')}</div>
    <div class="license-panel"><div><p class="eyebrow">Exam Bridge Plus</p><h3>${paidUnlocked ? 'Templates unlocked on this device' : 'One purchase, reusable templates'}</h3><p id="paid-note">${paidUnlocked ? 'Your free tools and unlocked templates work without an account.' : 'One-time ₹499 purchase. Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license.'}</p>${licenseNotice ? `<p class="license-notice">${escapeHtml(licenseNotice)} <a href="${checkoutUrl}">Buy a new license</a>.</p>` : ''}</div>
    ${paidUnlocked ? '<button class="button secondary" id="recheck-license" type="button">Recheck license</button>' : `<div class="license-actions"><a class="button primary" href="${checkoutUrl}">Buy template unlock</a><form id="license-form"><label for="license-token">Have a license?</label><div><input id="license-token" name="license" autocomplete="off" required placeholder="Paste license token"><button type="submit">Verify</button></div><p id="license-status" role="status" aria-live="polite"></p></form></div>`}</div>
  </section>`;
}

function render(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `${appHeader()}<div id="offline-banner" class="offline-banner" role="status" hidden>You’re offline. Planning and exports still work; license checks will resume when connected.</div><main id="main" tabindex="-1">${hero()}<section id="how" class="how"><p><b>Paste the outline.</b> Rate what you know. Attach only references you’re allowed to use. Your study map stays in this browser.</p></section><div id="planner">${workspace()}</div>${templatesSection()}<section class="principles" aria-labelledby="principles-title"><p class="eyebrow">Built for honest preparation</p><h2 id="principles-title">A map, not a promise.</h2><div><p><b>Your material stays yours.</b><br>Exam Bridge stores plans locally and does not host exam questions or coaching notes.</p><p><b>You remain the judge.</b><br>Prerequisite suggestions are starting points, not a substitute for an official syllabus.</p><p><b>No affiliation implied.</b><br>Exam Bridge is an independent planning tool, not endorsed by any exam authority.</p></div></section></main><footer><div class="brand"><span class="brand-mark" aria-hidden="true"><i></i></span><span>Exam Bridge</span></div><p>Original generated illustration · no tracking · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p></footer><div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  updateNetworkStatus();
  bindEvents();
}

function announce(message: string): void {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function rerenderPlanner(message?: string): void {
  if (message) savePlan(message);
  document.querySelector<HTMLDivElement>('#planner')!.innerHTML = workspace();
  bindPlannerEvents();
}

function findTopic(element: Element): Topic | undefined {
  const id = element.closest<HTMLElement>('[data-topic-id]')?.dataset.topicId;
  return plan?.topics.find(topic => topic.id === id);
}

function bindPlannerEvents(): void {
  document.querySelector('#setup-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const topics = parseSyllabus(String(data.get('syllabus') ?? ''));
    const error = document.querySelector<HTMLParagraphElement>('#syllabus-error')!;
    if (topics.length < 2) {
      error.textContent = 'Add at least two distinct topic lines so there is a route to build.';
      document.querySelector<HTMLTextAreaElement>('#syllabus')?.focus();
      return;
    }
    const sourceUrl = String(data.get('sourceUrl') ?? '');
    if (sourceUrl && !safeExternalUrl(sourceUrl)) {
      error.textContent = 'Use a complete http:// or https:// URL for the syllabus source.';
      document.querySelector<HTMLInputElement>('#source-url')?.focus();
      return;
    }
    plan = createPlan(String(data.get('examName') ?? ''), sourceUrl, topics);
    savePlan(`Saved ${topics.length} topics on this device.`);
    rerenderPlanner();
    document.querySelector('#workspace-title')?.scrollIntoView({ behavior: 'smooth' });
    announce('Your study route is ready.');
  });

  document.querySelectorAll<HTMLElement>('[data-topic-id]').forEach(card => {
    card.addEventListener('change', event => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const topic = findTopic(target);
      if (!topic) return;
      if (target.dataset.action === 'confidence') {
        topic.confidence = target.value as Confidence;
        rerenderPlanner(`Confidence updated to ${confidenceLabel(topic.confidence)}.`);
        document.querySelector<HTMLSelectElement>(`#topic-${CSS.escape(topic.id)} select`)?.focus();
      } else if (target.dataset.action === 'prerequisite') {
        const input = target as HTMLInputElement;
        topic.prerequisites = input.checked ? [...new Set([...topic.prerequisites, input.value])] : topic.prerequisites.filter(item => item !== input.value);
        savePlan('Prerequisite checklist saved.');
        const status = document.querySelector('.save-state'); if (status) status.innerHTML = `<span aria-hidden="true">●</span> ${escapeHtml(saveMessage)}`;
      } else if (target.dataset.action === 'practice-done') {
        const input = target as HTMLInputElement;
        const refId = target.closest<HTMLElement>('[data-ref-id]')?.dataset.refId;
        const ref = topic.practice.find(item => item.id === refId);
        if (ref) ref.done = input.checked;
        rerenderPlanner('Practice progress saved.');
      }
    });
    card.addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const topic = findTopic(form); if (!topic) return;
      const data = new FormData(form);
      if (form.dataset.action === 'add-prerequisite') {
        const value = String(data.get('prerequisite') ?? '').trim();
        if (value && !topic.prerequisites.some(item => item.toLowerCase() === value.toLowerCase())) topic.prerequisites.push(value);
        rerenderPlanner('Custom prerequisite added.');
      } else if (form.dataset.action === 'add-practice') {
        const label = String(data.get('label') ?? '').trim();
        const url = String(data.get('url') ?? '').trim();
        const error = form.querySelector<HTMLParagraphElement>('.mini-error')!;
        if (!label) { error.textContent = 'Add a question ID or short note.'; return; }
        if (url && !safeExternalUrl(url)) { error.textContent = 'Use a complete http:// or https:// link.'; return; }
        topic.practice.push({ id: `${Date.now().toString(36)}-${topic.practice.length}`, label, url, done: false });
        rerenderPlanner('Practice reference attached.');
      }
    });
    card.addEventListener('click', event => {
      const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');
      if (!button) return;
      const topic = findTopic(button); if (!topic) return;
      if (button.dataset.action === 'remove-prerequisite') {
        topic.prerequisites = topic.prerequisites.filter(item => item !== button.dataset.value);
        rerenderPlanner('Prerequisite removed.');
      } else if (button.dataset.action === 'remove-practice') {
        const refId = button.closest<HTMLElement>('[data-ref-id]')?.dataset.refId;
        topic.practice = topic.practice.filter(item => item.id !== refId);
        rerenderPlanner('Practice reference removed.');
      }
    });
  });

  document.querySelector('.toolbar')?.addEventListener('click', event => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-global-action]')?.dataset.globalAction;
    if (!action || !plan) return;
    if (action === 'add-topic') {
      const title = window.prompt('Topic name');
      if (!title?.trim()) return;
      const addition = createPlan(plan.examName, plan.sourceUrl, [title.trim()]).topics[0];
      plan.topics.push(addition); rerenderPlanner('Topic added.');
    } else if (action === 'export-csv') download(`${slug(plan.examName)}-route.csv`, planToCsv(plan), 'text/csv;charset=utf-8');
    else if (action === 'export-json') download(`${slug(plan.examName)}-backup.json`, JSON.stringify(plan, null, 2), 'application/json');
    else if (action === 'reset' && window.confirm(`Delete the local plan “${plan.examName}”? Export a backup first if you need it.`)) {
      localStorage.removeItem(STORAGE_KEY); plan = null; saveMessage = 'Nothing saved yet.'; rerenderPlanner(); announce('Local plan deleted.');
    }
  });

  document.querySelector<HTMLInputElement>('#import-json')?.addEventListener('change', async event => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0]; if (!file) return;
    try {
      const imported: unknown = JSON.parse(await file.text());
      if (!isPlan(imported)) throw new Error('invalid');
      plan = imported; rerenderPlanner('Backup restored on this device.'); announce('Backup restored.');
    } catch { announce('That file is not a valid Exam Bridge backup.'); }
  });
}

function bindEvents(): void {
  bindPlannerEvents();
  document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelectorAll<HTMLButtonElement>('[data-template]').forEach(button => button.addEventListener('click', () => {
    const template = templates[Number(button.dataset.template)];
    if (!paidUnlocked) { document.querySelector('#license-token')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); announce('Unlock Plus or restore a license to use this template.'); return; }
    if (plan && !window.confirm('Replace your current plan? Export a backup first if you need it.')) return;
    plan = createPlan(template.name, '', template.topics); savePlan('Template saved as a new local plan.'); rerenderPlanner(); document.querySelector('#workspace-title')?.scrollIntoView({ behavior: 'smooth' });
  }));
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const token = String(new FormData(event.currentTarget as HTMLFormElement).get('license') ?? '').trim();
    if (token) void verifyLicense(token, true);
  });
  document.querySelector('#recheck-license')?.addEventListener('click', () => {
    const token = localStorage.getItem(LICENSE_KEY); if (token) void verifyLicense(token, true);
  });
}

function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'exam-bridge'; }
function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); announce(`${name} downloaded.`);
}

function toggleTheme(): void {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next; localStorage.setItem(THEME_KEY, next);
  document.querySelector('#theme-toggle')?.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
}

function updateNetworkStatus(): void {
  const banner = document.querySelector<HTMLElement>('#offline-banner'); if (banner) banner.hidden = navigator.onLine;
}

async function verifyLicense(token: string, userInitiated = false): Promise<void> {
  const status = document.querySelector<HTMLElement>('#license-status');
  if (status) status.textContent = 'Checking license…';
  try {
    const response = await fetch(`${billingBase}/api/v1/products/exam-bridge/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('service');
    const result = await response.json() as { valid: boolean; reason?: string; expires_at?: string };
    localStorage.setItem(LICENSE_KEY, token);
    localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now(), expiresAt: result.expires_at }));
    paidUnlocked = result.valid;
    licenseNotice = result.valid ? '' : 'License no longer active.';
    render(); announce(result.valid ? 'Plus templates unlocked.' : 'License no longer active.');
  } catch {
    if (status) status.textContent = 'Could not reach license verification. Your free planner still works; try again when online.';
    if (userInitiated) announce('License check could not connect.');
  }
}

function initializeLicense(): void {
  const query = new URLSearchParams(location.search);
  const returned = query.get('license');
  if (returned) {
    localStorage.setItem(LICENSE_KEY, returned);
    query.delete('license');
    history.replaceState({}, '', `${location.pathname}${query.size ? `?${query}` : ''}${location.hash}`);
    void verifyLicense(returned);
    return;
  }
  const token = localStorage.getItem(LICENSE_KEY); if (!token) return;
  try {
    const cached = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || '{}') as { checkedAt?: number };
    if (!cached.checkedAt || Date.now() - cached.checkedAt > 86_400_000) void verifyLicense(token);
  } catch { void verifyLicense(token); }
}

const storedTheme = localStorage.getItem(THEME_KEY);
if (storedTheme === 'dark' || storedTheme === 'light') document.documentElement.dataset.theme = storedTheme;
render();
initializeLicense();
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
