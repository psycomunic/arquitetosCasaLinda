import { ArtPiece, Sale, Frame, Finish } from './types';

export const FRAMES: Frame[] = [
  // Sem Moldura
  { id: 'sm1', name: 'Sem Moldura (Borda Infinita)', price: 0, category: 'Sem Moldura', allowsGlass: true, thumbnailUrl: '/images/frames/borda-infinita.jpg' },

  // Caixa
  { id: 'c1', name: 'Caixa Preta', price: 250, category: 'Caixa', allowsGlass: true, thumbnailUrl: '/images/frames/caixa-preta.png' },
  { id: 'c2', name: 'Caixa Branca', price: 250, category: 'Caixa', allowsGlass: true, thumbnailUrl: '/images/frames/caixa-branca.png' },
  { id: 'c3', name: 'Caixa Dourada', price: 300, category: 'Caixa', allowsGlass: true, thumbnailUrl: '/images/frames/caixa-dourada.png' },
  { id: 'c4', name: 'Caixa Madeira', price: 280, category: 'Caixa', allowsGlass: true, thumbnailUrl: '/images/frames/caixa-madeira.png' },

  // Premium - Clássicas
  { id: 'p1', name: 'Trono de Ouro', price: 500, category: 'Premium', subCategory: 'Clássicas', allowsGlass: true, thumbnailUrl: '/images/frames/trono-de-ouro-v2.jpg' },
  { id: 'p2', name: 'Majestade Negra', price: 480, category: 'Premium', subCategory: 'Clássicas', allowsGlass: true, thumbnailUrl: '/images/frames/majestade-negra.jpg' },
  { id: 'p3', name: 'Galeria Imperial', price: 520, category: 'Premium', subCategory: 'Clássicas', allowsGlass: true, thumbnailUrl: '/images/frames/galeria-imperial-v2.jpg' },

  // Premium - Luxo
  { id: 'p4', name: 'Roma Moderna', price: 600, category: 'Premium', subCategory: 'Luxo', allowsGlass: true, thumbnailUrl: '/images/frames/roma-moderna.jpg' },
  { id: 'p5', name: 'Palaciana', price: 620, category: 'Premium', subCategory: 'Luxo', allowsGlass: true, thumbnailUrl: '/images/frames/palaciana.jpg' },
  { id: 'p6', name: 'Realce Imperial', price: 580, category: 'Premium', subCategory: 'Luxo', allowsGlass: true, thumbnailUrl: '/images/frames/realce-imperial.jpg' },
  { id: 'p7', name: 'Imperial Prata e Ouro', price: 650, category: 'Premium', subCategory: 'Luxo', allowsGlass: true, thumbnailUrl: '/images/frames/imperial-prata-e-ouro.jpg' },
  { id: 'p8', name: 'Barroco Imperial', price: 700, category: 'Premium', subCategory: 'Luxo', allowsGlass: true, thumbnailUrl: '/images/frames/barroco-imperial.jpg' },

  // Premium - Flutuante/Canaleta
  { id: 'p9', name: 'Flutuante Preta', price: 400, category: 'Premium', subCategory: 'Flutuante/Canaleta', allowsGlass: false, thumbnailUrl: '/images/frames/flutuante-preta.png' },
  { id: 'p10', name: 'Flutuante Branca', price: 400, category: 'Premium', subCategory: 'Flutuante/Canaleta', allowsGlass: false, thumbnailUrl: '/images/frames/flutuante-branca.png' },
  { id: 'p11', name: 'Flutuante Dourada', price: 450, category: 'Premium', subCategory: 'Flutuante/Canaleta', allowsGlass: false, thumbnailUrl: '/images/frames/flutuante-dourada.jpg' },
  { id: 'p12', name: 'Flutuante Madeira', price: 420, category: 'Premium', subCategory: 'Flutuante/Canaleta', allowsGlass: false, thumbnailUrl: '/images/frames/flutuante-madeira.jpg' },

  // Premium - Côncava
  { id: 'p13', name: 'Côncava Preta', price: 350, category: 'Premium', subCategory: 'Côncava', allowsGlass: true, thumbnailUrl: '/images/frames/concava-preta.png' },
  { id: 'p14', name: 'Côncava Branca', price: 350, category: 'Premium', subCategory: 'Côncava', allowsGlass: true, thumbnailUrl: '/images/frames/concava-branca.jpg' },
  { id: 'p15', name: 'Côncava Dourada', price: 380, category: 'Premium', subCategory: 'Côncava', allowsGlass: true, thumbnailUrl: '/images/frames/concava-dourada.png' },
  { id: 'p16', name: 'Côncava Madeira', price: 360, category: 'Premium', subCategory: 'Côncava', allowsGlass: true, thumbnailUrl: '/images/frames/concava-madeira.jpg' },

  // Premium - Inox
  { id: 'p17', name: 'Inox', price: 800, category: 'Premium', allowsGlass: true }
];

export const FINISHES: Finish[] = [
  { id: 'f1', name: 'Sem Vidro', price: 0.00, isGlass: false },
  { id: 'f2', name: 'Com Vidro', price: 250.00, isGlass: true }
];

export const FORMATS = [
  {
    id: 'quadrado',
    label: '1 Tela Quadrado',
    sizes: ['85x85cm', '115x115cm', '145x145cm']
  },
  {
    id: 'padrao',
    label: '1 Tela',
    sizes: ['85x55cm', '115x75cm', '145x95cm', '175x100cm']
  },
  {
    id: 'dupla',
    label: '2 Telas',
    sizes: ['55x35cm cada', '85x55cm cada', '115x75cm cada', '145x95cm cada', '175x95cm cada']
  },
  {
    id: 'tripla',
    label: '3 Telas',
    sizes: ['40x20cm cada', '55x30cm cada', '70x40cm cada', '90x50cm cada', '120x70cm cada']
  }
];

export const MOCK_ARTS: ArtPiece[] = [
  {
    id: '1',
    title: 'Abstração Minimalista I',
    category: 'Abstrato',
    price: 1250.00,
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Horizonte Etéreo',
    category: 'Natureza',
    price: 1890.00,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Concreto e Ouro',
    category: 'Moderno',
    price: 2400.00,
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Jardim de Inverno',
    category: 'Floral',
    price: 980.00,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Serenidade Marinha',
    category: 'Marinha',
    price: 1550.00,
    imageUrl: 'https://images.unsplash.com/photo-1515405299443-f71bb768063e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Geometria Sagrada',
    category: 'Abstrato',
    price: 3200.00,
    imageUrl: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=800&auto=format&fit=crop'
  }
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'ORD-7721',
    clientName: 'Roberto Almeida',
    value: 3500.00,
    commission: 700.00,
    date: '2024-05-10',
    status: 'Concluído'
  },
  {
    id: 'ORD-7815',
    clientName: 'Clínica Odontológica Dra. Julia',
    value: 8200.00,
    commission: 1640.00,
    date: '2024-05-12',
    status: 'Em Processamento'
  },
  {
    id: 'ORD-7940',
    clientName: 'Mariana Costa',
    value: 1200.00,
    commission: 240.00,
    date: '2024-05-14',
    status: 'Concluído'
  },
  {
    id: 'ORD-8102',
    clientName: 'Escritório Advocacia Silva',
    value: 15600.00,
    commission: 3120.00,
    date: '2024-05-16',
    status: 'Concluído'
  }
];
