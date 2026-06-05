/**
 * Backend API server for Jira integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env FIRST before importing routes
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Now import routes (after dotenv has loaded)
const { default: jiraRoutes } = await import('./routes/jira.js');

// Log environment variable loading for debugging
console.log('=== Environment Variables ===');
console.log('Loading .env from:', envPath);
console.log('JIRA_EMAIL:', process.env.JIRA_EMAIL ? 'Configured' : 'NOT CONFIGURED');
console.log('JIRA_API_TOKEN:', process.env.JIRA_API_TOKEN ? 'Configured' : 'NOT CONFIGURED');
console.log('JIRA_BASE_URL:', process.env.JIRA_BASE_URL || 'Using default');
console.log('===========================');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jira', jiraRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Jira base URL: ${process.env.JIRA_BASE_URL || 'Not configured'}`);
});
