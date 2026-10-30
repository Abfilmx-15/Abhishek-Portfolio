Site.ready(function(){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
 document.querySelectorAll('.cform,.cinfo').forEach(function(el){io.observe(el)});
 var f=document.getElementById('cform'),st=document.getElementById('status'),E=f.elements,btn=f.querySelector('.submit'),label=btn.textContent;
 var to=(window.Site&&Site.C&&Site.C.contact&&Site.C.contact.email)||'dsabhishek76@gmail.com';
 var q=new URLSearchParams(location.search).get('service');
 if(q&&E.namedItem('type').querySelector('option[value="'+q+'"]'))E.namedItem('type').value=q;
 f.addEventListener('input',function(e){var p=e.target.closest('.field');if(p&&e.target.checkValidity())p.classList.remove('bad')});
 function say(c,m){st.className='status '+c;st.textContent=m}
 function mailto(d){location.href='mailto:'+to+'?subject='+encodeURIComponent('Project enquiry from '+d.name)+'&body='+encodeURIComponent('Name: '+d.name+'\nEmail: '+d.email+'\nProject type: '+d.type+'\nBudget: '+d.budget+'\n\n'+d.message);
  say('ok','Your email app should open with the message ready to send. If it doesn’t, email '+to+' directly.')}
 f.addEventListener('submit',function(e){
  e.preventDefault();var ok=true,first=null;
  [].forEach.call(f.querySelectorAll('[required]'),function(el){var v=el.checkValidity()&&el.value.trim()!=='';el.closest('.field').classList.toggle('bad',!v);if(!v){ok=false;first=first||el}});
  if(!ok){say('err','Please fill in the highlighted fields.');first.focus();return}
  var d={name:E.namedItem('name').value.trim(),email:E.namedItem('email').value.trim(),type:E.namedItem('type').options[E.namedItem('type').selectedIndex].text,budget:E.namedItem('budget').value||'Not specified',message:E.namedItem('message').value.trim(),website:E.namedItem('website').value};
  btn.disabled=true;btn.textContent='Sending…';say('','');
  fetch('api/contact.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
   .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j}})})
   .then(function(x){
    if(x.ok&&x.j.ok){f.reset();say('ok','Thank you! Your message has been sent. I’ll get back to you soon.')}
    else if(x.j.fallback)mailto(d);
    else say('err',x.j.error||'Something went wrong. Please email '+to+'.')})
   .catch(function(){mailto(d)})
   .then(function(){btn.disabled=false;btn.textContent=label});
 });
});
