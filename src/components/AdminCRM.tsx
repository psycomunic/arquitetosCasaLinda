import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CRMLead, CRMActivity, CRMMessageTemplate, CRMFollowUp, PipelineStage } from '../types/database';
import {
  Users, MessageCircle, Bell, LayoutGrid, Plus, X, ChevronRight,
  Phone, Mail, DollarSign, CheckCircle2, XCircle, Copy, Clock,
  PhoneCall, Loader2, Edit2, Trash2, Calendar, AlertCircle, Star, RefreshCw
} from 'lucide-react';

// ─── Role mapping ────────────────────────────────────────────────────────────
const CRM_ROLES: Record<string, { name: string; isAdmin: boolean }> = {
  'kelly.cordeirodasilva.5@gmail.com': { name: 'Kelly Cordeiro da Silva', isAdmin: false },
  'giselekf2@gmail.com':               { name: 'Gisele Ferreira',         isAdmin: false },
  'psycomunic@gmail.com':              { name: 'Angelo',                  isAdmin: true  },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'novo',              label: 'Novo Lead',          color: 'bg-blue-500/20 border-blue-500/40 text-blue-400' },
  { key: 'contato_feito',     label: 'Contato Feito',      color: 'bg-purple-500/20 border-purple-500/40 text-purple-400' },
  { key: 'proposta_enviada',  label: 'Proposta Enviada',   color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' },
  { key: 'negociando',        label: 'Negociando',         color: 'bg-orange-500/20 border-orange-500/40 text-orange-400' },
  { key: 'fechado',           label: 'Fechado ✓',          color: 'bg-green-500/20 border-green-500/40 text-green-400' },
  { key: 'perdido',           label: 'Perdido',            color: 'bg-red-500/20 border-red-500/40 text-red-400' },
];

const ACTIVITY_ICONS: Record<string, React.ReactElement> = {
  call:      <PhoneCall size={12} className="text-green-400" />,
  whatsapp:  <MessageCircle size={12} className="text-green-500" />,
  email:     <Mail size={12} className="text-blue-400" />,
  note:      <Edit2 size={12} className="text-zinc-400" />,
  meeting:   <Users size={12} className="text-purple-400" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  boas_vindas: 'Boas Vindas',
  follow_up:   'Follow-up',
  proposta:    'Proposta',
  reativacao:  'Reativação',
  outros:      'Outros',
};

const fillTemplate = (body: string, lead?: CRMLead | null) =>
  body
    .replace(/\{\{nome\}\}/g, lead?.contact_name || 'Arquiteto')
    .replace(/\{\{cupom\}\}/g, 'SEU_CUPOM')
    .replace(/\{\{desconto\}\}/g, '20');

// ─── Lead Modal ──────────────────────────────────────────────────────────────

const LeadModal: React.FC<{
  lead: CRMLead | null;
  onClose: () => void;
  onSaved: () => void;
  attendantName: string;
}> = ({ lead, onClose, onSaved, attendantName }) => {
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [followups, setFollowups] = useState<CRMFollowUp[]>([]);
  const [form, setForm] = useState({
    contact_name: lead?.contact_name || '',
    contact_phone: lead?.contact_phone || '',
    contact_email: lead?.contact_email || '',
    pipeline_stage: lead?.pipeline_stage || 'novo' as PipelineStage,
    deal_value: lead?.deal_value?.toString() || '0',
    notes: lead?.notes || '',
    attendant_name: lead?.attendant_name || attendantName,
    next_followup_date: '',
    next_followup_message: '',
  });
  const [activityForm, setActivityForm] = useState({ type: 'note', description: '' });
  const [followupForm, setFollowupForm] = useState({ due_date: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<'details' | 'activity' | 'followup'>('details');

  useEffect(() => {
    if (!lead) return;
    supabase.from('crm_activities').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false })
      .then(({ data }) => setActivities((data as any) || []));
    supabase.from('crm_followups').select('*').eq('lead_id', lead.id).order('due_date')
      .then(({ data }) => setFollowups((data as any) || []));
  }, [lead]);

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      const { next_followup_date, next_followup_message, ...leadFields } = form;
      const payload = {
        ...leadFields,
        deal_value: Number(leadFields.deal_value),
        closed_at: leadFields.pipeline_stage === 'fechado' ? new Date().toISOString() : null,
      };
      if (lead) {
        await (supabase.from('crm_leads') as any).update(payload).eq('id', lead.id);
        if (next_followup_date) {
          await (supabase.from('crm_followups') as any).insert({
            lead_id: lead.id,
            attendant_name: attendantName,
            due_date: next_followup_date,
            message: next_followup_message || null,
          });
        }
      } else {
        const { data: newLead } = await (supabase.from('crm_leads') as any).insert(payload).select().single();
        if (newLead && next_followup_date) {
          await (supabase.from('crm_followups') as any).insert({
            lead_id: newLead.id,
            attendant_name: attendantName,
            due_date: next_followup_date,
            message: next_followup_message || null,
          });
        }
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleAddActivity = async () => {
    if (!lead || !activityForm.description) return;
    await (supabase.from('crm_activities') as any).insert({
      lead_id: lead.id,
      type: activityForm.type,
      description: activityForm.description,
      attendant_name: attendantName,
    });
    setActivityForm({ type: 'note', description: '' });
    const { data } = await supabase.from('crm_activities').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false });
    setActivities((data as any) || []);
  };

  const handleAddFollowup = async () => {
    if (!lead || !followupForm.due_date) return;
    await (supabase.from('crm_followups') as any).insert({
      lead_id: lead.id,
      attendant_name: attendantName,
      due_date: followupForm.due_date,
      message: followupForm.message || null,
    });
    setFollowupForm({ due_date: '', message: '' });
    const { data } = await supabase.from('crm_followups').select('*').eq('lead_id', lead.id).order('due_date');
    setFollowups((data as any) || []);
  };

  const handleCompleteFollowup = async (id: string) => {
    await (supabase.from('crm_followups') as any).update({ completed: true }).eq('id', id);
    setFollowups(followups.map(f => f.id === id ? { ...f, completed: true } : f));
  };

  const handleDeleteLead = async () => {
    if (!lead) return;
    setDeleting(true);
    try {
      await (supabase.from('crm_followups') as any).delete().eq('lead_id', lead.id);
      await (supabase.from('crm_activities') as any).delete().eq('lead_id', lead.id);
      await (supabase.from('crm_leads') as any).delete().eq('id', lead.id);
      onSaved();
      onClose();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">{lead ? lead.contact_name : 'Novo Lead'}</h3>
            {lead && <p className="text-xs text-zinc-500">{lead.contact_phone}</p>}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {(['details', 'activity', 'followup'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${tab === t ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}>
              {t === 'details' ? 'Dados' : t === 'activity' ? 'Atividades' : 'Follow-up'}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {tab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Nome</label>
                  <input value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">WhatsApp</label>
                  <input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Email</label>
                  <input value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Valor Esperado (R$)</label>
                  <input type="number" value={form.deal_value} onChange={e => setForm({...form, deal_value: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Atendente</label>
                <select value={form.attendant_name} onChange={e => setForm({...form, attendant_name: e.target.value})}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold">
                  <option value="Kelly Cordeiro da Silva">Kelly Cordeiro da Silva</option>
                  <option value="Gisele Ferreira">Gisele Ferreira</option>
                  <option value="Angelo">Angelo</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Estágio</label>
                <select value={form.pipeline_stage} onChange={e => setForm({...form, pipeline_stage: e.target.value as PipelineStage})}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold">
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Notas</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold resize-none" />
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-4">
              {lead && (
                <div className="flex gap-2">
                  <select value={activityForm.type} onChange={e => setActivityForm({...activityForm, type: e.target.value})}
                    className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none">
                    <option value="note">Nota</option>
                    <option value="call">Ligação</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="meeting">Reunião</option>
                  </select>
                  <input value={activityForm.description} onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                    placeholder="Descreva a atividade..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                  <button onClick={handleAddActivity} className="px-4 py-2 bg-gold text-black rounded-lg text-xs font-bold">+</button>
                </div>
              )}
              <div className="space-y-2">
                {activities.length === 0 && <p className="text-xs text-zinc-600 text-center py-4">Nenhuma atividade registrada.</p>}
                {activities.map(a => (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="mt-0.5">{ACTIVITY_ICONS[a.type] || <Edit2 size={12} />}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{a.description}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{a.attendant_name} · {new Date(a.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'followup' && (
            <div className="space-y-4">
              {/* Next follow-up for new leads */}
              {!lead && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={13} className="text-gold" />
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Próximo Contato</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500">Data</label>
                      <input type="date" value={form.next_followup_date}
                        onChange={e => setForm({...form, next_followup_date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500">Lembrete (opcional)</label>
                      <input value={form.next_followup_message}
                        onChange={e => setForm({...form, next_followup_message: e.target.value})}
                        placeholder="Ex: Ligar às 14h"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                    </div>
                  </div>
                  {form.next_followup_date && (
                    <p className="text-[10px] text-gold/70 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Follow-up será criado ao salvar o lead
                    </p>
                  )}
                </div>
              )}

              {/* Add more follow-ups for existing leads */}
              {lead && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={13} className="text-gold" />
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Agendar Novo Contato</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={followupForm.due_date} onChange={e => setFollowupForm({...followupForm, due_date: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                    <input value={followupForm.message} onChange={e => setFollowupForm({...followupForm, message: e.target.value})}
                      placeholder="Lembrete (opcional)"
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
                    <button onClick={handleAddFollowup} className="col-span-2 py-2 bg-gold text-black rounded-lg text-xs font-bold">Agendar Follow-up</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {followups.length === 0 && lead && <p className="text-xs text-zinc-600 text-center py-4">Nenhum follow-up agendado.</p>}
                {!lead && followups.length === 0 && !form.next_followup_date && (
                  <p className="text-xs text-zinc-600 text-center py-4">Defina uma data acima para agendar o primeiro follow-up.</p>
                )}
                {followups.map(f => {
                  const isOverdue = !f.completed && new Date(f.due_date) < new Date();
                  return (
                    <div key={f.id} className={`flex items-center gap-3 p-3 rounded-lg border ${f.completed ? 'bg-white/3 border-white/5 opacity-50' : isOverdue ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                      <Calendar size={14} className={isOverdue ? 'text-red-400' : 'text-zinc-400'} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{new Date(f.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                        {f.message && <p className="text-xs text-zinc-500">{f.message}</p>}
                      </div>
                      {!f.completed && (
                        <button onClick={() => handleCompleteFollowup(f.id)} className="text-xs text-green-400 hover:text-green-300">
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          {lead && (
            <button onClick={() => setConfirmDelete(true)}
              className="px-4 py-3 border border-red-500/30 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/10 transition-all flex items-center gap-2">
              <Trash2 size={14} /> Excluir
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-zinc-400 rounded-lg text-sm font-bold hover:bg-white/5">Cancelar</button>
          <button onClick={handleSaveLead} disabled={saving} className="flex-1 py-3 bg-gold text-black rounded-lg text-sm font-bold hover:bg-white transition-all flex items-center justify-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Salvar
          </button>
        </div>

        {/* Confirmation modal */}
        {confirmDelete && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Excluir Lead?</h4>
                <p className="text-zinc-400 text-sm mt-2">
                  Tem certeza que deseja excluir <span className="text-white font-bold">{lead?.contact_name}</span>?
                  <br /><span className="text-red-400 text-xs">Esta ação não pode ser desfeita.</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 border border-white/10 text-zinc-400 rounded-lg text-sm font-bold hover:bg-white/5 transition-all">
                  Cancelar
                </button>
                <button onClick={handleDeleteLead} disabled={deleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CRM Stats ───────────────────────────────────────────────────────────────

const CRMStats: React.FC<{ leads: CRMLead[]; attendantFilter: string }> = ({ leads, attendantFilter }) => {
  const filtered = attendantFilter ? leads.filter(l => l.attendant_name === attendantFilter) : leads;
  const closed   = filtered.filter(l => l.pipeline_stage === 'fechado');
  const active   = filtered.filter(l => l.pipeline_stage !== 'fechado' && l.pipeline_stage !== 'perdido');
  const rescue   = filtered.filter(l => (l.pipeline_stage === 'negociando' || l.pipeline_stage === 'proposta_enviada') && Number(l.deal_value) > 0);
  const total    = filtered.length;
  const closedValue   = closed.reduce((a, l)  => a + Number(l.deal_value), 0);
  const pipelineValue = active.reduce((a, l)  => a + Number(l.deal_value), 0);
  const convRate = total > 0 ? ((closed.length / total) * 100).toFixed(0) : '0';

  const stats = [
    { icon: <Users size={18} className="text-gold" />,          label: 'Total de Leads',    value: total,                      sub: null },
    { icon: <CheckCircle2 size={18} className="text-green-400" />, label: 'Fechados',        value: closed.length,              sub: closedValue > 0 ? closedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null },
    { icon: <Star size={18} className="text-yellow-400" />,     label: 'Conversão',         value: `${convRate}%`,             sub: null },
    { icon: <DollarSign size={18} className="text-emerald-400" />, label: 'Valor Fechado',  value: closedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sub: null },
    { icon: <Clock size={18} className="text-blue-400" />,      label: 'Valor em Pipeline', value: pipelineValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sub: `${active.length} leads ativos`, highlight: true },
    { icon: <AlertCircle size={18} className="text-orange-400" />, label: 'A Resgatar 🔥',  value: rescue.length,              sub: rescue.reduce((a,l)=>a+Number(l.deal_value),0) > 0 ? rescue.reduce((a,l)=>a+Number(l.deal_value),0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : 'Sem valor definido', highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className={`glass p-5 ${s.highlight ? 'border border-orange-500/20' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            {s.icon}
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">{s.label}</span>
          </div>
          <p className="text-xl font-bold text-white">{s.value}</p>
          {s.sub && <p className="text-[10px] text-zinc-500 mt-1">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
};

// ─── Kanban Board ────────────────────────────────────────────────────────────

const KanbanBoard: React.FC<{
  leads: CRMLead[];
  onSelectLead: (l: CRMLead) => void;
  onStageChange: (id: string, stage: PipelineStage) => void;
}> = ({ leads, onSelectLead, onStageChange }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const cards = leads.filter(l => l.pipeline_stage === stage.key);
        return (
          <div key={stage.key} className="flex-shrink-0 w-64">
            <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg border ${stage.color}`}>
              <span className="text-xs font-bold uppercase tracking-wider">{stage.label}</span>
              <span className="text-xs font-mono">{cards.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {cards.map(lead => (
                <div key={lead.id} onClick={() => onSelectLead(lead)}
                  className="bg-zinc-900 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-gold/40 hover:shadow-lg transition-all group">
                  <p className="text-white font-bold text-sm group-hover:text-gold transition-colors truncate">{lead.contact_name}</p>
                  <p className="text-zinc-500 text-xs mt-1 truncate">{lead.contact_phone}</p>
                  {Number(lead.deal_value) > 0 && (
                    <p className="text-green-400 text-xs font-mono mt-2">
                      {Number(lead.deal_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  )}
                  {lead.attendant_name && (
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mt-2 ${
                      lead.attendant_name.includes('Kelly')  ? 'bg-purple-500/20 text-purple-300' :
                      lead.attendant_name.includes('Gisele') ? 'bg-teal-500/20 text-teal-300' :
                      lead.attendant_name === 'Angelo'       ? 'bg-gold/15 text-gold' :
                                                               'bg-white/5 text-zinc-500'
                    }`}>{lead.attendant_name}</span>
                  )}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {STAGES.filter(s => s.key !== stage.key).slice(0, 2).map(s => (
                      <button key={s.key} onClick={e => { e.stopPropagation(); onStageChange(lead.id, s.key); }}
                        className="text-[9px] px-2 py-1 rounded border border-white/10 text-zinc-500 hover:border-white/30 hover:text-white transition-all">
                        → {s.label.replace(' ✓', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Message Templates ────────────────────────────────────────────────────────

const MessageTemplates: React.FC<{ selectedLead?: CRMLead | null }> = ({ selectedLead }) => {
  const [templates, setTemplates] = useState<CRMMessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({ title: '', category: 'outros', body: '' });
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    const { data } = await supabase.from('crm_message_templates').select('*').order('category').order('title');
    setTemplates((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleCopy = (id: string, body: string) => {
    navigator.clipboard.writeText(fillTemplate(body, selectedLead));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveNew = async () => {
    if (!newTemplate.title || !newTemplate.body) return;
    await (supabase.from('crm_message_templates') as any).insert(newTemplate);
    setNewTemplate({ title: '', category: 'outros', body: '' });
    setShowNew(false);
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este template?')) return;
    await (supabase.from('crm_message_templates') as any).delete().eq('id', id);
    fetchTemplates();
  };

  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, CRMMessageTemplate[]>);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {selectedLead && (
          <p className="text-xs text-zinc-500">Mensagens preenchidas para: <span className="text-white font-bold">{selectedLead.contact_name}</span></p>
        )}
        <button onClick={() => setShowNew(!showNew)} className="ml-auto px-4 py-2 bg-gold text-black rounded-lg text-xs font-bold flex items-center gap-2">
          <Plus size={12} /> Novo Template
        </button>
      </div>

      {showNew && (
        <div className="glass p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input value={newTemplate.title} onChange={e => setNewTemplate({...newTemplate, title: e.target.value})}
              placeholder="Título do template" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold" />
            <select value={newTemplate.category} onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <textarea rows={5} value={newTemplate.body} onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
            placeholder="Corpo da mensagem... Use {{nome}}, {{cupom}}, {{desconto}}"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-white/10 text-zinc-400 rounded-lg text-xs">Cancelar</button>
            <button onClick={handleSaveNew} className="px-6 py-2 bg-gold text-black rounded-lg text-xs font-bold">Salvar Template</button>
          </div>
        </div>
      )}

      {(Object.entries(grouped) as [string, CRMMessageTemplate[]][]).map(([cat, items]) => (
        <div key={cat} className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 border-b border-white/5 pb-2">
            {CATEGORY_LABELS[cat] || cat}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(t => {
              const filled = fillTemplate(t.body, selectedLead);
              const waUrl = selectedLead?.contact_phone
                ? `https://wa.me/55${selectedLead.contact_phone.replace(/\D/g, '')}?text=${encodeURIComponent(filled)}`
                : null;
              return (
                <div key={t.id} className="glass p-5 space-y-3 group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-bold text-sm">{t.title}</p>
                    <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">{filled}</pre>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(t.id, t.body)}
                      className={`flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-lg font-bold transition-all ${copied === t.id ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                      <Copy size={10} /> {copied === t.id ? 'Copiado!' : 'Copiar'}
                    </button>
                    {waUrl && (
                      <a href={waUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-lg font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">
                        <MessageCircle size={10} /> Enviar WPP
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Follow-Up Manager ────────────────────────────────────────────────────────

const FollowUpManager: React.FC<{ leads: CRMLead[]; attendantFilter: string; onSelectLead: (l: CRMLead) => void }> = ({ leads, attendantFilter, onSelectLead }) => {
  const [followups, setFollowups] = useState<(CRMFollowUp & { lead?: CRMLead })[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const fetchFollowups = useCallback(async () => {
    const { data } = await supabase.from('crm_followups').select('*').eq('completed', false).order('due_date');
    const items = (data as any || []).map((f: CRMFollowUp) => ({
      ...f,
      lead: leads.find(l => l.id === f.lead_id)
    }));
    setFollowups(attendantFilter ? items.filter((f: any) => f.attendant_name === attendantFilter) : items);
    setLoading(false);
  }, [leads, attendantFilter]);

  useEffect(() => { fetchFollowups(); }, [fetchFollowups]);

  const handleComplete = async (id: string) => {
    await (supabase.from('crm_followups') as any).update({ completed: true }).eq('id', id);
    setFollowups(followups.filter(f => f.id !== id));
  };

  const overdue = followups.filter(f => f.due_date < today);
  const upcoming = followups.filter(f => f.due_date >= today);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="space-y-8">
      {overdue.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Atrasados ({overdue.length})</h4>
          </div>
          {overdue.map(f => (
            <FollowUpCard key={f.id} followup={f} onComplete={handleComplete} onOpenLead={() => f.lead && onSelectLead(f.lead)} isOverdue />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gold" />
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Agendados ({upcoming.length})</h4>
          </div>
          {upcoming.map(f => (
            <FollowUpCard key={f.id} followup={f} onComplete={handleComplete} onOpenLead={() => f.lead && onSelectLead(f.lead)} isOverdue={false} />
          ))}
        </div>
      )}

      {followups.length === 0 && (
        <div className="text-center py-16 text-zinc-600">
          <Bell size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum follow-up pendente. Ótimo trabalho! 🎉</p>
        </div>
      )}
    </div>
  );
};

const FollowUpCard: React.FC<{
  followup: CRMFollowUp & { lead?: CRMLead };
  onComplete: (id: string) => void;
  onOpenLead: () => void;
  isOverdue: boolean;
}> = ({ followup, onComplete, onOpenLead, isOverdue }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl border ${isOverdue ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
    <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-500/20' : 'bg-gold/10'}`}>
      <Calendar size={16} className={isOverdue ? 'text-red-400' : 'text-gold'} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-white font-bold text-sm">{followup.lead?.contact_name || 'Lead não encontrado'}</p>
        {isOverdue && <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">Atrasado</span>}
      </div>
      <p className="text-xs text-zinc-500">{new Date(followup.due_date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
      {followup.message && <p className="text-xs text-zinc-400 mt-1 truncate">{followup.message}</p>}
    </div>
    <div className="flex gap-2">
      <button onClick={onOpenLead} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
        <ChevronRight size={16} />
      </button>
      <button onClick={() => onComplete(followup.id)} className="p-2 text-zinc-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
        <CheckCircle2 size={16} />
      </button>
    </div>
  </div>
);

// ─── AdminCRM Main ────────────────────────────────────────────────────────────

type CRMView = 'dashboard' | 'kanban' | 'messages' | 'followup';

export const AdminCRM: React.FC = () => {
  const [view, setView] = useState<CRMView>('dashboard');
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendantFilter, setAttendantFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [modalLead, setModalLead] = useState<CRMLead | null | 'new'>('new' as any);
  const [modalOpen, setModalOpen] = useState(false);
  const [attendantName, setAttendantName] = useState('Admin');
  const [isAdmin, setIsAdmin] = useState(true);
  const [myName, setMyName] = useState('');

  // Detect logged-in user and derive role
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data?.user?.email?.toLowerCase() || '';
      const role = CRM_ROLES[email];
      if (role) {
        setIsAdmin(role.isAdmin);
        setMyName(role.name);
        setAttendantName(role.name);
        if (!role.isAdmin) setAttendantFilter(role.name);
      }
    });
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('crm_leads').select('*').order('created_at', { ascending: false });
    setLeads((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const attendants = [...new Set(leads.map(l => l.attendant_name))].filter(Boolean);
  const filteredLeads = attendantFilter ? leads.filter(l => l.attendant_name === attendantFilter) : leads;

  const handleStageChange = async (id: string, stage: PipelineStage) => {
    await (supabase.from('crm_leads') as any).update({
      pipeline_stage: stage,
      closed_at: stage === 'fechado' ? new Date().toISOString() : null,
    }).eq('id', id);
    fetchLeads();
  };

  const openLead = (lead: CRMLead) => {
    setModalLead(lead);
    setModalOpen(true);
  };

  const openNewLead = () => {
    setModalLead(null);
    setModalOpen(true);
  };

  const navItems: { key: CRMView; label: string; icon: React.ReactElement }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={14} /> },
    { key: 'kanban',    label: 'Pipeline',   icon: <ChevronRight size={14} /> },
    { key: 'messages',  label: 'Mensagens',  icon: <MessageCircle size={14} /> },
    { key: 'followup',  label: 'Follow-up',  icon: <Bell size={14} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <h3 className="text-2xl font-serif text-white flex items-center gap-3">
            <Users className="text-gold" /> CRM de Atendimento
          </h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Gestão de Leads · Pipeline · Follow-up</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Attendant filter — only admin sees this */}
          {isAdmin && (
            <select value={attendantFilter} onChange={e => setAttendantFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-gold">
              <option value="">Todos Atendentes</option>
              {attendants.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}

          {/* Attendant name: editable for admin, badge for sellers */}
          {isAdmin ? (
            <input value={attendantName} onChange={e => setAttendantName(e.target.value)}
              placeholder="Seu nome (atendente)"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-gold w-44" />
          ) : (
            <span className="bg-gold/10 border border-gold/20 text-gold text-xs px-3 py-2 rounded-lg font-bold">
              👤 {myName}
            </span>
          )}

          <button onClick={fetchLeads} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <RefreshCw size={16} />
          </button>

          <button onClick={openNewLead}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg text-xs font-bold hover:bg-white transition-all">
            <Plus size={14} /> Novo Lead
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {navItems.map(n => (
          <button key={n.key} onClick={() => setView(n.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all ${view === n.key ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      )}

      {!loading && (
        <>
          {view === 'dashboard' && (
            <div className="space-y-8">
              <CRMStats leads={leads} attendantFilter={attendantFilter} />

              {/* Per-attendant breakdown — admin only */}
              {isAdmin && attendants.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Performance por Atendente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendants.map(att => {
                      const attLeads = leads.filter(l => l.attendant_name === att);
                      const closed   = attLeads.filter(l => l.pipeline_stage === 'fechado');
                      const pipeline = attLeads.filter(l => l.pipeline_stage !== 'fechado' && l.pipeline_stage !== 'perdido');
                      const closedVal   = closed.reduce((a, l) => a + Number(l.deal_value), 0);
                      const pipelineVal = pipeline.reduce((a, l) => a + Number(l.deal_value), 0);
                      return (
                        <div key={att} className="glass p-5 cursor-pointer hover:border-gold/30 border border-transparent transition-all"
                          onClick={() => setAttendantFilter(att === attendantFilter ? '' : att)}>
                          <div className="flex items-center justify-between mb-4">
                            <p className="font-bold text-white">{att}</p>
                            {att === attendantFilter && <span className="text-[9px] bg-gold/20 text-gold px-2 py-1 rounded">Filtrado</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div><p className="text-xl font-bold text-white">{attLeads.length}</p><p className="text-[9px] text-zinc-600 uppercase">Leads</p></div>
                            <div><p className="text-xl font-bold text-green-400">{closed.length}</p><p className="text-[9px] text-zinc-600 uppercase">Fechados</p></div>
                          </div>
                          <div className="mt-3 space-y-1">
                            {closedVal > 0 && <p className="text-xs text-emerald-400 font-mono">✓ {closedVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}
                            {pipelineVal > 0 && <p className="text-xs text-blue-400 font-mono">⏳ {pipelineVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em pipeline</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent leads table */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Leads Recentes</h4>
                <div className="glass overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-left">
                          {['Lead', 'Atendente', 'Estágio', 'Valor', 'Data', ''].map((h, i) => (
                            <th key={i} className="px-4 py-3 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredLeads.slice(0, 15).map(lead => {
                          const stage = STAGES.find(s => s.key === lead.pipeline_stage);
                          return (
                            <tr key={lead.id} className="hover:bg-white/5 cursor-pointer transition-colors" onClick={() => openLead(lead)}>
                              <td className="px-4 py-3">
                                <p className="text-white font-bold text-sm">{lead.contact_name}</p>
                                <p className="text-zinc-500 text-xs">{lead.contact_phone}</p>
                              </td>
                              <td className="px-4 py-3 text-zinc-400 text-sm">{lead.attendant_name}</td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] px-2 py-1 rounded border font-bold ${stage?.color}`}>{stage?.label}</span>
                              </td>
                              <td className="px-4 py-3 text-white font-mono text-sm">
                                {Number(lead.deal_value) > 0 ? Number(lead.deal_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                              </td>
                              <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                              <td className="px-4 py-3">
                                <ChevronRight size={14} className="text-zinc-600 group-hover:text-gold" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filteredLeads.length === 0 && (
                      <div className="py-12 text-center text-zinc-600 text-sm">Nenhum lead encontrado. Clique em "Novo Lead" para começar.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'kanban' && (
            <KanbanBoard
              leads={filteredLeads}
              onSelectLead={openLead}
              onStageChange={handleStageChange}
            />
          )}

          {view === 'messages' && (
            <MessageTemplates selectedLead={selectedLead} />
          )}

          {view === 'followup' && (
            <FollowUpManager
              leads={leads}
              attendantFilter={attendantFilter}
              onSelectLead={lead => { setSelectedLead(lead); openLead(lead); }}
            />
          )}
        </>
      )}

      {/* Lead Modal */}
      {modalOpen && (
        <LeadModal
          lead={modalLead as CRMLead | null}
          onClose={() => setModalOpen(false)}
          onSaved={fetchLeads}
          attendantName={attendantName}
        />
      )}
    </div>
  );
};
