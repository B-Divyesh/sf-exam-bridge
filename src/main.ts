import './styles.css';
import { confidenceOrder, createPlan, isPlan, MAX_RECOVERABLE_TOPICS, MAX_TOPICS, parseSyllabus, planToCsv, sequenceTopics, type Confidence, type Plan, type Topic } from './planner';

const DEMO_PREFIX = 'demo:exam-bridge:';
const isDemo = location.pathname.replace(/\/+$/, '') === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const STORAGE_KEY = isDemo ? `${DEMO_PREFIX}plan:v1` : 'exam-bridge:plan:v1';
const THEME_KEY = isDemo ? `${DEMO_PREFIX}theme` : 'exam-bridge:theme';

const templates = [
  { name: 'Engineering foundations', note: 'A reusable starter template—not an official syllabus.', topics: ['Engineering mathematics', 'Signals and systems', 'Electric circuits', 'Control systems', 'General aptitude'] },
  { name: 'Computer science foundations', note: 'A reusable starter template—not an official syllabus.', topics: ['Discrete mathematics', 'Programming and data structures', 'Algorithms', 'Computer organization', 'Operating systems', 'Database systems', 'Computer networks'] },
  { name: 'Quantitative foundations', note: 'A reusable starter template—not an official syllabus.', topics: ['Arithmetic and ratios', 'Algebra', 'Geometry', 'Data interpretation', 'Probability', 'Logical reasoning'] },
];

const ROUTE_FOCUS_KEY = 'exam-bridge:route-focus';

function clearDemoStorage(): void {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(DEMO_PREFIX)) localStorage.removeItem(key);
  }
}

function createDemoPlan(): Plan {
  const sample = createPlan('GATE ECE return plan', '', [
    'Engineering mathematics',
    'Network theory',
    'Signals and systems',
    'Electronic devices',
    'Analog circuits',
    'Control systems',
  ], new Date('2026-08-30T00:00:00.000Z'));
  const [mathematics, network, signals, devices, analog, control] = sample.topics;
  mathematics.confidence = 'ready';
  mathematics.practice = [{ id: 'sample-math-1', label: '2024 · Engineering Mathematics · Q7', url: '', done: true }];
  network.confidence = 'practising';
  network.prerequisites = ['Algebra and complex numbers'];
  network.practice = [{ id: 'sample-network-1', label: '2023 · Network Theory · Q18', url: '', done: false }];
  signals.confidence = 'shaky';
  signals.prerequisites = ['Basic calculus'];
  signals.practice = [{ id: 'sample-signals-1', label: '2022 · Signals and Systems · Q31', url: '', done: false }];
  devices.confidence = 'ready';
  devices.practice = [{ id: 'sample-devices-1', label: '2024 · Electronic Devices · Q22', url: '', done: true }];
  analog.confidence = 'shaky';
  analog.prerequisites = ['Circuit analysis'];
  control.confidence = 'new';
  control.prerequisites = ['Basic calculus'];
  control.practice = [{ id: 'sample-control-1', label: 'Add one question after your first review', url: '', done: false }];
  return sample;
}

if (!isDemo) clearDemoStorage();
let plan: Plan | null = loadPlan();
if (isDemo && !plan) {
  plan = createDemoPlan();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch { /* The sample still works for this visit. */ }
}
let saveMessage = isDemo ? 'Sample route loaded in the demo sandbox.' : plan ? 'Plan restored from this device.' : 'Nothing saved yet.';

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
    // Version 1.0.0 accidentally let the editor save topic 81. Continue to
    // load those affected local plans so they can be backed up or reset rather
    // than silently presenting an empty planner after an upgrade.
    return isPlan(parsed, MAX_RECOVERABLE_TOPICS) ? parsed : null;
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
    <div class="header-tools"><button class="menu-button" id="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded="false">Menu</button><button class="icon-button" id="theme-toggle" type="button" aria-label="Switch color theme"><span aria-hidden="true">◐</span></button></div>
    <nav id="primary-nav" aria-label="Primary" data-open="false"><a href="/demo">Demo</a><a href="#how">How it works</a><a href="#templates">Templates</a><a href="/privacy/">Privacy</a></nav>
  </header>`;
}

function hero(): string {
  const actions = isDemo
    ? '<a class="button primary" href="#planner">Explore the sample route</a><a class="button secondary" href="/">Start for real</a>'
    : '<a class="button primary" href="/demo">Try it with sample data</a><a class="button secondary" href="#planner">Build my route</a>';
  return `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow"><span>01</span> Study planning for your syllabus</p>
      <h1 id="hero-title">Turn a syllabus into a <em>study route.</em></h1>
      <p class="lede">For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own.</p>
      <div class="hero-actions">${actions}</div>
      <p class="action-note">${isDemo ? 'Explore six realistic topics. Changes stay in the temporary demo sandbox.' : 'The sample opens with six realistic topics. Your current plan stays unchanged.'}</p>
      <ul class="hero-facts"><li>Saved in this browser</li><li>Works offline after the first visit</li><li>Free planner, backups, and exports</li></ul>
    </div>
    <figure class="hero-figure"><img src="/assets/learning-topology.webp" width="1200" height="800" alt="Abstract paper map with circular topic nodes connected by a coral route and teal prerequisite paths" fetchpriority="high" decoding="async"><figcaption><span class="circle-key"></span> concept <span class="square-key"></span> practice checkpoint</figcaption></figure>
  </section>`;
}

function demoBanner(): string {
  if (!isDemo) return '';
  return `<aside class="demo-banner" aria-label="Demo mode"><div><strong>Demo — sample data, nothing is saved</strong><span>Changes use separate browser storage and never touch your real plan.</span></div><div class="demo-actions"><button id="reset-demo" type="button">Reset demo</button><a class="button secondary" href="/">Start for real</a></div></aside>`;
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
      <div class="practice-block"><h4>Question references</h4><p class="assist">Add a question ID, page, or link—never the copyrighted question text.</p>
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
    <section class="route-overview" aria-labelledby="route-title"><div><p class="eyebrow"><span>3</span> Follow the route</p><h2 id="route-title">Study route order</h2><p>Lowest-confidence topics come first. Reassess after practice and the route reorders itself.</p></div>
      <dl><div><dt>Topics</dt><dd>${stats.total}</dd></div><div><dt>Ready</dt><dd>${stats.ready}</dd></div><div><dt>Practised</dt><dd>${stats.practised}</dd></div></dl></section>
    ${plan.topics.length > MAX_TOPICS ? `<p class="plan-limit-notice" role="alert">This restored plan has ${plan.topics.length} topics. New plans are limited to ${MAX_TOPICS}; back it up before starting a new plan.</p>` : ''}
    <div class="toolbar" aria-label="Plan actions"><button type="button" data-global-action="add-topic" ${plan.topics.length >= MAX_TOPICS ? 'disabled aria-describedby="topic-limit-note"' : ''}>Add topic</button><span id="topic-limit-note" class="toolbar-note">${plan.topics.length >= MAX_TOPICS ? `Maximum ${MAX_TOPICS} topics reached.` : `${MAX_TOPICS - plan.topics.length} topic slots left.`}</span><button type="button" data-global-action="export-csv">Export CSV</button><button type="button" data-global-action="export-json">Back up JSON</button><label class="file-button">Restore JSON<input id="import-json" type="file" accept="application/json,.json"></label><button class="danger-link" type="button" data-global-action="reset">Start over</button></div>
    <div class="route-list">${ordered.map(topicCard).join('')}</div>
  </section>`;
}

function templatesSection(): string {
  const cards = templates.map((template, index) => `<article><div><span class="template-shape" aria-hidden="true"></span><h3>${template.name}</h3><p>${template.note}</p><small>${template.topics.length} editable topics</small></div><button type="button" data-template="${index}">Use ${template.name} template</button></article>`).join('');
  const access = `<aside class="access-panel demo-access"><p class="eyebrow">Free starter templates</p><h3>Use any template without payment</h3><p>Each template stays editable and saves only in this browser.</p></aside>`;
  return `<section class="templates" id="templates" aria-labelledby="templates-title"><div class="section-index"><span>+</span><div><p class="eyebrow">Reusable starting points</p><h2 id="templates-title">Choose a starter template</h2><p>Start with a reusable plan, then edit it to match your official outline.</p></div></div>
    <div class="template-list">${cards}</div>
    ${access}
  </section>`;
}

function howItWorksSection(): string {
  return `<section id="how" class="how" aria-labelledby="how-title">
    <div class="section-index"><span>3</span><div><p class="eyebrow">From outline to route</p><h2 id="how-title">How it works</h2></div></div>
    <ol class="how-steps">
      <li><span aria-hidden="true">1</span><div><h3>Paste your outline</h3><p>Add syllabus headings and the official source link when you have one.</p></div></li>
      <li><span aria-hidden="true">2</span><div><h3>Rate what you know</h3><p>Set your confidence and note the prerequisites each topic needs.</p></div></li>
      <li><span aria-hidden="true">3</span><div><h3>Follow your route</h3><p>Study lower-confidence topics first and attach question references you may use.</p></div></li>
    </ol>
  </section>`;
}

function setMeta(selector: string, content: string): void {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function updateRouteMetadata(): void {
  const route = isDemo ? '/demo' : '/';
  const title = isDemo ? 'Demo — Exam Bridge' : 'Exam Bridge — turn a syllabus into a study route';
  const description = isDemo
    ? 'Explore a six-topic sample study route without changing your real plan.'
    : 'Turn a syllabus into a prerequisite-aware study route linked to your own past-question references.';
  const url = `https://exam-bridge.sociobot.in${route}`;
  document.title = title;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.setAttribute('aria-busy', 'true');
  delete app.dataset.appMode;
  updateRouteMetadata();
  app.innerHTML = `${appHeader()}${demoBanner()}<div id="offline-banner" class="offline-banner" role="status" hidden>You’re offline. Planning and exports still work in this browser.</div><main id="main" tabindex="-1">${hero()}<div id="planner">${workspace()}</div>${howItWorksSection()}${templatesSection()}<section class="principles" aria-labelledby="principles-title"><p class="eyebrow">Privacy and planning limits</p><h2 id="principles-title">What Exam Bridge does not do</h2><div><p>Plans stay in this browser. Exam Bridge does not host exam questions or coaching notes.</p><p>Check the official syllabus before studying. Prerequisite suggestions are only starting points.</p><p>Exam Bridge is not endorsed by any exam authority.</p></div></section></main><footer><div class="brand"><span class="brand-mark" aria-hidden="true"><i></i></span><span>Exam Bridge</span></div><p>Turn a syllabus into a study route · Original generated illustration · no tracking · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · Built by Param Factory · v1.1.0</p></footer><div id="route-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div><div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  updateNetworkStatus();
  bindEvents();
  app.dataset.appMode = isDemo ? 'demo' : 'real';
  app.setAttribute('aria-busy', 'false');
  revealDemoWorkspace();
  focusHeadingAfterRouteChange();
}

function revealDemoWorkspace(): void {
  if (!isDemo || (location.hash && location.hash !== '#planner')) return;
  const planner = document.querySelector<HTMLElement>('#planner');
  const banner = document.querySelector<HTMLElement>('.demo-banner');
  if (!planner) return;
  const top = planner.getBoundingClientRect().top + window.scrollY - (banner?.getBoundingClientRect().height ?? 0) - 16;
  const previousBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, Math.max(0, top));
  document.documentElement.style.scrollBehavior = previousBehavior;
}

function focusHeadingAfterRouteChange(): void {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const shouldFocus = sessionStorage.getItem(ROUTE_FOCUS_KEY) === location.pathname || navigation?.type === 'back_forward';
  if (!shouldFocus) return;
  sessionStorage.removeItem(ROUTE_FOCUS_KEY);
  window.requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>(isDemo ? '#workspace-title' : 'h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const announcement = document.querySelector<HTMLElement>('#route-announcer');
    if (announcement) announcement.textContent = `${isDemo ? 'Demo' : 'Planner'} loaded: ${heading.textContent?.replace(/\s+/gu, ' ').trim() ?? ''}`;
  });
}

function announce(message: string): void {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function rerenderPlanner(message?: string, focusSelector?: string): void {
  if (message) savePlan(message);
  document.querySelector<HTMLDivElement>('#planner')!.innerHTML = workspace();
  bindPlannerEvents();
  if (focusSelector) document.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
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
        const focusSelector = refId ? `#topic-${CSS.escape(topic.id)} [data-ref-id="${CSS.escape(refId)}"] [data-action="practice-done"]` : undefined;
        rerenderPlanner('Practice progress saved.', focusSelector);
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
      if (plan.topics.length >= MAX_TOPICS) {
        announce(`A plan can contain up to ${MAX_TOPICS} topics. Remove or start a new plan before adding another.`);
        return;
      }
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
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    clearDemoStorage();
    plan = createDemoPlan();
    saveMessage = 'Sample route reset in the demo sandbox.';
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch { /* The sample still works for this visit. */ }
    render();
    announce('Demo reset to the original sample route.');
    document.querySelector<HTMLButtonElement>('#reset-demo')?.focus();
  });
  if (isDemo) {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(link => link.addEventListener('click', () => {
      const destination = new URL(link.href);
      if (destination.pathname.replace(/\/+$/, '') !== '/demo' && destination.searchParams.get('demo') !== '1') clearDemoStorage();
    }));
  }
  document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  bindMobileNavigation();
  document.querySelectorAll<HTMLButtonElement>('[data-template]').forEach(button => button.addEventListener('click', () => {
    const template = templates[Number(button.dataset.template)];
    if (plan && !window.confirm('Replace your current plan? Export a backup first if you need it.')) return;
    plan = createPlan(template.name, '', template.topics); savePlan('Template saved as a new local plan.'); rerenderPlanner(); document.querySelector('#workspace-title')?.scrollIntoView({ behavior: 'smooth' });
  }));
}

function bindMobileNavigation(): void {
  const toggle = document.querySelector<HTMLButtonElement>('#menu-toggle');
  const navigation = document.querySelector<HTMLElement>('#primary-nav');
  if (!toggle || !navigation) return;
  const setOpen = (open: boolean, focusFirst = false): void => {
    navigation.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open && focusFirst) navigation.querySelector<HTMLElement>('a')?.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true', true));
  navigation.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    setOpen(false);
    toggle.focus();
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
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

const storedTheme = localStorage.getItem(THEME_KEY);
if (storedTheme === 'dark' || storedTheme === 'light') document.documentElement.dataset.theme = storedTheme;
render();
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
window.addEventListener('popstate', () => {
  sessionStorage.setItem(ROUTE_FOCUS_KEY, location.pathname);
  focusHeadingAfterRouteChange();
});
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => {
  void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
    .then(registration => registration.update())
    .catch(() => undefined);
});
