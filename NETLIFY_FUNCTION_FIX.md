# Fix: WhatsApp Function Not Appearing in Netlify

## The Problem
Your WhatsApp function exists in the code but doesn't appear in Netlify Functions dashboard because of a configuration issue.

## Root Cause
The `functions` path in `netlify.toml` was pointing to the wrong location relative to the base directory.

## What I Fixed
1. **Updated netlify.toml**: Changed `functions = "netlify/functions"` to `functions = "../netlify/functions"`
2. **Fixed function export**: Updated the function to use proper CommonJS exports
3. **Added CORS headers**: Ensured the function can be called from your frontend

## Deploy the Fix

### Step 1: Commit and Deploy
1. Go to your Netlify dashboard
2. Go to **Deploys** → **Trigger deploy**
3. Wait for deployment to complete

### Step 2: Verify Function is Live
1. After deployment, go to **Functions** tab in Netlify dashboard
2. You should now see: `send-whatsapp-notification`
3. Click on it to see the logs

### Step 3: Test the Function
1. Place a test order on your website
2. Check browser console for detailed logs
3. Check Netlify Functions logs for execution details

## Quick Test Commands

### Test if function endpoint exists:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/send-whatsapp-notification \
  -H "Content-Type: application/json" \
  -d '{"orderDetails":{"customerName":"Test","total":"10.00","items":[]}}'
```

### Expected responses:
- **With environment variables**: WhatsApp message sent or Twilio error
- **Without environment variables**: "Missing required environment variables"
- **Function not found**: 404 error (means function still not deployed)

## Still Not Working?

### If function still doesn't appear:
1. Check build logs in Netlify for function deployment errors
2. Verify the `netlify/functions/` directory is in your repository root
3. Make sure the function file has proper Node.js syntax

### If function appears but fails:
1. Verify all 5 environment variables are set in Netlify
2. Check that your WhatsApp number is in correct format: `whatsapp:+1234567890`
3. Ensure you've joined the Twilio WhatsApp sandbox

### Environment Variables Required:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `OWNER_WHATSAPP_NUMBER`
- `ADMIN_URL`

## Updated File Structure
```
project/
├── netlify/
│   └── functions/
│       └── send-whatsapp-notification.js  ✅ Fixed export
├── client/                                 ✅ Base directory
│   ├── src/
│   └── dist/                              ✅ Publish directory
└── netlify.toml                           ✅ Fixed functions path
```

The function should now deploy correctly with your next Netlify deployment.