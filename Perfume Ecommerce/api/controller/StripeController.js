import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeController {
  constructor() {
    this.stripe = stripe;
  }

  // Create Stripe Checkout Session
  createCheckoutSession = async (req, res) => {
    try {
      const { cartItems, name, address, totalPrice } = req.body;

      // Validate required fields
      if (!cartItems || !name || !address || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Build session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: cartItems.map(item => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.productName,
            },
            unit_amount: parseInt(item.unitPrice) * 100, // convert to paisa
          },
          quantity: item.quantity,
        })),
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/payment-cancelled`,
        metadata: {
          username: name,
          address,
          totalPrice: totalPrice.toString(),
          items: JSON.stringify(cartItems),
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Stripe Checkout Session Error:', error);
      res.status(500).json({ error: error.message });
    }
  };

  // Get session details from Stripe
getSessionDetails = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

}

export default StripeController;
