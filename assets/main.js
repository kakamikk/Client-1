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
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ panel.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
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

  // Before / After slider (Sofapedia page)
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

  // Portfolio project modal
  var modal = document.getElementById('projectModal');
  if(modal){
    var modalClose = document.getElementById('modalClose');
    var projectData = {
      'kitchen': {title:'Dapur Minimalis Modern', cat:'Bantenese Furniture', loc:'BSD City, Tangerang', services:'Desain, Produksi, Pemasangan', materials:'Multiplek, HPL Woodgrain', style:'Modern Minimalis',
        challenge:'Klien membutuhkan dapur yang ringkas namun tetap memaksimalkan penyimpanan tanpa terasa sempit, sekaligus menyesuaikan karakter hangat dan bersih dari rumah tersebut.',
        solution:'Kami merancang tata letak mengikuti titik pipa dan listrik yang sudah ada, menggunakan kabinet berprofil ramping dan finishing HPL woodgrain agar ruang tetap terasa lapang dan menyatu.',
        materialsText:'Rangka kabinet multiplek dengan pintu HPL woodgrain, engsel soft-close, dan countertop solid surface.',
        result:'Dapur yang terasa jauh lebih luas dari ukuran sebenarnya, dengan setiap sentimeter ruang penyimpanan direncanakan mengikuti cara keluarga ini benar-benar memasak.'},
      'wardrobe': {title:'Lemari Custom', cat:'Bantenese Furniture', loc:'Serpong, Tangerang Selatan', services:'Desain, Produksi, Pemasangan', materials:'Blockboard, HPL Solid', style:'Kontemporer',
        challenge:'Dinding kamar tidur yang sempit membutuhkan lemari dengan penyimpanan penuh dari lantai ke langit-langit tanpa terasa membebani ruang.',
        solution:'Lemari sliding-door setinggi penuh dibangun sesuai ukuran dinding yang sebenarnya, dengan tata letak internal direncanakan mengikuti jenis pakaian dan barang milik klien.',
        materialsText:'Struktur blockboard dengan pintu HPL solid dan mekanisme sliding soft-close.',
        result:'Lemari built-in yang menyatu dengan arsitektur ruangan, bukan sekadar furnitur tambahan.'},
      'sofa-lshape': {title:'Sofa L-Shape Kontemporer', cat:'Sofapedia', loc:'Alam Sutera, Tangerang', services:'Desain, Upholstery, Pengiriman', materials:'Kain Premium, Busa Densitas Tinggi', style:'Kontemporer',
        challenge:'Klien menginginkan sofa L-Shape besar untuk ruang tamu terbuka, dengan ukuran yang tepat agar jalur sirkulasi tetap lega.',
        solution:'Kami membangun rangka sesuai dimensi custom dan mengisinya dengan busa densitas tinggi agar tetap nyaman dalam jangka panjang, dilapisi kain premium yang tahan lama.',
        materialsText:'Rangka kayu solid, dudukan busa densitas tinggi, kain tenun premium.',
        result:'Sofa yang menjadi pusat ruang tamu tanpa terasa memenuhi ruangan, dibangun untuk tetap kokoh selama bertahun-tahun pemakaian harian.'},
      'sofa-restoration': {title:'Restorasi Sofa', cat:'Sofapedia', loc:'Bintaro, Tangerang Selatan', services:'Reupholstery, Penggantian Busa, Perbaikan', materials:'Kain Baru, Busa Densitas Tinggi', style:'Restorasi',
        challenge:'Sofa tiga dudukan yang sudah lama dipakai mengalami sambungan rangka yang lepas, busa yang kempes, dan kain yang usang setelah bertahun-tahun digunakan.',
        solution:'Kami memperbaiki rangka internal, mengganti busa dengan kepadatan yang lebih tinggi, dan melakukan reupholstery penuh dengan kain baru pilihan klien.',
        materialsText:'Rangka kayu keras yang diperbaiki, busa densitas tinggi baru, kain upholstery pengganti.',
        result:'Sofa yang sama yang telah menemani keluarga ini bertahun-tahun, kini kokoh kembali dan siap dipakai untuk tahun-tahun berikutnya.'},
      'commercial': {title:'Furnitur Komersial', cat:'Bantenese Furniture', loc:'Gading Serpong, Tangerang', services:'Desain, Produksi, Pemasangan', materials:'Multiplek, HPL, Kayu Solid', style:'Modern Korporat',
        challenge:'Kantor yang terus berkembang membutuhkan furnitur yang konsisten dan tahan lama di beberapa ruangan sekaligus, dengan tenggat waktu yang ketat.',
        solution:'Kami menstandarkan desain modular untuk meja, penyimpanan, dan furnitur resepsionis, sehingga produksi lebih efisien dan pemasangan di lokasi dapat terkoordinasi dengan baik.',
        materialsText:'Rangka kabinet multiplek, finishing HPL kelas komersial, detail kayu solid pada area resepsionis.',
        result:'Furnitur kantor yang seragam dan tahan lama, terkirim dan terpasang sesuai jadwal proyek klien.'},
      'lounge': {title:'Sofa Lounge Custom', cat:'Sofapedia', loc:'BSD City, Tangerang', services:'Desain, Upholstery, Pengiriman', materials:'Kulit Asli, Busa Densitas Tinggi', style:'Minimalis Lounge',
        challenge:'Klien menginginkan satu kursi lounge dengan profil rendah dan arsitektural, dilapisi kulit asli sebagai focal point ruangan.',
        solution:'Kami mengembangkan rangka rendah dengan sandaran melengkung lembut, dilapisi kulit asli di atas busa densitas tinggi untuk dudukan yang kokoh dan tahan lama.',
        materialsText:'Rangka kayu solid, busa densitas tinggi, upholstery kulit asli.',
        result:'Sebuah karya yang tenang dan arsitektural, terasa seperti karya seni sekaligus tempat duduk.'}
    };
    document.querySelectorAll('.project-card').forEach(function(card){
      card.addEventListener('click', function(){
        var key = card.getAttribute('data-project');
        var d = projectData[key];
        if(!d) return;
        document.getElementById('modalTitle').textContent = d.title;
        document.getElementById('modalCat').textContent = d.cat;
        document.getElementById('modalCat2').textContent = d.cat;
        document.getElementById('modalLoc').textContent = d.loc;
        document.getElementById('modalServices').textContent = d.services;
        document.getElementById('modalMaterials').textContent = d.materials;
        document.getElementById('modalStyle').textContent = d.style;
        document.getElementById('modalChallenge').textContent = d.challenge;
        document.getElementById('modalSolution').textContent = d.solution;
        document.getElementById('modalMaterialsText').textContent = d.materialsText;
        document.getElementById('modalResult').textContent = d.result;
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

  // Portfolio filter (Portfolio page)
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

  // Accessibility + UX: mark navbar link active based on current path
  (function markActiveNav(){
    try{
      var current = location.pathname.replace(/\/+$/, '') || '/';
      document.querySelectorAll('nav.links a, .mobile-panel a').forEach(function(a){
        var href = a.getAttribute('href') || '';
        // resolve relative/absolute hrefs safely
        try{
          var url = new URL(href, location.origin);
          var path = url.pathname.replace(/\/+$/, '') || '/';
          if(path === current){ a.classList.add('active'); }
        }catch(e){}
      });
    }catch(e){}
  })();
})();
