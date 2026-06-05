# Jira Integration - Direct Link Approach

## Implementation Summary

Due to Intel Jira's session-based authentication (SSO/SAML), we've implemented a **Direct Link** approach instead of programmatic API integration.

## How It Works

### User Flow

1. **User fills out the "Request Model" form** in the web application
   - Your Name (auto-populated)
   - Your Email (auto-populated)
   - Model Name
   - Model Format
   - Model Link
   - Target HW Platform
   - Additional Requirements (optional)
   - Customer Info (optional)

2. **User clicks "Open in Jira"**
   - Application constructs a Jira URL with all pre-filled fields
   - Opens Jira in a new browser tab

3. **User reviews and creates issue in Jira**
   - All fields are pre-filled
   - User can edit if needed
   - User clicks "Create" button in Jira
   - Issue is created with user's own Jira account (proper attribution)

## Benefits of This Approach

### ✅ Advantages

1. **No Authentication Issues**
   - Uses user's existing Jira browser session
   - No API tokens or credentials needed
   - Works with Intel's SSO/SAML setup

2. **Proper User Attribution**
   - Issues created by actual user (not service account)
   - User is automatically the Reporter
   - Full audit trail

3. **User Control**
   - User can review before creating
   - User can edit any field
   - User sees confirmation in Jira

4. **Simple & Reliable**
   - No complex API integration
   - No authentication failures
   - Works across all browsers

5. **No Backend Required**
   - Frontend-only implementation
   - No server credentials to manage
   - No API rate limits

### ⚠️ Trade-offs

1. **Manual Final Step**
   - User must click "Create" in Jira
   - Not fully automated

2. **Pop-up Blockers**
   - Browser may block pop-up (user can allow)

3. **Two Windows**
   - Opens new Jira tab (user can close after)

## Technical Implementation

### Jira URL Structure

```javascript
https://jira.devtools.intel.com/secure/CreateIssueDetails!init.jspa?
  pid=16990&              // CVS project ID
  issuetype=1&            // Requirement
  summary=<title>&        // Pre-filled title
  description=<desc>      // Pre-filled description
```

### Pre-filled Information

**Title:**
```
[Enable] "Llama-3-8B" model
```

**Description:**
```
Requested by: Jyoti Kumari (jyoti.kumari@intel.com)
Request Date: 2026-06-02

Model Format (PyTorch, ONNX, other): PyTorch
Model link (HuggingFace, GitHub, other): https://huggingface.co/...
Target HW platform (CPU (default), GPU, NPU): CPU
Additional requirements: ...
Additional Customer info: ...
```

## User Instructions

### For End Users

1. Go to the OpenVINO Model Resources page
2. Click the **"Request Model"** button (top-right)
3. Form will auto-fill your name and email
4. Fill in model details
5. Click **"Open in Jira"**
6. New tab opens with Jira create form
7. Review pre-filled information
8. (Optional) Add Component: "Model Enabling"
9. (Optional) Add Label: "model"
10. Click **"Create"** in Jira
11. Done! You'll see your new issue

### For Administrators

**No setup required!** 🎉

- No `.env` file needed
- No backend server needed (can remove)
- No Jira credentials to manage
- Just serve the frontend

## Simplified Architecture

```
┌─────────────────────┐
│  User's Browser     │
│  - Opens modal      │
│  - Fills form       │
│  - Clicks submit    │
└──────────┬──────────┘
           │
           │ Constructs URL
           ▼
┌─────────────────────┐
│  Jira Website       │
│  (New Tab)          │
│  - Pre-filled form  │
│  - User clicks      │
│    "Create"         │
└─────────────────────┘
```

## Comparison: API vs Direct Link

| Feature | API Approach (Original) | Direct Link (Current) |
|---------|-------------------------|----------------------|
| Authentication | ❌ Failed (Intel SSO blocks) | ✅ Uses user session |
| User Attribution | ⚠️ Service account or complex | ✅ Automatic (user's account) |
| Setup Complexity | ❌ High (backend, credentials) | ✅ None |
| Reliability | ❌ Auth errors, rate limits | ✅ Always works |
| User Experience | ✅ Fully automated | ⚠️ Requires click in Jira |
| Security | ⚠️ Service account credentials | ✅ No credentials stored |

## Files Modified

### Frontend Only

**Modified:**
- `src/components/RequestModelModal.tsx`
  - Removed API call to backend
  - Added Jira URL construction
  - Opens pre-filled Jira form in new tab

**No Longer Needed (Optional Cleanup):**
- `server/` directory (entire backend)
- `.env` file
- Backend dependencies in `package.json`

## Testing

### Test the Feature

1. **Open the app:** http://localhost:3000
2. **Click "Request Model"**
3. **Fill the form:**
   - Name: Auto-populated
   - Email: Auto-populated
   - Model Name: `Test-Llama-3-8B`
   - Model Format: `PyTorch`
   - Model Link: `https://huggingface.co/meta-llama/Llama-3-8B`
   - Target HW: `CPU`
4. **Click "Open in Jira"**
5. **Verify:**
   - ✅ New Jira tab opens
   - ✅ Summary field shows: `[Enable] "Test-Llama-3-8B" model`
   - ✅ Description shows all your information
   - ✅ You can click "Create" to create the issue

## Production Deployment

### Simple Deployment

Since this is frontend-only now:

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Serve the `dist/` folder:**
   - Any static file server (nginx, Apache, S3, etc.)
   - No backend needed!

3. **Done!** ✅

### Example: Nginx Configuration

```nginx
server {
    listen 80;
    server_name model-resources.intel.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Future Enhancements (Optional)

If Intel Jira later supports API tokens:

1. Keep the current direct link as default
2. Add option to try API creation
3. Fallback to direct link if API fails

## Notes

- **Component "Model Enabling"** and **Label "model"** may need to be added manually in Jira (depending on project settings)
- User must be logged into Jira in their browser
- Works on Intel network only (VPN required if remote)

## Conclusion

The Direct Link approach is:
- ✅ **Simpler** - No backend, no auth
- ✅ **More Reliable** - No auth failures
- ✅ **Better UX** - Proper user attribution
- ✅ **Easier to Maintain** - Frontend only

**Status:** ✅ Ready to use!
