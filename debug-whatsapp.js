// Debug script to test WhatsApp functionality
// This simulates the Netlify function locally for testing

// Use .cjs extension approach
const { createRequire } = require('module');
const require = createRequire(import.meta.url);

const testOrderDetails = {
  customerName: "Test Customer",
  customerEmail: "test@example.com", 
  customerPhone: "+1234567890",
  total: "29.99",
  items: [
    {
      name: "Test Product",
      quantity: 1,
      price: "29.99"
    }
  ],
  shippingAddress: "Test Address",
  paymentMethod: "upi",
  orderId: "test-123"
};

// Mock environment variables for testing
process.env.TWILIO_ACCOUNT_SID = "test_account_sid";
process.env.TWILIO_AUTH_TOKEN = "test_auth_token";
process.env.TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886";
process.env.OWNER_WHATSAPP_NUMBER = "whatsapp:+1234567890";
process.env.ADMIN_URL = "https://test-site.netlify.app";

// Import the function
const fs = require('fs');
const path = require('path');

// Read the function file and evaluate it
const functionPath = path.join(__dirname, 'netlify/functions/send-whatsapp-notification.js');
const functionCode = fs.readFileSync(functionPath, 'utf8');

// Create a module context
const module = { exports: {} };
eval(functionCode);
const { handler } = module.exports;

async function testFunction() {
  console.log('🧪 Testing WhatsApp function...\n');

  // Create mock event
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ orderDetails: testOrderDetails })
  };

  const mockContext = {};

  try {
    const result = await handler(mockEvent, mockContext);
    console.log('\n📋 Function Result:');
    console.log('Status Code:', result.statusCode);
    console.log('Response:', JSON.parse(result.body));
    
    if (result.statusCode === 200) {
      console.log('\n✅ Function executed successfully!');
      console.log('Note: This was a test with mock Twilio credentials.');
      console.log('In production, you need to set up real Twilio credentials.');
    } else {
      console.log('\n❌ Function returned an error.');
      console.log('This is expected if Twilio credentials are not set up.');
    }
  } catch (error) {
    console.error('\n🚨 Function error:', error.message);
  }
}

testFunction();