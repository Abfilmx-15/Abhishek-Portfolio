Site.ready(function(){
 var grid=document.getElementById('pgrid'),cards=[].slice.call(grid.children),btns=[].slice.call(document.querySelectorAll('.filters button')),cur='all',tok=0;
 /* staggered scroll reveal */
 var io=new IntersectionObserver(function(es){var n=0;es.forEach(function(e){if(!e.isIntersecting)return;var c=e.target;io.unobserve(c);
  c.style.transitionDelay=(n++*100)+'ms';c.classList.add('in');setTimeout(function(){c.style.transitionDelay=''},1200)})},{threshold:.12});
 cards.forEach(function(c){io.observe(c)});
 /* filter: fade out leaving cards, glide the rest into place, fade in new ones */
 function match(c,f){return f==='all'||c.dataset.cat===f}
 function filter(f){
  if(f===cur)return;cur=f;var my=++tok;
  btns.forEach(function(b){var on=b.dataset.filter===f;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  var vis=cards.filter(function(c){return !c.hidden}),first=new Map();
  vis.forEach(function(c){first.set(c,c.getBoundingClientRect())});
  vis.filter(function(c){return !match(c,f)}).forEach(function(c){c.classList.add('out')});
  setTimeout(function(){
   if(my!==tok)return;
   cards.forEach(function(c){c.hidden=!match(c,f);c.classList.remove('out')});
   var n=0;
   cards.filter(function(c){return !c.hidden}).forEach(function(c){
    var a=first.get(c);
    if(a){var b=c.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;
     if(dx||dy){c.style.transition='none';c.style.transform='translate('+dx+'px,'+dy+'px)';c.offsetWidth;
      c.style.transition='transform .8s cubic-bezier(.22,.8,.24,1)';c.style.transform='';
      setTimeout(function(){c.style.transition=''},850)}}
    else{c.classList.remove('in');c.offsetWidth;c.style.transitionDelay=(n++*90)+'ms';c.classList.add('in');
     setTimeout(function(){c.style.transitionDelay=''},1000)}
    io.unobserve(c);c.classList.add('in')});
  },270)}
 btns.forEach(function(b){b.addEventListener('click',function(){filter(b.dataset.filter)})});
 /* lightbox */
 var lb=document.getElementById('lb'),img=lb.querySelector('img');
 cards.forEach(function(c){c.addEventListener('click',function(){
  var s=c.querySelector('img');img.src=s.src;img.alt=c.querySelector('.ptitle').textContent+' project image';
  lb.querySelector('.lb-cat').textContent=c.querySelector('.pcat').textContent;
  lb.querySelector('h2').textContent=c.querySelector('.ptitle').textContent;
  lb.querySelector('.lb-desc').textContent=c.dataset.detail;lb.showModal()})});
 lb.querySelector('.lb-close').addEventListener('click',function(){lb.close()});
 lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
});
