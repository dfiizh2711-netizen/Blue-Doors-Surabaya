import express from 'express';
import { supabase, DB_STORE } from '../config/supabase.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) return res.json({ success: true, data });
    }
    res.json({ success: true, data: DB_STORE.products });
  } catch (err) {
    res.json({ success: true, data: DB_STORE.products });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, category, price, desc, img, badge, inStock } = req.body;
    const newProduct = {
      id: 'p' + (DB_STORE.products.length + 1) + '_' + Date.now().toString().slice(-4),
      name,
      category: category || 'specialty',
      price: Number(price) || 0,
      desc: desc || '',
      img: img || 'menus/Kyoto Latte.png',
      badge: badge || null,
      inStock: inStock !== false
    };

    if (supabase) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (!error && data) {
        DB_STORE.products.push(data[0]);
        return res.status(201).json({ success: true, data: data[0] });
      }
    }

    DB_STORE.products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product stock or details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = DB_STORE.products.findIndex(p => p.id === id);
    if (index !== -1) {
      DB_STORE.products[index] = { ...DB_STORE.products[index], ...updates };
    }

    if (supabase) {
      await supabase.from('products').update(updates).eq('id', id);
    }

    res.json({ success: true, data: DB_STORE.products[index] || updates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    DB_STORE.products = DB_STORE.products.filter(p => p.id !== id);

    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }

    res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
