
export interface Frame {
  id: string;
  name: string;
  price: number;
  category: 'Caixa' | 'Premium' | 'Inox' | 'Sem Moldura';
  subCategory?: 'Clássicas' | 'Luxo' | 'Flutuante/Canaleta' | 'Côncava';
  pricingGroup?: string; // Links to the specific pricing table key
  allowsGlass: boolean;
  thumbnailUrl?: string;
}

export interface Finish {
  id: string;
  name: string;
  price: number;
  isGlass: boolean;
}

export interface ArtPiece {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
}

export interface Format {
  id: string;
  label: string;
  image?: string;
  sizes?: string[]; // New field for available sizes
}

export interface ProposalItem {
  id: string;
  artPiece?: ArtPiece;
  customImageUrl?: string;
  title: string;
  frame?: Frame;
  finish?: Finish;
  format?: Format;
  size?: string; // New field for selected size
  quantity: number;
  price: number;
}

export interface Proposal {
  id: string;
  clientName: string;
  date: string;
  items: ProposalItem[];
  totalValue: number;
  status: 'Pendente' | 'Aprovado' | 'Cancelado';
}

export interface ArchitectProfile {
  name: string;
  officeName: string;
  logoUrl?: string | null;
  profilePhotoUrl?: string | null;
  cau?: string;
  cnpj?: string;
  phone?: string;
  website?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  commissionRate: number;
  totalEarnings: number;
  couponCode?: string | null;
  isAdmin?: boolean;
}

export interface Sale {
  id: string;
  clientName: string;
  value: number;
  commission: number;
  date: string;
  status: string;
}
