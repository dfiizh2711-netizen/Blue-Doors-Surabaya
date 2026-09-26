/**
 * Blue Doors Surabaya — Supabase Client SDK Integration (Frontend)
 * Resilient Cloud Database Sync for Vercel & Static Frontends
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

window.BlueDoorsDB = {
  get client() {
    return supabaseClient;
  },

  /**
   * Resilient user insertion across bluedoors schema and public schema
   */
  async insertUser(userObj) {
    if (!supabaseClient) return null;

    const uniqueId = userObj.id || ('USR-' + Math.floor(10000 + Math.random() * 90000));

    const phoneVal = String(userObj.phone || userObj.contact || '').trim();

    const basicPayload = {
      id: uniqueId,
      name: userObj.name || 'User Baru',
      phone: phoneVal || ('+628' + Math.floor(10000000 + Math.random() * 90000000)),
      favorite_area: userObj.favoriteArea || userObj.favorite_area || 'Indoor AC'
    };

    const fullPayload = {
      ...basicPayload,
      total_visits: userObj.totalVisits || userObj.total_visits || 1,
      status: userObj.status || 'Aktif'
    };

    let res = await supabaseClient.from('bluedoors_users').insert([fullPayload]).select();
    if (res.error) {
      res = await supabaseClient.from('bluedoors_users').insert([basicPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.schema('bluedoors').from('users').insert([fullPayload]).select();
    }
    if (res.error) {
      res = await supabaseClient.from('users').insert([basicPayload]).select();
    }

    if (res.error) {
      console.error('❌ Supabase insertUser Error:', res.error.message || res.error);
    } else {
      console.log('✅ Supabase insertUser Success:', res.data);
    }
    return res.data ? res.data[0] : null;
  },

  /**
   * Delete user by ID from Supabase Cloud
   */
  async deleteUser(userId) {
    if (!supabaseClient) return false;
    try {
      let res = await supabaseClient.from('bluedoors_users').delete().eq('id', userId);
      if (res.error) {
        res = await supabaseClient.schema('bluedoors').from('users').delete().eq('id', userId);
      }
      if (res.error) {
        res = await supabaseClient.from('users').delete().eq('id', userId);
      }
      if (res.error) {
        console.error('❌ Supabase deleteUser Error:', res.error.message || res.error);
      } else {
        console.log('✅ Supabase deleteUser Success for ID:', userId);
      }
      return !res.error;
    } catch (err) {
      console.error('Supabase deleteUser error:', err);
      return false;
    }
  },

  /**
   * Resilient booking insertion across schemas
   */
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

    if (res.error) {
      console.error('❌ Supabase insertBooking Error:', res.error.message || res.error);
    } else {
      console.log('✅ Supabase insertBooking Success:', res.data);
    }
    return res.data ? res.data[0] : null;
  },

  /**
   * Resilient order insertion across schemas
   */
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

    if (res.error) {
      console.error('❌ Supabase insertOrder Error:', res.error.message || res.error);
    } else {
      console.log('✅ Supabase insertOrder Success:', res.data);
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

  async updateBookingStatus(bookingId, status) {
    if (!supabaseClient) return false;
    try {
      let res = await supabaseClient.from('bluedoors_bookings').update({ status }).eq('id', bookingId);
      if (res.error) {
        res = await supabaseClient.schema('bluedoors').from('bookings').update({ status }).eq('id', bookingId);
      }
      if (res.error) {
        res = await supabaseClient.from('bookings').update({ status }).eq('id', bookingId);
      }
      return !res.error;
    } catch (err) {
      console.error('Supabase updateBookingStatus error:', err);
      return false;
    }
  },

  async deleteBooking(bookingId) {
    if (!supabaseClient) return false;
    try {
      let res = await supabaseClient.from('bluedoors_bookings').delete().eq('id', bookingId);
      if (res.error) {
        res = await supabaseClient.schema('bluedoors').from('bookings').delete().eq('id', bookingId);
      }
      if (res.error) {
        res = await supabaseClient.from('bookings').delete().eq('id', bookingId);
      }
      return !res.error;
    } catch (err) {
      console.error('Supabase deleteBooking error:', err);
      return false;
    }
  },

  async deleteOrder(orderId) {
    if (!supabaseClient) return false;
    try {
      let res = await supabaseClient.from('bluedoors_orders').delete().eq('id', orderId);
      if (res.error) {
        res = await supabaseClient.schema('bluedoors').from('orders').delete().eq('id', orderId);
      }
      if (res.error) {
        res = await supabaseClient.from('orders').delete().eq('id', orderId);
      }
      if (res.error) {
        console.error('❌ Supabase deleteOrder Error:', res.error.message || res.error);
      } else {
        console.log('✅ Supabase deleteOrder Success for ID:', orderId);
      }
      return !res.error;
    } catch (err) {
      console.error('Supabase deleteOrder error:', err);
      return false;
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

  /**
   * Upload all initial data into Supabase Cloud
   */
  async syncInitialSeedData() {
    if (!supabaseClient) return;

    try {
      console.log('🔄 Checking Supabase Cloud sync...');

      // 1. Users
      const dbUsers = await this.fetchUsers();
      const existingUserIds = new Set((dbUsers || []).map(u => u.id));
      const localUsers = JSON.parse(localStorage.getItem('bd_admin_users')) || [
        { id: 'USR-001', name: 'Ahmad Rizky', phone: '6281234567891', favoriteArea: 'Indoor AC', totalVisits: 8, status: 'Aktif' },
        { id: 'USR-002', name: 'Siti Sarah', phone: '6281987654321', favoriteArea: 'Outdoor Garden', totalVisits: 5, status: 'Aktif' },
        { id: 'USR-003', name: 'Budi Pratama', phone: '6281345678902', favoriteArea: 'Espresso Bar', totalVisits: 12, status: 'VIP' },
        { id: 'USR-004', name: 'Dewi Lestari', phone: '6281567890123', favoriteArea: 'Indoor AC', totalVisits: 3, status: 'Aktif' },
        { id: 'USR-005', name: 'Hendra Gunawan', phone: '6281789012345', favoriteArea: 'Outdoor Garden', totalVisits: 15, status: 'VIP' }
      ];

      for (const u of localUsers) {
        if (!existingUserIds.has(u.id)) {
          await this.insertUser(u);
        }
      }

      // 2. Bookings
      const dbBookings = await this.fetchBookings();
      if (!dbBookings || dbBookings.length === 0) {
        console.log('📅 Uploading bookings to Supabase Cloud...');
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

      // 3. Orders
      const dbOrders = await this.fetchOrders();
      if (!dbOrders || dbOrders.length === 0) {
        console.log('🛒 Uploading orders to Supabase Cloud...');
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
