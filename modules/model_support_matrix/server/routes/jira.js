/**
 * Jira API routes
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://jira.devtools.intel.com';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'CVS';

// Validate configuration
if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('ERROR: JIRA_EMAIL and JIRA_API_TOKEN environment variables are required');
  console.error('Please configure these in your .env file');
}

/**
 * Helper function to make authenticated Jira API requests
 */
async function jiraRequest(endpoint, options = {}) {
  const url = `${JIRA_BASE_URL}/rest/api/2/${endpoint}`;

  // Intel Jira uses Personal Access Tokens (PAT) which can be used in two ways:
  // 1. As Bearer token (preferred for PAT)
  // 2. As Basic Auth with email:token
  // Try Bearer first, which is the standard for PAT
  const authHeader = JIRA_API_TOKEN.includes(':')
    ? 'Basic ' + Buffer.from(JIRA_API_TOKEN).toString('base64')  // Already contains email:token
    : 'Bearer ' + JIRA_API_TOKEN;  // Personal Access Token

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.errorMessages?.join(', ') || errorJson.message || errorText;
    } catch {
      errorMessage = errorText.substring(0, 500);  // Show first 500 chars of HTML/error
    }
    console.error(`Jira API error - Status: ${response.status}, URL: ${url}`);
    console.error(`Response: ${errorMessage}`);
    throw new Error(`Jira API error (${response.status}): ${errorMessage}`);
  }

  return response.json();
}

/**
 * GET /api/jira/user-info
 * Get current user information from Windows environment
 */
router.get('/user-info', (req, res) => {
  try {
    // Try to extract user info from Windows environment
    const username = process.env.USERNAME || process.env.USER || '';
    const userdomain = process.env.USERDOMAIN || '';

    // For Intel network, try to construct email
    let email = '';
    let name = username;

    // Convert Windows username to proper name format
    if (username) {
      // Handle formats like "kumarijy" or "firstname.lastname"
      if (username.includes('.')) {
        // firstname.lastname -> Firstname Lastname
        const parts = username.toLowerCase().split('.');
        name = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      } else {
        // Single name - capitalize first letter
        name = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
      }
    }

    // Construct Intel email if on Intel domain
    const intelDomains = ['intel', 'ger', 'amr', 'ccr', 'gar', 'iil'];
    if (username && intelDomains.some(domain => userdomain.toLowerCase().includes(domain))) {
      email = `${username.toLowerCase()}@intel.com`;
    }

    res.json({
      name: name || '',
      email: email || '',
      username: username || '',
      domain: userdomain || '',
    });
  } catch (error) {
    // Return empty if we can't determine user info
    res.json({ name: '', email: '', username: '', domain: '' });
  }
});

/**
 * POST /api/jira/create-model-request
 * Create a new model enablement request in Jira
 */
router.post('/create-model-request', async (req, res) => {
  try {
    const { title, description, modelName, requesterEmail, requesterName } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
      return res.status(500).json({
        error: 'Jira credentials not configured. Please set JIRA_EMAIL and JIRA_API_TOKEN environment variables.'
      });
    }

    // Create Jira issue payload
    const issuePayload = {
      fields: {
        project: {
          key: JIRA_PROJECT_KEY, // OpenVINO (CVS)
        },
        summary: title,
        description: description,
        issuetype: {
          name: 'Requirement',
        },
        components: [
          {
            name: 'Model Enabling',
          },
        ],
        labels: ['model'],
      },
    };

    // Try to set the reporter to the actual user (if they have a Jira account)
    // This will make the user the official reporter instead of the service account
    if (requesterEmail) {
      // First, try to find the user by email
      try {
        const userSearchResponse = await jiraRequest(`user/search?query=${encodeURIComponent(requesterEmail)}`);
        if (userSearchResponse && userSearchResponse.length > 0) {
          // User found! Set them as the reporter
          issuePayload.fields.reporter = {
            name: userSearchResponse[0].name, // Jira username
          };
          console.log(`Setting reporter to: ${userSearchResponse[0].displayName} (${requesterEmail})`);
        } else {
          console.log(`User ${requesterEmail} not found in Jira. Using service account as reporter.`);
          // User info is already in the description, so it's still tracked
        }
      } catch (userSearchError) {
        console.log(`Could not search for user ${requesterEmail}:`, userSearchError.message);
        // Continue anyway - user info is in description
      }
    }

    console.log('Creating Jira issue:', JSON.stringify(issuePayload, null, 2));

    // Create the issue
    const result = await jiraRequest('issue', {
      method: 'POST',
      body: JSON.stringify(issuePayload),
    });

    console.log('Jira issue created successfully:', result.key);

    res.json({
      success: true,
      issueKey: result.key,
      issueId: result.id,
      issueUrl: `${JIRA_BASE_URL}/browse/${result.key}`,
    });
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Jira issue',
      details: error.toString(),
    });
  }
});

/**
 * GET /api/jira/issue/:key
 * Get details of a specific Jira issue
 */
router.get('/issue/:key', async (req, res) => {
  try {
    const { key } = req.params;

    if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
      return res.status(500).json({
        error: 'Jira credentials not configured'
      });
    }

    const issue = await jiraRequest(`issue/${key}`);

    res.json({
      success: true,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        status: issue.fields.status.name,
        created: issue.fields.created,
        updated: issue.fields.updated,
        reporter: issue.fields.reporter?.displayName,
        assignee: issue.fields.assignee?.displayName,
      },
    });
  } catch (error) {
    console.error('Error fetching Jira issue:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch Jira issue'
    });
  }
});

export default router;
