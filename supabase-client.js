/**
 * Blue Doors Surabaya — Supabase Client SDK Integration (Frontend)
 * Direct real-time cloud database sync for static hosts like GitHub Pages
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
   * Helper to write to schema 'bluedoors' with automatic fallback to schema 'public' (bluedoors_ prefix)
   */
  async insertUser(userObj) {
    if (!supabaseClient) return null;
    const payload = {
      id: userObj.id || ('USR-' + Math.floor(100 + Math.random() * 900)),
      name: userObj.name,
      phone: userObj.phone,
      favorite_area: userObj.favoriteArea || userObj.favorite_area || 'Indoor AC',
      total_visits: userObj.totalVisits || userObj.total_visits || 1,
      status: userObj.status || 'Aktif'
    };

    try {
      // 1. Try bluedoors schema
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('users')
        .insert([payload])
        .select();

      if (!error && data) return data[0];

      // 2. Fallback to public schema
      const fallback = await supabaseClient
        .from('bluedoors_users')
        .insert([payload])
        .select();
      
      return fallback.data ? fallback.data[0] : payload;
    } catch (err) {
      console.error('Supabase insertUser error:', err);
      return null;
    }
  },

  async insertBooking(bookingObj) {
    if (!supabaseClient) return null;
    const payload = {
      id: bookingObj.id || ('BD-RSV-' + Math.floor(100000 + Math.random() * 900000)),
      name: bookingObj.name,
      phone: bookingObj.phone,
      date: bookingObj.date,
      time: bookingObj.time,
      guests: bookingObj.guests || '1-2',
      area: bookingObj.area || 'Indoor AC',
      status: bookingObj.status || 'Pending'
    };

    try {
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('bookings')
        .insert([payload])
        .select();

      if (!error && data) return data[0];

      const fallback = await supabaseClient
        .from('bluedoors_bookings')
        .insert([payload])
        .select();

      return fallback.data ? fallback.data[0] : payload;
    } catch (err) {
      console.error('Supabase insertBooking error:', err);
      return null;
    }
  },

  async insertOrder(orderObj) {
    if (!supabaseClient) return null;
    const payload = {
      id: orderObj.id || ('BD-ORD-' + Date.now()),
      customer_name: orderObj.customer_name || orderObj.name,
      customer_phone: orderObj.customer_phone || orderObj.phone,
      order_type: orderObj.order_type || orderObj.orderType || 'Dine-in / Minum di Tempat',
      total_amount: orderObj.total_amount || orderObj.totalAmount || 0,
      items: orderObj.items || [],
      payment_status: orderObj.payment_status || orderObj.paymentStatus || 'pending',
      midtrans_snap_token: orderObj.midtrans_snap_token || null,
      midtrans_redirect_url: orderObj.midtrans_redirect_url || null
    };

    try {
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('orders')
        .insert([payload])
        .select();

      if (!error && data) return data[0];

      const fallback = await supabaseClient
        .from('bluedoors_orders')
        .insert([payload])
        .select();

      return fallback.data ? fallback.data[0] : payload;
    } catch (err) {
      console.error('Supabase insertOrder error:', err);
      return null;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (!supabaseClient) return;
    try {
      await supabaseClient
        .schema('bluedoors')
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);

      await supabaseClient
        .from('bluedoors_orders')
        .update({ payment_status: status })
        .eq('id', orderId);
    } catch (err) {
      console.error('Supabase updateOrderStatus error:', err);
    }
  },

  async fetchUsers() {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) return data;

      const fallback = await supabaseClient
        .from('bluedoors_users')
        .select('*')
        .order('created_at', { ascending: false });

      return fallback.data || [];
    } catch (err) {
      return null;
    }
  },

  async fetchBookings() {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) return data;

      const fallback = await supabaseClient
        .from('bluedoors_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      return fallback.data || [];
    } catch (err) {
      return null;
    }
  },

  async fetchOrders() {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .schema('bluedoors')
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) return data;

      const fallback = await supabaseClient
        .from('bluedoors_orders')
        .select('*')
        .order('created_at', { ascending: false });

      return fallback.data || [];
    } catch (err) {
      return null;
    }
  },

  /**
   * Sync initial 6 users, bookings, and sample orders to Supabase if database is empty
   */
  async syncInitialSeedData() {
    if (!supabaseClient) return;

    try {
      // 1. Sync Users if empty
      const currentDbUsers = await this.fetchUsers();
      if (!currentDbUsers || currentDbUsers.length === 0) {
        console.log('📦 Syncing initial users to Supabase...');
        const seedUsers = [
          { id: 'USR-001', name: 'Ahmad Rizky', phone: '6281234567891', favoriteArea: 'Indoor AC', totalVisits: 8, status: 'Aktif' },
          { id: 'USR-002', name: 'Siti Sarah', phone: '6281987654321', favoriteArea: 'Outdoor Garden', totalVisits: 5, status: 'Aktif' },
          { id: 'USR-003', name: 'Budi Pratama', phone: '6281345678902', favoriteArea: 'Espresso Bar', totalVisits: 12, status: 'VIP' },
          { id: 'USR-004', name: 'Dewi Lestari', phone: '6281567890123', favoriteArea: 'Indoor AC', totalVisits: 3, status: 'Aktif' },
          { id: 'USR-005', name: 'Hendra Gunawan', phone: '6281789012345', favoriteArea: 'Outdoor Garden', totalVisits: 15, status: 'VIP' },
          { id: 'USR-006', name: 'abdul', phone: '6298756789', favoriteArea: 'Indoor AC', totalVisits: 1, status: 'Aktif' }
        ];

        for (const u of seedUsers) {
          await this.insertUser(u);
        }
      }

      // 2. Sync Bookings if empty
      const currentDbBookings = await this.fetchBookings();
      if (!currentDbBookings || currentDbBookings.length === 0) {
        console.log('📅 Syncing initial bookings to Supabase...');
        const seedBookings = [
          { id: 'BD-RSV-849201', name: 'Ahmad Rizky', phone: '081234567891', date: '2026-09-24', time: '14:30', guests: '3-4', area: 'Indoor AC', status: 'Dikonfirmasi' },
          { id: 'BD-RSV-719302', name: 'Siti Sarah', phone: '081987654321', date: '2026-09-24', time: '16:00', guests: '5-8', area: 'Outdoor Garden', status: 'Pending' },
          { id: 'BD-RSV-391048', name: 'Budi Pratama', phone: '081345678902', date: '2026-09-24', time: '19:00', guests: '1-2', area: 'Espresso Bar', status: 'Dikonfirmasi' },
          { id: 'BD-RSV-102948', name: 'Dewi Lestari', phone: '081567890123', date: '2026-09-25', time: '10:00', guests: '3-4', area: 'Indoor AC', status: 'Pending' }
        ];

        for (const b of seedBookings) {
          await this.insertBooking(b);
        }
      }

      // 3. Sync Orders if empty
      const currentDbOrders = await this.fetchOrders();
      if (!currentDbOrders || currentDbOrders.length === 0) {
        console.log('🛒 Syncing initial orders to Supabase...');
        const seedOrders = [
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

        for (const o of seedOrders) {
          await this.insertOrder(o);
        }
      }
    } catch (err) {
      console.error('Failed syncing initial seed data:', err);
    }
  }
};

// Execute automatic sync when loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.BlueDoorsDB) {
    window.BlueDoorsDB.syncInitialSeedData();
  }
});
