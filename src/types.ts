
export interface Frame {
  id: string;
  name: string;
  price: number;
  category: 'Caixa' | 'Premium' | 'Inox' | 'Sem Moldura';
  subCategory?: 'Clássicas' | 'Luxo' | 'Flutuante/Canaleta' | 'Côncava';
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

export interface ProposalItem {
  id: string;
  artPiece?: ArtPiece;
  customImageUrl?: string;
  title: string;
  frame?: Frame;
  finish?: Finish;
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
  logoUrl?: string;
  commissionRate: number;
  totalEarnings: number;
}

export interface Sale {
  id: string;
  clientName: string;
  value: number;
  commission: number;
  date: string;
  status: string;
}
