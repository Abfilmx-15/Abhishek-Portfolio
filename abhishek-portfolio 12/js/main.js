Site.ready(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var tg=document.querySelector('.nav-toggle'),nav=document.getElementById('nav');
 if(tg){tg.addEventListener('click',function(){var o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');tg.setAttribute('aria-expanded',false)}})}
 /* sections fade and slide in as they are scrolled to */
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
 document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
 /* children of grids enter one after another */
 document.querySelectorAll('.services,.grid,.stats').forEach(function(group){
  var kids=Array.prototype.slice.call(group.children);
  if(!reduce)kids.forEach(function(c){c.style.opacity=0;c.style.transform='translateY(28px)'});
  var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();
   kids.forEach(function(c,i){setTimeout(function(){
    c.style.transition='opacity .8s cubic-bezier(.22,.8,.24,1),transform .8s cubic-bezier(.22,.8,.24,1)';
    c.style.opacity=1;c.style.transform='none';
    setTimeout(function(){c.style.transition='';c.style.opacity='';c.style.transform=''},900)},i*130)})},{threshold:.2});
  o.observe(group)});
 /* counters */
 var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
  var el=e.target,end=parseFloat(el.dataset.count),dec=+el.dataset.decimals||0,suf=el.dataset.suffix||'',t0=null,dur=reduce?1:2000;
  function step(t){t0=t0||t;var p=Math.min((t-t0)/dur,1),v=end*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec)+(p===1?suf:'');if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step)})},{threshold:.6});
 document.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)});
 /* testimonial slider: auto-advance, arrows, dots */
 var tr=document.querySelector('.track');
 if(tr){var n=tr.children.length,i=0,timer,dots=document.querySelector('.dots');
  for(var k=0;k<n;k++){(function(k){var b=document.createElement('button');b.setAttribute('aria-label','Show testimonial '+(k+1));b.onclick=function(){go(k);auto()};dots.appendChild(b)})(k)}
  function go(x){i=(x+n)%n;tr.style.transform='translateX(-'+i*100+'%)';Array.prototype.forEach.call(dots.children,function(d,j){d.classList.toggle('on',j===i)})}
  function auto(){clearInterval(timer);if(!reduce)timer=setInterval(function(){go(i+1)},6000)}
  document.querySelector('.prev').onclick=function(){go(i-1);auto()};
  document.querySelector('.next').onclick=function(){go(i+1);auto()};
  var sl=document.querySelector('.slider');sl.addEventListener('mouseenter',function(){clearInterval(timer)});sl.addEventListener('mouseleave',auto);
  go(0);auto()}
});
