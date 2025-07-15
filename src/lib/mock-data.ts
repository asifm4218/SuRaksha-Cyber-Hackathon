
export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  status: 'Completed' | 'Pending' | 'Failed';
};
