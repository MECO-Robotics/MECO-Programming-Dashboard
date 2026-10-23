import './style.css';
import { projects, github, nextProject, sequenceFeedback } from './projects.js';
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const external = (url, text, cls = '') => `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">${text}<span aria-hidden="true">↗</span></a>`;
const websiteLinks = (project, cls = 'button outline') => (project.websites || []).map(site => external(site.url, site.label, cls)).join('');
const SHOWCASE_SECONDS = 10;
let selected = 0, category = 'All projects', technical = false, touring = false, timer, remaining = SHOWCASE_SECONDS, sequence = [], scores = 0;
const app = document.querySelector('#app');
app.innerHTML = `
<a class="skip-link" href="#projects">Skip to projects</a>
<header><a class="brand" href="#" aria-label="MECO Robotics home"><img src="${asset('meco-logo.svg')}" alt="MECO Robotics"><span class="brand-divider"></span><span class="brand-caption">FRC TEAM <strong>8324</strong></span></a><nav aria-label="Main navigation"><a class="nav-active" href="#projects">Our projects</a><button id="fullscreen" class="button subtle">⛶ <span>Full screen</span></button></nav></header>
<main><section class="intro"><div><p class="eyebrow">MECO Robotics · FRC 8324</p><h1>Programming projects</h1><p class="intro-copy">Robot code, scouting tools, and team software.</p></div><a class="intro-aside team-website-link" href="https://www.mecorobotics.org/" target="_blank" rel="noopener noreferrer">East Orlando, Florida<span>Team website ↗</span></a></section>
<section class="featured" aria-label="Project carousel" aria-roledescription="carousel"><div class="carousel-viewport"><div class="feature-slide" role="group" aria-roledescription="slide"><div class="feature-copy" id="feature-copy"></div><div class="feature-visual" id="feature-visual"></div></div></div><div class="feature-bottom"><div class="carousel-navigation"><button class="carousel-arrow" data-direction="-1" aria-label="Previous project">←</button><div id="slide-dots" class="slide-dots" aria-label="Choose featured project"></div><button class="carousel-arrow" data-direction="1" aria-label="Next project">→</button></div><div class="tour-tools"><span id="tour-status" class="mono">10-second slides</span><button id="tour" class="button subtle">Start slideshow</button></div></div></section>
<section id="projects" class="projects"><div class="section-heading"><div><h2>All projects</h2></div><p>Details, source code, and project websites.</p></div><div class="project-toolbar"><div class="filters" role="group" aria-label="Filter projects">${['All projects','Robots','Team tools','Autonomy'].map((c,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${c}" aria-pressed="${i===0}">${c}</button>`).join('')}</div><span class="mono" id="project-count">5 projects</span></div><div class="project-grid" id="project-grid"></div></section>
</main>
<footer><span>MECO Robotics · Team 8324</span><div>${external(github, 'GitHub')}${external('https://www.mecorobotics.org/', 'mecorobotics.org')}</div></footer>
<dialog id="project-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span class="eyebrow">Project details</span><button id="close-dialog" class="icon-button" aria-label="Close project">✕</button></div><div id="dialog-body"></div></dialog><p id="announcement" class="sr-only" role="status"></p>`;
const dialog = document.querySelector('dialog');
function fieldMarkup(interactive=false) { return `<div class="field ${interactive?'interactive-field':''}"><div class="field-line"></div><div class="field-goal">HUB</div><svg class="route" viewBox="0 0 500 260" preserveAspectRatio="none" aria-hidden="true"><path d="M 70 210 L 185 210 L 185 85 L 370 85"/></svg><span class="field-bot">8324</span><span class="fuel fuel-one"></span><span class="fuel fuel-two"></span><span class="fuel fuel-three"></span><span class="field-caption">ILLUSTRATIVE FIELD</span></div>`; }
function visual(p) {
 if(p.id==='remy') return `<img class="robot-photo" src="${asset('remy.jpg')}" alt="Remy, MECO’s blue-bumpered 8324 competition robot, lit in blue and red"><div class="photo-caption"> REMY <span>2026 / REBUILT</span></div>`;
 if(p.id==='auto') return `<div class="visual-demo"><p class="mono">Route planning</p>${fieldMarkup()}<span class="visual-note">Example route around an obstacle.</span></div>`;
 if(p.id==='scouting') return `<div class="visual-demo"><p class="mono">Scouting data</p><div class="chart"><div style="--height:45%"><span>12</span></div><div style="--height:70%"><span>20</span></div><div style="--height:95%"><span>28</span></div><div style="--height:60%"><span>17</span></div></div><span class="visual-note">Game pieces scored in four sample matches. <small>Illustrative data</small></span></div>`;
 if(p.id==='mission') return `<div class="visual-demo"><p class="mono">Build tasks</p><div class="mini-board"><div>TO DO<span>Check the battery</span><span>Pack the toolbox</span></div><div>IN PROGRESS<span>Test the intake</span></div><div>READY<span>✓ Review the code</span></div></div><span class="visual-note">Sample task board <small>Illustrative data</small></span></div>`;
 return `<div class="note-photo-stage"><img class="note-photo" src="${asset('16th-note-4k.png')}" width="3840" height="3280" alt="la Petit Fromage, the small tank-drive robot with a red 9924 bumper, in the team workshop"></div><div class="photo-caption">la Petit Fromage <span>TANK-DRIVE ROBOT</span></div>`;
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
 remaining = SHOWCASE_SECONDS;
 renderFeature();
 if(!reduceMotion) {
  void current.offsetWidth;
  current.classList.add('slide-enter');
  transitionCleanup = setTimeout(() => {
   viewport.querySelector('.outgoing')?.remove();
   current.classList.remove('slide-enter');
  }, 650);
 }
 if(touring)updateTourStatus();
}
function renderFeature() {
 const p=projects[selected];
 document.querySelector('.featured').style.setProperty('--accent',p.color);
 document.querySelector('#feature-copy').innerHTML=`<p class="eyebrow"><span class="feature-number">0${selected+1} / 05</span> ${p.label}</p><h2>${p.title}</h2><p>${p.simple}</p><div class="feature-actions"><button class="button primary" data-open="${p.id}">Project details <span>→</span></button>${external(github+p.repo,'View code','text-link')}</div>${p.websites?.length?`<div class="feature-websites">${websiteLinks(p)}</div>`:''}<div class="feature-tags"><span class="language-dot"></span>${p.language}<span>GitHub</span></div>`;
 document.querySelector('#feature-visual').innerHTML=visual(p);
 const dots = document.querySelector('#slide-dots');
 if(!dots.children.length) dots.innerHTML=projects.map((p,i)=>`<button data-slide="${i}" class="slide-dot" aria-label="Feature ${p.name}"><span></span></button>`).join('');
 dots.querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',selected===i);button.setAttribute('aria-pressed',String(selected===i));});
 document.querySelector('.feature-slide:not(.outgoing)').setAttribute('aria-label', `${selected+1} of ${projects.length}: ${p.name}`);
}
function renderCards() {
 const visible=projects.filter(p=>category==='All projects'||p.category===category);
 document.querySelector('#project-count').textContent=`${visible.length} project${visible.length===1?'':'s'}`;
 document.querySelector('#project-grid').innerHTML=visible.map(p=>`<article class="project-card" style="--accent:${p.color}"><button class="card-explore" data-open="${p.id}"><span class="card-category">${p.category}${p.id==='mission'?' · Prototype':''}</span><h3>${p.name}</h3><p>${p.hook}</p><span class="card-bottom">${p.language}<span>Details →</span></span></button>${p.websites?.length?`<div class="card-websites">${websiteLinks(p,'button card-website')}</div>`:''}</article>`).join('');
}
function stopTour() { document.body.classList.remove('showcase-mode'); touring=false; clearInterval(timer); document.querySelector('#tour').textContent='Start slideshow'; document.querySelector('#tour').setAttribute('aria-pressed','false'); document.querySelector('#tour-status').textContent='10-second slides'; }
function startTour() { document.body.classList.add('showcase-mode'); window.scrollTo(0,0); touring=true; remaining=SHOWCASE_SECONDS; document.querySelector('#tour').textContent='Stop slideshow'; document.querySelector('#tour').setAttribute('aria-pressed','true'); updateTourStatus(); timer=setInterval(()=>{if(document.hidden || document.querySelector('.carousel-viewport').contains(document.activeElement))return;remaining--;if(remaining<=0){changeSlide(nextProject(selected),1);}updateTourStatus();},1000); }
function updateTourStatus(){document.querySelector('#tour-status').textContent=`${selected+1} / ${projects.length} · Next in ${remaining}s`;}
function demo(p) {
 if(p.steps) return `<div class="sequence"><div class="sequence-slots" id="sequence-slots"><span>1. ?</span><span>2. ?</span><span>3. ?</span></div><div class="demo-buttons">${['Shoot','Collect','Aim'].map(s=>`<button class="button outline" data-step="${s}">${s}</button>`).join('')}<button class="button subtle" id="reset-sequence">Reset</button></div><p id="demo-feedback" role="status">Tap the actions in the order the robot should do them.</p></div>`;
 if(p.id==='scouting') return `<div class="scouting-demo"><span class="mono">PRACTICE MATCH · SCORED GAME PIECES</span><div class="counter"><button class="icon-button" id="minus-score" aria-label="Remove a scored game piece" disabled>−</button><output id="score" aria-live="polite">0</output><button class="icon-button" id="plus-score" aria-label="Add a scored game piece">+</button></div><p>Use + to record a score and − to correct the count.</p><button class="button subtle" id="reset-score">Reset practice match</button></div>`;
 if(p.id==='mission') return `<div class="checklist">${['Charge the battery','Test the intake','Review the autonomous plan'].map(t=>`<label><input type="checkbox"><span>${t}</span></label>`).join('')}<p id="ready-status" role="status">0 / 3 checks complete.</p></div>`;
 return `${fieldMarkup(true)}<div class="demo-buttons"><button class="button outline" data-route="collect">Collect fuel</button><button class="button outline" data-route="score">Go to the hub</button><button class="button subtle" data-route="reset">Reset route</button></div><p id="route-status" role="status">Pick a destination. The robot follows a pre-drawn route around the center.</p>`;
}
let activeProject;
function openProject(id) {
 stopTour(); activeProject=projects.find(p=>p.id===id); technical=false; sequence=[];scores=0;renderDialog();dialog.showModal();
}
function renderDialog(){const p=activeProject;document.querySelector('#dialog-body').innerHTML=`<p class="eyebrow" style="color:${p.color}">${p.label}</p><h2 id="dialog-title">${p.name}</h2><p class="dialog-hook">${p.hook}</p><div class="reading-tabs" role="group" aria-label="Explanation level"><button data-level="simple" aria-pressed="${!technical}" class="${!technical?'active':''}">Overview</button><button data-level="technical" aria-pressed="${technical}" class="${technical?'active':''}">Technical details</button></div><p class="explanation">${technical?p.technical:p.simple}</p><section class="demo-panel"><span class="eyebrow">Interactive example</span><h3>${p.challenge}</h3>${demo(p)}</section><div class="dialog-links">${external(github+p.repo,'View source code','button primary')}${websiteLinks(p)}${p.related.map(r=>external(github+r,r,'related-link')).join('')}</div><p class="dialog-footnote">This example runs in your browser and is not connected to a robot.</p>`;}
app.addEventListener('click', async e=>{
 if(e.target.closest('a[href="#projects"], a.brand'))stopTour();
 const open=e.target.closest('[data-open]');if(open){openProject(open.dataset.open);return;}
 const slide=e.target.closest('[data-slide]');if(slide){const index=Number(slide.dataset.slide);changeSlide(index,index<selected?-1:1);return;}
 const direction=e.target.closest('[data-direction]');if(direction){const step=Number(direction.dataset.direction);changeSlide(selected+step,step);return;}
 const filter=e.target.closest('[data-filter]');if(filter){category=filter.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',String(b===filter));});renderCards();return;}
 const level=e.target.closest('[data-level]');if(level){technical=level.dataset.level==='technical';document.querySelector('.explanation').textContent=technical?activeProject.technical:activeProject.simple;document.querySelectorAll('[data-level]').forEach(b=>{b.classList.toggle('active',b===level);b.setAttribute('aria-pressed',String(b===level));});return;}
 const step=e.target.closest('[data-step]');if(step&&sequence.length<3){sequence.push(step.dataset.step);renderSequence();return;}
 const route=e.target.closest('[data-route]');if(route){const f=dialog.querySelector('.field');f.classList.remove('collecting','scoring');void f.offsetWidth; if(route.dataset.route!=='reset')f.classList.add(route.dataset.route==='collect'?'collecting':'scoring');document.querySelector('#route-status').textContent=route.dataset.route==='reset'?'Choose a new destination.':route.dataset.route==='collect'?'Following a route to the fuel. Real planning software calculates routes from the field state.':'Following a route toward the hub. This is a route illustration, not a live robot.';return;}
 const button=e.target.closest('button');if(!button)return;
 switch(button.id){
 case 'tour':touring?stopTour():startTour();break;
 case 'close-dialog':dialog.close();break;
 case 'reset-sequence':sequence=[];renderSequence();break;
 case 'plus-score':scores=Math.min(999,scores+1);renderScore();break;
 case 'minus-score':scores=Math.max(0,scores-1);renderScore();break;
 case 'reset-score':scores=0;renderScore();break;
 case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#announcement').textContent='Full screen is unavailable in this browser. Use your browser’s full-screen menu.';}break;
 }
});
function renderSequence(){document.querySelector('#sequence-slots').innerHTML=[0,1,2].map((i)=>`<span class="${sequence[i]?'filled':''}">${i+1}. ${sequence[i]||'?'}</span>`).join('');const result=sequenceFeedback(sequence);document.querySelector('#demo-feedback').textContent=result==='success'?'Correct: collect, aim, then shoot.':result==='retry'?'Collect a game piece before aiming and shooting. Reset to try again.':'What should happen next?';dialog.querySelectorAll('[data-step]').forEach(b=>b.disabled=sequence.length===3);}
function renderScore(){document.querySelector('#score').value=scores;document.querySelector('#minus-score').disabled=scores===0;document.querySelector('#plus-score').disabled=scores===999;}
dialog.addEventListener('change',()=>{const checked=dialog.querySelectorAll('input:checked').length;const status=document.querySelector('#ready-status');if(status)status.textContent=checked===3?'3 / 3 checks complete. Practice robot ready!':`${checked} / 3 checks complete.`;});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.addEventListener('fullscreenchange',()=>{document.querySelector('#fullscreen span').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopTour();if(dialog.open||/INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const direction=e.key==='ArrowRight'?1:-1;changeSlide(selected+direction,direction);}});
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
renderFeature();renderCards();document.querySelector('#tour').setAttribute('aria-pressed','false');
