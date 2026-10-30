(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target;
  setTimeout(function(){el.classList.add('in');
   var b=el.querySelector('.skill-top b');
   if(b){var end=+el.dataset.v,t0=null,dur=reduce?1:1800;
    (function step(t){t0=t0||t;var p=Math.min((t-t0)/dur,1);b.textContent=Math.round(end*(1-Math.pow(1-p,3)))+'%';if(p<1)requestAnimationFrame(step)})(performance.now())}
  },reduce?0:(el.classList.contains('skill')?[].indexOf.call(el.parentNode.children,el)*140:0))})},{threshold:.35});
 document.querySelectorAll('.tl-item,.skill').forEach(function(el){io.observe(el)});
})();
