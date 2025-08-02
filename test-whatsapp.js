// Simple test script to verify WhatsApp function works
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

async function testWhatsAppFunction() {
  try {
    console.log('Testing WhatsApp function...');
    
    const response = await fetch('http://localhost:8888/.netlify/functions/send-whatsapp-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderDetails: testOrderDetails })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ WhatsApp function test successful!');
    } else {
      console.log('❌ WhatsApp function test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Test function if running directly
if (typeof window === 'undefined') {
  testWhatsAppFunction();
}