
export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  status: 'Completed' | 'Pending' | 'Failed';
};

export const transactions: Transaction[] = [
  { id: 'txn_1', date: '2024-07-20', description: 'Salary Credit - July', amount: 85000.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_2', date: '2024-07-19', description: 'Reliance Digital', amount: 4999.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_3', date: '2024-07-19', description: 'Swiggy Order', amount: 350.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_4', date: '2024-07-18', description: 'Jio Mobile Recharge', amount: 749.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_5', date: '2024-07-17', description: 'ATM Withdrawal', amount: 10000.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_6', date: '2024-07-16', description: 'Zomato Pro Subscription', amount: 200.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_7', date: '2024-07-15', description: 'Amazon Shopping', amount: 1250.75, type: 'Debit', status: 'Completed' },
  { id: 'txn_8', date: '2024-07-14', description: 'Interest Payment', amount: 120.50, type: 'Credit', status: 'Completed' },
  { id: 'txn_9', date: '2024-07-13', description: 'Electricity Bill', amount: 2300.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_10', date: '2024-07-12', description: 'Netflix Subscription', amount: 649.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_11', date: '2024-07-11', description: 'Transfer to Friend', amount: 5000.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_12', date: '2024-07-10', description: 'Mutual Fund Investment', amount: 15000.00, type: 'Debit', status: 'Pending' },
  { id: 'txn_13', date: '2024-07-09', description: 'Refund from Myntra', amount: 999.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_14', date: '2024-07-08', description: 'Ola Cab Ride', amount: 250.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_15', date: '2024-07-07', description: 'Flight Booking to Goa', amount: 8500.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_16', date: '2024-07-06', description: 'Credit Card Payment', amount: 25000.00, type: 'Debit', status: 'Failed' },
  { id: 'txn_17', date: '2024-07-05', description: 'BookMyShow Movies', amount: 750.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_18', date: '2024-07-04', description: 'Cashback Received', amount: 50.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_19', date: '2024-07-03', description: 'Gym Membership', amount: 1500.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_20', date: '2024-07-02', description: 'Starbucks Coffee', amount: 450.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_21', date: '2024-07-01', description: 'Rent Payment', amount: 20000.00, type: 'Debit', status: 'Completed' },
];
