/**
 * Blue Doors Surabaya — Core Application Logic
 * Features: Menu Catalog Filtering, Shopping Cart System, Table Booking Reservation System
 * Backend & Midtrans Payment Gateway Connected
 */

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

// Master Products Database
const PRODUCTS_DATA = [
  { id: 'p1', name: 'Kyoto Latte', category: 'specialty', price: 42000, desc: 'Latte dingin khas Jepang dengan manis yang pas dan tekstur ekstra halus.', img: 'menus/Kyoto Latte.png', badge: 'Terfavorit' },
  { id: 'p2', name: 'Fleur Noire', category: 'specialty', price: 45000, desc: 'Racikan specialty espresso dengan sentuhan floral & keharuman alami.', img: 'menus/Fleur Noire.png', badge: 'Signature' },
  { id: 'p3', name: 'White Velvet Latte', category: 'specialty', price: 44000, desc: 'Latte lembut berminyak dengan rasa vanilla bourbon alami & susu steaming sempurna.', img: 'menus/White Velvet Latte.png', badge: 'Best Seller' },
  { id: 'p4', name: 'Swiss Latte', category: 'specialty', price: 43000, desc: 'Espresso racikan dengan sentuhan hazelnut halus & kekayaan rasa khas Swiss.', img: 'menus/Swiss Latte.png', badge: 'Populer' },
  { id: 'p5', name: 'Grand Latte', category: 'specialty', price: 42000, desc: 'Cita rasa espresso mantap dikombinasikan susu segar berkualitas.', img: 'menus/Grand Latte.png', badge: null },
  { id: 'p6', name: 'Hot Black', category: 'black', price: 35000, desc: 'Ekstraksi espresso murni hangat dengan aroma biji kopi pilihan.', img: 'menus/Hot Black.png', badge: null },
  { id: 'p7', name: 'Ice Black', category: 'black', price: 37000, desc: 'Espresso dingin yang menyegarkan dengan kejernihan rasa otentik.', img: 'menus/Ice Black.png', badge: null },
  { id: 'p8', name: 'Piccolo', category: 'black', price: 36000, desc: 'Ristretto konsentrat tinggi dengan sedikit susu lembut hangat.', img: 'menus/Piccolo.png', badge: null },
  { id: 'p9', name: 'Hot Regular White', category: 'white', price: 38000, desc: 'Kopi putih hangat berbusa halus dengan keseimbangan rasa yang pas.', img: 'menus/Hot Regular White.png', badge: null },
  { id: 'p10', name: 'Hot Large White', category: 'white', price: 42000, desc: 'Porsi besar kopi putih hangat untuk kenikmatan ngopi lebih lama.', img: 'menus/Hot Large White.png', badge: null },
  { id: 'p11', name: 'Ice White', category: 'white', price: 40000, desc: 'Kopi susu dingin klasik dengan cita rasa gurih dan manis seimbang.', img: 'menus/Ice White.png', badge: null },
  { id: 'p12', name: 'Ice Sweetened', category: 'white', price: 41000, desc: 'Kopi susu dingin dengan manis alami gula aren pilihan.', img: 'menus/Ice Sweetened.png', badge: null },
  { id: 'p13', name: 'Hot Mocha', category: 'chocolate', price: 44000, desc: 'Perpaduan sempurna espresso hangat dan cokelat artisanal pekat.', img: 'menus/Hot Mocha.png', badge: null },
  { id: 'p14', name: 'Ice Mocha', category: 'chocolate', price: 46000, desc: 'Es kopi mocha dingin berpadu siram cokelat pilihan yang kaya rasa.', img: 'menus/Ice Mocha.png', badge: null },
  { id: 'p15', name: 'Chocolate', category: 'chocolate', price: 42000, desc: 'Minuman cokelat murni kaya cita rasa tanpa espresso.', img: 'menus/Chocolate.png', badge: 'Non-Kopi' },
  { id: 'p16', name: 'Matcha', category: 'noncoffee', price: 45000, desc: 'Matcha murni khas Uji Jepang yang otentik dan menenangkan.', img: 'menus/Matcha.png', badge: 'Favorit' },
  { id: 'p17', name: 'Strawberry Matcha Latte', category: 'noncoffee', price: 48000, desc: 'Kreasi unik matcha Jepang dipadu selai stroberi segar & susu.', img: 'menus/Strawberry Matcha Latte.png', badge: 'Spesial' },
  { id: 'p18', name: 'The Au Citron', category: 'noncoffee', price: 38000, desc: 'Teh lemon dingin segar dengan wangi teh berkualitas & keasaman alami.', img: 'menus/The Au Citron.png', badge: 'Segar' }
];

// App State Management
let cart = JSON.parse(localStorage.getItem('bd_cart')) || [];

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCartDrawer();
  initBookingModal();
  initCheckoutModal();
  initLoginModal();
  updateCartBadge();
  renderPublicReservations();

  // If on produk.html
  if (document.getElementById('product-grid-container')) {
    renderProducts('all');
    initFilters();
  }
});

// Toast Notification System
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-gold);"></i> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Format Currency Utility
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

// Navbar Logic
function initNavbar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

// Cart Drawer Logic
function initCartDrawer() {
  const cartToggleBtns = document.querySelectorAll('.btn-cart-toggle');
  const closeBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');

  cartToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeModal('booking-modal');
      closeModal('checkout-modal');
      closeModal('login-modal');
    }
  });
}

function openCartDrawer() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  renderCartItems();
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }
}

function closeCartDrawer() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }
}

function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartBadge();
  showToast(`${product.name} telah ditambahkan ke keranjang.`);
}

function updateItemQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast('Item berhasil dihapus dari keranjang.');
}

function saveCart() {
  localStorage.setItem('bd_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeElements = document.querySelectorAll('.cart-badge-count');
  badgeElements.forEach(badge => {
    badge.textContent = totalCount;
  });
}

function renderCartItems() {
  const cartBody = document.getElementById('cart-items-body');
  const cartTotalEl = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-mug-hot cart-empty-icon"></i>
        <p>Keranjang belanja Anda masih kosong.</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">Pilih menu kopi kesukaan Anda dan nikmati racikan Blue Doors.</p>
      </div>
    `;
    if (cartTotalEl) cartTotalEl.textContent = formatIDR(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let total = 0;
  cartBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatIDR(item.price)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)" aria-label="Kurangi kuantitas">-</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)" aria-label="Tambah kuantitas">+</button>
          </div>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Hapus item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  if (cartTotalEl) cartTotalEl.textContent = formatIDR(total);
}

// Checkout Modal & Midtrans Integration
function initCheckoutModal() {
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      openModal('checkout-modal');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Kirim Pesanan';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses Pesanan...';
      }

      const name = document.getElementById('co-name').value;
      const phone = document.getElementById('co-phone').value;
      const method = document.getElementById('co-method').value;

      showToast('Memproses pesanan & gateway pembayaran Midtrans...', 'info');

      const localOrderRef = 'BD-ORD-' + Math.floor(100000 + Math.random() * 900000);
      const grossAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      const localOrderObj = {
        id: localOrderRef,
        customer_name: name,
        customer_phone: phone.replace(/[^0-9]/g, '') || phone,
        order_type: method,
        total_amount: grossAmount,
        items: [...cart],
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      // Save order to bd_admin_orders in localStorage for Admin Dashboard visibility
      const currentOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || [];
      currentOrders.unshift(localOrderObj);
      localStorage.setItem('bd_admin_orders', JSON.stringify(currentOrders));

      // Direct Client Sync to Supabase Cloud
      if (window.BlueDoorsDB) {
        window.BlueDoorsDB.insertOrder(localOrderObj);
      }

      // Broadcast live event to Admin Dashboard
      broadcastAdminEvent({ type: 'NEW_ORDER', order: localOrderObj });

      try {
        const response = await fetch(`${API_BASE}/orders/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, orderType: method, items: cart })
        });

        const data = await response.json();

        if (data.success && data.snapToken) {
          closeModal('checkout-modal');

          const isValidSnapToken = data.snapToken && !data.snapToken.startsWith('SANDBOX-TOKEN-');

          // Trigger Midtrans Snap Popup if valid token and SDK available
          if (isValidSnapToken && window.snap && typeof window.snap.pay === 'function') {
            window.snap.pay(data.snapToken, {
              onSuccess: function(result) {
                showToast('Pembayaran Midtrans Berhasil!', 'success');
                const orders = JSON.parse(localStorage.getItem('bd_admin_orders')) || [];
                const targetOrder = orders.find(o => o.id === data.orderId || o.id === localOrderRef);
                if (targetOrder) targetOrder.payment_status = 'paid';
                localStorage.setItem('bd_admin_orders', JSON.stringify(orders));

                if (window.BlueDoorsDB) {
                  window.BlueDoorsDB.updateOrderStatus(data.orderId || localOrderRef, 'paid');
                }

                alert(`🎉 PEMBAYARAN MIDTRANS BERHASIL!\n\nNomor Pesanan: ${data.orderId || localOrderRef}\nStatus: Lunas\nTerima kasih, ${name}!`);
                cart = [];
                saveCart();
                updateCartBadge();
              },
              onPending: function(result) {
                showToast('Menunggu Pembayaran Midtrans', 'info');
                alert(`⌛ MENUNGGU PEMBAYARAN\n\nNomor Pesanan: ${data.orderId || localOrderRef}\nSilakan selesaikan pembayaran sesuai instruksi Midtrans.`);
                cart = [];
                saveCart();
                updateCartBadge();
              },
              onError: function(result) {
                showToast('Pembayaran Gagal / Dibatalkan.', 'error');
              },
              onClose: function() {
                showToast('Jendela Pembayaran Ditutup.', 'info');
                cart = [];
                saveCart();
                updateCartBadge();
              }
            });
          } else {
            // Direct Order Confirmation Fallback
            cart = [];
            saveCart();
            updateCartBadge();
            showToast('Pesanan Berhasil Dikirim!', 'success');
            alert(`🎉 PESANAN BERHASIL DIBUAT!\n\nNomor Order: ${data.orderId || localOrderRef}\nNama: ${name}\nTipe: ${method}\n\nStaf kasir kami akan segera memproses pesanan Anda.`);
          }
        } else {
          showToast(data.message || 'Gagal memproses pembayaran.', 'error');
        }
      } catch (err) {
        console.warn('Backend server offline, using local fallback execution.', err);
        closeModal('checkout-modal');
        cart = [];
        saveCart();
        updateCartBadge();
        showToast(`Pesanan #${localOrderRef} Berhasil Dibuat!`, 'success');
        alert(`🎉 PESANAN BERHASIL DIBUAT!\n\nNomor Referensi: ${localOrderRef}\nNama Pemesan: ${name}\nNomor WA: ${phone}\nTipe Pemesanan: ${method}\n\nMerchant Midtrans ID: M294142139`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
}

// Reservation / Table Booking Logic with Backend
function initBookingModal() {
  const bookBtns = document.querySelectorAll('.btn-open-booking');
  const bookingForm = document.getElementById('booking-form');

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('booking-modal');
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('bk-name').value;
      const phone = document.getElementById('bk-phone').value;
      const date = document.getElementById('bk-date').value;
      const time = document.getElementById('bk-time').value;
      const guests = document.getElementById('bk-guests').value;
      const area = document.getElementById('bk-area').value;

      try {
        const response = await fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, date, time, guests, area })
        });
        const data = await response.json();
        closeModal('booking-modal');
        bookingForm.reset();

        const rsvRef = (data.data && data.data.id) ? data.data.id : ('BD-RSV-' + Math.floor(100000 + Math.random() * 900000));
        const newBooking = { id: rsvRef, name, phone, date, time, guests, area, status: 'Pending' };

        // Save to localStorage as well
        const currentBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || [];
        currentBookings.unshift(newBooking);
        localStorage.setItem('bd_admin_bookings', JSON.stringify(currentBookings));

        if (window.BlueDoorsDB) window.BlueDoorsDB.insertBooking(newBooking);

        // Broadcast live event to Admin Dashboard
        broadcastAdminEvent({ type: 'NEW_BOOKING', booking: newBooking });

        closeModal('booking-modal');
        bookingForm.reset();
        showToast(`Reservasi Meja #${rsvRef} Berhasil Ditentukan!`);
        alert(`☕ RESERVASI MEJA BERHASIL!\n\nKode Reservasi: ${rsvRef}\nNama: ${name}\nTanggal: ${date} (Pukul ${time})\nJumlah Tamu: ${guests} Orang\nArea Seating: ${area}\n\nLokasi: Blue Doors Surabaya\nKami menantikan kedatangan Anda!`);
      } catch (err) {
        const rsvRef = 'BD-RSV-' + Math.floor(100000 + Math.random() * 900000);
        const newBooking = { id: rsvRef, name, phone, date, time, guests, area, status: 'Pending' };

        // Save to localStorage as well
        const currentBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || [];
        currentBookings.unshift(newBooking);
        localStorage.setItem('bd_admin_bookings', JSON.stringify(currentBookings));

        if (window.BlueDoorsDB) window.BlueDoorsDB.insertBooking(newBooking);

        // Broadcast live event to Admin Dashboard
        broadcastAdminEvent({ type: 'NEW_BOOKING', booking: newBooking });

        closeModal('booking-modal');
        bookingForm.reset();
        showToast(`Reservasi Meja #${rsvRef} Berhasil!`);
        alert(`☕ RESERVASI MEJA BERHASIL!\n\nKode Reservasi: ${rsvRef}\nNama: ${name}\nTanggal: ${date} (Pukul ${time})\nJumlah Tamu: ${guests} Orang\nArea Seating: ${area}`);
      }
    });
  }
}

// Broadcast Live Admin Event
function broadcastAdminEvent(eventPayload) {
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('bluedoors_admin_events');
      bc.postMessage(eventPayload);
      bc.close();
    }
  } catch (e) {}
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Catalog Page Filters & Rendering
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderProducts(cat);
    });
  });
}

async function renderProducts(category = 'all') {
  const container = document.getElementById('product-grid-container');
  if (!container) return;

  let productsList = PRODUCTS_DATA;
  try {
    const res = await fetch(`${API_BASE}/products`);
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      productsList = json.data;
    }
  } catch (e) {
    // Fallback to PRODUCTS_DATA
  }

  const adminMenuData = JSON.parse(localStorage.getItem('bd_admin_menu')) || [];

  const filtered = category === 'all' 
    ? productsList 
    : productsList.filter(p => p.category === category);

  container.innerHTML = filtered.map(p => {
    const adminItem = adminMenuData.find(m => m.id === p.id);
    const isAvailable = p.inStock !== false && (adminItem ? adminItem.inStock : true);

    return `
      <div class="product-card" style="${!isAvailable ? 'opacity: 0.75;' : ''}">
        <div class="product-img-wrapper">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${!isAvailable ? `<span class="product-badge" style="color: #DC2626; border-color: #FCA5A5;">Stok Habis</span>` : (p.badge ? `<span class="product-badge">${p.badge}</span>` : '')}
        </div>
        <div class="product-info">
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-footer">
            <span class="product-price">${formatIDR(p.price)}</span>
            ${isAvailable ? `
              <button class="btn-add-cart" onclick="addToCart('${p.id}')">
                <i class="fa-solid fa-plus"></i> Pesan
              </button>
            ` : `
              <button class="btn-add-cart" disabled style="opacity: 0.6; cursor: not-allowed; background-color: #94A3B8;">
                <i class="fa-solid fa-ban"></i> Habis
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let currentAuthMode = 'login';

function initLoginModal() {
  const loginBtns = document.querySelectorAll('.btn-login-toggle');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('login-modal');
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email');
      const val = emailInput ? emailInput.value : '';

      try {
        await fetch(`${API_BASE}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: val, password: '***' })
        });
      } catch (err) {}

      showToast(`Selamat datang kembali, ${val || 'Pelanggan'}!`, 'success');
      closeModal('login-modal');
      loginBtns.forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span>Akun Saya</span>`;
      });
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const contact = document.getElementById('reg-contact').value;
      const password = document.getElementById('reg-password').value;
      const passwordConfirm = document.getElementById('reg-password-confirm').value;

      if (password !== passwordConfirm) {
        showToast('Konfirmasi kata sandi tidak cocok!', 'error');
        return;
      }

      // Save user to localStorage so Admin Dashboard immediately reflects new user
      const currentUsers = JSON.parse(localStorage.getItem('bd_admin_users')) || [
        { id: 'USR-001', name: 'Ahmad Rizky', phone: '6281234567891', favoriteArea: 'Indoor AC', totalVisits: 8, status: 'Aktif' },
        { id: 'USR-002', name: 'Siti Sarah', phone: '6281987654321', favoriteArea: 'Outdoor Garden', totalVisits: 5, status: 'Aktif' },
        { id: 'USR-003', name: 'Budi Pratama', phone: '6281345678902', favoriteArea: 'Espresso Bar', totalVisits: 12, status: 'VIP' },
        { id: 'USR-004', name: 'Dewi Lestari', phone: '6281567890123', favoriteArea: 'Indoor AC', totalVisits: 3, status: 'Aktif' },
        { id: 'USR-005', name: 'Hendra Gunawan', phone: '6281789012345', favoriteArea: 'Outdoor Garden', totalVisits: 15, status: 'VIP' }
      ];

      const cleanPhone = contact.trim();
      const uniqueId = 'USR-' + Math.floor(10000 + Math.random() * 90000);
      const newUser = {
        id: uniqueId,
        name: name.trim(),
        phone: cleanPhone,
        favoriteArea: 'Indoor AC',
        totalVisits: 1,
        status: 'Aktif'
      };

      currentUsers.push(newUser);
      localStorage.setItem('bd_admin_users', JSON.stringify(currentUsers));

      // Direct Client Sync to Supabase Cloud
      if (window.BlueDoorsDB) {
        try {
          await window.BlueDoorsDB.insertUser(newUser);
        } catch(e) {}
      }

      try {
        await fetch(`${API_BASE}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, contact, password })
        });
      } catch (err) {}

      showToast(`Selamat ${name}, akun Anda berhasil dibuat!`, 'success');
      closeModal('login-modal');
      registerForm.reset();

      loginBtns.forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span>Akun Saya</span>`;
      });
    });
  }
}

function toggleAuthMode() {
  const modalTitle = document.getElementById('login-modal-title');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleBtn = document.getElementById('btn-toggle-auth');

  if (currentAuthMode === 'login') {
    currentAuthMode = 'register';
    if (modalTitle) modalTitle.textContent = 'Daftar Akun Blue Doors';
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (toggleText) toggleText.textContent = 'Sudah memiliki akun?';
    if (toggleBtn) toggleBtn.textContent = 'Masuk';
  } else {
    currentAuthMode = 'login';
    if (modalTitle) modalTitle.textContent = 'Masuk ke Blue Doors';
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (toggleText) toggleText.textContent = 'Belum memiliki akun?';
    if (toggleBtn) toggleBtn.textContent = 'Daftar Akun Baru';
  }
}

// Live Public Reservation Schedule & History
let allPublicBookings = [];

async function renderPublicReservations() {
  const container = document.getElementById('public-reservation-grid');
  if (!container) return;

  const defaultBookings = [
    { id: 'BD-RSV-849201', name: 'Ahmad Rizky', phone: '081234567891', date: '2026-09-24', time: '14:30', guests: '3-4', area: 'Indoor AC', status: 'Dikonfirmasi' },
    { id: 'BD-RSV-719302', name: 'Siti Sarah', phone: '081987654321', date: '2026-09-24', time: '16:00', guests: '5-8', area: 'Outdoor Garden', status: 'Pending' },
    { id: 'BD-RSV-391048', name: 'Budi Pratama', phone: '081345678902', date: '2026-09-24', time: '19:00', guests: '1-2', area: 'Espresso Bar', status: 'Dikonfirmasi' },
    { id: 'BD-RSV-102948', name: 'Dewi Lestari', phone: '081567890123', date: '2026-09-25', time: '10:00', guests: '3-4', area: 'Indoor AC', status: 'Pending' }
  ];

  let bookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || defaultBookings;

  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      bookings = json.data;
    }
  } catch(e) {}

  allPublicBookings = bookings;
  displayPublicReservations(allPublicBookings);
}

function displayPublicReservations(list) {
  const container = document.getElementById('public-reservation-grid');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem 1rem;">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-brand);"></i>
        <p>Tidak ada data reservasi meja yang ditemukan.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    const isConfirmed = b.status === 'Dikonfirmasi' || b.status === 'Selesai';
    const nameParts = b.name ? b.name.split(' ') : ['Tamu'];
    const initialName = nameParts[0] + (nameParts[1] ? ' ' + nameParts[1][0] + '.' : '');

    return `
      <div class="reservation-card-item">
        <div>
          <div class="rsv-card-header">
            <span class="rsv-code">${b.id}</span>
            <span class="rsv-badge ${isConfirmed ? 'confirmed' : 'pending'}">
              <i class="fa-solid ${isConfirmed ? 'fa-circle-check' : 'fa-clock'}"></i>
              ${b.status || 'Pending'}
            </span>
          </div>
          <div class="rsv-guest-name">${initialName}</div>
          <div class="rsv-details">
            <div><i class="fa-solid fa-calendar-day"></i> ${b.date || '-'} (Jam ${b.time || '-'})</div>
            <div><i class="fa-solid fa-users"></i> ${b.guests || '1-2'} Orang</div>
            <div><i class="fa-solid fa-chair"></i> Area: ${b.area || 'Indoor AC'}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterPublicReservations() {
  const input = document.getElementById('rsv-search-input');
  if (!input) return;
  const q = input.value.toLowerCase().trim();

  if (!q) {
    displayPublicReservations(allPublicBookings);
    return;
  }

  const filtered = allPublicBookings.filter(b => 
    (b.id && b.id.toLowerCase().includes(q)) ||
    (b.name && b.name.toLowerCase().includes(q)) ||
    (b.phone && b.phone.toLowerCase().includes(q)) ||
    (b.area && b.area.toLowerCase().includes(q))
  );

  displayPublicReservations(filtered);
}

/* ========================================================
   REAL-TIME ORDER COMPLETION LIVE NOTIFICATION SYSTEM
   ======================================================== */

// Web Audio API Synth Chime (no external mp3 file required)
function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    
    // Play a pleasant C-Major 3-note melodic chime (C5 -> G5 -> C6)
    const notes = [523.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.65);
    });
  } catch (e) {
    console.log('Audio chime auto-play blocked or unsupported:', e);
  }
}

// Render Live Notification Banner on User Screen
// Notification History Storage & UI Management
function getStoredNotifications() {
  try {
    return JSON.parse(localStorage.getItem('bd_user_notifications')) || [];
  } catch(e) {
    return [];
  }
}

function saveStoredNotifications(list) {
  try {
    localStorage.setItem('bd_user_notifications', JSON.stringify(list));
  } catch(e) {}
  updateNotifBadgeCount();
  renderNotificationList();
}

function updateNotifBadgeCount() {
  const notifs = getStoredNotifications();
  const badges = document.querySelectorAll('.notif-badge-count');
  const count = notifs.length;
  badges.forEach(b => {
    b.textContent = count;
    b.setAttribute('data-count', count);
    b.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function renderNotificationList() {
  const container = document.getElementById('notif-body-list');
  if (!container) return;

  const list = getStoredNotifications();

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="empty-notif-state">
        <i class="fa-solid fa-bell-slash"></i>
        <p style="font-weight: 700; color: var(--primary-navy); margin-bottom: 0.25rem;">Belum Ada Notifikasi</p>
        <p style="font-size: 0.825rem; color: var(--text-muted); margin: 0;">Notifikasi status pesanan Anda akan tersimpan di sini.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="notif-card-item" id="notif-item-${n.id}">
      <div class="notif-card-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div class="notif-card-content">
        <div class="notif-card-header">
          <span class="notif-card-title">PESANAN SELESAI</span>
          <span class="notif-card-time">${n.timestamp || ''}</span>
        </div>
        <div class="notif-card-badge">${n.orderId || 'BD-ORD'}</div>
        <p class="notif-card-msg">
          Pesanan atas nama <strong>${n.customerName || 'Pelanggan'}</strong> telah diselesaikan & lunas.
        </p>
      </div>
      <button type="button" class="btn-delete-notif" onclick="deleteSingleNotification('${n.id}')" title="Hapus Notifikasi Ini" aria-label="Hapus Notifikasi">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

function openNotifDrawer() {
  const drawer = document.getElementById('notif-drawer');
  const overlay = document.getElementById('notif-overlay');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
  renderNotificationList();
}

function closeNotifDrawer() {
  const drawer = document.getElementById('notif-drawer');
  const overlay = document.getElementById('notif-overlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function toggleNotifDrawer() {
  const drawer = document.getElementById('notif-drawer');
  if (drawer && drawer.classList.contains('active')) {
    closeNotifDrawer();
  } else {
    openNotifDrawer();
  }
}

function deleteSingleNotification(notifId) {
  let list = getStoredNotifications();
  list = list.filter(n => n.id !== notifId);
  saveStoredNotifications(list);
}

function clearAllNotifications() {
  if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat notifikasi pesanan?')) {
    saveStoredNotifications([]);
  }
}

// Mobile Smartphone AudioContext Unlocker
let userAudioCtx = null;
function unlockUserAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !userAudioCtx) {
      userAudioCtx = new AudioCtx();
    }
    if (userAudioCtx && userAudioCtx.state === 'suspended') {
      userAudioCtx.resume();
    }
  } catch(e) {}
}

window.addEventListener('touchstart', unlockUserAudio, { passive: true });
window.addEventListener('click', unlockUserAudio, { passive: true });

// Web Audio API Chime Sound Synthesizer for User Notifier
function playUserAudioChime() {
  try {
    unlockUserAudio();
    const ctx = userAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();

    // Note 1 (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2 (B5 - 987.77Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Session Event Deduplication Tracker (Strictly prevents repetitive spam notifications)
const notifiedOrderEvents = new Set();
const notifiedBookingEvents = new Set();

// Seed initial notifications already stored in localStorage into tracker
try {
  const existingInbox = getStoredNotifications();
  existingInbox.forEach(n => {
    if (n.orderId && n.status) {
      notifiedOrderEvents.add(`${n.orderId}_${String(n.status).toLowerCase()}`);
    }
    if (n.bookingId && n.status) {
      notifiedBookingEvents.add(`${n.bookingId}_${String(n.status).toLowerCase()}`);
    }
  });
} catch(e) {}

// Render Live Notification Banner for Orders on User Screen & Save to Inbox
function showLiveOrderNotification(data) {
  const orderId = data.orderId || data.id || 'BD-ORD';
  const status = (data.status || 'confirmed').toLowerCase();
  const eventKey = `${orderId}_${status}`;

  // STRICT GUARD: If this exact status event was already notified to the user, DO NOT notify again!
  if (notifiedOrderEvents.has(eventKey)) {
    return;
  }
  notifiedOrderEvents.add(eventKey);

  let titleText = 'STATUS PESANAN DIPERBARUI';
  let descText = `Pesanan atas nama <strong>${data.customerName || 'Pelanggan'}</strong> telah diperbarui oleh kasir/admin.`;
  let iconClass = 'fa-bell-concierge';

  if (status === 'confirmed' || status === 'diterima') {
    titleText = 'PESANAN ANDA DITERIMA!';
    descText = `Pesanan atas nama <strong>${data.customerName || 'Pelanggan'}</strong> telah dikonfirmasi & sedang diracik oleh barista Blue Doors.`;
    iconClass = 'fa-cookie-bite';
  } else if (status === 'ready' || status === 'siap' || status === 'siap ambil') {
    titleText = 'PESANAN SIAP DIAMBIL!';
    descText = `Pesanan atas nama <strong>${data.customerName || 'Pelanggan'}</strong> sudah SIAP! Silakan ambil di counter / tunggu kurir.`;
    iconClass = 'fa-bag-shopping';
  } else if (status === 'paid' || status === 'lunas' || status === 'settlement' || status === 'selesai') {
    titleText = 'PESANAN SELESAI & LUNAS!';
    descText = `Pesanan atas nama <strong>${data.customerName || 'Pelanggan'}</strong> telah diselesaikan. Terima kasih!`;
    iconClass = 'fa-circle-check';
  }

  // Save to notification history inbox!
  const notifId = 'NOTIF-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  const currentNotifs = getStoredNotifications();
  currentNotifs.unshift({
    id: notifId,
    orderId: orderId,
    customerName: data.customerName || 'Pelanggan',
    title: titleText,
    desc: descText,
    status: status,
    timestamp: nowStr,
    rawTime: Date.now()
  });
  saveStoredNotifications(currentNotifs);

  // Remove any existing toast banner first
  const existing = document.getElementById('live-order-notification-banner');
  if (existing) existing.remove();

  // Play audio chime sound immediately!
  playUserAudioChime();

  const banner = document.createElement('div');
  banner.id = 'live-order-notification-banner';
  banner.className = 'live-order-notification';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');

  banner.innerHTML = `
    <div class="lon-content">
      <div class="lon-icon-box">
        <i class="fa-solid ${iconClass}"></i>
      </div>
      <div class="lon-text-body">
        <div class="lon-header">
          <span class="lon-title">${titleText}</span>
          <span class="lon-badge">${orderId}</span>
        </div>
        <p class="lon-desc">${descText}</p>
      </div>
      <button type="button" class="lon-close-btn" onclick="dismissLiveNotification()" aria-label="Tutup Notifikasi">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  // Auto dismiss toast banner after 10 seconds
  setTimeout(() => {
    dismissLiveNotification();
  }, 10000);
}

// Render Live Notification Banner for Bookings on User Screen & Save to Inbox
function showLiveBookingNotification(data) {
  const bookingId = data.id || data.bookingId || 'BD-RSV';
  const status = data.status || 'Dikonfirmasi';
  const eventKey = `${bookingId}_${String(status).toLowerCase()}`;

  // STRICT GUARD: If this booking event was already notified, DO NOT notify again!
  if (notifiedBookingEvents.has(eventKey)) {
    return;
  }
  notifiedBookingEvents.add(eventKey);

  let titleText = 'RESERVASI MEJA DIKONFIRMASI!';
  let descText = `Reservasi meja atas nama <strong>${data.name || 'Pelanggan'}</strong> (${data.guests || '1-2'} orang — ${data.date} ${data.time}) telah dikonfirmasi oleh cafe.`;
  let iconClass = 'fa-calendar-check';

  if (status === 'Selesai') {
    titleText = 'RESERVASI MEJA SELESAI!';
    descText = `Reservasi meja atas nama <strong>${data.name || 'Pelanggan'}</strong> telah selesai. Terima kasih telah berkunjung ke Blue Doors!`;
    iconClass = 'fa-circle-check';
  } else if (status === 'Batal' || status === 'Dibatalkan') {
    titleText = 'RESERVASI MEJA DIBATALKAN';
    descText = `Reservasi meja atas nama <strong>${data.name || 'Pelanggan'}</strong> telah dibatalkan.`;
    iconClass = 'fa-calendar-xmark';
  }

  // Save to notification history inbox
  const notifId = 'NOTIF-RSV-' + Date.now();
  const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  const currentNotifs = getStoredNotifications();
  currentNotifs.unshift({
    id: notifId,
    bookingId: bookingId,
    customerName: data.name || 'Pelanggan',
    title: titleText,
    desc: descText,
    status: status,
    timestamp: nowStr,
    rawTime: Date.now()
  });
  saveStoredNotifications(currentNotifs);

  // Play audio chime
  playUserAudioChime();

  // Toast Banner
  const existing = document.getElementById('live-order-notification-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'live-order-notification-banner';
  banner.className = 'live-order-notification';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');

  banner.innerHTML = `
    <div class="lon-content">
      <div class="lon-icon-box" style="background-color: var(--primary-navy);">
        <i class="fa-solid ${iconClass}"></i>
      </div>
      <div class="lon-text-body">
        <div class="lon-header">
          <span class="lon-title">${titleText}</span>
          <span class="lon-badge">${bookingId}</span>
        </div>
        <p class="lon-desc">${descText}</p>
      </div>
      <button type="button" class="lon-close-btn" onclick="dismissLiveNotification()" aria-label="Tutup Notifikasi">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;

  document.body.appendChild(banner);
  setTimeout(() => dismissLiveNotification(), 10000);
}

function dismissLiveNotification() {
  const banner = document.getElementById('live-order-notification-banner');
  if (banner) {
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 400);
  }
}

// Live Listener Initialization (BroadcastChannel + LocalStorage Polling + Active Cloud Supabase Polling)
function initLiveOrderNotifier() {
  updateNotifBadgeCount();

  let lastSeenOrders = {};
  let lastSeenBookings = {};

  // Initialize status cache from localStorage & Supabase
  try {
    const localOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || [];
    localOrders.forEach(o => { lastSeenOrders[o.id] = o.payment_status || 'pending'; });

    const localBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || [];
    localBookings.forEach(b => { lastSeenBookings[b.id] = b.status || 'Pending'; });
  } catch(e) {}

  // 1. BroadcastChannel for Instant Tab-to-Tab Broadcast (0ms latency on same device)
  if ('BroadcastChannel' in window) {
    const bc = new BroadcastChannel('bluedoors_orders_channel');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'ORDER_STATUS_CHANGED') {
        if (event.data.orderId && event.data.status) {
          lastSeenOrders[event.data.orderId] = event.data.status;
        }
        showLiveOrderNotification(event.data);
      }
    };
  }

  // 2. Active Cloud Polling every 4 seconds from Supabase Cloud DB (Cross-Device: Laptop Admin -> Smartphone User)
  setInterval(async () => {
    // A. Check LocalStorage status changes first
    try {
      const currentOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || [];
      currentOrders.forEach(o => {
        const prevStatus = lastSeenOrders[o.id];
        const newStatus = o.payment_status;
        if (prevStatus && prevStatus !== newStatus) {
          showLiveOrderNotification({
            orderId: o.id,
            customerName: o.customer_name || 'Pelanggan',
            status: newStatus,
            totalAmount: o.total_amount
          });
        }
        lastSeenOrders[o.id] = newStatus;
      });

      const currentBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || [];
      currentBookings.forEach(b => {
        const prevStatus = lastSeenBookings[b.id];
        const newStatus = b.status;
        if (prevStatus && prevStatus !== newStatus) {
          showLiveBookingNotification(b);
        }
        lastSeenBookings[b.id] = newStatus;
      });
    } catch(e) {}

    // B. Check Supabase Cloud DB for Cross-Device updates (Admin on laptop -> User on HP)
    if (window.BlueDoorsDB) {
      try {
        const dbOrders = await window.BlueDoorsDB.fetchOrders();
        if (dbOrders && dbOrders.length > 0) {
          dbOrders.forEach(o => {
            const prevStatus = lastSeenOrders[o.id];
            const newStatus = o.payment_status;
            if (prevStatus && prevStatus !== newStatus) {
              showLiveOrderNotification({
                orderId: o.id,
                customerName: o.customer_name || 'Pelanggan',
                status: newStatus,
                totalAmount: o.total_amount
              });
            }
            lastSeenOrders[o.id] = newStatus;
          });
        }

        const dbBookings = await window.BlueDoorsDB.fetchBookings();
        if (dbBookings && dbBookings.length > 0) {
          dbBookings.forEach(b => {
            const prevStatus = lastSeenBookings[b.id];
            const newStatus = b.status;
            if (prevStatus && prevStatus !== newStatus) {
              showLiveBookingNotification(b);
            }
            lastSeenBookings[b.id] = newStatus;
          });
        }
      } catch(e) {}
    }
  }, 4000);
}

// Run live notifier listener when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initLiveOrderNotifier();
});



