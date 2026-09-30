(function(){
  // Sticky nav compact state
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 30){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var panel = document.getElementById('mobilePanel');
  if(toggle && panel){
    toggle.addEventListener('click', function(){
      var open = panel.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ panel.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /**
   * WhatsApp click tracking hook.
   * TODO(client): wire in Google Analytics / Meta Pixel here, e.g.:
   *   gtag('event', 'whatsapp_click', { source: source });
   *   fbq('trackCustom', 'WhatsAppClick', { source: source });
   * Every WA link/button in the templates carries data-wa-track="<source>"
   * (floating-button, nav-cta, hero, process-cta, portfolio-cta, contact-page, ...)
   * so you can see exactly which entry point drove the click.
   */
  function trackWhatsAppClick(source){
    // eslint-disable-next-line no-console
    console.log('[wa-track]', source); // TODO(client): replace/extend with real analytics call
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-wa-track]');
    if(el){ trackWhatsAppClick(el.getAttribute('data-wa-track')); }
  });

  // Send the contact form details to WhatsApp; this static site has no form backend.
  var projectForm = document.getElementById('projectForm');
  if(projectForm){
    projectForm.addEventListener('submit', function(e){
      e.preventDefault();
      var fields = [
        ['Nama', 'f-name'],
        ['WhatsApp', 'f-wa'],
        ['Email', 'f-email'],
        ['Jenis proyek', 'f-type'],
        ['Lokasi', 'f-loc'],
        ['Estimasi ukuran', 'f-size'],
        ['Kisaran anggaran', 'f-budget'],
        ['Deskripsi', 'f-desc']
      ];
      var message = ['Halo Bantenese Group, saya ingin mengajukan konsultasi proyek.'];
      fields.forEach(function(field){
        var value = document.getElementById(field[1]).value.trim();
        if(value) message.push(field[0] + ': ' + value);
      });
      window.open('https://wa.me/6282215617080?text=' + encodeURIComponent(message.join('\n')), '_blank', 'noopener,noreferrer');
    });
  }

  // Before / After slider (used on Sofapedia-style sections)
  var slider = document.getElementById('baSlider');
  if(slider){
    var after = document.getElementById('baAfter');
    var handle = document.getElementById('baHandle');
    function setPos(clientX){
      var rect = slider.getBoundingClientRect();
      var x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      var pct = (x / rect.width) * 100;
      after.style.width = pct + '%';
      handle.style.left = pct + '%';
    }
    var dragging = false;
    slider.addEventListener('mousedown', function(e){ dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove', function(e){ if(dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', function(){ dragging = false; });
    slider.addEventListener('touchstart', function(e){ dragging = true; setPos(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('touchmove', function(e){ if(dragging) setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchend', function(){ dragging = false; });
  }

  /**
   * Portfolio project modal — data-driven from window.BANTENESE_PROJECTS
   * (injected server-side from assets/data/projects.json at build time, so
   * the grid cards and the modal always read the SAME single source of
   * data — this is what fixes the empty Tantangan/Solusi/Material/Hasil
   * Akhir bug from the previous version).
   * Any field missing from a project's data is simply omitted from the
   * modal (heading + paragraph both hidden) instead of rendering empty.
   */
  var modal = document.getElementById('projectModal');
  if(modal && window.BANTENESE_PROJECTS){
    var byslug = {};
    window.BANTENESE_PROJECTS.forEach(function(p){ byslug[p.slug] = p; });
    var modalClose = document.getElementById('modalClose');

    function setField(id, value){
      var el = document.getElementById(id);
      if(!el) return;
      var wrap = el.closest('.modal-field');
      if(value){
        el.textContent = value;
        if(wrap) wrap.style.display = '';
      } else if(wrap){
        wrap.style.display = 'none';
      }
    }

    document.querySelectorAll('.project-card').forEach(function(card){
      card.addEventListener('click', function(){
        var p = byslug[card.getAttribute('data-project')];
        if(!p) return;
        document.getElementById('modalCat').textContent = p.brand || '';
        document.getElementById('modalTitle').textContent = p.title || '';
        setField('modalLoc', p.location);
        setField('modalCat2', p.brand);
        setField('modalServices', p.services);
        setField('modalMaterials', p.materials);
        setField('modalStyle', p.style);
        setField('modalChallenge', p.challenge);
        setField('modalSolution', p.solution);
        setField('modalResult', p.result);
        var heroEl = document.getElementById('modalHero');
        if(heroEl){ heroEl.innerHTML = p.image ? '<img src="'+p.image+'" alt="'+p.title+'" loading="lazy">' : ''; }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; }
    if(modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    var modalStart = document.getElementById('modalStart');
    if(modalStart) modalStart.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  }

  // Portfolio filter (Layanan page)
  var filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns.length){
    var cards = document.querySelectorAll('.portfolio-grid .project-card');
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        cards.forEach(function(c){
          var show = (f === 'all') || (c.getAttribute('data-category') === f);
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Article modal (Artikel page)
  var articleModal = document.getElementById('articleModal');
  if(articleModal && window.BANTENESE_ARTICLES){
    var articleClose = document.getElementById('articleModalClose');
    var byKey = {};
    window.BANTENESE_ARTICLES.forEach(function(a){ byKey[a.key] = a; });
    document.querySelectorAll('.article-card').forEach(function(card){
      card.addEventListener('click', function(){
        var a = byKey[card.getAttribute('data-article')];
        if(!a) return;
        document.getElementById('articleModalCat').textContent = a.cat;
        document.getElementById('articleModalTitle').textContent = a.title;
        document.getElementById('articleModalBody').innerHTML = a.body.map(function(p){ return '<p>' + p + '</p>'; }).join('');
        articleModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeArticle(){ articleModal.classList.remove('open'); document.body.style.overflow=''; }
    if(articleClose) articleClose.addEventListener('click', closeArticle);
    articleModal.addEventListener('click', function(e){ if(e.target === articleModal) closeArticle(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeArticle(); });
  }

  // FAQ accordion (Layanan page)
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();
