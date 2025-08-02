# WhatsApp Order Notifications Setup Guide

## Overview
This guide will help you set up WhatsApp notifications for new orders using Twilio's WhatsApp API and Netlify Functions. When a customer places an order, you'll automatically receive a WhatsApp message with order details.

## Prerequisites
- Netlify account with your website deployed
- Twilio account (free tier available)
- WhatsApp account with the phone number you want to receive notifications

## Step 1: Set Up Twilio WhatsApp Sandbox

### 1.1 Create Twilio Account
1. Go to [Twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Verify your phone number

### 1.2 Access WhatsApp Sandbox
1. In your Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. You'll see a sandbox number like `+1 415 523 8886`
3. You'll also see a unique code like `join <your-code>`

### 1.3 Connect Your WhatsApp
1. Open WhatsApp on your phone
2. Send a message to the Twilio sandbox number (`+1 415 523 8886`)
3. Send the exact message: `join <your-code>` (replace with your actual code)
4. You should receive a confirmation message

## Step 2: Get Twilio Credentials

### 2.1 Find Your Credentials
1. In Twilio Console, go to **Account** > **API keys & tokens**
2. Copy these values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)

### 2.2 Note Your Phone Number Format
- Your WhatsApp number should be in format: `whatsapp:+1234567890`
- Include country code but no spaces or special characters
- Example: If your number is +1 (555) 123-4567, format it as `whatsapp:+15551234567`

## Step 3: Configure Netlify Environment Variables

### 3.1 Access Netlify Dashboard
1. Go to your Netlify dashboard
2. Select your deployed site
3. Go to **Site settings** > **Environment variables**

### 3.2 Add Required Variables
Add these environment variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `TWILIO_ACCOUNT_SID` | `AC1234567890abcdef...` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | `your_auth_token_here` | Your Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` | Twilio sandbox WhatsApp number |
| `OWNER_WHATSAPP_NUMBER` | `whatsapp:+15551234567` | Your WhatsApp number (where notifications go) |
| `ADMIN_URL` | `https://your-site.netlify.app` | Your website URL for admin links |

### 3.3 Save and Deploy
1. Click **Save** after adding all variables
2. Go to **Deploys** tab
3. Click **Trigger deploy** to rebuild with new environment variables

## Step 4: Test the Integration

### 4.1 Place a Test Order
1. Go to your website
2. Add items to cart
3. Go through checkout process
4. Complete an order

### 4.2 Check WhatsApp
You should receive a message like:
```
🔔 NEW ORDER RECEIVED!

📋 Order Details:
• Customer: John Doe
• Email: john@example.com
• Phone: +1234567890
• Total: $49.99

📦 Items:
• Custom Phone Case (Qty: 1) - $24.99
• Desk Organizer (Qty: 2) - $12.50

📍 Shipping Address:
John Doe

🔗 Click here to view full details: https://your-site.netlify.app/admin

Time: 1/2/2025, 6:30:00 PM
```

## Step 5: Troubleshooting

### 5.1 Check Netlify Function Logs
1. Go to Netlify Dashboard > **Functions**
2. Click on `send-whatsapp-notification`
3. Check the logs for any errors

### 5.2 Common Issues

**Issue**: "WhatsApp notification failed"
- **Solution**: Check if you've joined the Twilio sandbox with your WhatsApp number
- Verify all environment variables are set correctly

**Issue**: "Missing required environment variables"
- **Solution**: Ensure all 5 environment variables are added to Netlify
- Redeploy the site after adding variables

**Issue**: "Twilio API error"
- **Solution**: Verify your Twilio credentials are correct
- Check if your Twilio account is active

**Issue**: "Function not found"
- **Solution**: Ensure the `netlify/functions` folder is deployed
- Check that `functions = "netlify/functions"` is in netlify.toml

### 5.3 Testing Environment Variables
You can test if variables are properly set by checking the function logs in Netlify dashboard.

## Step 6: Upgrading to Production WhatsApp API (Optional)

The sandbox is great for testing, but for production use:

1. **Apply for WhatsApp Business API** through Twilio
2. **Verify your business** with Meta/WhatsApp
3. **Get approved** for production use
4. **Update** the `TWILIO_WHATSAPP_FROM` variable with your approved business number

## Security Notes

- Keep your Twilio credentials secure
- Never commit them to your code repository
- Use Netlify's environment variables only
- Regularly rotate your auth tokens

## Cost Information

- **Twilio Sandbox**: Free for testing
- **Production WhatsApp Messages**: ~$0.005 per message
- **Netlify Functions**: 125K invocations free per month

## Support

If you encounter issues:
1. Check Twilio Console logs
2. Check Netlify Function logs
3. Verify WhatsApp sandbox connection
4. Test with a simple message first

## Files Modified

This integration added/modified:
- `netlify/functions/send-whatsapp-notification.js` - Serverless function
- `client/src/pages/checkout.tsx` - Order placement with notification
- `netlify.toml` - Functions configuration
- `WHATSAPP_SETUP_GUIDE.md` - This setup guide

The integration is fully serverless and maintains your static deployment architecture.