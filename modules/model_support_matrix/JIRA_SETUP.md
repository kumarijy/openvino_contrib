# Jira Integration Setup Guide

This guide will help you set up the Jira integration for the OpenVINO Model Resources "Request Model" feature.

## Overview

The integration allows Intel employees to create model enablement requests directly from the web application. When a user clicks "Request Model", they fill out a form that automatically creates a Jira issue in the OpenVINO (CVS) project with the template structure from CVS-26296.

### User Authentication Approach

This implementation uses a **Service Account + User Tracking** approach:
- Backend uses a single service account (configured in `.env`) to authenticate with Jira
- Users provide their name and email in the request form
- The system attempts to set the user as the official "Reporter" in Jira (if they have a Jira account)
- If the user doesn't have a Jira account, their information is tracked in the issue description
- User information is auto-populated from Windows environment variables when possible

## Prerequisites

1. Intel Jira account with access to https://jira.devtools.intel.com
2. Permission to create issues in the CVS project
3. Node.js installed (v16 or higher)

## Step 1: Get Your Jira API Token

### Option A: Personal Access Token (Recommended)
1. Log in to https://jira.devtools.intel.com
2. Go to your profile (click your avatar in top-right)
3. Navigate to **Profile → Personal Access Tokens**
4. Click **Create token**
5. Give it a name (e.g., "OpenVINO Model Resources")
6. Set an expiration date (optional)
7. Copy the generated token immediately (you won't be able to see it again)

### Option B: API Token (if Personal Access Tokens not available)
1. Log in to https://jira.devtools.intel.com
2. Go to **Account Settings → Security → API Tokens**
3. Click **Create API token**
4. Copy the generated token

## Step 2: Configure Environment Variables

1. Navigate to the project directory:
   ```bash
   cd modules/model_support_matrix
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and fill in your credentials:
   ```env
   JIRA_BASE_URL=https://jira.devtools.intel.com
   JIRA_EMAIL=your.email@intel.com
   JIRA_API_TOKEN=your_jira_api_token_here
   JIRA_PROJECT_KEY=CVS
   PORT=3001
   ```

   Replace:
   - `your.email@intel.com` with your Intel email
   - `your_jira_api_token_here` with the token from Step 1

4. **Important**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- Express (backend server)
- CORS (cross-origin requests)
- dotenv (environment variables)
- node-fetch (HTTP client for Jira API)
- concurrently (run frontend + backend together)

## Step 4: Test the Setup

### Start the development environment:
```bash
npm run start:dev
```

This command runs both:
- Frontend (webpack-dev-server) on http://localhost:8080
- Backend API server on http://localhost:3001

### Verify backend is running:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","message":"Server is running"}`

## Step 5: Test Creating a Jira Issue

1. Open the application in your browser (usually http://localhost:3000)
2. Click the **"Request Model"** button in the top-right corner
3. The form will auto-populate your name and email from Windows environment
4. Fill out the form:
   - **Your Name**: (auto-populated, can edit)
   - **Your Email**: (auto-populated, can edit)
   - **Model Name**: e.g., "Llama-3-8B"
   - **Model Format**: Select from dropdown
   - **Model Link**: HuggingFace URL or "restricted - access needed"
   - **Target HW Platform**: CPU/GPU/NPU
   - **Additional Requirements**: (optional)
   - **Customer Info**: (optional)
5. Click **"Create Jira Issue"**
6. If successful, you'll see a success message and be redirected to the created issue
7. Check the Reporter field - it should be set to you (if you have a Jira account)

## Jira Issue Template Structure

When a user creates a request, the following Jira issue is created:

**Project**: OpenVINO (CVS)  
**Issue Type**: Requirement  
**Component**: Model Enabling  
**Labels**: model  
**Reporter**: User's Jira account (if found), otherwise service account  
**Title**: `[Enable] "{MODEL_NAME}" model`  

**Description**:
```
Requested by: [User Name] ([user.email@intel.com])
Request Date: YYYY-MM-DD

Model Format (PyTorch, ONNX, other): [user input]
Model link (HuggingFace, GitHub, other): [user input]
Target HW platform (CPU (default), GPU, NPU): [user input]
Additional requirements (Performance, Latency, precision, ETA, other): [user input]
Additional Customer info (Design win, deal size, date to intercept): [user input]
```

### Reporter Field Logic

The system intelligently sets the Reporter field:
1. **User has Jira account**: User becomes the official Reporter (they can track/update the issue)
2. **User doesn't have Jira account**: Service account is Reporter, but user info is in the description
3. User information is **always** tracked in the description regardless of Reporter field

## Auto-Population of User Information

The application automatically detects user information from the Windows environment:

**How it works:**
1. When the request form opens, it calls `/api/jira/user-info`
2. Backend reads Windows environment variables (`USERNAME`, `USERDOMAIN`)
3. Constructs user's name and Intel email address
4. Returns this info to pre-fill the form

**Environment Variables Used:**
- `USERNAME` - Windows username (e.g., `john.doe`)
- `USERDOMAIN` - Domain name (e.g., `INTEL`, `GER`)

**Example:**
- Username: `john.doe`
- Domain: `INTEL`
- Auto-populated name: `John Doe`
- Auto-populated email: `john.doe@intel.com`

**Notes:**
- Users can edit the auto-populated values if incorrect
- If auto-population fails, users enter information manually
- Auto-population works best on Intel corporate network

## Troubleshooting

### Error: "Jira credentials not configured"
- Ensure `.env` file exists and has `JIRA_EMAIL` and `JIRA_API_TOKEN` set
- Restart the backend server after updating `.env`

### Error: "Jira API error (401): Unauthorized"
- Your API token may be invalid or expired
- Regenerate the token and update `.env`

### Error: "Component 'Model Enabling' not found"
- The CVS project may not have a component named "Model Enabling"
- Check the project configuration or update the component name in `server/routes/jira.js`

### Error: "Issue type 'Requirement' not found"
- The CVS project may use a different issue type
- Update the issue type in `server/routes/jira.js` to match your project's configuration

### CORS errors in browser console
- Ensure the backend server is running (`npm run start:server`)
- Check that CORS is properly configured in `server/index.js`

## Production Deployment

For production deployment on Intel's internal network:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Serve the built files** (from `dist/` directory)

3. **Run the backend server**:
   ```bash
   npm run start:server
   ```

4. **Use a process manager** like PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "jira-api"
   ```

5. **Set up a reverse proxy** (nginx/Apache) to route `/api/*` to the backend

## Security Considerations

- ✅ API tokens are stored server-side (not exposed to browser)
- ✅ `.env` is in `.gitignore` to prevent accidental commits
- ⚠️ Consider using a dedicated service account instead of personal credentials
- ⚠️ Rotate API tokens regularly
- ⚠️ Use HTTPS in production

## API Endpoints

### POST /api/jira/create-model-request
Create a new model enablement request

**Request Body**:
```json
{
  "title": "[Enable] \"Llama-3-8B\" model",
  "description": "Model Format...",
  "modelName": "Llama-3-8B"
}
```

**Response**:
```json
{
  "success": true,
  "issueKey": "CVS-12345",
  "issueId": "123456",
  "issueUrl": "https://jira.devtools.intel.com/browse/CVS-12345"
}
```

### GET /api/jira/issue/:key
Get details of a specific Jira issue

**Example**: `/api/jira/issue/CVS-26296`

## Need Help?

- Check Jira REST API docs: https://docs.atlassian.com/software/jira/docs/api/REST/latest/
- Contact the OpenVINO team for CVS project access
- Review server logs for detailed error messages

## References

- Template Issue: https://jira.devtools.intel.com/browse/CVS-26296
- Jira REST API: https://docs.atlassian.com/software/jira/docs/api/REST/latest/
