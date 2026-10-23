import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

function setup({ reducedMotion = false } = {}) {
  const dom = new JSDOM('<div id="app"></div>', { runScripts: 'outside-only', url: 'https://meco-robotics.github.io/MECO-Programming-Dashboard/' });
  const { window } = dom;
  let tick;
  window.setInterval = fn => { tick = fn; return 1; };
  window.clearInterval = () => { tick = undefined; };
  window.scrollTo = () => {};
  window.matchMedia = () => ({ matches: reducedMotion });
  Object.defineProperty(window.document, 'hidden', { value: false });
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  const data = readFileSync(new URL('../src/projects.js', import.meta.url), 'utf8').replaceAll('export ', '');
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/gm, '').replaceAll('import.meta.env.BASE_URL', "'/'");
  window.eval(data + '\n' + source);
  return { window, doc: window.document, click: selector => window.document.querySelector(selector).click(), tick: () => tick?.(), close: () => window.close() };
}
test('all requested projects render and category filters recover the full catalog', () => {
 const ui=setup();
 assert.equal(ui.doc.querySelectorAll('.project-card').length,5);
 ui.click('[data-filter="Autonomy"]');
 assert.equal(ui.doc.querySelectorAll('.project-card').length,1);
 assert.match(ui.doc.querySelector('.project-card').textContent,/AutoDrive/);
 ui.click('[data-filter="All projects"]');assert.equal(ui.doc.querySelectorAll('.project-card').length,5);ui.close();
});
test('sequence gives corrective feedback, resets, and recognizes a scoring cycle',()=>{
 const ui=setup();ui.click('[data-open="remy"]');
 for(const s of ['Shoot','Aim','Collect'])ui.click(`[data-step="${s}"]`);
 assert.match(ui.doc.querySelector('#demo-feedback').textContent,/Collect a game piece/);
 ui.click('#reset-sequence');
 for(const s of ['Collect','Aim','Shoot'])ui.click(`[data-step="${s}"]`);
 assert.match(ui.doc.querySelector('#demo-feedback').textContent,/Correct:/);
 ui.click('[data-level="technical"]');assert.match(ui.doc.querySelector('.explanation').textContent,/recorded-log replay/);
 assert.match(ui.doc.querySelector('#sequence-slots').textContent,/Collect/);ui.close();
});
test('scouting counter stays nonnegative and project reopening resets demo state',()=>{
 const ui=setup();ui.click('[data-open="scouting"]');assert.ok(ui.doc.querySelector('#minus-score').disabled);
 ui.click('#plus-score');ui.click('#plus-score');ui.click('#minus-score');assert.equal(ui.doc.querySelector('#score').value,'1');
 ui.click('#close-dialog');ui.click('[data-open="scouting"]');assert.equal(ui.doc.querySelector('#score').value,'0');ui.close();
});
test('showcase advances, wraps, pauses for exploration, and exits on Escape',()=>{
 const ui=setup();ui.click('#tour');assert.ok(ui.doc.body.classList.contains('showcase-mode'));
 for(let i=0;i<10;i++)ui.tick();assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Scouting software/);
 for(let i=0;i<40;i++)ui.tick();assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Remy/);
 ui.click('[data-open="remy"]');assert.ok(!ui.doc.body.classList.contains('showcase-mode'));
 ui.click('#close-dialog');ui.click('#tour');ui.doc.dispatchEvent(new ui.window.KeyboardEvent('keydown',{key:'Escape'}));
 assert.equal(ui.doc.querySelector('#tour').getAttribute('aria-pressed'),'false');ui.close();
});
test('team checklist and autonomous destinations respond to interaction',()=>{
 const ui=setup();ui.click('[data-open="mission"]');
 ui.doc.querySelectorAll('.checklist input').forEach(input=>input.click());
 assert.match(ui.doc.querySelector('#ready-status').textContent,/All 3 example checks are complete/);
 ui.click('#close-dialog');ui.click('[data-open="auto"]');ui.click('[data-route="score"]');
 assert.ok(ui.doc.querySelector('.interactive-field').classList.contains('scoring'));
 ui.click('[data-route="reset"]');assert.ok(!ui.doc.querySelector('.interactive-field').classList.contains('scoring'));ui.close();
});
test('carousel wraps in both directions and keeps outgoing slides inaccessible',()=>{
 const ui=setup();
 ui.click('[data-direction="-1"]');
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/AutoDrive/);
 const outgoing=ui.doc.querySelector('.outgoing');
 assert.equal(outgoing.getAttribute('aria-hidden'),'true');
 assert.ok(outgoing.hasAttribute('inert'));
 assert.equal(outgoing.querySelectorAll('[id]').length,0);
 assert.equal(ui.doc.querySelectorAll('#feature-copy').length,1);
 ui.click('[data-direction="1"]');
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Remy/);
 assert.equal(ui.doc.querySelectorAll('.outgoing').length,1);
 ui.close();
});
test('carousel keeps selected dot focus and pauses automatic advancement while exploring slide controls',()=>{
 const ui=setup();
 const dot=ui.doc.querySelector('[data-slide="2"]');dot.focus();dot.click();
 assert.equal(ui.doc.activeElement,dot);
 assert.equal(dot.getAttribute('aria-pressed'),'true');
 ui.click('#tour');
 ui.doc.querySelector('#feature-copy button').focus();
 for(let i=0;i<20;i++)ui.tick();
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/La Petit Fromage/);
 ui.doc.querySelector('#tour').focus();
 for(let i=0;i<10;i++)ui.tick();
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Mission Control/);
 ui.close();
});


test('each project separates its overview, engineering evidence, and optional activity', () => {
 const ui=setup();
 for(const id of ['remy','scouting','note','mission','auto']) {
  ui.click(`[data-open="${id}"]`);
  assert.equal(ui.doc.querySelector('.activity').open,false);
  assert.ok(ui.doc.querySelector('.project-purpose').textContent.length>20);
  ui.click('[data-level="technical"]');
  assert.equal(ui.doc.querySelectorAll('.engineering-notes dt').length,2);
  assert.equal(ui.doc.querySelectorAll('.evidence-links a').length,2);
  assert.ok(ui.doc.querySelector('.project-limitation').textContent.length>20);
  ui.doc.querySelector('.activity').open=true;
  ui.click('[data-level="simple"]');
  assert.equal(ui.doc.querySelector('.activity').open,true);
  ui.click('#close-dialog');
 }
 ui.close();
});
test('sequence undo allows correction and activity state survives explanation changes', () => {
 const ui=setup();ui.click('[data-open="note"]');
 assert.ok(ui.doc.querySelector('#undo-sequence').disabled);
 ui.click('[data-step="Shoot"]');ui.click('#undo-sequence');
 assert.ok(ui.doc.querySelector('#undo-sequence').disabled);
 ui.click('[data-step="Collect"]');ui.click('[data-level="technical"]');
 assert.match(ui.doc.querySelector('#sequence-slots').textContent,/Collect/);
 ui.click('[data-step="Aim"]');ui.click('[data-step="Shoot"]');
 assert.match(ui.doc.querySelector('#demo-feedback').textContent,/Correct:/);
 ui.click('#undo-sequence');assert.ok(!ui.doc.querySelector('[data-step="Shoot"]').disabled);
 ui.click('#close-dialog');ui.click('[data-open="note"]');
 assert.doesNotMatch(ui.doc.querySelector('#sequence-slots').textContent,/Collect/);ui.close();
});

test('presentation can pause and resume without leaving the monitor layout', () => {
 const ui=setup();assert.ok(ui.doc.querySelector('#pause-tour').hidden);
 ui.click('#tour');ui.click('#pause-tour');
 for(let i=0;i<30;i++)ui.tick();
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Remy/);
 assert.ok(ui.doc.body.classList.contains('showcase-mode'));
 assert.match(ui.doc.querySelector('#tour-status').textContent,/Paused/);
 ui.click('[data-direction="1"]');
 for(let i=0;i<20;i++)ui.tick();
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Scouting/);
 ui.click('#pause-tour');for(let i=0;i<10;i++)ui.tick();
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/La Petit Fromage/);
 ui.click('#tour');assert.ok(ui.doc.querySelector('#pause-tour').hidden);ui.close();
});

test('reduced-motion navigation changes the project without a duplicate animated slide', () => {
 const ui=setup({reducedMotion:true});ui.click('[data-direction="1"]');
 assert.match(ui.doc.querySelector('#feature-copy h2').textContent,/Scouting/);
 assert.equal(ui.doc.querySelectorAll('.outgoing').length,0);
 assert.ok(!ui.doc.querySelector('.feature-slide').classList.contains('slide-enter'));ui.close();
});
test('completing a keyboard sequence moves focus to the enabled undo control', () => {
 const ui=setup();ui.click('[data-open="remy"]');
 for(const step of ['Collect','Aim','Shoot']) {
  const button=ui.doc.querySelector(`[data-step="${step}"]`);button.focus();button.click();
 }
 assert.equal(ui.doc.activeElement,ui.doc.querySelector('#undo-sequence'));ui.close();
});

test('leaving native fullscreen stops presentation even when the browser consumes Escape', () => {
 const ui=setup();ui.click('#tour');ui.doc.dispatchEvent(new ui.window.Event('fullscreenchange'));
 assert.ok(!ui.doc.body.classList.contains('showcase-mode'));
 assert.equal(ui.doc.querySelector('#tour').getAttribute('aria-pressed'),'false');ui.close();
});
