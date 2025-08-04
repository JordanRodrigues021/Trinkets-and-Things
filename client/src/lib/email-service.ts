import emailjs from '@emailjs/browser';

// EmailJS configuration - these will be environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ORDER_PLACED = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER_PLACED;
const TEMPLATE_ORDER_CONFIRMED = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER_CONFIRMED;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface EmailData {
  to_email: string;
  customer_name: string;
  order_id: string;
  order_items: string;
  order_total: string;
  order_status: 'placed' | 'confirmed';
}

export const sendOrderEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Get the correct template ID based on order status
    const templateId = getTemplateId(data.order_status);
    
    // Check if EmailJS is configured
    if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
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
    };

    // Send email using the correct template
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

const getTemplateId = (status: string): string | null => {
  switch (status) {
    case 'placed':
      return TEMPLATE_ORDER_PLACED;
    case 'confirmed':
      return TEMPLATE_ORDER_CONFIRMED;
    default:
      return TEMPLATE_ORDER_PLACED; // fallback to order placed template
  }
};

// Helper function to extract cart items for email
export const formatCartItemsForEmail = (cartItems: any[]): string => {
  return cartItems
    .map(item => `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');
};

