/* Loads saved content from the server and applies it to every page. Also applies the chosen colour theme. */
(function(){
var d=document,root=d.documentElement,base=((d.currentScript&&d.currentScript.src)||'').replace(/js\/site\.js.*$/,'');
root.classList.add('pending');
var T={charcoal:{n:'Charcoal Orange',bg:'#17181c',s:'#202228',s2:'#272a32',t:'#f3f1ee',m:'#a3a7b3',a:'#ff6b1a',b:'#2e7dff',a2:'#ff8340'},
midnight:{n:'Midnight Blue',bg:'#0b1220',s:'#131c30',s2:'#1a2540',t:'#eef3ff',m:'#9aa8c7',a:'#3da5ff',b:'#7c5cff',a2:'#6bbcff'},
slate:{n:'Slate Purple',bg:'#1a1822',s:'#231f2e',s2:'#2c2739',t:'#f2eefa',m:'#a9a3bd',a:'#a78bfa',b:'#f472b6',a2:'#c4b5fd'},
emerald:{n:'Emerald Dark',bg:'#0d1512',s:'#14211c',s2:'#1b2c25',t:'#eef7f2',m:'#9db3a8',a:'#10d98a',b:'#2dd4ff',a2:'#4ae8aa'}};
var ICONS={mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
phone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
sliders:'<path d="M5 4v16M12 4v16M19 4v16"/><circle cx="5" cy="14" r="2"/><circle cx="12" cy="8" r="2"/><circle cx="19" cy="15" r="2"/>',
calendar:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="m10 13 4 2-4 2z"/>',
film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'};
var CAT={yt:'YouTube Long Form',reel:'Short-Form Reels',cg:'Color Grading & Sound Design'};
function rgb(h){h=h.replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)}).join(',')}
function theme(id){var t=T[id]||T.charcoal,s=root.style;
 [['--bg',t.bg],['--surface',t.s],['--surface-2',t.s2],['--text',t.t],['--muted',t.m],['--orange',t.a],['--blue',t.b],['--a1b',t.a2],['--bg-rgb',rgb(t.bg)],['--surface-rgb',rgb(t.s)],['--a1-rgb',rgb(t.a)],['--a2-rgb',rgb(t.b)]].forEach(function(p){s.setProperty(p[0],p[1])});
 try{localStorage.setItem('siteTheme',id)}catch(e){}}
try{theme(localStorage.getItem('siteTheme')||'charcoal')}catch(e){}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function url(v){return /^(https?:|data:)/.test(v||'')?v:base+(v||'')}
function svg(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||ICONS.star)+'</svg>'}
var q=function(s){return d.querySelector(s)},qa=function(s){return [].slice.call(d.querySelectorAll(s))};
var waiting=[],isReady=false,S={T:T,ICONS:ICONS,CAT:CAT,theme:theme,esc:esc,slug:slug,base:base,C:null};
S.ready=function(fn){isReady?fn():waiting.push(fn)};
function finish(){isReady=true;window.__siteReady=true;root.classList.remove('pending');waiting.splice(0).forEach(function(f){try{f()}catch(e){console.error(e)}})}
function render(C){
 theme(C.theme);
 qa('[data-k]').forEach(function(e){var v=C.texts&&C.texts[e.dataset.k];if(v!=null)e.textContent=v});
 qa('[data-img]').forEach(function(e){var v=C.images&&C.images[e.dataset.img];if(v)e.src=url(v)});
 var c=C.contact||{};
 qa('[data-bind=email]').forEach(function(a){a.href='mailto:'+c.email;a.textContent=c.email});
 qa('[data-bind=whatsapp]').forEach(function(p){var n=(c.whatsapp||'').replace(/\D/g,'');p.innerHTML=n?'<a href="https://wa.me/'+n+'" target="_blank" rel="noopener">'+esc(c.whatsapp)+'</a>':'Available on request'});
 qa('[data-social]').forEach(function(a){var u=c[a.dataset.social];if(u){a.href=u;a.target='_blank';a.rel='noopener';a.style.display=''}else a.style.display='none'});
 var el;
 if((el=q('.stats'))&&C.stats)el.innerHTML=C.stats.map(function(s){return '<div class="stat"><b data-count="'+s.n+'" data-suffix="'+esc(s.suffix)+'"'+(s.dec?' data-decimals="'+s.dec+'"':'')+'>0</b><span>'+esc(s.label)+'</span></div>'}).join('');
 if((el=q('.services'))&&C.services)el.innerHTML=C.services.map(function(s){return '<article class="service">'+svg(s.icon)+'<h3>'+esc(s.title)+'</h3><p>'+esc(s.short)+'</p></article>'}).join('');
 if((el=q('#svc'))&&C.services)el.innerHTML=C.services.map(function(s){return '<article class="scard">'+svg(s.icon)+'<h2>'+esc(s.title)+'</h2><p class="sdesc">'+esc(s.desc)+'</p><ul>'+(s.bullets||[]).map(function(b){return '<li>'+esc(b)+'</li>'}).join('')+'</ul><div class="sprice"><span>'+esc(s.pre)+'</span><b>'+esc(s.price)+'</b><small>'+esc(s.per)+'</small></div><a class="btn btn-primary" href="contact.html?service='+slug(s.title)+'">'+esc(s.cta)+'</a></article>'}).join('');
 if((el=q('.grid'))&&C.projects){var f=C.projects.filter(function(p){return p.featured});if(!f.length)f=C.projects;
  el.innerHTML=f.slice(0,6).map(function(p){return '<a class="thumb" href="portfolio.html"><img src="'+esc(url(p.img))+'" alt="'+esc(p.title)+'" loading="lazy"><span class="play"></span><div class="thumb-info"><h3>'+esc(p.title)+'</h3><p>'+esc(CAT[p.cat]||'')+'</p></div></a>'}).join('')}
 if((el=q('#pgrid'))&&C.projects)el.innerHTML=C.projects.map(function(p){return '<button type="button" class="pcard" data-cat="'+esc(p.cat)+'" data-detail="'+esc(p.detail||p.desc)+'"><span class="pthumb"><img src="'+esc(url(p.img))+'" alt="" width="640" height="400" loading="lazy"></span><span class="pbody"><span class="pcat">'+esc(CAT[p.cat]||'')+'</span><span class="ptitle">'+esc(p.title)+'</span><span class="pdesc">'+esc(p.desc)+'</span></span></button>'}).join('');
 if((el=q('.track'))&&C.testimonials)el.innerHTML=C.testimonials.map(function(t){return '<figure class="quote"><blockquote>'+esc(t.quote)+'</blockquote><figcaption><b>'+esc(t.name)+'</b> '+esc(t.role)+'</figcaption></figure>'}).join('');
 if((el=q('.marquee-track'))&&C.brands){var b=C.brands.map(function(x){return '<span>'+esc(x)+'</span>'}).join('');el.innerHTML=b+b.replace(/<span>/g,'<span aria-hidden="true">')}
 if((el=q('.ex-list'))&&C.experience)el.innerHTML=C.experience.map(function(x){return '<li class="ex-item'+(x.current?' is-current':'')+'"><div class="ex-side"><span class="ex-dot"></span><span class="ex-label">'+esc(x.label)+'</span></div><article class="ex-card">'+(x.current?'<span class="now">Current</span>':'')+'<h2>'+esc(x.title).replace(/^(\d+\+?)/,'<span class="big">$1</span>')+'</h2><p class="ex-role">'+esc(x.role)+'</p><p class="ex-desc">'+esc(x.desc)+'</p><ul class="chips">'+(x.chips||[]).map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul></article></li>'}).join('');
 if((el=q('#type'))&&C.services){var first=el.options[0].outerHTML;el.innerHTML=first+C.services.map(function(s){return '<option value="'+slug(s.title)+'">'+esc(s.title)+'</option>'}).join('')+'<option value="other">Something else</option>'}
}
S.load=function(){return fetch(base+'api/content.php?t='+Date.now()).then(function(r){return r.json()}).catch(function(){return fetch(base+'data/default-content.json').then(function(r){return r.json()})})};
window.Site=S;
function go(){
 if(d.body.hasAttribute('data-admin')){root.classList.remove('pending');return}
 var t=setTimeout(finish,3000);
 S.load().then(function(C){S.C=C;try{render(C)}catch(e){console.error(e)}}).catch(function(){}).then(function(){clearTimeout(t);if(!isReady)finish()})}
d.readyState==='loading'?d.addEventListener('DOMContentLoaded',go):go();
})();
