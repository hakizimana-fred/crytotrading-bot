import Z from 'zod';

export const orderSchema = Z.object({
  side: Z.enum(['Buy', 'Sell']).refine((value) => value !== null, {
    message: 'Side is required',
  }),
  price: Z.number().nullable().optional(),
  symbol: Z.string({ required_error: 'Symbol is required' })
    .min(1)
    .regex(/^[A-Z]{1,5}$/),
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
  if (!symbol.match(/^[A-Z]{1,5}$/)) {
    errors.symbol = 'Invalid symbol';
  }

  return errors;
};
