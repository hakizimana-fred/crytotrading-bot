import Z from 'zod';

export const orderSchema = Z.object({
  side: Z.enum(['Buy', 'Sell']).refine((value) => value !== null, {
    message: 'Side is required',
  }),
  price: Z.number().nullable().optional(),
  symbol: Z.string()
    .min(1)
    .regex(/^[A-Z]{6,10}$/)
    .refine((value) => /^[A-Z]{6,10}$/.test(value), {
      message: 'Invalid symbol. Symbol must contain 1-5 uppercase letters.',
    }),
  order_type: Z.enum(['Limit', 'Market']).refine((value) => value !== null, {
    message: 'order_type is required',
  }),
  qty: Z.number()
    .positive()
    .refine((value) => Number.isFinite(value), {
      message: 'Quantity must be an integer',
    }),
});

export const validSymbol = (symbol: string) => {
  const errors: any = {};
  if (!symbol) {
    errors.symbol = 'Symbol cannot be empty';
  }
  if (!symbol.match(/^[A-Z]{6,10}$/)) {
    errors.symbol =
      'Invalid symbol. Symbol must consist of 6 to 10 uppercase letters.';
  }

  return errors;
};
