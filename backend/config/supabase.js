import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase Client
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Initial Fallback / Synchronized Memory Store
export const DB_STORE = {
  products: [
    { id: 'p1', name: 'Kyoto Latte', category: 'specialty', price: 42000, desc: 'Latte dingin khas Jepang dengan manis yang pas dan tekstur ekstra halus.', img: 'menus/Kyoto Latte.png', badge: 'Terfavorit', inStock: true },
    { id: 'p2', name: 'Fleur Noire', category: 'specialty', price: 45000, desc: 'Racikan specialty espresso dengan sentuhan floral & keharuman alami.', img: 'menus/Fleur Noire.png', badge: 'Signature', inStock: true },
    { id: 'p3', name: 'White Velvet Latte', category: 'specialty', price: 44000, desc: 'Latte lembut berminyak dengan rasa vanilla bourbon alami & susu steaming sempurna.', img: 'menus/White Velvet Latte.png', badge: 'Best Seller', inStock: true },
    { id: 'p4', name: 'Swiss Latte', category: 'specialty', price: 43000, desc: 'Espresso racikan dengan sentuhan hazelnut halus & kekayaan rasa khas Swiss.', img: 'menus/Swiss Latte.png', badge: 'Populer', inStock: true },
    { id: 'p5', name: 'Grand Latte', category: 'specialty', price: 42000, desc: 'Cita rasa espresso mantap dikombinasikan susu segar berkualitas.', img: 'menus/Grand Latte.png', badge: null, inStock: true },
    { id: 'p6', name: 'Hot Black', category: 'black', price: 35000, desc: 'Ekstraksi espresso murni hangat dengan aroma biji kopi pilihan.', img: 'menus/Hot Black.png', badge: null, inStock: true },
    { id: 'p7', name: 'Ice Black', category: 'black', price: 37000, desc: 'Espresso dingin yang menyegarkan dengan kejernihan rasa otentik.', img: 'menus/Ice Black.png', badge: null, inStock: true },
    { id: 'p8', name: 'Piccolo', category: 'black', price: 36000, desc: 'Ristretto konsentrat tinggi dengan sedikit susu lembut hangat.', img: 'menus/Piccolo.png', badge: null, inStock: true },
    { id: 'p9', name: 'Hot Regular White', category: 'white', price: 38000, desc: 'Kopi putih hangat berbusa halus dengan keseimbangan rasa yang pas.', img: 'menus/Hot Regular White.png', badge: null, inStock: true },
    { id: 'p10', name: 'Hot Large White', category: 'white', price: 42000, desc: 'Porsi besar kopi putih hangat untuk kenikmatan ngopi lebih lama.', img: 'menus/Hot Large White.png', badge: null, inStock: true },
    { id: 'p11', name: 'Ice White', category: 'white', price: 40000, desc: 'Kopi susu dingin klasik dengan cita rasa gurih dan manis seimbang.', img: 'menus/Ice White.png', badge: null, inStock: true },
    { id: 'p12', name: 'Ice Sweetened', category: 'white', price: 41000, desc: 'Kopi susu dingin dengan manis alami gula aren pilihan.', img: 'menus/Ice Sweetened.png', badge: null, inStock: true },
    { id: 'p13', name: 'Hot Mocha', category: 'chocolate', price: 44000, desc: 'Perpaduan sempurna espresso hangat dan cokelat artisanal pekat.', img: 'menus/Hot Mocha.png', badge: null, inStock: true },
    { id: 'p14', name: 'Ice Mocha', category: 'chocolate', price: 46000, desc: 'Es kopi mocha dingin berpadu siram cokelat pilihan yang kaya rasa.', img: 'menus/Ice Mocha.png', badge: null, inStock: true },
    { id: 'p15', name: 'Chocolate', category: 'chocolate', price: 42000, desc: 'Minuman cokelat murni kaya cita rasa tanpa espresso.', img: 'menus/Chocolate.png', badge: 'Non-Kopi', inStock: true },
    { id: 'p16', name: 'Matcha', category: 'noncoffee', price: 45000, desc: 'Matcha murni khas Uji Jepang yang otentik dan menenangkan.', img: 'menus/Matcha.png', badge: 'Favorit', inStock: true },
    { id: 'p17', name: 'Strawberry Matcha Latte', category: 'noncoffee', price: 48000, desc: 'Kreasi unik matcha Jepang dipadu selai stroberi segar & susu.', img: 'menus/Strawberry Matcha Latte.png', badge: 'Spesial', inStock: true },
    { id: 'p18', name: 'The Au Citron', category: 'noncoffee', price: 38000, desc: 'Teh lemon dingin segar dengan wangi teh berkualitas & keasaman alami.', img: 'menus/The Au Citron.png', badge: 'Segar', inStock: true }
  ],
  bookings: [
    { id: 'BD-RSV-849201', name: 'Ahmad Rizky', phone: '081234567891', date: '2026-09-24', time: '14:30', guests: '3-4', area: 'Indoor AC', status: 'Dikonfirmasi', createdAt: new Date().toISOString() },
    { id: 'BD-RSV-719302', name: 'Siti Sarah', phone: '081987654321', date: '2026-09-24', time: '16:00', guests: '5-8', area: 'Outdoor Garden', status: 'Pending', createdAt: new Date().toISOString() },
    { id: 'BD-RSV-391048', name: 'Budi Pratama', phone: '081345678902', date: '2026-09-24', time: '19:00', guests: '1-2', area: 'Espresso Bar', status: 'Dikonfirmasi', createdAt: new Date().toISOString() },
    { id: 'BD-RSV-102948', name: 'Dewi Lestari', phone: '081567890123', date: '2026-09-25', time: '10:00', guests: '3-4', area: 'Indoor AC', status: 'Pending', createdAt: new Date().toISOString() }
  ],
  users: [],
  orders: []
};
