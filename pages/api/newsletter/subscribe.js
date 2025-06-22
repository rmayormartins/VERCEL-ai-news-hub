// pages/api/newsletter/subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // Here you would integrate with your email service
    // For example: SendGrid, Mailchimp, ConvertKit, etc.
    
    // For now, just log the subscription
    console.log('Email subscribed:', email, new Date().toISOString());
    
    // In production, you might want to:
    // 1. Save to database
    // 2. Send welcome email
    // 3. Add to mailing list service
    
    res.status(200).json({ 
      message: 'Successfully subscribed to newsletter',
      email: email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error subscribing email:', error);
    res.status(500).json({ message: 'Error subscribing to newsletter' });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
