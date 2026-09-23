function initNavigation(){
  const header=document.querySelector('[data-header]');
  const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>20);
  updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
}

function initContentOrder(){
  const appendInOrder=(parent,ids)=>{if(!parent)return;ids.forEach(id=>{const item=document.getElementById(id);if(item)parent.appendChild(item)})};
  appendInOrder(document.getElementById('ventures'),['storage-platform','healthy-bowl','kettle-recipe','bpa','china-camping-club','marketing-intern']);
  appendInOrder(document.querySelector('.leadership-list'),['head-prefect','head-ambassador','writing-center-tutor','calligraphy-club','assistance-coach','volunteer-teaching','cooking-club']);
  appendInOrder(document.getElementById('visual'),['photography','documentary']);
  appendInOrder(document.querySelector('.sports-pair'),['dancing','soccer']);
}

function initDetailLinks(){
  if(!document.body.classList.contains('home-page'))return;
  const pages={
    'storage-platform':'ventures.html','healthy-bowl':'ventures.html','kettle-recipe':'ventures.html','bpa':'ventures.html','china-camping-club':'ventures.html','marketing-intern':'ventures.html',
    'head-prefect':'leadership.html','head-ambassador':'leadership.html','writing-center-tutor':'leadership.html','calligraphy-club':'leadership.html','assistance-coach':'leadership.html','volunteer-teaching':'leadership.html','cooking-club':'leadership.html',
    'photography':'visual.html','documentary':'visual.html','figure-skating':'sports.html','dancing':'sports.html','soccer':'sports.html'
  };
  Object.entries(pages).forEach(([id,page])=>{
    const module=document.getElementById(id);if(!module)return;const url=`./${page}#${id}`;
    const title=module.querySelector('h3');if(title&&!title.querySelector('a')){const link=document.createElement('a');link.href=url;link.className='module-title-link';link.innerHTML=title.innerHTML;title.replaceChildren(link)}
    const found=module.querySelector('.media-carousel,.collage,.photo-grid,.video-placeholder,.zoom,img');const media=found?.tagName==='IMG'?found.parentElement:found;if(media&&!media.querySelector(':scope > .browse-more')){media.classList.add('detail-media');const link=document.createElement('a');link.href=url;link.className='browse-more';link.setAttribute('aria-label',`Browse more about ${title?.textContent.trim()||id}`);link.innerHTML='<span>Click to browse more</span><b aria-hidden="true">↗</b>';media.appendChild(link)}
  });
}

function initDetailNavigation(){
  if(!document.body.classList.contains('detail-page'))return;
  const nav=document.getElementById('primary-nav');if(!nav)return;
  nav.setAttribute('aria-label','Primary navigation');
  nav.innerHTML=`<a class="nav-link" href="./index.html#home" data-section="home">Home</a>
    <div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false">Ventures</button><div class="dropdown"><a href="./index.html#storage-platform">Storage Platform &amp; Secondhand Trading</a><a href="./index.html#healthy-bowl">Healthy Bowl</a><a href="./index.html#kettle-recipe">Kettle Recipe</a><a href="./index.html#bpa">BPA</a><a href="./index.html#china-camping-club">China Camping Club</a><a href="./index.html#marketing-intern">Marketing Intern</a></div></div>
    <div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false">Leadership</button><div class="dropdown"><a href="./index.html#head-prefect">Head Prefect</a><a href="./index.html#head-ambassador">Head Ambassador</a><a href="./index.html#writing-center-tutor">Writing Center Tutor</a><a href="./index.html#calligraphy-club">Calligraphy Club</a><a href="./index.html#assistance-coach">Assistance Coach</a><a href="./index.html#volunteer-teaching">Volunteer Teaching</a><a href="./index.html#cooking-club">Cooking Club</a></div></div>
    <div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false">Visual</button><div class="dropdown"><a href="./index.html#photography">Photography</a><a href="./index.html#documentary">Documentary</a></div></div>
    <div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false">Sports</button><div class="dropdown"><a href="./index.html#figure-skating">Figure Skating</a><a href="./index.html#dancing">Dancing</a><a href="./index.html#soccer">Soccer</a></div></div>`;
}

function initDropdowns(){
  document.querySelectorAll('.nav-trigger').forEach(trigger=>{
    trigger.addEventListener('click',()=>{
      const group=trigger.closest('.nav-group');const open=group.classList.toggle('open');
      trigger.setAttribute('aria-expanded',String(open));
      document.querySelectorAll('.nav-group').forEach(other=>{if(other!==group){other.classList.remove('open');other.querySelector('.nav-trigger').setAttribute('aria-expanded','false')}});
    });
  });
  document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(group=>{group.classList.remove('open');group.querySelector('.nav-trigger').setAttribute('aria-expanded','false')})});
}

function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const href=link.getAttribute('href');if(!href||href==='#')return;
    const target=document.querySelector(href);if(!target)return;
    event.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    history.replaceState(null,'',href);
  }));
}

function initScrollSpy(){
  const map={home:document.querySelector('[data-section="home"]'),ventures:[...document.querySelectorAll('.nav-trigger')][0],leadership:[...document.querySelectorAll('.nav-trigger')][1],visual:[...document.querySelectorAll('.nav-trigger')][2],sports:[...document.querySelectorAll('.nav-trigger')][3]};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){Object.values(map).forEach(item=>item?.classList.remove('active'));map[entry.target.dataset.spy]?.classList.add('active')}}),{rootMargin:'-30% 0px -60% 0px'});
  document.querySelectorAll('[data-spy]').forEach(section=>observer.observe(section));
}

function initRevealAnimations(){
  const items=document.querySelectorAll('.reveal,.reveal-group,.reveal-media');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(item=>item.classList.add('is-visible'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});
  items.forEach(item=>observer.observe(item));
}

function pauseMedia(root){root.querySelectorAll('video').forEach(video=>video.pause())}

function showSlide(carousel,index){
  const slides=[...carousel.querySelectorAll('.slide')];if(!slides.length)return;
  pauseMedia(carousel);const next=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===next));carousel.dataset.index=String(next);
  const count=carousel.querySelector('.carousel-count');if(count)count.textContent=`${next+1} / ${slides.length}`;
}

function initCarousels(){
  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    carousel.dataset.index='0';
    let timer;const interval=Number(carousel.dataset.autoplay||0);
    const restart=()=>{clearInterval(timer);if(interval>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>showSlide(carousel,Number(carousel.dataset.index)+1),interval)};
    carousel.querySelector('.carousel-prev')?.addEventListener('click',()=>{showSlide(carousel,Number(carousel.dataset.index)-1);restart()});
    carousel.querySelector('.carousel-next')?.addEventListener('click',()=>{showSlide(carousel,Number(carousel.dataset.index)+1);restart()});
    let startX=0;carousel.addEventListener('touchstart',event=>startX=event.changedTouches[0].clientX,{passive:true});
    carousel.addEventListener('touchend',event=>{const distance=event.changedTouches[0].clientX-startX;if(Math.abs(distance)>45){showSlide(carousel,Number(carousel.dataset.index)+(distance<0?1:-1));restart()}},{passive:true});
    carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',restart);
    carousel.addEventListener('focusin',()=>clearInterval(timer));carousel.addEventListener('focusout',restart);
    document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(timer):restart());restart();
  });
}

function initLightbox(){
  const dialog=document.querySelector('.lightbox');const image=dialog.querySelector('img');const caption=dialog.querySelector('figcaption');const items=[...document.querySelectorAll('.zoom')];let index=0;
  const openAt=value=>{index=(value+items.length)%items.length;const source=items[index].querySelector('img');if(!source)return;image.src=source.currentSrc||source.src;image.alt=source.alt;caption.textContent=items[index].closest('figure')?.querySelector('figcaption')?.textContent||source.alt};
  items.forEach((item,itemIndex)=>item.addEventListener('click',()=>{openAt(itemIndex);dialog.showModal()}));
  dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());dialog.querySelector('.lightbox-prev').addEventListener('click',()=>openAt(index-1));dialog.querySelector('.lightbox-next').addEventListener('click',()=>openAt(index+1));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')openAt(index-1);if(event.key==='ArrowRight')openAt(index+1)});
}

function initMobileMenu(){
  const button=document.querySelector('.menu-toggle');const nav=document.querySelector('#primary-nav');
  const close=()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
  button.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));window.addEventListener('resize',()=>{if(innerWidth>=768)close()});
}

function initLazyVideos(){
  const videos=document.querySelectorAll('video[data-src]');if(!videos.length)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const video=entry.target;video.src=video.dataset.src;video.removeAttribute('data-src');video.load();observer.unobserve(video)}}),{rootMargin:'300px'});videos.forEach(video=>observer.observe(video));
}

function initFeatureVideos(){
  document.querySelectorAll('[data-feature-video]').forEach(wrapper=>{
    const video=wrapper.querySelector('video');const button=wrapper.querySelector('.feature-video-toggle');if(!video||!button)return;
    let hideTimer;
    const showTemporarily=()=>{clearTimeout(hideTimer);wrapper.classList.remove('controls-hidden');if(!video.paused&&!video.ended)hideTimer=setTimeout(()=>wrapper.classList.add('controls-hidden'),2000)};
    const sync=()=>{const playing=!video.paused&&!video.ended;wrapper.classList.toggle('is-playing',playing);button.setAttribute('aria-label',playing?'Pause video':'Play video');button.querySelector('span').textContent=playing?'❚❚':'▶';if(playing)showTemporarily();else{clearTimeout(hideTimer);wrapper.classList.remove('controls-hidden')}};
    button.addEventListener('click',()=>video.paused?video.play():video.pause());
    wrapper.addEventListener('pointermove',()=>{if(!video.paused)showTemporarily()});
    video.addEventListener('play',sync);video.addEventListener('pause',sync);video.addEventListener('ended',sync);sync();
  });
}

document.addEventListener('DOMContentLoaded',()=>{initContentOrder();initDetailLinks();initDetailNavigation();initNavigation();initDropdowns();initSmoothScroll();initScrollSpy();initRevealAnimations();initCarousels();initLightbox();initMobileMenu();initLazyVideos();initFeatureVideos()});
