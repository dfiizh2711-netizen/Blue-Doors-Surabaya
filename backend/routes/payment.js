import express from 'express';
import { coreApi } from '../config/midtrans.js';
import { supabase, DB_STORE } from '../config/supabase.js';

const router = express.Router();

// Webhook listener for Midtrans HTTP Notifications
router.post('/notification', async (req, res) => {
  try {
    const notificationJson = req.body;
    
    // Verify notification authenticity with Midtrans Core API
    let statusResponse;
    try {
      statusResponse = await coreApi.transaction.notification(notificationJson);
    } catch (e) {
      statusResponse = notificationJson;
    }

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let paymentStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      paymentStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    }

    // Update in DB store
    const orderIndex = DB_STORE.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      DB_STORE.orders[orderIndex].payment_status = paymentStatus;
    }

    // Update in Supabase
    if (supabase) {
      await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', orderId);
    }

    console.log(`Payment notification processed for Order ${orderId}: ${paymentStatus}`);
    res.status(200).json({ success: true, message: 'Notification processed.' });

  } catch (err) {
    console.error('Payment notification error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
