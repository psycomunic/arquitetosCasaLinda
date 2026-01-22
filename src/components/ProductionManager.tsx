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
                    <div className="border-[2px] border-black p-6 relative overflow-hidden break-inside-avoid bg-white mb-8 flex flex-col">
                        <div className="absolute top-4 right-4 border-[2px] border-black px-4 py-1 flex flex-col items-center bg-white z-10">
                            <span className="text-[8px] font-black uppercase tracking-tighter">ORDEM DE PRODUÇÃO</span>
                            <span className="text-xl font-black">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <header className="border-b-[2px] border-black pb-4 mb-6">
                            <h1 className="text-3xl font-black italic mb-1 uppercase tracking-tighter leading-none">FICHA TÉCNICA (RESUMO)</h1>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{order.project_name}</p>
                        </header>

                        <div className="grid grid-cols-12 gap-6 flex-1 relative">
                            <div className="col-span-12 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-zinc-400">PROJETO / AMBIENTE</p>
                                            <p className="text-xl font-black italic">{order.project_name}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-zinc-400">CLIENTE</p>
                                            <p className="text-base font-bold">{order.client_name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-zinc-400">ARQUITETO(A)</p>
                                            <p className="text-base font-bold">{order.architect_name}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-zinc-400">VALOR TOTAL</p>
                                            <p className="text-base font-bold">R$ {order.total_value.toLocaleString('pt-BR')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-100 border-[2px] border-black p-4 space-y-2 text-center">
                                    <p className="text-xl font-black italic uppercase">Dados Técnicos Não Sincronizados</p>
                                    <p className="text-xs font-bold text-zinc-600">Este pedido (ID: {order.id.split('-')[0]}) é anterior à correção do sistema.</p>
                                </div>
                            </div>
                        </div>

                        <footer className="mt-4 pt-4 border-t-[2px] border-black grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase">Produção</p>
                                <div className="border-b-[1px] border-black h-4"></div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase">Qualidade</p>
                                <div className="border-b-[1px] border-black h-4"></div>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[8px] font-black uppercase">Saída</p>
                                <p className="text-[10px] font-black">___/___/___</p>
                            </div>
                        </footer>
                    </div>
                )}

                {order.items.map((item, idx) => {
                    const frameInfo = FRAMES.find(f => item.product_name.includes(f.name));
                    
                    return (
                    <div key={idx} className="border-[2px] border-black p-4 relative overflow-hidden break-inside-avoid bg-white mb-4 flex flex-col">
                        {/* Compact Header for item */}
                        <div className="absolute top-4 right-4 border-[2px] border-black px-4 py-1 flex flex-col items-center bg-white z-10">
                            <span className="text-[7px] font-black uppercase tracking-tighter">ITEM {idx + 1}/{order.items.length}</span>
                            <span className="text-xl font-black">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <header className="border-b-[2px] border-black pb-2 mb-4">
                            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">FICHA TÉCNICA</h1>
                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.1em]">{order.project_name} | {order.client_name}</p>
                        </header>

                        <div className="grid grid-cols-12 gap-4 flex-1">
                            {/* Left Column: Image */}
                            <div className="col-span-4">
                                <div className="border-[2px] border-black p-1 bg-zinc-50">
                                    <img 
                                        src={item.image_url} 
                                        className="w-full aspect-square object-cover" 
                                        alt="Preview" 
                                    />
                                </div>
                            </div>

                            {/* Right Column: Specs */}
                            <div className="col-span-8 grid grid-cols-2 gap-3 pb-2">
                                <div className="col-span-2">
                                    <p className="text-[7px] font-black uppercase text-zinc-400">Obra</p>
                                    <p className="text-xs font-black uppercase truncate">{item.product_name.split(' - ')[0]}</p>
                                </div>
                                
                                <div className="bg-zinc-100 border border-black p-2 flex flex-col justify-center">
                                    <p className="text-[6px] font-black uppercase text-zinc-500">Tamanho</p>
                                    <p className="text-[11px] font-black">{item.product_name.match(/\d+x\d+cm/) || 'Especificado'}</p>
                                </div>

                                <div className="bg-black text-white p-2 flex items-center gap-3 overflow-hidden">
                                    {frameInfo?.thumbnailUrl && (
                                        <div className="w-10 h-10 flex-shrink-0 bg-white border border-white/20">
                                            <img src={frameInfo.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[6px] font-black uppercase text-zinc-400 leading-none mb-1">Moldura</p>
                                        <p className="text-[9px] font-bold truncate leading-none">{frameInfo?.name || 'A Definir'}</p>
                                    </div>
                                </div>

                                <div className="border border-black p-2 flex flex-col justify-center">
                                    <p className="text-[6px] font-black uppercase text-zinc-500">Acabamento</p>
                                    <p className="text-[9px] font-bold truncate leading-none">{item.product_name.includes('Vidro') ? 'COM VIDRO' : 'CANVAS'}</p>
                                </div>

                                <div className="bg-zinc-50 border border-black p-2 flex items-center justify-center">
                                    <p className="text-[10px] font-black uppercase">QTD: {item.quantity}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer for item */}
                        <footer className="mt-2 pt-2 border-t border-black grid grid-cols-3 gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[6px] font-black uppercase whitespace-nowrap">CONFERÊNCIA:</span>
                                <div className="border-b border-black flex-1 h-3"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[6px] font-black uppercase whitespace-nowrap">STATUS:</span>
                                <div className="border border-black w-3 h-3"></div>
                                <span className="text-[6px]">OK</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black uppercase">{order.architect_name.split(' ')[0]}</p>
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
                    .break-inside-avoid { page-break-inside: avoid; }
                }
            `}</style>
        </div>,
        document.body
    );
};
