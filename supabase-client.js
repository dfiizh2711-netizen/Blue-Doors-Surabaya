/**
 * Blue Doors Surabaya — Supabase Client SDK Integration (Frontend)
 * Features: Resilient Cloud Database Sync, Live Audio Sound Notification, Realtime Order Sync
 */

const SUPABASE_URL = 'https://xhrwuhsiyjoeyafaipce.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0ROmx0ZPU1l2KYXTYS6_Lg_Ovxzodbt';

let supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('⚡ Supabase JS Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Supabase JS Client initialization failed:', err);
  }
}

// ========================================================
// LIVE SOUND & NOTIFICATION ENGINE (ANTI-SLOP UI / MOBILE)
// ========================================================

/**
 * Web Audio API Chime Synthesizer
 * Generates a crisp, pleasant double-bell chime tone without external audio files
 */
function playOrderCompletedSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2: B5 (987.77 Hz) for a pleasant double-chime bell
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.14);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.14);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn('Live audio chime failed:', err);
  }
}

/**
 * Live Visual Banner Toast (Responsive Mobile Layout + Anti-Slop Visual Rules)
 */
function showLiveNotification(title, message) {
  // Play live chime audio sound
  playOrderCompletedSound();

  let container = document.getElementById('bd-live-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bd-live-toast-container';
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'assertive');
    container.style.cssText = `
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: calc(100vw - 2.5rem);
      width: 420px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bd-live-toast-banner';
  toast.style.cssText = `
    background: #0F2C59;
    color: #FFFFFF;
    padding: 1.1rem 1.25rem;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(15, 44, 89, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    pointer-events: auto;
    animation: bdToastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    border-left: 5px solid #10B981;
  `;

  toast.innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.2); color: #10B981; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem;">
      <i class="fa-solid fa-circle-check"></i>
    </div>
    <div style="flex-grow: 1; min-width: 0;">
      <div style="font-family: var(--font-heading, sans-serif); font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.2rem;">${title}</div>
      <div style="font-size: 0.85rem; color: #E2E8F0; line-height: 1.4;">${message}</div>
      <div style="font-size: 0.725rem; color: #94A3B8; margin-top: 0.35rem; font-weight: 600;">⚡ Notifikasi Live • ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
    </div>
    <button type="button" aria-label="Tutup Notifikasi" onclick="this.parentElement.remove()" style="background: transparent; border: none; color: #94A3B8; font-size: 1.1rem; cursor: pointer; padding: 4px; line-height: 1; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  // Inject responsive keyframe animation CSS if needed
  if (!document.getElementById('bd-toast-keyframes')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'bd-toast-keyframes';
    styleEl.textContent = `
      @keyframes bdToastSlideIn {
        from { opacity: 0; transform: translateY(-20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @media (max-width: 640px) {
        #bd-live-toast-container {
          top: 0.75rem !important;
          right: 0.75rem !important;
          left: 0.75rem !important;
          width: auto !important;
          max-width: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  container.appendChild(toast);

  // Auto remove after 6.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 6500);
}

// Cross-Tab Live Broadcast System
const liveBroadcastChannel = (typeof BroadcastChannel !== 'undefined')
  ? new BroadcastChannel('bluedoors_live_events_channel')
  : null;

if (liveBroadcastChannel) {
  liveBroadcastChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'ORDER_COMPLETED') {
      showLiveNotification('🎉 Pesanan Terselesaikan!', `Pesanan #${event.data.orderId} telah LUNAS / SELESAI diproses.`);
      if (typeof renderAllAdminData === 'function') renderAllAdminData();
    } else if (event.data && event.data.type === 'BOOKING_COMPLETED') {
      showLiveNotification('☕ Reservasi Meja Dikonfirmasi!', `Reservasi #${event.data.bookingId} (${event.data.name}) telah dikonfirmasi.`);
      if (typeof renderAllAdminData === 'function') renderAllAdminData();
    }
  };
}

// Fallback storage event listener for cross-tab sync
window.addEventListener('storage', (e) => {
  if (e.key === 'bd_live_event_trigger' && e.newValue) {
    try {
      const data = JSON.parse(e.newValue);
      if (data.type === 'ORDER_COMPLETED') {
        showLiveNotification('🎉 Pesanan Terselesaikan!', `Pesanan #${data.orderId} telah LUNAS / SELESAI diproses.`);
        if (typeof renderAllAdminData === 'function') renderAllAdminData();
      } else if (data.type === 'BOOKING_COMPLETED') {
        showLiveNotification('☕ Reservasi Meja Dikonfirmasi!', `Reservasi #${data.bookingId} (${data.name}) telah dikonfirmasi.`);
        if (typeof renderAllAdminData === 'function') renderAllAdminData();
      }
    } catch(err) {}
  }
});

// Supabase Realtime Subscription (Cross-Device)
if (supabaseClient) {
  try {
    supabaseClient
      .channel('public-orders-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'bluedoors', table: 'orders' }, (payload) => {
        if (payload.new && (payload.new.payment_status === 'paid' || payload.new.payment_status === 'Lunas')) {
          showLiveNotification('🎉 Pesanan Terselesaikan!', `Pesanan #${payload.new.id} telah LUNAS / SELESAI diproses.`);
          if (typeof renderAllAdminData === 'function') renderAllAdminData();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bluedoors_orders' }, (payload) => {
        if (payload.new && (payload.new.payment_status === 'paid' || payload.new.payment_status === 'Lunas')) {
          showLiveNotification('🎉 Pesanan Terselesaikan!', `Pesanan #${payload.new.id} telah LUNAS / SELESAI diproses.`);
          if (typeof renderAllAdminData === 'function') renderAllAdminData();
        }
      })
      .subscribe();
  } catch (err) {
    console.warn('Supabase Realtime subscription error:', err);
  }
}

// ========================================================
// SUPABASE CLIENT DATABASE WRAPPER API
// ========================================================

window.BlueDoorsDB = {
  get client() {
    return supabaseClient;
  },

  playChimeSound: playOrderCompletedSound,
  showLiveToast: showLiveNotification,

  notifyOrderCompleted(orderId, orderObj) {
    const title = '🎉 Pesanan Terselesaikan!';
    const customerName = orderObj ? (orderObj.customer_name || orderObj.name || '') : '';
    const msg = `Pesanan #${orderId} ${customerName ? '(' + customerName + ')' : ''} telah LUNAS / SELESAI diproses.`;

    // 1. Show live banner & play audio on current window
    showLiveNotification(title, msg);

    // 2. Broadcast to other open tabs
    if (liveBroadcastChannel) {
      liveBroadcastChannel.postMessage({ type: 'ORDER_COMPLETED', orderId, order: orderObj });
    }

    // 3. Set storage event trigger for cross-tab fallback
    localStorage.setItem('bd_live_event_trigger', JSON.stringify({ type: 'ORDER_COMPLETED', orderId, timestamp: Date.now() }));
  },

  notifyBookingCompleted(bookingId, bookingObj) {
    const title = '☕ Reservasi Meja Dikonfirmasi!';
    const name = bookingObj ? (bookingObj.name || '') : '';
    const msg = `Reservasi #${bookingId} ${name ? '(' + name + ')' : ''} telah dikonfirmasi.`;

    showLiveNotification(title, msg);

    if (liveBroadcastChannel) {
      liveBroadcastChannel.postMessage({ type: 'BOOKING_COMPLETED', bookingId, name });
    }

    localStorage.setItem('bd_live_event_trigger', JSON.stringify({ type: 'BOOKING_COMPLETED', bookingId, name, timestamp: Date.now() }));
  },

  async insertUser(userObj) {
    if (!supabaseClient) return null;

    const basicPayload = {
      id: userObj.id || ('USR-' + Math.floor(100 + Math.random() * 900)),
      name: userObj.name,
      phone: String(userObj.phone || '').replace(/[^0-9]/g, '') || userObj.phone,
      favorite_area: userObj.favoriteArea || userObj.favorite_area || 'Indoor AC'
    };

    const fullPayload = {
      ...basicPayload,
      total_visits: userObj.totalVisits || userObj.total_visits || 1,
      status: userObj.status || 'Aktif'
    };

    let res = await supabaseClient.schema('bluedoors').from('users').insert([fullPayload]).select();
    if (res.error) {
      res = await supabaseClient.schema('bluedoors').from('users').insert([basicPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('bluedoors_users').insert([fullPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('users').insert([basicPayload]).select();
    }

    return res.data ? res.data[0] : null;
  },

  async insertBooking(bookingObj) {
    if (!supabaseClient) return null;

    const basicPayload = {
      id: bookingObj.id || ('BD-RSV-' + Math.floor(100000 + Math.random() * 900000)),
      name: bookingObj.name,
      phone: String(bookingObj.phone || ''),
      date: bookingObj.date,
      time: bookingObj.time
    };

    const fullPayload = {
      ...basicPayload,
      guests: bookingObj.guests || '1-2',
      area: bookingObj.area || 'Indoor AC',
      status: bookingObj.status || 'Pending'
    };

    let res = await supabaseClient.schema('bluedoors').from('bookings').insert([fullPayload]).select();
    if (res.error) {
      res = await supabaseClient.schema('bluedoors').from('bookings').insert([basicPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('bluedoors_bookings').insert([fullPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('bookings').insert([basicPayload]).select();
    }

    return res.data ? res.data[0] : null;
  },

  async insertOrder(orderObj) {
    if (!supabaseClient) return null;

    const payload = {
      id: orderObj.id || ('BD-ORD-' + Date.now()),
      customer_name: orderObj.customer_name || orderObj.name || 'Pelanggan',
      customer_phone: String(orderObj.customer_phone || orderObj.phone || ''),
      order_type: orderObj.order_type || orderObj.orderType || 'Dine-in / Minum di Tempat',
      total_amount: orderObj.total_amount || orderObj.totalAmount || 0,
      items: orderObj.items || [],
      payment_status: orderObj.payment_status || orderObj.paymentStatus || 'pending',
      midtrans_snap_token: orderObj.midtrans_snap_token || null,
      midtrans_redirect_url: orderObj.midtrans_redirect_url || null
    };

    let res = await supabaseClient.schema('bluedoors').from('orders').insert([payload]).select();
    if (res.error) {
      res = await supabaseClient.from('bluedoors_orders').insert([payload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('orders').insert([payload]).select();
    }

    return res.data ? res.data[0] : null;
  },

  async updateOrderStatus(orderId, status) {
    if (!supabaseClient) return;
    try {
      await supabaseClient.schema('bluedoors').from('orders').update({ payment_status: status }).eq('id', orderId);
      await supabaseClient.from('bluedoors_orders').update({ payment_status: status }).eq('id', orderId);
      await supabaseClient.from('orders').update({ payment_status: status }).eq('id', orderId);
    } catch (err) {
      console.error('Supabase updateOrderStatus error:', err);
    }
  },

  async fetchUsers() {
    if (!supabaseClient) return [];
    let res = await supabaseClient.schema('bluedoors').from('users').select('*').order('created_at', { ascending: false });
    if (res.error || !res.data) {
      res = await supabaseClient.from('bluedoors_users').select('*').order('created_at', { ascending: false });
    }
    if (res.error || !res.data) {
      res = await supabaseClient.from('users').select('*').order('created_at', { ascending: false });
    }
    return res.data || [];
  },

  async fetchBookings() {
    if (!supabaseClient) return [];
    let res = await supabaseClient.schema('bluedoors').from('bookings').select('*').order('created_at', { ascending: false });
    if (res.error || !res.data) {
      res = await supabaseClient.from('bluedoors_bookings').select('*').order('created_at', { ascending: false });
    }
    if (res.error || !res.data) {
      res = await supabaseClient.from('bookings').select('*').order('created_at', { ascending: false });
    }
    return res.data || [];
  },

  async fetchOrders() {
    if (!supabaseClient) return [];
    let res = await supabaseClient.schema('bluedoors').from('orders').select('*').order('created_at', { ascending: false });
    if (res.error || !res.data) {
      res = await supabaseClient.from('bluedoors_orders').select('*').order('created_at', { ascending: false });
    }
    if (res.error || !res.data) {
      res = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
    }
    return res.data || [];
  },

  async syncInitialSeedData() {
    if (!supabaseClient) return;
    try {
      const dbUsers = await this.fetchUsers();
      if (!dbUsers || dbUsers.length === 0) {
        const localUsers = JSON.parse(localStorage.getItem('bd_admin_users')) || [
          { id: 'USR-001', name: 'Ahmad Rizky', phone: '6281234567891', favoriteArea: 'Indoor AC', totalVisits: 8, status: 'Aktif' },
          { id: 'USR-002', name: 'Siti Sarah', phone: '6281987654321', favoriteArea: 'Outdoor Garden', totalVisits: 5, status: 'Aktif' },
          { id: 'USR-003', name: 'Budi Pratama', phone: '6281345678902', favoriteArea: 'Espresso Bar', totalVisits: 12, status: 'VIP' },
          { id: 'USR-004', name: 'Dewi Lestari', phone: '6281567890123', favoriteArea: 'Indoor AC', totalVisits: 3, status: 'Aktif' },
          { id: 'USR-005', name: 'Hendra Gunawan', phone: '6281789012345', favoriteArea: 'Outdoor Garden', totalVisits: 15, status: 'VIP' },
          { id: 'USR-006', name: 'abdul', phone: '6298756789', favoriteArea: 'Indoor AC', totalVisits: 1, status: 'Aktif' }
        ];
        for (const u of localUsers) {
          await this.insertUser(u);
        }
      }

      const dbBookings = await this.fetchBookings();
      if (!dbBookings || dbBookings.length === 0) {
        const localBookings = JSON.parse(localStorage.getItem('bd_admin_bookings')) || [
          { id: 'BD-RSV-849201', name: 'Ahmad Rizky', phone: '081234567891', date: '2026-09-24', time: '14:30', guests: '3-4', area: 'Indoor AC', status: 'Dikonfirmasi' },
          { id: 'BD-RSV-719302', name: 'Siti Sarah', phone: '081987654321', date: '2026-09-24', time: '16:00', guests: '5-8', area: 'Outdoor Garden', status: 'Pending' },
          { id: 'BD-RSV-391048', name: 'Budi Pratama', phone: '081345678902', date: '2026-09-24', time: '19:00', guests: '1-2', area: 'Espresso Bar', status: 'Dikonfirmasi' },
          { id: 'BD-RSV-102948', name: 'Dewi Lestari', phone: '081567890123', date: '2026-09-25', time: '10:00', guests: '3-4', area: 'Indoor AC', status: 'Pending' }
        ];
        for (const b of localBookings) {
          await this.insertBooking(b);
        }
      }

      const dbOrders = await this.fetchOrders();
      if (!dbOrders || dbOrders.length === 0) {
        const localOrders = JSON.parse(localStorage.getItem('bd_admin_orders')) || [
          {
            id: 'BD-ORD-1790397081279-86',
            customer_name: 'abdul',
            customer_phone: '+98756789',
            order_type: 'Dine-in / Minum di Tempat',
            total_amount: 42000,
            items: [{ id: 'p1', name: 'Kyoto Latte', price: 42000, qty: 1 }],
            payment_status: 'pending'
          },
          {
            id: 'BD-ORD-1790396716851-952',
            customer_name: 'abdul',
            customer_phone: '+98756789',
            order_type: 'Dine-in / Minum di Tempat',
            total_amount: 42000,
            items: [{ id: 'p1', name: 'Kyoto Latte', price: 42000, qty: 1 }],
            payment_status: 'pending'
          },
          {
            id: 'BD-ORD-1790386454826-84',
            customer_name: 'abdul',
            customer_phone: '+98756789',
            order_type: 'Delivery / Kurir Surabaya',
            total_amount: 245000,
            items: [
              { id: 'p3', name: 'White Velvet Latte', price: 44000, qty: 1 },
              { id: 'p2', name: 'Fleur Noire', price: 45000, qty: 1 },
              { id: 'p1', name: 'Kyoto Latte', price: 42000, qty: 1 },
              { id: 'p5', name: 'Grand Latte', price: 42000, qty: 1 },
              { id: 'p6', name: 'Hot Black', price: 35000, qty: 1 },
              { id: 'p7', name: 'Ice Black', price: 37000, qty: 1 }
            ],
            payment_status: 'pending'
          }
        ];
        for (const o of localOrders) {
          await this.insertOrder(o);
        }
      }
    } catch (err) {
      console.error('Supabase seed sync error:', err);
    }
  }
};

// Auto sync on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.BlueDoorsDB) {
    window.BlueDoorsDB.syncInitialSeedData();
  }
});
