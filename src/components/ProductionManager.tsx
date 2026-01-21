import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
    Printer, 
    CheckCircle2, 
    Clock, 
    Package, 
    Search, 
    Plus, 
    Loader2, 
    FileText, 
    User,
    ChevronDown,
    ChevronUp,
    Layout,
    Box,
    X,
    Calendar,
    PackageCheck,
    AlertCircle
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { FRAMES } from '../constants';

interface ProductionOrder {
    id: string;
    proposal_id?: string;
    client_name: string;
    project_name: string;
    architect_name: string;
    total_value: number;
    status: 'paid' | 'production' | 'shipped';
    created_at: string;
    items: any[];
}

export const ProductionManager: React.FC = () => {
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [pendingProposals, setPendingProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'billing' | 'production' | 'manual'>('billing');
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

    // Manual Order Form State
    const [manualOrder, setManualOrder] = useState({
        client_name: '',
        project_name: '',
        architect_name: '',
        art_title: '',
        frame_details: '',
        total_value: '',
        image_url: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Proposals awaiting payment
            const { data: proposals } = await supabase
                .from('proposals')
                .select('*, architects(name, commission_rate)')
                .eq('status', 'sent')
                .order('created_at', { ascending: false });

            // Fetch Items for these proposals
            if (proposals && proposals.length > 0) {
                const { data: items } = await supabase
                    .from('proposal_items')
                    .select('*')
                    .in('proposal_id', proposals.map(p => p.id));
                
                const enriched = proposals.map(p => ({
                    ...p,
                    items: items?.filter(i => i.proposal_id === p.id) || []
                }));
                setPendingProposals(enriched);
            } else {
                setPendingProposals([]);
            }

            // Fetch Paid orders (Production)
            const { data: paidProposals } = await supabase
                .from('proposals')
                .select('*, architects(name, commission_rate)')
                .eq('status', 'paid')
                .order('updated_at', { ascending: false });

            if (paidProposals && paidProposals.length > 0) {
                const { data: pItems } = await supabase
                    .from('proposal_items')
                    .select('*')
                    .in('proposal_id', paidProposals.map(p => p.id));

                const formatted = paidProposals.map(p => ({
                    id: p.id,
                    proposal_id: p.id,
                    client_name: p.client_name,
                    project_name: p.project_name,
                    architect_name: p.architects?.name || 'Manual',
                    total_value: p.total_value,
                    status: 'paid',
                    created_at: p.created_at,
                    items: pItems?.filter(i => i.proposal_id === p.id) || []
                } as ProductionOrder));
                setOrders(formatted);
            } else {
                setOrders([]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (proposal: any) => {
        try {
            const { error } = await supabase
                .from('proposals')
                .update({ status: 'paid', updated_at: new Date().toISOString() })
                .eq('id', proposal.id);

            if (error) throw error;

            // Also create a sale record
            const commissionRate = proposal.architects?.commission_rate || 15;
            const commissionValue = proposal.commission_value || (proposal.total_value * (commissionRate / 100));

            await supabase.from('sales').insert({
                proposal_id: proposal.id,
                architect_id: proposal.architect_id,
                sale_value: proposal.total_value,
                commission_value: commissionValue,
                commission_rate: commissionRate,
                status: 'paid',
                paid_at: new Date().toISOString()
            } as any);

            fetchData();
            alert('Pagamento confirmado! Pedido enviado para produção.');
        } catch (err) {
            console.error(err);
            alert('Erro ao processar pagamento.');
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // For manual orders without an architect ID from DB, 
            // we'll just insert a special record or a proposal with a flag.
            // Since the user asked for "ambiente onde posso adicionar manualmente",
            // let's insert into proposals with a special status.
            
            const userId = (await supabase.auth.getUser()).data.user?.id;
            
            const { data: prop, error: pErr } = await supabase
                .from('proposals')
                .insert({
                    client_name: manualOrder.client_name,
                    project_name: (manualOrder.project_name && manualOrder.project_name.trim() !== '') ? manualOrder.project_name : manualOrder.client_name,
                    total_value: Number(manualOrder.total_value),
                    status: 'paid', // Direct to paid/production
                    architect_id: userId // Set current user as "owner" for RLS
                } as any)
                .select()
                .single();

            if (pErr) throw pErr;

            const { error: iErr } = await supabase
                .from('proposal_items')
                .insert({
                    proposal_id: prop.id,
                    product_name: `${manualOrder.art_title} - ${manualOrder.frame_details}`,
                    product_code: 'MANUAL',
                    quantity: 1,
                    unit_price: Number(manualOrder.total_value),
                    total_price: Number(manualOrder.total_value),
                    image_url: manualOrder.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop' // Fallback image for manual entries
                });

            if (iErr) {
                console.error('Item insertion error:', iErr);
                throw new Error(`Erro ao salvar itens do pedido: ${iErr.message}`);
            }

            console.log('Manual order created successfully with items.');
            
            setManualOrder({
                client_name: '',
                project_name: '',
                architect_name: '',
                art_title: '',
                frame_details: '',
                total_value: '',
                image_url: ''
            });
            setActiveTab('production');
            fetchData();
            alert('Pedido manual criado com sucesso! Agora você pode imprimir o canhoto completo na aba Produção.');
        } catch (err: any) {
            console.error('Manual order full error:', err);
            alert(`Erro ao criar pedido manual: ${err.message || 'Verifique sua conexão'}`);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold" /></div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Nav Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('billing')}
                    className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 ${activeTab === 'billing' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Clock size={14} /> Faturamento ({pendingProposals.length})
                </button>
                <button
                    onClick={() => setActiveTab('production')}
                    className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 ${activeTab === 'production' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Package size={14} /> Produção ({orders.length})
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all flex items-center gap-3 ${activeTab === 'manual' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Plus size={14} /> Pedido Manual
                </button>
            </div>

            {/* Billing Tab: Proposals Awaiting Manual Confirmation */}
            {activeTab === 'billing' && (
                <div className="space-y-6">
                    {pendingProposals.length === 0 ? (
                        <div className="glass p-20 text-center">
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Sem propostas aguardando faturamento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingProposals.map(p => (
                                <div key={p.id} className="glass p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-white font-serif text-2xl">{p.project_name}</h4>
                                            <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase tracking-widest">#{p.id.split('-')[0]}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            <span className="text-gold font-bold">Arquiteto:</span> {p.architects?.name || 'N/A'} 
                                            <span className="mx-2">|</span> 
                                            <span className="text-white font-bold">Cliente:</span> {p.client_name}
                                        </p>
                                        <div className="flex gap-4 pt-4">
                                            {p.items?.map((item: any, idx: number) => (
                                                <img key={idx} src={item.image_url} className="w-10 h-10 object-cover rounded border border-white/10" alt="" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-4">
                                        <p className="text-2xl font-serif text-white">R$ {p.total_value.toLocaleString('pt-BR')}</p>
                                        <button
                                            onClick={() => handleMarkAsPaid(p)}
                                            className="bg-gold text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={14} /> Confirmar Pagamento
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Production Tab: Paid orders queued for production */}
            {activeTab === 'production' && (
                <div className="grid grid-cols-1 gap-6">
                    {orders.length === 0 ? (
                        <div className="glass p-20 text-center">
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Fila de produção vazia.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="glass p-8 flex flex-col md:flex-row justify-between items-center gap-8 border-l-4 border-gold">
                                <div className="space-y-2 flex-1">
                                    <h4 className="text-white font-serif text-2xl">{order.project_name}</h4>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Arquiteto: {order.architect_name}</p>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                                                    <img src={item.image_url} className="w-12 h-12 object-cover rounded" alt="" />
                                                    <div className="text-[9px]">
                                                        <p className="text-white font-bold">{item.product_name}</p>
                                                        <p className="text-zinc-500">{item.quantity} un.</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">
                                                <AlertCircle size={14} /> Dados técnicos não salvos (Este pedido é anterior à correção do sistema)
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gold transition-all flex items-center gap-2"
                                    >
                                        <Printer size={14} /> Imprimir Canhoto
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Manual Order Tab */}
            {activeTab === 'manual' && (
                <div className="glass p-12 max-w-2xl">
                    <h3 className="text-2xl font-serif text-white mb-8">Novo Pedido Manual</h3>
                    <form onSubmit={handleManualSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Cliente</label>
                                <input
                                    required
                                    value={manualOrder.client_name}
                                    onChange={e => setManualOrder({...manualOrder, client_name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                    placeholder="Nome do Cliente"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Arquiteto</label>
                                <input
                                    required
                                    value={manualOrder.architect_name}
                                    onChange={e => setManualOrder({...manualOrder, architect_name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                    placeholder="Nome do Arquiteto"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Projeto</label>
                            <input
                                required
                                value={manualOrder.project_name}
                                onChange={e => setManualOrder({...manualOrder, project_name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                placeholder="Ex: Sala de Estar"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Título da Obra / Arte</label>
                            <input
                                required
                                value={manualOrder.art_title}
                                onChange={e => setManualOrder({...manualOrder, art_title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                placeholder="Título ou Nome da Imagem"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Detalhes da Moldura / Tamanho</label>
                            <input
                                required
                                value={manualOrder.frame_details}
                                onChange={e => setManualOrder({...manualOrder, frame_details: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                placeholder="Ex: Moldura Canaleta Preta (50x70cm)"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Valor Total (R$)</label>
                                <input
                                    required
                                    type="number"
                                    value={manualOrder.total_value}
                                    onChange={e => setManualOrder({...manualOrder, total_value: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                    placeholder="0,00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">URL da Imagem</label>
                                <input
                                    value={manualOrder.image_url}
                                    onChange={e => setManualOrder({...manualOrder, image_url: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gold text-black py-4 font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all">
                            Enviar para Produção
                        </button>
                    </form>
                </div>
            )}

            {/* Production Voucher Modal */}
            {selectedOrder && (
                <ProductionVoucher order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

// Production Voucher Component (Canhoto)
const ProductionVoucher: React.FC<{ order: ProductionOrder, onClose: () => void }> = ({ order, onClose }) => {
    useEffect(() => {
        // Auto-print after small delay to let images load
        const timer = setTimeout(() => {
            window.print();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return createPortal(
        <div className="portal-print-container fixed inset-0 bg-white z-[9999] overflow-y-auto p-10 font-sans text-black">
            {/* Control Header */}
            <div className="no-print flex justify-between items-center mb-10 bg-zinc-900 p-4 rounded text-white sticky top-0">
                <p className="text-xs uppercase font-bold tracking-widest text-gold">Canhoto de Produção</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="px-4 py-2 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest">Fechar</button>
                    <button onClick={() => window.print()} className="bg-gold text-black px-6 py-2 rounded text-xs font-bold uppercase tracking-widest">Imprimir Canhoto</button>
                </div>
            </div>

            {/* VOUCHER CONTENT - A4 Optimized */}
            <div className="max-w-[1000px] mx-auto space-y-12">
                {/* Fallback if no items (Legacy/Failed items) */}
                {order.items.length === 0 && (
                    <div className="border-[4px] border-black p-12 relative overflow-hidden break-after-page bg-white min-h-[900px] flex flex-col">
                        <div className="absolute top-10 right-10 border-[3px] border-black px-8 py-3 flex flex-col items-center bg-white z-10">
                            <span className="text-[10px] font-black uppercase tracking-tighter">ORDEM DE PRODUÇÃO</span>
                            <span className="text-4xl font-black">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none select-none">
                            <h1 className="text-[200px] font-black italic uppercase leading-none">CASA<br/>LINDA</h1>
                        </div>

                        <header className="border-b-[4px] border-black pb-10 mb-12">
                            <h1 className="text-6xl font-black italic mb-2 uppercase tracking-tighter leading-none">FICHA TÉCNICA</h1>
                            <p className="text-lg font-bold text-zinc-500 uppercase tracking-[0.2em]">{order.project_name} (RESUMO)</p>
                        </header>

                        <div className="grid grid-cols-12 gap-12 flex-1 relative">
                            <div className="col-span-12 space-y-12">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black text-zinc-400">PROJETO / AMBIENTE</p>
                                            <p className="text-4xl font-black italic">{order.project_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black text-zinc-400">CLIENTE</p>
                                            <p className="text-2xl font-bold">{order.client_name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-right">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black text-zinc-400">ARQUITETO(A)</p>
                                            <p className="text-2xl font-bold">{order.architect_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black text-zinc-400">VALOR TOTAL DO PEDIDO</p>
                                            <p className="text-2xl font-bold">R$ {order.total_value.toLocaleString('pt-BR')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-100 border-[3px] border-black p-12 space-y-8 text-center">
                                    <AlertCircle size={48} className="mx-auto text-black" />
                                    <div className="space-y-2">
                                        <p className="text-3xl font-black italic uppercase">Dados Técnicos Não Sincronizados</p>
                                        <p className="text-lg font-bold text-zinc-600">Este pedido (ID: {order.id.split('-')[0]}) foi processado sem o detalhamento de itens no banco de dados.</p>
                                        <p className="text-sm text-zinc-500 mt-4">Causa provável: Pedido manual antigo ou falha na conexão durante a criação. <br/> Por favor, crie um **novo pedido de teste** para verificar a correção.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Quality Check */}
                        <footer className="mt-auto pt-10 border-t-[3px] border-black grid grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase">Responsável Produção</p>
                                <div className="border-b-[1px] border-black h-8"></div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase">Conferência Qualidade</p>
                                <div className="border-b-[1px] border-black h-8"></div>
                            </div>
                            <div className="space-y-4 text-right">
                                <p className="text-[10px] font-black uppercase">Data de Saída</p>
                                <p className="text-xl font-black">___/___/_____</p>
                            </div>
                        </footer>
                    </div>
                )}

                {order.items.map((item, idx) => {
                    // Try to find frame thumbnail from constants
                    const frameInfo = FRAMES.find(f => item.product_name.includes(f.name));
                    
                    return (
                    <div key={idx} className="border-[4px] border-black p-12 relative overflow-hidden break-after-page bg-white min-h-[900px] flex flex-col">
                        {/* Status Label on voucher */}
                        <div className="absolute top-10 right-10 border-[3px] border-black px-8 py-3 flex flex-col items-center bg-white z-10">
                            <span className="text-[10px] font-black uppercase tracking-tighter">ITEM {idx + 1} DE {order.items.length}</span>
                            <span className="text-4xl font-black">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        {/* WATERMARK */}
                        <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none select-none">
                            <h1 className="text-[200px] font-black italic uppercase leading-none">CASA<br/>LINDA</h1>
                        </div>

                        <header className="border-b-[4px] border-black pb-10 mb-12">
                            <h1 className="text-6xl font-black italic mb-2 uppercase tracking-tighter leading-none">FICHA TÉCNICA</h1>
                            <p className="text-lg font-bold text-zinc-500 uppercase tracking-[0.2em]">{order.project_name}</p>
                        </header>

                        <div className="grid grid-cols-12 gap-12 flex-1 relative">
                            {/* Left Column: Visual Proof */}
                            <div className="col-span-7 space-y-10">
                                <div className="space-y-4">
                                    <p className="text-[12px] font-black uppercase tracking-widest bg-black text-white px-4 py-1 inline-block">Visualização da Obra</p>
                                    <div className="border-[3px] border-black p-2 bg-zinc-100 shadow-[20px_20px_0px_rgba(0,0,0,0.05)]">
                                        <img 
                                            src={item.image_url} 
                                            className="w-full aspect-[3/4] object-cover border-[1px] border-black/10" 
                                            alt="Preview" 
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-zinc-400">Cliente</p>
                                        <p className="text-xl font-bold uppercase">{order.client_name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-zinc-400">Arquiteto(a)</p>
                                        <p className="text-xl font-bold uppercase">{order.architect_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Tech Specs */}
                            <div className="col-span-5 space-y-12">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <p className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Identificação</p>
                                        <h2 className="text-3xl font-black italic uppercase leading-tight">{item.product_name.split(' - ')[0]}</h2>
                                    </div>

                                    {/* Tech Grid */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-zinc-50 border-[2px] border-black p-6 space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dimensões / Tamanho</p>
                                            <p className="text-3xl font-black">{item.product_name.match(/\d+x\d+cm/) || 'Especificado na Proposta'}</p>
                                        </div>

                                        <div className="bg-black text-white p-6 space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Moldura Especificada</p>
                                            <div className="flex items-center gap-4">
                                                {frameInfo?.thumbnailUrl && (
                                                    <img src={frameInfo.thumbnailUrl} className="w-16 h-16 object-cover border border-white/20" alt="" />
                                                )}
                                                <div>
                                                    <p className="text-xl font-bold">{frameInfo?.name || 'A Definir'}</p>
                                                    <p className="text-[10px] uppercase tracking-tighter text-zinc-400">{frameInfo?.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-[2px] border-black p-6 space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Acabamento</p>
                                            <p className="text-2xl font-bold italic">{item.product_name.includes('Vidro') ? 'PREMIUM COM VIDRO' : 'CANVAS (SEM VIDRO)'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Placeholder Area */}
                                <div className="pt-10 flex flex-col items-end">
                                    <div className="w-32 h-32 border-2 border-black flex items-center justify-center p-2">
                                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-center p-2">
                                            <p className="text-[8px] font-black uppercase">Controle<br/>Interno<br/>QR CODE</p>
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-black mt-2 uppercase text-zinc-400">Válido para Auditoria de Produção</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Quality Check */}
                        <footer className="mt-auto pt-10 border-t-[3px] border-black grid grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase">Responsável Produção</p>
                                <div className="border-b-[1px] border-black h-8"></div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase">Conferência Qualidade</p>
                                <div className="border-b-[1px] border-black h-8"></div>
                            </div>
                            <div className="space-y-4 text-right">
                                <p className="text-[10px] font-black uppercase">Data de Saída</p>
                                <p className="text-xl font-black">___/___/_____</p>
                            </div>
                        </footer>
                    </div>
                );
            })}
            </div>

            <style>{`
                @page { size: A4; margin: 0; }
                @media print {
                    .no-print { display: none !important; }
                    #root { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .portal-print-container { 
                        position: static !important; 
                        inset: auto !important;
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .break-after-page { page-break-after: always; }
                }
            `}</style>
        </div>,
        document.body
    );
};
