import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Upload, User, MapPin, Phone, FileText } from 'lucide-react';
import { ArchitectProfile } from '../types';
import { supabase } from '../lib/supabase';

export const Settings: React.FC = () => {
    const [profile, setProfile] = useState<ArchitectProfile>({
        name: '',
        officeName: '',
        commissionRate: 20,
        totalEarnings: 0,
        logoUrl: null,
        profilePhotoUrl: null,
        cau: '',
        cnpj: '',
        phone: '',
        website: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        zipCode: '',
        city: '',
        state: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const profilePhotoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from('architects')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfile({
                    name: data.name || '',
                    officeName: data.office_name || '',
                    commissionRate: Number(data.commission_rate),
                    totalEarnings: Number(data.total_earnings),
                    logoUrl: data.logo_url,
                    profilePhotoUrl: data.profile_photo_url,
                    cau: data.cau || '',
                    cnpj: data.cnpj || '',
                    phone: data.phone || '',
                    website: data.website || '',
                    street: data.street || '',
                    number: data.number || '',
                    complement: data.complement || '',
                    neighborhood: data.neighborhood || '',
                    zipCode: data.zip_code || '',
                    city: data.city || '',
                    state: data.state || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario não autenticado');

            // Using upsert to handle both create (if missing) and update
            const { error } = await supabase
                .from('architects')
                .upsert({
                    id: user.id,
                    email: user.email || '',
                    name: profile.name,
                    office_name: profile.officeName,
                    logo_url: profile.logoUrl,
                    profile_photo_url: profile.profilePhotoUrl,
                    cau: profile.cau,
                    cnpj: profile.cnpj,
                    phone: profile.phone,
                    website: profile.website,
                    street: profile.street,
                    number: profile.number,
                    complement: profile.complement,
                    neighborhood: profile.neighborhood,
                    zip_code: profile.zipCode,
                    city: profile.city,
                    state: profile.state
                });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Preferências salvas com sucesso!' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.message || 'Erro ao salvar preferências. Tente novamente.' });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'profilePhotoUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, [field]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setProfile({ ...profile, zipCode: cep });

        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setProfile(prev => ({
                        ...prev,
                        zipCode: cep, // maintain filtered cep
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }));
                }
            } catch (error) {
                console.error('Error fetching CEP:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }


    return (
        <div className="max-w-5xl animate-fade-in no-print pb-24">
            <header className="mb-12">
                <h2 className="text-7xl font-serif text-white">Configurações</h2>
            </header>

            <div className="space-y-12">
                {message && (
                    <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <p className="text-sm uppercase tracking-widest font-bold">{message.text}</p>
                    </div>
                )}

                {/* Branding & Profile Photos */}
                <div className="glass p-12 md:p-16">
                    <div className="flex items-center gap-4 mb-10">
                        <ImageIcon className="text-gold" size={24} />
                        <h3 className="font-serif text-3xl text-white">Imagens e Branding</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Logo Upload */}
                        <div className="space-y-6">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Logo do Escritório (White Label)</label>
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-48 h-48 glass flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 border-dashed border-white/20 rounded-lg group cursor-pointer"
                                    onClick={() => logoInputRef.current?.click()}>
                                    {profile.logoUrl ? (
                                        <img src={profile.logoUrl} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" alt="Logo" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload className="mx-auto text-white/20 mb-2" size={32} />
                                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Upload Logo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    className="text-[10px] text-gold uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-gold/30 pb-1"
                                >
                                    Alterar Logo
                                </button>
                            </div>
                        </div>

                        {/* Profile Photo Upload */}
                        <div className="space-y-6">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Foto de Perfil</label>
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-48 h-48 glass rounded-full flex items-center justify-center overflow-hidden border-dashed border-white/20 group cursor-pointer"
                                    onClick={() => profilePhotoInputRef.current?.click()}>
                                    {profile.profilePhotoUrl ? (
                                        <img src={profile.profilePhotoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Perfil" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <User className="mx-auto text-white/20 mb-2" size={32} />
                                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Upload Foto</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={profilePhotoInputRef}
                                    onChange={(e) => handleImageUpload(e, 'profilePhotoUrl')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => profilePhotoInputRef.current?.click()}
                                    className="text-[10px] text-gold uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-gold/30 pb-1"
                                >
                                    Alterar Foto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal & Business Info */}
                <div className="glass p-12 md:p-16">
                    <div className="flex items-center gap-4 mb-10">
                        <FileText className="text-gold" size={24} />
                        <h3 className="font-serif text-3xl text-white">Dados Cadastrais</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Nome Completo / Responsável</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Nome do Escritório / Empresa</label>
                            <input
                                type="text"
                                value={profile.officeName}
                                onChange={(e) => setProfile({ ...profile, officeName: e.target.value })}
                                className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                placeholder="Nome fantasia do seu negócio"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">CAU / Registro Profissional</label>
                            <input
                                type="text"
                                value={profile.cau || ''}
                                onChange={(e) => setProfile({ ...profile, cau: e.target.value })}
                                className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                placeholder="000000-0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">CNPJ (Opcional)</label>
                            <input
                                type="text"
                                value={profile.cnpj || ''}
                                onChange={(e) => setProfile({ ...profile, cnpj: e.target.value })}
                                className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                placeholder="00.000.000/0001-00"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacts & Address */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contacts */}
                    <div className="glass p-12 md:p-16 h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <Phone className="text-gold" size={24} />
                            <h3 className="font-serif text-3xl text-white">Contatos</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Website / Portfolio</label>
                                <input
                                    type="url"
                                    value={profile.website || ''}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                    placeholder="https://seu-site.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="glass p-12 md:p-16 h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <MapPin className="text-gold" size={24} />
                            <h3 className="font-serif text-3xl text-white">Endereço</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">CEP</label>
                                    <input
                                        type="text"
                                        value={profile.zipCode || ''}
                                        onChange={handleCepChange}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="00000-000"
                                        maxLength={9}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3 space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Rua</label>
                                    <input
                                        type="text"
                                        value={profile.street || ''}
                                        onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="Nome da rua"
                                    />
                                </div>
                                <div className="col-span-1 space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Nº</label>
                                    <input
                                        type="text"
                                        value={profile.number || ''}
                                        onChange={(e) => setProfile({ ...profile, number: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Complemento</label>
                                    <input
                                        type="text"
                                        value={profile.complement || ''}
                                        onChange={(e) => setProfile({ ...profile, complement: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="Sala 101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Bairro</label>
                                    <input
                                        type="text"
                                        value={profile.neighborhood || ''}
                                        onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="Centro"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Cidade</label>
                                    <input
                                        type="text"
                                        value={profile.city || ''}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="Cidade"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Estado</label>
                                    <input
                                        type="text"
                                        value={profile.state || ''}
                                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                        className="w-full px-6 py-4 border border-white/5 focus:outline-none focus:border-gold transition-all text-sm glass-dark text-white rounded-lg placeholder-zinc-700"
                                        placeholder="UF"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gold text-black px-12 py-5 font-bold hover:bg-white transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 rounded-full"
                    >
                        {saving && <Loader2 className="animate-spin" size={16} />}
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};
