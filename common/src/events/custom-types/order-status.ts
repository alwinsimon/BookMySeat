export enum OrderStatus {
  // Order has been created, but the ticket in the order has not been reserved.
  Created = "created",

  // User has cancelled the order or the ticket that order contains is unavailable
  // Possibilities of reserved by another order, ticket deleted, payment not done before expiration time.
  Cancelled = "cancelled",

  // Order has successfully reserved the Ticket it contains.
  AwaitingPayment = "awaiting:payment",

  // Reserved ticket has been confirmed sold after order receiving payment successfully.
  Complete = "complete",
}
