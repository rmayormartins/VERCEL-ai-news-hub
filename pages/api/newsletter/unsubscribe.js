// pages/api/newsletter/unsubscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // Here you would integrate with your email service to remove the email
    // For example: SendGrid, Mailchimp, ConvertKit, etc.
    
    // For now, just log the unsubscription
    console.log('Email unsubscribed:', email, new Date().toISOString());
    
    // In production, you might want to:
    // 1. Remove from database
    // 2. Remove from mailing list service
    // 3. Send confirmation email
    
    res.status(200).json({ 
      message: 'Successfully unsubscribed from newsletter',
      email: email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error unsubscribing email:', error);
    res.status(500).json({ message: 'Error unsubscribing from newsletter' });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
