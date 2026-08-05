export const formatCurrency = (value?: number | null): string => {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone?: string | null): string => {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 0) return '';
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, (_match, p1, p2, p3) => {
      return p3 ? `(${p1}) ${p2}-${p3}` : p2 ? `(${p1}) ${p2}` : `(${p1}`;
    }).trim();
  }
  return cleaned.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').trim();
};

export const formatDateBR = (isoDate?: string | null): string => {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const dateOnly = isoDate.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

export const formatTime = (time?: string | null): string => {
  if (!time || typeof time !== 'string') return '';
  const parts = time.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return time;
};
