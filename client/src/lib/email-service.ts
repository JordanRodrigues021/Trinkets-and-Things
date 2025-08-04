import emailjs from '@emailjs/browser';

// EmailJS configuration - these will be environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface EmailData {
  to_email: string;
  customer_name: string;
  order_id: string;
  order_items: string;
  order_total: string;
  order_status: 'placed' | 'confirmed' | 'shipped';
  tracking_number?: string;
}

export const sendOrderEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Check if EmailJS is configured
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn('EmailJS not configured. Email notifications disabled.');
      return false;
    }

    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    // Prepare email template parameters
    const templateParams = {
      to_email: data.to_email,
      customer_name: data.customer_name,
      order_id: data.order_id,
      order_items: data.order_items,
      order_total: data.order_total,
      order_status: data.order_status,
      tracking_number: data.tracking_number || '',
      subject: getEmailSubject(data.order_status),
      message: getEmailMessage(data),
    };

    // Send email
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

const getEmailSubject = (status: string): string => {
  switch (status) {
    case 'placed':
      return 'Order Confirmation - Trinkets and Things';
    case 'confirmed':
      return 'Order Confirmed - Trinkets and Things';
    case 'shipped':
      return 'Order Shipped - Trinkets and Things';
    default:
      return 'Order Update - Trinkets and Things';
  }
};

const getEmailMessage = (data: EmailData): string => {
  const { order_status, customer_name, order_id, order_items, order_total, tracking_number } = data;
  
  switch (order_status) {
    case 'placed':
      return `
Dear ${customer_name},

Thank you for your order! We've received your order and are processing it.

Order Details:
Order ID: ${order_id}
Items: ${order_items}
Total: ₹${order_total}

We'll send you another email once your order is confirmed and ready for shipping.

Best regards,
Trinkets and Things Team
      `;
    
    case 'confirmed':
      return `
Dear ${customer_name},

Great news! Your order has been confirmed and is being prepared for shipping.

Order Details:
Order ID: ${order_id}
Items: ${order_items}
Total: ₹${order_total}

Your order will be shipped within 1-2 business days. We'll notify you with tracking information once it's on its way.

Best regards,
Trinkets and Things Team
      `;
    
    case 'shipped':
      return `
Dear ${customer_name},

Your order is on its way! 

Order Details:
Order ID: ${order_id}
Items: ${order_items}
Total: ₹${order_total}
${tracking_number ? `Tracking Number: ${tracking_number}` : ''}

You can expect delivery within 3-5 business days. Thank you for choosing Trinkets and Things!

Best regards,
Trinkets and Things Team
      `;
    
    default:
      return `
Dear ${customer_name},

Your order #${order_id} has been updated.

Best regards,
Trinkets and Things Team
      `;
  }
};

// Helper function to extract cart items for email
export const formatCartItemsForEmail = (cartItems: any[]): string => {
  return cartItems
    .map(item => `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');
};

// Helper function to calculate total
export const calculateCartTotal = (cartItems: any[]): string => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return total.toString();
};