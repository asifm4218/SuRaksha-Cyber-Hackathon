
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Transaction } from '@/lib/mock-data';

const dbPath = path.join(process.cwd(), 'transactions.json');

const initialTransactions: Transaction[] = [
  { id: 'txn_1', date: '2024-07-20T10:00:00Z', description: 'Salary Credit - July', amount: 85000.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_2', date: '2024-07-19T15:30:00Z', description: 'Reliance Digital', amount: 4999.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_3', date: '2024-07-19T20:00:00Z', description: 'Swiggy Order', amount: 350.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_4', date: '2024-07-18T11:00:00Z', description: 'Jio Mobile Recharge', amount: 749.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_5', date: '2024-07-17T09:00:00Z', description: 'ATM Withdrawal', amount: 10000.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_6', date: '2024-07-16T12:00:00Z', description: 'Zomato Pro Subscription', amount: 200.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_7', date: '2024-07-15T18:45:00Z', description: 'Amazon Shopping', amount: 1250.75, type: 'Debit', status: 'Completed' },
  { id: 'txn_8', date: '2024-07-14T00:00:00Z', description: 'Interest Payment', amount: 120.50, type: 'Credit', status: 'Completed' },
  { id: 'txn_9', date: '2024-07-13T14:00:00Z', description: 'Electricity Bill', amount: 2300.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_10', date: '2024-07-12T22:00:00Z', description: 'Netflix Subscription', amount: 649.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_11', date: '2024-07-11T19:30:00Z', description: 'Transfer to Friend', amount: 5000.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_12', date: '2024-07-10T11:00:00Z', description: 'Mutual Fund Investment', amount: 15000.00, type: 'Debit', status: 'Pending' },
  { id: 'txn_13', date: '2024-07-09T13:00:00Z', description: 'Refund from Myntra', amount: 999.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_14', date: '2024-07-08T17:00:00Z', description: 'Ola Cab Ride', amount: 250.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_15', date: '2024-07-07T08:00:00Z', description: 'Flight Booking to Goa', amount: 8500.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_16', date: '2024-07-06T16:00:00Z', description: 'Credit Card Payment', amount: 25000.00, type: 'Debit', status: 'Failed' },
  { id: 'txn_17', date: '2024-07-05T21:00:00Z', description: 'BookMyShow Movies', amount: 750.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_18', date: '2024-07-04T14:00:00Z', description: 'Cashback Received', amount: 50.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_19', date: '2024-07-03T07:00:00Z', description: 'Gym Membership', amount: 1500.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_20', date: '2024-07-02T18:00:00Z', description: 'Starbucks Coffee', amount: 450.00, type: 'Debit', status: 'Completed' },
  { id: 'txn_21', date: '2024-07-01T12:00:00Z', description: 'Rent Payment', amount: 20000.00, type: 'Debit', status: 'Completed' },
];


async function readData(): Promise<Transaction[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dbPath, JSON.stringify(initialTransactions, null, 2));
      return initialTransactions;
    }
    throw error;
  }
}

async function writeData(data: Transaction[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function readTransactions(): Promise<Transaction[]> {
  return await readData();
}

export async function writeTransactions(transactions: Transaction[]): Promise<void> {
  await writeData(transactions);
}
