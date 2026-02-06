export const calculateCommissionRate = (totalSales: number): number => {
    if (totalSales >= 40000) return 20; // Manter lógica caso queiram aumentar tiers depois
    if (totalSales >= 30000) return 20;
    if (totalSales >= 20000) return 20;
    if (totalSales >= 12000) return 20;
    if (totalSales >= 6000) return 20;
    return 20;
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
