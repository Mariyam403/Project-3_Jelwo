// =============================================
// HERO CAROUSEL
// =============================================
const heroSlides = [
  {
    bg: '//jelwo.myshopify.com/cdn/shop/files/jewelry-4-slider-1.jpg?v=1742540741&width=3840',
    tag: 'SINCE 1990 · NEW COLLECTION',
    title: 'Jewelry is our<br>passion',
    btn: 'SHOP NOW',
  },
  {
    bg: '//jelwo.myshopify.com/cdn/shop/files/jewelry-4-slider-2.jpg?v=1742541168&width=3840',
    tag: 'ELEGANCE REDEFINED',
    title: 'Crafted with<br>love',
    btn: 'EXPLORE',
    
  },
  {
    bg: '//jelwo.myshopify.com/cdn/shop/files/jewelry-4-slider-3.jpg?v=1742541168&width=3840',
    tag: 'LUXURY DIAMONDS',
    title: 'Shine bright<br>always',
    btn: 'DISCOVER',
    
  }
];

let heroIdx = 0;
const heroEl = document.getElementById('heroCarousel');
function buildHero() {
  heroEl.innerHTML = `
    <div class="hero-slide active" style="background:url('${heroSlides[heroIdx].bg}') center/cover no-repeat;">
      <div class="hero-inner" onclick="location.href='collections.html'">
        <div style="position:relative;z-index:2;text-align:center;width:100%">
          <img src="//jelwo.myshopify.com/cdn/shop/files/jewelry-4-slider-label.png?v=1742534520&width=600" alt="heroimg">
          <h1 class="hero-title">${heroSlides[heroIdx].title}</h1>
          <a href="collections.html" class="btn-primary-jelwo" onclick="event.stopPropagation()">
            ${heroSlides[heroIdx].btn}
          </a>
        </div>
      </div>
    </div>
    <div class="hero-dots" onclick="event.stopPropagation()">
      ${heroSlides.map((_, i) => `<button class="hero-dot ${i===heroIdx?'active':''}" onclick="goHero(${i})"></button>`).join('')}
    </div>`;
}
function goHero(i) { heroIdx = i; buildHero(); }
buildHero();
setInterval(() => { heroIdx = (heroIdx + 1) % heroSlides.length; buildHero(); }, 10000);

// =============================================
// MEGA DROPDOWN POSITION
// =============================================
function positionMegaMenus() {
  const header = document.getElementById('mainHeader');
  const bottom = header ? header.getBoundingClientRect().bottom : 130;
  document.querySelectorAll('.mega-menu').forEach(m => m.style.top = 130 + 'px');
}
window.addEventListener('scroll', positionMegaMenus);
window.addEventListener('resize', positionMegaMenus);
document.addEventListener('DOMContentLoaded', positionMegaMenus);
// Show/hide on hover
document.querySelectorAll('.mega-wrap').forEach(wrap => {
  wrap.addEventListener('mouseenter', () => {
    positionMegaMenus();
    wrap.querySelector('.mega-menu').style.display = 'flex';
  });
  wrap.addEventListener('mouseleave', () => {
    wrap.querySelector('.mega-menu').style.display = 'none';
  });
});

// =============================================
// PRODUCTS MEGA CAROUSEL
// =============================================
let megaCarouselIdx = 0;
const megaProds = PRODUCTS.slice(0, 4);
function renderMegaCarousel() {
  const el = document.getElementById('productsMegaCarousel');
  if (!el) return;
  const visible = megaProds.slice(megaCarouselIdx, megaCarouselIdx + 2);
  el.innerHTML = visible.map(p => `
    <div class="d-flex gap-2 align-items-center p-2 border rounded" style="min-width:180px;cursor:pointer;" onclick="location.href='collections.html'">
      <img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
      <div>
        <p style="font-size:.8rem;font-weight:500;margin:0;">${p.name}</p>
        <span style="font-size:.8rem;color:var(--gold);font-weight:600;">Rs. ${p.price.toFixed(2)}</span>
        ${p.oldPrice ? `<del style="font-size:.7rem;color:#999;margin-left:4px;">Rs. ${p.oldPrice.toFixed(2)}</del>` : ''}
        <span style="display:block;background:#2ecc71;color:#fff;font-size:.65rem;border-radius:3px;padding:1px 5px;margin-top:3px;width:fit-content;">${p.badge}%</span>
      </div>
    </div>`).join('');
}
function slideMegaCarousel(dir) {
  megaCarouselIdx = Math.max(0, Math.min(megaCarouselIdx + dir, megaProds.length - 2));
  renderMegaCarousel();
}
renderMegaCarousel();

// =============================================
// FOOTER SUBSCRIBE
// =============================================
function footerSubscribe() {
  const email = document.getElementById('footerEmail').value;
  if (!email) return;
  document.getElementById('footerMsg').style.display = 'block';
  document.getElementById('footerEmail').value = '';
}

// =============================================
// CART RECS
// =============================================
function renderCartRecs() {
  const el = document.getElementById('cartRecsCarousel');
  if (!el) return;
  el.innerHTML = PRODUCTS.slice(0, 3).map(p => `
    <div style="min-width:130px;text-align:center;cursor:pointer;" onclick="location.href='collections.html'">
      <img src="${p.image}" style="width:90px;height:90px;object-fit:cover;border-radius:8px;margin-bottom:6px;">
      <p style="font-size:.75rem;font-weight:500;margin:0;">${p.name}</p>
      <span style="font-size:.75rem;color:var(--gold);">Rs. ${p.price.toFixed(2)}</span>
    </div>`).join('');
}
renderCartRecs();

// =============================================
// NEW JEWELRYS GRID
// =============================================
const newGrid = document.getElementById('newJewelrysGrid');

if (newGrid) {

  // create carousel structure
  newGrid.innerHTML = `
    <div class="product-carousel">
      <div class="product-track">
        ${PRODUCTS.map(p => `
          <div class="product-card">
            ${buildProductCard(p)}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const track = newGrid.querySelector('.product-track');
  let slides = newGrid.querySelectorAll('.product-card');

  let index = 0;

  // clone first slide for smooth loop
  const firstClone = slides[0].cloneNode(true);
  track.appendChild(firstClone);

  slides = newGrid.querySelectorAll('.product-card');

  setInterval(() => {
    index++;

    track.style.transition = "transform 3s ease";
    track.style.transform = `translateX(-65%)`;

    // reset to first
    if (index === slides.length - 1) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        track.style.transform = `translateX(0)`;
      }, 600);
    }

  }, 5000);
}


// =============================================
// TRENDING PRODUCTS (with image cycle)
// =============================================
const trendingGrid = document.getElementById('trendingGrid');

if (trendingGrid) {

  // ✅ use ALL products (not slice)
  const trendProds = PRODUCTS;

  // ✅ make carousel structure
  trendingGrid.innerHTML = `
    <div class="trend-carousel">
      <div class="trend-track">
        ${trendProds.map(p => `
          <div class="trend-card">
            ${buildProductCard(p)}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const track = trendingGrid.querySelector('.trend-track');
  let slides = trendingGrid.querySelectorAll('.trend-card');

  let index = 0;


  // ✅ AUTO SLIDE
  setInterval(() => {
    index++;

    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${index * 25}%)`; // 4 items view

    if (index === slides.length) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        track.style.transform = `translateX(0)`;
      }, 600);
    }

  }, 5000);

  PRODUCTS.forEach(p => {
  // set end date (example: 3 days from now)
  const endDate = new Date().getTime() + (1618 * 9 * 60 * 50 * 1000);

  startCountdown(p.id, endDate);
});

  // ===================================
  // ✅ HOVER IMAGE (same as your code)
  // ===================================
  trendProds.forEach(p => {
    const el = trendingGrid.querySelector(`[data-id="${p.id}"] .product-img-wrap img`);
    if (!el) return;

    const originalImg = p.image;
    const hoverImg = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].image;

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'opacity .4s';
      el.style.opacity = 0;

      setTimeout(() => {
        el.src = hoverImg;
        el.style.opacity = 1;
      }, 200);
    });

    el.addEventListener('mouseleave', () => {
      el.style.opacity = 0;

      setTimeout(() => {
        el.src = originalImg;
        el.style.opacity = 1;
      }, 200);
    });
  });

  // ===================================
  // ✅ COUNTDOWN TIMER
  // ===================================
  trendProds.forEach(p => {
    const endDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 days

    const el = trendingGrid.querySelector(`#countdown-${p.id}`);
    if (!el) return;

    const daysEl = el.querySelector('.days');
    const hoursEl = el.querySelector('.hours');
    const minutesEl = el.querySelector('.minutes');
    const secondsEl = el.querySelector('.seconds');

    function updateTimer() {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance <= 0) return;

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const m = Math.floor((distance / (1000 * 60)) % 60);
      const s = Math.floor((distance / 1000) % 60);

      daysEl.textContent = d;
      hoursEl.textContent = h;
      minutesEl.textContent = m;
      secondsEl.textContent = s;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  });

}

// =============================================
// TESTIMONIALS (auto-scroll)
// =============================================
const testimonialsData = [
  { name: 'Kristen Brown', role: 'Company CEO', stars: 5, img: '//jelwo.myshopify.com/cdn/shop/files/jewelry-testi-2.jpg?v=1741598801&width=100', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea consequat.' },
  { name: 'Michael Smith', role: 'Customer', stars: 4, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea consequat.' },
  { name: 'Sarah Johnson', role: 'Blogger', stars: 5, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'Absolutely love the quality of the jewelry. Every piece is crafted with such precision and care. My diamond ring gets compliments everywhere I go!' },
  { name: 'David Lee', role: 'Customer', stars: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Bought a bracelet for my wife and she absolutely loves it. The packaging was beautiful and delivery was fast. Will definitely order again!' },
];
const testTrack = document.getElementById('testimonialsTrack');
if (testTrack) {
  testTrack.innerHTML = [...testimonialsData, ...testimonialsData].map(t => `
    <div class="testimonial-card">
      <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)} (${t.stars}.0 Reviews)</div>
      <p class="review-text">${t.text}</p>
      <div class="reviewer">
        <img src="${t.img}" alt="${t.name}">
        <div class="reviewer-info">
          <div class="name">${t.name}</div>
          <div class="role">${t.role}</div>
        </div>
        <div class="quote-icon">❝</div>
      </div>
    </div>`).join('');
  let testIdx = 0;
  setInterval(() => {
    testIdx = (testIdx + 1) % testimonialsData.length;
    testTrack.style.transform = `translateX(-${testIdx * 532}px)`;
  }, 5000);
}

// =============================================
// JEWELRY NEWS (auto-scroll)
// =============================================
const newsData = [
  { date: '10, MAR 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-5_3cf647c3-7ce1-4f2c-bcc8-8289878be83c.jpg?v=1750223524&width=1080', text: 'As part of our mission create space for women to express their sensuality without shame fear or the patriarchal gaze ...' , ref: "adornyrmoments.html"},
  { date: '02, MAR 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-6_1e2f3da7-57c0-499e-94ee-6047231ac720.jpg?v=1750223520&width=1080', text: 'As part of our mission create space for women to express their sensuality without shame fear or the patriarchal gaze ...' , ref: "wearyrelegance.html"},
  { date: '02, MAR 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-7_923918ed-d386-45c3-85c2-ff31e2c4cdc5.jpg?v=1750223516&width=1080', text: 'As part of our mission create space for women to express their sensuality without shame fear or the patriarchal gaze ...' , ref: "transformyrstyle.html"},
  { date: '15, FEB 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-8_1c3cdfa3-a7b1-4343-be06-30d5638e370b.jpg?v=1750223543&width=1080', text: 'Discover the latest trends in fine jewelry and how our artisans craft each unique piece with unparalleled dedication ...' , ref: "jewelsasunique.html"},
  { date: '15, FEB 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-1_66fd95ae-8368-4800-8123-8c69f48dff27.jpg?v=1750223539&width=1080', text: 'Discover the latest trends in fine jewelry and how our artisans craft each unique piece with unparalleled dedication ...' , ref: "craftedforthemoments.html"},
  { date: '15, FEB 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-2_f99fac11-0d22-4081-94bc-cd2ec791c782.jpg?v=1750223483&width=1080', text: 'Discover the latest trends in fine jewelry and how our artisans craft each unique piece with unparalleled dedication ...' , ref: "timelesstreasures.html"},
  { date: '15, FEB 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-3_5c484272-7a2f-456b-9197-f56b9189f283.jpg?v=1750223534&width=1080', text: 'Discover the latest trends in fine jewelry and how our artisans craft each unique piece with unparalleled dedication ...' , ref: "jewelsthatshine.html"},
  { date: '15, FEB 2025', author: 'Andrew johns', img: '//jelwo.myshopify.com/cdn/shop/articles/jewelry-blog-4_353fee00-faa9-421d-99bb-f4fe9cb5c1a2.jpg?v=1750223529&width=1080', text: 'Discover the latest trends in fine jewelry and how our artisans craft each unique piece with unparalleled dedication ...' , ref: "bczeveryday.html"},
];
const newsTrack = document.getElementById('newsTrack');
if (newsTrack) {
  newsTrack.innerHTML = [...newsData, ...newsData].map(n => `
    <div class="news-card" onclick="location.href='${n.ref}'">
      <img src="${n.img}" alt="News">
      <div class="news-meta">${n.date} | By ${n.author}</div>
      <h5 style="font-size:1.1rem;padding:0 24px 8px;color:var(--gold)">${n.date} | By ${n.author}</h5>
      <p class="news-excerpt">${n.text}</p>
      <div style="padding:0 24px 24px;">
        <a href="#" class="btn-primary-jelwo" style="font-size:.75rem;padding:10px 20px;">READ MORE</a>
      </div>
    </div>`).join('');
  let newsIdx = 0;
  setInterval(() => {
    newsIdx = (newsIdx + 1) % newsData.length;
    newsTrack.style.transform = `translateX(-${newsIdx * 404}px)`;
  }, 5000);
}

// =============================================
// WATCH & SHOP REELS
// =============================================
const reelsData = [
  { product: PRODUCTS[2], bg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', videoUrl: '//jelwo.myshopify.com/cdn/shop/videos/c/vp/72e5b0f02511443c8a62a81b9024ddb9/72e5b0f02511443c8a62a81b9024ddb9.HD-1080p-3.3Mbps-44622574.mp4?v=0' },
  { product: PRODUCTS[1], bg: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80', videoUrl: '//jelwo.myshopify.com/cdn/shop/videos/c/vp/7826750f43d941b28a3d57b2fd330864/7826750f43d941b28a3d57b2fd330864.HD-1080p-2.5Mbps-44713680.mp4?v=0' },
  { product: PRODUCTS[3], bg: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80', videoUrl: '//jelwo.myshopify.com/cdn/shop/videos/c/vp/916ce2bac08d4c5c94bf6e154631eb8b/916ce2bac08d4c5c94bf6e154631eb8b.HD-1080p-7.2Mbps-44713017.mp4?v=0' },
  { product: PRODUCTS[11], bg: 'https://images.unsplash.com/photo-1573408301185-9519f94815f7?w=400&q=80', videoUrl: '//jelwo.myshopify.com/cdn/shop/videos/c/vp/d030285c343f4cbbbf4851801cf773e8/d030285c343f4cbbbf4851801cf773e8.HD-1080p-7.2Mbps-44713018.mp4?v=0' },
  { product: PRODUCTS[8], bg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', videoUrl: '//jelwo.myshopify.com/cdn/shop/videos/c/vp/ba3a4b4a570f4749a2bf30fd1aa1b96d/ba3a4b4a570f4749a2bf30fd1aa1b96d.HD-1080p-4.8Mbps-44622575.mp4?v=0' },
];
const reelsTrack = document.getElementById('reelsTrack');
if (reelsTrack) {
  reelsTrack.innerHTML = reelsData.map((r, i) => `
    <div class="reel-card" onclick="location.href='${r.product.ref}'">
      <video id="reel-vid-${i}" class="reel-video-bg" src="${r.videoUrl}" muted loop autoplay playsinline poster="${r.bg}"></video>
      <div class="reel-info">
        <img src="${r.product.image}" class="reel-thumb" alt="">
        <div>
          <div class="reel-product-name">${r.product.name}</div>
          <div class="reel-price">Rs. ${r.product.price.toFixed(2)}</div>
          <button class="btn-reel-atc" onclick="handleAddToCart('${r.product.id}')">ADD TO CART</button>
        </div>
      </div>
    </div>`).join('');
}


let reelsScrollIdx = 0;
function slideReels(dir) {
  const track = document.getElementById('reelsTrack');
  if (!track) return;
  reelsScrollIdx = Math.max(0, reelsScrollIdx + dir);
  track.scrollLeft = reelsScrollIdx * 246;
}

// =============================================
// YOUTUBE EMBED
// =============================================
function playYoutube() {
  const wrap = document.querySelector('.video-wrap');
  const embedDiv = document.getElementById('youtubeEmbed');

  if (wrap) wrap.style.display = 'none';

  if (embedDiv) {
    embedDiv.style.display = 'block';

    embedDiv.innerHTML = `
      <div style="position:relative; width:100%; height:100%;">
        
        <!-- CLOSE BUTTON -->
        <button onclick="closeVideo()" 
          style="position:absolute; top:10px; right:10px; z-index:10; 
          background:#000; color:#fff; border:none; width:35px; height:35px; 
          border-radius:50%; cursor:pointer; font-size:18px;">
          ✕
        </button>

        <!-- VIDEO -->
        <video width="100%" height="420" controls autoplay style="border-radius:12px;">
          <source src="https://cdn.shopify.com/videos/c/o/v/747375f4ce1e4946941f966c90baabbb.mp4" type="video/mp4">
        </video>

      </div>
    `;
  }
}

function closeVideo() {
  const embedDiv = document.getElementById('youtubeEmbed');
  const wrap = document.querySelector('.video-wrap');

  if (embedDiv) {
    embedDiv.style.display = 'none';
    embedDiv.innerHTML = ''; // stops video
  }

  if (wrap) wrap.style.display = 'block';
}

// =============================================
// FOOTER SUBSCRIBE
// =============================================
function footerSubscribe() {
  const email = document.getElementById('footerEmail').value;
  if (!email) return;
  document.getElementById('footerMsg').style.display = 'block';
  document.getElementById('footerEmail').value = '';
}

// =============================================
// CART RECS
// =============================================
function renderCartRecs() {
  const el = document.getElementById('cartRecsCarousel');
  if (!el) return;
  el.innerHTML = PRODUCTS.slice(0, 3).map(p => `
    <div style="min-width:130px;text-align:center;cursor:pointer;" onclick="location.href='collections.html'">
      <img src="${p.image}" style="width:90px;height:90px;object-fit:cover;border-radius:8px;margin-bottom:6px;">
      <p style="font-size:.75rem;font-weight:500;margin:0;">${p.name}</p>
      <span style="font-size:.75rem;color:var(--gold);">Rs. ${p.price.toFixed(2)}</span>
    </div>`).join('');
}
renderCartRecs();

// Init
JelwoStore.updateCartUI();

let index = 0;

const track = document.querySelector('.category-track');
let slides = document.querySelectorAll('.category-card');

// clone first slide
const firstClone = slides[0].cloneNode(true);
track.appendChild(firstClone);

// update slides after clone
slides = document.querySelectorAll('.category-card');

setInterval(() => {
    index++;

    track.style.transition = "transform 3s ease";
    track.style.transform = `translateX(-65%)`;

    // when reach cloned slide
    if (index === slides.length - 1) {
        setTimeout(() => {
            track.style.transition = "none";
            index = 0;
            track.style.transform = `translateX(0)`;
        }, 600); // same as transition time
    }

}, 5000);

(function () {
      const STORAGE_KEY = 'jelwo_newsletter_hidden';
 
      // If user previously checked "don't show again", skip entirely
      if (localStorage.getItem(STORAGE_KEY) === 'true') return;
 
      const modalEl = document.getElementById('newsletterModal');
      const modal   = new bootstrap.Modal(modalEl);
 
      // ── Show on page load ───────────────────────────
      window.addEventListener('load', function () {
        modal.show();
      });
 
      // ── Subscribe button ────────────────────────────
      document.getElementById('subscribeBtn').addEventListener('click', function () {
        const emailInput = document.getElementById('popupEmail');
        const email = emailInput.value.trim();
 
        // Basic email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailInput.classList.add('is-invalid');
          emailInput.focus();
          return;
        }
 
        emailInput.classList.remove('is-invalid');
 
        // Hide input row, show success message
        document.getElementById('emailRow').style.display = 'none';
        document.getElementById('successMsg').style.display = 'block';
 
        // Auto-close after 2.5 s
        setTimeout(function () { modal.hide(); }, 2500);
      });
 
      // Clear invalid highlight while typing
      document.getElementById('popupEmail').addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
 
      // ── "Don't show again" checkbox ─────────────────
      document.getElementById('dontShowAgain').addEventListener('change', function () {
        if (this.checked) {
          localStorage.setItem(STORAGE_KEY, 'true');
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      });
 
      // Also persist when modal closes (in case they checked then closed via X)
      modalEl.addEventListener('hidden.bs.modal', function () {
        if (document.getElementById('dontShowAgain').checked) {
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      });
    })();