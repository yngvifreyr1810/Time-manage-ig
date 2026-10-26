import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test, before, after } from 'node:test';
const playwrightModule = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE.endsWith('.mjs') || process.env.PLAYWRIGHT_MODULE.endsWith('.js') ? process.env.PLAYWRIGHT_MODULE : join(process.env.PLAYWRIGHT_MODULE, 'index.mjs')).href
  : 'playwright';
const { chromium } = await import(playwrightModule);

const distDir = resolve(process.env.DIST_DIR || fileURLToPath(new URL('../dist/', import.meta.url)));
let server;
let origin;

function fixture(overrides = {}) {
  return {
    version: 1,
    entries: [],
    suggestionIndex: 0,
    custom: null,
    session: null,
    theme: 'light',
    missionScores: {},
    approvedRules: [],
    workshopHistory: [],
    ...overrides,
  };
}

async function browserWithState(state, ai = {}) {
  const launchOptions = { headless: true };
  if (process.env.BROWSER_EXECUTABLE) launchOptions.executablePath = process.env.BROWSER_EXECUTABLE;
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  const failedRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.addInitScript(({ saved, aiStub }) => {
    localStorage.setItem('nhip-prototype-v1', JSON.stringify(saved));
    window.__nhipInferenceCalls = 0;
    window.__nhipAiStub = aiStub;
  }, { saved: state, aiStub: ai });
  await page.route('**/api/nhip/status**', async (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ app: 'nhip', protocol: 1, connected: true, token: 'offline-test-token', models: [{ id: 'offline-test-model', label: 'Offline test model', group: 'Test' }] }),
  }));
  await page.route('**/api/nhip/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/x-ndjson',
      body: `${JSON.stringify({ type: 'done', text: 'Gợi ý tổng hợp từ stub.' })}\n`,
    });
  });
  await page.goto(`${origin}/index.html#next`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.NhipWorkshop || window.__nhipBootstrapError, null, { timeout: 3000 }).catch(() => {});
  await page.evaluate(() => {
    if (!window.NhipAI) return;
    Object.defineProperty(window.NhipAI, 'connected', { configurable: true, get: () => true });
    window.NhipAI.send = async () => {
      window.__nhipInferenceCalls += 1;
      return { id: `stub-${window.__nhipInferenceCalls}`, output: 'Gợi ý tổng hợp từ stub.' };
    };
    window.NhipAI.openConnection = () => {};
    window.NhipAI.annotate = () => {};
  });
  await page.evaluate(({ messages, failed }) => { window.__nhipPageErrors = messages; window.__nhipFailedRequests = failed; }, { messages: errors, failed: failedRequests });
  return { browser, page };
}

async function requireWorkshop(page) {
  const boot = await page.evaluate(() => ({ ready: !!window.NhipWorkshop, errors: window.__nhipPageErrors || [], failed: window.__nhipFailedRequests || [], scripts: [...document.scripts].map((script) => script.src) }));
  assert.equal(boot.ready, true, `Nhịp scripts did not boot: ${boot.errors.join(' | ')} requests=${boot.failed.join(' | ')} scripts=${boot.scripts.join(',')}`);
}

before(async () => {
  server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(distDir, `.${pathname}`);
    if (!file.startsWith(resolve(distDir))) {
      response.writeHead(403); response.end(); return;
    }
    try {
      const body = await readFile(file);
      const type = extname(file) === '.html' ? 'text/html; charset=utf-8'
        : extname(file) === '.css' ? 'text/css; charset=utf-8'
          : 'text/javascript; charset=utf-8';
      response.writeHead(200, { 'content-type': type }); response.end(body);
    } catch {
      response.writeHead(404); response.end('Not found');
    }
  });
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolveServer) => server.close(resolveServer));
});

test('fresh home uses deterministic catalog selector and does not infer', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    const result = await page.evaluate(() => {
      const selected = window.NhipWorkshop.selectHomeCandidates({ version: 1, missionScores: {}, session: null }, 0);
      return {
        selected,
        calls: window.__nhipInferenceCalls,
        ids: [...document.querySelectorAll('[data-task-id]')].map((node) => node.dataset.taskId),
        slots: !!document.querySelector('[data-primary-slot]') && !!document.querySelector('[data-alternatives-slot]'),
      };
    });
    assert.equal(result.selected.primary.id, 'ai-preferences');
    assert.deepEqual(result.selected.alternatives.map((task) => task.id), ['work-next-step', 'rest-offscreen']);
    assert.equal(result.calls, 0);
    assert.equal(result.slots, true);
    assert.equal(new Set(result.selected.alternatives.map((task) => task.categoryId)).size, 2);
  } finally {
    await browser.close();
  }
});

test('returning home rerenders the active activity as a resume card without inference', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    const start = page.locator('[data-primary-slot] [data-action="start"]').first();
    await start.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(/#work$/);
    await page.evaluate(() => { location.hash = 'next'; });
    await page.waitForURL(/#next$/);
    const result = await page.evaluate(() => ({
      kind: document.querySelector('[data-primary-slot] [data-task-id]')?.dataset.kind,
      action: document.querySelector('[data-primary-slot] [data-action="resume"]')?.dataset.action,
      session: !!state.session,
      calls: window.__nhipInferenceCalls,
    }));
    assert.equal(result.kind, 'resume');
    assert.equal(result.action, 'resume');
    assert.equal(result.session, true);
    assert.equal(result.calls, 0);
  } finally {
    await browser.close();
  }
});

test('equal-score rotations advance primary once without persisting preferences', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    const result = await page.evaluate(() => {
      const state = { version: 1, missionScores: {}, session: null };
      const before = localStorage.getItem('nhip-prototype-v1');
      const primaryIds = Array.from({ length: 6 }, (_, offset) => window.NhipWorkshop.selectHomeCandidates(state, offset).primary.id);
      return { primaryIds, before, after: localStorage.getItem('nhip-prototype-v1') };
    });
    assert.deepEqual(result.primaryIds, [
      'ai-preferences',
      'work-next-step',
      'rest-offscreen',
      'ai-real-draft',
      'learn-question',
      'play-music',
    ]);
    assert.equal(result.after, result.before);
  } finally {
    await browser.close();
  }
});

test('scores rank activities without changing tie order or category variety', async () => {
  const { browser, page } = await browserWithState(fixture({
    missionScores: { 'learn-question': 2, 'ai-real-draft': 2, 'rest-offscreen': 1 },
  }));
  try {
    await requireWorkshop(page);
    const result = await page.evaluate(() => {
      const state = { version: 1, missionScores: { 'learn-question': 2, 'ai-real-draft': 2, 'rest-offscreen': 1 }, session: null };
      const selected = window.NhipWorkshop.selectHomeCandidates(state, 0);
      return { primary: selected.primary.id, alternatives: selected.alternatives.map((task) => task.id) };
    });
    assert.equal(result.primary, 'ai-real-draft');
    assert.deepEqual(result.alternatives, ['learn-question', 'rest-offscreen']);
  } finally {
    await browser.close();
  }
});

test('paused legacy session remains primary and retains its title', async () => {
  const saved = fixture({
    session: {
      task: { title: 'Phiên cũ đang dở', category: 'Làm việc', minutes: 20 },
      elapsed: 123000,
      startedAt: null,
      time: '09:15',
    },
    workshop: { id: 'evaluate', variant: 'guided', index: 1, answers: [], drafts: { 1: 'bản nháp' }, limit: 3 },
  });
  const { browser, page } = await browserWithState(saved);
  try {
    await requireWorkshop(page);
    const result = await page.evaluate(() => {
      const selected = window.NhipWorkshop.selectHomeCandidates(JSON.parse(localStorage.getItem('nhip-prototype-v1')), 0);
      return { title: selected.primary.title, resume: selected.primary.resume, kind: selected.primary.kind, alternatives: selected.alternatives };
    });
    assert.equal(result.title, 'Phiên cũ đang dở');
    assert.equal(result.resume, true);
    assert.equal(result.kind, 'resume');
    assert.equal(new Set(result.alternatives.map((task) => task.categoryId)).size, 2);
  } finally {
    await browser.close();
  }
});

test('unknown activity payload survives load for generic recovery', async () => {
  const raw = { id: 'future-activity', payload: { untouched: 'keep-me' }, answers: [], drafts: {}, index: 0, limit: 1 };
  const { browser, page } = await browserWithState(fixture({
    session: { task: { title: 'Hoạt động tương lai', category: 'Làm việc', minutes: 20 }, elapsed: 90000, startedAt: null, time: '10:00' },
    workshop: raw,
  }));
  try {
    await requireWorkshop(page);
    const preserved = await page.evaluate(() => state.workshop);
    assert.deepEqual(preserved.payload, raw.payload);
    assert.equal(preserved.id, raw.id);
  } finally {
    await browser.close();
  }
});

test('activity starts with one local step and only explicit AI action can send', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('work-next-step'));
    await page.waitForURL(/#work$/);
    assert.equal(await page.locator('[data-activity-step]').count(), 1);
    assert.equal(await page.locator('[data-action="confirm-step"]').count(), 1);
    assert.equal(await page.locator('[data-action="ask-ai"]').count(), 0);
    assert.equal(await page.evaluate(() => window.__nhipInferenceCalls), 0);
  } finally {
    await browser.close();
  }
});

test('explicit ask-ai action sends exactly one stubbed request', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('work-next-step'));
    await page.locator('[data-step-input="text"]').fill('Chuẩn bị nội dung họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.locator('[data-step-input="text"]').fill('Viết ba ý chính');
    assert.equal(await page.locator('[data-action="ask-ai"]').count(), 1);
    await page.evaluate(() => Object.defineProperty(window.NhipAI, 'connected', { configurable: true, get: () => true }));
    await page.locator('[data-action="ask-ai"]').click();
    await page.waitForTimeout(20);
    const calls = await page.evaluate(() => ({ count: window.__nhipInferenceCalls, connected: window.NhipAI.connected, busy: window.NhipAI.busy }));
    assert.equal(calls.count, 1, JSON.stringify(calls));
  } finally {
    await browser.close();
  }
});

test('artifact and memory controls are explicit and use selected support style', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('ai-preferences'));
    await page.locator('[data-step-input="text"]').fill('Viết bản nháp cho cuộc họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.locator('[data-step-input="choice"]').getByRole('button', { name: 'Đưa bản nháp để mình sửa' }).click();
    await page.locator('[data-action="confirm-step"]').click();
    await page.locator('[data-step-input="artifact"]').fill('Mình muốn: Viết bản nháp cho cuộc họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.locator('[data-action="confirm-artifact"]').click();
    assert.match(await page.locator('.memory-note').inputValue(), /Đưa bản nháp để mình sửa/i);
    assert.equal(await page.evaluate(() => window.__nhipInferenceCalls), 0);
  } finally {
    await browser.close();
  }
});

test('rest and music choices do not require a narrative answer', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('rest-offscreen'));
    await page.getByRole('button', { name: 'Đi vài bước' }).click();
    await page.locator('[data-action="confirm-step"]').click();
    assert.equal(await page.locator('[data-action="confirm-step"]').count(), 1);
    await page.evaluate(() => {
      state.session = null;
      state.workshop = null;
      save();
      window.NhipWorkshop.renderHome();
    });
    await page.evaluate(() => window.NhipWorkshop.startMission('play-music'));
    await page.getByRole('button', { name: 'Mở danh sách quen thuộc' }).click();
    await page.locator('[data-action="confirm-step"]').click();
    assert.equal(await page.locator('[data-action="confirm-step"]').count(), 1);
  } finally {
    await browser.close();
  }
});

test('free-text support, tone, and music title choices use editable inputs', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('ai-preferences'));
    await page.locator('[data-step-input="text"]').fill('Chuẩn bị nội dung họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.getByRole('button', { name: 'Tự viết', exact: true }).click();
    assert.equal(await page.locator('[data-step-input="text"]').count(), 1);
    await page.locator('[data-step-input="text"]').fill('Tự chọn cách hỗ trợ');
    await page.locator('[data-action="confirm-step"]').click();
    assert.equal(await page.evaluate(() => state.workshop.inputs.support), 'Tự chọn cách hỗ trợ');
    await page.locator('[data-step-input="artifact"]').fill('Mình muốn: Chuẩn bị nội dung họp. Cách hỗ trợ trước: Tự chọn cách hỗ trợ');
    assert.match(await page.locator('[data-step-input="artifact"]').inputValue(), /Tự chọn cách hỗ trợ/);
    await page.evaluate(() => { state.session = null; state.workshop = null; save(); window.NhipWorkshop.renderHome(); });
    await page.evaluate(() => window.NhipWorkshop.startMission('ai-real-draft'));
    await page.locator('[data-step-input="text"]').fill('Nhắc lịch họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.getByRole('button', { name: 'Tự viết', exact: true }).click();
    await page.locator('[data-step-input="text"]').fill('Ấm áp nhưng ngắn');
    await page.locator('[data-action="confirm-step"]').click();
    assert.equal(await page.evaluate(() => state.workshop.inputs.tone), 'Ấm áp nhưng ngắn');
    assert.equal(await page.locator('[data-action="ask-ai"]').count(), 1);
    await page.evaluate(() => { state.session = null; state.workshop = null; save(); window.NhipWorkshop.renderHome(); });
    await page.evaluate(() => window.NhipWorkshop.startMission('play-music'));
    await page.getByRole('button', { name: 'Nhập tên bài', exact: true }).click();
    await page.locator('[data-step-input="text"]').fill('Bài hát thử nghiệm');
    await page.locator('[data-action="confirm-step"]').click();
    assert.equal(await page.evaluate(() => state.workshop.answers[0].text), 'Bài hát thử nghiệm');
    assert.equal(await page.evaluate(() => state.workshop.inputs.track), 'Bài hát thử nghiệm');
    assert.equal(await page.evaluate(() => window.__nhipInferenceCalls), 0);
  } finally {
    await browser.close();
  }
});

test('active preview disables start-preview while a session exists and styles it as a CTA', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => { window.NhipWorkshop.startMission('work-next-step'); window.NhipWorkshop.renderHome(); });
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    const active = await page.locator('#activity-preview [data-action="start-preview"]').evaluate((button) => ({ disabled: button.disabled, text: button.textContent, className: button.className }));
    assert.equal(active.disabled, true);
    assert.match(active.text, /Bắt đầu sau khi kết thúc phiên hiện tại/);
    assert.match(await page.locator('#activity-preview [data-action="start-preview"]').evaluate((button) => getComputedStyle(button).display), /flex/);
    await page.keyboard.press('Escape');
    await page.evaluate(() => { state.session = null; state.workshop = null; save(); window.NhipWorkshop.renderHome(); });
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    const fresh = await page.locator('#activity-preview [data-action="start-preview"]').evaluate((button) => ({ disabled: button.disabled, text: button.textContent }));
    assert.equal(fresh.disabled, false);
    assert.notEqual(fresh.text, 'Bắt đầu sau khi kết thúc phiên hiện tại');
  } finally {
    await browser.close();
  }
});

test('custom finish-current uses entry flow and opens requested preview after confirmed save', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.getByRole('button', { name: 'Tự chọn việc khác' }).click();
    await page.locator('#custom-title').fill('Việc tự chọn');
    await page.locator('#task-form button[type="submit"]').click();
    await page.waitForURL(/#work$/);
    await page.evaluate(() => { location.hash = 'next'; });
    await page.waitForURL(/#next$/);
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    await page.locator('[data-action="finish-current"]').evaluate((button) => button.click());
    assert.equal(await page.locator('#entry-dialog').evaluate((dialog) => dialog.open), true);
    await page.locator('#entry-dialog').locator('#entry-outcome').fill('Đã hoàn thành phần việc tự chọn');
    await page.locator('#entry-form').evaluate((form) => form.requestSubmit());
    await page.waitForTimeout(20);
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), true);
    assert.equal(await page.locator('#activity-preview [data-action="start-preview"]').isDisabled(), false);
    assert.equal(await page.evaluate(() => !!state.session), false);
  } finally {
    await browser.close();
  }
});

test('cancelling custom queued preview clears it before existing entry finish', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.getByRole('button', { name: 'Tự chọn việc khác' }).click();
    await page.locator('#custom-title').fill('Việc tự chọn khác');
    await page.locator('#task-form button[type="submit"]').click();
    await page.waitForURL(/#work$/);
    await page.evaluate(() => { location.hash = 'next'; });
    await page.waitForURL(/#next$/);
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    await page.keyboard.press('Escape');
    await page.evaluate(() => { location.hash = 'work'; });
    await page.waitForURL(/#work$/);
    await page.locator('#finish-session').evaluate((button) => button.click());
    await page.locator('#entry-dialog').locator('#entry-outcome').fill('Đã kết thúc việc tự chọn');
    await page.locator('#entry-form').evaluate((form) => form.requestSubmit());
    await page.waitForTimeout(20);
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), false);
    assert.match(page.url(), /#review$/);
  } finally {
    await browser.close();
  }
});

test('cancelling entry after custom finish-current clears the queued preview', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.getByRole('button', { name: 'Tự chọn việc khác' }).click();
    await page.locator('#custom-title').fill('Việc tự chọn bị hủy');
    await page.locator('#task-form button[type="submit"]').click();
    await page.waitForURL(/#work$/);
    await page.evaluate(() => { location.hash = 'next'; });
    await page.waitForURL(/#next$/);
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    await page.locator('[data-action="finish-current"]').evaluate((button) => button.click());
    assert.equal(await page.locator('#entry-dialog').evaluate((dialog) => dialog.open), true);
    await page.locator('#cancel-dialog').click();
    assert.equal(await page.locator('#entry-dialog').evaluate((dialog) => dialog.open), false);
    await page.evaluate(() => { location.hash = 'work'; });
    await page.waitForURL(/#work$/);
    await page.locator('#finish-session').evaluate((button) => button.click());
    await page.locator('#entry-outcome').fill('Lưu về sau');
    await page.locator('#entry-form').evaluate((form) => form.requestSubmit());
    await page.waitForTimeout(20);
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), false);
    assert.match(page.url(), /#review$/);
  } finally {
    await browser.close();
  }
});

test('activity resume normalizes missing and malformed limit/index safely', async () => {
  const saved = fixture({
    session: { task: { taskId: 'work-next-step', title: 'Việc đang dở', category: 'Làm việc', categoryLabel: 'Việc và học', minutes: 20 }, elapsed: 0, startedAt: null, time: '10:00' },
    workshop: { id: 'work-next-step', kind: 'activity', index: 99, answers: [], drafts: {}, inputs: {} },
  });
  const { browser, page } = await browserWithState(saved);
  try {
    await requireWorkshop(page);
    await page.goto(`${origin}/index.html#work`, { waitUntil: 'load' });
    await page.waitForTimeout(20);
    assert.equal(await page.locator('.page-error').count(), 0);
    assert.match(await page.locator('#work-content').textContent(), /KẾT QUẢ ĐỂ BẠN XÁC NHẬN|Việc đang dở/);
    const normalized = await page.evaluate(() => ({ index: state.workshop.index, limit: state.workshop.limit }));
    assert.equal(normalized.limit, 3);
    assert.equal(normalized.index, 3);
  } finally {
    await browser.close();
  }
});

test('activity guide context uses activity phase and bounded activity key', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('work-next-step'));
    const context = await page.evaluate(() => window.NhipGuide.context(undefined, true));
    assert.equal(context.task.phase, 'step');
    assert.equal(context.guideConversation, undefined);
    await page.locator('[data-step-input="text"]').fill('Chuẩn bị nội dung họp');
    await page.locator('[data-action="confirm-step"]').click();
    const after = await page.evaluate(() => window.NhipGuide.context(undefined, true));
    assert.equal(after.task.phase, 'step');
    assert.equal(after.task.step, 2);
  } finally {
    await browser.close();
  }
});

test('Escape closes queued preview without reopening it after finish', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => { window.NhipWorkshop.startMission('work-next-step'); window.NhipWorkshop.renderHome(); });
    await page.locator('[data-priority="secondary"] [data-action="start"]').first().evaluate((button) => button.click());
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), false);
    await page.evaluate(() => {
      window.NhipWorkshop.finish();
      document.querySelector('#finish-result').value = 'Đã ghi nhận phần đã làm';
      document.querySelector('#finish-form').requestSubmit();
    });
    await page.waitForTimeout(20);
    assert.equal(await page.locator('#activity-preview').evaluate((dialog) => dialog.open), false);
    assert.match(page.url(), /#review$/);
  } finally {
    await browser.close();
  }
});

test('activity AI draft action streams, disables controls, and remains explicit', async () => {
  const { browser, page } = await browserWithState(fixture());
  try {
    await requireWorkshop(page);
    await page.evaluate(() => window.NhipWorkshop.startMission('ai-real-draft'));
    await page.locator('[data-step-input="text"]').fill('Nhắc lịch họp');
    await page.locator('[data-action="confirm-step"]').click();
    await page.getByRole('button', { name: 'Ngắn gọn', exact: true }).click();
    await page.locator('[data-action="confirm-step"]').click();
    await page.evaluate(() => {
      let busy = false;
      let rejectPending;
      Object.defineProperty(window.NhipAI, 'busy', { configurable: true, get: () => busy });
      window.NhipAI.send = ({ onUpdate }) => new Promise((resolve, reject) => {
        busy = true; rejectPending = reject; document.dispatchEvent(new Event('nhip:ai-state'));
        onUpdate('Bản nháp đang viết');
        setTimeout(() => { if (!busy) return; busy = false; document.dispatchEvent(new Event('nhip:ai-state')); resolve({ id: 'slow-draft', output: 'Bản nháp hoàn chỉnh' }); }, 80);
      });
      window.NhipAI.stop = () => { busy = false; document.dispatchEvent(new Event('nhip:ai-state')); rejectPending?.(new Error('Đã dừng phản hồi.')); };
    });
    await page.locator('[data-action="ask-ai"]').click();
    assert.equal(await page.locator('[data-action="ask-ai"]').isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Dừng phản hồi', exact: true }).count(), 1);
    await page.getByRole('button', { name: 'Dừng phản hồi', exact: true }).click();
    await page.waitForTimeout(20);
    assert.match(await page.locator('#guide-messages').textContent(), /Đã dừng phản hồi/);
    await page.locator('[data-action="ask-ai"]').click();
    await page.waitForTimeout(120);
    assert.match(await page.locator('#guide-messages').textContent(), /Bản nháp hoàn chỉnh/);
    assert.equal(await page.evaluate(() => window.__nhipInferenceCalls), 0);
  } finally {
    await browser.close();
  }
});
