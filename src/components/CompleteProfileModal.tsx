import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Phone, AlertCircle } from 'lucide-react';

interface CompleteProfileModalProps {
    isOpen: boolean;
    onProfileUpdate: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ isOpen, onProfileUpdate }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone.replace(/\D/g, '')) {
            setError('Por favor, informe seu WhatsApp.');
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const { error: updateError } = await supabase
                .from('architects')
                .update({ phone: phone })
                .eq('id', user.id);

            if (updateError) throw updateError;

            onProfileUpdate();
        } catch (err) {
            console.error('Erro ao atualizar perfil:', err);
            setError('Erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-gold/30 rounded-2xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(197,160,89,0.1)] animate-fade-in relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                <div className="relative text-center mb-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                        <Phone className="text-gold" size={32} />
                    </div>
                    <h2 className="text-2xl font-serif text-white mb-2">Complete seu Perfil</h2>
                    <p className="text-zinc-400 text-sm">
                        Para melhor atendê-lo e enviar todas as novidades, precisamos que informe seu WhatsApp.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
                            WhatsApp (Obrigatório)
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(00) 00000-0000"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-all font-mono"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold hover:bg-gold-light text-black font-bold uppercase tracking-widest py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar e Continuar
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
