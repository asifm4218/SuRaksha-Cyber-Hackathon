
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-anomaly-scores.ts';
import '@/ai/flows/verify-biometrics-flow.ts';
import '@/ai/flows/send-email-notification-flow.ts';

