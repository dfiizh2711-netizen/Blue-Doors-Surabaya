import express from 'express';
import { supabase, DB_STORE } from '../config/supabase.js';

const router = express.Router();

// GET all table bookings
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error && data) return res.json({ success: true, data });
    }
    res.json({ success: true, data: DB_STORE.bookings });
  } catch (err) {
    res.json({ success: true, data: DB_STORE.bookings });
  }
});

// POST new table booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, date, time, guests, area } = req.body;
    if (!name || !phone || !date || !time) {
      return res.status(400).json({ success: false, message: 'Data reservasi tidak lengkap.' });
    }

    const bookingId = 'BD-RSV-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: bookingId,
      name,
      phone,
      date,
      time,
      guests: guests || '1-2',
      area: area || 'Indoor AC',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select();
      if (!error && data) {
        DB_STORE.bookings.unshift(data[0]);
        return res.status(201).json({ success: true, data: data[0] });
      }
    }

    DB_STORE.bookings.unshift(newBooking);
    res.status(201).json({ success: true, data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = DB_STORE.bookings.find(b => b.id === id);
    if (item) {
      item.status = status;
    }

    if (supabase) {
      await supabase.from('bookings').update({ status }).eq('id', id);
    }

    res.json({ success: true, message: 'Status reservasi berhasil diperbarui.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    DB_STORE.bookings = DB_STORE.bookings.filter(b => b.id !== id);

    if (supabase) {
      await supabase.from('bookings').delete().eq('id', id);
    }

    res.json({ success: true, message: 'Reservasi dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
