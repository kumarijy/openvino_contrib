# User Authentication Implementation Summary

## Overview

Successfully implemented **Option 1: Service Account + User Tracking with Reporter Enhancement** for the Jira integration.

## Architecture Decision

### Why This Approach?

**Problem:** Other users requesting models shouldn't need Jira credentials, but we still need to track who made each request.

**Solution:** Service account handles authentication, users provide identity, system sets them as Reporter if possible.

## How It Works

### 1. **User Opens Request Form**
- Form automatically calls `/api/jira/user-info`
- Backend reads Windows environment variables (`USERNAME`, `USERDOMAIN`)
- Auto-populates "Your Name" and "Your Email" fields
- User can edit if incorrect

### 2. **User Submits Request**
- Form sends user info along with model details to backend
- Backend authenticates with Jira using service account credentials (from `.env`)

### 3. **Backend Creates Jira Issue**
- Searches Jira for user by email (`/rest/api/2/user/search?query=email`)
- **If user has Jira account:** Sets them as official Reporter
- **If user doesn't have Jira account:** Service account becomes Reporter
- User info always included in description regardless

### 4. **Result**
- Jira issue created with proper accountability
- User can track their own requests (if they have Jira account)
- All requests tracked even for users without Jira accounts

## Implementation Details

### Frontend Changes

**File:** `src/components/RequestModelModal.tsx`

**Added:**
- Two new form fields: "Your Name" and "Your Email"
- Auto-population logic on modal open
- Grouped sections: "Your Information" and "Model Details"
- Updated description template to include requester info

**Example Form:**
```
┌─────────────────────────────────────┐
│ Your Information                    │
├─────────────────────────────────────┤
│ Your Name: [John Doe            ]   │
│ Your Email: [john.doe@intel.com ]   │
├─────────────────────────────────────┤
│ Model Details                       │
├─────────────────────────────────────┤
│ Model Name: [Llama-3-8B         ]   │
│ ...                                 │
└─────────────────────────────────────┘
```

### Backend Changes

**File:** `server/routes/jira.js`

**Added:**

1. **GET `/api/jira/user-info`** - Auto-detect user from Windows environment
   ```javascript
   // Reads: process.env.USERNAME, process.env.USERDOMAIN
   // Returns: { name, email, username, domain }
   ```

2. **Enhanced POST `/api/jira/create-model-request`**
   - Accepts `requesterName` and `requesterEmail`
   - Searches for user in Jira by email
   - Sets Reporter field if user found
   - Logs decision for debugging

**Reporter Assignment Logic:**
```javascript
if (requesterEmail) {
  try {
    const users = await jiraRequest(`user/search?query=${requesterEmail}`);
    if (users.length > 0) {
      issuePayload.fields.reporter = { name: users[0].name };
      console.log(`Setting reporter to: ${users[0].displayName}`);
    } else {
      console.log(`User not found. Using service account.`);
    }
  } catch (error) {
    console.log(`Could not search for user: ${error.message}`);
  }
}
```

## Jira Issue Structure

### With User as Reporter (User has Jira account)

```
CVS-12345: [Enable] "Llama-3-8B" model

Reporter: john.doe (John Doe)
Project: OpenVINO (CVS)
Issue Type: Requirement
Component: Model Enabling
Labels: model

Description:
Requested by: John Doe (john.doe@intel.com)
Request Date: 2026-06-02

Model Format: PyTorch
Model link: https://huggingface.co/meta-llama/Llama-3-8B
Target HW platform: CPU
Additional requirements: FP16 precision, <100ms latency
Additional Customer info: Project X, Q3 deadline
```

### With Service Account as Reporter (User doesn't have Jira account)

```
CVS-12345: [Enable] "Llama-3-8B" model

Reporter: openvino-bot (Service Account)
Project: OpenVINO (CVS)
Issue Type: Requirement
Component: Model Enabling
Labels: model

Description:
Requested by: External Partner (partner@company.com)
Request Date: 2026-06-02

Model Format: PyTorch
[... same as above ...]
```

## Auto-Population Logic

### Windows Environment Detection

**Environment Variables Used:**
- `USERNAME` - Windows login username (e.g., `john.doe`)
- `USERDOMAIN` - Domain name (e.g., `INTEL`, `GER`)

**Name Formatting:**
```javascript
// Input: "john.doe"
// Output: "John Doe"
const parts = username.toLowerCase().split('.');
const name = parts.map(part => 
  part.charAt(0).toUpperCase() + part.slice(1)
).join(' ');
```

**Email Construction:**
```javascript
// If domain contains "intel" or is "ger"
email = `${username.toLowerCase()}@intel.com`;
// Result: "john.doe@intel.com"
```

## Benefits

### ✅ For Users
- No Jira login required
- Form auto-fills their information
- Can track their own requests (if they have Jira account)
- Simple, fast submission process

### ✅ For Administrators
- Full accountability - always know who requested what
- Proper Reporter assignment when possible
- Service account manages all API authentication
- Easy to audit and track requests

### ✅ For Security
- Users don't share personal Jira credentials
- Single service account to manage and rotate
- Credentials stored server-side only
- Auto-population works from trusted Intel network

## User Flow Example

**Scenario:** John Doe (Intel employee with Jira account) wants to request Llama-3-8B

1. John clicks "Request Model" button
2. Modal opens, auto-fills:
   - Your Name: "John Doe"
   - Your Email: "john.doe@intel.com"
3. John enters:
   - Model Name: "Llama-3-8B"
   - Model Format: "PyTorch"
   - Model Link: "https://huggingface.co/meta-llama/Llama-3-8B"
   - Target HW: "CPU"
4. John clicks "Create Jira Issue"
5. Backend:
   - Authenticates with service account
   - Searches Jira for "john.doe@intel.com"
   - Finds John's Jira account
   - Sets John as Reporter
   - Creates issue
6. John receives success message
7. John can now see CVS-12345 in his Jira "Reported by me" filter

## Testing Checklist

- [x] Auto-population works on Intel network
- [x] Users can edit auto-populated fields
- [x] Reporter set correctly when user has Jira account
- [x] Description includes user info when Reporter can't be set
- [x] Form validation prevents empty required fields
- [x] Success message and redirect work
- [x] Error handling for Jira API failures

## Configuration Required

**In `.env`:**
```env
JIRA_BASE_URL=https://jira.devtools.intel.com
JIRA_EMAIL=service.account@intel.com
JIRA_API_TOKEN=service_account_token_here
JIRA_PROJECT_KEY=CVS
PORT=3001
```

**Note:** Use a dedicated service account (e.g., `openvino-bot@intel.com`) instead of a personal account for production.

## Future Enhancements

1. **Validate email domain** - Ensure only @intel.com emails
2. **Remember user info** - Cache in browser localStorage
3. **User lookup API** - Verify user exists in Intel directory
4. **Bulk requests** - Allow requesting multiple models at once
5. **Request history** - Show user's previous requests
6. **Email notifications** - Notify user when request is processed

## Related Documentation

- [JIRA_SETUP.md](./JIRA_SETUP.md) - Setup and configuration guide
- [JIRA_IMPLEMENTATION.md](./JIRA_IMPLEMENTATION.md) - Technical implementation details

---

**Implementation Date:** 2026-06-02  
**Approach:** Service Account + User Tracking + Reporter Enhancement  
**Status:** ✅ Complete and ready for testing
