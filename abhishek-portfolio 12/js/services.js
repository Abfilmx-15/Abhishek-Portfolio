Site.ready(function(){
 var io=new IntersectionObserver(function(es){var n=0;es.forEach(function(e){if(!e.isIntersecting)return;var c=e.target;io.unobserve(c);
  c.style.transitionDelay=(n++*140)+'ms';c.classList.add('in');setTimeout(function(){c.style.transitionDelay=''},1400)})},{threshold:.15});
 document.querySelectorAll('.scard').forEach(function(c){io.observe(c)});
});
