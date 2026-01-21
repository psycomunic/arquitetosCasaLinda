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
    X
} from 'lucide-react';
import { createPortal } from 'react-dom';

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
                .select('*, architects(name)')
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
                .select('*, architects(name)')
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
            await supabase.from('sales').insert({
                proposal_id: proposal.id,
                architect_id: proposal.architect_id,
                sale_value: proposal.total_value,
                commission_value: proposal.commission_value,
                status: 'paid',
                paid_at: new Date().toISOString()
            });

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
            
            const { data: prop, error: pErr } = await supabase
                .from('proposals')
                .insert({
                    client_name: manualOrder.client_name,
                    project_name: manualOrder.project_name,
                    total_value: Number(manualOrder.total_value),
                    status: 'paid', // Direct to paid/production
                    architect_id: null // Manual entry
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
                    image_url: manualOrder.image_url
                });

            if (iErr) throw iErr;

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
            alert('Pedido manual criado com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao criar pedido manual.');
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
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                                                <img src={item.image_url} className="w-12 h-12 object-cover rounded" alt="" />
                                                <div className="text-[9px]">
                                                    <p className="text-white font-bold">{item.product_name}</p>
                                                    <p className="text-zinc-500">{item.quantity} un.</p>
                                                </div>
                                            </div>
                                        ))}
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
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Projeto</label>
                                <input
                                    required
                                    value={manualOrder.project_name}
                                    onChange={e => setManualOrder({...manualOrder, project_name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-gold"
                                    placeholder="Ex: Sala de Estar"
                                />
                            </div>
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
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto p-10 font-sans text-black">
            {/* Control Header */}
            <div className="no-print flex justify-between items-center mb-10 bg-zinc-900 p-4 rounded text-white sticky top-0">
                <p className="text-xs uppercase font-bold tracking-widest text-gold">Canhoto de Produção</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="px-4 py-2 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest">Fechar</button>
                    <button onClick={() => window.print()} className="bg-gold text-black px-6 py-2 rounded text-xs font-bold uppercase tracking-widest">Imprimir Canhoto</button>
                </div>
            </div>

            {/* VOUCHER CONTENT - A4 Optimized */}
            <div className="max-w-[800px] mx-auto space-y-12">
                {order.items.map((item, idx) => (
                    <div key={idx} className="border-2 border-black p-10 relative overflow-hidden break-after-page">
                        {/* Status Label on voucher */}
                        <div className="absolute top-5 right-5 border-2 border-black px-4 py-1 flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase">Pedido</span>
                            <span className="text-xl font-bold">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <div className="flex gap-10">
                            {/* Detailed Info */}
                            <div className="flex-1 space-y-8">
                                <header className="border-b-2 border-black pb-6">
                                    <h2 className="text-xs uppercase tracking-widest font-bold mb-2">Canhoto de Produção {idx + 1}/{order.items.length}</h2>
                                    <h3 className="text-4xl font-serif font-bold italic">{order.project_name}</h3>
                                </header>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-zinc-500">Arquiteto</p>
                                            <p className="text-lg font-bold">{order.architect_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-zinc-500">Cliente / Local</p>
                                            <p className="text-lg font-bold">{order.client_name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-zinc-500">Data Aprovação</p>
                                            <p className="text-lg font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-zinc-500">Valor Unitário</p>
                                            <p className="text-lg font-bold">R$ {item.unit_price.toLocaleString('pt-BR')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-100 p-8 space-y-6 rounded-lg border border-black/10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Obra / Arte</p>
                                        <p className="text-2xl font-serif font-bold">{item.product_name.split(' - ')[0]}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Especificações da Moldura</p>
                                        <p className="text-xl font-bold uppercase">{item.product_name.split(' - ')[1] || 'Padrão'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Placeholder/Preview */}
                            <div className="w-1/3 flex flex-col gap-6">
                                <div className="border-4 border-zinc-100 p-4 bg-white shadow-xl">
                                    <img src={item.image_url} className="w-full h-auto object-contain max-h-[400px]" alt="Produção" />
                                </div>
                                <div className="mt-auto p-4 border-2 border-dashed border-zinc-300 rounded text-center">
                                    <p className="text-[8px] uppercase tracking-widest text-zinc-400">QR Code Produção (Espaço)</p>
                                    <div className="w-16 h-16 bg-zinc-100 mx-auto mt-2"></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <div className="mt-12 pt-8 border-t-2 border-black flex justify-between items-end">
                            <div className="text-[9px] uppercase tracking-widest font-bold">
                                Casa Linda | Exclusive Gallery
                            </div>
                            <div className="text-[10px] font-bold">
                                ASSINATURA RESPONSÁVEL: _____________________________________
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @page { size: A4; margin: 10mm; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    #root { display: none !important; }
                    .break-after-page { page-break-after: always; }
                }
            `}</style>
        </div>,
        document.body
    );
};
