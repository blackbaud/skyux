const VENDORS = [
  'Acme Office Supply',
  'Blue Ridge Catering',
  'City Print Shop',
  'Delta Travel',
  'Evergreen Utilities',
];

const CATEGORIES = ['Catering', 'Office', 'Printing', 'Travel', 'Utilities'];

export const TRANSACTIONS = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  date: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  vendor: VENDORS[i % VENDORS.length],
  category: CATEGORIES[(i * 3) % CATEGORIES.length],
  amount: ((i * 37) % 2000) + 0.99,
  reference: `TXN-${String(i + 1).padStart(5, '0')}`,
}));
