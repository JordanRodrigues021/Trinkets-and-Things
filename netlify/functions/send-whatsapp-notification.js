exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { orderDetails } = JSON.parse(event.body);
    
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'
    const toWhatsApp = process.env.OWNER_WHATSAPP_NUMBER; // Your WhatsApp number

    if (!accountSid || !authToken || !fromWhatsApp || !toWhatsApp) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing required environment variables' })
      };
    }

    // Format the order message
    const message = `🔔 NEW ORDER RECEIVED!

📋 Order Details:
• Customer: ${orderDetails.customerName}
• Email: ${orderDetails.customerEmail}
• Phone: ${orderDetails.customerPhone || 'Not provided'}
• Total: $${orderDetails.total}

📦 Items:
${orderDetails.items.map(item => `• ${item.name} (Qty: ${item.quantity}) - $${item.price}`).join('\n')}

📍 Shipping Address:
${orderDetails.shippingAddress}

🔗 Click here to view full details: ${process.env.ADMIN_URL || 'https://your-site.netlify.app'}/admin

Time: ${new Date().toLocaleString()}`;

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: fromWhatsApp,
        To: toWhatsApp,
        Body: message
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('WhatsApp notification sent successfully:', result.sid);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST'
        },
        body: JSON.stringify({ 
          success: true, 
          messageId: result.sid,
          message: 'WhatsApp notification sent successfully' 
        })
      };
    } else {
      console.error('Twilio API error:', result);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to send WhatsApp message',
          details: result.message 
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};