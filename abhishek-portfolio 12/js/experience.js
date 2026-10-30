Site.ready(function(){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);e.target.classList.add('in')})},{threshold:.2});
 document.querySelectorAll('.ex-item').forEach(function(c){io.observe(c)});
});
