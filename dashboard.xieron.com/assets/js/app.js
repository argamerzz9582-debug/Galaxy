// Dashboard clone demo JS — clean-room, sample data only, localStorage persistence.
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const servers={"guild-1":{name:"Demo Community",members:"24,569 members"},"guild-2":{name:"Gaming Lounge",members:"12,287 members"},"guild-3":{name:"Study Hub",members:"8,104 members"}};
// Module nav + hash routing
function show(id){$$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));$$('aside [data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));location.hash=id}
$$('aside [data-panel]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.panel)));
if(location.hash) show(location.hash.slice(1));
// Server switcher
$('#serverSelect')?.addEventListener('change',e=>{const s=servers[e.target.value];$('#serverName').textContent=s.name;$('#serverMeta').textContent=s.members+' · Clone demo data';toast('Switched to '+s.name)});
// Persist toggles/ranges/selects
$$('[data-save]').forEach(el=>{const k='xieron-'+el.dataset.save,v=localStorage.getItem(k);
  if(v!==null){el.type==='checkbox'?el.checked=v==='1':el.value=v}
  el.addEventListener('change',()=>{localStorage.setItem(k,el.type==='checkbox'?(el.checked?'1':'0'):el.value);
    if(el.dataset.out) document.getElementById(el.dataset.out).textContent=el.value; toast('Saved (demo, stored locally)')});
  if(el.dataset.out) document.getElementById(el.dataset.out).textContent=el.value;});
// Whitelist
const wl=$('#whitelist'); let users=JSON.parse(localStorage.getItem('xieron-wl')||'["8192038471","5529103847"]');
function renderWl(){if(!wl)return;wl.innerHTML=users.map((u,i)=>`<div class="row"><span class="avatar">${u.slice(0,1)}</span><span class="grow mono">User ID #${u}</span><button class="btn ghost" style="padding:6px 14px" onclick="removeWl(${i})">Remove</button></div>`).join('')||'<p class="sub">No whitelisted users.</p>'}
window.removeWl=i=>{users.splice(i,1);localStorage.setItem('xieron-wl',JSON.stringify(users));renderWl()};
$('#addWl')?.addEventListener('click',()=>{const v=$('#wlInput').value.trim();if(!/^\d{4,}$/.test(v))return toast('Enter a numeric user ID');users.push(v);localStorage.setItem('xieron-wl',JSON.stringify(users));$('#wlInput').value='';renderWl()});
renderWl();
// Audit log simulation
const events=[["Channel Delete Blocked","RogueAdmin","Instant Ban + Restore"],["Mass Ping Filtered","SpamBot99","Message Deleted"],["Night Mode Engaged","System","Channels Locked"],["Ticket Created","Member#421","#ticket-0421"],["VoiceMaster Room Created","Member#087","Room Spawned"]];
function addEvent(e){const tb=$('#logBody');if(!tb)return;const tr=document.createElement('tr');
  tr.innerHTML=`<td>${new Date().toLocaleTimeString()}</td><td>${e[0]}</td><td>${e[1]}</td><td><span class="pill ${e[2].includes('Ban')?'red':''}">${e[2]}</span></td>`;tb.prepend(tr)}
$('#search')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('#logBody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none')});
if($('#logBody')){events.forEach(addEvent);setInterval(()=>addEvent(events[Math.floor(Math.random()*events.length)]),8000)}
// Toast
let tt;function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}
$('#saveSettings')?.addEventListener('click',()=>toast('✅ Settings saved (demo)'));
$('#logout')?.addEventListener('click',()=>location.href='login.html');
