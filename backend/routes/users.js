import express from 'express';
import { supabase, DB_STORE } from '../config/supabase.js';

const router = express.Router();

// GET all users (For Admin Directory)
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      let { data, error } = await supabase.from('bluedoors_users').select('*').order('created_at', { ascending: false });
      if (error || !data) {
        const resOld = await supabase.from('users').select('*').order('created_at', { ascending: false });
        data = resOld.data;
      }
      if (data && data.length > 0) return res.json({ success: true, data });
    }
    res.json({ success: true, data: DB_STORE.users });
  } catch (err) {
    res.json({ success: true, data: DB_STORE.users });
  }
});

// POST user register
router.post('/register', async (req, res) => {
  try {
    const { name, contact, password } = req.body;
    if (!name || !contact || !password) {
      return res.status(400).json({ success: false, message: 'Data pendaftaran tidak lengkap.' });
    }

    const newUser = {
      id: 'USR-' + Math.floor(10000 + Math.random() * 90000),
      name: name.trim(),
      phone: contact.trim(),
      favorite_area: 'Indoor AC',
      total_visits: 1,
      status: 'Aktif',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const resIns = await supabase.from('bluedoors_users').insert([newUser]);
      if (resIns.error) {
        await supabase.from('users').insert([newUser]);
      }
    }
    DB_STORE.users.push(newUser);

    res.status(201).json({ success: true, message: 'Akun pelanggan berhasil terdaftar.', user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      await supabase.from('bluedoors_users').delete().eq('id', id);
      await supabase.from('users').delete().eq('id', id);
    }
    const idx = DB_STORE.users.findIndex(u => u.id === id);
    if (idx !== -1) DB_STORE.users.splice(idx, 1);

    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Nama / Nomor HP wajib diisi.' });
    }

    const searchVal = String(email).trim().toLowerCase();
    const cleanSearchPhone = searchVal.replace(/[^0-9]/g, '');

    let foundUser = null;

    // 1. Search in Supabase DB
    if (supabase) {
      try {
        let { data } = await supabase.from('bluedoors_users').select('*');
        if (!data || data.length === 0) {
          const resOld = await supabase.from('users').select('*');
          data = resOld.data;
        }
        if (data && data.length > 0) {
          foundUser = data.find(u => 
            (u.name && u.name.toLowerCase() === searchVal) ||
            (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanSearchPhone) ||
            (u.id && u.id.toLowerCase() === searchVal)
          );
        }
      } catch (e) {}
    }

    // 2. Fallback search in DB_STORE
    if (!foundUser) {
      foundUser = DB_STORE.users.find(u =>
        (u.name && u.name.toLowerCase() === searchVal) ||
        (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanSearchPhone) ||
        (u.id && u.id.toLowerCase() === searchVal)
      );
    }

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Akun belum terdaftar! Silakan lakukan pendaftaran akun baru terlebih dahulu.'
      });
    }

    res.json({ success: true, message: 'Login berhasil.', user: foundUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST admin login gatekeeper verification
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      return res.json({ success: true, message: 'Login Admin Berhasil.', token: 'ADMIN_SESSION_TOKEN_BD_2026' });
    }
    res.status(401).json({ success: false, message: 'Kredensial Admin Salah! Periksa username dan password.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
