/** Payment transaction record */
export interface PaymentTransaction {
  id: string;
  type: "incoming" | "outgoing" | "refund";
  amount: number;
  currency: string;
  description: string;
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
  method?: string;
  counterparty?: string;
}

/** Spending data point for charts */
export interface SpendingDataPoint {
  month: string;
  amount: number;
}
