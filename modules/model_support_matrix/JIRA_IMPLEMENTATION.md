# Jira Integration Implementation Summary

## What Was Implemented

A complete Jira integration that allows Intel employees to request model enablement directly from the OpenVINO Model Resources web application. When users click "Request Model", they fill out a structured form that automatically creates a Jira issue in the CVS project.

### Authentication Architecture: Service Account + User Tracking

**Design Decision:**
- Uses a single service account (configured in `.env`) to authenticate with Jira
- Users provide their name and email in the request form (auto-populated from Windows environment)
- System attempts to set the user as the official "Reporter" in Jira if they have an account
- User information is always tracked in the issue description

**Why this approach?**
- ✅ Simple UX - users don't need Jira credentials
- ✅ Full user accountability - tracks actual requester
- ✅ Smart Reporter assignment - sets user as Reporter if they have Jira account
- ✅ Works for all Intel employees
- ✅ Auto-population reduces manual entry

## Architecture

```
┌─────────────────────┐
│  React Frontend     │
│  (Landing Page)     │
│  - Request Model    │
│    Button           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  RequestModelModal  │
│  - Pre-filled form  │
│  - Validation       │
└──────────┬──────────┘
           │ POST /api/jira/create-model-request
           ▼
┌─────────────────────┐
│  Express Backend    │
│  (Port 3001)        │
│  - Authentication   │
│  - Jira API calls   │
└──────────┬──────────┘
           │ Jira REST API v2
           ▼
┌─────────────────────┐
│  Intel Jira         │
│  (CVS Project)      │
│  - Create issue     │
└─────────────────────┘
```

## Files Created/Modified

### New Files
1. **`src/components/RequestModelModal.tsx`** - React modal component with form
2. **`server/index.js`** - Express backend server
3. **`server/routes/jira.js`** - Jira API routes
4. **`.env.example`** - Environment configuration template
5. **`JIRA_SETUP.md`** - Setup and configuration guide
6. **`JIRA_IMPLEMENTATION.md`** - This file

### Modified Files
1. **`src/components/LandingPage.tsx`** - Replaced direct Jira link with modal
2. **`package.json`** - Added backend dependencies and scripts

## Features

### Frontend (RequestModelModal.tsx)
- ✅ Modal dialog with form fields
- ✅ Auto-population of user name and email from Windows environment
- ✅ Pre-filled template matching CVS-26296 structure
- ✅ Real-time title preview
- ✅ Form validation
- ✅ Loading states during submission
- ✅ Success/error messages
- ✅ Auto-redirect to created Jira issue
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Grouped sections (Your Information / Model Details)

### Backend (server/)
- ✅ Express.js REST API
- ✅ Basic authentication with Jira
- ✅ Environment-based configuration
- ✅ Error handling
- ✅ CORS support
- ✅ Health check endpoint
- ✅ Detailed logging
- ✅ User info auto-detection from Windows environment
- ✅ Smart Reporter assignment (sets actual user if they have Jira account)
- ✅ Jira user search by email

### Jira Issue Structure
```
Project: OpenVINO (CVS)
Issue Type: Requirement
Component: Model Enabling
Labels: model
Reporter: User (if Jira account exists) OR Service Account
Title: [Enable] "{MODEL_NAME}" model
Description: 
  Requested by: John Doe (john.doe@intel.com)
  Request Date: 2026-06-02
  
  [Structured template with all model fields]
```

## Quick Start

1. **Install dependencies**:
   ```bash
   cd modules/model_support_matrix
   npm install
   ```

2. **Configure Jira credentials**:
   ```bash
   cp .env.example .env
   # Edit .env with your Jira credentials
   ```

3. **Start development environment**:
   ```bash
   npm run start:dev
   ```
   This runs both frontend (port 8080) and backend (port 3001)

4. **Test the feature**:
   - Open http://localhost:8080
   - Click "Request Model" button
   - Fill out the form
   - Submit to create a Jira issue

## API Endpoints

### GET /api/jira/user-info
Auto-detect user information from Windows environment

**Response**:
```json
{
  "name": "John Doe",
  "email": "john.doe@intel.com",
  "username": "john.doe",
  "domain": "INTEL"
}
```

### POST /api/jira/create-model-request
Create a new model enablement request

**Request**:
```json
{
  "title": "[Enable] \"Llama-3-8B\" model",
  "description": "Requested by: John Doe (john.doe@intel.com)\n...",
  "modelName": "Llama-3-8B",
  "requesterName": "John Doe",
  "requesterEmail": "john.doe@intel.com"
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
Get details of a specific Jira issue (for future use)

### GET /health
Health check endpoint

## Form Fields

| Field | Type | Required | Pre-filled | Editable | Auto-populated |
|-------|------|----------|-----------|----------|----------------|
| Your Name | Text | Yes | No | Yes | From Windows USERNAME |
| Your Email | Email | Yes | No | Yes | From Windows USERNAME + domain |
| Model Name | Text | Yes | No | Yes | No |
| Model Format | Dropdown | Yes | No | Yes | No |
| Model Link | Text | Yes | No | Yes | No |
| Target HW | Dropdown | Yes | CPU | Yes | No |
| Additional Requirements | Textarea | No | No | Yes | No |
| Customer Info | Textarea | No | No | Yes | No |

## Environment Variables

Required in `.env`:
```env
JIRA_BASE_URL=https://jira.devtools.intel.com
JIRA_EMAIL=your.email@intel.com
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=CVS
PORT=3001
```

## Security

- ✅ Credentials stored server-side only
- ✅ `.env` in `.gitignore`
- ✅ Basic authentication to Jira
- ⚠️ TODO: Consider rate limiting
- ⚠️ TODO: Add request validation middleware
- ⚠️ TODO: Use service account instead of personal credentials

## Next Steps / Future Enhancements

1. **Authentication**: Add user authentication to track who created issues
2. **Service Account**: Use a dedicated Jira service account
3. **Field Validation**: Add more robust field validation
4. **Auto-complete**: Add model name suggestions from existing data
5. **Issue Tracking**: Show user's created issues in the UI
6. **File Uploads**: Allow attaching files to requests
7. **Templates**: Support multiple request templates
8. **Status Updates**: Poll and display issue status
9. **Notifications**: Email/Slack notifications on issue creation

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend API
- [ ] Modal opens when clicking "Request Model"
- [ ] Form validation works correctly
- [ ] Jira issue created with correct fields
- [ ] Success message displays
- [ ] Redirect to Jira issue works
- [ ] Error handling works (invalid credentials, network errors)
- [ ] Dark mode styling looks correct

## Troubleshooting

**Issue**: "Jira credentials not configured"
- **Fix**: Create `.env` file with credentials

**Issue**: 401 Unauthorized
- **Fix**: Check API token, regenerate if needed

**Issue**: Component/Issue Type not found
- **Fix**: Verify CVS project has "Model Enabling" component and "Requirement" issue type

**Issue**: CORS errors
- **Fix**: Ensure backend server is running

See [JIRA_SETUP.md](./JIRA_SETUP.md) for detailed troubleshooting.

## Dependencies Added

```json
{
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.18.2",
  "node-fetch": "^3.3.2",
  "concurrently": "^8.2.2"
}
```

## Scripts Added

```json
{
  "start:server": "node server/index.js",
  "start:dev": "concurrently \"npm run start\" \"npm run start:server\""
}
```

## References

- Jira REST API: https://docs.atlassian.com/software/jira/docs/api/REST/latest/
- Template Issue: https://jira.devtools.intel.com/browse/CVS-26296
- Express.js: https://expressjs.com/
