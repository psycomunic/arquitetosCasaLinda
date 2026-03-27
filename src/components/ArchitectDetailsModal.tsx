import React, { useState } from 'react';
import { X, User, Phone, Building, MapPin, CreditCard, Kanban, CheckCircle2, Loader2 } from 'lucide-react';
import { Architect } from '../types/database';
import { supabase } from '../lib/supabase';

interface ArchitectDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    architect: Architect;
    onUpdate?: () => void;
}

const CRM_VENDEDORES = [
    { value: 'Kelly Cordeiro da Silva', label: 'Kelly Cordeiro da Silva' },
    { value: 'Gisele Ferreira',         label: 'Gisele Ferreira' },
    { value: 'Angelo',                  label: 'Angelo (Admin)' },
];

const CRM_STAGES = [
    { value: 'novo',             label: 'Novo Lead' },
    { value: 'contato_feito',    label: 'Contato Feito' },
    { value: 'proposta_enviada', label: 'Proposta Enviada' },
    { value: 'negociando',       label: 'Negociando' },
];

const CRM_SERVICES = [
    { value: 'indefinido',       label: 'Não Definido' },
    { value: 'indicacao_direta', label: 'Indicação Direta' },
    { value: 'venda_assistida',  label: 'Venda Assistida' },
    { value: 'criacao_artistica',label: 'Criação Artística' },
];

export const ArchitectDetailsModal: React.FC<ArchitectDetailsModalProps> = ({ isOpen, onClose, architect, onUpdate }) => {
    const [sendCrmOpen, setSendCrmOpen] = useState(false);
    const [crmAttendant, setCrmAttendant] = useState('Kelly Cordeiro da Silva');
    const [crmStage, setCrmStage] = useState('novo');
    const [crmServiceType, setCrmServiceType] = useState('indefinido');
    const [crmSending, setCrmSending] = useState(false);
    const [crmSent, setCrmSent] = useState(false);

    if (!isOpen) return null;

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleSendToCRM = async () => {
        setCrmSending(true);
        try {
            const { data: existing } = await (supabase.from('crm_leads') as any)
                .select('id')
                .eq('contact_email', architect.email)
                .maybeSingle();

            if (existing) {
                const { error: updateError } = await (supabase.from('crm_leads') as any)
                    .update({ attendant_name: crmAttendant, pipeline_stage: crmStage, service_type: crmServiceType })
                    .eq('id', existing.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await (supabase.from('crm_leads') as any).insert({
                    architect_id:   architect.id,
                    contact_name:   architect.name,
                    contact_email:  architect.email,
                    contact_phone:  architect.phone || '',
                    attendant_name: crmAttendant,
                    pipeline_stage: crmStage,
                    service_type:   crmServiceType,
                    notes:          `Arquiteto parceiro. Cupom: ${architect.coupon_code || '—'}. Cadastrado em ${formatDate(architect.created_at)}.`,
                });
                if (insertError) throw insertError;
            }
            if (onUpdate) onUpdate();
            setCrmSent(true);
            setTimeout(() => { setSendCrmOpen(false); setCrmSent(false); }, 2000);
        } catch (err) {
            console.error('Erro ao enviar para o CRM:', err);
            alert('Falha ao enviar para o CRM. Verifique se o e-mail já existe ou tente novamente.');
        } finally {
            setCrmSending(false);
        }
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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSendCrmOpen(!sendCrmOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${sendCrmOpen ? 'bg-gold text-black' : 'bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20'}`}
                        >
                            <Kanban size={14} /> Enviar ao CRM
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* CRM Send Panel */}
                    {sendCrmOpen && (
                        <section className="bg-gold/5 border border-gold/20 rounded-xl p-5 space-y-4">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold flex items-center gap-2">
                                <Kanban size={14} /> Enviar para o CRM
                            </h3>
                            <p className="text-zinc-400 text-xs">Selecione o vendedor responsável e o estágio inicial. O lead será criado com os dados deste arquiteto.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Atendente</label>
                                    <select value={crmAttendant} onChange={e => setCrmAttendant(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold">
                                        {CRM_VENDEDORES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Estágio Inicial</label>
                                    <select value={crmStage} onChange={e => setCrmStage(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold">
                                        {CRM_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Serviço</label>
                                    <select value={crmServiceType} onChange={e => setCrmServiceType(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold">
                                        {CRM_SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleSendToCRM} disabled={crmSending || crmSent}
                                className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${crmSent ? 'bg-green-500 text-white' : 'bg-gold text-black hover:bg-white'} disabled:opacity-70`}>
                                {crmSent ? <><CheckCircle2 size={16} /> Lead enviado com sucesso!</> :
                                 crmSending ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> :
                                 <><Kanban size={16} /> Confirmar e enviar ao CRM</>}
                            </button>
                        </section>
                    )}

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase">Chave PIX</p>
                                <p className="text-white font-mono text-base">{architect.pix_key || 'Não informada'}</p>
                            </div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3">
                            <div className="text-yellow-500 mt-0.5">⚠️</div>
                            <div>
                                <h4 className="text-yellow-500 font-bold text-sm">Atenção Arquiteto(a)</h4>
                                <p className="text-zinc-400 text-sm mt-1">O pagamento dos repasses é realizado todo <strong>dia 10</strong>. É obrigatória a emissão de <strong>Nota Fiscal</strong> correspondente ao valor para recebimento.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
