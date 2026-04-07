/**
 * Demo Products для Quick Retail Checkout
 * Реальные салонные продукты с ценами в AED
 */

export interface DemoProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  description?: string;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  // Hair Care Products
  {
    id: 'prod-1',
    name: 'Kerastase Nutritive Shampoo',
    price: 145,
    category: 'Hair Care',
    stock: 15,
    description: 'Nourishing shampoo for dry hair',
  },
  {
    id: 'prod-2',
    name: 'Olaplex Bond Repair',
    price: 165,
    category: 'Hair Care',
    stock: 12,
    description: 'Professional hair treatment',
  },
  {
    id: 'prod-3',
    name: 'Moroccanoil Treatment',
    price: 180,
    category: 'Hair Care',
    stock: 20,
    description: 'Argan oil hair treatment',
  },
  {
    id: 'prod-4',
    name: 'Living Proof Conditioner',
    price: 125,
    category: 'Hair Care',
    stock: 10,
    description: 'Moisturizing conditioner',
  },
  {
    id: 'prod-5',
    name: 'Bumble and Bumble Serum',
    price: 95,
    category: 'Hair Care',
    stock: 18,
    description: 'Anti-frizz hair serum',
  },

  // Nail Products
  {
    id: 'prod-6',
    name: 'OPI Nail Polish',
    price: 45,
    category: 'Nail Care',
    stock: 30,
    description: 'Long-lasting nail polish',
  },
  {
    id: 'prod-7',
    name: 'CND Cuticle Oil',
    price: 55,
    category: 'Nail Care',
    stock: 25,
    description: 'Nourishing cuticle oil',
  },
  {
    id: 'prod-8',
    name: 'Essie Gel Couture',
    price: 50,
    category: 'Nail Care',
    stock: 22,
    description: 'Gel-like finish polish',
  },
  {
    id: 'prod-9',
    name: 'OPI Top Coat',
    price: 40,
    category: 'Nail Care',
    stock: 20,
    description: 'Quick-dry top coat',
  },

  // Skin Care
  {
    id: 'prod-10',
    name: 'La Roche-Posay Face Cream',
    price: 185,
    category: 'Skin Care',
    stock: 8,
    description: 'Hydrating face cream',
  },
  {
    id: 'prod-11',
    name: 'Cetaphil Cleanser',
    price: 75,
    category: 'Skin Care',
    stock: 15,
    description: 'Gentle facial cleanser',
  },
  {
    id: 'prod-12',
    name: 'The Ordinary Serum',
    price: 95,
    category: 'Skin Care',
    stock: 12,
    description: 'Anti-aging serum',
  },
  {
    id: 'prod-13',
    name: 'Neutrogena SPF 50',
    price: 85,
    category: 'Skin Care',
    stock: 10,
    description: 'Sun protection cream',
  },

  // Makeup
  {
    id: 'prod-14',
    name: 'MAC Ruby Woo Lipstick',
    price: 110,
    category: 'Makeup',
    stock: 14,
    description: 'Classic red lipstick',
  },
  {
    id: 'prod-15',
    name: 'Urban Decay Eyeshadow',
    price: 220,
    category: 'Makeup',
    stock: 8,
    description: 'Naked palette',
  },
  {
    id: 'prod-16',
    name: 'Fenty Beauty Foundation',
    price: 195,
    category: 'Makeup',
    stock: 10,
    description: 'Full coverage foundation',
  },
  {
    id: 'prod-17',
    name: 'Benefit Mascara',
    price: 135,
    category: 'Makeup',
    stock: 12,
    description: 'Volumizing mascara',
  },

  // Lashes & Brows
  {
    id: 'prod-18',
    name: 'Ardell Lashes',
    price: 35,
    category: 'Lashes',
    stock: 40,
    description: 'Natural-looking lashes',
  },
  {
    id: 'prod-19',
    name: 'Lash Glue Professional',
    price: 25,
    category: 'Lashes',
    stock: 30,
    description: 'Strong hold lash adhesive',
  },
  {
    id: 'prod-20',
    name: 'Anastasia Brow Gel',
    price: 125,
    category: 'Brows',
    stock: 15,
    description: 'Clear brow gel',
  },

  // Body Care
  {
    id: 'prod-21',
    name: 'Bath & Body Works Lotion',
    price: 65,
    category: 'Body Care',
    stock: 25,
    description: 'Moisturizing body lotion',
  },
  {
    id: 'prod-22',
    name: 'Vaseline Body Oil',
    price: 45,
    category: 'Body Care',
    stock: 20,
    description: 'Nourishing body oil',
  },
  {
    id: 'prod-23',
    name: 'Nivea Hand Cream',
    price: 35,
    category: 'Body Care',
    stock: 30,
    description: 'Intensive hand care',
  },

  // Tools & Accessories
  {
    id: 'prod-24',
    name: 'Professional Hair Brush',
    price: 85,
    category: 'Tools',
    stock: 12,
    description: 'Detangling brush',
  },
  {
    id: 'prod-25',
    name: 'Nail File Set',
    price: 40,
    category: 'Tools',
    stock: 25,
    description: 'Professional nail files',
  },
  {
    id: 'prod-26',
    name: 'Makeup Brushes Set',
    price: 250,
    category: 'Tools',
    stock: 8,
    description: 'Complete brush set',
  },

  // Gift Sets
  {
    id: 'prod-27',
    name: 'Luxury Hair Care Set',
    price: 450,
    category: 'Gift Sets',
    stock: 5,
    description: 'Shampoo + Conditioner + Treatment',
  },
  {
    id: 'prod-28',
    name: 'Manicure Gift Box',
    price: 180,
    category: 'Gift Sets',
    stock: 10,
    description: 'Complete nail care kit',
  },
  {
    id: 'prod-29',
    name: 'Spa Day Package',
    price: 350,
    category: 'Gift Sets',
    stock: 6,
    description: 'Relaxation essentials',
  },

  // Perfumes
  {
    id: 'prod-30',
    name: 'Chanel No. 5',
    price: 550,
    category: 'Perfume',
    stock: 4,
    description: 'Classic fragrance',
  },
  {
    id: 'prod-31',
    name: 'Dior Sauvage',
    price: 480,
    category: 'Perfume',
    stock: 6,
    description: 'Fresh & spicy scent',
  },
  {
    id: 'prod-32',
    name: 'Jo Malone Cologne',
    price: 420,
    category: 'Perfume',
    stock: 5,
    description: 'English pear & freesia',
  },
];

// Helper functions
export const getProductsByCategory = (category: string) => {
  return DEMO_PRODUCTS.filter(p => p.category === category);
};

export const getAllCategories = () => {
  return Array.from(new Set(DEMO_PRODUCTS.map(p => p.category)));
};

export const searchProducts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return DEMO_PRODUCTS.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
  );
};

export const getProductById = (id: string) => {
  return DEMO_PRODUCTS.find(p => p.id === id);
};

// Top sellers
export const TOP_SELLING_PRODUCTS = [
  'prod-3', // Moroccanoil
  'prod-6', // OPI Polish
  'prod-10', // La Roche-Posay
  'prod-14', // MAC Lipstick
  'prod-27', // Hair Care Set
];
