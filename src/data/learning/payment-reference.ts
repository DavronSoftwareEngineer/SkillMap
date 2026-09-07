// O‘quv domain funksiyasi: network, DB transaction yoki refundni bajarmaydi.
// Adapter avval Telegram update manbasini tekshiradi va runtime schema bilan parse qiladi.
// Productionda ledger insert + entitlement update bitta DB transactionda bo‘ladi.
export interface OrderTerms {
  id: string; userId: number; currency: string; amount: number; recurring: boolean;
}
export interface PaymentEvent {
  chargeId: string; orderId: string; userId: number; currency: string;
  amount: number; recurring: boolean; expiresAt?: number;
}
export function recordPayment(
  order: OrderTerms, event: PaymentEvent, ledger: readonly PaymentEvent[],
): { ledger: readonly PaymentEvent[]; duplicate: boolean; expiresAt: number | null } {
  if (!event.chargeId || event.orderId !== order.id || event.userId !== order.userId ||
      event.currency !== order.currency || event.amount !== order.amount ||
      !Number.isSafeInteger(event.amount) || event.amount <= 0 || event.recurring !== order.recurring) {
    throw new Error('Payment does not match immutable order terms');
  }
  if (event.recurring && (!Number.isSafeInteger(event.expiresAt) || event.expiresAt! <= 0)) {
    throw new Error('Recurring payment requires provider expiration');
  }
  if (!event.recurring && event.expiresAt !== undefined) throw new Error('Unexpected expiration');
  const prior = ledger.find(row => row.chargeId === event.chargeId);
  if (prior && (prior.orderId !== event.orderId || prior.userId !== event.userId ||
      prior.currency !== event.currency || prior.amount !== event.amount ||
      prior.recurring !== event.recurring || prior.expiresAt !== event.expiresAt)) {
    throw new Error('Charge ID collision requires reconciliation');
  }
  if (!order.recurring && !prior && ledger.some(row => row.orderId === order.id)) {
    throw new Error('Second charge on one-time order requires reconciliation');
  }
  const next = prior ? ledger : [...ledger, { ...event }];
  const expirations = next.filter(row => row.orderId === order.id)
    .flatMap(row => row.expiresAt === undefined ? [] : [row.expiresAt]);
  return { ledger: next, duplicate: Boolean(prior),
    expiresAt: expirations.length ? Math.max(...expirations) : null };
}
// Muqim DB: UNIQUE(bot_id, charge_id), order ownership va row locking.
// Renewal yangi charge ID bilan qayd etiladi; order.status='pending' filtri renewalni yo‘qotadi.
// Refund: alohida authorized command, provider reconciliation va entitlement recalculation.
// Ushbu reference barcha eventlarni oldindan validated, bitta bot kontekstida deb oladi.
