# Free Email Notifications Setup Guide

This guide shows you how to set up completely free email notifications for customer orders using EmailJS. No server required - works perfectly with Netlify static deployment!

## 🆓 Why EmailJS is Perfect for This Project

- **100% Free** for up to 200 emails/month
- **No Server Required** - works with static sites on Netlify
- **Direct Browser Sending** - no backend needed
- **Multiple Email Templates** - for different order statuses
- **Easy Integration** - just environment variables

## 📧 Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## 🔧 Step 2: Set Up Email Service

1. **Add Email Service:**
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow the connection steps

2. **Gmail Setup (Recommended):**
   - Choose "Gmail" as your service
   - Connect your Gmail account
   - Note down the **Service ID** (looks like `service_xxxxxxx`)

## 📝 Step 3: Create Email Template

1. **Go to Email Templates:**
   - Click "Email Templates" in the dashboard
   - Click "Create New Template"

2. **Template Content:**
   ```html
   Subject: {{subject}}
   
   From: {{from_name}} <noreply@trinketsandthings.com>
   To: {{to_email}}
   
   {{message}}
   
   ---
   This is an automated email from Trinkets and Things.
   ```

3. **Template Variables:**
   - `{{to_email}}` - Customer email
   - `{{customer_name}}` - Customer name
   - `{{order_id}}` - Order ID
   - `{{order_items}}` - List of items
   - `{{order_total}}` - Total amount
   - `{{subject}}` - Email subject
   - `{{message}}` - Main email content

4. **Save Template:**
   - Save the template
   - Note down the **Template ID** (looks like `template_xxxxxxx`)

## 🔑 Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (looks like `xxxxxxxxxxxxxxxxx`)
3. Keep this key safe

## 🌐 Step 5: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard:**
   - Open your site in Netlify
   - Go to "Site settings" → "Environment variables"

2. **Add These Variables:**
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
   ```

3. **Deploy:**
   - Redeploy your site for changes to take effect

## ✅ Step 6: Test Email Notifications

1. **Place a Test Order:**
   - Go to your website
   - Add items to cart
   - Complete checkout process

2. **Check Results:**
   - Customer should receive email confirmation
   - Check EmailJS dashboard for delivery status
   - Check spam folder if not received

## 📊 How It Works

### Order Flow with Emails:
1. **Order Placed** → Email: "Order Confirmation"
2. **Order Confirmed** → Email: "Order Confirmed" 
3. **Order Shipped** → Email: "Order Shipped"

### Admin Actions (Future Feature):
- Add buttons in admin panel to send "confirmed" and "shipped" emails
- Each email has different content and tracking information

## 🔧 Email Content Examples

### Order Placed Email:
```
Subject: Order Confirmation - Trinkets and Things

Dear [Customer Name],

Thank you for your order! We've received your order and are processing it.

Order Details:
Order ID: #12345
Items: Mystery Box Starter (Qty: 1) - ₹299
Total: ₹299

We'll send you another email once your order is confirmed and ready for shipping.

Best regards,
Trinkets and Things Team
```

### Order Shipped Email:
```
Subject: Order Shipped - Trinkets and Things

Dear [Customer Name],

Your order is on its way!

Order Details:
Order ID: #12345
Tracking Number: [If available]

You can expect delivery within 3-5 business days.

Best regards,
Trinkets and Things Team
```

## 🚀 Advanced Features (Optional)

### Multiple Templates:
- Create separate templates for each order status
- Use different template IDs based on order status

### Email Styling:
- Add HTML styling to your EmailJS templates
- Include your logo and brand colors
- Make emails look professional

### Tracking Integration:
- Add tracking numbers to shipped emails
- Include delivery estimates
- Link to tracking pages

## 💡 Tips for Success

1. **Test Thoroughly:**
   - Use your own email for testing
   - Check all order statuses work
   - Verify formatting looks good

2. **Monitor Usage:**
   - EmailJS free plan: 200 emails/month
   - Monitor usage in dashboard
   - Upgrade if needed (still very affordable)

3. **Backup Plan:**
   - Keep WhatsApp notifications as backup
   - Both systems work independently
   - Customer gets multiple confirmations

## 🔍 Troubleshooting

### Emails Not Sending:
- Check environment variables are correct
- Verify EmailJS service is active
- Check browser console for errors

### Emails in Spam:
- Use your own domain email as sender
- Add proper from/reply-to addresses
- Ask customers to whitelist your email

### Template Issues:
- Test templates in EmailJS dashboard
- Check all variable names match
- Verify HTML formatting

## 🎯 Why This Setup Is Perfect

✅ **Free** - No monthly fees for basic usage  
✅ **Serverless** - Works with Netlify static hosting  
✅ **Reliable** - EmailJS handles delivery  
✅ **Professional** - Branded email notifications  
✅ **Scalable** - Easy to upgrade when needed  

Your customers will love getting professional order confirmations, and you'll love that it's completely free and automated!