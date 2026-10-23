import './style.css';
import './identity.css';
import { projects, github, sequenceFeedback } from './projects.js';
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const external = (url, text, cls = '') => `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">${text}<span aria-hidden="true">↗</span></a>`;
const websiteLinks = (project, cls = 'button outline') => (project.websites || []).map(site => external(site.url, site.label, cls)).join('');
let selected = 0, category = 'All projects', technical = false, sequence = [], scores = 0;
const app = document.querySelector('#app');
app.innerHTML = `
<a class="skip-link" href="#projects">Skip to projects</a>
<header><a class="brand" href="#" aria-label="MECO Robotics home"><img src="${asset('meco-logo.svg')}" alt="MECO Robotics"><span class="brand-divider"></span><span class="brand-caption">FRC TEAM <strong>8324</strong></span></a><nav aria-label="Main navigation"><a class="nav-active" href="#projects">Our projects</a><button id="fullscreen" class="button subtle">⛶ <span>Full screen</span></button></nav></header>
<main><section class="intro"><div><p class="eyebrow">MECO Robotics / Software</p><h1>Programming<br>projects</h1><p class="intro-copy">We’re a FIRST Robotics Competition team from East Orlando. Explore a project to see what it does, how it works, and the code behind it.</p></div><a class="intro-aside team-website-link" href="https://www.mecorobotics.org/" target="_blank" rel="noopener noreferrer">East Orlando, Florida<span>Team website ↗</span></a></section>
<section class="featured" aria-label="Project carousel" aria-roledescription="carousel"><div class="feature-panel"><div class="carousel-viewport"><div class="feature-slide" role="group" aria-roledescription="slide"><div class="feature-copy" id="feature-copy"></div><div class="feature-visual" id="feature-visual"></div></div></div><button class="carousel-arrow previous" data-direction="-1" aria-label="Previous project">←</button><button class="carousel-arrow next" data-direction="1" aria-label="Next project">→</button></div><div class="feature-bottom"><div id="slide-dots" class="slide-dots" aria-label="Choose featured project"></div><span class="swipe-hint">Swipe to explore</span></div></section>
<section id="projects" class="projects"><div class="section-heading"><div><h2>Project directory</h2></div><p>Maintained by FRC Team 8324</p></div><div class="project-toolbar"><div class="filters" role="group" aria-label="Filter projects">${['All projects','Robots','Team tools','Autonomy'].map((c,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${c}" aria-pressed="${i===0}">${c}</button>`).join('')}</div><span class="mono" id="project-count">5 projects</span></div><div class="project-grid" id="project-grid"></div></section>
</main>
<footer><span>MECO Robotics · Team 8324</span><div>${external(github, 'GitHub')}${external('https://www.mecorobotics.org/', 'mecorobotics.org')}</div></footer>
<dialog id="project-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span class="eyebrow">Project details</span><button id="close-dialog" class="icon-button" aria-label="Close project">✕</button></div><div id="dialog-body"></div></dialog><p id="announcement" class="sr-only" role="status"></p>`;
const dialog = document.querySelector('dialog');
function fieldMarkup(interactive=false) { return `<div class="field ${interactive?'interactive-field':''}" role="img" aria-label="A robot travels around a central obstacle to collect game pieces or reach a goal."><div class="field-line"></div><div class="field-goal">GOAL</div><svg class="route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 13 79 L 33 79 L 33 23 L 88 23"/></svg><span class="field-bot">8324</span><span class="fuel fuel-one"></span><span class="fuel fuel-two"></span><span class="fuel fuel-three"></span><span class="field-caption">Route illustration · Not a live robot</span></div>`; }
function visual(p) {
 if(p.id==='remy') return `<img class="robot-photo" src="${asset('remy.jpg')}" alt="Remy, MECO’s blue-bumpered 8324 competition robot, lit in blue and red"><div class="photo-caption"> REMY <span>2026 / REBUILT</span></div>`;
 if(p.id==='auto') return `<figure class="software-preview"><img src="${asset('autodrive-preview.png')}" alt="AutoDrive simulation showing robots, game pieces, and planned paths on the 2026 REBUILT field"><figcaption><strong>AutoDrive simulation</strong><span>Robots and routes on the simulated competition field.</span></figcaption></figure>`;
 if(p.id==='scouting') return `<figure class="software-preview"><img src="${asset('scouting-preview.png')}" alt="MECO TEAM 8324 QRScout match form with autonomous, teleop, and endgame scouting fields"><figcaption><strong>QRScout</strong><span>Match observations are transferred to FieldScout for analysis.</span></figcaption></figure>`;
 if(p.id==='mission') return `<figure class="software-preview"><img src="${asset('mission-preview.png')}" alt="Mission Control prototype showing task details over its team dashboard, with demo data"><figcaption><strong>Mission Control</strong><span>Prototype task details and team dashboard · Demo data.</span></figcaption></figure>`;
 return `<div class="note-photo-stage"><img class="note-photo" src="${asset('16th-note-4k.png')}" width="3840" height="3280" alt="La Petit Fromage, the small tank-drive robot with a red 9924 bumper, in the team workshop"></div><div class="photo-caption">La Petit Fromage <span>TANK-DRIVE ROBOT</span></div>`;
}
let transitionCleanup;
function changeSlide(index, direction = 1) {
 const next = (index + projects.length) % projects.length;
 if(next === selected) return;
 const viewport = document.querySelector('.carousel-viewport');
 const current = viewport.querySelector('.feature-slide:not(.outgoing)');
 clearTimeout(transitionCleanup);
 viewport.querySelector('.outgoing')?.remove();
 current.classList.remove('slide-enter');
 const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(!reduceMotion) {
  const outgoing = current.cloneNode(true);
  outgoing.removeAttribute('id');
  outgoing.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  outgoing.classList.add('outgoing');
  outgoing.setAttribute('aria-hidden', 'true');
  outgoing.setAttribute('inert', '');
  outgoing.style.setProperty('--accent', projects[selected].color);
  viewport.append(outgoing);
  viewport.style.setProperty('--slide-direction', direction);
 }
 selected = next;
 renderFeature();
 if(!reduceMotion) {
  void current.offsetWidth;
  current.classList.add('slide-enter');
  transitionCleanup = setTimeout(() => {
   viewport.querySelector('.outgoing')?.remove();
   current.classList.remove('slide-enter');
  }, 650);
 }
}
function renderFeature() {
 const p=projects[selected];
 document.querySelector('.featured').style.setProperty('--accent',p.color);
 document.querySelector('#feature-copy').innerHTML=`<p class="eyebrow"><span class="feature-number">${String(selected+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span> ${p.label}</p><h2>${p.title}</h2><p>${p.simple}</p><div class="feature-actions"><button class="button primary" data-open="${p.id}">Explore project <span aria-hidden="true">→</span></button>${external(github+p.repo,'View code','text-link')}</div>${p.websites?.length?`<div class="feature-websites">${websiteLinks(p,'text-link')}</div>`:''}<div class="feature-tags">${p.language}</div>`;
 document.querySelector('#feature-visual').innerHTML=visual(p);
 const dots = document.querySelector('#slide-dots');
 if(!dots.children.length) dots.innerHTML=projects.map((p,i)=>`<button data-slide="${i}" class="slide-dot" aria-label="Feature ${p.name}"><span>${p.shortName}</span></button>`).join('');
 dots.querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',selected===i);button.setAttribute('aria-pressed',String(selected===i));});
 document.querySelector('.feature-slide:not(.outgoing)').setAttribute('aria-label', `${selected+1} of ${projects.length}: ${p.name}`);
}
const previews = {
 remy: ['remy.jpg', 'Remy competition robot'],
 scouting: ['scouting-preview.png', 'QRScout match recording screen'],
 note: ['16th-note-4k.png', 'La Petit Fromage development robot'],
 mission: ['mission-preview.png', 'Mission Control task details'],
 auto: ['autodrive-preview.png', 'AutoDrive robot simulation on the REBUILT field'],
};
function preview(p) {
 const [file, description] = previews[p.id];
 return `<button class="project-preview preview-${p.id}" data-open="${p.id}" aria-label="Explore ${p.name}"><img src="${asset(file)}" alt="${description}" loading="lazy" width="320" height="200"></button>`;
}
function renderCards() {
 const visible=projects.filter(p=>category==='All projects'||p.category===category);
 document.querySelector('#project-count').textContent=`${visible.length} project${visible.length===1?'':'s'}`;
 document.querySelector('#project-grid').innerHTML=visible.map(p=>`<article class="project-card">${preview(p)}<div class="project-summary"><span class="card-category">${p.category}${p.id==='mission'?' · Prototype':''}</span><h3><button class="card-explore" data-open="${p.id}">${p.name}</button></h3><p>${p.hook}</p><span class="project-language">${p.language}</span></div><div class="project-links">${external(github+p.repo,'Source code','repository-link')}${websiteLinks(p,'directory-link')}<button class="directory-details" data-open="${p.id}">Details and activity <span aria-hidden="true">→</span></button></div></article>`).join('');
}
function demo(p) {
 if(p.steps) return `<div class="sequence"><div class="sequence-slots" id="sequence-slots"><span>1. ?</span><span>2. ?</span><span>3. ?</span></div><div class="demo-buttons">${['Shoot','Collect','Aim'].map(s=>`<button class="button outline" data-step="${s}">${s}</button>`).join('')}<button class="button subtle" id="undo-sequence" disabled>Undo</button><button class="button subtle" id="reset-sequence">Reset</button></div><p id="demo-feedback" role="status">Select the actions in the order the robot should perform them.</p></div>`;
 if(p.id==='scouting') return `<div class="scouting-demo"><span class="mono">Practice match · Team 8324</span><p>Imagine watching a match. Each time the robot scores a game piece, add one to your record.</p><div class="counter"><button class="icon-button" id="minus-score" aria-label="Remove a scored game piece" disabled>−</button><output id="score" aria-live="polite">0</output><button class="icon-button" id="plus-score" aria-label="Add a scored game piece">+</button></div><p>Game pieces scored</p><p>Use + to record one and − to correct a mistake. Scouts combine records like this to compare teams across matches.</p><button class="button subtle" id="reset-score">Reset practice match</button></div>`;
 if(p.id==='mission') return `<div class="checklist">${['Charge the battery','Test the intake','Review the robot’s planned route'].map(t=>`<label><input type="checkbox"><span>${t}</span></label>`).join('')}<p id="ready-status" role="status">0 of 3 example checks complete.</p></div>`;
 return `${fieldMarkup(true)}<div class="demo-buttons"><button class="button outline" data-route="collect">Collect game pieces</button><button class="button outline" data-route="score">Go to the goal</button><button class="button subtle" data-route="reset">Reset route</button></div><p id="route-status" role="status">Choose a destination and watch the robot take a route around the obstacle. The yellow dots represent game pieces.</p>`;
}
let activeProject;
function openProject(id) {
 activeProject=projects.find(p=>p.id===id); technical=false; sequence=[];scores=0;renderDialog();dialog.showModal();
}
function explanationMarkup(p) {
 if(!technical) return `<p>${p.simple}</p><p class="project-purpose">${p.purpose}</p>`;
 return `<p>${p.technical}</p><dl class="engineering-notes">${p.engineering.map(([title,body])=>`<div><dt>${title}</dt><dd>${body}</dd></div>`).join('')}</dl><p class="project-limitation">${p.limitation}</p><div class="evidence-links"><h3>Read the engineering notes</h3>${p.evidence.map(([label,url])=>external(url,label,'text-link')).join('')}</div>`;
}
function renderDialog(){const p=activeProject;document.querySelector('#dialog-body').innerHTML=`<p class="eyebrow">${p.label}</p><h2 id="dialog-title">${p.name}</h2><div class="reading-tabs" role="group" aria-label="Explanation level"><button data-level="simple" aria-pressed="${!technical}" class="${!technical?'active':''}">Overview</button><button data-level="technical" aria-pressed="${technical}" class="${technical?'active':''}">Engineering</button></div><section class="explanation" aria-label="Project explanation">${explanationMarkup(p)}</section><details class="activity"><summary>Try an activity <span>About 30 seconds</span></summary><section class="demo-panel"><h3>${p.challenge}</h3>${demo(p)}<p class="dialog-footnote">A browser example, not a connection to the robot or team software.</p></section></details><div class="dialog-links">${external(github+p.repo,'Source code on GitHub','button primary')}${websiteLinks(p,'text-link')}</div>${p.id==='auto'?'<p class="network-note">The training monitor opens only on the team network. Select Engineering for public documentation that is available to everyone.</p>':''}${p.related.length?`<details class="related-repos"><summary>Related repositories (${p.related.length})</summary><div>${p.related.map(r=>external(github+r,r,'related-link')).join('')}</div></details>`:''}`;}
app.addEventListener('click', async e=>{
 const open=e.target.closest('[data-open]');if(open){openProject(open.dataset.open);return;}
 const slide=e.target.closest('[data-slide]');if(slide){const index=Number(slide.dataset.slide);changeSlide(index,index<selected?-1:1);return;}
 const direction=e.target.closest('[data-direction]');if(direction){const step=Number(direction.dataset.direction);changeSlide(selected+step,step);return;}
 const filter=e.target.closest('[data-filter]');if(filter){category=filter.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',String(b===filter));});renderCards();return;}
 const level=e.target.closest('[data-level]');if(level){technical=level.dataset.level==='technical';document.querySelector('.explanation').innerHTML=explanationMarkup(activeProject);document.querySelectorAll('[data-level]').forEach(b=>{b.classList.toggle('active',b===level);b.setAttribute('aria-pressed',String(b===level));});return;}
 const step=e.target.closest('[data-step]');if(step&&sequence.length<3){sequence.push(step.dataset.step);renderSequence();return;}
 const route=e.target.closest('[data-route]');if(route){const f=dialog.querySelector('.field');f.classList.remove('collecting','scoring');void f.offsetWidth; if(route.dataset.route!=='reset')f.classList.add(route.dataset.route==='collect'?'collecting':'scoring');document.querySelector('#route-status').textContent=route.dataset.route==='reset'?'Choose a new destination.':route.dataset.route==='collect'?'The robot is following the lower route to collect game pieces. This example uses a fixed route; AutoDrive calculates routes from the field state.':'The robot is going around the obstacle to reach the goal. This example shows the route-following idea, not the training engine.';return;}
 const button=e.target.closest('button');if(!button)return;
 switch(button.id){
 case 'close-dialog':dialog.close();break;
 case 'reset-sequence':sequence=[];renderSequence();break;
 case 'undo-sequence':sequence.pop();renderSequence();break;
 case 'plus-score':scores=Math.min(999,scores+1);renderScore();break;
 case 'minus-score':scores=Math.max(0,scores-1);renderScore();break;
 case 'reset-score':scores=0;renderScore();break;
 case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#announcement').textContent='Full screen is unavailable in this browser. Use your browser’s full-screen menu.';}break;
 }
});
function renderSequence(){document.querySelector('#sequence-slots').innerHTML=[0,1,2].map((i)=>`<span class="${sequence[i]?'filled':''}">${i+1}. ${sequence[i]||'?'}</span>`).join('');const stepHadFocus=document.activeElement?.hasAttribute('data-step');const result=sequenceFeedback(sequence);document.querySelector('#demo-feedback').textContent=result==='success'?'Correct: collect, aim, and then shoot. The robot needs a game piece and a direction before it can score.':result==='retry'?'Collect a game piece before aiming and shooting. Use Undo to change your last step, or Reset to start again.':sequence.length===0?'Select the actions in the order the robot should perform them.':sequence[0]==='Collect'?'The robot has a game piece. What should happen before it shoots?':'The robot needs to collect a game piece first. Use Undo to change the last step.';dialog.querySelectorAll('[data-step]').forEach(b=>b.disabled=sequence.length===3);document.querySelector('#undo-sequence').disabled=sequence.length===0;if(sequence.length===3&&stepHadFocus)document.querySelector('#undo-sequence').focus();}
function renderScore(){document.querySelector('#score').value=scores;document.querySelector('#minus-score').disabled=scores===0;document.querySelector('#plus-score').disabled=scores===999;}
dialog.addEventListener('change',()=>{const checked=dialog.querySelectorAll('input:checked').length;const status=document.querySelector('#ready-status');if(status)status.textContent=checked===3?'All 3 example checks are complete. A real checklist helps the team spot unfinished work before a match.':`${checked} of 3 example checks complete.`;});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.addEventListener('fullscreenchange',()=>{document.querySelector('#fullscreen span').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
document.addEventListener('keydown',e=>{if(dialog.open||/INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const direction=e.key==='ArrowRight'?1:-1;changeSlide(selected+direction,direction);}});
let touchStart;
const carouselViewport = document.querySelector('.carousel-viewport');
carouselViewport.addEventListener('touchstart', e=>{const touch=e.changedTouches[0];touchStart={x:touch.clientX,y:touch.clientY};},{passive:true});
carouselViewport.addEventListener('touchend', e=>{
 if(!touchStart)return;
 const touch=e.changedTouches[0], dx=touch.clientX-touchStart.x, dy=touch.clientY-touchStart.y;
 touchStart=undefined;
 if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5){const direction=dx<0?1:-1;changeSlide(selected+direction,direction);}
},{passive:true});
carouselViewport.addEventListener('touchcancel',()=>{touchStart=undefined;},{passive:true});
let wheelDistance = 0, wheelLocked = false, wheelReset;
carouselViewport.addEventListener('wheel', e => {
 if(Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.ctrlKey) return;
 e.preventDefault();
 clearTimeout(wheelReset);
 wheelReset = setTimeout(() => { wheelDistance = 0; wheelLocked = false; }, 180);
 if(wheelLocked) return;
 const delta = e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? carouselViewport.clientWidth : 1);
 if(Math.sign(delta) !== Math.sign(wheelDistance)) wheelDistance = 0;
 wheelDistance += delta;
 if(Math.abs(wheelDistance) >= 60) {
  const direction = wheelDistance > 0 ? 1 : -1;
  changeSlide(selected + direction, direction);
  wheelLocked = true;
 }
}, { passive: false });
renderFeature();renderCards();
