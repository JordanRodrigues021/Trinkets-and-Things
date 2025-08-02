// Debug script to test WhatsApp functionality in CommonJS format

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

// Mock environment variables for testing (these will show missing vars error)
// Comment these out to test environment variable detection
// process.env.TWILIO_ACCOUNT_SID = "test_account_sid";
// process.env.TWILIO_AUTH_TOKEN = "test_auth_token";
// process.env.TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886";
// process.env.OWNER_WHATSAPP_NUMBER = "whatsapp:+1234567890";
// process.env.ADMIN_URL = "https://test-site.netlify.app";

// Load the function
const fs = require('fs');
const path = require('path');

async function testFunction() {
  console.log('🧪 Testing WhatsApp function...\n');

  try {
    // Load function code
    const functionPath = path.join(__dirname, 'netlify/functions/send-whatsapp-notification.js');
    const functionCode = fs.readFileSync(functionPath, 'utf8');
    
    // Create mock exports object
    const exports = {};
    
    // Execute the function code in context
    eval(functionCode);
    
    // Create mock event
    const mockEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({ orderDetails: testOrderDetails })
    };

    const mockContext = {};

    console.log('📋 Testing with mock event...');
    const result = await exports.handler(mockEvent, mockContext);
    
    console.log('\n📋 Function Result:');
    console.log('Status Code:', result.statusCode);
    
    try {
      const responseBody = JSON.parse(result.body);
      console.log('Response:', responseBody);
    } catch (e) {
      console.log('Response (raw):', result.body);
    }
    
    if (result.statusCode === 200) {
      console.log('\n✅ Function executed successfully!');
    } else if (result.statusCode === 500) {
      console.log('\n⚠️ Function returned error (expected without proper environment variables)');
    } else {
      console.log('\n❓ Unexpected status code');
    }
    
  } catch (error) {
    console.error('\n🚨 Function error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFunction();