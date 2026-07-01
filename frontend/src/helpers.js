// Formatta una grammatura numerica in etichetta leggibile (es. 200 -> "200 g").
export function formatGrammi(grammi) {
  if (grammi == null) return '';
  const n = Number(grammi);
  if (n >= 1000) {
    const kg = n / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`;
  }
  return `${Number.isInteger(n) ? n : n.toFixed(1)} g`;
}

// Colori icona ammessi dal tema (fallback su green).
const COLORI = ['green', 'amber', 'red', 'purple', 'blue'];
export function coloreIcona(c) {
  return COLORI.includes(c) ? c : 'green';
}
