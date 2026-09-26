import express from 'express';
import { snap } from '../config/midtrans.js';
import { supabase, DB_STORE } from '../config/supabase.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return res.json({ success: true, data });
    }
    res.json({ success: true, data: DB_STORE.orders });
  } catch (err) {
    res.json({ success: true, data: DB_STORE.orders });
  }
});

// POST create order & Midtrans Snap token
router.post('/checkout', async (req, res) => {
  try {
    const { name, phone, orderType, items } = req.body;

    if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Data pesanan dan item tidak valid.' });
    }

    const orderId = 'BD-ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const grossAmount = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);

    const itemDetails = items.map(item => ({
      id: item.id,
      price: Math.round(Number(item.price)),
      quantity: Number(item.qty),
      name: item.name.substring(0, 50)
    }));

    // Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(grossAmount)
      },
      item_details: itemDetails,
      customer_details: {
        first_name: name,
        phone: phone
      },
      callbacks: {
        finish: `${req.protocol}://${req.get('host')}/produk.html?orderId=${orderId}&status=success`
      }
    };

    // Create Snap transaction token via Midtrans SDK
    let snapToken = null;
    let redirectUrl = null;

    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
      redirectUrl = transaction.redirect_url;
    } catch (midtransErr) {
      console.warn('Midtrans Snap Error (Using Fallback Token):', midtransErr.message);
      snapToken = 'SANDBOX-TOKEN-' + orderId;
      redirectUrl = '#';
    }

    const newOrder = {
      id: orderId,
      customer_name: name,
      customer_phone: phone,
      order_type: orderType || 'Dine-in / Minum di Tempat',
      total_amount: grossAmount,
      items: items,
      payment_status: 'pending',
      midtrans_snap_token: snapToken,
      midtrans_redirect_url: redirectUrl,
      created_at: new Date().toISOString()
    };

    // Save to Supabase or Store
    if (supabase) {
      await supabase.from('orders').insert([newOrder]);
    }
    DB_STORE.orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat.',
      orderId,
      snapToken,
      redirectUrl,
      order: newOrder
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order status
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = DB_STORE.orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE order by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      await supabase.from('bluedoors_orders').delete().eq('id', id);
      await supabase.from('orders').delete().eq('id', id);
    }
    const idx = DB_STORE.orders.findIndex(o => o.id === id);
    if (idx !== -1) DB_STORE.orders.splice(idx, 1);

    res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
