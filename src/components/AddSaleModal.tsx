import React, { useState } from 'react';
import { X, DollarSign, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateCommissionRate } from '../lib/commission';
import { Architect } from '../types/database';

interface AddSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    architect: Architect;
    onSuccess: () => void;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose, architect, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const saleValue = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

            if (isNaN(saleValue) || saleValue <= 0) {
                alert('Valor inválido');
                return;
            }

            const currentTotal = Number(architect.total_earnings) || 0;
            const newTotal = currentTotal + saleValue;
            const newRate = calculateCommissionRate(newTotal);

            // 1. Insert Sale record as PENDING.
            // O repasse só é marcado como pago quando o admin efetua o pagamento
            // na aba "Gestão de Repasses" (pagamentos são feitos todo dia 10).
            const { error: saleError } = await supabase
                .from('sales')
                .insert({
                    architect_id: architect.id,
                    sale_value: saleValue,
                    commission_rate: newRate,
                    commission_value: saleValue * (newRate / 100),
                    status: 'pending'
                } as any);

            if (saleError) throw saleError;

            // 2. Update Architect totals
            const { error: archError } = await supabase
                .from('architects')
                .update({
                    total_earnings: newTotal,
                    commission_rate: newRate
                } as any)
                .eq('id', architect.id);

            if (archError) throw archError;

            onSuccess();
            onClose();
            setAmount('');
            setDescription('');
        } catch (error) {
            console.error('Error adding sale:', error);
            alert('Erro ao registrar venda');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <h3 className="text-xl font-serif text-white mb-2">Registrar Venda</h3>
                    <p className="text-xs text-zinc-400 mb-6">
                        Adicionar venda para <span className="text-gold font-bold">{architect.name}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">
                                Valor da Venda (R$)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:border-gold outline-none transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">
                                Descrição (Opcional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Projeto Residencial X"
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-4 px-4 text-white placeholder:text-zinc-700 focus:border-gold outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <DollarSign size={16} />}
                            Confirmar Venda
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
