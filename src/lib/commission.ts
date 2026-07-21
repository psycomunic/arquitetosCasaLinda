// Tabela de Progressão MENSAL do Programa de Arquitetos.
// A faixa é definida pelo FATURAMENTO DO MÊS (soma das vendas não canceladas
// do arquiteto no mês). Ao subir de faixa, a nova % vale para o mês inteiro.
export const calculateCommissionRate = (monthlyRevenue: number): number => {
    if (monthlyRevenue >= 40000) return 20; // A partir de R$ 40.000
    if (monthlyRevenue >= 30000) return 19; // R$ 30.000 a R$ 39.999
    if (monthlyRevenue >= 20000) return 18; // R$ 20.000 a R$ 29.999
    if (monthlyRevenue >= 12000) return 17; // R$ 12.000 a R$ 19.999
    if (monthlyRevenue >= 6000) return 16;  // R$ 6.000 a R$ 11.999
    return 15;                              // Até R$ 5.999
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// ── Cálculo dinâmico por mês ──────────────────────────────────────────────
// Uma venda para efeito de faixa: precisa do arquiteto, da data e do valor.
// commissionValue é o valor já armazenado/pago (preservado quando status = pago).
export interface SaleLike {
    architectId: string;
    date: string;
    saleValue: number;
    status: string;
    commissionValue?: number;
    commissionRate?: number;
}

const isPaidStatus = (status: string) => status === 'paid' || status === 'PAID';

// Chave de agrupamento: arquiteto + ano/mês (a progressão é mensal e por arquiteto).
const bucketKey = (architectId: string, dateStr: string): string => {
    const d = new Date(dateStr);
    return `${architectId}|${d.getFullYear()}-${d.getMonth()}`;
};

// Faturamento do mês por (arquiteto, mês) — soma o valor das vendas NÃO canceladas.
export const monthlyRevenueMap = <T extends SaleLike>(items: T[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    for (const it of items) {
        if (it.status === 'cancelled') continue;
        const k = bucketKey(it.architectId, it.date);
        totals[k] = (totals[k] || 0) + (Number(it.saleValue) || 0);
    }
    return totals;
};

// Recalcula a comissão de cada venda pela faixa do mês a que ela pertence.
// Retorna os itens com commissionRate (%) e commissionValue já corrigidos.
export const applyMonthlyCommission = <T extends SaleLike>(
    items: T[]
): (T & { commissionRate: number; commissionValue: number })[] => {
    const totals = monthlyRevenueMap(items);
    return items.map(it => {
        // Congela o que já foi pago: mantém o valor e a % realmente transferidos.
        if (isPaidStatus(it.status)) {
            const paidValue = Number(it.commissionValue) || 0;
            const saleValue = Number(it.saleValue) || 0;
            const paidRate = saleValue > 0
                ? Math.round((paidValue / saleValue) * 100)
                : (Number(it.commissionRate) || 0);
            return { ...it, commissionRate: paidRate, commissionValue: paidValue };
        }
        // Pendentes/futuras: faixa pela progressão mensal (mês inteiro na faixa final).
        const rate = calculateCommissionRate(totals[bucketKey(it.architectId, it.date)] || 0);
        return {
            ...it,
            commissionRate: rate,
            commissionValue: (Number(it.saleValue) || 0) * (rate / 100),
        };
    });
};

// Faixa atual do arquiteto para um mês específico, dado o conjunto de vendas dele.
export const currentMonthRate = <T extends SaleLike>(
    items: T[],
    architectId: string,
    year: number,
    month: number
): number => {
    const revenue = items
        .filter(it => it.status !== 'cancelled' && it.architectId === architectId)
        .filter(it => {
            const d = new Date(it.date);
            return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, it) => sum + (Number(it.saleValue) || 0), 0);
    return calculateCommissionRate(revenue);
};
