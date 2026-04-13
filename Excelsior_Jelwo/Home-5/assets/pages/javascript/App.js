// =============================================
// JELWO - Store State Management
// =============================================

const JelwoStore = {
  cart: JSON.parse(localStorage.getItem('jelwo_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('jelwo_wishlist') || '[]'),

  saveCart() {
    localStorage.setItem('jelwo_cart', JSON.stringify(this.cart));
    this.updateCartUI();
  },

  saveWishlist() {
    localStorage.setItem('jelwo_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
  },

  addToCart(product) {
    const existing = this.cart.find(i => i.id === product.id && i.variant === product.variant);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      this.cart.push({ ...product, qty: product.qty || 1 });
    }
    this.saveCart();
    this.showToast(`${product.name} added to cart!`, 'cart');
  },

  removeFromCart(id, variant) {
    this.cart = this.cart.filter(i => !(i.id === id && i.variant === variant));
    this.saveCart();
  },

  updateCartQty(id, variant, qty) {
    const item = this.cart.find(i => i.id === id && i.variant === variant);
    if (item) {
      item.qty = qty;
      if (item.qty <= 0) this.removeFromCart(id, variant);
      else this.saveCart();
    }
  },

  addToWishlist(product) {
    const exists = this.wishlist.find(i => i.id === product.id);
    if (!exists) {
      this.wishlist.push(product);
      this.saveWishlist();
      this.showToast(`${product.name} added to wishlist!`, 'wishlist');
      return true;
    } else {
      this.removeFromWishlist(product.id);
      return false;
    }
  },

  removeFromWishlist(id) {
    this.wishlist = this.wishlist.filter(i => i.id !== id);
    this.saveWishlist();
  },

  isInWishlist(id) {
    return this.wishlist.some(i => i.id === id);
  },

  getCartTotal() {
    return this.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  getCartCount() {
    return this.cart.reduce((sum, i) => sum + i.qty, 0);
  },

  updateCartUI() {
    const count = this.getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    this.renderCartOffcanvas();
    this.updateFreeShippingBar();
    if (typeof renderCartPage === 'function') renderCartPage();
  },

  updateWishlistUI() {
    const count = this.wishlist.length;
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    if (typeof renderWishlistPage === 'function') renderWishlistPage();
    // Update heart icons
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const id = btn.dataset.wishlistBtn;
      btn.classList.toggle('active', this.isInWishlist(id));
    });
  },

  updateFreeShippingBar() {
    const total = this.getCartTotal();
    const threshold = 100;
    const pct = Math.min((total / threshold) * 100, 100);
    const remaining = Math.max(threshold - total, 0);
    document.querySelectorAll('.free-shipping-bar').forEach(bar => {
      bar.style.width = pct + '%';
    });
    document.querySelectorAll('.free-shipping-text').forEach(el => {
      el.textContent = remaining > 0
        ? `Spend Rs. ${remaining.toFixed(0)} more and get free shipping!`
        : '🎉 You have free shipping!';
    });
  },

  renderCartOffcanvas() {
    const container = document.getElementById('cartOffcanvasItems');
    if (!container) return;
    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-bag fs-1 text-muted"></i>
          <p class="mt-3 text-muted">Your cart is empty</p>
          <a href="collections.html" class="btn btn-primary-jelwo btn-sm mt-2">CONTINUE SHOPPING</a>
        </div>`;
      return;
    }
    container.innerHTML = this.cart.map(item => `
      <div class="cart-item d-flex gap-3 mb-3 pb-3 border-bottom">
        <img src="${item.image}" alt="${item.name}" class="rounded" style="width:70px;height:70px;object-fit:cover;">
        <div class="flex-grow-1">
          <div class="fw-semibold small">${item.name}</div>
          <div class="text-primary-jelwo small">Rs. ${(item.price * item.qty).toFixed(2)}</div>
          ${item.variant ? `<div class="text-muted small">Color: ${item.variant}</div>` : ''}
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-outline-secondary btn-xs px-2 py-0" onclick="JelwoStore.updateCartQty('${item.id}','${item.variant}',${item.qty - 1})">−</button>
            <span class="small">${item.qty}</span>
            <button class="btn btn-outline-secondary btn-xs px-2 py-0" onclick="JelwoStore.updateCartQty('${item.id}','${item.variant}',${item.qty + 1})">+</button>
            <button class="btn btn-link btn-xs text-danger p-0 ms-1" onclick="JelwoStore.removeFromCart('${item.id}','${item.variant}')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>`).join('');
    // Update subtotal
    const subtotal = document.getElementById('cartSubtotal');
    if (subtotal) subtotal.textContent = `Rs. ${this.getCartTotal().toFixed(2)}`;
  },

  showToast(message, type = 'cart') {
    const toast = document.createElement('div');
    toast.className = 'jelwo-toast';
    toast.innerHTML = `<i class="bi bi-${type === 'cart' ? 'bag-check' : 'heart-fill'} me-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
};

// =============================================
// Product Data
// =============================================
const PRODUCTS = [
  { id: 'p1', name: 'Simple Pearl earrings', price: 15, oldPrice: 20, category: 'Earrings', badge: 25, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-6.jpg?v=1742442751&width=720', variants: ['Gold', 'Brown', 'Silver'] , ref : "simplepearlear.html" },
  { id: 'p2', name: 'Chic diamond ring', price: 22, oldPrice: 40, category: 'Rings', badge: 45, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-56.jpg?v=1742445682&width=720', variants: ['28' , '29' , '30'] , ref: "chicdiamondring.html" },
  { id: 'p3', name: 'Gemstone jhumka', price: 18, oldPrice: 50, category: 'Earrings', badge: 64, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-51.jpg?v=1742445540&width=720', variants: ['Gold', 'Yellow', 'Brown'] , ref: "gemstonejhumka.html" },
  { id: 'p4', name: 'Drop gold earrings', price: 14, oldPrice: 44, category: 'Earrings', badge: 68, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-46.jpg?v=1742445430&width=720', variants: ['Brown', 'Gold' , 'Orange'] , ref: "dropgoldear.html" },
  { id: 'p5', name: 'Gemstone chain bracelet', price: 17, oldPrice: 39, category: 'Bracelets', badge: 64, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-41.jpg?v=1742444936&width=720', variants: ['6' , '6.5' , '7' , '7.5'], ref: "gemstonechainbrac.html" },
  { id: 'p6', name: 'Cluster diamond ring', price: 12, oldPrice: 45, category: 'Rings', badge: 44, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-36.jpg?v=1742444776&width=720', variants: ['20', '21' , '22'] ,ref: "clusterdiamondring.html"},
  { id: 'p7', name: 'Flora diamond bangle', price: 28, oldPrice: 70, category: 'Bracelets', badge: 50, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-31.jpg?v=1742444512&width=720', variants: ['2-12', '2-14' , '2-16'] , ref: "floradiamondbangle.html" },
  { id: 'p8', name: 'Glitter diamond ring', price: 10, oldPrice: 36, category: 'Rings', badge: 50, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-26.jpg?v=1742444221&width=720', variants: ['28', '29', '30'] ,ref: "glitterdiamondring.html"},
  { id: 'p9', name: 'Cluster diamond ring', price: 26, oldPrice: 30, category: 'Rings', badge: 46, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-1.jpg?v=1742443985&width=720', variants: ['20', '21', '22'] ,ref: "clusterdiamondring.html"},
  { id: 'p10', name: 'Blossom diamond bangle', price: 22, oldPrice: 40, category: 'Bracelets', badge: 45, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-16.jpg?v=1742443575&width=720', variants: ['2-12', '2-14' , '2-16'] , ref: "blossomdiamondbangle.html" },
  { id: 'p11', name: 'Gold nose pin', price: 12, oldPrice: 15, category: 'Other', badge: 47, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-21.jpg?v=1742443763&width=720', variants: ['Gold','Biege','Brown'] ,ref: "goldnosepin.html"},
  { id: 'p12', name: 'Framed gold pendant', price: 22, oldPrice: 55, category: 'Necklaces', badge: 45, image: '//jelwo.myshopify.com/cdn/shop/files/jewelry-product-11.jpg?v=1742443330&width=720', variants: ['Gold', 'Orange', 'Brown'] ,ref: "framedgoldpendant.html" },
];


function buildProductCard(p, extraClass = '') {
  const inWish = JelwoStore.isInWishlist(p.id);
  return `
  <div class="product-card ${extraClass}" data-id="${p.id}">
    <div class="product-img-wrap">
      ${p.badge ? `<span class="product-badge">${p.badge}%</span>` : ''}
      <div onclick="location.href='${p.ref}'">
      <img src="${p.image}" alt="${p.name}" loading="lazy"> 
      <div class="product-overlay">
        <button class="overlay-btn wishlist-toggle ${inWish ? 'active' : ''}" data-wishlist-btn="${p.id}"
          onclick="handleWishlistToggle(this, '${p.id}')">
          <i class="bi bi-heart${inWish ? '-fill' : ''}"></i>
        </button>
        <button class="overlay-btn" onclick="openQuickView('${p.id}')">
          <i class="bi bi-eye"></i>
        </button>
      </div>
      </div>
      <div class="product-countdown" id="countdown-${p.id}">
        <span><b class="days">0</b> <small>DAY</small></span>
        <span><b class="hours">0</b> <small>HRS</small></span>
        <span><b class="minutes">0</b> <small>MIN</small></span>
        <span><b class="seconds">0</b> <small>SEC</small></span>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${p.category.toUpperCase()}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">Rs. ${p.price.toFixed(2)} <del>Rs. ${p.oldPrice.toFixed(2)}</del></div>
      <div class="product-actions mt-2">
        <select class="variant-select" id="var-${p.id}">
          ${p.variants.map(v => `<option>${v}</option>`).join('')}
        </select>
        <div class="qty-control">
          <button onclick="changeQty('${p.id}', -1)">−</button>
          <span id="qty-${p.id}">1</span>
          <button onclick="changeQty('${p.id}', 1)">+</button>
        </div>
      </div>
      <button class="btn btn-atc w-100 mt-2" onclick="handleAddToCart('${p.id}')">ADD TO CART</button>
    </div>
  </div>`;
}

function startCountdown(productId, endDate) {
  const el = document.getElementById(`countdown-${productId}`);
  if (!el) return;

  const daysEl = el.querySelector('.days');
  const hoursEl = el.querySelector('.hours');
  const minutesEl = el.querySelector('.minutes');
  const secondsEl = el.querySelector('.seconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance <= 0) {
      daysEl.textContent = 0;
      hoursEl.textContent = 0;
      minutesEl.textContent = 0;
      secondsEl.textContent = 0;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);

}



function changeQty(id, delta) {
  const el = document.getElementById(`qty-${id}`);
  if (!el) return;
  let val = parseInt(el.textContent) + delta;
  if (val < 1) val = 1;
  el.textContent = val;
}

function handleAddToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const varEl = document.getElementById(`var-${id}`);
  const qtyEl = document.getElementById(`qty-${id}`);
  JelwoStore.addToCart({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    variant: varEl ? varEl.value : (p.variants[0] || ''),
    qty: qtyEl ? parseInt(qtyEl.textContent) : 1
  });
  // open offcanvas
  const oc = document.getElementById('cartOffcanvas');
  if (oc && bootstrap) {
    const bsOc = bootstrap.Offcanvas.getOrCreateInstance(oc);
    bsOc.show();
  }
}

function handleWishlistToggle(btn, id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const added = JelwoStore.addToWishlist(p);
  const icon = btn.querySelector('i');
  if (added) {
    icon.className = 'bi bi-heart-fill';
    btn.classList.add('active');
  } else {
    icon.className = 'bi bi-heart';
    btn.classList.remove('active');
  }
}

function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  modal.querySelector('.qv-img').src = p.image;
  modal.querySelector('.qv-name').textContent = p.name;
  modal.querySelector('.qv-price').innerHTML = `Rs. ${p.price.toFixed(2)} <del>Rs. ${p.oldPrice.toFixed(2)}</del>`;
  modal.querySelector('.qv-variants').innerHTML = p.variants.map(v => `<option>${v}</option>`).join('');
  modal.querySelector('.qv-atc').onclick = () => {
    JelwoStore.addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, variant: modal.querySelector('.qv-variants').value, qty: 1 });
    bootstrap.Modal.getInstance(modal).hide();
    const oc = document.getElementById('cartOffcanvas');
    if (oc) bootstrap.Offcanvas.getOrCreateInstance(oc).show();
  };
  bootstrap.Modal.getOrCreateInstance(modal).show();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  JelwoStore.updateCartUI();
  JelwoStore.updateWishlistUI();
});