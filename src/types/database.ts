// Database types for Supabase tables

export interface Architect {
    id: string;
    email: string;
    name: string;
    office_name: string;
    logo_url: string | null;
    commission_rate: number;
    total_earnings: number;
    is_admin: boolean;
    approval_status: 'pending' | 'approved' | 'rejected';
    city: string | null;
    state: string | null;
    cau?: string | null;
    cnpj?: string | null;
    phone?: string | null;
    website?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    zip_code?: string | null;
    profile_photo_url?: string | null;
    approved_at: string | null;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface Proposal {
    id: string;
    architect_id: string;
    client_name: string;
    project_name: string | null;
    total_value: number;
    commission_value: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    pdf_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProposalItem {
    id: string;
    proposal_id: string;
    product_name: string;
    product_code: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    image_url: string | null;
    created_at: string;
}

export interface Sale {
    id: string;
    architect_id: string;
    proposal_id: string | null;
    sale_value: number;
    commission_value: number;
    commission_rate: number;
    status: 'pending' | 'paid' | 'cancelled';
    city: string | null;
    state: string | null;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Database {
    public: {
        Tables: {
            architects: {
                Row: Architect;
                Insert: Omit<Architect, 'created_at' | 'updated_at' | 'total_earnings'>;
                Update: Partial<Omit<Architect, 'id' | 'created_at'>>;
            };
            proposals: {
                Row: Proposal;
                Insert: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Proposal, 'id' | 'created_at' | 'architect_id'>>;
            };
            proposal_items: {
                Row: ProposalItem;
                Insert: Omit<ProposalItem, 'id' | 'created_at'>;
                Update: Partial<Omit<ProposalItem, 'id' | 'created_at' | 'proposal_id'>>;
            };
            sales: {
                Row: Sale;
                Insert: Omit<Sale, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Sale, 'id' | 'created_at' | 'architect_id'>>;
            };
        };
    };
}
