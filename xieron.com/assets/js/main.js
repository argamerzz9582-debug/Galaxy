// Clean-room clone JS — written from REA spec.
document.querySelector('.burger')?.addEventListener('click',()=>document.querySelector('nav.links')?.classList.toggle('open'));
// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// Count-up stats (observed: values render at 0, inferred count-up)
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
  const end=+e.target.dataset.count,suf=e.target.dataset.suffix||'';let t0=null;
  const step=t=>{t0??=t;const p=Math.min((t-t0)/1400,1);e.target.textContent=Math.round(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step)}),{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
// Features tabs
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  const cat=tab.dataset.cat;
  document.querySelectorAll('[data-cat-card]').forEach(c=>c.style.display=(cat==='all'||c.dataset.catCard===cat)?'':'none');
}));
// Support ticket form (client-side only, per spec)
const form=document.getElementById('ticketForm');
form?.addEventListener('submit',e=>{e.preventDefault();
  if(!form.checkValidity()){form.reportValidity();return}
  document.getElementById('ticketSuccess').style.display='block';form.reset();
  document.getElementById('ticketSuccess').scrollIntoView({behavior:'smooth',block:'center'});
});
// Features terminal typing loop
const lines=[["$ &antinuke enable",""],["SECURITY ","Anti-Nuke Engine Active — Monitoring Discord Gateway events","ok"],["ALERT ","Unauthorized channel deletion attempt caught from user ID #8192","al"],["ACTION ","Offender banned instantly via Anti-Nuke. Channel restored via snapshot.","ac"],["✔ ","Module synced across cluster gateway","ok"]];
const term=document.getElementById('termBody');
if(term){let li=0;const type=()=>{if(li>=lines.length){setTimeout(()=>{term.innerHTML='';li=0;type()},4200);return}
  const[label,text,cls]=lines[li];const row=document.createElement('div');if(cls)row.className=cls;
  row.innerHTML=`<span>${label}</span><span class="typed"></span>`;term.appendChild(row);const slot=row.querySelector('.typed');let i=0;
  const tick=()=>{slot.textContent=text.slice(0,++i);if(i<text.length)setTimeout(tick,14);else{li++;setTimeout(type,380)}};tick()};type()}
