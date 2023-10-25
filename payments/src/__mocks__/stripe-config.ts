export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({success: true}),
  },
};
