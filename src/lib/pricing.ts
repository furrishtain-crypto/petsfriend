// Quantity slabs. Slab boundaries come from the product's MOQ so every product has its own ranges.
export const SLAB_FACTORS = [1, 0.92, 0.84, 0.78, 0.72];

export type Slab = { id?: number; min_qty: number; max_qty: number | null; price: number };

export function slabBounds(moq: number): { min: number; max: number | null }[] {
  const m = Math.max(1, moq);
  return [
    { min: m, max: m * 2 },
    { min: m * 2 + 1, max: m * 4 },
    { min: m * 4 + 1, max: m * 10 },
    { min: m * 10 + 1, max: m * 20 },
    { min: m * 20 + 1, max: null },
  ];
}

export function defaultSlabs(moq: number, base: number): Slab[] {
  return slabBounds(moq).map((b, i) => ({
    min_qty: b.min,
    max_qty: b.max,
    price: Math.round(base * SLAB_FACTORS[i]),
  }));
}

export function slabLabel(s: Slab): string {
  const f = (n: number) => n.toLocaleString('en-IN');
  return s.max_qty ? `${f(s.min_qty)} to ${f(s.max_qty)}` : `${f(s.min_qty)} and above`;
}
