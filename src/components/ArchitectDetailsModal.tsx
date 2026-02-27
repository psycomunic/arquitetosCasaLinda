import React from 'react';
import { X, User, Phone, Mail, MapPin, Building, Calendar, Globe, CreditCard } from 'lucide-react';
import { Architect } from '../types/database';
import { supabase } from '../lib/supabase';

interface ArchitectDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    architect: Architect;
    onUpdate?: () => void;
}

export const ArchitectDetailsModal: React.FC<ArchitectDetailsModalProps> = ({ isOpen, onClose, architect, onUpdate }) => {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-950 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-start justify-between bg-zinc-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-gold/20">
                            {architect.profile_photo_url ? (
                                <img src={architect.profile_photo_url} alt={architect.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-zinc-500" size={32} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-serif">{architect.name}</h2>
                            <p className="text-sm text-zinc-400">{architect.office_name || 'Escritório não informado'}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${architect.approval_status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'} uppercase tracking-wider font-bold`}>
                                    {architect.approval_status === 'approved' ? 'Aprovado' : 'Pendente'}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wider">
                                    Membro desde {formatDate(architect.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Contact Info */}
                    <section>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 flex items-center gap-2">
                            <Phone size={14} /> Contato
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase">E-mail</p>
                                <p className="text-white text-sm break-all">{architect.email}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase">Telefone / WhatsApp</p>
                                <p className="text-white text-sm font-mono">{architect.phone || '—'}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase">Website / Portfólio</p>
                                <p className="text-white text-sm truncate">{architect.website || '—'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Professional Info */}
                    <section>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 flex items-center gap-2">
                            <Building size={14} /> Dados Profissionais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase">CAU / ABD</p>
                                <p className="text-white text-sm font-mono">{architect.cau || '—'}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase">CNPJ</p>
                                <p className="text-white text-sm font-mono">{architect.cnpj || '—'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Address */}
                    <section>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 flex items-center gap-2">
                            <MapPin size={14} /> Endereço
                        </h3>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">Logradouro</p>
                                    <p className="text-white text-sm">{architect.street || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">Número</p>
                                    <p className="text-white text-sm">{architect.number || '—'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">Complemento</p>
                                    <p className="text-white text-sm">{architect.complement || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">Bairro</p>
                                    <p className="text-white text-sm">{architect.neighborhood || '—'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">Cidade / Estado</p>
                                    <p className="text-white text-sm">{architect.city && architect.state ? `${architect.city} - ${architect.state}` : '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase">CEP</p>
                                    <p className="text-white text-sm font-mono">{architect.zip_code || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Financial Stats */}
                    <section>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-4 flex items-center gap-2">
                            <CreditCard size={14} /> Dados Financeiros
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase">Cupom Ativo</p>
                                <p className="text-white font-mono text-lg">{architect.coupon_code || '—'}</p>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase">Comissão Atual</p>
                                <p className="text-gold font-bold text-lg">{architect.commission_rate}%</p>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase">Total Recebido</p>
                                <p className="text-green-400 font-bold text-lg">{formatCurrency(architect.total_earnings)}</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
