export interface Diamond {
  id: string;
  shape: 'Round' | 'Princess' | 'Emerald' | 'Oval' | 'Pear' | 'Marquise' | 'Cushion';
  carat: number;
  color: 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1';
  cut: 'Excellent' | 'Very Good' | 'Good';
  certificate: 'GIA' | 'IGI' | 'HRD';
  certNumber: string;
  price: number;
  polish: 'Excellent' | 'Very Good';
  symmetry: 'Excellent' | 'Very Good';
  fluorescence: 'None' | 'Faint' | 'Medium';
}

export interface Setting {
  id: string;
  name: string;
  style: 'Solitaire' | 'Halo' | 'French Pavé' | 'Vintage' | 'Three-Stone';
  metal: 'Gold' | 'Platinum';
  metalPurity: '14K' | '18K' | '950';
  metalColor: 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Platinum';
  price: number;
  image: string;
  rating: number;
  weightGrams: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Rings' | 'Earrings' | 'Necklaces' | 'Bangles' | 'Solitaires';
  description: string;
  metal: '18K Yellow Gold' | '18K White Gold' | '18K Rose Gold' | 'Platinum 950';
  metalWeight: string;
  diamondWeight: string;
  diamondClarity: string;
  diamondColor: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
}

export const CATEGORIES = [
  { id: 'rings', name: 'Rings', count: 1240, image: '/tanishq/ring-3-4-26.jpg' },
  { id: 'necklaces', name: 'Necklaces', count: 850, image: '/tanishq/pendants-3-4-26.jpg' },
  { id: 'earrings', name: 'Earrings', count: 1845, image: '/tanishq/earrings-3-4-26.jpg' },
  { id: 'bangles', name: 'Bangles', count: 420, image: '/tanishq/bangles-3-4-26.jpg' },
  { id: 'solitaires', name: 'Solitaires', count: 2400, image: '/tanishq/all-jew-cat.jpg' }
];

export const MOCK_DIAMONDS: Diamond[] = [
  { id: 'D-101', shape: 'Round', carat: 1.02, color: 'D', clarity: 'IF', cut: 'Excellent', certificate: 'GIA', certNumber: 'GIA-64219875', price: 8200, polish: 'Excellent', symmetry: 'Excellent', fluorescence: 'None' },
  { id: 'D-102', shape: 'Round', carat: 0.72, color: 'E', clarity: 'VVS1', cut: 'Excellent', certificate: 'GIA', certNumber: 'GIA-73910284', price: 4100, polish: 'Excellent', symmetry: 'Excellent', fluorescence: 'None' },
  { id: 'D-103', shape: 'Round', carat: 1.54, color: 'F', clarity: 'VS1', cut: 'Very Good', certificate: 'IGI', certNumber: 'IGI-45892019', price: 9500, polish: 'Excellent', symmetry: 'Very Good', fluorescence: 'Faint' },
  { id: 'D-104', shape: 'Princess', carat: 1.10, color: 'D', clarity: 'VVS2', cut: 'Excellent', certificate: 'GIA', certNumber: 'GIA-82910395', price: 6800, polish: 'Excellent', symmetry: 'Excellent', fluorescence: 'None' },
  { id: 'D-105', shape: 'Oval', carat: 0.90, color: 'G', clarity: 'VS2', cut: 'Excellent', certificate: 'GIA', certNumber: 'GIA-19302948', price: 3800, polish: 'Excellent', symmetry: 'Very Good', fluorescence: 'None' },
  { id: 'D-106', shape: 'Pear', carat: 1.25, color: 'E', clarity: 'VS1', cut: 'Very Good', certificate: 'GIA', certNumber: 'GIA-58291032', price: 7400, polish: 'Very Good', symmetry: 'Very Good', fluorescence: 'Medium' },
  { id: 'D-107', shape: 'Emerald', carat: 1.51, color: 'F', clarity: 'VVS1', cut: 'Excellent', certificate: 'HRD', certNumber: 'HRD-29103958', price: 11200, polish: 'Excellent', symmetry: 'Excellent', fluorescence: 'None' },
  { id: 'D-108', shape: 'Cushion', carat: 1.05, color: 'H', clarity: 'SI1', cut: 'Very Good', certificate: 'IGI', certNumber: 'IGI-91820495', price: 2900, polish: 'Very Good', symmetry: 'Very Good', fluorescence: 'None' },
  { id: 'D-109', shape: 'Marquise', carat: 0.85, color: 'D', clarity: 'VVS2', cut: 'Excellent', certificate: 'GIA', certNumber: 'GIA-49301934', price: 4900, polish: 'Excellent', symmetry: 'Very Good', fluorescence: 'None' }
];

export const MOCK_SETTINGS: Setting[] = [
  { id: 'S-201', name: 'Classic Solitaire Engagement Ring', style: 'Solitaire', metal: 'Gold', metalPurity: '18K', metalColor: 'White Gold', price: 950, image: '/bluestone_ring1.png', rating: 4.9, weightGrams: 3.5 },
  { id: 'S-202', name: 'Classic Solitaire Engagement Ring', style: 'Solitaire', metal: 'Gold', metalPurity: '18K', metalColor: 'Yellow Gold', price: 950, image: '/bluestone_ring1.png', rating: 4.8, weightGrams: 3.5 },
  { id: 'S-203', name: 'Luxe French Pavé Diamond Setting', style: 'French Pavé', metal: 'Gold', metalPurity: '18K', metalColor: 'Rose Gold', price: 1450, image: '/bluestone_ring2.png', rating: 4.9, weightGrams: 4.0 },
  { id: 'S-204', name: 'Luxe French Pavé Diamond Setting', style: 'French Pavé', metal: 'Gold', metalPurity: '18K', metalColor: 'White Gold', price: 1450, image: '/bluestone_ring2.png', rating: 5.0, weightGrams: 4.0 },
  { id: 'S-205', name: 'Celestial Halo Diamond Setting', style: 'Halo', metal: 'Platinum', metalPurity: '950', metalColor: 'Platinum', price: 1950, image: '/bluestone_ring3.png', rating: 4.9, weightGrams: 5.2 },
  { id: 'S-206', name: 'Victorian Heirloom Vintage Setting', style: 'Vintage', metal: 'Gold', metalPurity: '18K', metalColor: 'Yellow Gold', price: 1650, image: '/bluestone_ring3.png', rating: 4.7, weightGrams: 4.5 }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'P-301',
    sku: 'NEC-VNS-001',
    name: 'Exquisite Vines Diamond Necklace Set',
    category: 'Necklaces',
    description: 'An elegant neckpiece featuring interlocking gold vines studded with brilliant round-cut diamonds. Set includes matching teardrop drop earrings.',
    metal: '18K Yellow Gold',
    metalWeight: '18.4g',
    diamondWeight: '2.50 ct total',
    diamondClarity: 'VVS2',
    diamondColor: 'E',
    price: 12500,
    image: '/tanishq/prod_exquisite_necklace.jpg',
    rating: 5.0,
    reviewsCount: 18,
    isBestseller: true
  },
  {
    id: 'P-302',
    sku: 'BGL-TWS-002',
    name: 'Twisted Diamond Bangle',
    category: 'Bangles',
    description: 'A modern spiral twist bangle in highly polished 18K rose gold, accented by twenty pavé-set diamonds on the crossing bands.',
    metal: '18K Rose Gold',
    metalWeight: '14.2g',
    diamondWeight: '0.85 ct',
    diamondClarity: 'VS1',
    diamondColor: 'G',
    price: 3200,
    image: '/bluestone_ring4.png',
    rating: 4.8,
    reviewsCount: 22
  },
  {
    id: 'P-303',
    sku: 'BGL-ARR-003',
    name: 'Arrow Diamond Bangle',
    category: 'Bangles',
    description: 'A striking geometric bangle with arrow-inspired ends encrusted with diamonds, set in 18K white gold. Bold statement style.',
    metal: '18K White Gold',
    metalWeight: '12.8g',
    diamondWeight: '0.72 ct',
    diamondClarity: 'VVS1',
    diamondColor: 'F',
    price: 2800,
    image: '/bluestone_ring4.png',
    rating: 4.9,
    reviewsCount: 14,
    isBestseller: true
  },
  {
    id: 'P-304',
    sku: 'BGL-CON-004',
    name: 'Contemporary Diamond Bangle',
    category: 'Bangles',
    description: 'A highly polished solid platinum bangle featuring a modern asymmetric layout of princess-cut flush-set diamonds.',
    metal: 'Platinum 950',
    metalWeight: '19.5g',
    diamondWeight: '1.20 ct',
    diamondClarity: 'IF',
    diamondColor: 'D',
    price: 4500,
    image: '/bluestone_ring4.png',
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: 'P-305',
    sku: 'BGL-DAZ-005',
    name: 'Dazzling Brilliance Diamond Bangle',
    category: 'Bangles',
    description: 'Features three parallel rows of brilliant-cut diamonds prong-set in 18K white gold, creating an unmatched shimmer.',
    metal: '18K White Gold',
    metalWeight: '15.6g',
    diamondWeight: '2.10 ct',
    diamondClarity: 'VVS2',
    diamondColor: 'E',
    price: 5100,
    image: '/bluestone_ring4.png',
    rating: 5.0,
    reviewsCount: 29
  },
  {
    id: 'P-306',
    sku: 'RNG-EVS-006',
    name: 'Everlasting Shine Diamond Finger Ring',
    category: 'Rings',
    description: 'A classic eternity band wrapped completely in brilliant-cut diamonds, set in high-polish 18K white gold claws.',
    metal: '18K White Gold',
    metalWeight: '3.9g',
    diamondWeight: '0.95 ct',
    diamondClarity: 'VS2',
    diamondColor: 'F',
    price: 1900,
    image: '/bluestone_ring1.png',
    rating: 4.8,
    reviewsCount: 42,
    isBestseller: true
  },
  {
    id: 'P-307',
    sku: 'RNG-LEF-007',
    name: 'Leaf-Inspired Diamond Finger Ring',
    category: 'Rings',
    description: 'An organic botanical ring detailing delicate gold leaves set with marquise-shaped diamonds, crafted in warm 18K gold.',
    metal: '18K Yellow Gold',
    metalWeight: '3.4g',
    diamondWeight: '0.50 ct',
    diamondClarity: 'VS1',
    diamondColor: 'H',
    price: 1400,
    image: '/bluestone_ring1.png',
    rating: 4.7,
    reviewsCount: 16
  },
  {
    id: 'P-308',
    sku: 'NEC-HRT-008',
    name: 'Sparkling Hearts Diamond Necklace',
    category: 'Necklaces',
    description: 'Interlinked open-heart motifs studded with round brilliant diamonds, suspended on a delicate 18K white gold box chain.',
    metal: '18K White Gold',
    metalWeight: '4.8g',
    diamondWeight: '1.15 ct',
    diamondClarity: 'VVS1',
    diamondColor: 'E',
    price: 6500,
    image: '/diamond_pendant.png',
    rating: 4.9,
    reviewsCount: 25
  },
  {
    id: 'P-309',
    sku: 'NEC-BLM-009',
    name: 'Enchanted Bloom Diamond Necklace Set',
    category: 'Necklaces',
    description: 'An editorial statement collar detailing diamond-set floral blossoms blooming from gold branches. Set includes matching stud earrings.',
    metal: '18K Yellow Gold',
    metalWeight: '22.6g',
    diamondWeight: '3.20 ct total',
    diamondClarity: 'IF',
    diamondColor: 'D',
    price: 14200,
    image: '/tanishq/prod_enchanted_necklace.jpg',
    rating: 5.0,
    reviewsCount: 11,
    isBestseller: true
  },
  {
    id: 'P-310',
    sku: 'RNG-SBT-010',
    name: 'Subtle Glam Diamond Finger Ring',
    category: 'Rings',
    description: 'A minimalist dome band in 18K rose gold carrying a single flush-set round brilliant diamond for understated luxury.',
    metal: '18K Rose Gold',
    metalWeight: '3.2g',
    diamondWeight: '0.25 ct',
    diamondClarity: 'VVS2',
    diamondColor: 'G',
    price: 1200,
    image: '/bluestone_ring2.png',
    rating: 4.8,
    reviewsCount: 38
  },
  {
    id: 'P-311',
    sku: 'RNG-CLU-011',
    name: 'Elegant Cluster Diamond Finger Ring',
    category: 'Rings',
    description: 'Features a floral cluster head composed of nine closely set round diamonds, creating the visual effect of a large solitaire.',
    metal: '18K White Gold',
    metalWeight: '4.5g',
    diamondWeight: '1.05 ct',
    diamondClarity: 'VS1',
    diamondColor: 'F',
    price: 2500,
    image: '/bluestone_ring3.png',
    rating: 4.9,
    reviewsCount: 20
  },
  {
    id: 'P-312',
    sku: 'RNG-LOT-012',
    name: 'Lotus Delight Diamond Finger Ring',
    category: 'Rings',
    description: 'A custom lotus petals crown setting in solid platinum, surrounding a high-clarity round brilliant-cut solitaire diamond.',
    metal: 'Platinum 950',
    metalWeight: '5.2g',
    diamondWeight: '0.80 ct',
    diamondClarity: 'IF',
    diamondColor: 'D',
    price: 2100,
    image: '/bluestone_ring2.png',
    rating: 4.9,
    reviewsCount: 17
  },
  {
    id: 'P-313',
    sku: 'RNG-QNM-013',
    name: 'Queen Me! Ring',
    category: 'Rings',
    description: 'A regal crown-shaped tiara ring decorated with shimmering micro-diamonds, set in solid 18K yellow gold.',
    metal: '18K Yellow Gold',
    metalWeight: '4.9g',
    diamondWeight: '1.25 ct',
    diamondClarity: 'VVS1',
    diamondColor: 'E',
    price: 3500,
    image: '/bluestone_ring3.png',
    rating: 5.0,
    reviewsCount: 15,
    isBestseller: true
  },
  {
    id: 'P-314',
    sku: 'RNG-SLK-014',
    name: 'Sleek Diamond Finger Ring',
    category: 'Rings',
    description: 'A simple ultra-thin gold band with five flush-set accent diamonds. Ideal for nesting or stackable wear.',
    metal: '18K Yellow Gold',
    metalWeight: '2.1g',
    diamondWeight: '0.15 ct',
    diamondClarity: 'VS2',
    diamondColor: 'H',
    price: 950,
    image: '/bluestone_ring1.png',
    rating: 4.6,
    reviewsCount: 47
  }
];
