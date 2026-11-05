const URL='https://lrwnhpdkaplrwisiyroo.supabase.co',KEY='sb_publishable_7YNCgBUfRdCxqrKMbO7Q2g_bx6r8hFl';
const sb=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'KES '+Number(n||0).toLocaleString('en-KE');
let user=null,profile=null,packages=[],tasks=[],claims=[],subs=[],withdrawals=[],payments=[],tab='tasks';
async function request(table,select='*',query=x=>x){const r=await query(sb.from(table).select(select));if(r.error)throw r.error;return r.data||[]}
async function load(){const {data:{user:u}}=await sb.auth.getUser();user=u;profile=null;if(u){const p=await request('profiles','*',x=>x.eq('id',u.id));profile=p[0]||null;}packages=await request('packages','*',x=>x.order('fee',{ascending:true}));tasks=await request('tasks','*',x=>x.eq('status','open').order('created_at',{ascending:false}));if(user&&profile?.role==='learner'){claims=await request('claims','*',x=>x.eq('learner_id',user.id));subs=await request('submissions','*',x=>x.eq('learner_id',user.id));withdrawals=await request('withdrawals','*',x=>x.eq('learner_id',user.id));payments=await request('payments','*',x=>x.eq('learner_id',user.id));}drawLanding();route()}
function pkg(id){return packages.find(x=>x.id===id)||packages[0]||{name:'Starter',rate:0,tasks_per_day:0,fee:0}}
function drawLanding(){
 const cards=$('#pkGrid');if(!cards)return;
 cards.innerHTML=packages.map(p=>`<article class="card"><p class="eyebrow">${esc(p.name)} practice tier</p><h3>${esc(p.name)} · ${money(p.fee)} tier</h3><div class="price">${p.id==='starter'?'8':p.id==='standard'?'10':'15'}<small>practice projects</small></div><dl><div class="r"><dt>Daily claim limit</dt><dd>${p.tasks_per_day}</dd></div><div class="r"><dt>Access</dt><dd>${p.id==='starter'?'Included on signup':'Administrator-assigned'}</dd></div><div class="r"><dt>Project amounts</dt><dd>Illustrative only</dd></div></dl><button class="btn btn-primary" data-auth="register">Create free account</button></article>`).join('');
}
function auth(mode='login'){
 const reg=mode==='register';$('#auth').hidden=false;$('#regForm').hidden=!reg;$('#loginForm').hidden=reg;
 $('#authTitle').textContent=reg?'Create a free practice account':'Sign in';
 $('#tabReg').setAttribute('aria-selected',String(reg));$('#tabLog').setAttribute('aria-selected',String(!reg));
}
function route(){
 const member=location.hash==='#member';
 if(member&&(!user||profile?.role!=='learner')){location.hash='';if(!user)auth('login');return}
 $('#site').hidden=member;$('#member').hidden=!member;
 $('#hdrActions').innerHTML=user?`<a class="btn btn-ghost btn-sm" href="#member">Practice dashboard</a><button class="btn btn-primary btn-sm" data-action="logout">Log out</button>`:`<button class="btn btn-ghost btn-sm" data-auth="login">Log in</button><button class="btn btn-primary btn-sm" data-auth="register">Create account</button>`;
 if(member)drawMember();
}
function drawMember(){
 if(!profile)return;
 const current=pkg(profile.package_id||'starter'),active=profile.account_status==='active';
 if(!active){$('#memberRoot').innerHTML='<div class="panel"><h1>Account suspended</h1><p>'+esc(profile.suspension_reason||'Contact the administrator for details.')+'</p><button class="btn btn-ghost" data-action="logout">Log out</button></div>';return}
 const practice=tasks.filter(t=>t.is_demo);
 let content='';
 if(tab==='tasks')content='<p class="notice">Free practice assignments. All project amounts are illustrative; these assignments do not create earnings or withdrawals. Higher-tier access requires administrator approval, not payment.</p>'+
 practice.map(t=>{
 const level=pkg(t.tier),eligible=Number(level.fee)<=Number(current.fee),claimed=claims.some(c=>c.task_id===t.id);
 return `<article class="task"><div class="top2"><span class="topic">${esc(t.topic)}</span><span class="chip">${esc(level.name)} · ${money(level.fee)} tier</span></div><h3>${esc(t.title)}</h3><p>${esc(t.brief)}</p><div class="wc">${Number(t.words).toLocaleString()} words · Illustrative project amount: ${money(t.payout)}</div><div class="sub2">Practice only — no cash payout</div><button class="btn btn-primary btn-sm" data-claim="${t.id}" ${claimed?'disabled':''}>${claimed?'Already claimed':eligible?'Claim project':'View upgrade requirement'}</button></article>`}).join('');
 if(tab==='mine')content=claims.length?claims.map(c=>{
 const t=tasks.find(x=>x.id===c.task_id),submission=subs.find(x=>x.claim_id===c.id);
 return `<article class="task"><div class="top2"><span class="chip">${esc(pkg(t?.tier).name)} practice</span><span class="topic">${esc(c.status)}</span></div><h3>${esc(t?.title||'Practice assignment')}</h3><p>${esc(t?.brief||'')}</p><p class="sub2">${t?.words||0} words minimum · non-payable practice</p>${c.status==='claimed'?`<textarea id="text-${c.id}" rows="10" placeholder="Draft your assignment here"></textarea><button class="btn btn-primary" data-submit="${c.id}">Submit for admin review</button>`:`<p>Submission: ${esc(submission?.status||'Processing')} · Word count: ${submission?.word_count||0}</p><p>${esc(submission?.review_note||'Waiting for administrator feedback.')}</p>`}</article>`}).join(''):'<div class="empty">No projects claimed yet. Select a project from the Tasks tab.</div>';
 if(tab==='acct')content=`<div class="acct sum"><dl><div class="r"><dt>Email</dt><dd>${esc(user.email)}</dd></div><div class="r"><dt>Tier</dt><dd>${esc(current.name)} (${money(current.fee)})</dd></div><div class="r"><dt>Access</dt><dd>Free practice — no registration payment required</dd></div></dl><p class="sub2">An administrator can assign a different practice tier through Supabase.</p></div>`;
 $('#memberRoot').innerHTML=`<div class="mhead"><div><p class="eyebrow">Free writing practice</p><h1>Hello, ${esc((profile.full_name||'Writer').split(' ')[0])}</h1></div><span class="chip pkchip">${esc(current.name)} tier</span></div><div class="tabs">${[['tasks','Projects'],['mine','My projects'],['acct','Account']].map(([k,v])=>`<button class="btn btn-ghost" data-tab="${k}" aria-selected="${k===tab}">${v}</button>`).join('')}</div><div class="work">${content}</div>`;
}
async function call(action,data){const {data:r,error}=await sb.functions.invoke('kalamu-ops',{body:{action,...data}});if(error){let detail;try{detail=await error.context?.json()}catch{}throw Error(detail?.error||error.message)}if(r?.error)throw Error(r.error);return r.data}
function notify(e){alert(e?.message||String(e))}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-auth],[data-mode],[data-action],[data-tab],[data-claim],[data-submit]');if(!el)return;try{if(el.dataset.auth){if(user&&profile?.role==='learner'&&el.dataset.auth==='register'){location.hash='member';return}auth(el.dataset.auth);return}if(el.dataset.mode){auth(el.dataset.mode);return}if(el.dataset.action==='check-approval'){await load();return}if(el.dataset.action==='logout'){await sb.auth.signOut();await load();location.hash='';return}if(el.dataset.tab){tab=el.dataset.tab;drawMember();return}if(el.dataset.claim){
 const chosen=tasks.find(t=>t.id===el.dataset.claim);if(!chosen)throw Error('Project not available');
 if(!user||!profile){auth('login');return}
 const own=pkg(profile.package_id||'starter'),required=pkg(chosen.tier);
 if(Number(required.fee)>Number(own.fee)){
   await call('upgrade_attempt',{task_id:chosen.id});
   alert('This practice project requires the '+required.name+' tier ('+money(required.fee)+'). Ask the administrator to assign the higher tier. No payment is required for this trial.');
   return;
 }
 await call('claim',{task_id:chosen.id});tab='mine';await load();return;
}if(el.dataset.submit){const id=el.dataset.submit;let content=$('#text-'+id).value;await call('submit',{claim_id:id,content,source_type:'pasted',file_path:null});await load();}}catch(err){notify(err)}});
$('#authClose').onclick=()=>$('#auth').hidden=true;$('#tabReg').onclick=()=>auth('register');$('#tabLog').onclick=()=>auth('login');
$('#regForm').addEventListener('submit',async e=>{e.preventDefault();$('#regErr').textContent='';try{
 const email=$('#rEmail').value.trim(),password=$('#rPass').value,full_name=$('#rName').value.trim(),phone=$('#rPhone').value.trim();
 if(!email||password.length<8||!full_name)throw Error('Enter your full name, email and a password of at least 8 characters');
 const response=await sb.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/',data:{full_name,phone}}});
 if(response.error)throw response.error;
 if(response.data.session){$('#auth').hidden=true;location.hash='member';await load();return}
 $('#auth').hidden=true;alert('Account created. Check your email to confirm your address, then sign in. No payment is required for practice.');
 location.hash='';
 }catch(err){$('#regErr').textContent=err.message}
});
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const r=await sb.auth.signInWithPassword({email:$('#lEmail').value.trim(),password:$('#lPass').value});if(r.error){$('#logErr').textContent=r.error.message;return}if(!r.data.user?.email_confirmed_at){await sb.auth.signOut();$('#logErr').textContent='Email not verified. Request a new confirmation email.';return}await load();if(profile?.account_status==='suspended'){const reason=profile.suspension_reason;await sb.auth.signOut();await load();$('#logErr').textContent='Account suspended: '+(reason||'Contact support');return}if(profile?.role!=='learner'){await sb.auth.signOut();await load();$('#logErr').textContent='Administrators must use the admin portal';return}$('#auth').hidden=true;location.hash='member'});

document.addEventListener('input',e=>{if(['calcTasks','calcWords'].includes(e.target.id))calc()});document.addEventListener('change',e=>{if(e.target.name==='cpk')calc()});window.addEventListener('hashchange',route);sb.auth.onAuthStateChange(()=>setTimeout(()=>load().catch(notify),0));load().catch(notify);

document.addEventListener('click',async e=>{if(e.target.id!=='resendConfirmation')return;const email=$('#lEmail')?.value.trim()||prompt('Enter your registration email');if(!email)return;try{const r=await sb.auth.resend({type:'signup',email,options:{emailRedirectTo:window.location.origin+'/'}});if(r.error)throw r.error;alert('Confirmation email requested. Check your inbox and spam.')}catch(err){alert(err.message)}});
