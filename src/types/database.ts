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
    pix_key?: string | null;
    coupon_code: string | null;
    magazord_seller_code?: string | null;
    created_at: string;
    updated_at: string;
}

export interface MagazordCommission {
    id: string;
    architect_id: string;
    magazord_order_id: string;
    magazord_seller_code: string;
    order_value: number;
    commission_amount: number;
    status: 'AWAITING' | 'PENDING' | 'PAID' | 'CANCELED';
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

export type PipelineStage = 'novo' | 'contato_feito' | 'proposta_enviada' | 'negociando' | 'fechado' | 'perdido';
export type ActivityType = 'call' | 'whatsapp' | 'email' | 'note' | 'meeting';
export type TemplateCategory = 'boas_vindas' | 'follow_up' | 'proposta' | 'reativacao' | 'outros';

export interface CRMLead {
    id: string;
    architect_id: string | null;
    attendant_name: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string | null;
    pipeline_stage: PipelineStage;
    deal_value: number;
    closed_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CRMActivity {
    id: string;
    lead_id: string;
    type: ActivityType;
    description: string;
    attendant_name: string;
    created_at: string;
}

export interface CRMMessageTemplate {
    id: string;
    category: TemplateCategory;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
}

export interface CRMFollowUp {
    id: string;
    lead_id: string;
    attendant_name: string;
    due_date: string;
    message: string | null;
    completed: boolean;
    created_at: string;
}

export interface Database {
    public: {
        Tables: {
            architects: {
                Row: Architect;
                Insert: Omit<Architect, 'created_at' | 'updated_at' | 'total_earnings'>;
                Update: Partial<Omit<Architect, 'id' | 'created_at'>>;
            };
            magazord_commissions: {
                Row: MagazordCommission;
                Insert: Omit<MagazordCommission, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<MagazordCommission, 'id' | 'created_at' | 'architect_id' | 'magazord_order_id'>>;
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
