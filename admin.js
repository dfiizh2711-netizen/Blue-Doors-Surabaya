/**
 * Blue Doors Surabaya — Admin Dashboard Management Script
 * Features: Menu Stock Control, Table Reservation Control, Customer Directory, Tab Navigation
 * Storage: HTML5 localStorage sync with main app catalog & booking data
 */

// Initial Seed Data for Admin Management
const INITIAL_MENU_ITEMS = [
  { id: 'p1', name: 'Kyoto Latte', category: 'Specialty Latte', price: 42000, inStock: true, img: 'menus/Kyoto Latte.png' },
  { id: 'p2', name: 'Fleur Noire', category: 'Specialty Latte', price: 45000, inStock: true, img: 'menus/Fleur Noire.png' },
  { id: 'p3', name: 'White Velvet Latte', category: 'Specialty Latte', price: 44000, inStock: true, img: 'menus/White Velvet Latte.png' },
  { id: 'p4', name: 'Swiss Latte', category: 'Specialty Latte', price: 43000, inStock: true, img: 'menus/Swiss Latte.png' },
  { id: 'p5', name: 'Grand Latte', category: 'Specialty Latte', price: 42000, inStock: true, img: 'menus/Grand Latte.png' },
  { id: 'p6', name: 'Hot Black', category: 'Espresso & Black', price: 35000, inStock: true, img: 'menus/Hot Black.png' },
  { id: 'p7', name: 'Ice Black', category: 'Espresso & Black', price: 37000, inStock: true, img: 'menus/Ice Black.png' },
  { id: 'p8', name: 'Piccolo', category: 'Espresso & Black', price: 36000, inStock: true, img: 'menus/Piccolo.png' },
  { id: 'p9', name: 'Hot Regular White', category: 'White Coffee', price: 38000, inStock: true, img: 'menus/Hot Regular White.png' },
  { id: 'p10', name: 'Hot Large White', category: 'White Coffee', price: 42000, inStock: true, img: 'menus/Hot Large White.png' },
  { id: 'p11', name: 'Ice White', category: 'White Coffee', price: 40000, inStock: true, img: 'menus/Ice White.png' },
  { id: 'p12', name: 'Ice Sweetened', category: 'White Coffee', price: 41000, inStock: true, img: 'menus/Ice Sweetened.png' },
  { id: 'p13', name: 'Hot Mocha', category: 'Cokelat & Mocha', price: 44000, inStock: true, img: 'menus/Hot Mocha.png' },
  { id: 'p14', name: 'Ice Mocha', category: 'Cokelat & Mocha', price: 46000, inStock: true, img: 'menus/Ice Mocha.png' },
  { id: 'p15', name: 'Chocolate', category: 'Cokelat & Mocha', price: 42000, inStock: true, img: 'menus/Chocolate.png' },
  { id: 'p16', name: 'Matcha', category: 'Non-Kopi & Tea', price: 45000, inStock: true, img: 'menus/Matcha.png' },
  { id: 'p17', name: 'Strawberry Matcha Latte', category: 'Non-Kopi & Tea', price: 48000, inStock: true, img: 'menus/Strawberry Matcha Latte.png' },
  { id: 'p18', name: 'The Au Citron', category: 'Non-Kopi & Tea', price: 38000, inStock: true, img: 'menus/The Au Citron.png' }
];

const INITIAL_BOOKINGS = [
  { id: 'BD-RSV-849201', name: 'Ahmad Rizky', phone: '081234567891', date: '2026-09-24', time: '14:30', guests: '3-4', area: 'Indoor AC', status: 'Dikonfirmasi' },
  { id: 'BD-RSV-719302', name: 'Siti Sarah', phone: '081987654321', date: '2026-09-24', time: '16:00', guests: '5-8', area: 'Outdoor Garden', status: 'Pending' },
  { id: 'BD-RSV-391048', name: 'Budi Pratama', phone: '081345678902', date: '2026-09-24', time: '19:00', guests: '1-2', area: 'Espresso Bar', status: 'Dikonfirmasi' },
  { id: 'BD-RSV-102948', name: 'Dewi Lestari', phone: '081567890123', date: '2026-09-25', time: '10:00', guests: '3-4', area: 'Indoor AC', status: 'Pending' }
];

const INITIAL_USERS = [
  { id: 'USR-001', name: 'Ahmad Rizky', phone: '6281234567891', favoriteArea: 'Indoor AC', totalVisits: 8, status: 'Aktif' },
  { id: 'USR-002', name: 'Siti Sarah', phone: '6281987654321', favoriteArea: 'Outdoor Garden', totalVisits: 5, status: 'Aktif' },
  { id: 'USR-003', name: 'Budi Pratama', phone: '6281345678902', favoriteArea: 'Espresso Bar', totalVisits: 12, status: 'VIP' },
  { id: 'USR-004', name: 'Dewi Lestari', phone: '6281567890123', favoriteArea: 'Indoor AC', totalVisits: 3, status: 'Aktif' },
  { id: 'USR-005', name: 'Hendra Gunawan', phone: '6281789012345', favoriteArea: 'Outdoor Garden', totalVisits: 15, status: 'VIP' }
];

const INITIAL_ORDERS = [
  {
    id: 'BD-ORD-948120',
    customer_name: 'Budi Santoso',
    customer_phone: '6281234567890',
    order_type: 'Dine-in / Minum di Tempat',
    total_amount: 87000,
    items: [
      { id: 'p1', name: 'Kyoto Latte', price: 42000, qty: 1 },
      { id: 'p2', name: 'Fleur Noire', price: 45000, qty: 1 }
    ],
    payment_status: 'paid',
    created_at: new Date().toISOString()
  },
  {
    id: 'BD-ORD-381920',
    customer_name: 'Siti Sarah',
    customer_phone: '6281987654321',
    order_type: 'Takeaway / Bawa Pulang',
    total_amount: 48000,
    items: [
      { id: 'p17', name: 'Strawberry Matcha Latte', price: 48000, qty: 1 }
    ],
    payment_status: 'pending',
    created_at: new Date().toISOString()
  }
];

// App Local Storage State
let adminMenu = JSON.parse(localStorage.getItem('bd_admin_menu')) || INITIAL_MENU_ITEMS;
let adminBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || INITIAL_BOOKINGS;
let adminUsers = JSON.parse(localStorage.getItem('bd_admin_users')) || INITIAL_USERS;
let adminOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || INITIAL_ORDERS;

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminAuthForm();
  initTabSwitching();
  initMobileSidebar();
  initAdminModals();
  renderAllAdminData();
});

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('bd_admin_session') === 'true';
  const overlay = document.getElementById('admin-auth-overlay');
  const dashboard = document.getElementById('admin-dashboard-layout');

  if (isAuth) {
    if (overlay) overlay.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }
}

function initAdminAuthForm() {
  const form = document.getElementById('admin-gatekeeper-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('gk-username').value;
      const p = document.getElementById('gk-password').value;

      if (u === 'admin' && p === 'admin123') {
        sessionStorage.setItem('bd_admin_session', 'true');
        checkAdminAuth();
      } else {
        alert('Kredensial Admin Salah! Gunakan username: admin dan password: admin123');
      }
    });
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('bd_admin_session');
  checkAdminAuth();
}

// Format Currency Utility
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

// Tab Switching Handler
function initTabSwitching() {
  const navLinks = document.querySelectorAll('.admin-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      switchAdminTab(targetTab);
    });
  });
}

function switchAdminTab(tabId) {
  // Update Nav Links
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.admin-nav-link[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Update Tab Contents
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const activeContent = document.getElementById(tabId);
  if (activeContent) activeContent.classList.add('active');

  // Update Header Title
  const titles = {
    'tab-overview': 'Dashboard Overview',
    'tab-menu': 'Manajemen Stok & Menu',
    'tab-booking': 'Manajemen Booking Meja',
    'tab-users': 'Manajemen Pelanggan & User',
    'tab-orders': 'Manajemen Pesanan User & Midtrans'
  };
  const titleEl = document.getElementById('current-tab-title');
  if (titleEl) titleEl.textContent = titles[tabId] || 'Admin Portal';

  // Close mobile sidebar if open
  closeMobileSidebar();
}

// Mobile Sidebar Handler
function initMobileSidebar() {
  const toggleBtn = document.getElementById('admin-menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }
}

// Render Core Admin Data
async function renderAllAdminData() {
  adminMenu = JSON.parse(localStorage.getItem('bd_admin_menu')) || INITIAL_MENU_ITEMS;
  adminBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || INITIAL_BOOKINGS;
  adminUsers = JSON.parse(localStorage.getItem('bd_admin_users')) || INITIAL_USERS;
  adminOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || INITIAL_ORDERS;

  try {
    const resUsers = await fetch('http://localhost:5000/api/users');
    const jsonUsers = await resUsers.json();
    if (jsonUsers.success && jsonUsers.data && jsonUsers.data.length > 0) {
      adminUsers = jsonUsers.data;
    }

    const resOrders = await fetch('http://localhost:5000/api/orders');
    const jsonOrders = await resOrders.json();
    if (jsonOrders.success && jsonOrders.data && jsonOrders.data.length > 0) {
      adminOrders = jsonOrders.data;
    }
  } catch(e) {}

  // Direct Supabase Client Sync
  if (window.BlueDoorsDB) {
    try {
      const dbUsers = await window.BlueDoorsDB.fetchUsers();
      if (dbUsers && dbUsers.length > 0) {
        adminUsers = dbUsers.map(u => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          favoriteArea: u.favorite_area || u.favoriteArea || 'Indoor AC',
          totalVisits: u.total_visits || u.totalVisits || 1,
          status: u.status || 'Aktif'
        }));
      }

      const dbOrders = await window.BlueDoorsDB.fetchOrders();
      if (dbOrders && dbOrders.length > 0) {
        adminOrders = dbOrders;
      }

      const dbBookings = await window.BlueDoorsDB.fetchBookings();
      if (dbBookings && dbBookings.length > 0) {
        adminBookings = dbBookings;
      }
    } catch(err) {
      console.warn('Supabase fetch in admin failed:', err);
    }
  }

  renderKPIs();
  renderOverviewBookings();
  renderMenuTable();
  renderBookingTable();
  renderUserTable();
  renderOrderTable();
}

function renderKPIs() {
  const availableCount = adminMenu.filter(m => m.inStock).length;
  const activeBookingsCount = adminBookings.filter(b => b.status === 'Pending' || b.status === 'Dikonfirmasi').length;
  const totalRevenue = adminOrders.reduce((sum, o) => {
    const isPaid = o.payment_status === 'paid' || o.payment_status === 'settlement' || o.payment_status === 'Lunas';
    return sum + (isPaid ? Number(o.total_amount || 0) : 0);
  }, 0);

  const revenueEl = document.getElementById('kpi-revenue');
  if (revenueEl) revenueEl.textContent = formatIDR(totalRevenue || 135000);

  const menuEl = document.getElementById('kpi-menu-count');
  if (menuEl) menuEl.textContent = `${availableCount} / ${adminMenu.length} Item`;

  const bookingEl = document.getElementById('kpi-bookings');
  if (bookingEl) bookingEl.textContent = `${activeBookingsCount} Meja`;

  const userEl = document.getElementById('kpi-users-count');
  if (userEl) userEl.textContent = `${adminUsers.length} User`;
}

// Render Overview Table
function renderOverviewBookings() {
  const tbody = document.getElementById('overview-booking-rows');
  if (!tbody) return;

  const recent = adminBookings.slice(0, 4);
  tbody.innerHTML = recent.map(b => `
    <tr>
      <td style="font-weight: 700; color: var(--primary-navy);">${b.id}</td>
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.date} (${b.time})</td>
      <td>${b.guests} Orang</td>
      <td>${b.area}</td>
      <td><span class="status-badge ${getStatusClass(b.status)}">${b.status}</span></td>
    </tr>
  `).join('');
}

// Render Menu Stock Table
function renderMenuTable() {
  const tbody = document.getElementById('admin-menu-rows');
  if (!tbody) return;

  tbody.innerHTML = adminMenu.map(m => `
    <tr>
      <td>
        <img src="${m.img}" alt="${m.name}" style="width: 44px; height: 44px; object-fit: contain; background: #F8F4EE; border-radius: 6px; padding: 4px;">
      </td>
      <td style="font-weight: 700; color: var(--primary-navy);">${m.name}</td>
      <td>${m.category}</td>
      <td style="font-weight: 700; color: var(--primary-brand);">${formatIDR(m.price)}</td>
      <td>
        <span class="status-badge ${m.inStock ? 'status-available' : 'status-empty'}">
          ${m.inStock ? 'Tersedia' : 'Stok Habis'}
        </span>
      </td>
      <td class="col-action">
        <div class="action-btn-group">
          <button class="btn ${m.inStock ? 'btn-secondary' : 'btn-primary'} btn-sm btn-action-main" onclick="toggleMenuStock('${m.id}')">
            ${m.inStock ? 'Tandai Habis' : 'Set Tersedia'}
          </button>
          <button class="btn btn-secondary btn-sm btn-action-secondary" style="color: #DC2626; border-color: #FCA5A5; background-color: #FEF2F2;" onclick="deleteMenuItem('${m.id}')" title="Hapus Menu">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleMenuStock(id) {
  const item = adminMenu.find(m => m.id === id);
  if (item) {
    item.inStock = !item.inStock;
    localStorage.setItem('bd_admin_menu', JSON.stringify(adminMenu));
    renderAllAdminData();
  }
}

function deleteMenuItem(id) {
  if (confirm('Apakah Anda yakin ingin menghapus menu ini dari katalog?')) {
    adminMenu = adminMenu.filter(m => m.id !== id);
    localStorage.setItem('bd_admin_menu', JSON.stringify(adminMenu));
    renderAllAdminData();
  }
}

// Render Booking Table
function renderBookingTable() {
  const tbody = document.getElementById('admin-booking-rows');
  if (!tbody) return;

  tbody.innerHTML = adminBookings.map(b => {
    let mainActionBtn = '';
    if (b.status === 'Pending') {
      mainActionBtn = `<button class="btn btn-primary btn-sm btn-action-main" onclick="updateBookingStatus('${b.id}', 'Dikonfirmasi')">Konfirmasi</button>`;
    } else if (b.status === 'Dikonfirmasi') {
      mainActionBtn = `<button class="btn btn-secondary btn-sm btn-action-main" style="color: #0F2C59; border-color: #0F2C59;" onclick="updateBookingStatus('${b.id}', 'Selesai')">Selesai</button>`;
    } else {
      mainActionBtn = `<button class="btn btn-secondary btn-sm btn-action-main" disabled style="opacity: 0.65; cursor: default;"><i class="fa-solid fa-check-double"></i> Selesai</button>`;
    }

    return `
      <tr>
        <td style="font-weight: 700; color: var(--primary-navy);">${b.id}</td>
        <td style="font-weight: 600;">${b.name}</td>
        <td>${b.phone}</td>
        <td>${b.date} (Jam ${b.time})</td>
        <td>${b.guests} Orang</td>
        <td>${b.area}</td>
        <td><span class="status-badge ${getStatusClass(b.status)}">${b.status}</span></td>
        <td class="col-action">
          <div class="action-btn-group">
            ${mainActionBtn}
            <button class="btn btn-secondary btn-sm btn-action-secondary" style="color: #DC2626; border-color: #FCA5A5; background-color: #FEF2F2;" onclick="deleteBooking('${b.id}')">Batal</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateBookingStatus(id, newStatus) {
  const b = adminBookings.find(item => item.id === id);
  if (b) {
    b.status = newStatus;
    localStorage.setItem('bd_admin_bookings', JSON.stringify(adminBookings));
    renderAllAdminData();
  }
}

function deleteBooking(id) {
  if (confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
    adminBookings = adminBookings.filter(b => b.id !== id);
    localStorage.setItem('bd_admin_bookings', JSON.stringify(adminBookings));
    renderAllAdminData();
  }
}

// Render User Directory Table
function renderUserTable() {
  const tbody = document.getElementById('admin-user-rows');
  if (!tbody) return;

  tbody.innerHTML = adminUsers.map(u => `
    <tr>
      <td style="font-weight: 700; color: var(--text-muted);">${u.id}</td>
      <td style="font-weight: 700; color: var(--primary-navy);">${u.name}</td>
      <td>+${u.phone}</td>
      <td>${u.favoriteArea}</td>
      <td><strong>${u.totalVisits}</strong> kali</td>
      <td><span class="status-badge ${u.status === 'VIP' ? 'status-confirmed' : 'status-available'}">${u.status}</span></td>
      <td class="col-action">
        <div class="action-btn-group">
          <a href="https://wa.me/${u.phone}" target="_blank" class="btn btn-secondary btn-sm btn-action-main" style="color: #059669; border-color: #A7F3D0; background-color: #ECFDF5; text-decoration: none;">
            <i class="fa-brands fa-whatsapp"></i> Hubungi WA
          </a>
        </div>
      </td>
    </tr>
  `).join('');
}

// Render Order Control Table
function renderOrderTable() {
  const tbody = document.getElementById('admin-order-rows');
  if (!tbody) return;

  if (adminOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          Belum ada data pesanan user yang masuk.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = adminOrders.map(o => {
    const itemsSummary = o.items && Array.isArray(o.items)
      ? o.items.map(i => `${i.qty}x ${i.name}`).join(', ')
      : 'Rincian Pesanan';

    const isPaid = o.payment_status === 'paid' || o.payment_status === 'settlement' || o.payment_status === 'Lunas';
    const isFailed = o.payment_status === 'failed' || o.payment_status === 'cancel' || o.payment_status === 'Batal';

    let statusBadge = '';
    if (isPaid) {
      statusBadge = `<button type="button" class="status-badge status-available" style="cursor: pointer; border: none; font-size: 0.8rem; padding: 0.3rem 0.75rem;" onclick="toggleOrderStatus('${o.id}')" title="Klik untuk ubah ke Pending"><i class="fa-solid fa-check"></i> Lunas</button>`;
    } else if (isFailed) {
      statusBadge = `<button type="button" class="status-badge status-empty" style="cursor: pointer; border: none; font-size: 0.8rem; padding: 0.3rem 0.75rem;" onclick="toggleOrderStatus('${o.id}')" title="Klik untuk ubah ke Lunas"><i class="fa-solid fa-xmark"></i> Batal</button>`;
    } else {
      statusBadge = `<button type="button" class="status-badge status-pending" style="cursor: pointer; border: none; font-size: 0.8rem; padding: 0.3rem 0.75rem;" onclick="toggleOrderStatus('${o.id}')" title="Klik untuk ubah ke Lunas"><i class="fa-solid fa-clock"></i> Pending (Klik u/ Lunas)</button>`;
    }

    const cleanPhone = o.customer_phone ? o.customer_phone.replace(/[^0-9]/g, '') : '';

    return `
      <tr>
        <td style="font-weight: 700; color: var(--primary-navy);">${o.id}</td>
        <td style="font-weight: 700;">${o.customer_name || 'Pelanggan'}</td>
        <td>+${cleanPhone || '-'}</td>
        <td>${o.order_type || 'Dine-in'}</td>
        <td style="font-size: 0.85rem; max-width: 220px; color: var(--text-muted);">${itemsSummary}</td>
        <td style="font-weight: 700; color: var(--primary-brand);">${formatIDR(o.total_amount || 0)}</td>
        <td>${statusBadge}</td>
        <td class="col-action">
          <div class="action-btn-group">
            <button class="btn ${isPaid ? 'btn-secondary' : 'btn-primary'} btn-sm btn-action-main" onclick="toggleOrderStatus('${o.id}')">
              ${isPaid ? 'Set Pending' : 'Tandai Lunas'}
            </button>
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn btn-secondary btn-sm btn-action-secondary" style="color: #059669; border-color: #A7F3D0; background-color: #ECFDF5; text-decoration: none;" title="Hubungi WA">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            ` : ''}
            <button class="btn btn-secondary btn-sm btn-action-secondary" style="color: #DC2626; border-color: #FCA5A5; background-color: #FEF2F2;" onclick="deleteOrder('${o.id}')" title="Hapus Order">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleOrderStatus(id) {
  const order = adminOrders.find(o => o.id === id);
  if (order) {
    order.payment_status = (order.payment_status === 'paid' || order.payment_status === 'Lunas') ? 'pending' : 'paid';
    localStorage.setItem('bd_admin_orders', JSON.stringify(adminOrders));

    if (window.BlueDoorsDB) {
      window.BlueDoorsDB.updateOrderStatus(id, order.payment_status);
    }

    // Broadcast live event across all open user browser tabs instantly (0ms)
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('bluedoors_orders_channel');
        bc.postMessage({
          type: 'ORDER_STATUS_CHANGED',
          orderId: id,
          customerName: order.customer_name || 'Pelanggan',
          status: order.payment_status,
          totalAmount: order.total_amount,
          timestamp: Date.now()
        });
        bc.close();
      }
    } catch(e) {}

    // Also update backend if available
    try {
      fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: order.payment_status })
      });
    } catch(e) {}

    renderAllAdminData();
  }
}

function deleteOrder(id) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan pesanan ini?')) {
    adminOrders = adminOrders.filter(o => o.id !== id);
    localStorage.setItem('bd_admin_orders', JSON.stringify(adminOrders));
    renderAllAdminData();
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Pending': return 'status-pending';
    case 'Dikonfirmasi': return 'status-confirmed';
    case 'Selesai': return 'status-completed';
    default: return 'status-empty';
  }
}

// Admin Modal Handlers
function initAdminModals() {
  const addMenuForm = document.getElementById('add-menu-form');
  const addBookingForm = document.getElementById('add-booking-form');

  if (addMenuForm) {
    addMenuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('am-name').value;
      const category = document.getElementById('am-category').value;
      const price = parseInt(document.getElementById('am-price').value, 10);
      const desc = document.getElementById('am-desc').value;

      const newId = 'p' + (adminMenu.length + 1);
      adminMenu.push({
        id: newId,
        name: name,
        category: category,
        price: price,
        inStock: true,
        img: 'menus/Kyoto Latte.png'
      });

      localStorage.setItem('bd_admin_menu', JSON.stringify(adminMenu));
      renderAllAdminData();
      closeAdminModal('add-menu-modal');
      addMenuForm.reset();
      alert(`Menu ${name} berhasil ditambahkan ke stok katalog!`);
    });
  }

  if (addBookingForm) {
    addBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ab-name').value;
      const phone = document.getElementById('ab-phone').value;
      const date = document.getElementById('ab-date').value;
      const time = document.getElementById('ab-time').value;
      const guests = document.getElementById('ab-guests').value;
      const area = document.getElementById('ab-area').value;

      const newRef = 'BD-RSV-' + Math.floor(100000 + Math.random() * 900000);
      adminBookings.unshift({
        id: newRef,
        name: name,
        phone: phone,
        date: date,
        time: time,
        guests: guests,
        area: area,
        status: 'Dikonfirmasi'
      });

      localStorage.setItem('bd_admin_bookings', JSON.stringify(adminBookings));
      renderAllAdminData();
      closeAdminModal('add-booking-modal');
      addBookingForm.reset();
      alert(`Reservasi Meja atas nama ${name} (#${newRef}) berhasil didaftarkan!`);
    });
  }
}

function openAdminModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeAdminModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}
