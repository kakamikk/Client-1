(function(){
  // GitHub Pages serves this project below /Client-1/ rather than the domain root.
  var projectBase = window.location.hostname === 'kakamikk.github.io' ? '/Client-1' : '';
  document.querySelectorAll('a[href^="/"]').forEach(function(link){
    var href = link.getAttribute('href');
    if(href && href.indexOf(projectBase + '/') !== 0){
      link.setAttribute('href', projectBase + href);
    }
  });

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
      toggle.setAttribute('aria-expanded', open);
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

  // Mega menu (click-to-toggle for touch/keyboard; CSS handles hover on desktop)
  var navItems = document.querySelectorAll('.nav-item.has-mega');
  navItems.forEach(function(item){
    var trigger = item.querySelector('.nav-mega-trigger');
    if(!trigger) return;
    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = item.classList.contains('open');
      navItems.forEach(function(i){ i.classList.remove('open'); i.querySelector('.nav-mega-trigger').setAttribute('aria-expanded','false'); });
      if(!isOpen){ item.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
    });
  });
  document.addEventListener('click', function(){
    navItems.forEach(function(i){ i.classList.remove('open'); i.querySelector('.nav-mega-trigger').setAttribute('aria-expanded','false'); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      navItems.forEach(function(i){ i.classList.remove('open'); i.querySelector('.nav-mega-trigger').setAttribute('aria-expanded','false'); });
    }
  });

  // Article modal (Artikel page)
  var articleModal = document.getElementById('articleModal');
  if(articleModal){
    var articleClose = document.getElementById('articleModalClose');
    var articles = {
      'kitchen-material': {
        cat:'Furnitur & Interior', title:'5 Tips Memilih Material Kitchen Set agar Awet Bertahun-tahun',
        body:[
          'Kitchen set adalah salah satu investasi furnitur yang paling sering dipakai setiap hari, sehingga pemilihan material menjadi penentu utama usia pakainya.',
          'Pertama, perhatikan ketahanan terhadap air. Area sekitar sink dan kompor paling rentan lembap, jadi multiplek atau blockboard umumnya lebih tahan lama dibanding partikel board biasa.',
          'Kedua, pilih finishing HPL dengan lapisan yang rata dan edge banding yang rapi, karena celah pada tepi panel adalah titik masuknya kelembapan yang mempercepat kerusakan.',
          'Ketiga, pertimbangkan jenis engsel dan rel laci. Engsel soft-close dan rel ball-bearing memang sedikit lebih mahal, namun jauh lebih tahan terhadap pemakaian harian.',
          'Keempat, sesuaikan warna dan tekstur dengan pencahayaan dapur Anda — warna gelap menyerap lebih banyak panas dari peralatan masak, sementara warna terang lebih mudah menunjukkan noda.',
          'Terakhir, pastikan pengukuran dilakukan langsung di lokasi sebelum produksi dimulai, karena kitchen set yang presisi akan jauh lebih tahan lama dibanding yang dipaksakan menyesuaikan ruang.'
        ]
      },
      'sofa-restorasi': {
        cat:'Sofa', title:'Kapan Waktu yang Tepat untuk Restorasi Sofa, Bukan Beli Baru?',
        body:[
          'Tidak semua sofa yang terlihat usang harus diganti. Banyak sofa dengan rangka kayu solid justru lebih kokoh dibanding sofa baru berbahan rangka ringan, dan hanya perlu dipulihkan bagian luarnya.',
          'Periksa rangka terlebih dahulu. Jika sofa masih kokoh saat digoyangkan dan tidak berderit, kemungkinan besar rangkanya masih layak dipertahankan dan hanya busa serta kainnya yang perlu diganti.',
          'Perhatikan juga busa dudukan. Busa yang sudah kempes dan tidak kembali ke bentuk semula setelah diduduki adalah tanda paling umum bahwa sofa membutuhkan penggantian busa, bukan penggantian sofa secara keseluruhan.',
          'Dari sisi biaya, restorasi sofa umumnya jauh lebih hemat dibanding membeli sofa custom baru dengan ukuran dan kualitas yang setara, terutama untuk sofa berukuran besar.',
          'Restorasi juga menjadi pilihan yang lebih berkelanjutan, karena mengurangi limbah furnitur sekaligus mempertahankan sofa yang mungkin punya nilai kenangan tersendiri bagi keluarga Anda.'
        ]
      },
      'wardrobe-vs-builtin': {
        cat:'Furnitur & Interior', title:'Wardrobe Custom vs Built-in: Mana yang Cocok untuk Kamar Anda?',
        body:[
          'Wardrobe custom biasanya dibuat sebagai unit berdiri sendiri dengan ukuran yang disesuaikan, namun tetap bisa dipindahkan jika suatu saat diperlukan.',
          'Wardrobe built-in menyatu langsung dengan struktur dinding dan langit-langit kamar, sehingga tidak ada celah kosong di atas atau di samping unit — cocok untuk kamar dengan bentuk tidak simetris.',
          'Jika Anda sering berpindah tempat tinggal atau ingin fleksibilitas di masa depan, wardrobe custom berdiri sendiri lebih masuk akal karena dapat dibawa pindah.',
          'Sebaliknya, jika kamar Anda adalah rumah tetap dan Anda ingin memaksimalkan setiap sudut ruang, wardrobe built-in umumnya memberikan kapasitas penyimpanan yang lebih besar.',
          'Dari sisi tampilan, wardrobe built-in cenderung terlihat lebih menyatu dengan interior karena tidak ada celah atau bayangan di sekitarnya, sementara wardrobe custom berdiri sendiri lebih mudah diberi sentuhan dekoratif tersendiri.',
          'Kedua pilihan sama-sama bisa menggunakan material dan finishing yang sama — keputusan akhirnya lebih bergantung pada kebutuhan jangka panjang Anda terhadap ruang tersebut.'
        ]
      },
      'mengenal-hpl': {
        cat:'Material', title:'Mengenal HPL: Kelebihan dan Cara Merawatnya untuk Furnitur Rumah',
        body:[
          'HPL (High Pressure Laminate) adalah lapisan finishing yang terbuat dari beberapa lembar kertas kraft yang direkatkan dengan resin bertekanan tinggi, lalu dilapisi motif dekoratif di permukaannya.',
          'Kelebihan utama HPL dibanding cat duco adalah daya tahannya terhadap goresan dan benturan ringan, menjadikannya pilihan populer untuk furnitur yang sering digunakan seperti kitchen set dan meja kerja.',
          'HPL juga tersedia dalam berbagai motif, mulai dari woodgrain yang menyerupai serat kayu asli, warna solid, hingga motif batu dan marmer — sehingga fleksibel mengikuti gaya interior yang diinginkan.',
          'Untuk merawatnya, cukup lap permukaan HPL dengan kain lembap dan sedikit sabun cair, lalu keringkan dengan kain kering. Hindari bahan pembersih abrasif atau berbahan asam keras yang dapat merusak lapisan permukaannya.',
          'Perhatikan juga bagian tepi (edge banding). Karena bagian ini paling sering terkena benturan, pastikan proses pemasangan edge banding dilakukan dengan rapi agar tidak mudah terkelupas seiring waktu.'
        ]
      },
      'ukur-ruang': {
        cat:'Panduan', title:'Panduan Mengukur Ruang Sebelum Pesan Furnitur Custom',
        body:[
          'Pengukuran yang akurat adalah fondasi dari furnitur custom yang benar-benar pas dengan ruang Anda. Kesalahan kecil dalam pengukuran bisa berdampak besar pada hasil akhir produksi.',
          'Selalu ukur lebar, tinggi, dan kedalaman ruang di tiga titik berbeda (atas, tengah, bawah), karena dinding dan lantai rumah jarang benar-benar rata sempurna.',
          'Perhatikan posisi stop kontak, saklar, pipa, dan ventilasi di area yang akan dipasangi furnitur, agar desain dapat menyesuaikan tanpa menutupi akses penting tersebut.',
          'Jangan lupa mengukur jalur masuk furnitur — pintu, tangga, dan lorong — terutama untuk furnitur berukuran besar seperti wardrobe atau sofa L-shape, agar proses pengiriman berjalan lancar.',
          'Meski Anda bisa melakukan pengukuran awal sendiri, kunjungan survei langsung oleh tim tetap penting untuk memastikan akurasi sebelum desain dan produksi dimulai.'
        ]
      }
    };
    document.querySelectorAll('.article-card').forEach(function(card){
      card.addEventListener('click', function(){
        var key = card.getAttribute('data-article');
        var a = articles[key];
        if(!a) return;
        document.getElementById('articleModalCat').textContent = a.cat;
        document.getElementById('articleModalTitle').textContent = a.title;
        var bodyEl = document.getElementById('articleModalBody');
        bodyEl.innerHTML = a.body.map(function(p){ return '<p>' + p + '</p>'; }).join('');
        articleModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeArticle(){ articleModal.classList.remove('open'); document.body.style.overflow=''; }
    if(articleClose) articleClose.addEventListener('click', closeArticle);
    articleModal.addEventListener('click', function(e){ if(e.target === articleModal) closeArticle(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeArticle(); });
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
})();
